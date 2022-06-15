import '../style/visual.less';
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/sankey')

require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

import * as $ from 'jquery';
import jslinq from "jslinq";


interface IRenderConfig {
  data;
  links;
  isMock: boolean;
}

let isTooltipModelShown = false;
export default class Visual extends WynVisual {

  private static defaultConfig: IRenderConfig = {
    data: [{name:'a'},{name:'b'},{name:'a1'},{name:'a2'},{name:'b1'},{name:'c'}],
    links: [{source:'a',target:'a1',value:5},{source:'a',target:'a2',value:3},{source:'b',target:'b1',value:8},{source:'a',target:'b1',value:3},{source:'b1',target:'a1',value:1},{source:'b1',target:'c',value:2}],
    isMock: true,
  }

  private echarts : any;
  private renderConfig: IRenderConfig;
  private dom: HTMLDivElement;
  private styleConfig: any;



  //数据联动
  private items: any;
  private host: any;
  private selectionManager: any;
  private x: number
  private y: number


  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.echarts=echarts.init(dom);
    this.dom = dom;
    this.styleConfig = options.properties;

    //数据联动

    this.host = host;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.dom.addEventListener('click', (e) => {
      this.host.toolTipService.hide();
    })
    host.eventService.registerOnCustomEventCallback(this.onCustomEventHandler);
  }

  //------------数据联动 star--------------
  public onCustomEventHandler = (name: string) => {
    console.log(name, '进来了');
  }
  public getNodeSelectionId = (label: any) => {

    const { selectionId }  = this.items.find((item: any) => item.name == label);
    return selectionId
  }
  private clickHandler = (node: any) => {
    const selectionId = this.getNodeSelectionId(node)
    if (!this.selectionManager.contains(selectionId)) {
      this.selectionManager.select(selectionId, true);
    } else {
      this.selectionManager.clear(selectionId);
    }

    this.host.toolTipService.show({
      position: {
        x: this.x,
        y: this.y,
      },
      selectionId: this.getNodeSelectionId(node),
      selected: this.selectionManager.getSelectionIds(),
      menu: true
    });
  }
  //---------数据联动 end --------------------


  public update(options: VisualNS.IVisualUpdateOptions) {
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    this.styleConfig = options.properties;
    if (plainDataView){
      const itemValues= plainDataView.profile.values.values[0].display;
      const itemKeys = plainDataView.profile.keys.values;
      const dataKey=[];
      const datas = [];
      const links = [];
      var data=plainDataView.data;
      //是否排序
      if(this.styleConfig.orderby){
        data=jslinq(data).orderBy(x=>x[itemValues]).toList();
      }
      //拼接 data
        itemKeys.forEach((key)=>{
          const grName= jslinq(data).groupBy(x=>x[key.display]);
          grName['items'].forEach((grList)=>{
            const ckName=grList.key;
            if (ckName){
              if($.inArray(ckName, dataKey)==-1){
                dataKey.push(ckName);
              }
            }
          });
        });
        //拼接 data
      dataKey.forEach((key)=>{
        datas.push({name:key});
      });
      //拼接 links
      const keys=[];
      itemKeys.forEach((key)=>{
        keys.push(key.display);
      });
      for (let i = 1; i < keys.length; i++) {
        const beName=keys[i-1];
        const tsNmae=keys[i];
        //父节点类型名称
        const grName= jslinq(data).groupBy(x=>x[beName]);
        grName['items'].forEach((grList)=>{
          const ckName=grList.key;
          //根据父节点类型名称分组,计算当前节点在此节点下的数量
          const trName=jslinq(data).where(x=>x[beName]==grList.key).groupBy(x=>x[tsNmae]);
          trName['items'].forEach((rc)=>{
            const resultData=jslinq(data).where(x=>x[beName]==grList.key && x[tsNmae]==rc.key).toList();
            var sumNum=0;
            resultData.forEach((rd)=>{
              sumNum+=parseInt(rd[itemValues].toString());
            });
            links.push({source: ckName,target:rc.key ,value: sumNum});
          });
        });
      }
      const items = plainDataView.data.reduce((result: any, item: any, i: number) => {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainDataView.profile.keys.values[0], item);
        result.push({
            name: item[keys[1]],
            selectionId,
          });
        return result;
      }, []);
      this.items = items;

      this.renderConfig = {
        data:datas,
        links:links,
        isMock: false,
      };
      this.render();
    }else{
      this.renderConfig = Visual.defaultConfig;
      this.render();
    }

  }

  public render(){

    this.host.eventService.renderStart();

    const config = this.renderConfig;
    const styleConfig=this.styleConfig;
    this.dom.style.width=styleConfig.Dwidth;
    this.dom.style.height=styleConfig.Dheight;
    if (styleConfig.curveness=="")
      styleConfig.curveness=0.5;
    const option = {
      aria: {
        enabled: true,
        decal: {
          show: styleConfig.aria
        }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        show: styleConfig.tooltip,
        formatter: '{b0}: {c0}'+styleConfig.unit
      },
      width:styleConfig.width+'%',
      height:styleConfig.height+'%',
      series: {
        type: 'sankey',
        layout: 'none',
        emphasis: {
          focus: 'adjacency'
        },
        layoutIterations:styleConfig.layoutIterations,
        draggable : styleConfig.draggable,
        nodeWidth:styleConfig.nodeWidth,
        nodeGap:styleConfig.nodeGap,
        lineStyle: {
          color: 'gradient',
          curveness: styleConfig.curveness
        },
        nodeAlign:styleConfig.nodeAlign,
        label: {
          position: styleConfig.label,
          rotate:styleConfig.rotate,
          color: styleConfig.textStyle.color,
          fontFamily: styleConfig.textStyle.fontFamily,
          fontSize: styleConfig.textStyle.fontSize.replace('pt',''),
          fontStyle: styleConfig.textStyle.fontStyle,
          fontWeight: styleConfig.textStyle.fontWeight,
          backgroundColor:styleConfig.backgroundColor,
          lineHeight:styleConfig.lineHeight
        },
        orient: styleConfig.chartType,
        data: config.data,
        links: config.links
      }
    };
    this.echarts.setOption(option);

    //数据刷新
    document.addEventListener('click', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    });
    this.host.eventService.renderFinish();


    const th=this;
    this.echarts.on('click', function(params) {
      if(params.dataType=="node"){
        th.clickHandler(params.name);
      }else if(params.dataType="edge"){
        th.clickHandler(params.data.target);
      }
    });

    this.echarts.resize();

    if (config.isMock) {
      this.dom.style.opacity = '0.3';
    } else {
      this.dom.style.opacity = '1';
    }
  }
  public onDestroy(): void {
    this.echarts.dispose();
  }


  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}