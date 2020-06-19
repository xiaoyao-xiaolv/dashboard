import '../style/visual.less';
import _ = require('lodash') ;
import * as echarts from 'echarts'


let isTooltipModelShown = false;

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private items: any;
  private selectionManager: any;
  private selection: any[] = [];

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
      customPaletteColor: ['#eb4b5c', '#b7d62d'],
      customShowMark: 'false'
    };

    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
  }
  
  // toolTip
  private showTooltip = _.debounce((params, asModel = false) => {

    if (asModel) isTooltipModelShown = true;

    // const visibleDimIdxs: any[] = _.flatten(Object.values(params.encode));
    // let visibleDimensions: any[] =  visibleDimIdxs.map(idx => params.dimensionNames[idx]);
    // if (params.data[''] === '') visibleDimensions = visibleDimensions.filter(d => d !== '');
    // console.log(visibleDimensions, '======visibleDimensions')
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },
     
      fields: [{
        label: params.name ,
        value: params.data[params.data.length -1 ],
      }],
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    }, 10);
  });

  private hideTooltip = () => {
    this.host.toolTipService.hide();
    isTooltipModelShown = false;
  }

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);
 
  private dispatch = (type, payload) => this.chart.dispatchAction({ ...payload, type });
  public bindEvents = () => {
    // lister click 
    this.container.addEventListener('click', (e: any) => {
      if (!e.seriesClick) {
        // clear tooltip
        this.hideTooltip();
        // clear selection
        this.selection.forEach(i => this.dispatch('downplay', i));
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })

    this.container.addEventListener('mouseleave', (e: any) => {
      if (isTooltipModelShown) return;
      this.hideTooltip();
    })

    this.chart.on('mousemove', (params) => {
      if (params.componentType !== 'series') return;

      if (!isTooltipModelShown) this.showTooltip(params);
    })

    this.chart.on('click', (params) => {

      if (params.componentType !== 'series') return;

      this.showTooltip(params, true);
      
      params.event.event.seriesClick = true;
      
      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };

      if (params.data.selectionId) {

        const sid = this.createSelectionId(params.data.selectionId);
        this.selectionManager.select(sid, true);
      }
      this.dispatch('highlight', selectInfo);
      this.selection.push(selectInfo)
      
    })

  }
  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      const dimension = plainData.profile.dimension.values[0].display;
      const ActualValue = plainData.profile.ActualValue.values[0].display;
  
      this.items[0] = plainData.sort[dimension].order;
      this.items[0].push('累计')
      this.items[1] = plainData.data.map((item) => {
        
        return item[ActualValue]
      });
      
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
                    color: options.customPaletteColor[1].colorStops ?  options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1]
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
                    color: options.customPaletteColor[1].colorStops ?  options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1]
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

  public getLineData =  (data: Array<number>) => {
    let line = []
    for(let i = 0; i < data.length; i ++) {
      if(i === 0) {
        line[0] = data[0]
      } else {
        let sumData = data.slice(0, i + 1)
        line[i] = _.sum(sumData)
      }
    }
    line[data.length - 1] = 0
    return line
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
    const lineData = this.getLineData(dyData)
    // get properties
    
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
      legend: { 
        data: [{
          name: '上升', 
          fontSize: options.legendFontSize,
          textStyle:{color:options.customPaletteColor[0].colorStops ?  options.customPaletteColor[0].colorStops[0] : options.customPaletteColor[0]}
        },{
          name: '下降', 
          fontSize: options.legendFontSize,
          textStyle:{color: options.customPaletteColor[1].colorStops ?  options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1]}
        }], 
        show: options.customShowLegend,
        icon: 'none',
        left: options.legendVerticalPosition,
        top: options.legendHorizontalPosition
       },
      series: [{
          type: 'candlestick',
          name: '上升',
          barCategoryGap: '10',
          //开始值、结束值、最大值、最小值
          //[[1,2,3,4]
          data: zt,
          itemStyle:{
            color: options.customPaletteColor[0].colorStops ?  options.customPaletteColor[0].colorStops[0] : options.customPaletteColor[0],
            color0: options.customPaletteColor[1].colorStops ?  options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1],
            opacity: options.customOpacity / 100,
            borderWidth: 0,
          },
          markPoint: {
              symbol: 'rect',
              symbolSize: 0.000000000000001,
              label: {
                  show: options.customShowMark,
                  color: options.customPaletteColor[0].colorStops ?  options.customPaletteColor[0].colorStops[0] : options.customPaletteColor[0],
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
                  borderWidth:0
              }
          }
      },
      {
        name: '下降',
        type: 'line',
        step: 'end',
        symbol: 'none',
        data: options.customShowLine ? lineData: [],
        itemStyle:{
          normal:{
                    lineStyle:{
                        width: 1,
                        color: options.customLineColor,
                        type:'dotted'
                    }
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

    if(!options.properties.customShowLegend) {
      return ['legendFontSize', 'legendVerticalPosition', 'legendHorizontalPosition']
    }

    if(!options.properties.customShowLine) {
      return ['customLineColor']
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}