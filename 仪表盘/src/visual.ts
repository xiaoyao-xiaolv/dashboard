import '../style/visual.less';
import echarts from 'echarts'
export default class Visual {
    private container: HTMLDivElement;
    private chart: any;
    private items: any;
    private properties: any;
    private valueField: any;
    private ActualValue: any;
    private ContrastValue: any;
    static mockItems = 0.5;
    private host: any;

    constructor(dom: HTMLDivElement, host: any) {
        this.host = host;
        this.container = dom;
        this.chart = require('echarts').init(dom)
        this.fitSize();
        this.items = [];
        this.properties = {
            showSubTitle: false,
            subtitle: '示例',
            fontColor: '#fff',
            fontSize: 10,
            borderColor: '#20da97',
            scaleBackgroundColor: '#5effea',
            scaleColor: 'rgba(0, 0, 0, 0.5)',
            scaleFontColor: '#fff',
            scaleFontSize: 10,
            pointerColor: '#5effea'
        };
        this.selectEvent();
    }

    private selectEvent() {
        this.container.addEventListener("click", () => {
            this.host.contextMenuService.hide();
            return;
        })

        this.container.addEventListener('mouseup', (params) => {
            document.oncontextmenu = function () { return false; };
            if (params.button === 2) {
              this.host.contextMenuService.show({
                position: {
                  x: params.x,
                  y: params.y,
                },
                menu: true
              }, 10)
              return;
            }else{
              this.host.contextMenuService.hide();	
            }
          })

    }

    public update(options: any) {
        const dataView = options.dataViews[0];
        console.log(options)
        this.items = [];
        if ((dataView &&
            dataView.plain.profile.values.values.length) || (dataView &&
                dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.ContrastValue.values.length)) {
            const plainData = dataView.plain;
            this.valueField = plainData.profile.values.values;
            this.ActualValue = plainData.profile.ActualValue.values;
            this.ContrastValue = plainData.profile.ContrastValue.values;
            if (this.valueField.length == 1) {
                this.items[0] = plainData.data[0][this.valueField[0].display];
            } else {
                this.items[0] = (plainData.data[0][this.ActualValue[0].display] / plainData.data[0][this.ContrastValue[0].display]);
            }
        }
        this.properties = options.properties;
        this.render();
    };

    private render() {
        console.log(this.items)
        this.chart.clear();
        const isMock = !this.items.length;
        const items = (isMock ? Visual.mockItems : this.items) * 100;
        this.container.style.opacity = isMock ? '0.3' : '1';
        const options = this.properties;
        let subtitle = options.showSubTitle ? options.subtitle + ' : ' : ''
        var option = {
            title: {
                show: true,
                x: "center",
                bottom: 10,
                text: subtitle + items.toFixed(options.decimalsize) + '%',
                textStyle: {
                    color: options.fontSet.color,
                    fontFamily: options.fontSet.fontFamily,
                    fontSize: options.fontSet.fontSize.replace("pt", ""),
                    fontStyle: options.fontSet.fontStyle,
                    fontWeight: options.fontSet.fontWeight
                },
            },
            tooltip: {
                show: true,
                backgroundColor: '#101E44',
                textStyle: {
                    color: 'fff'
                },
                formatter: function (param) {
                    //return '<em style="color:' + param.color + ';">' + param.value + '</em> 分'
                    return '<em style="color:#ffffff;">' + param.value.toFixed(options.decimalsize) + '%</em> '
                }

            },
            series: [{
                name: "白色圈刻度",
                type: "gauge",
                radius: "120%",
                center: ["50%", "75%"],
                startAngle: 180, //刻度起始
                endAngle: 0, //刻度结束
                z: 4,
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 16, //刻度节点线长度
                    lineStyle: {
                        width: 2,
                        color: options.scaleColor
                    } //刻度节点线
                },
                axisLabel: {
                    color: options.scaleFontColor,
                    fontSize: options.scaleFontSize,
                }, //刻度节点文字颜色
                pointer: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        opacity: 0
                    }
                },
                detail: {
                    show: false
                },
                data: [{
                    value: 0,
                    name: ""
                }]
            }, {
                name: '灰色内圈', //刻度背景
                type: 'gauge',
                z: 2,
                radius: '120%',
                startAngle: 180,
                endAngle: 0,
                center: ["50%", "75%"], //整体的位置设置
                axisLine: { // 坐标轴线
                    lineStyle: { // 属性lineStyle控制线条样式
                        color: [
                            [1, options.scaleBackgroundColor]
                        ],
                        width: 15,
                        opacity: 1, //刻度背景宽度
                    }
                },
                splitLine: {
                    show: false
                },
                data: [{
                    show: false,
                    value: '80'
                }], //作用不清楚
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                detail: {
                    show: 0
                }
            }, {
                name: '指针',
                type: 'gauge',
                z: 6,
                radius: '125%',
                startAngle: 180,
                endAngle: 0,
                center: ["50%", "75%"], //整体的位置设置
                axisLine: {
                    lineStyle: { // 属性lineStyle控制线条样式//指针颜色
                        color: [
                            [1, options.pointerColor]
                        ],
                        width: 0
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                data: [items], //指针位置
                pointer: {
                    show: true,
                    width: 5,
                    length: '60%'
                },
                detail: {
                    show: 0
                }
            }, {
                name: '外层盘',
                type: 'gauge',
                z: 6,
                radius: '130%',
                startAngle: 180,
                endAngle: 0,
                center: ["50%", "75%"], //整体的位置设置
                axisLine: {
                    lineStyle: { // 属性lineStyle控制线条样式//控制外圈位置
                        color: [
                            [items / 100, options.borderColor],
                            [1, options.borderBgColor]
                        ],
                        width: 5,
                        opacity: 0.9, //控制外圈位置，颜色，宽度，透明度
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                pointer: {
                    show: false
                },
                data: [{
                    show: false,
                    value: '10'
                }],
                detail: {
                    show: 0
                }
            }]
        };
        this.chart.setOption(option);
    }

    // 自适应大小
    private fitSize() {
        this.chart.resize();
    }

    // public abstract onDestroy(): void;
    public onResize() {
        this.fitSize();
        this.render();
    }

    // 自定义属性可见性
    public getInspectorHiddenState(updateOptions: any): string[] {
        if (!updateOptions.properties.showSubTitle) {
            return ['subtitle'];
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
}