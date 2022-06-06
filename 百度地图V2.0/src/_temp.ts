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
export class _temp implements shape.IShape {


    public buildChart(th){
        const config = th.renderConfig;
        const style = th.styleConfig;


        //点击事件
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