import '../style/visual.less';

// @ts-ignore
import AMap from 'AMap';
// @ts-ignore
import Loca from 'Loca';

import * as $ from 'jquery';
import jslinq from "jslinq";

import AreaJson from './AreaJson.json';
// @ts-ignore
import AMapUI from 'AMapUI';
/**
 * 图形类
 */
import bubble = require("./Bubble");
import point = require("./Point");
import line = require("./Line");
import card= require("./CardPoint");

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

    //地图中数据点
    private loca: any;
    private breaths: any;
    private scatters: any;
    private points: any;
    private bubbles: any;

    //路线
    private lines:any;

    //标牌点
    private cardDates:any;

    private styleConfig: any;
    private renderConfig: IRenderConfig;


    private format_3: any;
    private displayUnit_3: any;

    private host: any;
    private selectionManager: any;

    //路线设置
    private pathSimplifierIns:any;
    private PathSimplifier:any;

    /**
     * 当前所绑定数据的key
     * @private
     */
    // private num_key: any;
    // private add_key: any;
    // private lng_key: any;
    // private lat_key: any;
    /**
     * 提示信息
     * @private
     */
    private toolTipName: string[];

    private def_geo_path = 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/china_traffic_event.json';
    private def_png_blue = 'https://a.amap.com/Loca/static/loca-v2/demos/images/blue.png';

    private def_icon_plane="http://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/plane.png";
    private def_icon_car="http://webapi.amap.com/ui/1.1/ui/misc/PathSimplifier/examples/imgs/car.png";

    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.dom = dom;

        this.container = document.createElement('div');
        this.container.className = 'outer-box';
        this.container.id = 'container';

        this.dom.append(this.container);

        this.host = host;

        this.format_3 = {};
        this.scatters = [];
        this.breaths = [];
        this.points = [];
        this.bubbles = [];
        this.lines=[];
        this.cardDates=[];
        //创建地图
        this.map = new AMap.Map('container', {
            viewMode: "3D",
            mapStyle: "amap://styles/grey",
        });

        //路线设置
        const th=this;

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
        if (options.dataViews.length > 0) {
            //点图形
            {
                const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
                if (plainDataView) {
                    if(plainDataView.profile.address.values.length || (plainDataView.profile.lng.values.length && plainDataView.profile.lat.values.length)){
                        let add_key ;
                        let lng_key;
                        let lat_key;
                        let ll_type="A";
                        if (plainDataView.profile.address.values.length){
                            add_key = plainDataView.profile.address.values[0].display;
                            ll_type="A";
                        }
                        if(plainDataView.profile.lng.values.length && plainDataView.profile.lat.values){
                            lng_key = plainDataView.profile.lng.values[0].display;
                            lat_key = plainDataView.profile.lat.values[0].display;
                            ll_type="L";
                        }
                        const num_key = plainDataView.profile.numeric.values[0].display;
                        const cate_key = plainDataView.profile.category.values[0].display;
                        let img_key = "";
                        if (plainDataView.profile.img.values[0]) {
                            img_key = plainDataView.profile.img.values[0].display
                        }
                        if(ll_type=="A"){
                            const rest=this.addressToCoords(plainDataView.data,add_key,num_key,cate_key,img_key);
                            rest.forEach((x,i)=>{
                                data_point.push({
                                    "type": "Feature",
                                    "rid": i,
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
                            })
                        }else{
                            plainDataView.data.forEach((x, i) => {
                                if (this.checkLon(x[lng_key]) && this.checkLat(x[lat_key])) {
                                    data_point.push({
                                        "type": "Feature",
                                        "rid": i,
                                        "properties": {
                                            "cityName": x[add_key],
                                            "ratio": x[num_key],
                                            "img": img_key,
                                            "category": x[cate_key],
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                x[lng_key],
                                                x[lat_key]
                                            ]
                                        }
                                    });
                                }
                            });
                        }

                    }
                }
            }
            //路线图
            {
                const plainDataView = options.dataViews[1] && options.dataViews[1].plain;
                if (plainDataView) {
                    const add_key = plainDataView.profile.address.values[0].display;
                    const lnglat_key = plainDataView.profile.lnglat.values[0].display;
                    const cate_key = plainDataView.profile.category.values[0].display;
                    let image_key = "";
                    if (plainDataView.profile.cateImg.values.length>0){
                        image_key=plainDataView.profile.cateImg.values[0].display;
                    }
                    plainDataView.data.forEach((x, i) => {
                        const coords = this.isJsonString(x[lnglat_key]);
                        if (coords.length > 0) {
                            if (this.styleConfig.l_category!="track"){
                                data_line.push(
                                    {
                                        "type": "Feature",
                                        "rid": i,
                                        "properties": {
                                            "cityName": x[add_key],
                                            "category": x[cate_key],
                                        },
                                        "geometry": {
                                            "type": "LineString",
                                            "coordinates": coords
                                        }
                                    });
                            }else{
                                data_line.push(
                                    {
                                        "rid":i,
                                        "name":x[add_key],
                                        "path":coords,
                                        "image":image_key == ""?"":x[image_key],
                                        "cate":x[cate_key]
                                    });
                            }
                        }

                    });
                }
            }
            //牌点图
            {
                const plainDataView = options.dataViews[2] && options.dataViews[2].plain;
                if (plainDataView) {
                    const num_key = plainDataView.profile.numeric.values[0].display;
                    const title_key = plainDataView.profile.title.values[0].display;
                    let add_key = "";
                    let rt_type='A';
                    if (plainDataView.profile.address.values.length>0){
                        add_key=plainDataView.profile.address.values[0].display;
                        rt_type='A';
                    }
                    let lng_key = "";
                    let lat_key = "";
                    if (plainDataView.profile.lng.values.length>0 && plainDataView.profile.lat.values.length>0){
                        lng_key = plainDataView.profile.lng.values[0].display;
                        lat_key = plainDataView.profile.lat.values[0].display;
                        rt_type='L';
                    }
                    plainDataView.data.forEach((x, i) => {
                        let lng;
                        let lat;
                        let bol=false;
                        if (rt_type=='L'){
                            if(this.checkLon(x[lng_key]) && this.checkLat(x[lat_key])){
                                lng=x[lng_key];
                                lat=x[lat_key];
                                bol=true;
                            }
                        }else{
                            const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(x[add_key])) > -1 && r.name.substring(3)==this.AreaFormatter(x[add_key]).substring(3) )["items"];
                            if (area.length){
                                lng=area[0].center[0];
                                lat=area[0].center[1];
                                bol=true;
                            }
                        }
                        if (bol) {
                            data_cardPoint.push(
                                {
                                    "type": "Feature",
                                    "rid": i,
                                    "properties": {
                                        "name": x[title_key],
                                        "price": x[num_key]
                                    },
                                    "geometry": {
                                        "type": "Point",
                                        "coordinates": [
                                            lng,
                                            lat
                                        ]
                                    }
                                });
                        }
                    });

                    this.format_3 = plainDataView.profile.numeric.values[0].format;
                    this.displayUnit_3 = plainDataView.profile.numeric.options.valueDisplayUnit;
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
                data_cardPoint:{
                    "type": "FeatureCollection",
                    "features": data_cardPoint
                },
                isMock: false
            }
        }
        else {
            const result = $.ajax({url: this.def_geo_path, async: false}).responseJSON;
            const data = [];
            result.features.forEach((x, i) => {
                if (i%5==0){
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
                }
            });


            this.renderConfig = {
                data_point: {
                    "type": "FeatureCollection",
                    "features": data
                },
                data_line: {
                    "type": "FeatureCollection",
                    "features": []
                },
                data_cardPoint:{
                    "type": "FeatureCollection",
                    "features": []
                },
                isMock: true
            }
        }

        this.render();
    }


    public addressToCoords(datas,add_key,num_key,cate_key,img_key){
        const data_point=[];
        datas.forEach(x=>{
            const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(x[add_key])) > -1 && r.name.substring(3)==this.AreaFormatter(x[add_key]).substring(3) )["items"];
            if (area.length){
                data_point.push({
                    add:area[0].name,
                    num:x[num_key],
                    lng:area[0].center[0],
                    lat:area[0].center[1],
                    cate:x[cate_key],
                    img:x[img_key]
                })
            }
        });
        const ret_data_point=[];
        const items=jslinq(data_point).groupBy(x=>x.add)["items"];
        items.forEach(x=>{
            let num=0;
            let cate="";
            let img="";
            x.elements.forEach(r=>{
                num+=r.num;
                if (cate==""){
                    cate=r.cate;
                }
                if (img!=""){
                    img=r.img;
                }
            });
            ret_data_point.push({
                add:x.key,
                num,
                lng:x.elements[0].lng,
                lat:x.elements[0].lat,
                cate,
                img
            })
        })
        return ret_data_point;
    }

    /**
     * 格式化区县名称
     * @param name
     * @constructor
     */
    public AreaFormatter(name){
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
    public formatData = (number,format,displayUnit_3) => {
        const formatService = this.host.formatService;
        let realDisplayUnit = displayUnit_3;
        if (formatService.isAutoDisplayUnit(realDisplayUnit)) {
            realDisplayUnit = formatService.getAutoDisplayUnit([number]);
        }
        return formatService.format(format, number, realDisplayUnit);
    }
    /**
     * 数据加载方法
     * 2022.01.20
     */
    public render() {
        const style = this.styleConfig;

        //显示标记
        var features = [];
        if (style.v_bg) {
            features.push('bg');
        }
        if (style.v_road) {
            features.push('road');
        }
        if (style.v_building) {
            features.push('building');
        }
        if (style.v_point) {
            features.push('point');
        }
        this.map.setPitch(style.pitch);
        //this.map.setFeatures(features);
        this.map.setMapStyle("amap://styles/" + style.mapStyle);
        this.map.setZoom(this.styleConfig.zoom);
        //判断是否输入了地图中心点
        let bool = false;
        if (this.styleConfig.centerLnglat.trim()!= "") {
            const lnglat = this.styleConfig.centerLnglat.split(",");
            if (lnglat.length == 2) {
                if (this.checkLon(lnglat[0].trim()) && this.checkLat(lnglat[1].trim())) {
                    this.map.setZoomAndCenter(this.styleConfig.zoom, [lnglat[0], lnglat[1]]);
                    bool = true;
                }
            }
        }

        //根据数据添加显示图形
        this.appendImage();
    }

    public appendImage() {
        const th = this;

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
        th.points = [];
        th.bubbles = [];

        //删除已添加的线
        th.lines.forEach(x => {
            th.loca.remove(x.line);
        });
        th.lines = [];
        //图点设置
        if (this.styleConfig.icon_category == "point") {
            const _point = new point.Point();
            _point.buildChart(th);
        } else {
            const _bubble = new bubble.Bubble();
            _bubble.buildChart(th);
        }
        //路线设置
        if (th.renderConfig.data_line.features.length>0){
            if (th.styleConfig.l_category == "track") {
                th.map.setStatus({
                    rotateEnable: false,
                    pitchEnable:false
                });
                th.map.setPitch(0);
                th.map.setRotation(0)
            }else{
                th.map.setStatus({
                    viewMode: "3D"
                });
            }
            const _line=new line.Line();
            _line.buildChart(th);
        }

        //删除已经添加的牌点信息
        th.cardDates.forEach(x => {
            th.loca.remove(x.loca_1);
            th.loca.remove(x.loca_2);
            th.loca.remove(x.loca_3);
            th.loca.remove(x.loca_4);
        });
        th.cardDates=[];
        //牌点
        if (this.renderConfig.data_cardPoint.features.length>0){
            const _card=new card.CardPoint();
            _card.buildChart(th);
            const lnglat=this.renderConfig.data_cardPoint.features[0].geometry.coordinates;
            this.map.setZoomAndCenter(this.styleConfig.zoom, [lnglat[0], lnglat[1]]);
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
        if (reg.test(lon)){
            if (parseFloat(lon)>=-180 && parseFloat(lon)<=180){
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
        if (reg.test(lat)){
            if (parseFloat(lat)>=-90 && parseFloat(lat)<=90){
                return true;
            }
        }
        return false;
    };

    public onDestroy(): void {

    }

    /**
     * 隐藏
     * @param options
     * @returns
     */
    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        let properties = options.properties;
        let states = [];
        //图形类别
        if (properties.icon_category != "point") {
            states = states.concat(["icon_type", "icon_size", "icon_color", "icon_bor", "icon_bw", "icon_symbol", "r_icon_width", "r_f_width", "r_f_height", "r_f_duration", "icon_png", "customize", "r_icon_flash", "r_icon_height"]);
        } else {
            states = states.concat(["q_type", "q_blend", "q_color", "q_bor", "q_size", "q_bw", "q_icon", "q_icon_width", "q_icon_height", "q_moving", "q_icon_rotation", "q_animate", "customize_bubble"]);
        }
        if (properties.icon_type == "PO") {
            states = states.concat(["icon_symbol", "r_icon_width", "r_icon_height"]);
        } else {
            states = states.concat(["icon_size", "icon_color", "icon_bor", "icon_bw"]);
        }
        //闪点
        if (!properties.r_icon_flash) {
            states = states.concat(["r_f_width", "r_f_height", "r_f_duration", "icon_png"]);
        }
        //气泡类型 点类型
        if (properties.q_type != "point") {
            states = states.concat(["q_blend", "q_size", "q_color", "q_bor", "q_bw"]);
        } else {
            states = states.concat(["q_icon_width", "q_icon_height", "q_icon", "q_icon_rotation", "q_animate"]);
        }
        //路线 属性配置
        if(properties.l_category=="line"){
            states=states.concat(["p_colors_t","p_colors_w","p_interval","p_duration"]);
            states=states.concat(["lx_colors","lx_sel_colors","lx_xs_colors","l_type","l_line_show","l_icon","l_speed","l_Width","l_icon_Width","l_icon_Width","l_icon_height","l_icon_height","customize_line"]);
        }else if(properties.l_category=="pulse"){
            states=states.concat(["l_colors","l_borderColor","l_borderWidth","l_alt_status"]);
            states=states.concat(["lx_colors","lx_sel_colors","lx_xs_colors","l_type","l_line_show","l_icon","l_speed","l_Width","l_icon_Width","l_icon_Width","l_icon_height","l_icon_height","customize_line"]);
        }else if(properties.l_category=="track"){
            states=states.concat(["p_colors_t","p_colors_w","p_interval","p_duration"]);
            states=states.concat(["l_colors","l_borderColor","l_borderWidth","l_alt_status","l_lineWidth","l_altitude"]);
        }
        //视觉效果
        if (!properties.p_rolling){
            states=states.concat(["p_pitch","p_rotation","p_time","p_zoom","p_sj_time","p_round","p_offset_top","p_offset_left"]);
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
        //图形类别
        if (properties.icon_category == "point") {
            states = states.concat(["icon_type", "icon_size", "icon_color", "icon_bor", "icon_bw", "icon_symbol", "r_icon_width", "r_f_width", "r_f_height", "r_f_duration", "icon_png", "customize", "r_icon_flash", "r_icon_height"]);
        } else {
            states = states.concat(["q_type", "q_blend", "q_color", "q_bor", "q_size", "q_bw", "q_icon", "q_icon_width", "q_icon_height", "q_moving", "q_icon_rotation", "q_animate", "customize_bubble"]);
        }
        if (properties.icon_type == "PO") {
            states = states.concat(["icon_size", "icon_color", "icon_bor", "icon_bw"]);
        } else {
            states = states.concat(["icon_symbol", "r_icon_width", "r_icon_height"]);
        }
        //闪点
        if (!properties.r_icon_flash) {
            states = states.concat(["r_f_width", "r_f_height", "r_f_duration", "icon_png"]);
        }
        //气泡类型 点类型
        if (properties.q_type == "point") {
            states = states.concat(["q_blend", "q_size", "q_color", "q_bor", "q_bw"]);
        } else {
            states = states.concat(["q_icon_width", "q_icon_height", "q_icon", "q_icon_rotation", "q_animate"]);
        }

        //路线 属性配置
        if(properties.l_category=="line"){
            states=states.concat(["l_colors","l_borderColor","l_borderWidth","l_alt_status","l_lineWidth","l_altitude"]);
        }else if(properties.l_category=="pulse"){
            states=states.concat(["p_colors_t","p_colors_w","p_interval","p_duration","l_lineWidth","l_altitude"]);
        }else if(properties.l_category=="track"){
            states=states.concat(["lx_colors","lx_sel_colors","lx_xs_colors","l_type","l_line_show","l_icon","l_speed","l_Width","l_icon_Width","l_icon_Width","l_icon_height","l_icon_height","customize_line"]);
        }

        //视觉效果
        if (properties.p_rolling){
            states=states.concat(["p_pitch","p_rotation","p_time","p_zoom","p_sj_time","p_round","p_offset_top","p_offset_left"]);
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
    public dateLog(type){
        const tName=type==0?"开始":"结束";
        console.log(tName,this.dateFtt(new Date()));
    }
    /**
     * 时间格式化
     * @param date
     * @param fmt
     */
    public dateFtt(date,fmt="yyyy-MM-dd hh:mm:ss.S"){
        var o = {
            "M+" : date.getMonth()+1,                 //月份
            "d+" : date.getDate(),                    //日
            "h+" : date.getHours(),                   //小时
            "m+" : date.getMinutes(),                 //分
            "s+" : date.getSeconds(),                 //秒
            "q+" : Math.floor((date.getMonth()+3)/3), //季度
            "S"  : date.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    }
}