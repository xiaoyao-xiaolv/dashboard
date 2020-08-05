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

  private static mockItems = [['一月', '二月', '三月'], [[100, 50, 20]]];

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private chart: any;
  private properties: any;
  private items: any = [];
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string
  private ActualValue: Array<any>
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
      this.ActualValue = plainData.profile.ActualValue.values.map((item) => item.display);

      let items = plainData.data;
      const isSort = plainData.sort[this.dimension].priority === 0 ? true : false;

      // data sort 
      if (isSort) {
        const sortFlage = plainData.sort[this.dimension].order;
        let newItems: any = sortFlage.map((flage) => {
          return newItems = items.find((item) => item[this.dimension] === flage && item)
        })
        items = newItems.filter((item) => item)
      }

      this.items[0] = items.map((item) => item[this.dimension]);
      const data = [];
      this.ActualValue.map((item, index) => {
        data[index] = items.map((item) => item[this.ActualValue[index]])
      })
      this.items[1] = data;
      // this.items[1] = items.map((item) => item[this.ActualValue]);

      // get data
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        return selectionId
      }
      this.items[2] = items.map((item) => getSelectionId(item));

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
    const legendTextStyle = { ...options.legendTextStyle };

    const datas: any = this.isMock ? Visual.mockItems[1] : this.items[1];
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';

    const gridStyle = {
      left: options.legendPosition === 'left' ? '10%' : '8%',
      top: options.legendPosition === 'top' ? '10%' : '5%',
      right: options.legendPosition === 'right' ? '10%' : '3%',
      bottom: options.showDataZoom ? (options.legendPosition === 'bottom' ? '30%' : '20%') : (options.legendPosition === 'bottom' ? '15%' : '10%')
    };
    const barWidth = 60;

    // column bar data 
    const drawColumnBar = () => {
      const topData = datas.map((item) => {
        return {
          value: item,
          symbolPosition: 'end'
        }
      })
      const getSymbolOffset = (index: number) => {
        let median = 0;
        let xOffset
        if (datas.length % 2 === 0) {
          median = datas.length / 2;
          console.log(median, '==median', datas.length)
          xOffset = index > median - 1 ? 40 + (index - median) * 78 : - 40 + ((median - (index + 1)) * -78)
          console.log(xOffset, '===', index)
        } else {
          median = (datas.length - 1) / 2;
          if (index === median) return xOffset = 0;
          console.log(median, 'index', index)
          xOffset = index > median ? (index - median) * 78 : -(median - index) * 78
        }
        return xOffset
      }
      const serise = [];
      datas.map((data, index) => {
        const serisedata = [{
          name: "",
          type: 'pictorialBar',
          silent: true,
          symbolSize: [60, 16],
          symbolOffset: [getSymbolOffset(index), -10],
          symbolPosition: 'end',
          z: 12,
          //"barWidth": "20",
          label: {
            show: options.dataindicate,
            position: options.dataindicatePosition,
            ...options.dataindicateTextStyle,
            fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
          },
          itemStyle: {
            normal: {
              color: options.barGradientColor[index].colorStops ? options.barGradientColor[index].colorStops[0] : options.barGradientColor[index],
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: data
        },
        {
          name: '',
          silent: true,
          type: 'pictorialBar',
          symbolSize: [60, 16],
          symbolOffset: [getSymbolOffset(index), 10],
          // "barWidth": "20",
          z: 12,
          itemStyle: {
            normal: {
              color: options.barGradientColor[index].colorStops ? options.barGradientColor[index].colorStops[0] : options.barGradientColor[index],
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: data
        },
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [90, 30],
          symbolOffset: [getSymbolOffset(index), 20],
          z: 10,
          silent: true,
          itemStyle: {
            normal: {
              color: 'transparent',
              borderColor: options.barGradientColor[index].colorStops ? options.barGradientColor[index].colorStops[0] : options.barGradientColor[index],
              borderType: 'dashed',
              borderWidth: 5
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: data
        },
        {
          name: this.isMock ? '销量' : this.ActualValue[index],
          type: 'bar',
          itemStyle: {
            normal: {
              color: options.barGradientColor[index].colorStops ? options.barGradientColor[index].colorStops[0] : options.barGradientColor[index],
              opacity: .7
            }
          },
          barWidth,
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: data,
        }]
        serise.push(...serisedata)
      })
      return serise
    }

    //  hill bar 
    const drawHillBar = () => {

      const serise = [];
      datas.map((data, index) => {
        const serisedata = [{
          name: this.isMock ? '销量' : this.ActualValue[index],
          type: 'pictorialBar',
          symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
          label: {
            show: options.dataindicate,
            position: options.dataindicatePosition,
            distance: 15,
            ...options.dataindicateTextStyle,
            // color: options.barGradientColor[1].colorStops ? options.barGradientColor[1].colorStops[0] : options.barGradientColor[1],
            fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
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
                  color: options.barGradientColor[index].colorStops ? options.barGradientColor[index].colorStops[0] : options.barGradientColor[index], //  0%  处的颜色

                },
                {
                  offset: 1,
                  color: options.barGradientColor[index + 1].colorStops ? options.barGradientColor[index + 1].colorStops[0] : options.barGradientColor[index + 1], //  100%  处的颜色

                }
                ],
                global: false //  缺省为  false
              }
            },
            emphasis: {
              opacity: 1
            }
          },
          barGap: options.barGap && `${options.barGap}%` || 0,
          barCategoryGap: options.barCategoryGap && `${options.barCategoryGap}%` || 0,
          data: data,
          z: 10
        }]
        serise.push(...serisedata)
      })
      return serise
    }

    const getSeries = () => {
      let serise;
      if (options.barType == 'column') serise = drawColumnBar()
      if (options.barType == 'hill') serise = drawHillBar()
      return serise
    }

    const option = {
      tooltip: {},
      grid: gridStyle,
      legend: {
        data: this.isMock ? ['销量'] : this.ActualValue,
        show: options.showLegend,
        left: options.legendPosition === 'left' || options.legendPosition === 'right' ? options.legendPosition : options.legendVerticalPosition,
        top: options.legendPosition === 'top' || options.legendPosition === 'bottom' ? options.legendPosition : options.legendHorizontalPosition,
        align: 'auto',
        icon: 'roundRect',
        textStyle: {
          ...legendTextStyle,
          fontSize: parseFloat(options.legendTextStyle.fontSize),
        },
        orient: orient,
      },
      xAxis: {
        data: this.isMock ? Visual.mockItems[0] : this.items[0],
        show: options.xAxis,
        axisTick: {
          show: options.xAxisTick
        },
        axisLine: {
          show: options.xAxisLine
        },
        axisLabel: {
          show: options.xAxisLabel,
          ...textStyle,
          fontSize: parseFloat(options.textStyle.fontSize),
        }
      },
      yAxis: {
        show: options.leftAxis,
        min: -100,
        splitLine: {
          show: options.leftSplitLine
        },
        axisTick: {
          show: options.leftAxisTick
        },
        axisLine: {
          show: options.leftAxisLine
        },
        axisLabel: {
          show: options.leftAxisLabel,
          formatter: (value) => {
            return this.formatUnit(value, options.dataUnit)
          },
          ...textStyle,
          fontSize: parseFloat(options.textStyle.fontSize),
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
    let hiddenOptions: Array<string> = [''];
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
      hiddenOptions = hiddenOptions.concat(['dataindicatePosition', 'dataindicateTextStyle'])
    }
    if (!updateOptions.properties.leftAxis) {
      hiddenOptions = hiddenOptions.concat(['leftAxisLabel', 'leftAxisTick', 'leftAxisLine', 'leftSplitLine', 'dataUnit'])
    }
    // bar type
    if (updateOptions.properties.barType === 'column') {
      hiddenOptions = hiddenOptions.concat(['barColor', 'barCategoryGap', 'barGap'])
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