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

        const _this=this;

        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }

        th.maxNum=jslinq(config.data_point.features).max(x=>x["properties"].ratio);
        th.maxNum=th.maxNum==0?1:th.maxNum;
        //高级图点闪点配置,根据条件过滤

        // style.customize.forEach(x => {
        //     if (x.icon_symbol) {
        //         let str = x.num_interval.split(",");
        //         let left = str[0].length;
        //         let right = str[1].length;
        //         //记录条件值，逻辑数值
        //         let where_1 = "";
        //         let where_2 = "";
        //         let leftValue = -1;
        //         let rightValue = -1;
        //         if (left - 1) {
        //             leftValue = str[0].substring(1);
        //             where_1 = str[0].substring(0, 1) === "[" ? ">=" : ">";
        //         }
        //         if (right - 1) {
        //             rightValue = str[1].substring(0, str[1].length - 1);
        //             where_2 = str[1].substring(right - 1, right) === "]" ? "<=" : "<";
        //         }
        //         let result = jslinq(config.data_point.features).where(x => x["rid"] != -1);
        //         console.log('config.data_point.features',config.data_point.features)
        //         if (where_1 === ">") {
        //             result = result.where(x => x["properties"].ratio > leftValue);
        //         } else if (where_1 === ">=") {
        //             result = result.where(x => x["properties"].ratio >= leftValue);
        //         }
        //         if (where_2 === "<") {
        //             result = result.where(x => x["properties"].ratio < rightValue);
        //         } else if (where_1 === "<=") {
        //             result = result.where(x => x["properties"].ratio <= rightValue);
        //         }
        //         if (x.p_category.trim()) {
        //             result = result.where(v => v["properties"].category == x.p_category.trim())
        //         }
        //         const c_data = result['items'];
        //         console.log(c_data)
        //         c_data.forEach(x => {
        //             x.rid = "-1";
        //         });
        //         if (c_data.length > 0) {
        //             const g_data = {
        //                 data: {
        //                     "type": "FeatureCollection",
        //                     "features": c_data
        //                 }
        //             }
        //             //闪点组合
        //             const geo = new Loca.GeoJSONSource({
        //                 data: g_data.data
        //             });
        //
        //             const scatter = new Loca.ScatterLayer({
        //                 zIndex: 10,
        //                 opacity: 1,
        //                 visible: true,
        //                 zooms: [2, 22],
        //             });
        //             scatter.setSource(geo, {
        //                 unit: style.unit,
        //                 size: [x.r_icon_width, x.r_icon_height],
        //                 texture: x.icon_symbol
        //             });
        //             th.scatters.push({
        //                 scatter: scatter
        //             });
        //             //开启闪烁点
        //             if (x.r_icon_flash) {
        //                 const breath = new Loca.ScatterLayer({
        //                     zIndex: 1,
        //                 });
        //                 breath.setSource(geo);
        //                 breath.setStyle({
        //                     unit: style.unit,
        //                     size: [x.r_f_width, x.r_f_height],
        //                     texture: x.icon_png,
        //                     animate: true,
        //                     duration: x.r_f_duration,
        //                 });
        //                 th.breaths.push({
        //                     breath: breath
        //                 });
        //             }
        //         }
        //     }
        // });
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

                icon_size=style.icon_size;
                if (style.unit!='px'){
                    icon_size*=100;
                }
                // //设置标点
                if (style.icon_type == "PO") {
                    scatter.setSource(geo, {
                        unit: style.unit,
                        size: [icon_size, icon_size],
                        color: style.icon_color,
                        borderColor: style.icon_bor,
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
                        zIndex: 1,
                    });
                    breath.setSource(geo);
                    breath.setStyle({
                        unit: style.unit,
                        size: [style.r_f_width*icon_size, style.r_f_width*icon_size],
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
        if (style.p_rolling){
            if (th._interval){
                clearInterval(th._interval);
            }
            th._interval=setInterval(function (){
                th._index++;
                if (th._index==config.data_point.features.length){
                    th._index=0;
                }
                th.map.panTo(config.data_point.features[th._index].geometry.coordinates);
                th.map.panBy(style.q_by_x, style.q_by_y);

                _this.addPrismLayer(th,config.data_point.features[th._index],style);

            },style.q_interval);
        }else{
            if (th._interval){
                clearInterval(th._interval);
            }
        }

    }

    public addPrismLayer(th,data,style){
        if (th.pl){
            th.loca.remove(th.pl);
            th.map.remove(th.mk);
        }


        th.pl = new Loca.PrismLayer({
            zIndex: 10,
            opacity: style.p_opacity*0.01,
            visible: false,
            hasSide: true,
        });
        var _data={
            "type": "FeatureCollection",
            "features": [
                data
            ]
        };

        var geo = new Loca.GeoJSONSource({
            data: _data
        });
        th.pl.setSource(geo);
        let p_height=style.p_height;
        let p_radius=style.pr_radius;
        if (style.unit!='px'){
            p_height*=100;
            p_radius*=100;
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

                var height = Math.max(100, props['ratio']/th.maxNum * p_height);
                th.mk=new AMap.Marker({
                    anchor: 'bottom-center',
                    position: [f.coordinates[0], f.coordinates[1], p_height],
                    content: '<div id="box" class="box"> <div class="box-cent">' +
                        `<p class="sp_top">${th.add_key}:${props['cityName']}</p>` +
                        `<p class="sp_en">${th.cate_key}:${props['category']}</p>` +
                        `<p class="sp_en">${th.num_key}:${props['ratio']}</p>` +
                        '</div>' +
                        '</div>',
                });
                th.map.add(
                    th.mk
                );

                setTimeout(function (){
                    $('.box-cent').show(500);
                },500)
                return height;
            },
            altitude: 0,
        });

        th.loca.add(th.pl);


        setTimeout(function () {
            th.pl.show(5000);
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