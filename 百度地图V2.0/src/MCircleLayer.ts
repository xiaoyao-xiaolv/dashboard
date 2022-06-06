import '../style/visual.less';


import mapvgl =require('mapvgl');

import shape = require("./IShape");

/**
 * 贴地点功能实现
 */
export class MCircleLayer implements shape.IShape {


    public buildChart(th){
        const config = th.renderConfig;
        const style = th.styleConfig;

        const data = th._items.map((item, index) => {
            let rNum=0;
            item.elements.forEach((x)=>{
                rNum+=x.data[th._numKey];
            });
            const ratio=rNum/th.maxNum*100;
            let ix=0;
            if (ratio>0 && ratio<=20){
                ix=4;
            }else if (ratio>20 && ratio<=40){
                ix=3;
            }else if (ratio>40 && ratio<=60){
                ix=2;
            }else if (ratio>60 && ratio<=80){
                ix=1;
            }else if (ratio>80 && ratio<=100){
                ix=0;
            }
            if (style.mk_type=='wave' || style.mk_type=='bubble' || style.mk_type=='point'){
                if (style.ra_moving){
                    rNum=parseInt((rNum/th.maxNum* style.ra_radius* 0.01).toFixed(0));
                }else{
                    rNum=parseInt((style.ra_radius* 0.01).toFixed(0));
                }

            }
            return {
                geometry: {
                    type: 'Point',
                    coordinates: [item.elements[0].lng, item.elements[0].lat]
                },
                properties: {
                    text: '￥' + (Math.random() * 10).toFixed(2)
                },
                color:style.ra_color[ix%style.ra_color.length],
                size: rNum
            };
        });
        //this.textLayer(th,data,style,maxNum);
        //this.labelLayer(th,data,style);
        switch (style.mk_type){
            case 'radar':
                this.radar(th,data,style);
                break;
            case 'breath':
                this.breath(th,data,style);
                break;
            case 'wave':
                this.wave(th,data,style)
                break;
            case 'bubble':
                this.bubble(th,data,style)
                break;
            case 'point':
                this.point(th,data,style)
                break;
            default:
                break;
        }

        th.dateLog(1);
    }

    /**
     * 带波纹扩散的圆
     * @param th
     * @param data
     * @param style
     * @private
     */
    private wave(th,data,style){
        var layer = new mapvgl.CircleLayer({
            // 绘制雷达扫描的圆
            type: 'wave',
            radius: r=> 1.6 * r,
            // 周期
            duration: 1/3,
            trail: 3,
            random:false
        });
        th.view.addLayer(layer);
        layer.setData(data);
    }

    /**
     * 扩散图
     * @param th
     * @param data
     * @param style
     * @param maxNum
     * @private
     */
    private bubble(th,data,style){
        var layer = new mapvgl.CircleLayer({
            type: 'bubble',
            size: (size)=> 3 * size,
            radius(size){
                return 2 * size;
            },
            // 周期
            duration: 3,
            random:false,
            trail: 3
        });
        th.view.addLayer(layer);
        layer.setData(data);
    }

    /**
     * 散点图
     * @param th
     * @param data
     * @param style
     * @private
     */
    private point(th,data,style){
        var simpleLayer = new mapvgl.CircleLayer({
            // 默认类型，绘制简单圆
            type: 'simple',
            enablePicked: true,
            autoSelect: true, // 根据鼠标位置来自动设置选中项
        });
        th.view.addLayer(simpleLayer);
        simpleLayer.setData(data);
    }
    /**
     * 呼吸图
     * @param th
     * @param data
     * @param style
     * @param maxNum
     * @private
     */
    private breath(th,data,style){
        var layer = new mapvgl.CircleLayer({
            type: 'breath',
            radius: function(x){
                if (style.ra_moving){
                    return x / th.maxNum * style.ra_radius * 0.01;
                }
                return style.ra_radius*0.01;
            },
            // 周期
            duration: 3,
            random:false,
            trail: 3
        });
        th.view.addLayer(layer);
        layer.setData(data);
    }

    /**
     * 雷达图
     * @param th
     * @param data
     * @param style
     * @param maxNum
     * @private
     */
    private radar(th,data,style){
        var radarhLayer = new mapvgl.CircleLayer({
            type: 'radar',
            unit: 'm',
            radius: function(x){
                if (style.ra_moving){
                    return x / th.maxNum * style.ra_radius * 100;
                }
                return style.ra_radius*100;
            },
            random: style.ra_random,
            // 周期
            duration: style.ra_duration*0.001,
            // 边缘抗锯齿，默认开启，可关闭
            antialias: false,
            // 渐变拖尾的角度，同时可控制旋转方向，默认顺时针，负值时反向旋转
            trail: !style.ra_fx?style.ra_trail:0-style.ra_trail
        });
        th.view.addLayer(radarhLayer);
        radarhLayer.setData(data);
    }

    private labelLayer(th,data,style){
        var layer = new mapvgl.LabelLayer({
            textAlign: 'center',
            textColor: style.tooltipTextStyle.color,
            fontFamily:style.tooltipTextStyle.fontFamily,
            fontWeight:style.tooltipTextStyle.fontWeight,
            fontStyle:style.tooltipTextStyle.fontStyle,
            borderColor: style.tooltipBorderColor,
            backgroundColor: style.tooltipBackgroundColor,
            padding: [style.tooltipPadding.top, style.tooltipPadding.right,style.tooltipPadding.bottom,style.tooltipPadding.left],
            borderRadius: 5,
            fontSize: style.tooltipTextStyle.fontSize.replace('pt',''),
            collides: true, // 是否开启碰撞检测, 数量较多时建议打开
            enablePicked: true
        });
        th.view.addLayer(layer);
        layer.setData(data);
    }
}