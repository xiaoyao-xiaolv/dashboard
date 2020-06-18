import '../style/visual.less';
import _ = require('lodash') ;
import * as echarts from 'echarts'

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  static mockItems = [
    ["1月", "2月", "3月", "4月", "5月", "累计"], [12, 20, 6, -7, 59]
];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.properties = {
      fontSize: 14,
      textColor: '#ffffff',
      barUpColor: '#eb4b5c',
      barDowncolor: '#b7d62d',
      customShowMark: 'false'
    };

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      let dimension = plainData.profile.dimension.values[0].display;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
  
      this.items[0] = plainData.sort[dimension].order;
      this.items[0].push('累计')
      this.items[1] = plainData.data.map((item) => item[ActualValue]);
    }

    this.properties = options.properties;
    this.render();
  }
  
  public getBasicData = (dy, zt = [], label = [], options: any) => {
    for(let i = 0; i< dy.length; i++){
      let obj = [];
      if(i=== 0 || i === dy.length - 1){
        let x  = parseFloat(dy[i]);
          if(x < 0 ) {
                label.push({
                  value:dy[i],
                  coord:[i,x],
                  label:{
                    position:'bottom',
                    show: true,
                    fontSize: options.fontSize,
                    color: options.barDowncolor
                  }
                });
          } else {
                label.push({ value:dy[i], coord:[i,x]});
          }
        
          obj.push(0);
          obj.push(dy[i]);
          obj.push(dy[i]);
          obj.push(dy[i]);
          zt.push(obj);
      }else{
          var start = zt[i-1][1];
          var val = parseFloat(dy[i]);
          var end = start+val;
          if(dy[i]<0){
                label.push({
                  value:dy[i],
                  coord:[i,end],
                  label:{
                    position:'bottom',
                    show: options.customShowMark,
                    fontSize: options.fontSize,
                    color: options.barDowncolor
                  }});
          }else{
                label.push({
                  value:dy[i],
                  coord:[i,end]
                });
          }
        
          obj.push(start);
          obj.push(end);
          obj.push(end);
          obj.push(end);
          zt.push(obj);
      }
      
    }
    return {
      dy,
      zt,
      label
    }
  }

  public render () {
    this.chart.clear();
    // get data
    const isMock = !this.items.length
    const options = this.properties;
    const initData = isMock ? Visual.mockItems[1] : this.items[1]
    const dx: Array<any> = isMock ? Visual.mockItems[0] : this.items[0] 
    const dyData: Array<any> =  initData.concat([_.sum(initData)])
    let { dy, zt, label} = this.getBasicData(dyData, [], [], options)
    // get properties
    
    console.log(options, '======properties  options')
    console.log('options', options.customOpacity)
    const option = {
      xAxis: {
          data: dx,
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: options.fontSize,
              color: options.textColor
            }
          },
      },
      yAxis: {
          type:'value',
          scale: true,
          axisLabel: {
            textStyle: {
              fontSize: options.fontSize,
              color: options.textColor
            }
          },
      },
      series: [{
          type: 'candlestick',
          barCategoryGap: '10',
          //开始值、结束值、最大值、最小值
          //[[1,2,3,4]
          data: zt,
          itemStyle:{
            barBorderRadius: [ 2, 2, 0, 0],
            color: options.barUpColor,
            color0: options.barDowncolor,
            opacity: options.customOpacity / 100,
            borderWidth: 0,
          },
          markPoint: {
              symbol: 'rect',
              symbolSize: 0.000000000000001,
              label: {
                  show: options.customShowMark,
                  color: options.barUpColor,
                  position: 'top',
                  fontSize: options.fontSize,
                  formatter: function(res) {
                      return res.data.value;
                  }
              },
              data: label
          },
          emphasis:{
              itemStyle:{
                  borderWidth:0,
                  barBorderRadius: [ 20, 9, 0, 0]
              }
          }
      }]
    };
   this.chart.setOption(option)

  }
  public onDestroy() {

  }

  public onResize() {

    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}