import '../style/visual.less';

/**
 * 引入echarts
 * 可以全量引入 import * as echarts from 'echarts';
 * 也可以按需引入 以下代码为按需引入
 */

import * as echarts from 'echarts/core';
import {TooltipComponent, GridComponent, TitleComponent, ToolboxComponent, LegendComponent} from 'echarts/components';
import {BarChart} from 'echarts/charts';
import {ScatterChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([TooltipComponent, GridComponent, BarChart, ScatterChart, TitleComponent, ToolboxComponent, LegendComponent, CanvasRenderer]);


/**
 * 一个很好用的前端查询组件
 */
import jslinq from "jslinq";

/**
 * 引用外置库js对象
 */
// @ts-ignore
import AMap from 'AMap';

/**
 * 数据接口
 * 可以根据业务扩展字段,属于自定义类型, 根据自己实际业务填充字段
 * 这里将类型设置为any, 是为了后面可以做更多的扩展,如果类型简单
 */
interface IRenderConfig {
    xAxis: string[];
    legend: string[];
    actualValues: number[];
    contrastValues1: number[];
    contrastValues2: number[];
    isMock: boolean;
}

export default class Visual extends WynVisual {

    /**
     * 设置默认数据
     * @private
     */
    private static defaultConfig: IRenderConfig = {
        xAxis: ['1月 ', '2月', '3月', '4月', '5月', '6月 ', '7月', '8月', '9月', '10月', '11月', '12月'],
        legend: ['实际值', '对比值二', '对比值一'],
        actualValues: [300, 194, 297, 578, 468, 578, 265, 390, 300, 390, 585, 300],
        contrastValues1: [300, 400, 450, 480, 570, 390, 300, 390, 585, 300, 194, 390],
        contrastValues2: [265, 390, 300, 390, 585, 300, 194, 297, 578, 468, 578, 468],
        isMock: true,
    }

    /**
     * 容器中的第一个div,填充数据的空间
     * @private
     */
    private dom: HTMLDivElement;

    /**
     * div中再增嵌套一个div,可以根据后期业务增加多个,调整css即可
     * @private
     */
    private container: HTMLDivElement;


    /**
     * echarts对象
     * @private
     */
    private echartsInstance: echarts.ECharts;

    /**
     * 加载配置项,将所有绘制后的数据存储,以便于渲染图表使用
     * @private
     */
    private renderConfig: IRenderConfig;

    /**
     * 图表配置项, 包含所有图表配置属性项目
     * @private
     */
    private styleConfig: any;


    /**
     * 工具提示
     * @private
     */
    private tooltipFields: any;


    /**
     * 数据格式化
     * @private
     */
    private format: any;
    private displayUnit: any;
    // private unitType: any;

    /**
     * 数据钻取联动
     * @private
     */
    private host: any;
    private selectionManager: any;
    private selectionOption: any;
    private items: any;


    /**
     * 数据编订中的属性值名称
     * 后面可能用到
     */
    private actualValue_key: any;
    private contrastValue1_key: any;
    private contrastValue2_key: any;
    private category_key: any;

    /**
     * 首次加载方法,后期不执行
     * @param dom
     * @param host
     * @param options
     */
    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);

        const img = host.assetsManager.getImage('bg');
        console.log(img);

        const amapToken = host.configurationManager.get('高德地图API');

        console.log(amapToken)

        this.dom = dom;

        this.container = document.createElement('div');
        this.container.id = 'container';

        this.dom.append(this.container);

        this.echartsInstance = echarts.init(dom);

        this.host = host;


        this.selectionManager = host.selectionService.createSelectionManager();
        this.selectionOption = [];
        this.tooltipFields = [];

        this.bindEvents();
    }

    /**
     * 所有项目改变,都会进入update方法
     * @param options
     */
    public update(options: VisualNS.IVisualUpdateOptions) {

        this.styleConfig = options.properties;
        this.items = [];
        /**
         * 获取当前绑定数据
         */
        const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
        console.info(plainDataView);
        /**
         * 判断是否绑定了数据
         */
        if (plainDataView) {
            this.actualValue_key = plainDataView.profile.actualValue.values[0].display;
            this.contrastValue1_key = plainDataView.profile.contrastValue1.values[0].display;
            this.contrastValue2_key = plainDataView.profile.contrastValue2.values[0].display;
            this.category_key = plainDataView.profile.category.values[0].display;


            //排序
            const sortFlage = plainDataView.sort[this.category_key].order;
            const actualDatas = []
            const contrast1Datas = []
            const contrast2Datas = []
            sortFlage.map((serise, index) => {
                actualDatas[index] = plainDataView.data.filter((item) => item[this.category_key] === serise && item[this.actualValue_key])
                contrast1Datas[index] = plainDataView.data.filter((item) => item[this.category_key] === serise && item[this.contrastValue1_key])
                contrast2Datas[index] = plainDataView.data.filter((item) => item[this.category_key] === serise && item[this.contrastValue2_key])
            })
            //显示数据组装
            const values = [];
            // const legend = ['实际值', '对比值二', '对比值一'];
            const legend = [this.actualValue_key, this.contrastValue2_key, this.contrastValue1_key];
            const contrastValues1 = [];
            const contrastValues2 = [];
            const series = [];
            actualDatas.forEach((plain) => {
                const rNum = this.number_formatting(plain[0][this.actualValue_key], plain[0][this.category_key]);
                const rNum1 = this.number_formatting(plain[0][this.contrastValue1_key], plain[0][this.category_key]);
                const rNum2 = this.number_formatting(plain[0][this.contrastValue2_key], plain[0][this.category_key]);
                values.push(rNum);
                contrastValues1.push(rNum1);
                contrastValues2.push(rNum2);
                series.push(plain[0][this.category_key]);
            });
            //数据格式化基础属性获取
            this.format = plainDataView.profile.actualValue.options.valueFormat;
            this.displayUnit = plainDataView.profile.actualValue.options.valueDisplayUnit;
            // this.unitType=plainDataView.profile.actualValue.options.unitType;


            //数据联动items组合
            const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
                const selectionId = this.host.selectionService.createSelectionId();
                selectionId.withDimension(plainDataView.profile.category.values[0], item);
                result.push({
                    name: item[this.category_key],
                    selectionId,
                });
                return result;
            }, []);
            this.items = items;


            this.renderConfig = {
                xAxis: series,
                legend: legend,
                actualValues: values,
                contrastValues1: contrastValues1,
                contrastValues2: contrastValues2,
                isMock: false,
            };


        } else {
            this.renderConfig = Visual.defaultConfig;
        }
        this.render();


        if (this.renderConfig.isMock) {
            this.dom.style.opacity = '0.3';
        } else {
            this.dom.style.opacity = '1';
        }
    }

    /**
     * 需要给图表绑定的事件
     */
    public bindEvents() {
        //鼠标左键
        this.echartsInstance.on('click', (params) => {
            this.host.contextMenuService.hide();
            params.event.event.stopPropagation();
            if (params.event.event["button"] == 0) {
                const sid = this.getNodeSelectionId(this.items[params.dataIndex].name);
                this.selectionManager.clear();
                this.selectionManager.select(sid, true);
            }
        })


        //右键显示
        this.echartsInstance.on('mouseup', (params) => {
            document.oncontextmenu = function () {
                return false;
            };
            if (params.event.event["button"] === 2) {
                this.host.contextMenuService.show({
                    position: {
                        x: params.event.event["offsetX"],
                        y: params.event.event["offsetY"],
                    },
                    menu: true
                }, 10)
                return;
            } else {
                this.host.contextMenuService.hide();
            }
        })
    }

    /**
     * 数据格式化
     * @param number
     * @param format
     * @param displayUnit_3
     */
    public formatData = (number) => {
        const formatService = this.host.formatService;
        let realDisplayUnit = this.displayUnit == null ? "auto" : this.displayUnit;
        if (formatService.isAutoDisplayUnit(realDisplayUnit)) {
            realDisplayUnit = formatService.getAutoDisplayUnit([number]);
        }
        return formatService.format(this.format, number, realDisplayUnit);
    }

    /**
     * 数据格式化,根据自定义设置中的配置项组装数据
     * @param num
     * @private
     */
    private number_formatting(num, cate) {
        const style = this.styleConfig;
        let ret_number: any;
        if (ret_number) {
            return ret_number;
        }
        return num;
    }

    /**
     * 业务处理,将数据展示在组件上
     */
    public render() {
        const getColors = (index, position: number) => {
            let backgroundColor = ''
            const pieColor: [{
                colorStops: [] | any
            }] = styleConfig.palette && styleConfig.palette || [];

            if (index < pieColor.length) {
                backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
            } else {
                backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
                    ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
                    : pieColor[index % (pieColor.length)]
            }
            return backgroundColor
        }
        const config = this.renderConfig;
        const styleConfig = this.styleConfig;
        const _this = this;
        // const options = {
        //   tooltip: {
        //     show: styleConfig.tooltip,
        //     trigger: 'axis',
        //     backgroundColor: styleConfig.font_color,
        //     axisPointer: {
        //       type: 'shadow'
        //     },
        //     formatter:function (x){
        //       let num;
        //       if (x[0].data.value){
        //         num= _this.formatData(x[0].data.value);
        //       }else{
        //         num= _this.formatData(x[0].data);
        //       }
        //       return `${x[0].name}<br/>${_this.actualValue_key}:${num}`;
        //     }
        //   },
        //   xAxis: {
        //     data: config.xAxis
        //   },
        //   grid: {
        //     left: '3%',
        //     right: '4%',
        //     bottom: '3%',
        //     containLabel: true
        //   },
        //   yAxis: {},
        //   series: [{
        //     type: 'bar',
        //     data: config.values,
        //     label: {
        //       position: "top",
        //       color:'#fff',
        //       show: true,
        //       formatter:function (x){
        //         if (x.data.value){
        //           return _this.formatData(x.data.value);
        //         }else{
        //           return _this.formatData(x.data);
        //         }
        //       }
        //     }
        //   }],
        //   color: styleConfig.palette,
        //   textStyle: {
        //     ...styleConfig.textStyle,
        //     fontSize: parseInt(styleConfig.textStyle.fontSize),
        //   },
        //   animation: styleConfig.enableAnimation,
        // };
        const options = {
            backgroundColor: 'rgba(255, 255, 255, 0)',
            tooltip: {
                show: styleConfig.tooltip,
                trigger: 'axis',
                backgroundColor: styleConfig.tooltip_color,
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (x) {
                    let num;
                    let num1;
                    let num2;
                    let color0 = getColors(0, 0);
                    let color1 = getColors(1, 0);
                    let color2 = getColors(2, 0);
                    if (x[0].data.value) {
                        num = _this.formatData(x[0].data.value);
                    } else {
                        num = _this.formatData(x[0].data);
                    }
                    if (x[1].data.value) {
                        num1 = _this.formatData(x[1].data.value);
                    } else {
                        num1 = _this.formatData(x[1].data);
                    }
                    if (x[2].data.value) {
                        num2 = _this.formatData(x[2].data.value);
                    } else {
                        num2 = _this.formatData(x[2].data);
                    }
                    return `${x[0].name}<br/>
                             <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color0};"></span>${_this.actualValue_key}:${num}<br/>
                             <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color1};"></span>${_this.contrastValue1_key}:${num1}<br/>
                             <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color2};"></span>${_this.contrastValue2_key}:${num2}`;
                }
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                show: styleConfig.legendShow,
                data: config.legend,
                icon: styleConfig.legendIcon,
                textStyle: {
                    color: '#FFFFFF',
                    ...styleConfig.legend_textStyle,
                    fontSize: parseInt(styleConfig.legend_textStyle.fontSize),
                },
                left: styleConfig.legendVerticalPosition,
                top: '5%',
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: '5%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                //max:120,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    textStyle: {
                        color: '#FFFFFF',
                    },
                    formatter: '{value} '
                }
            },
            xAxis: {
                boundaryGap: true,

                axisLine: {
                    show: true,
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 'bolder',
                    }
                },
                data: config.xAxis
            },

            series: [{
                name: this.actualValue_key,
                type: 'bar',
                barGap: styleConfig.barActualGap+"%",
                barWidth: styleConfig.barActualWidth,
                z: 10,
                itemStyle: {
                    normal: {
                        color: getColors(0, 0)
                    }
                },
                data: config.actualValues
            },
                {
                    name: this.contrastValue2_key,
                    type: 'scatter',
                    symbol: 'rect',
                    silent: true,
                    itemStyle: {
                        normal: {
                            color: getColors(2, 0)
                        }
                    },
                    symbolSize: [styleConfig.barContrast2Width, styleConfig.barContrast2High],
                    symbolOffset: [styleConfig.barContrast2Gap+"%", "-10%"],
                    z: 20,
                    data: config.contrastValues2
                },
                {
                    name: this.contrastValue1_key,
                    type: 'bar',
                    barWidth: styleConfig.barContrast1Width,
                    itemStyle: {
                        normal: {
                            color: getColors(1, 0)
                        }
                    },
                    stack: 'total',
                    data: config.contrastValues1
                }
            ]
        };
        this.echartsInstance.setOption(options);

        this.echartsInstance.on('click', function (params) {
            _this.clickHandler(params.name);
        });

    }

    /**
     * 点击事件
     * 根据点击的列值,判定当前分类关联的是选中还是取消选中
     * @param key
     */
    private clickHandler = (key: any) => {
        const sid = this.getNodeSelectionId(key);
        if (this.selectionManager.contains(sid)) {
            this.selectionManager.clear(sid)
        } else {
            this.selectionManager.select(sid, true)
        }
    }

    /**
     * 根据分类信息获取选中值
     * @param key
     */
    public getNodeSelectionId = (key: any) => {
        const {selectionId} = this.items.find((item: any) => item.name == key);
        return selectionId
    }

    /**
     * 卸载时将调用
     */
    public onDestroy() {
        this.echartsInstance.dispose();
    }

    /**
     * 改变图表大小后触发
     */
    public onResize() {
        this.echartsInstance.resize();
    }

    /**
     * 返回需要隐藏的属性名称集合
     * @param options
     */
    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let properties = options.properties;
        let states = [];
        if (!properties.tooltip) {
            states = states.concat(["tooltip_color"]);
        }


        return states;
    }

    /**
     * 返回需要显示的属性名称集合
     * @param options
     */
    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let properties = options.properties;
        let states = [];

        if (properties.tooltip) {
            states = states.concat(["tooltip_color"]);
        }
        return states;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        if (!dataViews.length) {
            return null;
        }
        const plain = dataViews[0].plain;
        const colorProfile = plain.profile.actualValue.values[0];
        const dimProfile = plain.profile.category.values[0];
        if (!colorProfile || !dimProfile) {
            return null;
        }
        return null;
    }
}
