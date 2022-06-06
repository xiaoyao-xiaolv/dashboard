import shape = require("./IShape");


let echarts = require('echarts/lib/echarts');
require('echarts/components');
require('echarts/charts');

import $ from 'jquery';
import jslinq from "jslinq";


/**
 * 贴地点功能实现
 */
export class BubbleGeoJson implements shape.IShape {

    public buildChart(th) {
        this.appendMenu(th);
        this.chartOption(th);
    }


    //添加菜单
    public appendMenu(th) {
        const _th=this;
        th.menu_items=[];
        th.svg_layer.forEach(rx => {
            th.menu_items.push(rx.key)
        });
        th.menu_items = th.menu_items.sort();
        th.panel.innerHTML="";
        th.menu_items.forEach((r, i) => {
            if (th.set_opt=="" && i==0){
                th.set_opt=r;
            }
            const leve_1 = document.createElement('div');
            const a_id = `t_${i}`;
            if (th.set_opt==r){
                leve_1.className = 'sim-button button29';
            }else{
                leve_1.className = 'sim-button button28';
            }

            leve_1.id = a_id;
            const span_1 = document.createElement('span');
            span_1.innerHTML = r;
            leve_1.onclick = function () {
                const cls=$(this).attr('class');
                if (cls=='sim-button button29'){
                    return;
                }
                th.set_opt=r;
                _th.GetJsonToSvg(th);
                _th.chartOption(th);
                $('.sim-button.button29').attr('class','sim-button button28')
                leve_1.className = 'sim-button button29';
            }
            leve_1.append(span_1);
            th.panel.append(leve_1);
        });
        this.GetJsonToSvg(th);

    }

    /**
     * 数据转svg
     * @constructor
     */
    public GetJsonToSvg(th){
        const rejson=jslinq(th.svg_layer).where(x=>x['key']==th.set_opt)['items'][0]['elements'];
        let _profile= '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" version="1.2" fill-rule="evenodd" xml:space="preserve">';
        rejson.forEach((x, i) => {
            const polygon=`<polygon name="${x[th._rnameKey]}" points="${x[th._profileKey]}"/> `;
            if (x[th._rcolorKey]){
                if (x[th._rcolorKey]!=""){
                    th.takenSeatNames.push({
                        name:x[th._rnameKey],
                        color:x[th._rcolorKey]
                    })
                }
            }
            _profile+=polygon;
        });
        _profile+='</svg>';
        th.svg_geojson=_profile;
    }

    public chartOption(th){
        const style = th.styleConfig;
        var option;
        th.echartsInstance.clear();
        echarts.registerMap('HK',{ svg: th.svg_geojson });
        const _this=this;
        th.echartsInstance.setOption(
            (option = {
                tooltip: {
                    show:false,
                    trigger: 'item',
                    formatter: '{b}<br/>{c} (p / km2)'
                },
                toolbox: {
                    show: style.t_down_show,
                    orient: 'vertical',
                    left: 'right',
                    top: 'top',
                    feature: {
                        saveAsImage: {}
                    }
                },
                geo: {
                    map: 'HK',
                    roam: true,
                    selectedMode: !style.t_multiple?"single":"multiple",
                    layoutCenter: ['50%', '50%'],
                    layoutSize: '95%',
                    tooltip: {
                        show: style.t_showTooltip
                    },
                    itemStyle: {
                        color: style.t_def_bgcolor
                    },
                    emphasis: {
                        itemStyle: {
                            color: undefined,
                            borderColor: style.t_borderColor,
                            borderWidth: 2
                        },
                        label: {
                            show: false
                        }
                    },
                    select: {
                        itemStyle: {
                            color: style.t_bgcolor
                        },
                        label: {
                            show: false,
                            textBorderColor: '#fff',
                            textBorderWidth: 2
                        }
                    },
                    regions: _this.makeTakenRegions(th.takenSeatNames,th)
                },
                series: [
                ]
            })
        );
        //绑定选中事件
        th.echartsInstance.on('geoselectchanged', function (params) {
            const selectedNames = params.allSelected[0].name.slice();
            // Remove taken seats.
            for (var i = selectedNames.length - 1; i >= 0; i--) {
                if (th.takenSeatNames.indexOf(selectedNames[i]) >= 0) {
                    selectedNames.splice(i, 1);
                }
            }
            _this.clickHandler_geo(selectedNames,th);
        });

        th.container.style.opacity = '1';
    }


    public getNodeSelectionId_geo = (key: any,th:any) => {
        const {selectionId} = th.items[2].find((item: any) => item.name == key);

        const item=jslinq(th.selectionOption_geo).where(x=>x['name']==key)['items'];
        if (item.length>0){
            item[0].set=true;
        }else{
            th.selectionOption_geo.push({
                set:true,
                name:key,
                stion:selectionId
            });
        }
        return selectionId
    }
    private clickHandler_geo = (node: any,th:any) => {
        if(th.items[2]) {
            th.selectionOption_geo.forEach(x=>{
                x.set=false;
            });
            node.forEach(x=>{
                this.getNodeSelectionId_geo(x,th)
            });
            th.selectionOption_geo.forEach(x=>{
                if (x.set){
                    th.selectionManager_geo.select(x.stion, true);
                }else{
                    th.selectionManager_geo.clear(x.stion);
                }
            });
        }
    }
    /**
     * 填充配色
     * @param takenSeatNames
     */
    public makeTakenRegions(takenSeatNames,th) {
        var regions = [];
        const style = th.styleConfig;
        for (var i = 0; i < takenSeatNames.length; i++) {

            regions.push({
                name: takenSeatNames[i].name,
                silent: true,
                itemStyle: {
                    color: takenSeatNames[i].color
                },
                emphasis: {
                    itemStyle: {
                        color: undefined,
                        borderColor: style.t_borderColor,
                        borderWidth: 2
                    },
                    label: {
                        show: false
                    }
                },
                select: {
                    itemStyle: {
                        color: style.t_bgcolor
                    }
                }
            });
        }
        return regions;
    }
}