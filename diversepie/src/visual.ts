import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts';


let isTooltipModelShown = false;
export default class Visual extends WynVisual {

  private static mockItems = [
    { name: "一月", value: 335 },
    { name: "二月", value: 110 },
    { name: "三月", value: 324 },
    { name: "四月", value: 135 },
    { name: "五月", value: 548 },
    { name: "六月", value: 133 }
  ];

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private chart: any;
  private properties: any;
  private items: any = [];
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string;
  private value: string;
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
    const fields = [{ label: this.dimension, value: '' }, { label: params.name, value: params.value }]
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
      dataView.plain.profile.value.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;

      this.isMock = false;
      this.dimension = plainData.profile.dimension.values[0].display;
      this.value = plainData.profile.value.values[0].display;

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
      this.items[1] = items.map((item) => { return { name: item[this.dimension], value: item[this.value] } });
      // get data
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        return selectionId
      }
      this.items[2] = items.map((item) => getSelectionId(item));
      // this.items[2] = _.uniqWith(this.items[2], _.isEqual)
      // get max 
      this.MaxFillNumber = _.maxBy(this.items[1], (item) => item[this.value]);

    } else {
      this.isMock = true;
      this.MaxFillNumber = 100;
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

    const data: any = this.isMock ? Visual.mockItems : this.items[1];
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';

    // const getYLbaelOffset = (str, y: string) => {
    //   const yLabelOffset = document.createElement('span');
    //   yLabelOffset.innerText = str;
    //   yLabelOffset.className = `ylabeloffset${y}`;
    //   this.container.appendChild(yLabelOffset);
    //   const offsetWidth = document.querySelector(`.ylabeloffset${y}`);
    //   let width = 0;
    //   if (offsetWidth instanceof HTMLElement) width = offsetWidth.offsetWidth + 10;
    //   yLabelOffset.remove()
    //   return width
    // }
    // this.YLabelOffset = getYLbaelOffset(isMock ? this.formatData(200, options.dataUnit, options.dataType) : this.formatData(this.MaxFillNumber, options.dataUnit, options.dataType), 'y');
    // this.lengendLabelOffset = getYLbaelOffset(isMock ? '访问量' : `${this.dimension}`, 'leg');
    // const getOffset = (left: boolean, position) => {
    //   let legend = 0;
    //   let label = 0;
    //   if (left) legend = options.leftAxis ? this.YLabelOffset : 0;
    //   label = options.showLegend && options.legendPosition === position ? this.lengendLabelOffset : 0;
    //   return `${legend + label}px`;
    // }

    // const gridStyle = {
    //   left: getOffset(true, 'left'),
    //   top: options.legendPosition === 'top' ? '10%' : '10%',
    //   right: getOffset(false, 'right'),
    //   bottom: options.showDataZoom ? (options.legendPosition === 'bottom' ? '30%' : '20%') : (options.legendPosition === 'bottom' ? '20%' : '15%')
    // };

    const getColors = (index, position: number) => {
      let backgroundColor = ''
      const pieColor = options.pieColor;
      if (index < pieColor.length - 1) {
        // is grandient 

        backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
      } else {
        backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
          ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
          : pieColor[Math.floor((Math.random() * pieColor.length))]
      }
      return backgroundColor
    }
    const getSeries = () => {
      const seriesData = this.isMock ? ['一月', '二月', '三月', '四月', '五月', '六月'] : this.items[0];
      return seriesData.map((item, index) => {
        if (index) {
          return {
            name: seriesData[index],
            type: 'pie',
            data: [],
            itemStyle: {
              normal: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: getColors(index, 1), //  0%  处的颜色
                  },
                  {
                    offset: 1,
                    color: getColors(index, 0), //  100%  处的颜色
                  }
                  ],
                  global: false //  缺省为  false
                }
              },
              emphasis: {
                opacity: 1
              }
            },
          }
        } else {
          return {
            name: '',
            type: 'pie',
            radius: options.labelPosition === 'inside' ? '100%' : '55%',
            center: ['50%', '50%'],
            data: data,
            startAngle: options.startAngle,
            minAngle: options.minAngle,
            roseType: options.pieRoseType === 'rose' ? options.pieType : '',
            label: {
              show: options.showLabel,
              ...options.labelTextStyle,
              fontSize: parseFloat(options.labelTextStyle.fontSize),
              position: options.labelPosition,
              formatter: (params) => {
                if (options.labelPosition === 'inside' || (!options.showLabelValue && !options.showLabelPercent)) {
                  return `{b|${params.name}}`
                } else {
                  const value = options.showLabelValue ? this.formatData(params.value, options.labelDataUnit, options.labelDataType) : '';
                  const percent = options.showLabelPercent ? `(${params.percent}%)` : '';
                  return `{b|${params.name}} \n {hr|}\n {c|${value}${percent}}`
                }
              },
              rich: {
                hr: {
                  borderColor: '#fff',
                  width: '100%',
                  borderWidth: 1,
                  height: 0
                },
                b: {
                  lineHeight: 20,
                  align: 'center',
                  padding: [2, 2],
                  ...options.labelTextStyle,
                  fontSize: parseFloat(options.labelTextStyle.fontSize),
                },
                c: {
                  lineHeight: 20,
                  align: 'center',
                  ...options.labelTextStyle,
                  fontSize: parseFloat(options.labelTextStyle.fontSize),
                }
              },
            },
            labelLine: {
              show: options.showLabelLine
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 1,
                    colorStops: [{
                      offset: 0,
                      color: getColors(params.dataIndex, 1), //  0%  处的颜色
                    },
                    {
                      offset: 1,
                      color: getColors(params.dataIndex, 0), //  100%  处的颜色
                    }
                    ],
                    global: false //  缺省为  false
                  }
                }
              },
              emphasis: {
                opacity: 1
              }
            },
            animationType: options.pieStartType,
            animationEasing: options.pieStartType === 'scale' ? 'elasticOut' : 'linear',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        }
      })
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: `${this.isMock ? '访问量' : this.dimension} <br/>{b} : {c} ({d}%)`
      },
      // grid: gridStyle,
      legend: {
        data: this.isMock ? ['一月', '二月', '三月', '四月', '五月', '六月'] : this.items[0],
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
      calculable: true,
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false
      },
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
    //  rose type 
    if (updateOptions.properties.pieRoseType === 'pie') {
      hiddenOptions = hiddenOptions.concat(['pieType'])
    }
    // label
    if (!updateOptions.properties.showLabel) {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'labelPosition', 'labelDataType', 'labelDataUnit', 'labelTextStyle'])
    }

    if (updateOptions.properties.labelPosition === 'inside') {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'labelDataType', 'labelDataUnit'])
    }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}