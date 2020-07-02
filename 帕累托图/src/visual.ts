import '../style/visual.less';
import _ = require('lodash');
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
  private ActualValue: string;
  private dimension: string;
  static mockItems: any = [
    ["1月", "2月", "3月", "4月", "5月", "6月", "7月"], [56, 44, 38, 25, 20, 12, 7]
  ];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.properties = {};
    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
  }
  // toolTip
  private showTooltip = _.debounce((params, asModel = false) => {
    if (asModel) isTooltipModelShown = true;
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },

      fields: [{
        label: this.ActualValue,
        value: params.data,
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

    // this.chart.on('mousemove', (params) => {
    //   if (params.componentType !== 'series') return;

    //   if (!isTooltipModelShown) this.showTooltip(params);
    // })

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
        console.log(sid, '====sid')
        this.selectionManager.select(sid, true);
      }
      this.dispatch('highlight', selectInfo);
      this.selection.push(selectInfo)

    })

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    console.log(dataView, ' ===dataView')
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      this.dimension = plainData.profile.dimension.values[0].display;
      this.ActualValue = plainData.profile.ActualValue.values[0].display;

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
      this.items[1] = items.map((item) => item[this.ActualValue]);
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item)
        return selectionId
      }
      this.items[2] = items.map((item) => getSelectionId(item));
    }

    this.properties = options.properties;
    this.render();
  }

  public getLineData = (data: Array<number>) => {
    const initData = data
    const totalNumber = _.sum(initData)
    const lineData = []
    initData.map((data: number, index: number) => {
      if (index) {
        lineData[index] = (Number((data / totalNumber).toFixed(2)) * 100) + lineData[index - 1]
      } else {
        lineData[index] = (Number((initData[0] / totalNumber).toFixed(2)) * 100);
      }
    })
    return lineData
  }

  public render() {
    this.chart.clear();
    // get data
    const isMock = !this.items.length
    const options = this.properties;
    let columnarData = isMock ? Visual.mockItems[1] : this.items[1];
    const lineData = this.getLineData(columnarData);

    // lengend position
    const lengendBarName = isMock ? '质量' : this.ActualValue
    const h = options.legendHorizontalPosition;
    const v = options.legendVerticalPosition
    const orient = h === 'middle' && v === 'left' || h === 'middle' && v === 'right' ? 'vertical' : 'horizontal'
    // get properties
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (params, ticket) => {
          const value = params.componentSubType === 'bar' ? params.data : params.data + '%'
          return `${params.name}: ${value}`
        },
        axisPointer: {
          type: 'cross'
        }
      },
      legend: {
        data: [lengendBarName, { name: options.legendName, icon: 'circle' }],
        show: options.showLegend,
        left: options.legendVerticalPosition,
        top: options.legendHorizontalPosition,
        align: 'auto',
        icon: 'roundRect',
        textStyle: {
          color: options.legendTextStyle.color,
          fontStyle: options.legendTextStyle.fontStyle,
          fontWeight: options.legendTextStyle.fontWeight,
          fontFamily: options.legendTextStyle.fontFamily,
          fontSize: parseFloat(options.legendTextStyle.fontSize)
        },
        orient: orient,
      },
      xAxis: [
        {
          // show: options.xAxis,
          axisTick: {
            show: options.xAxisTick
          },
          axisLine: {
            show: options.xAxisLine
          },
          axisLabel: {
            show: options.xAxisLabel,
            textStyle: {
              color: options.xTextStyle.color,
              fontStyle: options.xTextStyle.fontStyle,
              fontWeight: options.xTextStyle.fontWeight,
              fontFamily: options.xTextStyle.fontFamily,
              fontSize: parseFloat(options.xTextStyle.fontSize)
            }
          },
          data: isMock ? Visual.mockItems[0] : this.items[0]
        },
        {
          splitLine: {
            show: false
          },
          boundaryGap: true,
          axisLabel: {
            show: false
          },
          data: isMock ? Visual.mockItems[0] : this.items[0]
        }
      ],
      yAxis: [
        {
          type: 'value',
          axisLabel: {
            show: options.leftAxisLabel,
            formatter: (value: any) => {
              console.log(value, '=====value')
              return value + '万'
            },
            color: options.leftTextStyle.color,
            fontStyle: options.leftTextStyle.fontStyle,
            fontWeight: options.leftTextStyle.fontWeight,
            fontFamily: options.leftTextStyle.fontFamily,
            fontSize: parseFloat(options.leftTextStyle.fontSize)
          },
          axisTick: {
            show: options.leftAxisTick
          },
          axisLine: {
            show: options.leftAxisLine
          },
          splitLine: true
        },
        {
          type: 'value',
          max: 100,
          axisLabel: {
            formatter: `{value}(%)`,
            show: options.rightAxisLabel,
            textStyle: {
              color: options.rightTextStyle.color,
              fontStyle: options.rightTextStyle.fontStyle,
              fontWeight: options.rightTextStyle.fontWeight,
              fontFamily: options.rightTextStyle.fontFamily,
              fontSize: parseFloat(options.rightTextStyle.fontSize)
            }
          },
          axisTick: {
            show: options.rightAxisTick
          },
          axisLine: {
            show: options.rightAxisLine
          },
          splitLine: options.rightSplitLine
        }
      ],
      series: [
        {
          name: lengendBarName,
          type: 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          barCategoryGap: `${options.barCategoryGap}%`,
          itemStyle: {
            color: options.chartColors[0].colorStops ? options.chartColors[0].colorStops[0] : options.chartColors[0]
          },
          label: {
            color: options.leftTextStyle.color,
            normal: {
              show: true,
              position: 'top',
              formatter: '{c}',
              textStyle: {
                // fontWeight: 'bold',
                fontSize: 14
              }
            }
          },
          data: columnarData
        },
        {
          name: options.legendName,
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          // silent: true,
          smooth: true,
          clipOverflow: false,
          symbolSize: 9,
          itemStyle: {
            normal: {
              color: options.chartColors[1].colorStops ? options.chartColors[1].colorStops[0] : options.chartColors[1],
              //borderColor:,
              borderWidth: 3,
            }
          },
          lineStyle: {
            normal: {
              //color:,
              width: 2,
            }
          },
          data: lineData
        }
      ]
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
    if (!options.properties.showLegend) {
      return ['legendName', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle']
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}