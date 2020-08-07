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
  private dimension: string;
  private ActualValue: Array<any>;
  private Series: string;
  private MaxFillNumber: number;
  private YLabelOffset: number;
  private lengendLabelOffset: number;
  private lengendLabeIndex: number;

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
    const fields = [{ label: params.name, value: '' }, { label: params.seriesName, value: params.data }]
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

    this.container.addEventListener('mouseenter', (e: any) => {
      if (isTooltipModelShown) return;
      this.hideTooltip();
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
      this.Series = plainData.profile.series.values.length ? plainData.profile.series.values[0].display : '';
      const seriesData = []
      if (this.Series) {
        const seriesFlage = plainData.sort[this.Series].order;
        const datas = []
        seriesFlage.map((serise, index) => {
          datas[index] = items.filter((item) => item[this.Series] === serise && item[this.ActualValue[0]])
        })
        datas.map((item, index) => {
          seriesData[index] = item.map(data => data[this.ActualValue[0]])
        })
      }

      this.items[0] = items.map((item) => item[this.dimension]);

      const data = [];
      this.ActualValue.map((item, index) => {
        data[index] = items.map((item) => item[this.ActualValue[index]])
      })

      if (this.Series) {
        this.items[1] = seriesData
      } else {
        this.items[1] = data;
      }
      // get data
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        return selectionId
      }
      this.items[2] = items.map((item) => getSelectionId(item));
      this.items[2] = _.uniqWith(this.items[2], _.isEqual)
      // get max 
      const maxData = this.items[1].map(data => _.max(data));
      this.MaxFillNumber = _.max(maxData);
      //  get max legend
      const lengendLabe = this.ActualValue.map((item) => item.length)
      this.lengendLabeIndex = lengendLabe.indexOf(_.max(lengendLabe));

    } else {
      this.isMock = true;
      this.MaxFillNumber = 200;
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

  public formatData = (number, dataUnit, dataType) => {
    let format = number
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
    const formatUnit = units.find((item) => item.value === Number(dataUnit))
    format = (format / formatUnit.value).toFixed(2)

    if (dataType === 'number') {
      format = format.toLocaleString()
    } else if (dataType === '%') {
      format = format + dataType
    } else {
      format = dataType + format
    }
    return format + formatUnit.unit
  }

  public render() {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;

    this.container.style.opacity = isMock ? '0.3' : '1';
    const legendTextStyle = { ...options.legendTextStyle };

    const datas: any = this.isMock ? Visual.mockItems[1] : this.items[1];
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';

    const getYLbaelOffset = (str, y: string) => {
      const yLabelOffset = document.createElement('span');
      yLabelOffset.innerText = str;
      yLabelOffset.className = `ylabeloffset${y}`;
      this.container.appendChild(yLabelOffset);
      const offsetWidth = document.querySelector(`.ylabeloffset${y}`);
      let width = 0;
      if (offsetWidth instanceof HTMLElement) width = offsetWidth.offsetWidth + 10;
      yLabelOffset.remove()
      return width
    }
    this.YLabelOffset = getYLbaelOffset(isMock ? '200' : this.MaxFillNumber, 'y');
    this.lengendLabelOffset = getYLbaelOffset(isMock ? '月份' : this.ActualValue[this.lengendLabeIndex], 'leg');
    const getOffset = (left: boolean, position) => {
      let legend = 0;
      let label = 0;
      if (left) legend = options.leftAxis ? this.YLabelOffset : 0;
      label = options.showLegend && options.legendPosition === position ? this.lengendLabelOffset : 0;
      return `${legend + label}px`;
    }

    const gridStyle = {
      left: getOffset(true, 'left'),
      top: options.legendPosition === 'top' ? '10%' : '5%',
      right: getOffset(false, 'right'),
      bottom: options.showDataZoom ? (options.legendPosition === 'bottom' ? '30%' : '20%') : (options.legendPosition === 'bottom' ? '20%' : '15%')
    };

    const bar = [{
      barWidth: 15,
      barHeight: 5,
      yOffset: 3,
      interval: 10,
      ratio: 20,
      margin: 8
    }, {
      barWidth: 30,
      barHeight: 7.5,
      yOffset: 5,
      interval: 20,
      ratio: 38,
      margin: 15
    }, {
      barWidth: 60,
      barHeight: 16,
      yOffset: 10,
      interval: 40,
      ratio: 78,
      margin: 20
    }];

    const getColors = (index) => {
      let backgroundColor = ''
      const barGradientColor = options.barGradientColor;
      if (index < barGradientColor.length - 1) {
        backgroundColor = barGradientColor[index].colorStops ? barGradientColor[index].colorStops[0] : barGradientColor[index]
      } else {
        backgroundColor = barGradientColor[Math.floor((Math.random() * barGradientColor.length))].colorStops
          ? barGradientColor[Math.floor((Math.random() * barGradientColor.length))].colorStops[0]
          : barGradientColor[Math.floor((Math.random() * barGradientColor.length))]
      }
      return backgroundColor
    }

    const getFillData = (length) => {
      let data = []
      for (let i = 0; i < length; i++) {
        data.push(this.MaxFillNumber)
      }
      return data
    }
    // column bar data 
    const drawColumnBar = () => {
      const getSymbolOffset = (index: number) => {
        let median = 0;
        let xOffset
        if (datas.length % 2 === 0) {
          median = datas.length / 2;
          xOffset = index > median - 1 ? bar[Number(options.columnWidth)].interval + (index - median) * bar[Number(options.columnWidth)].ratio : - bar[Number(options.columnWidth)].interval + ((median - (index + 1)) * -bar[Number(options.columnWidth)].ratio)
        } else {
          median = (datas.length - 1) / 2;
          if (index === median) return xOffset = 0;
          xOffset = index > median ? (index - median) * bar[Number(options.columnWidth)].ratio : -(median - index) * bar[Number(options.columnWidth)].ratio
        }
        return xOffset
      }

      const serise = [];
      datas.map((data, index) => {
        const serisedata = [{
          name: "",
          type: 'pictorialBar',
          silent: true,
          symbolSize: [bar[Number(options.columnWidth)].barWidth, bar[Number(options.columnWidth)].barHeight],
          symbolOffset: [getSymbolOffset(index), -bar[Number(options.columnWidth)].yOffset],
          symbolPosition: 'end',
          z: 12,
          label: {
            show: options.dataindicate,
            position: options.dataindicatePosition,
            formatter: (item) => {
              return this.formatData(item.value, options.dataindicateUnit, options.dataindicateType)
            },
            ...options.dataindicateTextStyle,
            fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
          },
          itemStyle: {
            normal: {
              color: getColors(index),
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: data
        }, {
          name: "",
          type: 'pictorialBar',
          silent: true,
          symbolSize: [bar[Number(options.columnWidth)].barWidth, bar[Number(options.columnWidth)].barHeight],
          symbolOffset: [getSymbolOffset(index), -bar[Number(options.columnWidth)].yOffset],
          symbolPosition: 'end',
          z: 12,
          itemStyle: {
            normal: {
              color: getColors(index),
              opacity: .6
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: options.fillColumn ? getFillData(data.length) : []
        },
        {
          name: "",
          type: 'pictorialBar',
          silent: true,
          symbol: 'rect',
          symbolSize: [bar[Number(options.columnWidth)].barWidth, '100%'],
          symbolOffset: [getSymbolOffset(index), -bar[Number(options.columnWidth)].yOffset / 3],
          symbolPosition: 'start',
          z: 12,
          itemStyle: {
            normal: {
              color: getColors(index),
              opacity: .6
            }
          },
          data: options.fillColumn ? getFillData(data.length) : []
        },
        {
          name: '',
          silent: true,
          type: 'pictorialBar',
          symbolSize: [bar[Number(options.columnWidth)].barWidth, bar[Number(options.columnWidth)].barHeight],
          symbolOffset: [getSymbolOffset(index), bar[Number(options.columnWidth)].yOffset],
          // "barWidth": "20",
          z: 12,
          itemStyle: {
            normal: {
              color: getColors(index),
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: data
        },
        {
          name: '',
          type: 'pictorialBar',
          symbolSize: [bar[Number(options.columnWidth)].barWidth + 30, bar[Number(options.columnWidth)].barHeight * 2],
          symbolOffset: [getSymbolOffset(index), bar[Number(options.columnWidth)].yOffset * 2],
          z: 10,
          silent: true,

          itemStyle: {
            normal: {
              color: 'transparent',
              borderColor: getColors(index),
              borderType: 'dashed',
              borderWidth: 5
            }
          },
          // barGap: `${options.barGap}%`,
          // barCategoryGap: `${options.barCategoryGap}%`,
          data: options.showColumnBottom ? data : []
        },
        {
          name: this.isMock ? '销量' : this.ActualValue[index],
          type: 'bar',
          itemStyle: {
            normal: {
              color: getColors(index),
              opacity: .7
            }
          },
          barWidth: bar[Number(options.columnWidth)].barWidth,
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
                  color: getColors(index), //  0%  处的颜色

                },
                {
                  offset: 1,
                  color: getColors(index + 1), //  100%  处的颜色

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
      tooltip: {
        trigger: 'item',
        // axisPointer: {
        //   type: 'shadow'
        // },
        formatter: (item) => {
          return `${item.name || '月份'}<br />${item.seriesName || '数量'}:${item.data}`
        }
      },
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
        data: this.isMock ? Visual.mockItems[0] : Array.from(new Set(this.items[0])),
        show: options.xAxis,
        axisTick: {
          show: options.xAxisTick
        },
        axisLine: {
          show: options.xAxisLine,
          lineStyle: {
            color: options.xAxisLineColor
          }
        },
        axisLabel: {
          show: options.xAxisLabel,
          margin: options.barType === 'column' && options.showColumnBottom ? bar[Number(options.columnWidth)].margin : 8,
          ...options.xAxisTextStyle,
          fontSize: parseFloat(options.xAxisTextStyle.fontSize),
        }
      },
      yAxis: {
        show: options.leftAxis,
        splitLine: {
          show: options.leftSplitLine
        },
        axisTick: {
          show: options.leftAxisTick
        },
        axisLine: {
          show: options.leftAxisLine,
          lineStyle: {
            color: options.leftColor
          }
        },
        axisLabel: {
          show: options.leftAxisLabel,
          formatter: (value) => {
            return this.formatUnit(value, options.dataUnit)
          },
          ...options.leftTextStyle,
          fontSize: parseFloat(options.leftTextStyle.fontSize),
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
      hiddenOptions = hiddenOptions.concat(['dataindicatePosition', 'dataindicateTextStyle', 'dataindicateType', 'dataindicateUnit'])
    }
    if (!updateOptions.properties.leftAxis) {
      hiddenOptions = hiddenOptions.concat(['leftAxisLabel', 'leftAxisTick', 'leftAxisLine', 'leftSplitLine', 'dataUnit'])
    }
    // bar type
    if (updateOptions.properties.barType === 'column') {
      hiddenOptions = hiddenOptions.concat(['barColor', 'barCategoryGap', 'barGap'])
    }
    if (updateOptions.properties.barType === 'hill') {
      hiddenOptions = hiddenOptions.concat(['barColor', 'showColumnBottom', 'columnWidth', 'fillColumn'])
    }
    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}