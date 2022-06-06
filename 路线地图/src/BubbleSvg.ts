import '../style/visual.less';

let echarts = require('echarts/lib/echarts');
require('echarts/lib/chart/lines');
require('echarts/lib/chart/effectScatter');

require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");
require("echarts/lib/component/geo");


import shape = require("./IShape");
import jslinq from "jslinq";
import $ from 'jquery';
/**
 * 贴地点功能实现
 */
export class BubbleSvg implements shape.IShape {


    public buildChart(th){
        const config = th.renderConfig;
        const style = th.styleConfig;

        let icon_symbol = style.icon_style;

        if (style.icon_style == 'zdy') {
            if (style.icon_symbol) {
                icon_symbol = "image://"+style.icon_symbol;
            } else {
                icon_symbol = "circle";
            }
        }
        let option;
        let svg;
        if (config.svgPath.toUpperCase().indexOf('</SVG>') == -1) {
            svg = $.ajax({url: config.svgPath, async: false}).responseText;
        } else {
            svg = config.svgPath;
        }
        echarts.registerMap('mapr', {svg: svg});


        //固定路线
        if (style.effect_symbol) {
            config.symbol = "image://" + style.effect_symbol;
        }else{
            config.symbol="circle";
        }
        option = {
            tooltip: {
                show: style.showTooltip,
                trigger: 'item',
                formatter: function (x){
                    if (x.data.length==2){
                        return null;
                    }
                    if (x.componentSubType=='lines'){
                        const rdt=x.data.values;
                        let toop=`<strong>${th.titleKey_1}:${rdt[th.titleKey_1]}</strong><br/><hr style="color: aqua"/>${th.genreKey_1}:${rdt[th.genreKey_1]}`;
                        th.tooltipFields[1].forEach(rt=>{
                            toop+=`<br/>${rt}:${rdt[rt]}`;
                        });
                        return toop;
                    }else{
                        const rdt=x.data[3];
                        let toop=`<strong>${th.titleKey_0}:${rdt[th.titleKey_0]}</strong><br/><hr style="color: aqua"/>${th.genreKey_0}:${rdt[th.genreKey_0]}`;
                        th.tooltipFields[0].forEach(rt=>{
                            toop+=`<br/>${rt}:${rdt[rt]}`;
                        });
                        return toop;
                    }
                },
                backgroundColor: style.tooltipBackgroundColor,
                borderColor: style.tooltipBorderColor,
                borderWidth: 1,
                borderRadius: 4,
                textStyle: {
                    ...style.tooltipTextStyle
                }
            },
            geo: {
                map: 'mapr',
                roam: style.roam,
                layoutCenter: [`${style.left}%`, `${style.top}%`],
                layoutSize: style.layoutSize + '%',
            },
            series: [
                {
                    name: '路线地图',
                    type: 'lines',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    polyline: true,
                    lineStyle: {
                        color: style.lineStyle_color,
                        width: style.lineStyle_width,
                        opacity: style.lineStyle_opacity,
                        type: style.lineStyle_type
                    },
                    effect: {
                        show: style.effect_show,
                        period: 8,
                        loop:style.loop,
                        color: style.effect_color,
                        constantSpeed: style.effect_constantSpeed,
                        trailLength: 0,
                        symbolSize: [style.effect_symbolSize_width, style.effect_symbolSize_height],
                        symbol: config.symbol
                    },
                    data: []
                },
                {
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    geoIndex: 0,
                    symbol: function (val, para) {
                        if (style.customize.length > 0) {
                            const fl = val[2].toString().toUpperCase();
                            const item = jslinq(style.customize).where(x => x["coord_img"] != undefined)['items'];
                            if (item.length > 0) {
                                //根据类型查询
                                const lx_item = jslinq(item).where(x => x["coord_type"].toString().toUpperCase() == fl)['items'];
                                if (lx_item.length > 0) {
                                    return "image://" + lx_item[0]['coord_img'];
                                }
                            }
                        }
                        if (val.length>2){
                            if (val[3][th.imgKey]){
                                if (val[3][th.imgKey].trim()!=""){
                                    return "image://"+val[3][th.imgKey];
                                }
                            }
                        }
                        return icon_symbol;
                    },
                    symbolSize: function(val,para){
                        if (style.customize.length > 0) {
                            const fl = val[2].toString().toUpperCase();
                            const item = jslinq(style.customize).where(x => x["coord_img"] != undefined)['items'];
                            if (item.length > 0) {
                                //根据类型查询
                                const lx_item = jslinq(item).where(x => x["coord_type"].toString().toUpperCase() == fl)['items'];
                                if (lx_item.length > 0) {
                                    return [lx_item[0].r_icon_width, lx_item[0].r_icon_height];
                                }
                            }
                        }
                        return [style.r_icon_width, style.r_icon_height];
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        //涟漪颜色 只有用默认图标才可以
                        color: style.bw_color,
                        //波纹周期
                        period: style.bw_period,
                        //波纹比例
                        scale: style.bw_scale
                    },
                    label: {
                        show: style.lbl_show,
                        position: [style.lbl_x, style.lbl_y],
                        rotate: style.lbl_rotate,
                        formatter: function (val) {
                            return val.data[2];
                        },
                        color: style.lbl_color,
                        fontSize: style.lbl_fontSize,
                        backgroundColor: style.lbl_backgroundColor,
                        borderColor: style.lbl_borderColor,
                        borderWidth: style.lbl_borderWidth,
                        borderRadius: [style.lbl_borderRadius.top, style.lbl_borderRadius.bottom, style.lbl_borderRadius.left, style.lbl_borderRadius.right],
                        padding: [style.lbl_padding.top, style.lbl_padding.bottom, style.lbl_padding.left, style.lbl_padding.right],
                        shadowColor: style.lbl_shadowColor,
                        shadowBlur: style.lbl_shadowBlur,
                        shadowOffsetX: style.lbl_shadowOffsetX,
                        shadowOffsetY: style.lbl_shadowOffsetY,
                        width: style.lbl_width,
                        height: style.lbl_heigth,
                        overflow: style.lbl_overflow,
                        ellipsis: '...'
                    },
                    labelLine: {
                        show: style.lin_show,
                        showAbove: false,
                        length2: style.lin_width,
                        smooth: style.lin_smooth,
                        minTurnAngle: style.lin_minTurnAngle,
                        lineStyle: {
                            width: style.lin_widthx,
                            type: style.lin_type,
                            shadowBlur: style.lin_shadowBlur,
                            shadowColor: style.lin_shadowColor,
                            shadowOffsetX: style.lin_shadowOffsetY,
                            shadowOffsetY: style.lin_shadowOffsetY
                        }
                    },
                    animation: true,
                    itemStyle: {
                        color: style.bd_color
                    },
                    data: config.point

                }
            ]
        };
        //处理路线地图
        {
            config.jData.forEach((key) => {
                const luxian = key.coord;
                //判断数据项与配置项是否匹配
                const icoItems = jslinq(th.styleConfig.ico_collection).where(x => x["txtFL"].toUpperCase().trim() == key.name.toUpperCase())["items"];
                let item = {};
                if (icoItems.length > 0) {
                    const k_ico = icoItems[0];
                    let mbol = config.symbol;
                    if (k_ico.effect_symbol) {
                        mbol = "image://" + k_ico.effect_symbol;
                    }
                    item = {
                        lineStyle: {
                            color: k_ico.lineStyle_color,
                            width: k_ico.lineStyle_width,
                            opacity: k_ico.lineStyle_opacity,
                            type: k_ico.lineStyle_type
                        },
                        effect: {
                            color: k_ico.effect_color,
                            constantSpeed: k_ico.effect_constantSpeed,
                            symbolSize: [k_ico.effect_symbolSize_width, k_ico.effect_symbolSize_height],
                            symbol: mbol
                        },
                        coords: luxian,
                        values:key.items
                    }
                } else {
                    let mbol = config.symbol;
                    if (th.imgKey) {
                        mbol = th.isImage(key.img,config.symbol);
                    }
                    item = {
                        lineStyle: {
                            color: style.lineStyle_color,
                            width: style.lineStyle_width,
                            opacity: style.lineStyle_opacity,
                            type: style.lineStyle_type
                        },
                        effect: {
                            color: style.effect_color,
                            constantSpeed: style.effect_constantSpeed,
                            symbolSize: [style.effect_symbolSize_width, style.effect_symbolSize_height],
                            symbol: mbol
                        },
                        coords: luxian,
                        values:key.items
                    }
                }
                option.series[0].data.push(item);
            });
        }
        th.echartsInstance.setOption(option);

        //绑定选中事件
        const _this=this;
        th.echartsInstance.on('click', function (params) {
            if (params.seriesType=='lines'){
                const selectedName = params.data.values[th.titleKey_1];
                _this.clickHandler(selectedName,th,'L');
            }else{
                const selectedName = params.data[3][th.titleKey_0];
                _this.clickHandler(selectedName,th,'D');
            }
        });

        if (config.isMock) {
            th.container.style.opacity = '0.3';
        } else {
            th.container.style.opacity = '1';
        }
    }

    private clickHandler = (node: any,th:any,ty:any) => {
        if(th.items[0] || th.items[1]) {
            let index=1;
            if (ty!='L'){
                index=0;
            }
            th.items[index].forEach((x)=>{
                if (x.name==node){
                    th.selectionManager.select(x.selectionId, true);
                }else{
                    th.selectionManager.clear(x.selectionId);
                }
            })
        }
    }

    public getNodeSelectionId = (key: any,th:any,ty:any) => {
        let index=1;
        if (ty!='L'){
            index=0;
        }
        const {selectionId} = th.items[index].find((item: any) => item.name == key);
        return selectionId
    }
}