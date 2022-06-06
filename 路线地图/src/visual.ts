import '../style/visual.less';

import * as echarts from 'echarts/core';
import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    GeoComponent
} from 'echarts/components';
import {MapChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    GeoComponent,
    MapChart,
    CanvasRenderer
]);


import _svg = require("./BubbleSvg");
import _geoJson = require("./BubbleGeoJson");
import jslinq from "jslinq";

interface IRenderConfig {
    svgPath: string,
    symbol: string,
    coords;
    jData;
    point;
    isMock: boolean;
}


export default class Visual extends WynVisual {
    private static defaultConfig: IRenderConfig = {
        svgPath: '<svg t="1636285405122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3004" width="400" height="400"><path d="M1024 216.436364c0-41.890909-25.6-79.127273-65.163636-95.418182V0H907.636364v116.363636c-37.236364 4.654545-69.818182 30.254545-81.454546 65.163637H204.8V0H153.6v181.527273H0V232.727273h153.6v525.963636c-39.563636 9.309091-69.818182 44.218182-74.472727 83.781818H0v51.2h83.781818c11.636364 30.254545 37.236364 53.527273 69.818182 62.836364V1024h51.2v-67.490909c32.581818-9.309091 58.181818-32.581818 69.818182-62.836364h558.545454c69.818182 0 128-58.181818 128-130.327272V311.854545c37.236364-13.963636 62.836364-51.2 62.836364-95.418181zM179.2 907.636364c-27.927273 0-51.2-23.272727-51.2-51.2s23.272727-51.2 51.2-51.2 51.2 23.272727 51.2 51.2-23.272727 51.2-51.2 51.2z m653.963636-65.163637H279.272727c-6.981818-41.890909-34.909091-74.472727-74.472727-83.781818V232.727273h616.727273c6.981818 46.545455 41.890909 81.454545 88.436363 86.109091v446.836363c0 41.890909-34.909091 76.8-76.8 76.8z m88.436364-574.836363c-27.927273 0-51.2-23.272727-51.2-51.2s23.272727-51.2 51.2-51.2 51.2 23.272727 51.2 51.2-23.272727 51.2-51.2 51.2z" p-id="3005" fill="#dbdbdb"></path></svg>',
        symbol: 'circle',
        coords: [],
        jData: [],
        point: [
            [290.240, 309.003],
            [75.240, 365.003],
            [141.240, 95.038]
        ],
        isMock: true,
    }


    private echartsInstance: any;
    private renderConfig: IRenderConfig;
    private styleConfig: any;
    private dom: HTMLDivElement;

    private properties: any;

    private m_t: any;
    //点数据
    private genreKey_0: any;
    private titleKey_0: any;
    private imgKey_0: any;
    private coodKey_0: any;

    //路线数据

    private genreKey_1: any;
    private titleKey_1: any;
    private imgKey_1: any;
    private lineKey_1: any;

    private tooltipFields: any;

    private container: HTMLDivElement;
    //图形信息
    private panel: HTMLDivElement;
    public svg_geojson: any;
    public takenSeatNames: any;

    public _generKey: any;
    public _rnameKey: any;
    public _profileKey: any;
    public _rcolorKey: any;

    public svg_layer: any;
    public menu_items: any;
    public set_opt: any;

    //数据联动
    private host: any;


    private selectionManager: any;
    private selectionOption: any;

    private selectionManager_geo: any;
    private selectionOption_geo: any;

    private items: any;

    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.dom = dom;

        //echarts box
        this.container = document.createElement('div');
        this.container.className = 'container';
        this.container.id = 'container';
        this.dom.append(this.container);

        //菜单
        this.menu_items = [];
        this.items = [];
        this.set_opt = "";
        this.panel = document.createElement('div');
        this.panel.id = 'panel';
        this.panel.className = 'panel';
        this.dom.append(this.panel);

        this.tooltipFields = [];
        this.host = host;
        this.selectionManager_geo = host.selectionService.createSelectionManager();
        this.selectionOption_geo = [];


        this.selectionManager = host.selectionService.createSelectionManager();
        this.selectionOption = [];

        this.echartsInstance = echarts.init(this.container);

    }


    // public autoPlayTooltip() {
    //     let timer = null;
    //     const autoPlay = () => {
    //         console.log(234);
    //         let index = 0;
    //         if (timer) clearInterval(timer);
    //         timer = setInterval(() => {
    //             console.log(234);
    //             this.echartsInstance.dispatchAction({
    //                 type: 'showTip',
    //                 seriesIndex: 1,
    //                 dataIndex: index
    //             });
    //             index++;
    //             if (index >= this.items.length) {
    //                 index = 0;
    //             }
    //         }, 2000);
    //     }
    //
    //     this.echartsInstance.on('mousemove', (e) => {
    //         if (timer) clearInterval(timer);
    //         this.echartsInstance.dispatchAction({
    //             type: "showTip",
    //             seriesIndex: 1,
    //             dataIndex: e.dataIndex
    //         });
    //     })
    //
    //     this.echartsInstance.on('mouseout', (e) => {
    //         autoPlay();
    //     })
    //
    //     autoPlay();
    // }

    private render() {
        const style = this.styleConfig;


    }

    public update(options: VisualNS.IVisualUpdateOptions) {
        if (!options.isViewer) {
            echarts.dispose(this.container);
            this.echartsInstance = echarts.init(this.container);
        }
        this.styleConfig = options.properties;
        this.m_t = 0;
        //图点数据
        {
            this.tooltipFields[0] = [];
            const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
            //判断标点是否有数据
            if (plainDataView) {
                this.m_t = 0;
                this.items[0] = [];
                this.genreKey_0 = plainDataView.profile.GenreData.values[0].display;
                this.titleKey_0 = plainDataView.profile.Title.values[0].display;
                let toolTipValues = plainDataView.profile.tooltipFields.values;
                if (toolTipValues.length) {
                    this.tooltipFields = toolTipValues.map(value => value.display);
                }
                //坐标
                this.coodKey_0 = "";
                const points = [];
                this.coodKey_0 = plainDataView.profile.CoordData.values[0].display;
                plainDataView.data.forEach((items) => {
                    const point = JSON.parse(items[this.coodKey_0].toString());
                    if (point.length == 2) {
                        points.push([point[0], point[1], items[this.genreKey_0], items]);
                    }

                });
                //图片
                this.imgKey_0 = "";
                if (plainDataView.profile.LineImage.values.length != 0) {
                    this.imgKey_0 = plainDataView.profile.LineImage.values[0].display;
                }
                this.renderConfig = {
                    svgPath: Visual.defaultConfig.svgPath,
                    symbol: '',
                    coords: [],
                    jData: [],
                    point: points,
                    isMock: false
                };

                //添加
                const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
                    const selectionId = this.host.selectionService.createSelectionId();
                    selectionId.withDimension(plainDataView.profile.Title.values[0], item);
                    result.push({
                        name: item[this.titleKey_0],
                        selectionId,
                    });
                    return result;
                }, []);
                this.items[0] = items;

            } else {
                this.renderConfig = {
                    svgPath: Visual.defaultConfig.svgPath,
                    symbol: '',
                    coords: Visual.defaultConfig.coords,
                    jData: Visual.defaultConfig.jData,
                    point: Visual.defaultConfig.point,
                    isMock: true
                };
                if (this.styleConfig.urlHttp.trim() != "" && this.styleConfig.urlHttp) {
                    this.renderConfig.svgPath = this.styleConfig.urlHttp;
                }
                this.items[0] = Visual.defaultConfig.jData;
            }
            //配置信息
            if (this.styleConfig.urlHttp.trim() != "" && this.styleConfig.urlHttp) {
                this.renderConfig.svgPath = this.styleConfig.urlHttp;
            }
        }
        //路线数据
        {
            this.tooltipFields[1] = [];
            const plainDataView = options.dataViews[1] && options.dataViews[1].plain;
            //判断路线,标点是否有数据
            if (plainDataView) {
                this.m_t = 1;
                this.titleKey_1 = plainDataView.profile.title.values[0].display;
                this.genreKey_1 = plainDataView.profile.category.values[0].display;
                this.lineKey_1 = "";
                if (plainDataView.profile.LineData.values.length != 0) {
                    this.lineKey_1 = plainDataView.profile.LineData.values[0].display;
                }
                let toolTipValues = plainDataView.profile.tooltipFields.values;
                if (toolTipValues.length) {
                    this.tooltipFields[1] = toolTipValues.map(value => value.display);
                }
                //图片
                this.imgKey_1 = "";
                if (plainDataView.profile.LineImage.values.length != 0) {
                    this.imgKey_1 = plainDataView.profile.LineImage.values[0].display;
                }
                const data = [];
                //路线信息
                plainDataView.data.forEach((x) => {
                    const json = this.isJSON(x[this.lineKey_1]);
                    if (json.length > 0) {
                        data.push({
                            'name': x[this.genreKey_1],
                            'items': x,
                            'coord': json,
                            'img': x[this.imgKey_1] == undefined ? "" : x[this.imgKey_1]
                        });
                    }
                });
                this.renderConfig.jData = data;
                if (this.renderConfig.isMock) {
                    this.renderConfig.point = [];
                    this.renderConfig.isMock = false;
                }

                //添加
                const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
                    const selectionId = this.host.selectionService.createSelectionId();
                    selectionId.withDimension(plainDataView.profile.title.values[0], item);
                    result.push({
                        name: item[this.titleKey_1],
                        selectionId,
                    });
                    return result;
                }, []);
                this.items[1] = items;

            }
        }
        //工业图数据
        {
            this.takenSeatNames = [];
            this.svg_layer = [];
            const plainDataView = options.dataViews[2] && options.dataViews[2].plain;
            if (plainDataView) {
                this.m_t = 2;
                this._generKey = plainDataView.profile.gener.values[0].display;
                this._rnameKey = plainDataView.profile.rname.values[0].display;
                this._profileKey = plainDataView.profile.profile.values[0].display;
                this._rcolorKey = plainDataView.profile.rcolor.values[0].display;
                this.svg_layer = jslinq(plainDataView.data).groupBy(x => x[this._generKey])['items'];

                const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
                    const selectionId = this.host.selectionService.createSelectionId();
                    selectionId.withDimension(plainDataView.profile.rname.values[0], item);
                    result.push({
                        name: item[this._rnameKey],
                        selectionId,
                    });
                    return result;
                }, []);
                this.items[2] = items;

                const _geojson = new _geoJson.BubbleGeoJson();
                _geojson.buildChart(this);
            }
        }
        this.properties = options.properties;
        //this.render();
        if (this.m_t == 0 || this.m_t == 1) {
            const _line = new _svg.BubbleSvg();
            _line.buildChart(this);
        }

        //this.autoPlayTooltip();
    }

    public onDestroy() {
        this.echartsInstance.dispose();
    }

    public onResize() {
        if (this.echartsInstance) {
            this.echartsInstance.resize();
        }
    }

    //判断是否为json
    public isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return obj;
                } else {
                    return [];
                }

            } catch (e) {
                return [];
            }
        }
    }

    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let prop = options.properties;
        let states = [];
        if (!prop.effect_show) {
            states.push('effect_color', 'effect_constantSpeed', 'effect_symbolSize_width', 'effect_symbolSize_height', 'effect_symbol', 'ico_collection')
        }

        //引导线
        if (!prop.lin_show) {
            states.push("lin_width");
            states.push("lin_smooth");
            states.push("lin_minTurnAngle");
            states.push("lin_widthx");
            states.push("lin_type");
            states.push("lin_shadowBlur");
            states.push("lin_shadowColor");
            states.push("lin_width");
            states.push("lin_shadowOffsetX");
            states.push("lin_shadowOffsetY");
            states.push("lin_opacity");
        }
        //标签

        if (!prop.lbl_show) {
            states.push("lbl_x");
            states.push("lbl_y");
            states.push("lbl_rotate");
            states.push("lbl_color");
            states.push("lbl_fontSize");
            states.push("lbl_backgroundColor");
            states.push("lbl_borderColor");
            states.push("lbl_borderWidth");
            states.push("lbl_borderRadius");
            states.push("lbl_padding");
            states.push("lbl_shadowColor");
            states.push("lbl_shadowBlur");
            states.push("lbl_shadowOffsetX");
            states.push("lbl_shadowOffsetY");
            states.push("lbl_width");
            states.push("lbl_heigth");
            states.push("lbl_overflow");
        }

        //图标自定义
        if (prop.icon_style != 'zdy') {
            states.push('icon_symbol');
        }
        return states;
    }

    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let prop = options.properties;
        let states = [];
        if (prop.effect_show) {
            states.push('effect_color', 'effect_constantSpeed', 'effect_symbolSize_width', 'effect_symbolSize_height', 'effect_symbol', 'ico_collection')
        }

        //引导线
        if (!prop.lin_show) {
            states.push("lin_width");
            states.push("lin_smooth");
            states.push("lin_minTurnAngle");
            states.push("lin_widthx");
            states.push("lin_type");
            states.push("lin_shadowBlur");
            states.push("lin_shadowColor");
            states.push("lin_width");
            states.push("lin_shadowOffsetX");
            states.push("lin_shadowOffsetY");
            states.push("lin_opacity");
        }
        //标签

        if (!prop.lbl_show) {
            states.push("lbl_x");
            states.push("lbl_y");
            states.push("lbl_rotate");
            states.push("lbl_color");
            states.push("lbl_fontSize");
            states.push("lbl_backgroundColor");
            states.push("lbl_borderColor");
            states.push("lbl_borderWidth");
            states.push("lbl_borderRadius");
            states.push("lbl_padding");
            states.push("lbl_shadowColor");
            states.push("lbl_shadowBlur");
            states.push("lbl_shadowOffsetX");
            states.push("lbl_shadowOffsetY");
            states.push("lbl_width");
            states.push("lbl_heigth");
            states.push("lbl_overflow");
        }
        //图标自定义
        if (prop.icon_style == 'zdy') {
            states.push('icon_symbol');
        }
        return states;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        return null;
    }
}