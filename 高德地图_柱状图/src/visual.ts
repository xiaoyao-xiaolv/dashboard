import '../style/visual.less';

// @ts-ignore
import AMap from 'AMap';
// @ts-ignore
import Loca from 'Loca';

import * as $ from 'jquery';
import jslinq from "jslinq";

import AreaJson from './AreaJson.json';
import DefJson from './DefJson.json';
/**
 * 图形类
 */
import point = require("./Point");
/**
 * 棱柱类
 */
import prism = require("./Prism");

interface IRenderConfig {
    data_point: {
        "type": "FeatureCollection",
        "features": any
    };
    data_line: {
        "type": "FeatureCollection",
        "features": any
    };
    data_cardPoint: {
        "type": "FeatureCollection",
        "features": any
    };
    isMock: boolean;
}

export default class Visual extends WynVisual {

    private static defaultConfig: IRenderConfig = {
        data_point: {
            "type": "FeatureCollection",
            "features": []
        },
        data_line: {
            "type": "FeatureCollection",
            "features": []
        },
        data_cardPoint: {
            "type": "FeatureCollection",
            "features": []
        },
        isMock: true
    }

    private dom: HTMLDivElement;
    private container: HTMLDivElement;
    private map: any;
    private centLnglat: any;
    private isMock: any;

    //地图中数据点
    private loca: any;
    private breaths: any;
    private scatters: any;
    private points: any;
    private bubbles: any;

    //标签图层
    private labelLayer: any;
    private infoWindow:any;

    //工具提示
    private tooltipFields: any;

    //标牌点
    private cardDates: any;
    private pl:any;
    private mk:any;

    private maxNum: any;

    private styleConfig: any;
    private renderConfig: IRenderConfig;


    private road: any;
    private sate: any;
    private _index: any;


    //区域掩模数据
    private mask:any;
    private district:any;
    private polylines:any;
    private poly:any;
    private ambLight:any;
    private dirLight:any;
    public mark_status:boolean;
    public wx_status:boolean;

    /**
     * 当前所绑定数据的key
     * @private
     */
    private num_key: any;
    private cate_key: any;
    private add_key: any;
    private lng_key: any;
    private lat_key: any;

    //数据格式化
    private format: any;
    private displayUnit: any;
    //数据钻取
    private host: any;
    private selectionManager: any;
    private selectionOption: any;
    private items: any;

    //飞线属性设置
    public pulseLink: any;
    public line_center: any;


    /**
     * 提示信息
     * @private
     */
    private toolTipName: string[];

    private def_geo_path = './DefJson.json';

    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.dom = dom;

        this.container = document.createElement('div');
        this.container.className = 'outer-box';
        this.container.id = 'container';

        this.dom.append(this.container);

        this.host = host;
        this.selectionManager = host.selectionService.createSelectionManager();
        this.selectionOption = [];

        this.scatters = [];
        this.breaths = [];
        this.points = [];
        this.bubbles = [];
        this.cardDates = [];

        this.centLnglat = [116.405285, 39.904989];


        //创建地图
        this.map = new AMap.Map('container', {
            viewMode: "3D",
            features: ['bg', 'road', 'building', 'point'],
            center: [116.408075, 39.950187],
            mapStyle: "amap://styles/grey",
            labelRejectMask:false
        });

        this.sate = new AMap.TileLayer.Satellite();
        this.road = new AMap.TileLayer.RoadNet();
        this._index = 0;

        this.format = {};

        this.tooltipFields = [];
    }


    /**
     * 数据改变后进入的第一个方法
     * 2022.01.20
     * @param options
     */
    public update(options: VisualNS.IVisualUpdateOptions) {
        this.styleConfig = options.properties;
        const data_point = [];
        const data_line = [];
        const data_cardPoint = [];
        this.line_center = [];

        if (this.styleConfig.line_show) {
            this.lineCenter(this.styleConfig, this);
        }
        if (options.dataViews.length > 0) {
            if (this.line_center.length!=0) {
                data_point.push(
                    {
                        "type": "Feature",
                        "rid": -3,
                        "properties": {
                            "cityName": this.line_center[0].name,
                            "ratio": -1
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": this.line_center[0].center
                        }
                    });
            }
            const plainDataView = options.dataViews[0] && options.dataViews[0].plain;

            this.tooltipFields = [];
            if (plainDataView) {
                let ll_type = "A";
                if (plainDataView.profile.address.values.length) {
                    this.add_key = plainDataView.profile.address.values[0].display;
                    ll_type = "A";
                }
                if (plainDataView.profile.lng.values.length && plainDataView.profile.lat.values) {
                    this.lng_key = plainDataView.profile.lng.values[0].display;
                    this.lat_key = plainDataView.profile.lat.values[0].display;
                    ll_type = "L";
                }
                this.num_key = plainDataView.profile.numeric.values[0].display;
                this.cate_key = plainDataView.profile.category.values[0].display;

                let toolTipValues = plainDataView.profile.tooltipFields.values;
                if (toolTipValues.length) {
                    this.tooltipFields = toolTipValues.map(value => value.display);
                }


                if (ll_type == "A") {
                    const rest = this.addressToCoords(plainDataView.data, this.add_key, this.num_key, this.cate_key);
                    rest.forEach((x, i) => {
                        data_point.push({
                            "type": "Feature",
                            "rid": i,
                            "item":x.item,
                            "properties": {
                                "cityName": x.add,
                                "ratio": x.num,
                                "img": x.img,
                                "category": x.cate,
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    x.lng,
                                    x.lat
                                ]
                            }
                        });
                    });
                } else {
                    plainDataView.data.forEach((x, i) => {
                        if (this.checkLon(x[this.lng_key]) && this.checkLat(x[this.lat_key])) {
                            data_point.push({
                                "type": "Feature",
                                "rid": i,
                                "item":x,
                                "properties": {
                                    "cityName": x[this.cate_key],
                                    "ratio": x[this.num_key],
                                    "category": x[this.cate_key],
                                },
                                "geometry": {
                                    "type": "Point",
                                    "coordinates": [
                                        x[this.lng_key],
                                        x[this.lat_key]
                                    ]
                                }
                            });
                        }
                    });
                }
            }
            this.renderConfig = {
                data_point: {
                    "type": "FeatureCollection",
                    "features": data_point
                },
                data_line: {
                    "type": "FeatureCollection",
                    "features": data_line
                },
                data_cardPoint: {
                    "type": "FeatureCollection",
                    "features": data_cardPoint
                },
                isMock: false
            }
            this.format = options.dataViews[0].plain.profile.numeric.options.valueFormat;
            this.displayUnit = options.dataViews[0].plain.profile.numeric.options.valueDisplayUnit;

            if (data_point.length > 0) {
                this.centLnglat = data_point[0].geometry.coordinates;
            }
            //添加
            const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
                const selectionId = this.host.selectionService.createSelectionId();
                selectionId.withDimension(plainDataView.profile.category.values[0], item);
                result.push({
                    name: item[this.cate_key],
                    selectionId,
                });
                return result;
            }, []);
            this.items = items;
            this.isMock = false;
        } else {
            const result = DefJson;
            const data = [];
            result.features.forEach((x, i) => {
                data.push(
                    {
                        "type": "Feature",
                        "rid": i,
                        "properties": {
                            "cityName": x.properties.cityName,
                            "ratio": x.properties.ratio
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [
                                x.geometry.coordinates[0],
                                x.geometry.coordinates[1]
                            ]
                        }
                    });
            });
            if (this.line_center.length != 0) {
                data.push(
                    {
                        "type": "Feature",
                        "rid": -3,
                        "properties": {
                            "cityName": this.line_center[0].name,
                            "ratio": -1
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": this.line_center[0].center
                        }
                    });
            }
            this.add_key = "城市";
            this.cate_key = "分类";
            this.num_key = "GDP";
            this.renderConfig = {
                data_point: {
                    "type": "FeatureCollection",
                    "features": data
                },
                data_line: {
                    "type": "FeatureCollection",
                    "features": []
                },
                data_cardPoint: {
                    "type": "FeatureCollection",
                    "features": []
                },
                isMock: true
            }
            this.isMock = true;
        }

        this.render();
    }

    /**
     * 名称转坐标
     * @param datas
     * @param add_key
     * @param num_key
     * @param cate_key
     */
    public addressToCoords(datas, add_key, num_key, cate_key) {
        const data_point = [];
        datas.forEach(x => {
            const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(x[add_key])) > -1)["items"];
            if (area.length) {
                data_point.push({
                    item:x,
                    num: x[num_key],
                    add: area[0].name,
                    cate: x[cate_key],
                    lng: area[0].center[0],
                    lat: area[0].center[1]
                })
            }
        });
        const ret_data_point = [];
        const items = jslinq(data_point).groupBy(x => x.add)["items"];
        items.forEach(x => {
            let num = 0;
            let cate = "";
            let img = "";
            x.elements.forEach(r => {
                num += r.num;
                if (cate == "") {
                    cate = r.cate;
                }
                if (img != "") {
                    img = r.img;
                }
            });
            ret_data_point.push({
                add: x.key,
                num,
                item:x.elements[0].item,
                lng: x.elements[0].lng,
                lat: x.elements[0].lat,
                cate,
                img
            })
        });
        return ret_data_point;
    }

    /**
     * 格式化区县名称
     * @param name
     * @constructor
     */
    public AreaFormatter(name) {
        switch (name) {
            case '西藏藏族自治区':
            case '西藏':
                name = '西藏自治区';
                break;
        }
        return name;
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
     * 数据加载方法
     * 2022.01.20
     */
    public render() {

        const style = this.styleConfig;

        //判断是掩模状态是否修改，若修改，则需要重复重新加载一下地图
        if (this.mark_status==true && !style.pr_mask){
            //创建地图
            this.map && this.map.destroy();
            this.map = new AMap.Map('container', {
                viewMode: "3D",
                center: [116.408075, 39.950187],
                mapStyle: "amap://styles/grey"
            });
            this.loca = new Loca.Container({
                map: this.map
            });
        }
        this.mark_status=style.pr_mask;
        //显示标记
        let features = ['bg', 'road', 'building'];
        if (style.t_point) {
            features = ['bg', 'road', 'building', 'point'];
        }

        //设置标签
        if (style.t_title) {
            if (this.labelLayer == null) {
                this.labelLayer = new AMap.LabelsLayer({
                    rejectMapMask: true,
                    collision: true,
                    animation: true,
                });
                this.map.add(this.labelLayer);
            }
        }
        //鼠标提示标签
        if (style.t_show){
            if (this.infoWindow==null){
                this.infoWindow = new AMap.InfoWindow({
                    content: ""
                });
            }
        }


        this.map.setFeatures(features);
        this.map.setPitch(style.pitch);


        this.map.setMapStyle("amap://styles/" + style.mapStyle);
        this.map.setZoom(this.styleConfig.zoom);
        if (this.wx_status !=style.v_wx){
            if (style.v_wx) {
                this.map.setLayers([this.sate, this.road]);
            } else {
                this.map.remove(this.sate);
                this.map.remove(this.road);
            }
            this.wx_status =style.v_wx;
        }

        this.map.setStatus({
            rotateEnable: style.rotateEnable,
            pitchEnable: style.pitchEnable,
            zoomEnable: style.zoomEnable,
            dragEnable: style.dragEnable,
            keyboardEnable: false,
            doubleClickZoom: false,
        });
        //判断是否输入了地图中心点
        if (this.styleConfig.centerLnglat.trim() != "") {
            const lnglat = this.styleConfig.centerLnglat.split(",");
            if (lnglat.length == 2) {
                if (this.checkLon(lnglat[0].trim()) && this.checkLat(lnglat[1].trim())) {
                    this.map.setZoomAndCenter(this.styleConfig.zoom, [lnglat[0], lnglat[1]]);
                }
            } else {
                const cname = this.styleConfig.centerLnglat.trim();
                const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(cname)) > -1 && r.name.substring(3) == this.AreaFormatter(cname).substring(3))["items"];
                if (area.length > 0) {
                    this.map.setZoomAndCenter(this.styleConfig.zoom, [area[0].center[0], area[0].center[1]]);
                }
            }
        } else {
            this.map.setZoomAndCenter(this.styleConfig.zoom, this.centLnglat);
        }

        this.titleStyle(style);
        //根据数据添加显示图形
        this.appendImage();
        if (this.renderConfig.isMock) {
            this.container.style.opacity = '0.3';
        } else {
            this.container.style.opacity = '1';
        }

    }

    private titleStyle(style){
        const t_01 = document.createTextNode(`.amap-info-content{border: ${style.t_border} ${style.t_border_px}px solid;border-radius: ${style.t_radius}px;padding: 0px;}`);
        const t_02=document.createTextNode(`.bottom-center .amap-info-sharp{border-top: 8px solid ${style.t_border};}`);
        const t_03=document.createTextNode(`.content-window-card{background-color: ${style.t_background};}`);

        //设置字体
        //fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
        const t_04=document.createTextNode(`.input-title{color: ${style.t_titleStyle.color};font-family: '${style.t_titleStyle.fontFamily}';font-size: ${style.t_titleStyle.fontSize};font-style: ${style.t_titleStyle.fontStyle};font-weight: '${style.t_titleStyle.fontWeight}'}`);
        const t_05=document.createTextNode(`.input-item{color: ${style.t_titleStyle.color};font-family: '${style.t_titleStyle.fontFamily}';font-size: ${style.t_titleStyle.fontSize};font-style: ${style.t_titleStyle.fontStyle};font-weight: '${style.t_titleStyle.fontWeight}'}`);

        const t_06=document.createTextNode(`.amap-layers{background-color: ${style.map_color};background-image: url("${style.map_image}");background-repeat:no-repeat;background-size:100% 100%;}`);

        const domstyle = document.createElement('style');
        domstyle.appendChild(t_01);
        domstyle.appendChild(t_02);
        domstyle.appendChild(t_03);
        domstyle.appendChild(t_04);
        domstyle.appendChild(t_05);
        domstyle.appendChild(t_06);
        document.body.appendChild(domstyle);
    }

    public lineCenter(style, th) {
        this.line_center.push({name: '北京', center: [116.46, 39.92]});
        //判断飞线中心点
        if (style.line_Lnglat.trim() != "") {
            const lnglat = style.line_Lnglat.split(",");
            if (lnglat.length == 2) {
                if (th.checkLon(lnglat[0].trim()) && th.checkLat(lnglat[1].trim())) {
                    this.line_center=[];
                    this.line_center.push({name: "", center: [lnglat[0], lnglat[1]]});
                }
            } else {
                const cname = style.line_Lnglat.trim();
                const area = jslinq(AreaJson).where(r => r.name.indexOf(th.AreaFormatter(cname)) > -1)["items"];
                if (area.length > 0) {
                    this.line_center=[];
                    this.line_center.push({name: cname, center: [area[0].center[0], area[0].center[1]]});
                }
            }
        }
    }

    public appendImage() {
        const th = this;

        th.map.clearMap();

        if (this.loca){
            this.loca.clear();
        }

        //删除上次绘制的点
        th.scatters.forEach(x => {
            th.loca.remove(x.scatter);
        });

        th.breaths.forEach(x => {
            th.loca.remove(x.breath);
        });

        th.scatters = [];
        th.breaths = [];


        //删除已添加的点
        th.points.forEach(x => {
            th.loca.remove(x.point);
        });
        th.bubbles.forEach(x => {
            th.loca.remove(x.bubble);
        });
        if (th.pulseLink) {
            th.loca.remove(th.pulseLink);
        }
        th.points = [];
        th.bubbles = [];

        //图点设置
        const _point = new point.Point();
        _point.buildChart(th);
        //棱柱开启

        th.polylines=[];
        if (this.styleConfig.pr_show){


            this.mask=[];
            //区域
            if (!this.district){
                this.district = new AMap.DistrictSearch({
                    subdistrict: 0,
                    extensions: 'all',
                    level: 'city'
                });
            }

            const _prism=new prism.Prism();
            _prism.buildChart(th);
        }

    }

    public isJsonString(str) {
        try {
            const json = JSON.parse(str);
            if (typeof json == "object") {
                return json;
            }
        } catch (e) {
            return [];
        }
    }

    /**
     * 检查经度是否合法
     * @param lon 经度
     * @returns 返回true|false
     */
    public checkLon(lon) {
        var reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (reg.test(lon)) {
            if (parseFloat(lon) >= -180 && parseFloat(lon) <= 180) {
                return true;
            }
        }
        return false;
    };

    /**
     * 检查纬度是否合法
     * @param lat 维度
     * @returns 返回true|false
     */
    public checkLat(lat) {
        var reg = /^(\-|\+)?\d+(\.\d+)?$/;
        if (reg.test(lat)) {
            if (parseFloat(lat) >= -90 && parseFloat(lat) <= 90) {
                return true;
            }
        }
        return false;
    };

    public onDestroy(): void {
        this.map && this.map.destroy();
        this.loca && this.loca.destroy();
    }

    /**
     * 隐藏
     * @param options
     * @returns
     */
    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let properties = options.properties;
        let states = [];

        if (properties.icon_type == "PO") {
            states = states.concat(["icon_symbol"]);
        } else {
            states = states.concat(["icon_color"]);
        }
        if (!properties.r_icon_flash) {
            states = states.concat(["r_f_width", "r_f_duration", "icon_png",]);
        }
        //轮播
        if (!properties.p_rolling) {
            states = states.concat(["p_height", "pr_radius", "p_sideNumber", "q_interval", "q_by_x", "q_by_y", "p_opacity", "p_topColor", "p_sideTopColor_1", "p_sideBottomColor"]);
        }
        //飞线
        if (!properties.line_show) {
            states = states.concat(["line_state", "line_Lnglat", "line_lineWidth_star", "line_lineWidth_end", "line_height", "line_speed", "line_flowLength", "line_headColor", "line_trailColor", "line_lineColors"]);
        }
        //鼠标提示
        if (!properties.t_show){
            states=states.concat(["t_border","t_border_px","t_radius","t_background","t_titleStyle","t_remain"])
        }
        return states;
    }

    /**
     * 显示
     * @param options
     * @returns
     */
    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let properties = options.properties;
        let states = [];
        if (properties.icon_type != "PO") {
            states = states.concat(["icon_symbol"]);
        } else {
            states = states.concat(["icon_color"]);
        }

        if (properties.r_icon_flash) {
            states = states.concat(["r_f_width", "r_f_duration", "icon_png",]);
        }

        //轮播
        if (properties.p_rolling) {
            states = states.concat(["p_height", "pr_radius", "p_sideNumber", "q_interval", "q_by_x", "q_by_y", "p_opacity", "p_topColor", "p_sideTopColor_1", "p_sideBottomColor"]);
        }
        //飞线
        if (properties.line_show) {
            states = states.concat(["line_state", "line_Lnglat", "line_lineWidth_star", "line_lineWidth_end", "line_height", "line_speed", "line_flowLength", "line_headColor", "line_trailColor", "line_lineColors"]);
        }

        //鼠标提示
        if (properties.t_show){
            states=states.concat(["t_border","t_border_px","t_radius","t_background","t_titleStyle","t_remain"])
        }
        return states;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        return null;
    }

    /**
     * 打印时间日志
     * @param type
     */
    public dateLog(type) {
        const tName = type == 0 ? "开始" : "结束";
        console.log(tName, this.dateFtt(new Date()));
    }

    /**
     * 时间格式化
     * @param date
     * @param fmt
     */
    public dateFtt(date, fmt = "yyyy-MM-dd hh:mm:ss.S") {
        var o = {
            "M+": date.getMonth() + 1,                 //月份
            "d+": date.getDate(),                    //日
            "h+": date.getHours(),                   //小时
            "m+": date.getMinutes(),                 //分
            "s+": date.getSeconds(),                 //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}