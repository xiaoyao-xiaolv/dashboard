import '../style/visual.less';

// @ts-ignore
import AMap from 'AMap';
// @ts-ignore
import Loca from 'Loca';


import jslinq from "jslinq";

import $ from 'jquery';

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
import {AreaOperate} from "./AreaOperate";

/**
 * 区域操作
 * data_point 数据点
 * data_line 飞线
 */
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
    private panel: HTMLDivElement;
    private map: any;
    private imageLayer:any;
    private centLnglat: any;
    private isMock: any;

    //地图中数据点
    private loca: any;
    private breaths: any;
    /**
     * 底图
     * @private
     */
    private scatterYellow:any;
    private scatters: any;
    private points: any;
    private bubbles: any;

    private point_items:any;

    //标签图层
    private labelLayer: any;
    private labelLayer_to: any;
    private labellayer_sun: any;
    private infoWindow: any;

    private def_image:any;

    //工具提示
    private tooltipFields: any;

    //标牌点
    private cardDates: any;
    private pl: any;
    private mk: any;

    private maxNum: any;

    private styleConfig: any;
    private beforeStyleConfig:any;
    /***
     * 区域掩模属性是否修改
     * @private
     */
    private isPrism=false;
    //区域掩模类型
    private pr_style=["pr_show","pr_mask", "pr_areaName", "amb_show", "amb_intensity", "amb_color", "dir_intensity", "dir_color", "dir_target", "dir_position", "opt_topColor", "opt_bottomColor", "opt_sideTopColor", "opt_sideBottomColor", "opt_altitude", "opt_height", "poly_cover", "pr_mask","poly_fillColor", "pr_poly", "pr_Color", "pr_strokeWeight", "pr_outlineColor", "pr_borderWeight", "pr_strokeStyle"];
    private isChild=false;
    private child_style=["am_display", "am_strokeColor", "am_bg_fill_bol", "am_bg_fill_color", "am_fillOpacity", "am_hover_fillOpacity"];
    private isMap=false;
    private map_Style=["centerLnglat", "zoom", "pitch", "mapStyle", "map_skyColor", "map_color", "map_image", "v_wx", "dragEnable", "zoomEnable", "rotateEnable", "pitchEnable","feat_point","feat_building","feat_road","feat_bg","img_opacity","img_lnglat_0","img_lnglat_1","img_url"];

    private poly_style=["pr_show", "opt_sideTopColor","opt_sideBottomColor","opt_bottomColor","opt_height","opt_altitude"];
    private isPoly=false;

    private por_style=["pr_poly","pr_Color","pr_strokeWeight","pr_borderWeight","pr_borderWeight","pr_outlineColor","pr_outlineColor","pr_strokeStyle"];
    private isPor=false;

    private renderConfig: IRenderConfig;



    private road: any;
    private sate: any;
    private _index: any;


    //区域掩模数据
    private mask: any;
    private district: any;
    private polylines: any;
    private poly: any;
    private ambLight: any;
    private dirLight: any;
    public sycolor_status: string;

    public wx_status: boolean;

    private adcodeIds: any;

    /**
     * 当前所绑定数据的key
     * @private
     */
    private num_key: any;
    private s_add_key: any;
    private s_lng_key: any;
    private s_lat_key: any;
    private e_add_key: any;
    private e_lng_key: any;
    private e_lat_key: any;

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
    private line_center: any;

    //区域设置
    /**
     * 记录点击节点
     * @private
     */
    private parentInfo = [];
    private disProvince: any;
    private polygon: any;
    private districtExplorer: any;
    private group_type: any;

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


        const loding = document.createElement('div');
        loding.id = 'loadingTip';
        this.dom.append(loding);

        this.dom.append(this.container);


        this.panel = document.createElement('div');
        this.panel.id = 'panel';
        this.panel.className = 'wrapper-first';
        this.dom.append(this.panel);

        this.host = host;
        this.selectionManager = host.selectionService.createSelectionManager();
        this.selectionOption = [];

        this.scatters = [];
        this.breaths = [];
        this.scatterYellow=[];
        this.points = [];
        this.bubbles = [];
        this.cardDates = [];
        this.line_center = [];
        this.point_items=[];

        this.centLnglat = [116.405285, 39.904989];


        //创建地图
        this.map = new AMap.Map('container', {
            viewMode: "3D",
            features: ['bg', 'road', 'building', 'point'],
            center: [116.408075, 39.950187],
            mapStyle: "amap://styles/grey",
            labelRejectMask: false
        });

        this.map.on( 'click',  function (e) {
            console.log("".concat(e.lnglat.lng,",",e.lnglat.lat));
        });

        {
            const load_image=host.assetsManager.getImage("loading");
            const t_load = document.createTextNode(`#loadingTip {position: absolute;left: 0;top: 0;width: 100%;height: 100%;z-index: 100;background-image:url('${load_image}');background-size:100% 100%;background-repeat:no-repeat;}`);
            const domstyle = document.createElement('style');
            domstyle.appendChild(t_load);
            document.body.appendChild(domstyle);
            //加载完成
            this.map.on("complete", function(){
                setTimeout(function () {
                    $('#loadingTip').fadeOut(1000);
                }, 100);
            });
        }

        this.sate = new AMap.TileLayer.Satellite();
        this.road = new AMap.TileLayer.RoadNet();
        this._index = 0;

        this.format = {};

        this.tooltipFields = [];
        this.parentInfo = [];
        this.def_image=host.assetsManager.getImage("point_1");
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
        this.adcodeIds = [];


        if (this.styleConfig.line_show) {
            this.lineCenter(this.styleConfig, this);
        }
        const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
        if (plainDataView) {

            this.tooltipFields = [];

            //起始时间段
            let ll_type = "A";
            if (plainDataView.profile.start_address.values.length) {
                this.s_add_key = plainDataView.profile.start_address.values[0].display;
                ll_type = "A";
            }
            if (plainDataView.profile.start_lng.values.length && plainDataView.profile.start_lat.values) {
                this.s_lng_key = plainDataView.profile.start_lng.values[0].display;
                this.s_lat_key = plainDataView.profile.start_lat.values[0].display;
                ll_type = "L";
            }
            this.num_key = plainDataView.profile.numeric.values[0].display;

            let toolTipValues = plainDataView.profile.tooltipFields.values;
            if (toolTipValues.length) {
                this.tooltipFields = toolTipValues.map(value => value.display);
            }

            //结束地点
            let end_type = "N";
            if (plainDataView.profile.end_address.values.length) {
                this.e_add_key = plainDataView.profile.end_address.values[0].display;
                end_type = "A";
            }
            if (plainDataView.profile.end_lng.values.length && plainDataView.profile.end_lat.values) {
                this.e_lng_key = plainDataView.profile.end_lng.values[0].display;
                this.e_lat_key = plainDataView.profile.end_lat.values[0].display;
                end_type = "L";
            }


            //起始地点
            if (ll_type == "A") {
                const rest = this.addressToCoords(plainDataView.data, end_type);
                rest.forEach((x, i) => {
                    data_point.push({
                        "type": "Feature",
                        "rid": i,
                        "l_rid": i,
                        "adcode": x.adcode,
                        "acroutes": x.acroutes,
                        "item": x.item,
                        "properties": {
                            "cityName": x.add,
                            "ratio": x.num,
                            "areaNames": [x.add]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": x.star_lng_lat
                        },
                        "geometry_to": {
                            "type": "Point",
                            "name": x.endArea.end_name,
                            "coordinates": x.endArea.end_lng_lat
                        }
                    });
                });
            } else {
                plainDataView.data.forEach((x, i) => {
                    if (this.checkLon(x[this.s_lng_key]) && this.checkLat(x[this.s_lat_key])) {
                        const endArea = this.endCoordinates(x, end_type);
                        data_point.push({
                            "type": "Feature",
                            "rid": i,
                            "item": x,
                            "properties": {
                                "cityName": x[this.s_add_key],
                                "ratio": x[this.num_key],
                                "areaNames": [x[this.s_add_key]]
                            },
                            "geometry": {
                                "type": "Point",
                                "coordinates": [
                                    x[this.s_lng_key],
                                    x[this.s_lat_key]
                                ]
                            },
                            "geometry_to": {
                                "type": "Point",
                                "name": endArea['end_name'],
                                "coordinates": endArea['end_lng_lat']
                            }
                        });
                    }
                });
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
                    "features": []
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
                selectionId.withDimension(plainDataView.profile.start_address.values[0], item);
                result.push({
                    name: item[this.s_add_key],
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
                            "ratio": x.properties.ratio,
                            "areaNames": [x.properties.cityName]
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
            data.push(
                {
                    "type": "Feature",
                    "rid": -3,
                    "properties": {
                        "cityName": '北京市',
                        "ratio": -1,
                        "areaNames": ['北京市']
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [116.405285, 39.904989]
                    }
                });
            this.s_add_key = "城市";
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

        this.isPrism=this.styleIsUpdate(this.pr_style);
        this.isChild=this.styleIsUpdate(this.child_style);
        this.isMap=this.styleIsUpdate(this.map_Style);
        this.isPoly=this.styleIsUpdate(this.poly_style);
        this.isPor=this.styleIsUpdate(this.por_style)
        this.render();
        //存储上次字段
        this.beforeStyleConfig=this.styleConfig;
    }

    /**
     * 名称转坐标
     * @param datas
     * @param add_key
     * @param num_key
     */
    public addressToCoords(datas, end_type) {
        const data_point = [];
        datas.forEach(x => {
            const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(x[this.s_add_key])) > -1)["items"];
            const endArea = this.endCoordinates(x, end_type);
            if (area.length) {
                const acroutes = JSON.parse(JSON.stringify(area[0].acroutes));
                acroutes.push(area[0].adcode);
                data_point.push({
                    item: x,
                    adcode: area[0].adcode,
                    acroutes: acroutes,
                    num: x[this.num_key],
                    add: area[0].name,
                    star_lng_lat: area[0].center,
                    endArea
                })
            }
        });
        const ret_data_point = [];
        const items = jslinq(data_point).groupBy(x => x.add)["items"];
        items.forEach(x => {
            let num = 0;
            x.elements.forEach(r => {
                num += r.num;
            });
            ret_data_point.push({
                add: x.key,
                num,
                adcode: x.elements[0].adcode,
                acroutes: x.elements[0].acroutes,
                item: x.elements[0].item,
                star_lng_lat: x.elements[0].star_lng_lat,
                endArea: x.elements[0].endArea
            })
        });
        return ret_data_point;
    }

    /**
     * 组装结束地址json
     * @param item
     * @param end_type
     */
    public endCoordinates(item, end_type) {
        if (this.styleConfig.line_show) {
            //组装地址终点
            if (end_type == "A") {
                const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(item[this.e_add_key])) > -1)["items"];
                if (area.length) {
                    const acroutes = JSON.parse(JSON.stringify(area[0].acroutes));
                    acroutes.push(area[0].adcode);
                    return ({
                        end_name: area[0].name,
                        acroutes: acroutes,
                        end_lng_lat: area[0].center
                    });
                }
            } else if (end_type == "L") {
                if (this.checkLon(item[this.e_lng_key]) && this.checkLat(item[this.e_lat_key])) {
                    return ({
                        end_name: item[this.e_add_key],
                        end_lng_lat: [item[this.e_lng_key], item[this.e_lat_key]]
                    });
                }
            }
            return ({
                end_name: this.line_center[0].name,
                end_lng_lat: this.line_center[0].center
            })
        }
        return ({
            end_name: '无',
            end_lng_lat: [0, 0]
        });
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
            case '新疆':
            case '新疆维吾尔族自治区':
            case '新疆自治区':
                name = '新疆维吾尔自治区';
                break;
            case '广西省':
            case '广西':
            case '广西壮族自治区':
                name = '广西壮族自治区';
                break;
            case '宁夏自治区':
            case '宁夏':
                name = '宁夏回族自治区';
                break;
            case '内蒙古自治区':
            case '内蒙古':
            case '内蒙':
                name = '内蒙古自治区';
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
        //显示标记
        let features = [];
        if (style.feat_bg){
            features.push("bg");
        }
        if (style.feat_road){
            features.push("road");
        }
        if (style.feat_building){
            features.push("building");
        }
        if (style.feat_point){
            features.push("point");
        }
        //天空颜色
        if (this.sycolor_status != style.map_skyColor) {
            //创建地图
            this.map && this.map.destroy();
            this.map = new AMap.Map('container', {
                viewMode: "3D",
                skyColor: style.map_skyColor,
                center: [116.408075, 39.950187],
                mapStyle: "amap://styles/grey"
            });
            this.loca = new Loca.Container({
                map: this.map
            });
            this.labelLayer = null;
            this.labelLayer_to = null;
            this.labellayer_sun = null;
            this.sycolor_status = style.map_skyColor;
        }

        //设置标签
        if (this.labelLayer == null) {
            this.labelLayer = new AMap.LabelsLayer({
                rejectMapMask: true,
                collision: true,
                animation: true,
            });
            this.labelLayer_to = new AMap.LabelsLayer({
                rejectMapMask: true,
                collision: true,
                animation: true,
            });
            this.labellayer_sun = new AMap.LabelsLayer({
                rejectMapMask: true,
                collision: true,
                animation: true,
            });
            if (this.isMap) {
                // this.map.add(this.labelLayer);
                // this.map.add(this.labelLayer_to);
                // this.map.add(this.labellayer_sun);
            }
        }
        //鼠标提示标签
        if (style.t_show) {
            if (this.infoWindow == null) {
                this.infoWindow = new AMap.InfoWindow({
                    content: ""
                });
            }
        }


        //if (this.isMap)
        {
            this.map.setFeatures(features);
            this.map.setPitch(style.pitch);

            this.map.setMapStyle("amap://styles/" + style.mapStyle);
            //添加地图贴图
            if(style.img_url){
                const lnglat_0=this.lnglatOffset(style.img_lnglat_0,style.img_Position,0);
                const lnglat_1=this.lnglatOffset(style.img_lnglat_1,style.img_Position,1);
                this.imageLayer = new AMap.ImageLayer({
                    url: style.img_url,
                    bounds: new AMap.Bounds(
                        lnglat_0,
                        lnglat_1
                    ),
                    opacity:style.img_opacity*0.01
                });
                this.map.setLayers([this.imageLayer]);
            }else if(this.imageLayer){
                this.map.remove(this.imageLayer);
            }
            //
            if (this.wx_status != style.v_wx) {
                if (style.v_wx) {
                    if (!this.imageLayer){
                        this.map.setLayers([this.sate, this.road]);
                    }else{
                        this.map.setLayers([this.sate, this.road,this.imageLayer]);
                    }

                } else {
                    this.map.remove(this.sate);
                    this.map.remove(this.road);
                }
                this.wx_status = style.v_wx;
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
            if (style.centerLnglat.trim() != "") {
                const lnglat = style.centerLnglat.split(",");
                if (lnglat.length == 2) {
                    if (this.checkLon(lnglat[0].trim()) && this.checkLat(lnglat[1].trim())) {
                        this.map.setZoomAndCenter(style.zoom, [lnglat[0], lnglat[1]]);
                    }
                } else {
                    const cname = style.centerLnglat.trim();
                    const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(cname)) > -1 && r.name.substring(3) == this.AreaFormatter(cname).substring(3))["items"];
                    if (area.length > 0) {
                        this.map.setZoomAndCenter(style.zoom, [area[0].center[0], area[0].center[1]]);
                    }
                }
            } else {
                this.map.setZoomAndCenter(style.zoom, this.centLnglat);
            }
        }

        this.titleStyle(style);
        //根据数据添加显示图形
        this.appendImage();
        if (this.renderConfig.isMock) {
            this.container.style.opacity = '0.3';
        } else {
            this.container.style.opacity = '1';
        }

        //this.map.setZoom(style.zoom);
    }


    public lnglatOffset(cont,pos,tp){
        const strs=cont.split(',');
        if (tp==0){
            const lng=parseFloat(strs[0])*1000000;
            const lat=parseFloat(strs[1])*1000000;
            return [(lng-pos.left)*0.000001,(lat-pos.top)*0.000001]
        }else if (tp==1){
            const lng=parseFloat(strs[0])*1000000;
            const lat=parseFloat(strs[1])*1000000;
            return [(lng-pos.right)*0.000001,(lat-pos.bottom)*0.000001]
        }
        return [106,38];
    }

    /***
     * 判断是否需要加载
     * 判断属性是否变化,如果有变化则需要改变
     * @param parm
     */
    public styleIsUpdate(parm){
        let _rek=false;
        if (this.beforeStyleConfig){
            for (const i in parm) {
                const key=parm[i];
                if((typeof this.beforeStyleConfig[key])=="object"){
                    if (JSON.stringify(this.beforeStyleConfig[key])!=JSON.stringify(this.styleConfig[key])){
                        _rek=true;
                        break;
                    }
                }else if (this.beforeStyleConfig[key]!=this.styleConfig[key]){
                    _rek=true;
                    break;
                }
            }
        }else{
            _rek=true;
        }
        return _rek;
    }

    /**
     * 获取rgb颜色透明度
     * @param color
     * @private
     */
    private getOpacity(color) {
        if (color.indexOf('#') > -1) {
            return 1;
        }
        const opacity = color.replace('regb(', '').replace(')', '').split(',')[3];
        return opacity;
    }

    /**
     * 调整css
     * @param style
     * @private
     */
    private titleStyle(style) {
        const t_01 = document.createTextNode(`.amap-info-content{border: ${style.t_border} ${style.t_border_px}px solid;border-radius: ${style.t_radius}px;padding: 0px;}`);
        const t_02 = document.createTextNode(`.bottom-center .amap-info-sharp{border-top: 8px solid ${style.t_border};}`);
        const t_03 = document.createTextNode(`.content-window-card{background-color: ${style.t_background};}`);

        //设置字体
        //fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
        const t_04 = document.createTextNode(`.input-title{color: ${style.t_titleStyle.color};font-family: '${style.t_titleStyle.fontFamily}';font-size: ${style.t_titleStyle.fontSize};font-style: ${style.t_titleStyle.fontStyle};font-weight: '${style.t_titleStyle.fontWeight}'}`);
        const t_05 = document.createTextNode(`.input-item{color: ${style.t_titleStyle.color};font-family: '${style.t_titleStyle.fontFamily}';font-size: ${style.t_titleStyle.fontSize};font-style: ${style.t_titleStyle.fontStyle};font-weight: '${style.t_titleStyle.fontWeight}'}`);

        const t_06 = document.createTextNode(`.amap-layers{background-color: ${style.map_color};background-image: url("${style.map_image}");background-repeat:no-repeat;background-size:100% 100%;}`);


        const domstyle = document.createElement('style');
        domstyle.appendChild(t_01);
        domstyle.appendChild(t_02);
        domstyle.appendChild(t_03);
        domstyle.appendChild(t_04);
        domstyle.appendChild(t_05);
        domstyle.appendChild(t_06);

        {
            const t_07 = document.createTextNode(`.amap-icon img {width: ${style.mark_icon_size_w}px;height: ${style.mark_icon_size_h}px;}`);
            domstyle.appendChild(t_07);
        }
        if (style.label_head_show) {
            const t_08 = document.createTextNode(`.conter{position:relative;width:${style.label_head_size_w}px;height:${style.label_head_size_h}px;line-height:${style.label_head_margin_top + style.label_head_size_h}px;background-size:100% 100%;background-repeat:no-repeat;background-image:url(${style.label_head_bg_image});background-color:rgba(255,0,119,0);}`);
            const t_09 = document.createTextNode(`.t_span{position: relative;width:100%;left:${style.label_head_margin_left}px;color:${style.t_TextStyle.color};font-family:'${style.t_TextStyle.fontFamily}';font-size:${parseFloat(style.t_TextStyle.fontSize)}px;font-style:'${style.t_TextStyle.fontStyle}';font-weight:'${style.t_TextStyle.fontWeight}'}`);
            domstyle.appendChild(t_08);
            domstyle.appendChild(t_09);
        }

        if (style.e_label_head_show) {
            const t_08 = document.createTextNode(`.e_conter{position:relative;width:${style.e_label_head_size_w}px;height:${style.e_label_head_size_h}px;line-height:${style.e_label_head_margin_top + style.e_label_head_size_h}px;background-size:100% 100%;background-repeat:no-repeat;background-image:url(${style.e_label_head_bg_image});background-color:rgba(255,0,119,0);}`);
            const t_09 = document.createTextNode(`.e_t_span{position: relative;width:100%;left:${style.e_label_head_margin_left}px;color:${style.e_t_TextStyle.color};font-family:'${style.e_t_TextStyle.fontFamily}';font-size:${parseFloat(style.e_t_TextStyle.fontSize)}px;font-style:'${style.e_t_TextStyle.fontStyle}';font-weight:'${style.e_t_TextStyle.fontWeight}'}`);
            domstyle.appendChild(t_08);
            domstyle.appendChild(t_09);
        }

        //根据不同的配置生成css
        if (style.c_customize_show){
            style.customize_bubble_title.forEach((x,i)=>{
                if (x.q_category.trim()) {
                    const t_08 = document.createTextNode(`.c_conter_${i}{position:relative;width:${x.label_head_size_w}px;height:${x.label_head_size_h}px;line-height:${x.label_head_margin_top + x.label_head_size_h}px;background-size:100% 100%;background-repeat:no-repeat;background-image:url(${x.label_head_bg_image});background-color:rgba(255,0,119,0);}`);
                    domstyle.appendChild(t_08);
                }
            });
        }

        //区域下钻后显示菜单 line-height
        {
            const t_pan_01 = document.createTextNode(`.wrapper-first{position:absolute;top:${style.area_bt_top}%;left:${style.area_bt_left}%;overflow:auto;z-index:999;border-left:1px solid ${style.area_bt_border};color:${style.area_bt_TextStyle.color};font-family:'${style.area_bt_TextStyle.fontFamily}';font-size:${parseFloat(style.area_bt_TextStyle.fontSize)}px;font-style:'${style.area_bt_TextStyle.fontStyle}';font-weight:'${style.area_bt_TextStyle.fontWeight}';line-height:${parseFloat(style.area_bt_TextStyle.fontSize) + 16}px;overflow: hidden;}`);
            const t_pan_02 = document.createTextNode(`.button28::before{background-color: ${style.area_bg_hv_color};border-top-color:${style.area_border_color};border-bottom-color:${style.area_border_color};}`);
            const t_pan_03 = document.createTextNode(`.button28::after{background-color:${style.area_bg_color}}`)

            domstyle.appendChild(t_pan_01);
            domstyle.appendChild(t_pan_02);
            domstyle.appendChild(t_pan_03);
        }
        {
            if (style.title_type == "bar") {
                const t_lablel = document.createTextNode(`.amap-marker-label{  text-align:center;  border:1px solid ${style.p_bg_color_bor};  padding:10px;  background: ${style.p_bg_color};  border-radius:${style.p_border_radius}px;color:${style.p_title_TextStyle.color};font-family:'${style.p_title_TextStyle.fontFamily}';font-size:${parseFloat(style.p_title_TextStyle.fontSize)}px;font-style:'${style.p_title_TextStyle.fontStyle}';font-weight:'${style.p_title_TextStyle.fontWeight}'}`);
                domstyle.appendChild(t_lablel);
            } else {
                const t_lablel = document.createTextNode('.amap-marker-label {  border: 0;  text-align:center;  background-color: transparent;}')
                domstyle.appendChild(t_lablel);
            }
        }

        document.body.appendChild(domstyle);
    }

    /**
     * 飞线中线点
     * @param style
     * @param th
     */
    public lineCenter(style, th) {
        //判断飞线中心点
        if (style.line_Lnglat.trim() != "") {
            const lnglat = style.line_Lnglat.split(",");
            if (lnglat.length == 2) {
                if (th.checkLon(lnglat[0].trim()) && th.checkLat(lnglat[1].trim())) {
                    this.line_center = [];
                    this.line_center.push({name: style.line_Lnglat.trim(), center: [lnglat[0], lnglat[1]]});
                }
            } else {
                const cname = style.line_Lnglat.trim();
                const area = jslinq(AreaJson).where(r => r.name.indexOf(th.AreaFormatter(cname)) > -1)["items"];
                if (area.length > 0) {
                    this.line_center = [];
                    this.line_center.push({name: cname, center: [area[0].center[0], area[0].center[1]]});
                }
            }
        }
    }

    public appendImage() {
        const th = this;

        //th.map.clearMap();

        if (this.loca) {
            //this.loca.clear();
        }

        //删除上次绘制的点
        th.scatters.forEach(x => {
            th.loca.remove(x.scatter);
        });

        th.breaths.forEach(x => {
            th.loca.remove(x.breath);
        });

        th.scatterYellow.forEach(x => {
            th.loca.remove(x.scatter);
        });

        th.scatters = [];
        th.breaths = [];
        th.scatterYellow=[];

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

        th.polylines = [];
        {
            this.mask = [];
            //区域
            if (!this.district) {
                this.district = new AMap.DistrictSearch({
                    subdistrict: 0,
                    extensions: 'all',
                    level: 'city'
                });
            }
            const _prism = new prism.Prism();
            _prism.buildChart(th);
        }

    }

    /**
     * 聚合
     * @param data
     * @private
     */
    private dataPointGroup(data, style) {
        const _leve = style.area_group_type;
        this.group_type = _leve;
        let ret_data = [];
        if (_leve == '1') {
            const json = jslinq(data).groupBy((x) => x['acroutes'][1])["items"];
            this.connectJson(json, ret_data)
            return ret_data;
        } else if (_leve == '2') {
            //合并
            {
                const json = jslinq(data).where(x => x['acroutes'].length > 2).groupBy((x) => x['acroutes'][1] && x['acroutes'][2])["items"];
                this.connectJson(json, ret_data)
            }
            {
                const json = jslinq(data).where(x => x['acroutes'].length == 2).groupBy((x) => x['acroutes'][1])["items"];
                this.connectJson(json, ret_data)
            }
            return ret_data;
        }
        return data;
    }

    /**
     * 拼接json
     * @param json
     * @param newJson
     * @private
     */
    private connectJson(json, newJson) {
        json.forEach((x) => {
            let s_num = 0;
            const areaNames = [];
            const obj = JSON.parse(JSON.stringify(x.elements[0]));
            const area = jslinq(AreaJson).where(r => r.adcode == x.key)["items"];
            if (area.length) {
                obj.properties.cityName = area[0].name;
            }
            x.elements.forEach((e) => {
                s_num += e.properties.ratio;
                areaNames.push(e.properties.cityName)
            });
            obj.properties.ratio = s_num;
            obj.properties.areaNames = areaNames;
            newJson.push(obj);
        })
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
        if (properties.e_icon_type == "PO") {
            states = states.concat(["e_icon_symbol"]);
        } else {
            states = states.concat(["e_icon_color"]);
        }
        if (!properties.r_icon_flash) {
            states = states.concat(["r_f_width", "r_f_duration", "icon_png",]);
        }
        //飞线
        if (!properties.line_show) {
            states = states.concat(['f_title_show', 'f_TextStyle', 'f_tb', 'f_lr', "line_state", "line_Lnglat", "line_lineWidth_star", "line_lineWidth_end", "line_height", "line_speed", "line_flowLength", "line_headColor", "line_trailColor", "line_lineColors"]);
            properties.f_title_show=false;
        }
        //鼠标提示
        if (!properties.t_show) {
            states = states.concat(["t_border", "t_border_px", "t_radius", "t_background", "t_titleStyle", "t_remain"])
        }
        //提示标签
        if (!properties.t_title) {
            states = states.concat(["t_TextStyle","title_type","customize_bubble_title","c_TextStyle","c_customize_show", "t_showNumber", "title_unit", "t_tb", "t_lr", "t_show", "t_border", "t_border_px", "t_radius", "t_background", "t_titleStyle", "t_remain", "label_head_show", "label_head_bg_image", "label_head_size_w", "label_head_size_h", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top", "mark_icon_image", "mark_icon_size_w", "mark_icon_size_h", "mark_offset","scat_bg_show", "scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration"]);
        }

        if(!properties.c_customize_show){
            states=states.concat(["customize_bubble_title","c_TextStyle"])
        }
        //提示标签类型

        //提示标签底图
        if (!properties.scat_bg_show) {
            states = states.concat(["scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration"])
        }

        //隐藏标签类型
        if (properties.title_type == "plex") {
            states = states.concat(["t_tb", "t_lr", "p_rolling", "p_height", "pr_radius", "p_sideNumber", "p_opacity", "p_topColor", "p_sideTopColor_1", "p_sideBottomColor", "p_title_TextStyle", "p_border_radius", "p_bg_color_bor", "p_bg_color"]);
        }
        if (properties.title_type == "simp") {
            states = states.concat(["p_height", "p_rolling", "pr_radius", "p_sideNumber", "p_opacity", "p_topColor", "p_sideTopColor_1", "p_sideBottomColor", "p_title_TextStyle", "label_head_show", "label_head_bg_image", "label_head_size_w", "label_head_size_h", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top", "mark_icon_image", "mark_icon_size_w", "mark_icon_size_h", "mark_offset","scat_bg_show", "scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration", , "p_border_radius", "p_bg_color_bor", "p_bg_color"]);
        }
        if (properties.title_type == "bar") {
            states = states.concat(["t_tb", "t_TextStyle", "t_lr", "label_head_show", "label_head_bg_image", "label_head_size_w", "label_head_size_h", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top", "mark_icon_image", "mark_icon_size_w", "mark_icon_size_h","mark_offset", "scat_bg_show", "scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration"]);
        }
        if (!properties.p_rolling) {
            states = states.concat(["p_title_TextStyle", "p_border_radius", "p_bg_color_bor", "p_bg_color"]);
        }
        //隐藏示标签
        if (!properties.label_head_show) {
            states = states.concat(["t_TextStyle", "label_head_bg_image", "label_head_size_w", "label_head_size_h", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top"]);
        }
        //3D设置
        if (!properties.pr_show) {
            states = states.concat(["pr_poly", "amb_show", "pr_areaName", "pr_Color", "pr_strokeWeight", "pr_borderWeight", "pr_outlineColor", "pr_strokeStyle", "amb_intensity", "amb_color", "dir_intensity", "dir_color", "dir_target", "dir_target", "dir_position", "opt_topColor", "opt_bottomColor", "opt_sideTopColor", "opt_sideBottomColor", "opt_altitude", "opt_height", "poly_cover","pr_mask", "poly_fillColor"]);
        }
        //区域轮廓
        if (!properties.pr_poly) {
            states = states.concat(['pr_Color', 'pr_outlineColor', 'pr_borderWeight', 'pr_strokeStyle', 'pr_strokeWeight'])
        }
        /**
         * 光照
         */
        if (!properties.amb_show) {
            states = states.concat(['amb_intensity', 'amb_color', 'dir_intensity', 'dir_color', 'dir_target', 'dir_target', 'dir_position',]);
        }
        /**
         * 遮罩
         */
        if (!properties.poly_cover) {
            states = states.concat(['poly_fillColor']);
        }

        //飞线标签
        if (!properties.f_title_show) {
            states = states.concat(['f_TextStyle',"e_title_type","e_label_head_show","e_scat_bg_show", 'f_tb', 'f_lr', 'e_icon_type', 'e_icon_color', 'e_icon_symbol', 'e_icon_size', 'e_r_icon_flash','e_r_f_width', 'e_r_f_duration', 'e_icon_png',"e_mark_icon_image", "e_mark_icon_size_w", "e_mark_icon_size_h","e_mark_offset"]);
            states=states.concat(["e_t_TextStyle", "e_label_head_bg_image", "e_label_head_size_w", "e_label_head_size_h", "e_label_head_pixel_x", "e_label_head_pixel_y", "e_label_head_margin_left", "e_label_head_margin_top"]);
            states=states.concat(["e_scat_bg_image", "e_scat_bg_size_w", "e_scat_bg_size_h", "e_scat_bg_altitude", "e_scat_bg_duration"]);
        }

        if(!properties.e_r_icon_flash){
            states = states.concat(['e_r_f_width', 'e_r_f_duration', 'e_icon_png']);
        }
        //显示底图
        if (!properties.e_scat_bg_show){
            states=states.concat(["e_scat_bg_image", "e_scat_bg_size_w", "e_scat_bg_size_h", "e_scat_bg_altitude", "e_scat_bg_duration"]);
        }

        if (properties.e_title_type=="plex"){
            states=states.concat(["f_TextStyle","f_tb","f_lr", 'e_icon_type', 'e_icon_color', 'e_icon_symbol', 'e_icon_size', 'e_r_icon_flash']);
        }
        if (properties.e_title_type=="simp"){
            states=states.concat(["e_label_head_show","e_scat_bg_show","e_mark_icon_image", "e_mark_icon_size_w", "e_mark_icon_size_h","e_mark_offset"]);
            states=states.concat(["e_t_TextStyle", "e_label_head_bg_image", "e_label_head_size_w", "e_label_head_size_h", "e_label_head_pixel_x", "e_label_head_pixel_y", "e_label_head_margin_left", "e_label_head_margin_top"]);

            states=states.concat(["e_scat_bg_image", "e_scat_bg_size_w", "e_scat_bg_size_h", "e_scat_bg_altitude", "e_scat_bg_duration"]);

        }
        //标签设置
        if (!properties.e_label_head_show){
            states=states.concat(["e_t_TextStyle", "e_label_head_bg_image", "e_label_head_size_w", "e_label_head_size_h", "e_label_head_pixel_x", "e_label_head_pixel_y", "e_label_head_margin_left", "e_label_head_margin_top"]);
        }

        //开启颜色填充
        if (!properties.am_bg_fill_bol) {
            states = states.concat(['am_bg_fill_color', 'am_fillOpacity', 'am_hover_fillOpacity']);
        }
        //隐藏导航条
        if (!properties.area_drill_down) {
            states = states.concat(['area_bt_top', 'area_bt_left', 'area_bt_border', 'area_bt_TextStyle', 'area_bg_color', 'area_bg_hv_color', 'area_border_color']);
        }
        //子区域绘制
        if (!properties.am_display) {
            states = states.concat(['am_strokeColor', 'am_bg_fill_bol', 'am_bg_fill_color', 'am_fillOpacity', 'am_hover_fillOpacity']);
        }
        //图点显示
        if(!properties.r_icon_show){
            states = states.concat(["unit", "r_icon_size", "icon_type", "icon_color", "icon_symbol", "icon_size", "r_icon_flash", "r_f_width", "r_f_duration", "icon_png", "customize_bubble"]);
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

        if (properties.e_icon_type !== "PO") {
            states = states.concat(["e_icon_symbol"]);
        } else {
            states = states.concat(["e_icon_color"]);
        }
        if (properties.r_icon_flash) {
            states = states.concat(["r_f_width", "r_f_duration", "icon_png",]);
        }

        //飞线
        if (properties.line_show) {
            states = states.concat(['f_title_show', 'f_TextStyle', 'f_tb', 'f_lr', "line_state", "line_Lnglat", "line_lineWidth_star", "line_lineWidth_end", "line_height", "line_speed", "line_flowLength", "line_headColor", "line_trailColor", "line_lineColors"]);
        }

        //显示底图
        if (properties.e_scat_bg_show){
            states=states.concat(["e_scat_bg_image", "e_scat_bg_size_w", "e_scat_bg_size_h", "e_scat_bg_altitude", "e_scat_bg_duration"]);
        }

        //标签设置
        if (properties.e_label_head_show){
            states=states.concat(["e_t_TextStyle", "e_label_head_bg_image", "e_label_head_size_w", "e_label_head_size_h", "e_label_head_pixel_x", "e_label_head_pixel_y", "e_label_head_margin_left", "e_label_head_margin_top"]);
        }

        //鼠标提示
        if (properties.t_show) {
            states = states.concat(["t_border", "t_border_px", "t_radius", "t_background", "t_titleStyle", "t_remain"])
        }
        //提示标签底图
        if (!properties.scat_bg_show) {
            states = states.concat(["scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration"])
        }
        //提示标签
        if (properties.t_title) {
            states = states.concat(["t_TextStyle","customize_bubble_title","c_TextStyle","c_customize_show","title_type", "t_showNumber", "title_unit", "t_tb", "t_lr", "t_show", "t_border", "t_border_px", "t_radius", "t_background", "t_titleStyle", "t_remain", "label_head_show", "label_head_bg_image", "label_head_size_w", "label_head_size_h", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top", "mark_icon_image", "mark_icon_size_w", "mark_icon_size_h","mark_offset", "scat_bg_show", "scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration"]);
        }

        if(properties.c_customize_show){
            states=states.concat(["customize_bubble_title","c_TextStyle"])
        }

        if (properties.e_title_type=="simp"){
            states=states.concat(["f_TextStyle","f_tb","f_lr", 'e_icon_type', 'e_icon_color', 'e_icon_symbol', 'e_icon_size', 'e_r_icon_flash']);
        }
        if (properties.e_title_type=="plex"){
            states=states.concat(["e_label_head_show","e_scat_bg_show","e_mark_icon_image", "e_mark_icon_size_w","mark_offset", "e_mark_icon_size_h"]);
        }
        //显示标签类型
        if (properties.title_type == "simp") {
            states = states.concat(["t_tb", "t_lr", "p_rolling", "t_TextStyle"]);
        }
        if (properties.title_type == "plex") {
            states = states.concat(["label_head_show", "p_rolling", "label_head_bg_image", "label_head_size_w", "label_head_size_h", "p_border_radius", "p_bg_color_bor", "p_bg_color", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top", "mark_icon_image", "mark_icon_size_w", "mark_icon_size_h","mark_offset", "scat_bg_show", "scat_bg_image", "scat_bg_size_w","title_unit", "scat_bg_size_h", "scat_bg_altitude", "scat_bg_duration"]);
        }
        if (properties.title_type == "bar") {
            states = states.concat(["p_height", "pr_radius", "p_sideNumber", "p_opacity", "p_topColor", "p_sideTopColor_1", "p_sideBottomColor", "p_title_TextStyle", "p_rolling", "p_border_radius", "p_bg_color_bor", "p_bg_color"]);
        }
        if (properties.p_rolling) {
            states = states.concat(["p_title_TextStyle", "p_border_radius", "p_bg_color_bor", "p_bg_color"]);
        }
        //显示标签
        if (properties.label_head_show) {
            states = states.concat(["label_head_bg_image", "t_TextStyle", "label_head_size_w", "label_head_size_h", "label_head_pixel_x", "label_head_pixel_y", "label_head_margin_left", "label_head_margin_top"]);
        }
        //3D设置
        if (properties.pr_show) {
            states = states.concat(['amb_show', "pr_poly", "pr_areaName", "pr_Color", "pr_strokeWeight", "pr_borderWeight", "pr_outlineColor", "pr_strokeStyle", "amb_intensity", "amb_color", "dir_intensity", "dir_color", "dir_target", "dir_target", "dir_position", "opt_topColor", "opt_bottomColor", "opt_sideTopColor", "opt_sideBottomColor", "opt_altitude", "opt_height", "poly_cover","pr_mask", "poly_fillColor"]);
        }
        //区域轮廓
        if (properties.pr_poly) {
            states = states.concat(['pr_Color', 'pr_outlineColor', 'pr_borderWeight', 'pr_strokeStyle', 'pr_strokeWeight'])
        }
        /**
         * 光照
         */
        if (properties.amb_show) {
            states = states.concat(['amb_intensity', 'amb_color', 'dir_intensity', 'dir_color', 'dir_target', 'dir_target', 'dir_position',]);
        }

        /**
         * 遮罩
         */
        if (properties.poly_cover) {
            states = states.concat(['poly_fillColor']);
        }
        //飞线标签
        if (properties.f_title_show) {
            states = states.concat(['f_TextStyle',"e_title_type","e_label_head_show","e_scat_bg_show", 'f_tb', 'f_lr', 'e_icon_type', 'e_icon_color', 'e_icon_symbol', 'e_icon_size', 'e_r_icon_flash','e_r_f_width', 'e_r_f_duration', 'e_icon_png',"e_mark_icon_image", "e_mark_icon_size_w","mark_offset", "e_mark_icon_size_h"]);
            states=states.concat(["e_t_TextStyle", "e_label_head_bg_image", "e_label_head_size_w", "e_label_head_size_h", "e_label_head_pixel_x", "e_label_head_pixel_y", "e_label_head_margin_left", "e_label_head_margin_top"]);
            states=states.concat(["e_scat_bg_image", "e_scat_bg_size_w", "e_scat_bg_size_h", "e_scat_bg_altitude", "e_scat_bg_duration"]);
        }

        if(properties.e_r_icon_flash){
            states = states.concat(['e_r_f_width', 'e_r_f_duration', 'e_icon_png']);
        }

        //开启颜色填充
        if (properties.am_bg_fill_bol) {
            states = states.concat(['am_bg_fill_color', 'am_fillOpacity', 'am_hover_fillOpacity']);
        }

        //显示导航条
        if (properties.area_drill_down) {
            states = states.concat(['area_bt_top', 'area_bt_left', 'area_bt_border', 'area_bt_TextStyle', 'area_bg_color', 'area_bg_hv_color', 'area_border_color']);
        }
        if (properties.am_display) {
            states = states.concat(['am_strokeColor', 'am_bg_fill_bol', 'am_bg_fill_color', 'am_fillOpacity', 'am_hover_fillOpacity']);
        }
        //图点显示
        if(!properties.r_icon_show){
            states = states.concat(["unit", "r_icon_size", "icon_type", "icon_color", "icon_symbol", "icon_size", "r_icon_flash", "r_f_width", "r_f_duration", "icon_png", "customize_bubble"]);
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