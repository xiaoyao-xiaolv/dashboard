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
import point = require("./Point");

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


    //标牌点
    private cardDates: any;

    private maxNum:any;

    private styleConfig: any;
    private renderConfig: IRenderConfig;


    private format_3: any;
    private displayUnit_3: any;

    private host: any;
    private selectionManager: any;



    private road: any;
    private sate: any;
    private _index:any;
    private _interval:any;
    private mk:any;
    private pl:any;

    /**
     * 当前所绑定数据的key
     * @private
     */
    private num_key: any;
    private cate_key:any;
    private add_key: any;
    private lng_key: any;
    private lat_key: any;
    /**
     * 提示信息
     * @private
     */
    private toolTipName: string[];

    private def_geo_path = 'https://a.amap.com/Loca/static/loca-v2/demos/mock_data/china_traffic_event.json';

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
        this.cardDates = [];


        //创建地图
        this.map = new AMap.Map('container', {
            viewMode: "3D",
            features: ['bg', 'road', 'building', 'point'],
            center: [116.408075, 39.950187],
            mapStyle: "amap://styles/grey",
        });

        this.sate = new AMap.TileLayer.Satellite();
        this.road = new AMap.TileLayer.RoadNet();
        this._index=0;
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
                    if (ll_type == "A") {
                        const rest = this.addressToCoords(plainDataView.data, this.add_key, this.num_key, this.cate_key);
                        rest.forEach((x, i) => {
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
                    } else {
                        plainDataView.data.forEach((x, i) => {
                            if (this.checkLon(x[this.lng_key]) && this.checkLat(x[this.lat_key])) {
                                data_point.push({
                                    "type": "Feature",
                                    "rid": i,
                                    "properties": {
                                        "cityName": x[this.add_key],
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
        } else {
            const result = $.ajax({url: this.def_geo_path, async: false}).responseJSON;
            const data = [];
            result.features.forEach((x, i) => {
                if (i % 5 == 0) {
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
                data_cardPoint: {
                    "type": "FeatureCollection",
                    "features": []
                },
                isMock: true
            }
        }

        this.render();
    }


    public addressToCoords(datas, add_key, num_key, cate_key) {
        const data_point = [];
        datas.forEach(x => {
            const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(x[add_key])) > -1 && r.name.substring(3) == this.AreaFormatter(x[add_key]).substring(3))["items"];
            if (area.length) {
                data_point.push({
                    num: x[num_key],
                    add: area[0].name,
                    cate: x[cate_key],
                    lng: area[0].lng,
                    lat: area[0].lat
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
                lng: x.elements[0].lng,
                lat: x.elements[0].lat,
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
    public formatData = (number, format, displayUnit_3) => {
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

        this.map.setPitch(style.pitch);


        this.map.setMapStyle("amap://styles/" + style.mapStyle);
        this.map.setZoom(this.styleConfig.zoom);
        if (style.v_wx) {
            this.map.setLayers([this.sate, this.road]);
        } else {
            this.map.remove(this.sate);
            this.map.remove(this.road);
        }

        this.map.setStatus({
            rotateEnable: style.rotateEnable,
            pitchEnable:false,
            zoomEnable:style.zoomEnable,
            dragEnable:style.dragEnable,
            keyboardEnable: false,
            doubleClickZoom: false,
        });
        //判断是否输入了地图中心点
        let bool = false;
        if (this.styleConfig.centerLnglat.trim() != "") {
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

        //图点设置
        if (this.styleConfig.icon_category == "point") {
            const _point = new point.Point();
            _point.buildChart(th);
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