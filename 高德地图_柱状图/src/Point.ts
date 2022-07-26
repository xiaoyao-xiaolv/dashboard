import shape = require("./IShape");
import jslinq from "jslinq";
// @ts-ignore
import Loca from 'Loca';

// @ts-ignore
import AMap from 'AMap';

import $ from 'jquery';
/**
 * 贴地点功能实现
 */
let icon_size=0;
export class Point implements shape.IShape {

    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;

        const _this = this;

        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }

        th.maxNum = jslinq(config.data_point.features).max(x => x["properties"].ratio);
        th.maxNum = th.maxNum == 0 ? 1 : th.maxNum;
        //高级图点闪点配置,根据条件过滤
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
                let result = jslinq(config.data_point.features).where(x => x["rid"] != -1);
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
                    result = result.where(v => v["properties"].category == x.q_category.trim())
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
        //获取没有条件筛选的数据
        {
            const result = jslinq(config.data_point.features).where(x => x["rid"] != -1);
            const c_data = result['items'];
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
                        size: [icon_size, icon_size],
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
                            size: [icon_size, icon_size],
                            texture: png
                        }
                    );
                }
                th.scatters.push({
                    scatter: scatter
                });
                if (style.r_icon_flash) {
                    const breath = new Loca.ScatterLayer({
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
        }


        if (th.breaths.length) {
            th.breaths.forEach(x => {
                th.loca.add(x.breath)
            });
            th.loca.animate.start();
        }
        th.scatters.forEach(x => {
            th.loca.add(x.scatter)
        });

        //启用轮播
        if (style.p_rolling) {
            if (th._interval) {
                clearInterval(th._interval);
            }
            th._interval = setInterval(function () {
                th._index++;
                if (th._index == config.data_point.features.length) {
                    th._index = 0;
                }
                th.map.panTo(config.data_point.features[th._index].geometry.coordinates);
                th.map.panBy(style.q_by_x, style.q_by_y);

                _this.addPrismLayer(th, config.data_point.features[th._index], style);

            }, style.q_interval);
        } else {
            if (th._interval) {
                clearInterval(th._interval);
                if (th.pl) {
                    th.loca.remove(th.pl);
                    th.map.remove(th.mk);
                }
            }
        }

        //自定义标签
        if (style.t_title){
            this.setLabelsLayer(th,config.data_point,style)
        }
        if (style.line_show){
            _this.LoadpulseLink(th,config.data_point,style)
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
    private LoadpulseLink(th,data,style){
        const geoJson=this.filterGeoJSON(th,data,style);
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
            lineWidth: [style.line_lineWidth_star*0.1, style.line_lineWidth_end*0.1],
            height: style.line_height*1000,
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
     * 增加标签提示
     * @param th
     * @param data
     */
    public setLabelsLayer(th,data,style){
        const _this=this;
        th.labelLayer.clear();
        data.features.forEach((item) => {
            let content=item.properties.cityName;
            if (!th.isMock){
                if (item.properties.ratio!=-1){
                    content=item.properties.cityName+(style.t_showNumber?"："+th.formatData(item.properties.ratio):"");
                }else{
                    content=item.properties.cityName;
                }
            }
            const labelsMarker = new AMap.LabelMarker({
                name: item.properties.category,
                position: item.geometry.coordinates,
                zooms: [2, 22],
                opacity: 1,
                zIndex: 20,
                extData:{
                    ...item.item
                },
                text: {
                    content: content,
                    direction: 'bottom',
                    value:'23',
                    offset: [style.t_lr, style.t_tb],
                    style: {
                        fontFamily: style.t_TextStyle.fontFamily,
                        fontSize:parseFloat(style.t_TextStyle.fontSize),
                        fontWeight:style.t_TextStyle.fontWeight,
                        fontStyle: style.t_TextStyle.fontStyle,
                        fillColor: style.t_TextStyle.color
                    },
                },
            });
            labelsMarker.on('click',function(item,x){
                if (th.items){
                    _this.clickHandler(item.target._opts.name,th);
                }
            });

            //鼠标提示标签
            if (style.t_show && th.tooltipFields.length>0){
                labelsMarker.on('mouseover',function(rem){
                    const info = [];
                    info.push("<div class='content-window-card'><div></div> ");
                    info.push(`<p class='input-title'>${item.properties.category}</p><hr class='hr'>`);
                    th.tooltipFields.forEach((x)=>{
                        info.push(`<p class='input-item'>${x} : ${item.item[x]}</p>`);
                    })
                    th.infoWindow.setContent(info.join(""));
                    th.infoWindow.open(th.map, item.geometry.coordinates);
                });
                labelsMarker.on('mouseout',function(ite){
                    setTimeout(function (){
                        th.infoWindow.close();
                    },style.t_remain)
                });
            }
            th.labelLayer.add(labelsMarker);
        });

    }

    private addTitle(){

    }

    /**
     * 组织json
     * @param th
     * @param data
     * @param style
     * @private
     */
    private filterGeoJSON(th,data,style){
        const json=[];
        data.features.forEach((x)=>{
            if (x.geometry.coordinates[0]!=th.line_center[0].center[0] && x.geometry.coordinates[1]!=th.line_center[0].center[1]) {
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
                            style.line_state == "in" ? x.geometry.coordinates : th.line_center[0].center,
                            style.line_state == "in" ? th.line_center[0].center : x.geometry.coordinates
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
    private clickHandler = (node: any,th:any) => {
        const sid=this.getNodeSelectionId(node,th);
        if (th.selectionManager.contains(sid)) {
            th.selectionManager.clear(sid)
        }else{
            th.selectionManager.select(sid,true)
        }
    }
    public getNodeSelectionId = (key: any,th:any) => {
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
            th.map.remove(th.mk);
        }


        th.pl = new Loca.PrismLayer({
            zIndex: 10,
            opacity: style.p_opacity * 0.01,
            visible: false,
            hasSide: true,
        });
        var _data = {
            "type": "FeatureCollection",
            "features": [
                data
            ]
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
                var props = f.properties;
                th.mk = new AMap.Marker({
                    anchor: 'bottom-center',
                    position: [f.coordinates[0], f.coordinates[1], p_height],
                    content: `<div id="box" class="box" > <div class="box-cent">` +
                        `<p class="sp_top" >${th.add_key}:${props['cityName']}</p>` +
                        `<p class="sp_en" >${th.cate_key}:${props['category'] == undefined ? "未分类" : props['category']}</p>` +
                        `<p class="sp_en" >${th.num_key}:${props['ratio']}</p>` +
                        '</div>' +
                        '</div>',
                    // content: `<div id="box" class="box" style="width: ${style.p_title_width};height: ${style.p_title_height}"> <div class="box-cent">` +
                    //     `<p class="sp_top" style="color: ${style.p_title_TextStyle.color};font-family: '${style.p_title_TextStyle.fontFamily}';font-size: ${style.p_title_TextStyle.fontSize};font-style: ${style.p_title_TextStyle.fontStyle};font-weight: '${style.p_title_TextStyle.fontWeight}'">${th.add_key}:${props['cityName']}</p>` +
                    //     `<p class="sp_en" style="color: ${style.p_title_TextStyle.color};font-family: '${style.p_title_TextStyle.fontFamily}';font-size: ${style.p_title_TextStyle.fontSize};font-style: ${style.p_title_TextStyle.fontStyle};font-weight: '${style.p_title_TextStyle.fontWeight}'">${th.cate_key}:${props['category']==undefined?"未分类":props['category']}</p>` +
                    //     `<p class="sp_en" style="color: ${style.p_title_TextStyle.color};font-family: '${style.p_title_TextStyle.fontFamily}';font-size: ${style.p_title_TextStyle.fontSize};font-style: ${style.p_title_TextStyle.fontStyle};font-weight: '${style.p_title_TextStyle.fontWeight}'">${th.num_key}:${props['ratio']}</p>` +
                    //     '</div>' +
                    //     '</div>',
                });
                th.map.add(
                    th.mk
                );

                setTimeout(function () {
                    $('.box-cent').show(500);
                }, 500)
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