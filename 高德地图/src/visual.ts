import '../style/visual.less';
import '../style/area.css';


// @ts-ignore
import AMap from 'AMap';
// @ts-ignore
import AMapUI from 'AMapUI';
import AreaJson from './AreaJson.json';

import $ from 'jquery';
import jslinq from "jslinq";

interface IRenderConfig {
    jData;
    data_type: string;
    isMock: boolean;
}


export default class Visual extends WynVisual {

    private static defaultConfig: IRenderConfig = {
        jData: [],
        data_type: 'Q',
        isMock: true
    }

    private dom: HTMLDivElement;
    private container: HTMLDivElement;
    private panel: HTMLDivElement;
    private map: any;

    private styleConfig: any;
    private renderConfig: IRenderConfig;

    /**
     * 当前所绑定数据的key
     * @private
     */
    private num_key: any;
    private add_key_1: any;
    private add_key_2: any;
    private add_key_3: any;
    private lng_key: any;
    private lat_key: any;


    /**
     * 记录点击节点
     * @private
     */
    private parentInfo = [];

    /**
     * 根据地区聚合数据
     */
    private groupInfos = [];
    private groupItems = [];
    private features = [];
    private max_num = 1;
    private currentAreaNode:any;
    private old_groupInfo:any;
    private this_level:boolean;
    private this_adcode:bigint;

    /**
     * 数据联动
     */
    private items: any;
    private items_1: any;
    private items_2: any;
    private items_3: any;
    private items_adcode=[];
    private host: any;
    private selectionManager: any;
    private city_leve=0;

    /***
     *
     * @param dom
     * @param host
     * @param options
     */

    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.dom = dom;

        this.container = document.createElement('div');
        this.container.className = 'outer-box';
        this.container.id = 'container';

        this.panel = document.createElement('div');
        this.panel.id = 'panel';
        this.panel.className = 'wrapper-first';

        this.dom.append(this.container);
        this.dom.append(this.panel);

        this.host = host;
        this.selectionManager = host.selectionService.createSelectionManager();

    }

    private clickHandler = () => {
        switch (this.city_leve) {
            case 1:
                this.items=this.items_1;
                break;
            case 2:
                this.items=this.items_2;
                break;
            case 3:
                this.items=this.items_3;
                break;
            default:
                this.items=this.items_1;

        }
        if (this.this_level==false) {
            const areids = [];
            const areids_add = [];
            this.groupInfos.forEach((x) => {
                if (x.level == 0) {
                    if (areids.indexOf(x.adcode) == -1) {
                        areids.push(x.adcode);
                    }
                }
                if (x.level == 1) {
                    if (areids.indexOf(x.parent) == -1) {
                        areids.push(x.parent);
                    }
                }
                if (x.level == 2) {
                    let name1 = "";
                    let name2 = "";
                    let name3 = x.adname;
                    x.acroutes.forEach((xc, i) => {
                        if (xc != 100000) {
                            const revvs = jslinq(AreaJson).where(x => x.adcode == xc)["items"][0];
                            if (i == 1) {
                                name1 = revvs.name;
                            } else if (i == 2) {
                                name2 = revvs.name;
                            }
                        }
                    });
                    areids_add.push({
                        name1: name1,
                        name2: name2,
                        name3: name3
                    });
                }
            });

            this.selectionManager.clear();
            if (areids.length > 0) {
                areids.forEach((xr) => {
                    this.items.forEach((xxc) => {
                        if (xxc.acode.indexOf(xr)>-1) {
                            const {selectionId} = xxc;
                            if (!this.selectionManager.contains(selectionId)) {
                                this.selectionManager.select(selectionId, true);
                            }
                        }
                    })
                })
            }
            if (areids_add.length) {
                areids_add.forEach((xxce) => {
                    this.items.forEach((xxc) => {
                        if (xxc.name_1 == xxce.name1 && xxc.name_2 == xxce.name2 && xxc.name_3 == xxce.name3) {
                            const {selectionId} = xxc;
                            if (!this.selectionManager.contains(selectionId)) {
                                this.selectionManager.select(selectionId, true);
                            }
                        }
                    })
                });
            }
            //console.log('asdf',this.selectionManager.getSelectionIds());
        }else{
            this.selectionManager.clear();
            const selectionId = this.getNodeSelectionId(this.this_adcode)
            if (!this.selectionManager.contains(selectionId)) {
                this.selectionManager.select(selectionId, true);
            } else {
                this.selectionManager.clear(selectionId);
            }
        }
    }
    public getNodeSelectionId = (key: any) => {
        const { selectionId }  = this.items.find((item: any) => item.adcode == key);
        return selectionId
    }

    public toDrilling() {
        const selectionId = this.selectionManager.getSelectionIds();
        this.host.commandService.execute([{
            name: 'Jump',
            payload: {
                selectionIds: selectionId,
            }
        }])

    }

    public update(options: VisualNS.IVisualUpdateOptions) {

        console.log(1,(new Date()).getTime())
        this.styleConfig = options.properties;
        const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
        let data_type = "Q";
        if (plainDataView) {
            this.num_key = plainDataView.profile.numeric.values[0].display;
            if (plainDataView.profile.address.values.length > 0) {

                this.add_key_1 = "";
                this.add_key_2 = "";
                this.add_key_3 = "";

                plainDataView.profile.address.values.forEach((x, i) => {
                    if (i == 0) {
                        this.add_key_1 = x.display;
                    } else if (i == 1) {
                        this.add_key_2 = x.display;
                    } else if (i == 2) {
                        this.add_key_3 = x.display;
                    }
                });

                data_type = 'A';
                this.items_adcode=[];
                this.groupItems = plainDataView.data.map((rd) => {
                    let name_1 = rd[this.add_key_1].toString().trim();
                    let name_2 = this.add_key_2 == "" ? "" : rd[this.add_key_2].toString().trim();
                    let name_3 = this.add_key_3 == "" ? "" : rd[this.add_key_3].toString().trim();
                    let r_num = 0;
                    let acroutes = 1;
                    //查询
                    let rt_1 = jslinq(AreaJson).where(x => x.name.indexOf(name_1) > -1)["items"];
                    if (rt_1.length > 0) {
                        r_num = 1;
                    } else {
                        r_num = 0;
                        rt_1 = AreaJson[0];
                    }
                    this.items_adcode.push(rt_1[0].adcode.toString());
                    let rt_2 = [];
                    if (name_2 != "") {
                        acroutes++;
                        rt_2 = jslinq(AreaJson).where(x => x.name.indexOf(name_2.toString()) > -1 && x.parent == rt_1[0].adcode)["items"];
                    }
                    if (rt_2.length > 0) {
                        r_num = 2;
                    } else {
                        rt_2 = jslinq(AreaJson).where(x => x.parent == rt_1[0].adcode)["items"];
                    }
                    let rt_3 = [];
                    if (name_3 != "") {
                        acroutes++;
                        rt_3 = jslinq(AreaJson).where(x => x.name.indexOf(name_3.toString()) > -1 && x.parent == rt_2[0].adcode)["items"];
                    }
                    if (rt_3.length > 0) {
                        r_num = 3;
                    } else {
                        rt_3 = jslinq(AreaJson).where(x => x.parent == rt_2[0].adcode)["items"];
                    }
                    let adcode = rt_1[0].adcode;
                    let parent = rt_1[0].parent;
                    let adname = rt_1[0].name;
                    let acode = rt_1[0].acroutes;
                    name_1 = rt_1[0].name;
                    if (rt_2.length > 0) {
                        adcode = rt_2[0].adcode;
                        parent = rt_2[0].parent;
                        adname = rt_2[0].name;
                        acode = rt_2[0].acroutes;
                        name_2 = rt_2[0].name;
                    }
                    if (rt_3.length > 0) {
                        adcode = rt_3[0].adcode;
                        parent = rt_3[0].parent;
                        adname = rt_3[0].name;
                        acode = rt_3[0].acroutes;
                        name_3=rt_3[0].name;
                    }
                    return {
                        adcode: adcode,
                        parent: parent,
                        adname: adname,
                        name: name_1 + "|" + name_2 + "|" + name_3 + "|",
                        acroutes: acroutes,
                        acode: acode,
                        name_1: name_1,
                        name_2: name_2,
                        name_3: name_3,
                        r_num:r_num,
                        value: rd[this.num_key]
                    };
                });
            }
            if (plainDataView.profile.lng.values.length > 0 && plainDataView.profile.lat.values.length > 0) {
                this.lng_key = plainDataView.profile.lng.values[0].display;
                this.lat_key = plainDataView.profile.lat.values[0].display;
                data_type = 'L';
                this.groupItems = plainDataView.data.map((rd) => {
                    return {
                        adcode: 0,
                        name: "",
                        lng: rd[this.lng_key],
                        lat: rd[this.lat_key],
                        value: rd[this.num_key]
                    };
                });
            }
            if (data_type != "Q") {
                this.renderConfig = {
                    jData: plainDataView.data,
                    data_type: data_type,
                    isMock: true
                }
                plainDataView.data.push({})
                for (let j = 0; j < plainDataView.profile.address.values.length; j++) {
                    this.appendItems(plainDataView,data_type,j);
                }

            } else {
                this.renderConfig = Visual.defaultConfig;
            }
        } else {
            this.renderConfig = Visual.defaultConfig;
        }
        this.render();
        console.log(2,(new Date()).getTime())
    }

    public appendItems(plainDataView,data_type,ik){
        const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
            const selectionId = this.host.selectionService.createSelectionId();
            if (data_type == 'A') {
                for (let j = 0; j <=ik; j++) {
                    selectionId.withDimension(plainDataView.profile.address.values[j], item);
                }
                let rmv = {
                    adcode: 0,
                    adname: '',
                    parent: 0,
                    name: '',
                    name_1: '',
                    name_2: '',
                    name_3: '',
                    acode: '',
                    r_num:0
                };

                let acroutes = 1;
                let name_1 = "";
                let name_2 = "";
                let name_3 = "";
                if (item[this.add_key_1]) {
                    name_1 = item[this.add_key_1].toString().trim();
                    name_2 = this.add_key_2 == "" ? "" : item[this.add_key_2].toString().trim();
                    name_3 = this.add_key_3 == "" ? "" : item[this.add_key_3].toString().trim();
                    //查询
                    //查询
                    let rt_1 = jslinq(AreaJson).where(x => x.name.indexOf(name_1) > -1)["items"];
                    if (rt_1.length == 0) {
                        let rt_1 = AreaJson[0];
                    }
                    let rt_2 = [];
                    if (name_2 != "") {
                        acroutes++;
                        rt_2 = jslinq(AreaJson).where(x => x.name.indexOf(name_2.toString()) > -1 && x.parent == rt_1[0].adcode)["items"];
                    }
                    if (rt_2.length > 0) {
                    } else {
                        rt_2 = jslinq(AreaJson).where(x => x.parent == rt_1[0].adcode)["items"];
                    }
                    let rt_3 = [];
                    if (name_3 != "") {
                        acroutes++;
                        rt_3 = jslinq(AreaJson).where(x => x.name.indexOf(name_3.toString()) > -1 && x.parent == rt_2[0].adcode)["items"];
                    }
                    if (rt_3.length > 0) {
                    } else {
                        rt_3 = jslinq(AreaJson).where(x => x.parent == rt_2[0].adcode)["items"];
                    }
                    if (rt_1.length > 0)
                        name_1 = rt_1[0].name;
                    if (rt_2.length > 0)
                        name_2 = rt_2[0].name;
                    if (rt_3.length > 0)
                        name_3 = rt_3[0].name;

                    rmv = jslinq(this.groupItems).where(x => x.name == name_1 + "|" + name_2 + "|" + name_3 + "|")["items"][0];
                }
                result.push({
                    adcode: rmv.adcode,
                    parent: rmv.parent,
                    adName: rmv.adname,
                    name: name_1 + "|" + name_2 + "|" + name_3 + "|",
                    acroutes: acroutes,
                    acode: rmv.acode,
                    name_1: name_1,
                    name_2: name_2,
                    name_3: name_3,
                    r_num:rmv.r_num,
                    selectionId
                });
            } else {
                selectionId.withDimension(plainDataView.profile.numeric.values[0], item);
                result.push({
                    key: item[this.lng_key] ? `${item[this.lng_key]}-${item[this.lat_key]}` : "-",
                    adcode: 0,
                    parent: 0,
                    adName: '',
                    selectionId
                });
            }
            return result;
        }, []);

        switch (ik){
            case 0:
                this.items_1=items
                break;
            case 1:
                this.items_2=items
                break;
            case 2:
                this.items_3=items
                break;
        }
    }

    public render() {

        const style = this.styleConfig;

        //销毁地图
        this.map && this.map.destroy();
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

        //创建地图
        this.map = new AMap.Map('container', {
            viewMode: "3D",
            zoom: style.zoom,
            mapStyle: "amap://styles/" + style.mapStyle,
            features: features,
            showLabel: style.v_title,
            lang: style.lang,
            defaultCursor: 'default',
            pitch: style.pitch
        });
        //卫星地图
        var satelliteLayer = new AMap.TileLayer.Satellite();
        var roadNetLayer = new AMap.TileLayer.RoadNet();

        if (style.v_wx) {
            this.map.add(satelliteLayer);
        }

        if (style.v_dl) {
            this.map.add(roadNetLayer);
        }


        //css
        const t_01=document.createTextNode(`.wrapper-first{position:absolute;top:${style.bt_top}%;left:${style.bt_left}%;overflow:auto;z-index:999;border-left:1px solid #c9c0c0;}`);
        const domstyle = document.createElement('style');
        document.body.appendChild(domstyle);
        domstyle.appendChild(t_01);

        this.areaDrillDown();

    }

    /**
     * 地图向下钻取
     */
    public areaDrillDown() {

        // var colors = [
        //     "#90caf9",
        //     "#64b5f6",
        //     "#42a5f5",
        //     "#2196f3",
        //     "#1e88e5",
        //     "#1976d2",
        //     "#1565c0",
        //     "#0d47a1",
        //     "#0240a2",
        // ];
        var colors=[];
        const th = this;
        th.styleConfig.map_colors.forEach((x)=>{
            colors.push(x);
        })


        //记录点击节点
        this.parentInfo = [{
            cityName: '全国',
            code: 100000,
        }];


        AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function (DistrictExplorer, $) {

            pushAdcode();
            //创建一个实例
            var districtExplorer = new DistrictExplorer({
                eventSupport: true, //打开事件支持
                map: th.map
            });

            //当前聚焦的区域
            var currentAreaNode = null;

            //鼠标hover提示内容
            var $tipMarkerContent = $('<div class="tipMarker top"></div>');

            var tipMarker = new AMap.Marker({
                content: $tipMarkerContent.get(0),
                offset: new AMap.Pixel(0, 0),
                bubble: true
            });

            /**
             * 提示标签样式内容
             * @param feature
             * @param isHover
             * @param position
             */
            function toggleHoverFeature(feature, isHover, position) {

                if(th.styleConfig.show_title) {
                    tipMarker.setMap(isHover ? th.map : null);
                }
                if (!feature) {
                    return;
                }

                var props = feature.properties;

                const rf = th.groupInfos.filter(function (p) {
                    return p.adcode == props.adcode && p.r_num>=props.acroutes.length;
                });
                let title = `${props.name}:${th.num_key ? th.num_key : ""}0`;
                if (rf.length > 0) {
                    title = `${props.name}:${th.num_key}${rf[0].value}`;
                }

                if (isHover) {
                    //更新提示内容
                    $tipMarkerContent.html(title);
                    //更新位置
                    tipMarker.setPosition(position || props.center);
                }


                //更新相关多边形的样式
                var polys = districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
                for (var i = 0, len = polys.length; i < len; i++) {

                    polys[i].setOptions({
                        fillOpacity: isHover ? th.styleConfig.gl_opacity*0.01 : th.styleConfig.tc_opacity*0.01
                    });
                }
            }

            //监听feature的hover事件
            districtExplorer.on('featureMouseout featureMouseover', function (e, feature) {
                    toggleHoverFeature(feature, e.type === 'featureMouseover',
                        e.originalEvent ? e.originalEvent.lnglat : null);
            });

            //监听鼠标在feature上滑动
            districtExplorer.on('featureMousemove', function (e, feature) {
                //更新提示位置
                tipMarker.setPosition(e.originalEvent.lnglat);
            });

            /**
             * feature 被点击事件
             */
            districtExplorer.on('featureClick', function (e, feature) {

                var props = feature.properties;
                const acroutes = props.acroutes;
                const recount = acroutes == undefined ? 0 : acroutes.length;
                th.city_leve=recount;
                var areaItems = th.groupInfos.filter(function (p) {
                    return p.parent == props.adcode && p.r_num>=recount;
                });
                if (areaItems.length == 0) {
                    areaItems = th.groupInfos.filter(function (p) {
                        return p.adcode == props.adcode && p.r_num>=recount;
                    });
                }
                if (areaItems.length == 0) {
                    return;
                }

                //切换聚焦区域
                switch2AreaNode(props.adcode);

                if (th.renderConfig.data_type != 'Q') {
                    th.parentInfo.push({
                        cityName: props.name,
                        code: props.adcode
                    });
                }


            });

            /**
             * 层级标签
             */
            function pushAdcode() {
                th.panel.innerHTML = "";
                th.parentInfo.forEach((x, i) => {
                    const a_id = `t_${x.code}`;
                    if ($(`#${a_id}`).length == 0) {

                        if (x.code != '100000') {
                            $('#panel').append('<div class="sim-button-t"><span></span></div>');
                        }

                        const leve_1 = document.createElement('div');
                        leve_1.className = 'sim-button button28';
                        leve_1.id = a_id;
                        const span_1 = document.createElement('span');
                        span_1.innerHTML = x.cityName;

                        leve_1.onclick = function () {
                            switch2AreaNode(x.code);
                            if (th.parentInfo.length > 1) {
                                while (th.parentInfo.length > i + 1) {
                                    th.parentInfo.pop();
                                }
                                pushAdcode();
                            }
                            th.city_leve=th.parentInfo.length-1;
                        };

                        leve_1.append(span_1);
                        th.panel.append(leve_1);
                    }
                });
            }

            //外部区域被点击
            districtExplorer.on('outsideClick', function (e) {
                // th.parentInfo = [{
                //     cityName: '全国',
                //     code: 100000,
                // }];
                //
                // districtExplorer.locatePosition(e.originalEvent.lnglat, function (error, routeFeatures) {
                //
                //     if (routeFeatures && routeFeatures.length > 1) {
                //         //切换到省级区域
                //         switch2AreaNode(routeFeatures[1].properties.adcode);
                //         th.parentInfo.push({
                //             cityName: routeFeatures[1].properties.name,
                //             code: routeFeatures[1].properties.adcode
                //         });
                //     } else {
                //         //切换到全国
                //         //switch2AreaNode(100000);
                //     }
                //
                // }, {
                //     levelLimit: 2
                // });
            });


            /**
             * 添加气球 begin
             * @param areaNode
             */
            // var object3Dlayer = new AMap.Object3DLayer({zIndex: 110, opacity: 1});
            // th.map.add(object3Dlayer);

            // function lnglatToG20(lnglat) {
            //     lnglat = th.map.lngLatToGeodeticCoord(lnglat);
            //     lnglat.x = AMap.Util.format(lnglat.x, 3);
            //     lnglat.y = AMap.Util.format(lnglat.y, 3);
            //     return lnglat;
            // }


            /**
             * 根据源数据返回聚合数据
             * @param items 源数据
             * @param features 当前区域
             */
            function groupData(items, features) {
                //循环区域
                let leve = "";
                th.max_num = 0;
                features.forEach((feature) => {
                    if (feature.acroutes == 2) {
                        const rlist = jslinq(AreaJson).where(x => x.adcode == feature.adcode)["items"];
                        if (rlist.length > 0) {
                            const le = rlist[0].acroutes;
                            const reubs = jslinq(AreaJson).where(x => x.adcode == le[le.length - 2])["items"];
                            if (reubs.length > 0) {
                                leve = reubs[0].name;
                            }
                        }
                    }
                    let del_items = [];
                    let num = 0;
                    const paths = feature.feature.geometry.coordinates;
                    //循环源数据
                    let isPointInRing = false;
                    let rname = '';
                    let r_num=0;
                    for (const ik in items) {
                        const item = items[ik];
                        //坐标,要判断是否在区域内
                        if (th.renderConfig.data_type == "L") {
                            const point = new AMap.LngLat(item.lng, item.lat);
                            for (const px in paths) {
                                isPointInRing = AMap.GeometryUtil.isPointInRing(point, paths[px]);
                                if (isPointInRing) {
                                    del_items.push(item);
                                    //数据联动
                                    const rs = th.items.find((r) => r.key == `${item.lng}-${item.lat}`);
                                    const info = feature.feature.properties;
                                    if (rs) {
                                        rs.adcode = info.adcode;
                                        rs.parent = info.acroutes[info.acroutes.length - 1];
                                        rs.adName = info.name;
                                    }
                                }
                            }
                        } else {
                            switch (feature.acroutes) {
                                case 0:
                                    rname = feature.name + '|';
                                    break;
                                case 1:
                                    rname = feature.partname + '|' + feature.name + '|';
                                    break;
                                case 2:
                                    rname = leve + '|' + feature.partname + '|' + feature.name + '|';
                                    break;
                            }
                            if (item.name.indexOf(rname) > -1) {
                                item.acode = feature.feature.properties.acroutes;
                                del_items.push(item);
                            }
                        }
                    }
                    //删除,聚合元素
                    del_items.forEach((x) => {
                        num += x.value;
                        items.splice(items.indexOf(x), 1);
                        if (x.r_num>r_num){
                            r_num=x.r_num;
                        }
                    })
                    if (th.max_num < num) {
                        th.max_num = num;
                    }
                    //区域信息
                    if (del_items.length > 0) {
                        const info = feature.feature.properties;
                        th.groupInfos.push(
                            {
                                adcode: info.adcode,
                                level: feature.acroutes,
                                parent: info.acroutes[info.acroutes.length - 1],
                                acroutes: info.acroutes,
                                adname: info.name,
                                lng: info.center[0],
                                lat: info.center[1],
                                r_num:r_num,
                                value: num
                            }
                        );
                    }
                });
            }

            /**
             * 点击后下钻地图
             * @param areaNode
             */
            function renderAreaPolygons(areaNode) {

                //绘制子区域
                if (th.renderConfig.data_type == 'Q') {
                    //清除已有的绘制内容
                    districtExplorer.clearFeaturePolygons();
                    districtExplorer.loadCountryNode(function (err, countryNode) {
                        districtExplorer.renderParentFeature(countryNode, {
                            cursor: 'default',
                            bubble: true,
                            strokeColor: th.styleConfig.def_stroke, //线颜色
                            strokeOpacity: th.styleConfig.strokeOpacity*0.01, //线透明度
                            strokeWeight: th.styleConfig.strokeWeight, //线宽
                            fillColor: th.styleConfig.def_color, //填充色
                            fillOpacity: th.styleConfig.tc_opacity*0.01, //填充透明度
                        });
                    });
                    return;
                }
                const acroutes = areaNode._data.geoData.parent.properties.acroutes;
                const recount = acroutes == undefined ? 0 : acroutes.length;

                th.this_level=false;
                //获取当前所选择区域数据
                if (areaNode._data.geoData.parent.properties.childrenNum == 0) {
                    const rf = th.features.filter(function (p) {
                        return p.parent == acroutes[acroutes.length-1];
                    });
                    th.features = rf;
                } else {
                    th.features = [];
                }

                //绘制子区域
                districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
                    th.features.push({
                        adcode: feature.properties.adcode,
                        name: feature.properties.name,
                        center: feature.properties.center,
                        partname: areaNode._data.geoData.parent.properties.name,
                        acroutes: recount,
                        parent: areaNode.adcode,
                        feature: feature
                    });
                });

                /***
                 * 聚合数据
                 */
                    //聚合运算
                const items = th.groupItems.map((item) => {
                        return item;
                    });
                th.groupInfos = [];
                groupData(items, th.features);

                //判断是否添加气球
                // if (th.styleConfig.v_round) {
                //     appendRound(th.features);
                // }

                var areaItems = th.groupInfos.filter(function (p) {
                    return p.parent == areaNode.adcode && p.r_num>=recount;
                });
                if (areaItems.length == 0) {
                    areaItems = th.groupInfos.filter(function (p) {
                        return p.adcode == areaNode.adcode && p.r_num>=recount;
                    });
                }
                if (areaItems.length == 0) {
                    return;
                }else{
                    if (areaNode.adcode!=100000) {
                        const rt = jslinq(AreaJson).where(x => x.adcode == areaNode.adcode)["items"][0];
                        if (rt.cnum == 0) {
                            th.this_adcode=areaNode.adcode;
                            th.this_level=true;
                            th.clickHandler();
                            currentAreaNode=th.currentAreaNode;
                            districtExplorer.setAreaNodesForLocating([currentAreaNode]);
                            th.groupInfos=th.old_groupInfo;
                            th.toDrilling();
                            return;
                        }
                    }
                }
                th.currentAreaNode=currentAreaNode;
                th.old_groupInfo=th.groupInfos;
                th.clickHandler();
                pushAdcode();
                //清除已有的绘制内容
                districtExplorer.clearFeaturePolygons();
                //更新地图视野
                th.map.setBounds(areaNode.getBounds());
                let r_num=1;
                if (areaNode._data.geoData.parent.properties.adcode==100000){
                    r_num=1;
                }else{
                    r_num=areaNode._data.geoData.parent.properties.acroutes.length+1;
                }
                districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
                    var newArr = th.groupInfos.filter(function (p) {
                        return p.adcode == feature.properties.adcode && p.r_num>=r_num;
                    });
                    if (newArr.length > 0) {
                        var fillColor = colors[i % colors.length];
                        var strokeColor = colors[colors.length - 1 - i % colors.length];
                        return {
                            cursor: 'default',
                            bubble: true,
                            strokeColor: strokeColor, //线颜色
                            strokeOpacity: th.styleConfig.strokeOpacity*0.01, //线透明度
                            strokeWeight: th.styleConfig.strokeWeight, //线宽
                            fillColor: fillColor, //填充色
                            fillOpacity: th.styleConfig.tc_opacity*0.01, //填充透明度
                        };
                    } else {
                        return {
                            cursor: 'default',
                            bubble: true,
                            strokeColor: th.styleConfig.def_stroke, //线颜色
                            strokeOpacity: th.styleConfig.strokeOpacity*0.01, //线透明度
                            strokeWeight: th.styleConfig.strokeWeight, //线宽
                            fillColor: th.styleConfig.def_color, //填充色
                            fillOpacity: th.styleConfig.tc_opacity*0.01, //填充透明度
                        };
                    }
                });


                //绘制父区域
                districtExplorer.renderParentFeature(areaNode, {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: 'black', //线颜色
                    strokeOpacity: th.styleConfig.strokeOpacity*0.01, //线透明度
                    strokeWeight: th.styleConfig.strokeWeight, //线宽
                    fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
                    fillOpacity: th.styleConfig.tc_opacity*0.01, //填充透明度
                });
            }

            // /**
            //  * 添加气球效果
            //  * @param areaNode
            //  */
            // function appendRound(items) {
            //     var points3D = new AMap.Object3D.RoundPoints();
            //     points3D.transparent = true;
            //     var pointsGeo = points3D.geometry;
            //     object3Dlayer.clear();
            //     const zoom = th.map.getZoom();
            //
            //     const lines = new AMap.Object3D.Line();
            //     const lineGeo = lines.geometry;
            //     let i = 0;
            //     items.forEach((feature) => {
            //
            //         var newArr = th.groupInfos.filter(function (p) {
            //             return p.adcode == feature.feature.properties.adcode;
            //         });
            //         if (newArr.length > 0) {
            //             i++;
            //             var center = lnglatToG20(feature.feature.properties.center);
            //             var size = newArr[0].value / th.max_num * 35;
            //             var height = -size * 100000 + ((zoom - 5) * 500000);
            //
            //             lineGeo.vertices.push(center.x, center.y, 0);
            //             lineGeo.vertexColors.push(0, 1, 1, 1);
            //             lineGeo.vertices.push(center.x, center.y, height);
            //             lineGeo.vertexColors.push(0, 1, 1, 1);
            //
            //             pointsGeo.vertices.push(center.x, center.y, 0); // 尾部小点
            //             pointsGeo.pointSizes.push(5);
            //             pointsGeo.vertexColors.push(0, 0, 1, 1);
            //
            //             pointsGeo.vertices.push(center.x, center.y, height); // 空中点
            //             pointsGeo.pointSizes.push(size);
            //             pointsGeo.vertexColors.push(i * 0.029, i * 0.015, i * 0.01, 1);
            //             pointsGeo.borderWeight = 10;
            //             pointsGeo.transparent = false;
            //         }
            //     });
            //
            //     points3D.borderColor = [0.4, 0.8, 1, 1];
            //     points3D.borderWeight = 3;
            //     object3Dlayer.add(lines);
            //     object3Dlayer.add(points3D);
            // }

            //切换区域后刷新显示内容
            function refreshAreaNode(areaNode) {
                districtExplorer.setHoverFeature(null);
                renderAreaPolygons(areaNode);

            }

            //切换区域
            function switch2AreaNode(adcode) {

                if (currentAreaNode && ('' + currentAreaNode.getAdcode() === '' + adcode)) {
                    return;
                }

                loadAreaNode(adcode, function (error, areaNode) {

                    if (error) {

                        return;
                    }
                    currentAreaNode = areaNode;
                    //设置当前使用的定位用节点
                    districtExplorer.setAreaNodesForLocating([currentAreaNode]);
                    refreshAreaNode(areaNode);
                });
            }

            //加载区域
            function loadAreaNode(adcode, callback) {

                districtExplorer.loadAreaNode(adcode, function (error, areaNode) {

                    if (error) {

                        if (callback) {
                            callback(error);
                        }

                        console.error(error);

                        return;
                    }

                    if (callback) {
                        callback(null, areaNode);
                    }
                });
            }

            //全国
            if (th.items_adcode.indexOf(th.styleConfig.centerText)>-1){
                switch2AreaNode(th.styleConfig.centerText);
                const revvs = jslinq(AreaJson).where(x => x.adcode == th.styleConfig.centerText)["items"][0];
                th.parentInfo.push({
                    cityName: revvs.name,
                    code: revvs.adcode
                });
                pushAdcode();
            }else{
                switch2AreaNode(100000);
            }

        });

    }


    public onDestroy(): void {

    }

    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        return null;
    }

    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        return null;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        return null;
    }
}