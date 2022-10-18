import shape = require("./IShape");
import jslinq from "jslinq";
// @ts-ignore
import Loca from 'Loca';

// @ts-ignore
import AMap from 'AMap';

// @ts-ignore
import AMapUI from 'AMapUI';

import $ from 'jquery';
import AreaJson from "./AreaJson.json";

/**
 * 棱柱功能实现
 */
export class Prism implements shape.IShape {

    private boundaries: any;
    private defadcode = 100000;

    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;

        if (th.isPrism) {
            this.boundaries = [];
            //判断区域是否存在
            const area = jslinq(AreaJson).where(x => x.name == th.AreaFormatter(style.pr_areaName.trim()))["items"];
            if (area.length > 0) {
                this.areaDrillDown(th, area[0].adcode)
                this.defadcode = area[0].adcode;
                this.districtSearch(th, area[0].name);
            }
        }

        //加载子区域边缘
        if (style.am_display) {
            //加载区域边线
            if (th.isChild){
                this.areaLoad(th, this.defadcode);
            }

        } else {
            if (th.districtExplorer){
                th.districtExplorer.destroy();
                th.districtExplorer.clearFeaturePolygons();
            }
        }
    }

    /**
     * 地图向下钻取
     */
    public areaDrillDown(th, adcode) {
        if (!th.styleConfig.area_drill_down) {
            th.panel.innerHTML = "";
            return;
        }
        th.parentInfo = [];
        const area = jslinq(AreaJson).where(x => x.adcode == adcode)["items"][0];
        area.acroutes.forEach((c) => {
            const item = jslinq(AreaJson).where(x => x.adcode == c)["items"][0];
            th.parentInfo.push({
                cityName: item.name,
                code: item.adcode
            });
        });
        th.parentInfo.push({
            cityName: area.name,
            code: area.adcode
        });

        this.pushAdcode(th);
    }

    /**
     * 添加标题
     * @param th
     */
    public pushAdcode(th) {
        th.panel.innerHTML = "";
        const _this = this;
        const p_count = th.parentInfo.length - 1;
        th.parentInfo.forEach((x, i) => {
            const a_id = `t_${x.code}`;
            if ($(`#${a_id}`).length == 0) {
                const leve_1 = document.createElement('div');
                leve_1.className = 'sim-button button28';
                leve_1.id = a_id;
                $(`#${a_id}`).attr('adcode', x.code)

                const span_1 = document.createElement('span');
                span_1.innerHTML = x.cityName;
                leve_1.append(span_1);
                th.panel.append(leve_1);

                //点击
                leve_1.onclick = function () {
                    if (p_count != i) {
                        _this.areaLoad(th, x.code);
                        _this.districtSearch(th, x.cityName);
                        _this.areaDrillDown(th, x.code);
                    }
                }
            }
        });
    }

    /**
     * 加载掩模,启动3D效果
     * @param th
     * @private
     */
    private bindMask(th) {
        const style = th.styleConfig;
        const _this = this;
        if (style.pr_mask) {
            th.map.setMask(th.mask);
        }
        {
            if (style.poly_cover) {
                //遮罩
                if (th.polygon) {
                    th.map.remove(th.polygon)//清除上次结果
                    th.polygon = null;
                }
                // 外多边形坐标数组和内多边形坐标数组
                const outer = [
                    new AMap.LngLat(-360, 90, true),
                    new AMap.LngLat(-360, -90, true),
                    new AMap.LngLat(360, -90, true),
                    new AMap.LngLat(360, 90, true),
                ];

                const pathArray = [
                    outer
                ];
                pathArray.push.apply(pathArray, this.boundaries)
                th.polygon = new AMap.Polygon({
                    pathL: pathArray,
                    strokeColor: style.pr_Color,
                    strokeWeight: 1,
                    fillColor: style.poly_fillColor,
                    fillOpacity: th.getOpacity(style.poly_fillColor)
                });
                th.polygon.setPath(pathArray);
                th.map.add(th.polygon)
            }
        }

        const json = this.boundaries.map((x) => {
            const coords = x.map((r) => {
                return [r.lng, r.lat]
            });
            return {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [coords]
                }
            };
        });

        const geo = new Loca.GeoJSONSource({
            data: {
                "type": "FeatureCollection",
                "features": json
            }
        });

        th.loca.clearLight();

        //判断是否要加载棱柱
        if (th.isPoly) {
            if (th.poly) {
                th.loca.remove(th.poly);
            }

            th.poly = new Loca.PolygonLayer({
                zIndex: 120,
                opacity: 0.5,
                cullface: 'none',
                shininess: 10,
                hasSide: true,
            });

            th.poly.setSource(geo);
            th.poly.setStyle({
                topColor: style.opt_topColor,
                sideTopColor: style.opt_sideTopColor,
                sideBottomColor: style.opt_sideBottomColor,
                bottomColor: style.opt_bottomColor,
                height: style.opt_height,
                altitude: style.opt_altitude
            });

            th.loca.add(th.poly);
        }

        if (style.amb_show) {
            //环境光
            th.ambLight = new Loca.AmbientLight({
                intensity: style.amb_intensity * 0.01, // 环境光强度，建议值: 0～1
                color: style.amb_color, // 环境光颜色
            });
            th.loca.addLight(th.ambLight);

            //平行光
            th.dirLight = new Loca.DirectionalLight({
                intensity: style.dir_intensity * 0.01, // 光照强度，建议值: 0～1
                color: style.dir_color, // 平行光颜色
                target: _this.strSplit(style.dir_target, 3), // 光射向的目标位置
                position: _this.strSplit(style.dir_position, 3), // 坐标位置
            });
            // 通过 loca.addLight 添加平行光
            th.loca.addLight(th.dirLight);
        }
    }


    // private addLabelMarker(th, style, feature) {
    //     if (th.adcodeIds.indexOf(feature.properties.adcode) > -1) {
    //         return;
    //     }
    //     const labelsMarker = new AMap.LabelMarker({
    //         name: feature.properties.name,
    //         position: feature.properties.center,
    //         zooms: [2, 22],
    //         opacity: 1,
    //         zIndex: 20,
    //         text: {
    //             content: feature.properties.name,
    //             direction: 'bottom',
    //             offset: [0, 0],
    //             style: {
    //                 fontFamily: style.am_TextStyle.fontFamily,
    //                 fontSize: parseFloat(style.am_TextStyle.fontSize),
    //                 fontWeight: style.am_TextStyle.fontWeight,
    //                 fontStyle: style.am_TextStyle.fontStyle,
    //                 fillColor: style.am_TextStyle.color
    //             },
    //         },
    //     });
    //     th.labellayer_sun.add(labelsMarker);
    // }

    /**
     * 字符串转数组
     * @param str
     * @param n
     * @private
     */
    private strSplit(str, n) {
        const strs = str.split(',');
        let result = [];
        strs.forEach((x) => {
            if (!isNaN(x)) {
                result.push(parseInt(x));
            }
        });

        if (result.length != n) {
            if (n == 2) {
                return [0, 0];
            }
            return [0, 0, 0];
        }
        return result;


    }

    /**
     * 根据名称查询区域范围
     * @param th
     * @param areaName
     * @private
     */
    private districtSearch(th, areaName) {

        th.polylines.forEach((x) => {
            if (x.type == "poly") {
                x.obj.destroy();
            }
        });
        const style = th.styleConfig;
        const _this = this;

        th.district.search(areaName, function (status, result) {
            if (status == 'complete') {
                _this.boundaries = [];
                th.mask = [];
                result.districtList.forEach((x) => {
                    const bounds = x.boundaries;
                    for (let i = 0; i < bounds.length; i += 1) {
                        th.mask.push([bounds[i]]);
                        _this.boundaries.push(bounds[i])
                    }
                    if (style.pr_poly && th.isPor) {
                        //添加描边
                        for (let i = 0; i < bounds.length; i += 1) {
                            const polyline = new AMap.Polyline({
                                path: bounds[i],
                                strokeColor: style.pr_Color,
                                strokeOpacity: th.getOpacity(style.pr_Color),
                                strokeWeight: style.pr_strokeWeight,
                                isOutline: style.pr_borderWeight == 0 ? false : true,
                                borderWeight: style.pr_borderWeight,
                                outlineColor: style.pr_outlineColor,
                                outlineOpacity: th.getOpacity(style.pr_outlineColor),
                                strokeStyle: style.pr_strokeStyle,
                                map: th.map
                            });
                            th.polylines.push({
                                type: 'poly',
                                obj: polyline
                            });
                        }
                    }
                });
            }
            if (style.pr_show) {
                _this.bindMask(th);
            }

        });
    }

    /**
     * 加载区域
     * @param th
     */
    // public areaLoad(th,adcode, depth){
    //
    //     const _this=this;
    //     const style = th.styleConfig;
    //     let colors = style.am_bg_fill_color;
    //
    //     if (!style.am_bg_fill_color){
    //         colors=["rgba(153,153,153,0.5)","rgba(153,153,153,0.5)"];
    //     }
    //
    //     th.disProvince && th.disProvince.setMap(null);
    //
    //     th.disProvince = new AMap.DistrictLayer.Province({
    //         zIndex: 12,
    //         adcode: [adcode],
    //         depth: depth,
    //         opacity:style.am_opacity*0.01,
    //         styles: {
    //             'fill': function () {
    //                 if (style.am_bg_fill_bol){
    //                     return colors[parseInt((Math.random()*100).toString()) % colors.length];
    //                 }
    //                 return null;
    //
    //             },
    //             'province-stroke': 'cornflowerblue',
    //             'city-stroke': style.am_strokeColor, //  子区域边界
    //             'county-stroke': 'rgba(255,255,255,0.5)' // 中国区县边界
    //         }
    //     });
    //
    //     th.disProvince.setMap(th.map);
    //
    // }


    /**
     * 加载区域
     * @param th
     */
    public areaLoad(th, adcode) {

        const _this = this;
        const style = th.styleConfig;

        let colors = style.am_bg_fill_color;
        if (!style.am_bg_fill_bol) {
            colors = ["rgba(153,153,153,0)", "rgba(153,153,153,0)"];
        }

        AMapUI.load(['ui/geo/DistrictExplorer', 'lib/$'], function (DistrictExplorer, $) {
            //创建一个实例
            if (th.districtExplorer) {
                th.districtExplorer.clearFeaturePolygons();
                if (th.districtExplorer["__evHash"].featureClick) {
                    th.districtExplorer["__evHash"].featureClick = undefined;
                    th.districtExplorer["__evHash"].featureMousemove = undefined;
                    th.districtExplorer["__evHash"].featureMouseout = undefined;
                    th.districtExplorer["__evHash"].featureMouseover = undefined;
                    th.districtExplorer["__evHash"].outsideClick = undefined;
                }
            } else {
                th.districtExplorer = new DistrictExplorer({
                    eventSupport: true, //打开事件支持
                    map: th.map
                });
            }


            //当前聚焦的区域
            let currentAreaNode = null;

            //鼠标hover提示内容
            const $tipMarkerContent = $('<div class="tipMarker top"></div>');

            const tipMarker = new AMap.Marker({
                content: $tipMarkerContent.get(0),
                offset: new AMap.Pixel(0, 0),
                bubble: true
            });

            //feature被点击
            th.districtExplorer.on('featureClick', function (e, feature) {
                if (!style.am_display) {
                    return;
                }
                var props = feature.properties;
                //如果存在子节点
                //切换聚焦区域
                _this.areaDrillDown(th, props.adcode);
                _this.districtSearch(th, props.name);

                //判断是否开启聚合
                // if (style.area_drill_down) {
                //     //聚合级别 当前级别判断
                //     if (props.level=="province" && style.area_group_type!="1"){
                //         th.data_point = th.dataPointGroup(th.renderConfig.data_point.features, style);
                //         console.log(th.data_point)
                //     }
                // }
                setTimeout(() => {
                    switch2AreaNode(props.adcode);
                }, 500)

                // }
            });

            //外部区域被点击
            th.districtExplorer.on('outsideClick', function (e) {

                if (!style.am_display) {
                    return;
                }
                th.districtExplorer.locatePosition(e.originalEvent.lnglat, function (error, routeFeatures) {

                    if (routeFeatures && routeFeatures.length > 1) {
                        //切换到省级区域
                        const props = routeFeatures[1].properties;
                        ;
                        _this.districtSearch(th, props.name);
                        _this.areaDrillDown(th, props.adcode);
                        setTimeout(() => {
                            switch2AreaNode(props.adcode);
                        }, 500)
                    } else {
                        //切换到全国
                        _this.districtSearch(th, "中国");
                        _this.areaDrillDown(th, 100000);
                        switch2AreaNode(100000);
                    }

                }, {
                    levelLimit: 2
                });
            });
            //监听feature的hover事件
            th.districtExplorer.on('featureMouseout featureMouseover', function (e, feature) {
                toggleHoverFeature(feature, e.type === 'featureMouseover',
                    e.originalEvent ? e.originalEvent.lnglat : null);
            });

            //根据Hover状态设置相关样式
            function toggleHoverFeature(feature, isHover, position) {
                if (!style.am_display) {
                    return;
                }
                tipMarker.setMap(isHover ? th.map : null);

                if (!feature) {
                    return;
                }

                const props = feature.properties;

                if (isHover) {

                    //更新提示内容
                    $tipMarkerContent.html(props.name);
                    //更新位置
                    tipMarker.setPosition(position || props.center);
                }


                //更新相关多边形的样式
                const polys = th.districtExplorer.findFeaturePolygonsByAdcode(props.adcode);
                for (let i = 0, len = polys.length; i < len; i++) {

                    polys[i].setOptions({
                        fillOpacity: isHover ? style.am_hover_fillOpacity * 0.01 : (style.am_bg_fill_bol ? style.am_fillOpacity * 0.01 : 0)
                    });
                }
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
                    th.districtExplorer.setAreaNodesForLocating([currentAreaNode]);

                    refreshAreaNode(areaNode);
                });
            }

            //绘制某个区域的边界
            function renderAreaPolygons(areaNode) {
                //更新地图视野
                th.map.setBounds(areaNode.getBounds(), null, null, true);
                if (areaNode.adcode == 100000) {
                    th.map.setZoom(4.13)
                }
                //清除已有的绘制内容
                th.districtExplorer.clearFeaturePolygons();

                //绘制子区域
                th.districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
                    var fillColor = colors[i % colors.length];

                    return {
                        cursor: 'default',
                        bubble: true,
                        strokeColor: style.am_strokeColor, //线颜色
                        strokeOpacity: th.getOpacity(style.am_strokeColor), //线透明度
                        strokeWeight: 1, //线宽
                        fillColor: fillColor, //填充色
                        fillOpacity: style.am_bg_fill_bol ? style.am_fillOpacity * 0.01 : 0, //填充透明度
                    };
                });

                //绘制父区域
                th.districtExplorer.renderParentFeature(areaNode, {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: 'black', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: areaNode.getSubFeatures().length ? null : colors[0], //填充色
                    fillOpacity: style.am_fillOpacity * 0.01, //填充透明度
                });
            }

            //切换区域后刷新显示内容
            function refreshAreaNode(areaNode) {

                th.districtExplorer.setHoverFeature(null);

                renderAreaPolygons(areaNode);
            }

            //加载区域
            function loadAreaNode(adcode, callback) {
                th.districtExplorer.loadAreaNode(adcode, function (error, areaNode) {

                    if (error) {

                        if (callback) {
                            callback(error);
                        }
                        return;
                    }
                    if (callback) {
                        callback(null, areaNode);
                    }
                });
            }

            switch2AreaNode(adcode);

        });
    }


}