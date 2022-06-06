import '../style/visual.less';


import mapvgl =require('mapvgl');

import shape = require("./IShape");

import jslinq from "jslinq";

import AreaJson from './AreaJson.json';

/**
 * 贴地点功能实现
 */
export class MHeatmapLayer implements shape.IShape {

    public buildChart(th){
        const config = th.renderConfig;
        const style = th.styleConfig;

        const data = th._items.map((item, index) => {
            let rNum=0;
            item.elements.forEach((x)=>{
                rNum+=x.data[th._numKey];
            });
            return {
                geometry: {
                    type: 'Point',
                    coordinates: [item.elements[0].lng, item.elements[0].lat]
                },
                properties: {
                    count:rNum
                },
                color:style.ra_color[1 % style.ra_color.length],
                size: rNum
            };
        });
        if (style.mp_type!='heat'){
            this.headmap(th,data,style);
        }else{
            this.headmapPoiint(th,data,style);
        }

    }


    /**
     * 热力图
     * @param th
     * @param data
     * @param style
     * @private
     */
    private headmapPoiint(th,data,style){
        var grid = new mapvgl.HeatGridLayer({
            max: th.maxNum, // 最大阈值
            min: 0, // 最小阈值
            gridSize: style.mp_size*10,
            // style: 'normal',
            gradient: { // 对应比例渐变色
                0.0: this.getColor(0,style.mp_color),
                0.2: this.getColor(1,style.mp_color),
                0.4: this.getColor(2,style.mp_color),
                0.6: this.getColor(3,style.mp_color),
                0.8: this.getColor(4,style.mp_color),
                1: this.getColor(5,style.mp_color)
            },
            riseTime: style.mp_riseTime, // 楼块初始化升起时间
            maxHeight: style.mp_max_height*100, // 最大高度
            minHeight: style.mp_min_height*100 // 最小高度
        });
        th.view.addLayer(grid);
        grid.setData(data);
    }

    /**
     * 热力图
     * @param th
     * @param data
     * @param style
     * @private
     */
    private headmap(th,data,style){
        console.log(23424234)
        console.log(th.maxNum)
        var heatmap = new mapvgl.HeatmapLayer({
            size: style.mp_type=='3d'?style.mp_size*10:style.mp_size*0.1, // 单个点绘制大小
            max: style.mp_max, // 最大阈值
            height: style.mp_type=='3d'?style.mp_height:0, // 最大高度，默认为0
            unit: style.mp_type=='3d'?'m':'px', // 单位，m:米，px: 像素
            gradient: { // 对应比例渐变色
                0.0: this.getColor(0,style.mp_color),
                0.2: this.getColor(1,style.mp_color),
                0.4: this.getColor(2,style.mp_color),
                0.6: this.getColor(3,style.mp_color),
                0.8: this.getColor(4,style.mp_color),
                1: this.getColor(5,style.mp_color)
            }
        });
        heatmap.setData(data);
        th.view.addLayer(heatmap);
    }

    private getColor(i,colors){
        if (colors.length>i){
            return colors[i];
        }else{
            return colors[colors.length-1];
        }
    }
    private getHaxColor(hax,color){
        //判断是RGB还是16进制
        const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        if (/^(rgb|RGB)/.test(color)) {
            const aColor = color.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            if (aColor.length==3){
                return "RGB(" + aColor.join(",") +','+hax+ ")";
            } else if (aColor.length==4){
                return "RGB(".concat(aColor[0],',',aColor[1],',',aColor[2],',',(hax * parseFloat(aColor[3])).toString(),')');
            }

        }else{
            const _rgb=this.colorRgb(this.colorHex(color),hax);
            return _rgb;
        }
        return color;
    }

    /**
     * 16进制颜色转为RGB格式
     * @param color
     * @private
     */
    private colorRgb(color,hx){
        var sColor = color.toLowerCase();
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是16进制颜色
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i=1; i<4; i+=1) {
                    sColorNew += sColor.slice(i, i+1).concat(sColor.slice(i, i+1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i=1; i<7; i+=2) {
                sColorChange.push(parseInt("0x"+sColor.slice(i, i+2)));
            }
            return "RGB(" + sColorChange.join(",") +','+hx+ ")";
        }
        return sColor;
    };

    /**
     * RGB格式转16进制颜色
     * @param that
     * @private
     */
    private colorHex(that){
        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        // 如果是rgb颜色表示
        if (/^(rgb|RGB)/.test(that)) {
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
            var strHex = "#";
            for (var i=0; i<aColor.length; i++) {
                var hex = Number(aColor[i]).toString(16);
                if (hex === "0") {
                    hex += hex;
                }
                strHex += hex;
            }
            if (strHex.length !== 7) {
                strHex = that;
            }
            return strHex;
        } else if (reg.test(that)) {
            var aNum = that.replace(/#/,"").split("");
            if (aNum.length === 6) {
                return that;
            } else if(aNum.length === 3) {
                var numHex = "#";
                for (var i=0; i<aNum.length; i+=1) {
                    numHex += (aNum[i] + aNum[i]);
                }
                return numHex;
            }
        }
        return that;
    };

}