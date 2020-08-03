import '../style/visual.less';
import _ = require('lodash');
import * as Echarts from 'echarts';

import dataTool = require("echarts/extension/dataTool/index")

const echarts = {
  ...Echarts,
  dataTool
}

let isTooltipModelShown = false;
export default class Visual extends WynVisual {

  private static mockItems = [['一月', '二月', '三月'], [100,50,20]];

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private chart: any;
  private properties: any;
  private items: any = [];
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string
  private ActualValue: string
  private Series: string



  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;
    this.isMock = true;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.properties = {}
  }

  // toolTip
  private showTooltip = _.debounce((params, asModel = false) => {
    if (asModel) isTooltipModelShown = true;
    const fieldsName = [params.name + (params.seriesName), 'Min', 'Q1', 'Median', 'Q3', 'Max']
    const fields = params.data.map((item, index) => { return { label: fieldsName[index], value: index ? item : '' } })
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },
      fields,
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

    this.chart.on('click', (params) => {

      if (params.componentType !== 'series') return;

      this.showTooltip(params, true);

      params.event.event.seriesClick = true;

      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };
      if (this.items[2][params.dataIndex]) {
        const sid = this.items[2][params.dataIndex];
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

      this.isMock = false;
      this.dimension = plainData.profile.dimension.values[0].display;
      this.ActualValue = plainData.profile.ActualValue.values[0].display;

      this.items[0] = plainData.data.map((item) => item[this.dimension]);
      this.items[1] = plainData.data.map((item) => item[this.ActualValue]);

      // get data
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        return selectionId
      }
      this.items[2] = plainData.data.map((item) => getSelectionId(item));

    } else {
      this.isMock = true;
    }
    this.properties = options.properties;

    this.render()
  }

  public formatUnit = (value: any, dataUnit) => {
    if (value) {
      const units = [{
        value: 1,
        unit: ''
      },
      {
        value: 100,
        unit: '百'
      }, {
        value: 1000,
        unit: '千'
      }, {
        value: 10000,
        unit: '万'
      }, {
        value: 100000,
        unit: '十万'
      }, {
        value: 1000000,
        unit: '百万'
      }, {
        value: 10000000,
        unit: '千万'
      }, {
        value: 100000000,
        unit: '亿'
      }, {
        value: 1000000000,
        unit: '十亿'
      }, {
        value: 100000000000,
        unit: '万亿'
      }]
      const format = units.find((item) => item.value === Number(dataUnit))
      return value / format.value + format.unit
    } else {
      return value
    }
  }


  public render() {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;

    this.container.style.opacity = isMock ? '0.3' : '1';
    const textStyle = { ...options.textStyle };

 

    const data = this.isMock ? Visual.mockItems[1] : this.items[1];
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';
    const legendTextStyle = options.legendTextStyle;
    const gridStyle = {
      left: options.legendPosition === 'left' ? '10%' : '8%',
      top: options.legendPosition === 'top' ? '10%' : '5%',
      right: options.legendPosition === 'right' ? '10%' : '3%',
      bottom: options.showDataZoom ? (options.legendPosition === 'bottom' ? '30%' : '20%') : (options.legendPosition === 'bottom' ? '10%' : '5%')
    };
    const barWidth = 100;

    // column bar data 
    const drawColumnBar = () => {
      const topData = data.map((item) => {return {
        value: item,
        symbolPosition: 'end'
    }})
      return [
        {
          name: '年报上报率3',
          type: 'pictorialBar',
          symbolSize: [barWidth, 45],
          symbolOffset: [0, -20],
          z: 12,
          itemStyle: {
              normal: {
                  color: options.barColor
              }
          },
          data:topData
      }, {
          name: '年报上报率2',
          type: 'pictorialBar',
          symbolSize: [barWidth, 45],
          symbolOffset: [0, 20],
          z: 12,
          itemStyle: {
              normal: {
                  color:  options.barColor
              }
          },
          data: data
      }, {
          name: '年报上报率1',
          type: 'pictorialBar',
          symbolSize: [150, 75],
          symbolOffset: [0, 37],
          z: 11,
          itemStyle: {
              normal: {
                  color: 'transparent',
                  borderColor:  options.barColor,
                  borderWidth: 5
              }
          },
          data: data
      }, {
          name: '年报上报率',
          type: 'pictorialBar',
          symbolSize: [100, barWidth],
          symbolOffset: [0, 50],
          z: 10,
          itemStyle: {
              normal: {
                  color: 'transparent',
                  borderColor:  options.barColor,
                  borderType: 'dashed',
                  borderWidth: 5
              }
          },
          // data: data
      }, {
          type: 'bar',
          itemStyle: {
              normal: {
                  color:  options.barColor,
                  opacity: .7
              }
          },
          silent: true,
          show: true,
          position: 'top',
          barWidth: barWidth,
          // barGap: '-100%', // Make series be overlap
          data: data
      }
      ]
    }

  //  hill bar 
  const drawHillBar = () => {
    return [{
      name: 'hill',
      type: 'pictorialBar',
      barCategoryGap: '0%',
      symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
      label: {
    show: options.dataindicate,
    position: options.dataindicatePosition,
    distance: 15,
    color: options.barGradientColor[1],
    fontWeight: 'bolder',
    fontSize: 20,
  },
      itemStyle: {
          normal: {
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
            offset: 0,
            color: options.barGradientColor[0], //  0%  处的颜色

          },
          {
            offset: 1,
            color: options.barGradientColor[1], //  100%  处的颜色

          }
        ],
        global: false //  缺省为  false
      }
    },
    emphasis: {
      opacity: 1
    }
      },
      data: data,
      z: 10
  }]
  }

    const getSeries = () => {
      let  serise ;
      if(options.barType == 'column') serise = drawColumnBar()
      if(options.barType == 'hill') serise = drawHillBar()
      return serise
    } 

    const option = {
      tooltip: {},
      grid: gridStyle,
      legend: {
        data: this.isMock ? Visual.mockItems[0] : this.items[0],
        show: options.showLegend,
        left: options.legendPosition === 'left' || options.legendPosition === 'right' ? options.legendPosition : options.legendVerticalPosition,
        top: options.legendPosition === 'top' || options.legendPosition === 'bottom' ? options.legendPosition : options.legendHorizontalPosition,
        align: 'auto',
        icon: 'roundRect',
        textStyle: legendTextStyle,
        orient: orient,
      },
      xAxis: {
          data: this.isMock ? Visual.mockItems[0] : this.items[0],
          axisTick: {
              show: false
          },
          axisLine: {
              show: false
          },
          axisLabel: {
              show: false,
              textStyle: {
                  color: '#e54035'
              }
          }
      },
      yAxis: {
          splitLine: {
              show: false
          },
          axisTick: {
              show: false
          },
          axisLine: {
              show: false
          },
          axisLabel: {
              show: false
          }
      },
      dataZoom: [
        {
          type: 'inside',
          start: Number(options.dataStart),
          end: options.showDataZoom ? Number(options.dataEnd) : 100
        },
        {
          show: options.showDataZoom,
          height: 20,
          type: 'slider',
          top: options.legendPosition === 'bottom' ? '80%' : '90%',
          fillerColor: options.dataZoomBgColor,
          xAxisIndex: [0],
          start: Number(options.dataStart),
          end: options.showDataZoom ? Number(options.dataEnd) : 100
        }
      ],
      series: getSeries()
  };

    const formatter = (param) => {
      return [
        `${'分类'}` + param.name + ': ',
        'Max: ' + param.data[5],
        'Q3: ' + param.data[4],
        'Median: ' + param.data[3],
        'Q1: ' + param.data[2],
        'Min: ' + param.data[1]
      ].join('<br/>')
    }

    this.chart.setOption(option)
  }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<string> = ['showLegend'];
    // legend
    if (!updateOptions.properties.showLegend) {
      hiddenOptions = hiddenOptions.concat(['legendPosition', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle'])
    }
    if (updateOptions.properties.legendPosition === 'left' || updateOptions.properties.legendPosition === 'right') {
      hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
    } else {
      hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
    }
    // data zoom
    if (!updateOptions.properties.showDataZoom) {
      hiddenOptions = hiddenOptions.concat(['dataStart', 'dataEnd', 'dataZoomBgColor'])
    }
    //axis
    if (!updateOptions.properties.xAxis) {
      hiddenOptions = hiddenOptions.concat(['xAxisLabel', 'xAxisTick', 'xAxisLine'])
    }
    //dataindicate
    if (!updateOptions.properties.dataindicate) {
      hiddenOptions = hiddenOptions.concat(['xAxisLabel', 'dataindicateTextStyle'])
    }
    if (!updateOptions.properties.leftAxis) {
      hiddenOptions = hiddenOptions.concat(['dataindicatePosition', 'leftAxisTick', 'leftAxisLine', 'leftSplitLine', 'dataUnit'])
    }
    // bar type
    if (updateOptions.properties.barType === 'column') {
      hiddenOptions = hiddenOptions.concat(['barGradientColor'])
    }
    if (updateOptions.properties.barType === 'hill') {
      hiddenOptions = hiddenOptions.concat(['barColor'])
    }
    return hiddenOptions;
  }



  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}