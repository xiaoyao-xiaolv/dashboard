import '../style/visual.less';
import * as echarts from 'echarts';
import 'echarts-gl'

export default class Visual extends WynVisual {

    private host: any;
    private selectionManager: any;
    private selectionIds: any;
    private format: any;
    private myEcharts: any;
    private items: any;
    private options: any;
    private hoveredIndex: any;

    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.host = host;
        this.selectionIds = [];
        this.selectionManager = host.selectionService.createSelectionManager();
        this.myEcharts = echarts.init(dom);
        this.selectEvent();
    }

    public selectEvent() {


        //鼠标左键
        this.myEcharts.on('click', (params) => {
            this.host.contextMenuService.hide();
            params.event.event.stopPropagation();
            if (params.event.event.button == 0) {
                //鼠标左键功能
                let leftMouseButton = this.options.leftMouseButton;
                const sid = this.selectionIds[params.seriesIndex];
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
                        if (this.selectionManager.selected.length == this.items.series.length) {
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
        });

        //tooltip	跳转保留等	鼠标起来
        this.myEcharts.on('mouseup', (params) => {
            if (params.event.event.button === 2) {
                document.oncontextmenu = function () { return false; };
                params.event.event.preventDefault();
                this.host.contextMenuService.show({
                    position: {								//跳转的selectionsId(左键需要)
                        x: params.event.event.x,
                        y: params.event.event.y,
                    }
                })
                return;
            } else {
                this.host.contextMenuService.hide();
            }
        })

        this.myEcharts.on('mouseover', (params) => {
            if (this.hoveredIndex == params.seriesName) {
                return;
            }
            else{
                this.hoveredIndex = params.seriesName
                this.render()
            }
        })

        this.myEcharts.on('globalout', (params) => {
            this.hoveredIndex = '';
            this.render()
        })


    }

    public update(options: VisualNS.IVisualUpdateOptions) {
        this.items = {
            series: [],
            value: [],
            data: []
        };

        const dataView = options.dataViews[0] && options.dataViews[0].plain;
        if (dataView) {
            this.format = options.dataViews[0].plain.profile.value.values[0].format;
            this.items.data = dataView.data
            const seriesDisplay = dataView.profile.series.values[0].display;
            const valueDisplay = dataView.profile.value.values[0].display;

            // this.isMock = false
            dataView.data.forEach((data) => {
                const selectionId = this.host.selectionService.createSelectionId();
                selectionId.withDimension(dataView.profile.series.values[0], data);
                this.selectionIds.push(selectionId)
                this.items.series.push(data[seriesDisplay])
                this.items.value.push(data[valueDisplay])
            })
        }
        this.options = options.properties;
        this.render();
    }



    public render() {
        let pie3DData = [];
        for (let i = 0; i < this.items.data.length; i++) {
            let data = {
                name: this.items.series[i],
                value: this.items.value[i],
                itemStyle: {
                    color: this.getColors(this.options.Color, i, 0),
                    opacity: this.options.opacity / 100
                }
            }
            pie3DData.push(data)
        }
        let distance = 400-this.options.distance
        distance = distance - (this.options.internal*1.5) 
        let option = this.getPie3D(pie3DData, this.options.internal/100,distance);


        this.myEcharts.setOption(option);
    }

 

    public onDestroy(): void {

    }

    public onResize() {
        this.myEcharts.resize();
        this.render();
    }



    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        this.options = options.properties;

        let hiddenOptions: Array<string> = [''];

        if (!this.options.Automatic) {
            hiddenOptions = hiddenOptions.concat(['AutomaticStyle', 'autoRotateSpeed']);
        }
        if (this.options.Automatic) {
            hiddenOptions = hiddenOptions.concat(['alpha', 'beta']);
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
        return hiddenOptions;
    }

    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        return null;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        return null;
    }

    // 生成扇形的曲面参数方程，用于 series-surface.parametricEquation
    public getParametricEquation(startRatio, endRatio, isSelected, isHovered, k, h) {
        // 计算
        let midRatio = (startRatio + endRatio) / 2;

        let startRadian = startRatio * Math.PI * 2;
        let endRadian = endRatio * Math.PI * 2;
        let midRadian = midRatio * Math.PI * 2;

        // 如果只有一个扇形，则不实现选中效果。
        if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
        }

        // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
        k = typeof k !== "undefined" ? k : 1 / 3;

        // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
        let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
        let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

        // 计算高亮效果的放大比例（未高亮，则比例为 1）
        let hoverRate = isHovered ? 1.05 : 1;

        // 返回曲面参数方程
        return {
            u: {
                min: -Math.PI,
                max: Math.PI * 3,
                step: Math.PI / 32
            },

            v: {
                min: 0,
                max: Math.PI * 2,
                step: Math.PI / 20
            },

            x: function (u, v) {
                if (u < startRadian) {
                    return (
                        offsetX +
                        Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                if (u > endRadian) {
                    return (
                        offsetX + Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            y: function (u, v) {
                if (u < startRadian) {
                    return (
                        offsetY +
                        Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                if (u > endRadian) {
                    return (
                        offsetY + Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                    );
                }
                return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            z: function (u, v) {
                if (u < -Math.PI * 0.5) {
                    return Math.sin(u);
                }
                if (u > Math.PI * 2.5) {
                    return Math.sin(u) * h * .1;
                }
                return Math.sin(v) > 0 ? 1 * h * .1 : -1;
            }
        };
    }

    // 生成模拟 3D 饼图的配置项
    public getPie3D(pieData, internalDiameterRatio,distance) {

        let series = [];
        let sumValue = 0;
        let startValue = 0;
        let endValue = 0;
        let legendData = [];
        let k = typeof internalDiameterRatio !== 'undefined' ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio) : 1 / 3;

        for (let i = 0; i < pieData.length; i++) {

            sumValue += pieData[i].value;

            let seriesItem = {
                name: typeof pieData[i].name === 'undefined' ? `series${i}` : pieData[i].name,
                type: 'surface',
                parametric: true,
                wireframe: {
                    show: false
                },
                pieData: pieData[i],
                pieStatus: {
                    selected: false,
                    hovered: false,
                    k: k
                },
                itemStyle: null
            };

            if (typeof pieData[i].itemStyle != 'undefined') {

                let itemStyle = {
                    color: null,
                    opacity: null
                };

                typeof pieData[i].itemStyle.color != 'undefined' ? itemStyle.color = pieData[i].itemStyle.color : null;
                typeof pieData[i].itemStyle.opacity != 'undefined' ? itemStyle.opacity = pieData[i].itemStyle.opacity : null;

                seriesItem.itemStyle = itemStyle;
            }
            series.push(seriesItem);
        }


        // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
        // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
        for (let i = 0; i < series.length; i++) {
            endValue = startValue + series[i].pieData.value;
            let val = this.hoveredIndex == series[i].pieData.name ? (series[i].pieData.value / sumValue) * 100 + 10 : (series[i].pieData.value / sumValue) * 100 ;
            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = this.getParametricEquation(series[i].pieData.startRatio, series[i].pieData.endRatio, false, false, k, val+this.options.itemHeigh);
            startValue = endValue;
            legendData.push(series[i].name);
        }

        // 补充一个透明的圆环，用于支撑高亮功能的近似实现。
        // series.push({
        //     name: 'mouseoutSeries',
        //     type: 'surface',
        //     parametric: true,
        //     wireframe: {
        //         show: false
        //     },
        //     itemStyle: {
        //         opacity: 0
        //     },
        //     parametricEquation: {
        //         u: {
        //             min: 0,
        //             max: Math.PI * 2,
        //             step: Math.PI / 20
        //         },
        //         v: {
        //             min: 0,
        //             max: Math.PI,
        //             step: Math.PI / 20
        //         },
        //         x: function (u, v) {
        //             return Math.sin(v) * Math.sin(u) + Math.sin(u);
        //         },
        //         y: function (u, v) {
        //             return Math.sin(v) * Math.cos(u) + Math.cos(u);
        //         },
        //         z: function (u, v) {
        //             return Math.cos(v) > 0 ? 0.1 : -0.1;
        //         }
        //     }
        // });
        const orient = this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? 'vertical' : 'horizontal';

        // 准备待返回的配置项，把准备好的 legendData、series 传入。
        let option = {
            sumValue: sumValue,
            //animation: false,

            legend: {
                left: this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? this.options.legendPosition : this.options.legendVerticalPosition,
                top: this.options.legendPosition === 'top' || this.options.legendPosition === 'bottom' ? this.options.legendPosition : this.options.legendHorizontalPosition,
                width: this.options.legendArea === 'custom' ? `${this.options.legendWidth}%` : 'auto',
                height: this.options.legendArea === 'custom' ? `${this.options.legendHeight}%` : 'auto',
                show: this.options.showLegend,
                orient: orient,
                itemGap: this.options.itemGap,
                icon: this.options.legendIcon,
                textStyle: {
                    color: this.options.legendTextStyle.color,
                    fontFamily: this.options.legendTextStyle.fontFamily,
                    fontSize: this.options.legendTextStyle.fontSize.replace("pt", ""),
                    fontStyle: this.options.legendTextStyle.fontStyle,
                    fontWeight: this.options.legendTextStyle.fontWeight,
                },
                data: legendData
            },
            tooltip: {
                formatter: params => {
                    if (params.seriesName !== 'mouseoutSeries') {
                        return `${params.seriesName}<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${params.color};"></span>${this.formatData(option.series[params.seriesIndex].pieData.value)}`;
                    }
                }
            },
            xAxis3D: {
                min: -1,
                max: 1
            },
            yAxis3D: {
                min: -1,
                max: 1
            },
            zAxis3D: {
                min: -1,
                max: 1
            },
            grid3D: {
                show: false,
                boxHeight: 10,
                viewControl: {
                    damping: 0.8,
                    // distance  : 2000,
                    alpha: this.options.alpha,
                    beta: this.options.beta,
                    rotateSensitivity: 1,
                    zoomSensitivity: 1,
                    panSensitivity: 1,
                    autoRotateAfterStill: 5,
                    distance: distance,
                    //自动旋转
                    autoRotate: this.options.Automatic,
                    autoRotateSpeed: this.options.autoRotateSpeed,
                    autoRotateDirection: this.options.AutomaticStyle
                },
                postEffect: {
                    enable: true,
                    bloom: {
                        enable: true,
                        bloomIntensity: 0.1
                    },
                    SSAO: {
                        enable: true,
                        quality: 'medium',
                        radius: 2
                    }
                }
            },
            series: series
        };
        // this.myEcharts.dispatchAction({
        //     type: 'showTip',
        // })
        return option;
    }

    private getColors(pallet, index, position: number) {
        let backgroundColor = ''
        const pieColor: [{
            colorStops: [] | any
        }] = pallet;
        if (index < pieColor.length) {
            backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
        } else {
            backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
                ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
                : pieColor[index % (pieColor.length)]
        }
        return backgroundColor
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

    private formatData(number) {
        const formatService = this.host.formatService;
        // let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
        return formatService.format(this.format, number);
    }
}