import shape = require("./IShape");
import jslinq from "jslinq";
// @ts-ignore
import Loca from 'Loca';

/**
 * 贴地点功能实现
 */
export class Point implements shape.IShape {

    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;

        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }

        const maxNum=jslinq(config.data_point.features).max(x=>x["properties"].ratio);
        //高级图点闪点配置,根据条件过滤

        style.customize.forEach(x => {
            if (x.icon_symbol) {
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
                console.log('config.data_point.features',config.data_point.features)
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
                if (x.p_category.trim()) {
                    result = result.where(v => v["properties"].category == x.p_category.trim())
                }
                const c_data = result['items'];
                console.log(c_data)
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
                    //闪点组合
                    const geo = new Loca.GeoJSONSource({
                        data: g_data.data
                    });

                    const scatter = new Loca.ScatterLayer({
                        zIndex: 10,
                        opacity: 1,
                        visible: true,
                        zooms: [2, 22],
                    });
                    scatter.setSource(geo, {
                        unit: 'px',
                        size: [x.r_icon_width, x.r_icon_height],
                        texture: x.icon_symbol
                    });
                    th.scatters.push({
                        scatter: scatter
                    });
                    //开启闪烁点
                    if (x.r_icon_flash) {
                        const breath = new Loca.ScatterLayer({
                            zIndex: 121,
                        });
                        breath.setSource(geo);
                        breath.setStyle({
                            unit: 'px',
                            size: [x.r_f_width, x.r_f_height],
                            texture: x.icon_png,
                            animate: true,
                            duration: x.r_f_duration,
                        });
                        th.breaths.push({
                            breath: breath
                        });
                    }
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

                // //设置标点
                if (style.icon_type == "PO") {
                    scatter.setSource(geo, {
                        unit: 'px',
                        size: [style.icon_size, style.icon_size],
                        color: style.icon_color,
                        borderColor: style.icon_bor,
                        borderWidth: style.icon_bw
                    });
                } else {
                    let png = th.def_png_blue;
                    if (style.icon_symbol) {
                        png = style.icon_symbol;
                    }
                    scatter.setSource(geo);
                    scatter.setStyle({
                            unit: 'px',
                            size: [style.r_icon_width, style.r_icon_height],
                            texture: png
                        }
                    );
                }
                th.scatters.push({
                    scatter: scatter
                });
                if (style.r_icon_flash) {
                    const breath = new Loca.ScatterLayer({
                        zIndex: 121,
                    });
                    breath.setSource(geo);
                    breath.setStyle({
                        unit: 'px',
                        size: [style.r_f_width, style.r_f_height],
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

    }
}