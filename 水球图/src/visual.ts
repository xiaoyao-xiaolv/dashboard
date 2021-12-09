import { Properties } from './../../histogram/src/interface';
import '../style/visual.less';
import * as echarts from 'echarts';
//@ts-ignore
import liquidfill from 'echarts-liquidfill'
(window as any).q = liquidfill;
export default class Visual {
    private container: HTMLDivElement;
    private chart: any;
    private items: any;
    private properties: any;
    private ActualValue: any;
    private ContrastValue: any;
    private selectionManager: any;
    private host: any;

    static mockItems = 0.5;

    constructor(dom: HTMLDivElement, host: any) {
        this.container = dom;
        this.chart = echarts.init(dom);
        this.items = [];
        this.properties = {
        };
        this.selectionManager = host.selectionService.createSelectionManager();
        this.host = host;
        this.selectEvent();
    }

    private selectEvent() {
        this.container.addEventListener("click", () => {
            this.host.toolTipService.hide();
            this.host.contextMenuService.hide();
            return;
        })

        this.chart.on('mouseup', (params) => {
            if (params.event.event.button === 2) {
                document.oncontextmenu = function () { return false; };
                params.event.event.preventDefault();
                this.host.contextMenuService.show({
                    position: {
                        //跳转的selectionsId(左键需要)
                        x: params.event.event.x,
                        y: params.event.event.y,
                    },
                    menu: true
                }, 10)
                return;
            } else {
                this.host.contextMenuService.hide();
            }
        })

        //鼠标左键
        this.chart.on('click', (params) => {
            let leftMouseButton = this.properties.leftMouseButton;
            params.event.event.stopPropagation();
            if (params.event.event.button == 0) {
                switch (leftMouseButton) {
                    //鼠标联动设置    
                    case "none": {
                        return;

                    }
                    default: {
                        const selectionIds = this.selectionManager.getSelectionIds();
                        this.host.commandService.execute([{
                            name: leftMouseButton,
                            payload: {
                                selectionIds,
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
    }

    public update(options: any) {
        const dataView = options.dataViews[0];
        if (dataView && dataView.plain.profile.ActualValue.values.length) {
            const plainData = dataView.plain;
            this.ActualValue = plainData.profile.ActualValue.values;
            this.ContrastValue = plainData.profile.ContrastValue.values;
            this.items = this.ContrastValue.length ? [plainData.data[0][this.ActualValue[0].display] / plainData.data[0][this.ContrastValue[0].display]] : [plainData.data[0][this.ActualValue[0].display]];
        }
        this.properties = options.properties;
        this.render();
    };

    private findInterval(options: any, items: any) {
        items = items * 100
        let color;
        options.setShowColor.forEach((data,index) => {
            if (items > data.sectionMin) {
                if (items <= data.sectionMax) {
                    color = this.getColors(index,1);
                }
            }
        });
        return color
    }

    private render() {
        const options = this.properties;
        this.chart.clear();
        const isMock = !this.items.length;
        const items = isMock ? Visual.mockItems : this.items;
        this.container.style.opacity = isMock ? '0.3' : '1';
        let fontWeight: string;
        if (options.textStyle.fontWeight == "Light") {
            fontWeight = options.textStyle.fontWeight + "er"
        } else {
            fontWeight = options.textStyle.fontWeight
        }

        let color;
        if (this.properties.setShowColor.length == 0) {
            color = this.getColors(0, 1)
        } else {
            color = this.findInterval(options, items);
        }
        let backgroundStyle;
        if (this.properties.showShade) {
            backgroundStyle = {
                borderWidth: options.borderWidth,
                borderColor: options.borderColor,
                color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(0,24,55, 0)'
                    },
                    {
                        offset: 0.55,
                        color: 'rgba(0,24,55, 0)'
                    },
                    {
                        offset: 1,
                        color: options.backgroundColor
                    }],
                    globalCoord: false
                },
            }
        } else {
            backgroundStyle = {
                borderWidth: options.borderWidth,
                borderColor: options.borderColor,
                color: options.backgroundColor
            }
        }
        color = {
            type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: color + "33"
          }, {
            offset: 1,
            color: color + "FF"
          }],
          globalCoord: false
        }
        
        var option = {
            series: [
                {
                    type: 'liquidFill',
                    radius: '95%',
                    name: options.subtitle,
                    shape: options.shape,
                    center: ['50%', '50%'],
                    data: [items, items * 0.9, items * 0.8, items * 0.7],
                    color: [color],
                    outline: {
                        show: options.showoutline,
                        borderDistance: options.borderDistance,
                        itemStyle: {
                            borderWidth: options.outlineborderWidth,
                            borderColor: options.outlineborderColor,
                        }
                    },
                    backgroundStyle: backgroundStyle,
                    label: {
                        show: options.showlabel,
                        formatter: function () {
                            if (options.displayFormat == "number") {
                                return (items * 1).toFixed(2);
                            } else {
                                return (items * 100).toFixed(2) + '%';
                            }

                        },
                        color: options.textStyle.color,
                        fontSize: options.textStyle.fontSize.substr(0, 2),
                        fontWeight: fontWeight,
                        fontFamily: options.textStyle.fontFamily,
                        fontStyle: options.textStyle.fontStyle,
                        insideColor: '#fff',
                    }
                }]
        };
        this.chart.setOption(option);
    }

    // public abstract onDestroy(): void;
    public onResize() {
        this.chart.resize();
        this.render();
    }

    // 自定义属性可见性
    public getInspectorHiddenState(updateOptions: any): string[] {
        if (!updateOptions.properties.showColor) {
            return ['Interval1', 'Interval2', 'Interval3', 'Interval4', 'Interval5'];
        }
        if (!updateOptions.properties.showoutline) {
            return ['borderDistance', 'outlineborderWidth', 'outlineborderColor'];
        }
        if (!updateOptions.properties.showlabel) {
            return ['textStyle'];
        }
        return null;
    }

    // 功能按钮可见性
    public getActionBarHiddenState(updateOptions: any): string[] {
        return null;
    }
    public onActionEventHandler = (name: string) => {
        console.log(name);
    }

    private getColors(index, position: number) {
        let backgroundColor = ''
        const pieColor: [{
            colorStops: [] | any
        }] = this.properties.piecesColor && this.properties.piecesColor || [];
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