import shape = require("./IShape");
import jslinq from "jslinq";
// @ts-ignore
import Loca from 'Loca';
/**
 * 实现气泡图功能
 */
export class Bubble implements shape.IShape {

    public buildChart(th) {
        const config = th.renderConfig;
        const style = th.styleConfig;
        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }
        const maxNum=jslinq(config.data_point.features).max(x=>x["properties"].ratio);
        //根据条件查询,
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
                const pl = new Loca.IconLayer({
                    zooms: [2, 20],
                    zIndex: 10,
                    visible: true,
                });
                //闪点组合
                const geo = new Loca.GeoJSONSource({
                    data: g_data.data
                });
                pl.setSource(geo);
                pl.setStyle({
                    unit: 'px',
                    icon: (index, feature) => {
                        let img = feature.properties.img;
                        if(x.q_icon){
                            img=x.q_icon;
                        }else{
                            if(img==""){
                                img=th.def_png_blue;
                            }
                        }
                        return img;
                    },
                    iconSize: (index, feature) => {
                        if (style.q_moving) {
                            let ratio = feature.properties.ratio / parseFloat(maxNum.toString());
                            return [x.q_icon_width * ratio, x.q_icon_height * ratio];
                        }
                        return [x.q_icon_width, x.q_icon_height];
                    },
                    offset: [0, 0],
                    rotation: x.q_icon_rotation,
                });

                th.bubbles.push({bubble: pl})
            }
        });
        //整合筛选条件之外的数据
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
                const geo = new Loca.GeoJSONSource({
                    data: g_data.data
                });
                if (style.q_type=="point"){
                    const pl = new Loca.PointLayer({
                        zIndex: 100,
                        blend: style.q_blend
                    });
                    pl.setSource(geo);
                    pl.setStyle({
                        radius: function (i, feature) {
                            if (style.q_moving){
                                let ratio = feature.properties.ratio/parseFloat(maxNum.toString());
                                return style.q_size*ratio;
                            }
                            return style.q_size;
                        },
                        color: style.q_color,
                        borderWidth: style.q_bw,
                        borderColor:style.q_bor,
                        blurRadius: -1,
                        unit: 'px',
                    });
                    th.points.push({point:pl})
                }else{
                    const pl = new Loca.IconLayer({
                        zooms: [2, 20],
                        zIndex: 10,
                        visible: true,
                    });
                    pl.setSource(geo);
                    pl.setStyle({
                        unit: 'px',
                        icon: (index, feature) => {
                            let img = feature.properties.img;
                            if(style.q_icon){
                                img=style.q_icon;
                            }else{
                                if(img==""){
                                    img=th.def_png_blue;
                                }
                            }
                            return img;
                        },
                        iconSize: (index,feature)=>{
                            if (style.q_moving){
                                let ratio = feature.properties.ratio/parseFloat(maxNum.toString());
                                return [style.q_icon_width*ratio, style.q_icon_height*ratio];
                            }
                            return [style.q_icon_width, style.q_icon_height];
                        },
                        offset: [0, 0],
                        rotation: style.q_icon_rotation,
                    });

                    th.bubbles.push({bubble:pl})

                }
            }
        }
        th.points.forEach(x => {
            th.loca.add(x.point);
        });
        th.bubbles.forEach(x => {
            th.loca.add(x.bubble);
            if(style.q_animate){
                x.bubble.show();
                x.bubble.addAnimate({
                    key: 'offset',
                    value: [0, 1],
                    easing: 'Linear',
                    transform: 500,
                    random: true,
                    delay: 2000,
                });
                x.bubble.addAnimate({
                    key: 'iconSize',
                    value: [0, 1],
                    easing: 'Linear',
                    transform: 500,
                    random: true,
                    delay: 2000,
                });
            }
        });
    }
}