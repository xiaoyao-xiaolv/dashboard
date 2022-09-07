import shape = require("./IShape");
import jslinq from "jslinq";
// @ts-ignore
import Loca from 'Loca';

// @ts-ignore
import AMap from 'AMap';

import $ from 'jquery';
import AreaJson from "./AreaJson.json";

/**
 * 贴地点功能实现
 */
let icon_size = 0;

export class Point implements shape.IShape {

    //数据源
    private data_point: any;

    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;

        const _this = this;


        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }

        this.data_point = config.data_point.features;
        //数据聚合
        this.data_point = th.dataPointGroup(this.data_point, style);


        th.maxNum = jslinq(this.data_point).max(x => x["properties"].ratio);
        th.maxNum = th.maxNum == 0 ? 1 : th.maxNum;



        // //自定义参数聚合
        // style.customize_bubble_title.forEach((x)=>{
        //     if (x.q_category.trim()) {
        //         let result = jslinq(this.data_point).where(x => x["l_rid"] != -1);
        //         result = result.where(v => v["properties"].areaNames.indexOf(x.q_category.trim())>-1)
        //         const c_data = result['items'];
        //         c_data.forEach(x => {
        //             x.l_rid = "-1";
        //         });
        //     }
        // });
        this.removeMarker(th);
        //提示标签
        if (style.t_title) {
            //添加高级标签
            // if (style.line_show) {
            //     this.data_point = jslinq(this.data_point).where(x => x["properties"]["cityName"]!=x["geometry_to"]["name"])['items'];
            // }
            this.zMarkerLayerCust(th, this.data_point, style);
            //其余标签按固定格式加载
            let _data_0 = jslinq(this.data_point).where(x => x["l_rid"] != -1)['items'];
            if (style.title_type == "simp") {
                this.setLabelsLayer(th, _data_0, style);
            } else if (style.title_type == "plex") {
                this.zMarkerLayer(th, _data_0, style);
            } else {
                _this.addPrismLayer(th, _data_0, style);
            }
        }

        //显示飞线
        if (style.line_show) {
            _this.LoadpulseLink(th, this.data_point, style)
        }

        this.loadData(th, style);
        th.loca.animate.start();
        // if (th.breaths.length) {
        //     th.breaths.forEach(x => {
        //         th.loca.add(x.breath)
        //     });
        //     th.loca.animate.start();
        // }
        // th.scatters.forEach(x => {
        //     th.loca.add(x.scatter)
        // });
    }

    /**
     * 初始加载数据
     * @param th
     * @param config
     * @param style
     * @private
     */
    private loadData(th, style) {
        //高级图点闪点配置,根据条件过滤
        if (style.r_icon_show) {
            style.customize_bubble.forEach(x => {
                let str = x.num_interval.split(",");
                let left = str[0].length;
                let right = str[1].length;
                //记录条件值，逻辑数值
                let where_1 = "";
                let where_2 = "";
                let leftValue = -1;
                let rightValue = -1;
                if (left - 1) {
                    leftValue = str[0].substring(1);
                    where_1 = str[0].substring(0, 1) === "[" ? ">=" : ">";
                }
                if (right - 1) {
                    rightValue = str[1].substring(0, str[1].length - 1);
                    where_2 = str[1].substring(right - 1, right) === "]" ? "<=" : "<";
                }
                let result = jslinq(this.data_point).where(x => x["rid"] != -1);
                if (where_1 === ">") {
                    result = result.where(x => x["properties"].ratio > leftValue);
                } else if (where_1 === ">=") {
                    result = result.where(x => x["properties"].ratio >= leftValue);
                }
                if (where_2 === "<") {
                    result = result.where(x => x["properties"].ratio < rightValue);
                } else if (where_1 === "<=") {
                    result = result.where(x => x["properties"].ratio <= rightValue);
                }
                if (x.q_category.trim()) {
                    result = result.where(v => v["properties"].areaNames.indexOf(x.q_category.trim()) > -1)
                }
                const c_data = result['items'];
                c_data.forEach(x => {
                    x.rid = "-1";
                });
                if (c_data.length > 0) {
                    const g_data = {
                        data: {
                            "type": "FeatureCollection",
                            "features": c_data
                        }
                    }
                    let geo = new Loca.GeoJSONSource({
                        data: g_data.data
                    });
                    const scatter = new Loca.ScatterLayer({
                        loca: th.loca,
                        zIndex: 10,
                        opacity: 1,
                        visible: true,
                        zooms: [2, 22],
                    });

                    icon_size = x.q_icon_size;
                    if (style.unit != 'px') {
                        icon_size *= 100;
                    }
                    // //设置标点
                    scatter.setSource(geo, {
                        unit: style.unit,
                        size: [icon_size, icon_size],
                        color: x.q_color,
                        borderWidth: 0
                    });
                    th.scatters.push({
                        scatter: scatter
                    });
                    if (style.r_icon_flash) {
                        const breath = new Loca.ScatterLayer({
                            loca: th.loca,
                            zIndex: 5,
                        });
                        breath.setSource(geo);
                        breath.setStyle({
                            unit: style.unit,
                            size: [x.q_f_width * icon_size, x.q_f_width * icon_size],
                            texture: x.q_icon_png,
                            animate: true,
                            duration: x.q_f_duration,
                        });
                        th.breaths.push({
                            breath: breath
                        });
                    }
                }
            });
        }
        //获取没有条件筛选的数据
        {
            const c_data = jslinq(this.data_point).where(x => x["rid"] != -1)['items'];
            if (c_data.length > 0 && style.r_icon_show) {
                const g_data = {
                    data: {
                        "type": "FeatureCollection",
                        "features": c_data
                    }
                }
                let geo = new Loca.GeoJSONSource({
                    data: g_data.data
                });
                const scatter = new Loca.ScatterLayer({
                    loca: th.loca,
                    zIndex: 10,
                    opacity: 1,
                    visible: true,
                    zooms: [2, 22],
                });

                icon_size = style.icon_size;
                if (style.unit != 'px') {
                    icon_size *= 100;
                }
                // //设置标点
                if (style.icon_type == "PO") {
                    scatter.setSource(geo, {
                        unit: style.unit,
                        size: function (v, x) {
                            if (style.r_icon_size) {
                                const ratio = x.properties.ratio / th.maxNum;
                                return [ratio * icon_size, ratio * icon_size];
                            }
                            return [icon_size, icon_size];
                        },
                        color: style.icon_color,
                        borderWidth: 0
                    });
                } else {
                    let png = th.def_png_blue;
                    if (style.icon_symbol) {
                        png = style.icon_symbol;
                    }
                    scatter.setSource(geo);
                    scatter.setStyle({
                            unit: style.unit,
                            size: function (v, x) {
                                if (style.r_icon_size) {
                                    const ratio = x.properties.ratio / th.maxNum;
                                    return [ratio * icon_size, ratio * icon_size];
                                }
                                return [icon_size, icon_size];
                            },
                            texture: png
                        }
                    );
                }
                th.scatters.push({
                    scatter: scatter
                });
                if (style.r_icon_flash) {
                    const breath = new Loca.ScatterLayer({
                        loca: th.loca,
                        zIndex: 5,
                    });
                    breath.setSource(geo);
                    breath.setStyle({
                        unit: style.unit,
                        size: [style.r_f_width * icon_size, style.r_f_width * icon_size],
                        texture: style.icon_png,
                        animate: true,
                        duration: style.r_f_duration,
                    });
                    th.breaths.push({
                        breath: breath
                    });
                }
            }
            //飞线起点/终点气泡样式设置

            if (style.line_show && style.f_title_show) {
                if (style.e_title_type == "simp") {
                    let geo = this.filterToGeoJSONFly(this.data_point);
                    const scatter = new Loca.ScatterLayer({
                        loca: th.loca,
                        zIndex: 10,
                        opacity: 1,
                        visible: true,
                        zooms: [2, 22],
                    });
                    icon_size = style.e_icon_size;
                    if (style.unit != 'px') {
                        icon_size *= 100;
                    }
                    // //设置标点
                    if (style.e_icon_type == "PO") {
                        scatter.setSource(geo, {
                            unit: style.unit,
                            size: [icon_size, icon_size],
                            color: style.e_icon_color,
                            borderWidth: 0
                        });
                    } else {
                        let png = th.def_png_blue;
                        if (style.e_icon_symbol) {
                            png = style.e_icon_symbol;
                        }
                        scatter.setSource(geo);
                        scatter.setStyle({
                                unit: style.unit,
                                size: [icon_size, icon_size],
                                texture: png
                            }
                        );
                    }
                    th.scatters.push({
                        scatter: scatter
                    });
                    if (style.e_r_icon_flash) {
                        const breath = new Loca.ScatterLayer({
                            loca: th.loca,
                            zIndex: 5,
                        });
                        breath.setSource(geo);
                        breath.setStyle({
                            unit: style.unit,
                            size: [style.e_r_f_width * icon_size, style.e_r_f_width * icon_size],
                            texture: style.e_icon_png,
                            animate: true,
                            duration: style.e_r_f_duration,
                        });
                        th.breaths.push({
                            breath: breath
                        });
                    }
                    this.setLabelsLayerFly(th, this.data_point, style);
                } else {
                    this.zMarkerLayerFly(th, this.data_point, style);
                }
            }

        }
    }

    /***
     * 加载飞线
     * @param th
     * @param data
     * @param style
     * @constructor
     * @private
     */
    private LoadpulseLink(th, data, style) {
        const geoJson = this.filterGeoJSON(th, data, style);
        th.pulseLink = new Loca.PulseLinkLayer({
            zIndex: 20,
            opacity: 1,
            visible: true,
            zooms: [2, 22],
        });

        th.pulseLink.setSource(geoJson);
        th.pulseLink.setStyle({
            unit: 'px',
            dash: [400, 0, 400, 0],
            lineWidth: [style.line_lineWidth_star * 0.1, style.line_lineWidth_end * 0.1],
            height: style.line_height * 1000,
            smoothSteps: 30,
            speed: style.line_speed,
            flowLength: style.line_flowLength,
            lineColors: style.line_lineColors,
            maxHeightScale: 0.5, // 弧顶位置比例
            headColor: style.line_headColor,
            trailColor: style.line_trailColor
        });
        th.loca.add(th.pulseLink);
        th.loca.animate.start();
    }

    /***
     * 增加目标点标签
     * @param th
     * @param data
     */
    public setLabelsLayerFly(th, data, style) {
        th.labelLayer_to.clear();
        const _data = jslinq(data).groupBy((x) => x["geometry_to"]["coordinates"])["items"];
        _data.forEach((item) => {
            th.adcodeIds.push(item.adcode);
            let content = item.elements[0].geometry_to.name;
            const labelsMarker = new AMap.LabelMarker({
                name: item.elements[0].geometry_to.name,
                position: item.key,
                zooms: [2, 22],
                opacity: 1,
                zIndex: 20,
                extData: {
                    ...item.item
                },
                text: {
                    content: content,
                    direction: 'bottom',
                    value: '23',
                    offset: [style.f_lr, style.f_tb],
                    style: {
                        fontFamily: style.f_TextStyle.fontFamily,
                        fontSize: parseFloat(style.f_TextStyle.fontSize),
                        fontWeight: style.f_TextStyle.fontWeight,
                        fontStyle: style.f_TextStyle.fontStyle,
                        fillColor: style.f_TextStyle.color
                    },
                },
            });

            th.point_items.push({
                type:'labelsMarker',
                obj:labelsMarker
            });
            //鼠标提示标签
            th.labelLayer_to.add(labelsMarker);
        });
        th.map.add(th.labelLayer_to);
    }

    /**
     * 飞线终点高级标签
     * @param th
     * @param data
     * @param style
     * @private
     */
    private zMarkerLayerFly(th, data, style) {
        const _this = this;
        //标签
        const _data = jslinq(data).groupBy((x) => x["geometry_to"]["coordinates"])["items"];
        _data.forEach((item) => {
            let content = item.elements[0].geometry_to.name;

            let offset=JSON.parse(style.e_mark_offset);
            const marker = new AMap.Marker({
                map: th.map,
                name: 'ssss',
                position: item.key,
                icon: new AMap.Icon({
                    size: new AMap.Size(style.e_mark_icon_size_w, style.e_mark_icon_size_h),
                    image: style.e_mark_icon_image==undefined?th.def_image: style.e_mark_icon_image,
                    imageSize: new AMap.Size(style.e_mark_icon_size_w, style.e_mark_icon_size_h),
                }),
                anchor: 'bottom-center',
                offset: new AMap.Pixel(offset[0], offset[1]),
                extData: {
                    ...item.item
                },
            });

            th.point_items.push({
                type:'marker',
                obj:marker
            })
            // label默认蓝框白底左上角显示，样式className为：amap-marker-label
            if (style.e_label_head_show) {
                marker.setLabel({
                    direction: 'center',
                    offset: new AMap.Pixel(style.e_label_head_pixel_x, style.e_label_head_pixel_y),  //设置文本标注偏移量
                    content: `<div class='e_conter'><span class='e_t_span'>${content}</span></div>`, //设置文本标注内容
                });
            }
        });

        //底图显示
        if (style.e_scat_bg_show && style.e_scat_bg_image) {
            const geo = this.filterToGeoJSONFly(data);
            // 呼吸点 金色
            const scatterYellow = new Loca.ScatterLayer({
                loca: th.loca,
                zIndex: 110,
                opacity: 1,
                visible: true,
                zooms: [2, 26],
                depth: true
            });

            scatterYellow.setSource(geo);
            scatterYellow.setStyle({
                unit: style.e_title_unit,
                size: [style.e_scat_bg_size_w, style.e_scat_bg_size_h],
                texture: style.e_scat_bg_image,
                altitude: style.e_scat_bg_altitude,
                duration: style.e_scat_bg_duration,
                animate: true,
            });

            th.scatterYellow.push({
                scatter: scatterYellow
            });
            // 启动帧
            th.loca.animate.start();
        }
    }

    /***
     * 增加简单标签提示
     * @param th
     * @param data
     */
    public setLabelsLayer(th, data, style) {
        const _this = this;
        th.labelLayer && th.labelLayer.clear();
        data.forEach((item) => {
            th.adcodeIds.push(item.adcode);
            let content = item.properties.cityName;
            if (!th.isMock) {
                if (item.properties.ratio != -1) {
                    content = item.properties.cityName + (style.t_showNumber ? "：" + th.formatData(item.properties.ratio) : "");
                } else {
                    content = item.properties.cityName;
                }
            }
            const labelsMarker = new AMap.LabelMarker({
                name: item.properties.cityName,
                position: item.geometry.coordinates,
                zooms: [2, 22],
                opacity: 1,
                zIndex: 20,
                extData: {
                    ...item.item
                },
                text: {
                    content: content,
                    direction: 'bottom',
                    value: '23',
                    offset: [style.t_lr, style.t_tb],
                    style: {
                        fontFamily: style.t_TextStyle.fontFamily,
                        fontSize: parseFloat(style.t_TextStyle.fontSize),
                        fontWeight: style.t_TextStyle.fontWeight,
                        fontStyle: style.t_TextStyle.fontStyle,
                        fillColor: style.t_TextStyle.color
                    },
                },
            });
            th.point_items.push({
                type:'labelsMarker',
                obj:labelsMarker
            });

            labelsMarker.on('click', function (rek, x) {
                if (th.items) {
                    _this.clickHandler(item.properties.areaNames, th);
                }
            });

            //鼠标提示标签
            if (style.t_show && th.tooltipFields.length > 0) {
                labelsMarker.on('mouseover', function (rem) {
                    const info = [];
                    info.push("<div class='content-window-card'><div></div> ");
                    info.push(`<p class='input-title'>${item.properties.cityName}</p><hr class='hr'>`);
                    th.tooltipFields.forEach((x) => {
                        info.push(`<p class='input-item'>${x} : ${item.item[x]}</p>`);
                    })
                    th.infoWindow.setContent(info.join(""));
                    th.infoWindow.open(th.map, item.geometry.coordinates);
                });
                labelsMarker.on('mouseout', function (ite) {
                    setTimeout(function () {
                        th.infoWindow.close();
                    }, style.t_remain)
                });
            }
            th.labelLayer.add(labelsMarker);
        });

        th.map.remove(th.labelLayer);
        th.map.add(th.labelLayer);
    }

    /**
     * 增加漂亮的提示标签
     * @param th
     * @param data
     * @param style
     * @private
     */
    private zMarkerLayerCust(th, data, style) {
        const _this = this;

        if (!style.c_customize_show) {
            return;
        }

        //根据条件来加载数据

        style.customize_bubble_title.forEach((x, i) => {
            if (x.q_category.trim()) {
                const names=x.q_category.split(',');
                names.forEach((key)=>{
                    if (key.trim()){
                        let result = jslinq(this.data_point).where(x => x["l_rid"] != -1);
                        result = result.where(v => v["properties"].areaNames.indexOf(key.trim()) > -1)
                        const c_data = result['items'];
                        c_data.forEach(item => {
                            //设置标签样式
                            appendTitles(x, i, item);
                            item.l_rid = "-1";
                        });
                    }
                })
            }
        });

        //加载标签内容
        function appendTitles(x, i, item) {

            let content = item.properties.cityName;
            if (!th.isMock) {
                if (item.properties.ratio != -1) {
                    content = item.properties.cityName + (style.t_showNumber ? "：" + th.formatData(item.properties.ratio) : "");
                } else {
                    content = item.properties.cityName;
                }
            }
            let offset=JSON.parse(x.mark_offset);
            const marker = new AMap.Marker({
                map: th.map,
                position: item.geometry.coordinates,
                icon: new AMap.Icon({
                    size: new AMap.Size(x.mark_icon_size_w, x.mark_icon_size_h),
                    image:x.mark_icon_image==undefined?th.def_image: x.mark_icon_image,
                    imageSize: new AMap.Size(x.mark_icon_size_w, x.mark_icon_size_h),
                }),
                offset: new AMap.Pixel(offset[0], offset[1]),
                extData: {
                    ...item.item
                },
            });

            th.point_items.push({
                type:'marker',
                obj:marker
            });

            // label默认蓝框白底左上角显示，样式className为：amap-marker-label
            if (x.label_head_show) {
                marker.setLabel({
                    direction: 'center',
                    offset: new AMap.Pixel(x.label_head_pixel_x, x.label_head_pixel_y),  //设置文本标注偏移量
                    content: `<div class='divc_ppp' style='position:relative;width:${x.label_head_size_w}px;height:${x.label_head_size_h}px;line-height:${x.label_head_margin_top + x.label_head_size_h}px;background-size:100% 100%;background-repeat:no-repeat;background-image:url(${x.label_head_bg_image});background-color:rgba(255,0,119,0);'><span style='position: relative;width:100%;left:${x.label_head_margin_left}px;color:${style.c_TextStyle.color};font-family:${style.c_TextStyle.fontFamily};font-size:${parseFloat(style.c_TextStyle.fontSize)}px;font-style:'${style.c_TextStyle.fontStyle}';font-weight:${style.c_TextStyle.fontWeight}>${content}</span></div>`, //设置文本标注内容
                });
            }
            //绑定事件
            marker.on('click', function (x) {
                _this.clickHandler(item.properties.areaNames, th);
            });
            if (style.t_show && th.tooltipFields.length > 0) {
                marker.on('mouseover', function (rem) {
                    const info = [];
                    info.push("<div class='content-window-card'><div></div> ");
                    info.push(`<p class='input-title'>${item.properties.cityName}</p><hr class='hr'>`);
                    th.tooltipFields.forEach((x) => {
                        info.push(`<p class='input-item'>${x} : ${item.item[x]}</p>`);
                    })
                    th.infoWindow.setContent(info.join(""));
                    th.infoWindow.open(th.map, item.geometry.coordinates);
                });
                marker.on('mouseout', function (ite) {
                    setTimeout(function () {
                        th.infoWindow.close();
                    }, style.t_remain)
                });
            }


            //底图显示
            if (x.scat_bg_show && x.scat_bg_image) {

                const json = [];
                json.push({
                    "type": "Feature",
                    "properties": {
                        "cityName": item.properties.cityName,
                        "ratio": item.properties.ratio,
                        "type": 1
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": item.geometry.coordinates
                    },
                });
                const newJSON = {
                    type: 'FeatureCollection',
                    features: json,
                };
                const geo = new Loca.GeoJSONSource({
                    data: newJSON,
                });
                // 呼吸点 金色
                var scatterYellow = new Loca.ScatterLayer({
                    loca: th.loca,
                    zIndex: 110,
                    opacity: 1,
                    visible: true,
                    zooms: [2, 26],
                    depth: true
                });

                scatterYellow.setSource(geo);
                scatterYellow.setStyle({
                    unit: style.title_unit,
                    size: [x.scat_bg_size_w, x.scat_bg_size_h],
                    texture: x.scat_bg_image,
                    altitude: x.scat_bg_altitude,
                    duration: x.scat_bg_duration,
                    animate: true,
                });
                th.scatterYellow.push({
                    scatter: scatterYellow
                });
            }
        }

    }

    /**
     * 删除标点
     * @param th
     * @private
     */
    private removeMarker(th){

        th.point_items.forEach((x)=>{
            if (x.type=="marker"){
                x.obj.setMap(null);
            }else if(x.type=="labelsMarker"){
                x.obj.remove();
            }
        })
        th.point_items=[];

        if (th.pl) {
            th.loca.remove(th.pl);
        }
    }

    /**
     * 增加漂亮的提示标签
     * @param th
     * @param data
     * @param style
     * @private
     */
    private zMarkerLayer(th, data, style) {
        const _this = this;
        //标签
        data.forEach((item) => {
            let content = item.properties.cityName;
            if (!th.isMock) {
                if (item.properties.ratio != -1) {
                    content = item.properties.cityName + (style.t_showNumber ? "：" + th.formatData(item.properties.ratio) : "");
                } else {
                    content = item.properties.cityName;
                }
            }
            let offset=JSON.parse(style.mark_offset);
            const marker = new AMap.Marker({
                map: th.map,
                position: item.geometry.coordinates,
                icon: new AMap.Icon({
                    size: new AMap.Size(style.mark_icon_size_w, style.mark_icon_size_h),
                    image: style.mark_icon_image==undefined?th.def_image: style.mark_icon_image,
                    imageSize: new AMap.Size(style.mark_icon_size_w, style.mark_icon_size_h),
                }),
                anchor: 'bottom-center',
                offset: new AMap.Pixel(offset[0], offset[1]),
                extData: {
                    ...item.item
                },
            });
            th.point_items.push({
                type:'marker',
                obj:marker
            })
            // label默认蓝框白底左上角显示，样式className为：amap-marker-label
            if (style.label_head_show) {
                marker.setLabel({
                    direction: 'center',
                    offset: new AMap.Pixel(style.label_head_pixel_x, style.label_head_pixel_y),  //设置文本标注偏移量
                    content: `<div class='conter'><span class='t_span'>${content}</span></div>`, //设置文本标注内容
                });
            }
            //绑定事件
            marker.on('click', function (x) {
                _this.clickHandler(item.properties.areaNames, th);
            });
            if (style.t_show && th.tooltipFields.length > 0) {
                marker.on('mouseover', function (rem) {
                    const info = [];
                    info.push("<div class='content-window-card'><div></div> ");
                    info.push(`<p class='input-title'>${item.properties.cityName}</p><hr class='hr'>`);
                    th.tooltipFields.forEach((x) => {
                        info.push(`<p class='input-item'>${x} : ${item.item[x]}</p>`);
                    })
                    th.infoWindow.setContent(info.join(""));
                    th.infoWindow.open(th.map, item.geometry.coordinates);
                });
                marker.on('mouseout', function (ite) {
                    setTimeout(function () {
                        th.infoWindow.close();
                    }, style.t_remain)
                });
            }
        });

        //底图显示
        if (style.scat_bg_show && style.scat_bg_image) {
            const geo = this.filterToGeoJSON(data);
            // 呼吸点 金色
            const scatterYellow = new Loca.ScatterLayer({
                loca: th.loca,
                zIndex: 110,
                opacity: 1,
                visible: true,
                zooms: [2, 26],
                depth: true
            });

            scatterYellow.setSource(geo);
            scatterYellow.setStyle({
                unit: style.title_unit,
                size: [style.scat_bg_size_w, style.scat_bg_size_h],
                texture: style.scat_bg_image,
                altitude: style.scat_bg_altitude,
                duration: style.scat_bg_duration,
                animate: true,
            });
            th.scatterYellow.push({
                scatter: scatterYellow
            });
            // 启动帧
            th.loca.animate.start();
        }
    }

    /**
     * 组装飞线结束点信息
     * @param data
     * @private
     */
    private filterToGeoJSONFly(data) {
        const json = [];
        const _data = jslinq(data).groupBy((x) => x["geometry_to"]["coordinates"])["items"];
        _data.forEach((x) => {
            json.push({
                "type": "Feature",
                "properties": {
                    "cityName": x.elements[0].geometry_to.name,
                    "ratio": 0,
                    "type": 1
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": x.key
                },
            });
        });
        const newJSON = {
            type: 'FeatureCollection',
            features: json,
        };
        return new Loca.GeoJSONSource({
            data: newJSON,
        });
    }

    /**
     * 组织json
     * @param th
     * @param data
     * @param style
     * @private
     */
    private filterToGeoJSON(data) {
        const json = [];
        data.forEach((x) => {
            json.push({
                "type": "Feature",
                "properties": {
                    "cityName": x.properties.cityName,
                    "ratio": x.properties.ratio,
                    "type": 1
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": x.geometry.coordinates
                },
            });
        });
        const newJSON = {
            type: 'FeatureCollection',
            features: json,
        };
        return new Loca.GeoJSONSource({
            data: newJSON,
        });
    }

    /**
     * 组装飞线json
     * @param th
     * @param data
     * @param style
     * @private
     */
    private filterGeoJSON(th, data, style) {
        const json = [];
        data.forEach((x) => {
            if (x.geometry.coordinates[0] != x.geometry_to.coordinates[0] && x.geometry.coordinates[1] != x.geometry_to.coordinates[1]) {
                json.push({
                    "type": "Feature",
                    "properties": {
                        "cityName": x.properties.cityName,
                        "ratio": x.properties.ratio,
                        "type": 1,
                        "lineWidthRatio": 1
                    },
                    "geometry": {
                        "type": "LineString",
                        "coordinates": [
                            style.line_state == "in" ? x.geometry.coordinates : x.geometry_to.coordinates,
                            style.line_state == "in" ? x.geometry_to.coordinates : x.geometry.coordinates
                        ]
                    }
                });
            }
        });
        const newJSON = {
            type: 'FeatureCollection',
            features: json,
        };
        return new Loca.GeoJSONSource({
            data: newJSON,
        });
    }

    /**
     * 数据钻取
     * @param node
     * @param th
     */
    private clickHandler = (node: any, th: any) => {
        if (th.selectionOption.length > 0) {
            th.selectionManager.clear(th.selectionOption);
            th.selectionOption = [];
        }
        node.forEach((key) => {
            const sid = this.getNodeSelectionId(key, th);
            th.selectionOption.push(sid);
            th.selectionManager.select(sid, true)
        });

    }
    public getNodeSelectionId = (key: any, th: any) => {
        const {selectionId} = th.items.find((item: any) => item.name == key);
        return selectionId
    }

    /**
     * 开启动画轮播
     * @param th
     * @param data
     * @param style
     */
    public addPrismLayer(th, data, style) {

        if (th.pl) {
            th.loca.remove(th.pl);
        }
        th.pl = new Loca.PrismLayer({
            zIndex: 10,
            opacity: style.p_opacity * 0.01,
            visible: false,
            hasSide: true,
        });
        const _data = {
            "type": "FeatureCollection",
            "features": data
        };

        var geo = new Loca.GeoJSONSource({
            data: _data
        });
        th.pl.setSource(geo);
        let p_height = style.p_height;
        let p_radius = style.pr_radius;
        if (style.unit != 'px') {
            p_height *= 30;
            p_radius *= 30;
        }
        th.pl.setStyle({
            unit: style.unit,
            sideNumber: style.p_sideNumber,
            topColor: style.p_topColor,
            sideTopColor: style.p_sideTopColor_1,
            sideBottomColor: style.p_sideBottomColor,
            radius: p_radius,
            height: (index, f) => {
                if (style.p_rolling) {
                    let content = f.properties.cityName;
                    if (!th.isMock) {
                        if (f.properties.ratio != -1) {
                            content = f.properties.cityName + (style.t_showNumber ? "：" + th.formatData(f.properties.ratio) : "");
                        } else {
                            content = f.properties.cityName;
                        }
                    }

                    const marker = new AMap.Marker({
                        map: th.map,
                        anchor: 'bottom-center',
                        position: [f.coordinates[0], f.coordinates[1], (f.properties.ratio / th.maxNum) * p_height],
                        content: ' ',
                        zooms: [6, 20],
                        label: {
                            content: content,
                            direction: 'center'
                        }
                    });

                    th.point_items.push({
                        type:'marker',
                        obj:marker
                    })

                }

                return p_height;
            },
            altitude: 0,
        });

        th.loca.add(th.pl);


        setTimeout(function () {
            th.pl.show(2000);
            th.pl.addAnimate({
                key: 'height',
                value: [0, 1],
                duration: 500,
                easing: 'Linear',
                transform: 500,
                random: true,
                delay: 100,
            });
        }, 100);
        th.loca.animate.start();
    }

}