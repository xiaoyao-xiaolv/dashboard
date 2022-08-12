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
    private areas:any;

    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;

        this.boundaries = [];

        //循环区域
        const items = style.pr_areaName.replace().split(',');
        this.areas = [];
        items.forEach((x, i) => {
            if (x.trim() != "") {
                const rest = this.areas.some(function (item) {
                    if (item.name == x) {
                        return true;
                    }
                });
                if (!rest) {
                    this.areas.push({
                        name: x
                    })
                }
            }
        });
        this.areas.forEach((x, i) => {
            this.districtSearch(th, x.name, i == this.areas.length - 1);
        })

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
        } else {
            if (style.poly_cover) {
                //遮罩
                // 外多边形坐标数组和内多边形坐标数组
                var outer = [
                    new AMap.LngLat(-360, 90, true),
                    new AMap.LngLat(-360, -90, true),
                    new AMap.LngLat(360, -90, true),
                    new AMap.LngLat(360, 90, true),
                ];

                var pathArray = [
                    outer
                ];
                pathArray.push.apply(pathArray, this.boundaries)
                var polygon = new AMap.Polygon({
                    pathL: pathArray,
                    strokeColor: style.pr_Color,
                    strokeWeight: 1,
                    fillColor: style.poly_fillColor,
                    fillOpacity: style.poly_fillOpacity * 0.01
                });
                polygon.setPath(pathArray);
                th.map.add(polygon)
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

        //加载子区域边缘
        if (style.am_display){
            //加载区域边线
            const adcodes=[];
            this.areas.forEach((r)=>{
                const area=jslinq(AreaJson).where(x=>x.name==r.name)["items"];
                if (area.length>0){
                    adcodes.push(area[0].adcode);
                }
            })
            this.renderArea(th,adcodes,style)
        }
    }

    public renderArea(th, adcodes,style) {

        AMapUI.loadUI(['geo/DistrictExplorer'], function (DistrictExplorer) {

            //创建一个实例
            var districtExplorer = new DistrictExplorer({
                map: th.map
            });

            function renderAreaNode(areaNode) {
                //绘制子区域
                districtExplorer.renderSubFeatures(areaNode, function (feature, i) {


                    return {
                        cursor: 'default',
                        bubble: true,
                        strokeColor: style.am_fillColor, //线颜色
                        strokeOpacity: style.am_strokeOpacity*0.01, //线透明度
                        strokeWeight: style.am_strokeWeight*0.01, //线宽
                        fillColor: style.am_strokeColor, //填充色
                        fillOpacity: style.am_fillOpacity*0.01, //填充透明度
                    };
                });
                //绘制父区域
                districtExplorer.renderParentFeature(areaNode, {
                    cursor: 'default',
                    bubble: true,
                    strokeColor: 'black', //线颜色
                    strokeOpacity: 1, //线透明度
                    strokeWeight: 1, //线宽
                    fillColor: null, //填充色
                    fillOpacity: 0.35, //填充透明度
                });
            }


            districtExplorer.loadMultiAreaNodes(adcodes, function (error, areaNodes) {
                //清除已有的绘制内容
                districtExplorer.clearFeaturePolygons();

                for (var i = 0, len = areaNodes.length; i < len; i++) {
                    renderAreaNode(areaNodes[i]);
                }
            });
        });
    }


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
    private districtSearch(th, areaName, bol) {
        const style = th.styleConfig;
        const _this = this;
        th.district.search(areaName, function (status, result) {
            if (status == 'complete') {
                result.districtList.forEach((x) => {
                    const bounds = x.boundaries;
                    for (let i = 0; i < bounds.length; i += 1) {
                        th.mask.push([bounds[i]]);
                        _this.boundaries.push(bounds[i])
                    }
                    if (style.pr_poly) {
                        //添加描边
                        for (let i = 0; i < bounds.length; i += 1) {
                            const polyline = new AMap.Polyline({
                                path: bounds[i],
                                strokeColor: style.pr_Color,
                                strokeWeight: style.pr_strokeWeight,
                                isOutline: false,
                                borderWeight: style.pr_borderWeight,
                                outlineColor: style.pr_outlineColor,
                                strokeStyle: style.pr_strokeStyle,
                                map: th.map
                            });
                            th.polylines.push(polyline)
                        }
                        ;
                    }
                });
            }
            if (bol && th.mask.length > 0) {
                _this.bindMask(th);
            }


        });
    }
}