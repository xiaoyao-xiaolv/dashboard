import shape = require("./IShape");
import jslinq from "jslinq";
// @ts-ignore
import Loca from 'Loca';

/**
 * 牌点功能实现
 */
export class CardPoint implements shape.IShape {


    public buildChart(th) {

        const config = th.renderConfig;
        const style = th.styleConfig;
        let timeOut:any;

        if (!th.loca) {
            th.loca = new Loca.Container({
                map: th.map
            });
        }
        //获取当前需要轮播的坐标点信息
        let coords=[];
        //获取没有条件筛选的数据
        {
            const result = jslinq(config.data_cardPoint.features).where(x => x["rid"] != -1);
            const c_data = result['items'];
            if (c_data.length > 0) {
                const g_data = {
                    data: {
                        "type": "FeatureCollection",
                        "features": c_data
                    }
                }
                coords = c_data.map((x, i) => {
                    return x.geometry.coordinates;
                });
                var geo = new Loca.GeoJSONSource({
                    data: g_data.data
                });
                // 文字主体图层

                const zMarker = new Loca.ZMarkerLayer({
                    zIndex: 120,
                });
                zMarker.setSource(geo);
                zMarker.setStyle({
                    content: (i, feat) => {
                        const props = feat.properties;
                        const leftColor = props.price < style.p_number ? 'rgba(0, 28, 52, 0.6)' : 'rgba(33,33,33,0.6)';
                        const rightColor = props.price < style.p_number ? '#038684' : 'rgba(172, 137, 51, 0.3)';
                        const borderColor = props.price < style.p_number ? '#038684' : 'rgba(172, 137, 51, 1)';
                        const text = `${props['name']}: ${th.formatData(props['price'], th.format, th.displayUnit_3)}`;
                        //const text = `${props['name']}`;
                        let fontWidth = th.styleConfig.p_title_TextStyle.fontSize.replace('pt', '') / 0.75;
                        let r_width = text.length * fontWidth;
                        if (style.p_title_width>r_width){
                            r_width=style.p_title_width;
                        }

                        return (
                            `<div style="width: ${r_width}px; height: ${style.p_title_height}px; padding: 0 0;">` +
                            `<p style="display: block; height:${fontWidth*2}px; line-height:${fontWidth*2}px;background-image: linear-gradient(to right,${leftColor},${leftColor},${rightColor},rgba(0,0,0,0.4)); border:4px solid `
                            + borderColor + `; color: ${style.p_title_TextStyle.color};font-family: '${style.p_title_TextStyle.fontFamily}';font-size: ${style.p_title_TextStyle.fontSize};font-style: ${style.p_title_TextStyle.fontStyle};font-weight: '${style.p_title_TextStyle.fontWeight}'; border-radius: ${style.p_radius}px; text-align:center; margin:0; padding:5px;">${text}` +
                            `</p><span style="width: 130px; height: 130px; margin: 0 auto; display: block; background: url(https://a.amap.com/Loca/static/loca-v2/demos/images/prism_`
                            + (props['price'] < style.p_number ? 'blue' : 'yellow') + '.png);"></span></div>'
                        );
                    },
                    unit: style.p_unit,
                    rotation: 0,
                    alwaysFront: true,
                    size: [490 / 2, 222 / 2],
                    altitude: 0,
                });


                // 浮动三角

                const triangleZMarker = new Loca.ZMarkerLayer({
                    zIndex: 119,
                });
                triangleZMarker.setSource(geo);
                triangleZMarker.setStyle({
                    content: (i, feat) => {
                        let png = 'https://a.amap.com/Loca/static/loca-v2/demos/images/triangle_'
                            + (feat.properties.price < style.p_number ? 'blue' : 'yellow')
                            + '.png';
                        if (style.p_img_fd) {
                            png = style.p_img_fd;
                        }
                        return (
                            `<div style="width: ${style.p_text_height+10}px; height: ${style.p_text_height+10}px; background: url(${png});"></div>`
                        );
                    },
                    unit: style.p_unit,
                    rotation: 0,
                    alwaysFront: true,
                    size: [60, 60],
                    altitude: style.p_altitude,
                });
                triangleZMarker.addAnimate({
                    key: 'altitude',
                    value: [0, 1],
                    random: true,
                    transform: 1000,
                    delay: 2000,
                    yoyo: true,
                    repeat: 999999,
                });


                // 呼吸点 蓝色

                var scatterBlue = new Loca.ScatterLayer({
                    zIndex: 110,
                    opacity: 1,
                    visible: true,
                    zooms: [2, 26],
                    depth: false,
                });
                scatterBlue.setSource(geo);
                scatterBlue.setStyle({
                    unit: style.p_unit,
                    size: function (i, feat) {
                        return feat.properties.price < style.p_number ? [90, 90] : [0, 0];
                    },
                    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/scan_blue.png',
                    altitude: 20,
                    duration: 2000,
                    animate: true,
                });


                // 呼吸点 金色

                const scatterYellow = new Loca.ScatterLayer({
                    zIndex: 110,
                    opacity: 1,
                    visible: true,
                    zooms: [2, 26],
                    depth: false
                });

                scatterYellow.setSource(geo);
                scatterYellow.setStyle({
                    unit: style.p_unit,
                    size: function (i, feat) {
                        return feat.properties.price > style.p_number ? [90, 90] : [0, 0];
                    },
                    texture: 'https://a.amap.com/Loca/static/loca-v2/demos/images/scan_yellow.png',
                    altitude: 20,
                    duration: 2000,
                    animate: true,
                });

                th.cardDates.push({
                    loca_1: zMarker,
                    loca_2: triangleZMarker,
                    loca_3: scatterBlue,
                    loca_4: scatterYellow
                })


                th.cardDates.forEach(x => {
                    th.loca.add(x.loca_1);
                    th.loca.add(x.loca_2);
                    th.loca.add(x.loca_3);
                    th.loca.add(x.loca_4);
                });
                //启用轮播
                if (style.p_rolling && coords.length>1) {
                    th.loca.animate.start();
                    setTimeout(function(){
                        animate(1);
                    }, 5000);
                    console.log(timeOut)
                }

            }
        }


        function animate(index){
            if (index>=coords.length){
                index=1;
            }
            const star=coords[index-1];
            let inital=coords[index];
            const end=[inital[0],inital[1]];
            th.loca.viewControl.clearAnimates();


            th.map.panTo(end);
            setTimeout(function (){
                animate(++index)
            },5000);

            // th.loca.viewControl.addAnimates([
            //     {
            //         center: {
            //             value: end,
            //             control: [star, end],
            //             timing: [0, 0, 0, 0],
            //             duration: style.p_sj_time ,
            //         },
            //         zoom: {
            //             value: style.zoom+style.p_zoom,
            //             control: [[0.3, style.zoom-0.1], [0.3, style.zoom+0.1]],
            //             timing: [0, 0, 0, 0],
            //             duration: style.p_sj_time ,
            //         },
            //         pitch: {
            //             value: style.pitch,
            //             control: [[1, style.pitch-style.p_pitch], [1, style.pitch+style.p_pitch]],
            //             timing: [0, 0, 0, 0],
            //             duration: style.p_sj_time ,
            //         },
            //         rotation: {
            //             value: style.p_round,
            //             control: [[1, 0-style.p_rotation], [1, style.p_rotation]],
            //             timing: [0, 0, 0, 0],
            //             duration: style.p_sj_time ,
            //         },
            //     }
            // ], function () {
            //     console.log('kaishile')
            //     timeOut=setTimeout(function (){
            //         animate(++index);
            //     }, style.p_time);
            //     console.log('jieshule')
            // });
        }
    }
}