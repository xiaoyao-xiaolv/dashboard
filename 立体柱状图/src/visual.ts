import '../style/visual.less';
import * as echarts from 'echarts';

export default class Visual extends WynVisual {

    private myEcharts: any;
    private selectionManager: any;
    private host: any;
    private format1: any;
    private format2: any;
    private selectionIds: any;
    private dom: any;
    private items: any;
    private isMock: boolean;
    private options: any;
    static mockItems = {
        xdata: ['01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-07'],
        rateData: [90, 92, 98, 88, 96, 97, 94],
        disinfeced: [150, 320, 300, 210, 240, 180, 288],
        placeData: [320, 435, 490, 340, 320, 270, 360]
    }


    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.selectionIds = [];
        this.host = host;
        this.dom = dom;
        this.selectionManager = host.selectionService.createSelectionManager();
        this.myEcharts = echarts.init(dom);
        this.selectEvent();
    }

    private selectEvent() {
        this.dom.addEventListener("click", () => {
            this.selectionManager.clear();
            this.host.toolTipService.hide();
            this.host.contextMenuService.hide();
            return;
        })

        this.myEcharts.on('click', (params) => {

            this.host.contextMenuService.hide();
            params.event.event.stopPropagation();
            if (params.event.event.button == 0) {
                //鼠标左键功能
                let leftMouseButton = this.options.leftMouseButton;
                const sid = this.selectionIds[params.dataIndex];
                switch (leftMouseButton) {
                    //鼠标联动设置    
                    case "none": {
                        if (this.selectionManager.contains(sid)) {
                            this.selectionManager.clear(sid)
                        } else {
                            if (this.options.onlySelect) {
                                this.selectionManager.clear();
                            }
                            this.selectionManager.select(sid, true);
                        }
                        if (this.selectionManager.selected.length == this.selectionIds.length) {
                            this.selectionManager.clear();
                        }
                        break;
                    }
                    case "showToolTip": {
                        this.showTooltip(params, true);
                        break;
                    }
                    default: {
                        this.host.commandService.execute([{
                            name: leftMouseButton,
                            payload: {
                                selectionIds: sid,
                                position: {
                                    x: params.event.event.x,
                                    y: params.event.event.y,
                                },
                            }
                        }])
                    }
                }
            }
        })

        this.myEcharts.on('mouseup', (params) => {
            if (params.event.event.button === 2) {
                document.oncontextmenu = function () { return false; };
                params.event.event.preventDefault();
                this.host.contextMenuService.show({
                    position: {
                        x: params.event.event.x,
                        y: params.event.event.y,
                    }
                })
                return;
            } else {
                this.host.contextMenuService.hide();
            }
        })
    }

    public onResize() {
        this.myEcharts.resize();
        this.render();
    }

    public update(options: VisualNS.IVisualUpdateOptions) {
        this.isMock = true;

        this.items = {
            series: [],
            actualValue: [],
            reducedValue: [],
            lineValue: [],
            legend: []
        };
        const dataView = options.dataViews[0] && options.dataViews[0].plain;
        if (dataView) {

            const seriesDisplay = dataView.profile.series.values[0].display;
            const actualValueDisplay = dataView.profile.actualValue.values[0].display;
            this.items.legend.push(actualValueDisplay);
            let reducedValueDisplay;
            let lineValueDisplay
            if (dataView.profile.reducedValue.values.length != 0) {
                reducedValueDisplay = dataView.profile.reducedValue.values[0].display;
                this.items.legend.push(reducedValueDisplay);
            }
            if (dataView.profile.lineValue.values.length != 0) {
                lineValueDisplay = dataView.profile.reducedValue.values[0].display;
                this.items.legend.push(lineValueDisplay)
            }
            this.format1 = options.dataViews[0].plain.profile.actualValue.values[0].format;
            if (options.dataViews[0].plain.profile.lineValue.values.length != 0) {
                this.format2 = options.dataViews[0].plain.profile.lineValue.values[0].format;
            }
            this.isMock = false
            dataView.data.forEach((data) => {
                const selectionId = this.host.selectionService.createSelectionId();
                selectionId.withDimension(dataView.profile.series.values[0], data);
                this.selectionIds.push(selectionId)

                this.items.series.push(data[seriesDisplay])
                this.items.actualValue.push(data[actualValueDisplay])
                if (reducedValueDisplay) {
                    this.items.reducedValue.push(data[reducedValueDisplay])
                }
                if (lineValueDisplay) {
                    this.items.lineValue.push(data[lineValueDisplay])
                }
            })
        }
        this.options = options.properties;
        this.render();
    }

    public render() {
        this.myEcharts.clear();
        let symbolOffset = -10 - (this.options.tilt / 2)
        let symbolSize = 20 + this.options.tilt
        console.log(this.options)

        const orient = this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? 'vertical' : 'horizontal';
        const legend = {
            data: this.isMock ? ['场所数', '已消杀', '完成率'] : this.items.legend,
            left: this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? this.options.legendPosition : this.options.legendVerticalPosition,
            top: this.options.legendPosition === 'top' || this.options.legendPosition === 'bottom' ? this.options.legendPosition : this.options.legendHorizontalPosition,
            width: this.options.legendArea === 'custom' ? `${this.options.legendWidth}%` : 'auto',
            height: this.options.legendArea === 'custom' ? `${this.options.legendHeight}%` : 'auto',
            orient: orient,
            show: this.options.showLegend,
            itemGap: this.options.itemGap,
            icon: this.options.legendIcon,
            textStyle: {
                color: this.options.legendTextStyle.color,
                fontFamily: this.options.legendTextStyle.fontFamily,
                fontSize: this.options.legendTextStyle.fontSize.replace("pt", ""),
                fontStyle: this.options.legendTextStyle.fontStyle,
                fontWeight: this.options.legendTextStyle.fontWeight,
            },
            itemWidth: 25,
            itemHeight: 15,
        }
        const grid = { top: '10%', left: '10%', right: '3%', bottom: '15%' }
        // xAxis
        const xAxis = {
            show: this.options.showClassification,
            axisTick: { show: this.options.showClassificationSign },
            axisLine: { show: this.options.showClassificationLine, lineStyle: { color: 'rgba(255,255,255, .2)' } },
            axisLabel: {
                hideOverlap: this.options.classificationLabelBeyond == "hide" ? true : false,
                overflow: this.options.classificationLabelBeyond != "hide" ? this.options.classificationLabelBeyond : 'none',
                rotate: this.options.classificationLabelDirection,
                show: this.options.showClassificationLabel,
                color: this.options.classificationLabelTextStyle.color,
                fontFamily: this.options.classificationLabelTextStyle.fontFamily,
                fontSize: this.options.classificationLabelTextStyle.fontSize,
                fontStyle: this.options.classificationLabelTextStyle.fontStyle,
                fontWeight: this.options.classificationLabelTextStyle.fontWeight,
            },
            data: this.isMock ? Visual.mockItems.xdata : this.items.series
        }

        // yAxis
        // 双y轴
        const yAxis = [{
            show: this.options.showValue,
            min: this.options.showValueDetailed ? this.options.showValueMin : 0,
            max: !this.options.showValueDetailed ? Math.ceil(this.items.maxValue / 100) * 100 : this.options.showValueMax,
            interval: this.options.showValueDetailed ? this.options.showValueInterval : null,
            splitLine: { lineStyle: { color: 'rgba(255,255,255, .05)' } },
            axisLine: {
                show: this.options.showValueLine
            },
            axisLabel: {
                show: this.options.showValueLabel,
                rotate: this.options.valueLabelDirection,
                color: this.options.valueLabelTextStyle.color,
                fontFamily: this.options.valueLabelTextStyle.fontFamily,
                fontSize: this.options.valueLabelTextStyle.fontSize,
                fontStyle: this.options.valueLabelTextStyle.fontStyle,
                fontWeight: this.options.valueLabelTextStyle.fontWeight
            },
            axisTick: {
                show: this.options.showValueSign
            }
        }, {
            name: this.items.legend[1],
            show: false
        }
        ]

        // series
        let series = [
            {
                z: 12,
                name: '上部',
                type: 'pictorialBar',
                symbol: this.options.funnelStyle,
                label: {
                    normal: {
                        show: this.options.showLftLabel,
                        distance: this.options.actualLabelY,
                        position: 'top',
                        align: this.options.acturalFar,
                        color: this.options.actualLaberTextStyle.color,
                        fontFamily: this.options.actualLaberTextStyle.fontFamily,
                        fontSize: this.options.actualLaberTextStyle.fontSize.replace("pt", ""),
                        fontStyle: this.options.actualLaberTextStyle.fontStyle,
                        fontWeight: this.options.actualLaberTextStyle.fontWeight,
                        formatter: (data) => {
                            let result = "";
                            if (this.options.showLabelName) {
                                result = result + data.name + ": "
                            }
                            return result + this.formatData(data.data, this.format1)
                        }
                    }
                },
                symbolPosition: 'end',
                data: this.isMock ? Visual.mockItems.placeData : this.items.actualValue,
                // symbol : 'diamond',
                symbolOffset: [0, symbolOffset],
                symbolSize: [30, symbolSize],
                itemStyle: {
                    color: this.options.leftValueColor,
                    opacity: this.isMock ? .4 : .6
                },
            },
            {
                z: 12,
                name: '中部',
                type: 'pictorialBar',
                symbol: this.options.funnelStyle,
                label: {
                    normal: {
                        show: this.options.showLftLabel,
                        distance: this.options.reducedLabelY,
                        position: 'top',
                        align: this.options.reducedFar,
                        color: this.options.reducedLaberTextStyle.color,
                        fontFamily: this.options.reducedLaberTextStyle.fontFamily,
                        fontSize: this.options.reducedLaberTextStyle.fontSize.replace("pt", ""),
                        fontStyle: this.options.reducedLaberTextStyle.fontStyle,
                        fontWeight: this.options.reducedLaberTextStyle.fontWeight,
                        formatter: (data) => {
                            let result = "";
                            if (this.options.showLabelName) {
                                result = result + data.name + ": "
                            }
                            return result + this.formatData(data.data, this.format1)
                        }
                    }
                },
                symbolPosition: 'end',
                data: this.isMock ? Visual.mockItems.disinfeced : this.items.reducedValue,
                // symbol : 'diamond',
                symbolOffset: [0, symbolOffset],
                symbolSize: [30, symbolSize],
                itemStyle: {
                    color: this.options.leftValueColor,
                    opacity: this.isMock ? .4 : .9
                },
            },
            {
                z: 1,
                name: '底部',
                type: 'pictorialBar',
                symbol: this.options.funnelStyle,
                data: () => {
                    let data = [];
                    for (let i = 0; i < this.items.actualValue.length; i++) {
                        data.push(1)
                    }
                    return data
                },
                // symbol: 'diamond',
                symbolOffset: [0, symbolOffset],
                symbolSize: [30, symbolSize],
                itemStyle: {
                    color: this.options.leftValueColor,
                    opacity: this.isMock ? .4 : .9,
                },
            },
            {
                z: 2,
                type: 'bar',
                name: '场所数',
                barGap: '-100%',
                barWidth: 30,
                verticalAlign: "top",
                data: this.isMock ? Visual.mockItems.placeData : this.items.actualValue,
                itemStyle: {
                    color: {
                        // type: 'linear',
                        // x: 0, x2: 1, y: 0, y2: 0,
                        colorStops: this.options.funnelStyle == "circle" ? [{ offset: 1, color: this.options.leftValueColor + "00" }, { offset: 0, color: this.options.leftValueColor + "FF" }] : [{ offset: 0, color: this.options.leftValueColor + "1A" }, { offset: 0.5, color: this.options.leftValueColor + "33" }, { offset: 0.5, color: this.options.leftValueColor + "B3" }, { offset: 1, color: this.options.leftValueColor + "33" }]
                    },
                    opacity: this.isMock ? .1 : this.options.actualTransparency / 100,
                },
            }
            , {
                z: 2,
                type: 'bar',
                name: '已消杀',
                barWidth: 30,
                // barGap: '-100%',
                data: this.isMock ? Visual.mockItems.disinfeced : this.items.reducedValue,
                itemStyle: {
                    color: this.options.leftValueColor,
                    opacity: this.isMock ? .3 : this.options.reducedTransparency / 100,
                },
            },
            {
                z: 1,
                // 双y轴
                yAxisIndex: 1,
                name: '完成率',
                type: 'line',
                symbol: 'circle',
                symbolSize: [20, 20],
                color: {
                    type: 'linear',
                    colorStops: [{ offset: 0, color: this.options.rightValueColor }, { offset: 1, color: '#fff5cc' }],
                    global: false, // 缺省为 false
                    opacity: this.isMock ? .5 : 1
                },
                lineStyle: {
                    color: {
                        type: 'linear',
                        colorStops: [{ offset: 0, color: this.options.rightValueColor }, { offset: 1, color: '#fff5cc' }],
                        global: false // 缺省为 false
                    }
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(
                        // 右/下/左/上
                        0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(255, 209, 26, .2)' },
                        { offset: 1, color: 'transparent' }
                    ])
                },
                label: {
                    show: this.options.showRightLabel,
                    formatter: (params) => {
                        return this.formatData(params.data, this.format2)
                    },
                    textStyle: { fontSize: 16, color: '#ffd11a' }
                },
                data: this.isMock ? Visual.mockItems.rateData : this.items.lineValue
            },
        ]
        let seriesStatus = this.items.legend.map((status) => {
            return {
                type: 'bar',
                name: status,
            }
        });
        [].unshift.apply(series, seriesStatus);
        var option = {
            xAxis,
            yAxis,
            grid,
            legend,
            series,
        }
        this.myEcharts.setOption(option);
    }

    public onDestroy(): void {

    }

    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        this.options = options.properties;

        let hiddenOptions: Array<string> = [''];

        if (!this.options.showLftLabel) {
            hiddenOptions = hiddenOptions.concat(['showLabelName', 'actualLabelY', 'acturalFar', 'reducedLabelY', 'reducedFar', 'actualLaberTextStyle', 'reducedLaberTextStyle']);
        }
        if (!this.options.showLegend) {
            hiddenOptions = hiddenOptions.concat(['itemGap', 'legendIcon', 'legendPosition', 'legendHorizontalPosition', 'legendVerticalPosition', 'legendArea', 'legendWidth', 'legendHeight', 'legendTextStyle']);
        }
        if (this.options.legendPosition === 'left' || this.options.legendPosition === 'right') {
            hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
        } else {
            hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
        }
        if (this.options.legendArea === 'auto') {
            hiddenOptions = hiddenOptions.concat(['legendWidth', 'legendHeight']);
        }
        if (!this.options.showValueDetailed) {
            hiddenOptions = hiddenOptions.concat(['showValueMin', 'showValueMax', 'showValueInterval']);
        }
        if (!this.options.showValue) {
            hiddenOptions = hiddenOptions.concat(['showValueDetailed', 'showValueMin', 'showValueMax', 'showValueInterval', 'showValueLine', 'showValueLabel', 'showValueSign', 'showValueTitle', 'valueLabelDirection', 'valueLabelTextStyle']);
        }
        if (!this.options.showClassification) {
            hiddenOptions = hiddenOptions.concat(['showClassificationAll', 'showClassificationLine', 'showClassificationLabel', 'showClassificationSign', 'showClassificationTitle', 'classificationLabelDirection', 'classificationLabelBeyond', 'classificationLabelTextStyle']);
        }
        return hiddenOptions;
    }

    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        return null;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        return null;
    }

    private showTooltip(params, asModel = false) {
        if (asModel)
            this.host.toolTipService.show({
                position: {
                    x: params.event.event.x,
                    y: params.event.event.y,
                },

                fields: [{
                    label: params.name,
                    value: params.data,
                }],
                selected: this.selectionManager.getSelectionIds(),
                menu: true,
            }, 10);
    }

    //数据格式
    private formatData(number, format) {
        const formatService = this.host.formatService;
        let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
        return formatService.format(format, number, realDisplayUnit);
    }

    private getColors(index, position: number) {
        let backgroundColor = ''
        const pieColor: [{
            colorStops: [] | any
        }] = this.options.pallet && this.options.pallet || [];
        if (index < pieColor.length) {
            backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
        } else {
            backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
                ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
                : pieColor[index % (pieColor.length)]
        }
        return backgroundColor
    }
}