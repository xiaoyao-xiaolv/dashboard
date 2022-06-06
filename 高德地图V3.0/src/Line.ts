import shape = require("./IShape");
import jslinq from "jslinq";

// @ts-ignore
import Loca from 'Loca';

// @ts-ignore
import AMapUI from 'AMapUI';

import * as $ from 'jquery';

/**
 * 实现线功功能
 */
export class Line implements shape.IShape {


    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;
        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }
        //条件查询
        {
        }
        if (th.pathSimplifierIns){
            th.pathSimplifierIns.clearPathNavigators();
        }

        //整合筛选条件之外的数据
        {
            const result = jslinq(config.data_line.features).where(x => x["rid"] != -1);
            const c_data = result['items'];
            if (c_data.length > 0) {
                const g_data = {
                    data: {
                        "type": "FeatureCollection",
                        "features": c_data
                    }
                }
                const geo = new Loca.GeoJSONSource({
                    data: g_data.data
                });
                //判断路线类型
                if (style.l_category == "line") {
                    const layer = new Loca.LineLayer({
                        zIndex: 10
                    });
                    layer.setSource(geo);
                    const colors = style.l_colors;
                    layer.setStyle({
                        color: (index, prop) => {
                            const i = index % colors.length;
                            return colors[i];
                        },
                        lineWidth: style.l_lineWidth,
                        borderWidth: style.l_borderWidth,
                        borderColor: style.l_borderColor,
                        altitude: (index, feature) => {
                            if (style.l_alt_status) {
                                return style.l_altitude * index;
                            }
                            return style.l_altitude;
                        }
                    });
                    th.lines.push({line: layer})
                }
                else if (style.l_category == 'pulse') {
                    const layer = new Loca.PulseLineLayer({
                        zIndex: 10
                    });
                    const colors_t = style.p_colors_t;
                    const colors_w = style.p_colors_w;
                    layer.setSource(geo);
                    layer.setStyle({
                        altitude: style.l_altitude,
                        lineWidth: style.l_lineWidth,
                        // 脉冲头颜色
                        headColor: (index, feature) => {
                            const i = index % colors_t.length;
                            return colors_t[i];
                        },
                        // 脉冲尾颜色
                        trailColor: (index, feature) => {
                            const i = index % colors_w.length;
                            return colors_w[i];
                        },
                        // 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
                        interval: style.p_interval * 0.01,
                        // 脉冲线的速度，几秒钟跑完整段路
                        duration: style.p_duration
                    });
                    th.lines.push({line: layer});
                }
                else {
                    this.PathSimplifier(th);
                }
            }
        }
        th.lines.forEach(x => {
            th.loca.add(x.line);
        });
        if (style.l_category != "track") {
            th.loca.animate.start();
        }
    }

    /**
     * 路线地图设置
     * @constructor
     */
    public PathSimplifier(th) {
        if(!th.PathSimplifier){
            AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
                th.PathSimplifier=PathSimplifier;
                initPage(th.PathSimplifier);
            });
        }else{
            initPage(th.PathSimplifier);
        }
        function initPage(PathSimplifier) {
            //just some colors
            const style = th.styleConfig;
            const config = th.renderConfig;
            const colors = style.lx_colors;
            const colors_sel=style.lx_sel_colors;
            const colors_xs=style.lx_xs_colors;

            const emptyLineStyle = {
                lineWidth: 0,
                fillStyle: null,
                strokeStyle: null,
                borderStyle: null
            };

            const option = {
                zIndex: 100,
                //autoSetFitView:false,
                map: th.map, //所属的地图实例
                getPath: function (pathData, pathIndex) {
                    return pathData.path;
                },
                getHoverTitle: function (pathData, pathIndex, pointIndex) {

                    // if (pointIndex >= 0) {
                    //     //point
                    //     return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                    // }

                    return pathData.name;
                },
                renderOptions: {
                    renderAllPointsIfNumberBelow:100,
                    pathLineStyle: {
                        dirArrowStyle: false
                    },
                    getPathStyle: function (pathItem, zoom) {
                        const color = colors[pathItem.pathIndex % colors.length];
                        const color_sel = colors_sel[pathItem.pathIndex % colors_sel.length];
                        if(style.l_line_show) {
                            return {
                                pathLineStyle: {
                                    strokeStyle: color,
                                    lineWidth: style.l_Width,
                                    dirArrowStyle:false
                                },
                                pathLineSelectedStyle: {
                                    lineWidth: style.l_Width + 2,
                                    strokeStyle: color_sel,
                                    borderWidth: 1,
                                    borderStyle: '#fff',
                                    dirArrowStyle: false
                                },
                                pathNavigatorStyle: {
                                    initRotateDegree: 0,
                                    fillStyle: color
                                },
                                pathLineHoverStyle: {
                                    lineWidth: style.l_Width + 2,
                                    strokeStyle: color_sel,
                                    borderWidth: 1,
                                    borderStyle: '#fff',
                                    dirArrowStyle: false
                                }
                            };
                        }else{
                            return {
                                pathLineStyle: emptyLineStyle,
                                pathLineSelectedStyle: emptyLineStyle,
                                pathLineHoverStyle: emptyLineStyle,
                                keyPointStyle: emptyLineStyle,
                                startPointStyle: emptyLineStyle,
                                endPointStyle: emptyLineStyle,
                                keyPointHoverStyle: emptyLineStyle,
                                keyPointOnSelectedPathLineStyle: emptyLineStyle
                            }
                        }
                    }
                }
            };
            if (th.pathSimplifierIns) {
                th.pathSimplifierIns.renderEngine.setOptions({
                    pathLineStyle: {
                        dirArrowStyle: false
                    },
                    getPathStyle: function (pathItem, zoom) {
                        const color = colors[pathItem.pathIndex % colors.length];
                        const color_sel = colors_sel[pathItem.pathIndex % colors_sel.length];
                        if(style.l_line_show) {
                            return {
                                pathLineStyle: {
                                    strokeStyle: color,
                                    lineWidth: style.l_Width
                                },
                                pathLineSelectedStyle: {
                                    lineWidth: style.l_Width + 2,
                                    strokeStyle: color_sel,
                                    borderWidth: 1,
                                    borderStyle: '#fff',
                                    dirArrowStyle: false
                                },
                                pathNavigatorStyle: {
                                    initRotateDegree: 0,
                                    fillStyle: color_sel
                                },
                                pathLineHoverStyle: {
                                    lineWidth: style.l_Width + 2,
                                    strokeStyle: color_sel,
                                    borderWidth: 1,
                                    borderStyle: '#fff',
                                    dirArrowStyle: false
                                }
                            };
                        }else{
                            return {
                                pathLineStyle: emptyLineStyle,
                                pathLineSelectedStyle: emptyLineStyle,
                                pathLineHoverStyle: emptyLineStyle,
                                keyPointStyle: emptyLineStyle,
                                startPointStyle: emptyLineStyle,
                                endPointStyle: emptyLineStyle,
                                keyPointHoverStyle: emptyLineStyle,
                                keyPointOnSelectedPathLineStyle: emptyLineStyle
                            }
                        }
                    }
                });
                th.pathSimplifierIns.renderLater(200);
            }else{
                th.pathSimplifierIns = new PathSimplifier(option);
            }


            //组合数据
            config.data_line.features.forEach((x,i) => {
                if (style.l_type == "F") {
                    x.path = PathSimplifier.getGeodesicPath(x.path[0], x.path[x.path.length - 1], 500);
                }
            });
            //显示图标

            th.pathSimplifierIns.setData([]);
            th.pathSimplifierIns.setData(config.data_line.features);
            //创建一个巡航器
            config.data_line.features.forEach((x,i) => {

                const color = colors_xs[i % colors_xs.length];
                let _icon=x.image;
                if(style.l_icon){
                    _icon=style.l_icon;
                }else{
                    if(_icon==""){
                        if(style.l_type=="F"){
                            _icon=th.def_icon_plane;
                        }else{
                            _icon=th.def_icon_car;
                        }
                    }
                }
                const navg0 = th.pathSimplifierIns.createPathNavigator(i, {
                    loop: true,
                    speed: style.l_speed*1000,
                    keyPointTolerance:10,
                    pathNavigatorStyle: {
                        width: style.l_icon_Width,
                        height: style.l_icon_height,
                        //使用图片
                        strokeStyle: null,
                        fillStyle: null,
                        content: PathSimplifier.Render.Canvas.getImageContent(_icon),
                        //经过路径的样式
                        pathLinePassedStyle: {
                            lineWidth: style.l_Width,
                            strokeStyle: color,
                            dirArrowStyle: {
                                stepSpace: 15
                            }
                        }
                   }
                });
                navg0.start();
            });
        }

    }

}