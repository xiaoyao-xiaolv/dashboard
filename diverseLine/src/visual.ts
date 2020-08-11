import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts';

let isTooltipModelShown = false;
export default class Visual extends WynVisual {

  private static mockItems = [['一月', '二月', '三月', '四月', '五月', '六月'], [[60, 80, 20, 66, 22, 75]]];

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
  private MaxFillNumber: number | string;
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
      // get serise label
      if (this.Series) {
        this.items[3] = items.map((item) => item[this.Series]);
        this.items[3] = _.uniqWith(this.items[3], _.isEqual)
      }
    } else {
      this.isMock = true;
      this.MaxFillNumber = 200;
    }
    this.properties = options.properties;
    this.render()
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
    } else if (dataType === 'none') {
      format = Number(format).toFixed(0)
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
    this.YLabelOffset = getYLbaelOffset(isMock ? this.formatData(200, options.dataUnit, options.dataType) : this.formatData(this.MaxFillNumber, options.dataUnit, options.dataType), 'y');
    this.lengendLabelOffset = getYLbaelOffset(isMock ? '访问量' : `${this.ActualValue[this.lengendLabeIndex]}${options.dataType !== '' ? '%' : ''}`, 'leg');
    const getOffset = (left: boolean, position) => {
      let legend = 0;
      let label = 0;
      if (left) legend = options.leftAxis ? this.YLabelOffset : 0;
      label = options.showLegend && options.legendPosition === position ? this.lengendLabelOffset : 0;
      return `${legend + label}px`;
    }

    const gridStyle = {
      left: getOffset(true, 'left'),
      top: options.legendPosition === 'top' ? '15%' : '15%',
      right: getOffset(false, 'right'),
      bottom: options.showDataZoom ? (options.legendPosition === 'bottom' ? '30%' : '20%') : (options.legendPosition === 'bottom' ? '20%' : '15%')
    };

    const getColors = (index) => {
      let backgroundColor = ''
      const lineColor = options.lineColor;
      if (index < lineColor.length - 1) {
        backgroundColor = lineColor[index].colorStops ? lineColor[index].colorStops[0] : lineColor[index]
      } else {
        backgroundColor = lineColor[Math.floor((Math.random() * lineColor.length))].colorStops
          ? lineColor[Math.floor((Math.random() * lineColor.length))].colorStops[0]
          : lineColor[Math.floor((Math.random() * lineColor.length))]
      }
      return backgroundColor
    }


    const getSeries = () => {
      return datas.map((data, index) => {
        return {
          name: this.isMock ? ['访问量'] : (this.Series ? this.items[3][index] : this.ActualValue[index]),
          type: "line",
          symbolSize: 10,
          itemStyle: {
            color: getColors(index),
          },
          lineStyle: {
            color: getColors(index),
            width: options.borderWidth,
            type: options.borderType
          },
          label: {
            show: options.showCate && options.dataindicate,
            position: options.dataindicatePosition,
            ...options.dataindicateTextStyle,
            formatter: (item) => {
              return this.formatData(item.value, options.dataindicateUnit, options.dataindicateType)
            },
            fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
          },
          markPoint: {
            symbol: options.markPoint,
            symbolSize: options.markPointSize,
            label: {
              normal: {
                show: options.showCate && options.showMackPointLabel,
                textStyle: {
                  ...options.dataindicateTextStyle,
                  fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
                },
                formatter: (item) => {
                  if (options.showCate && options.showMackPointLabel) {
                    return this.formatData(item.value, options.dataindicateUnit, options.dataindicateType)
                  } else {
                    return item.value
                  }
                }
              }
            },
            data: [{
              type: 'max',
              name: '最大值',

            }, {
              type: 'min',
              name: '最小值'
            }]
          },
          data: data
        }
      })
    };

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        },
        formatter: (items) => {
          let stringData = ''
          items = _.sortBy(items, (item) => -item.value)
          items.map((item) => stringData += `${item.seriesName}:${item.value}<br />`)
          return stringData
        }
      },
      grid: gridStyle,
      legend: {
        data: this.isMock ? ['访问量', '订单量'] : (this.Series ? this.items[3] : this.ActualValue),
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
      // calculable: true,
      xAxis: {
        data: this.isMock ? Visual.mockItems[0] : Array.from(new Set(this.items[0])),
        // data: xData,
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
            return this.formatData(value, options.dataUnit, options.dataType)
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
    if (!updateOptions.properties.showCate) {
      hiddenOptions = hiddenOptions.concat(['dataindicate', 'showMackPointLabel', 'dataindicatePosition', 'dataindicateTextStyle', 'dataindicateType', 'dataindicateUnit'])
    }
    if (!updateOptions.properties.leftAxis) {
      hiddenOptions = hiddenOptions.concat(['leftAxisLabel', 'leftAxisTick', 'leftAxisLine', 'leftSplitLine', 'dataUnit'])
    }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}