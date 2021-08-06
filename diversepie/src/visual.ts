import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { AriaComponent , TooltipComponent, LegendComponent, GridComponent   } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
  [ PieChart, AriaComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]
);

let isTooltipModelShown = false;
export default class Visual extends WynVisual {

  private static mockItems = [
    { name: "一月", value: 335 },
    { name: "二月", value: 110 },
    { name: "三月", value: 324 },
    { name: "四月", value: 135 },
    { name: "五月", value: 548 },
    { name: "六月", value: 133 },
  ];
  private static minInner = 1;

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

    } else {
      this.isMock = true;
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
    } else if (dataType === ',') {
      let integer = format.split('.')
      format = integer[0].replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
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

    let data: any = this.isMock ? Visual.mockItems : this.items[1];
    if (options.endAngle%360 !== options.startAngle%360) {
      let totalValue = 0
      data.forEach(element => {
        totalValue += element.value 
      })
      let finalAngle = 0;
      let drawingStartAngle = 360-options.startAngle%360
      let drawingEndAngle = 360-options.endAngle%360
      if(options.startAngle%360 < options.endAngle%360){
        finalAngle = drawingStartAngle - drawingEndAngle
      }else if(options.startAngle%360 > options.endAngle%360){
        finalAngle = (drawingEndAngle + options.startAngle%360)%360
      }
      let ratio = finalAngle/360
      data = [...data,{
        value:totalValue/ratio*(1-ratio), 
        name:'',
        label: {
          show:false,
        },
        itemStyle:{normal:{color:'rgba(0,0,0,0)'}}
      }]
    }
    
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';
    
    const hexToRgba = (hex, opacity) => {
      return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
              + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
    }
     
    const getColors = (index, position: number) => {
      let backgroundColor = ''
      const pieColor: [{
        colorStops: [] | any
      }] = options.pieColor && options.pieColor || [];
      if (index < pieColor.length) {
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
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 1,
                  colorStops: [{
                    offset: 0,
                    color: getColors(index, 1)
                  },
                  {
                    offset: 1,
                    color: getColors(index, 0)
                  }
                  ],
                  global: false
                },
                borderRadius: options.borderRadius,
                borderColor: options.breakPointColor,
                borderWidth: options.breakPointNumber
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
            radius: options.labelPosition === 'inside' ? [`${options.breakPointNumber && !options.inner ? Visual.minInner : options.inner}%`, `${options.outer}%`] : [`${options.breakPointNumber && !options.inner ? Visual.minInner : options.inner}%`, `${options.outerOutside}%`],
            center: [`${options.centerX}%`, `${options.centerY}%`],
            data: data, 
            startAngle: options.startAngle,
            minAngle: options.minAngle,
            roseType: options.pieRoseType === 'pie' ? '' : options.pieRoseType,
            label: {
              show: options.showLabel,
              position: options.labelPosition,
              formatter: (params) => {
                let name = options.showLabelName?(!options.showLabelTwoLine?`${params.name}${' '}`:params.name):''
                let value = options.showLabelValue ? this.formatData(params.value, options.labelDataUnit, options.labelDataType) : '';
                let percent = options.showLabelPercent ? `${value ? (options.showLabelTwoLine?'/':' ') : ''}${params.percent.toFixed(2)}%` : '';
                let lineFeed = options.showLabelTwoLine ? '\n':''
                return !options.showLabelValue && !options.showLabelPercent
                ? `{b|${name}}`
                :  `{b|${name}}${lineFeed}{b|${value}${percent}}`
              },
              rich:{
                b: {
                  lineHeight: 20,
                  ...options.labelTextStyle,
                  fontSize: parseInt(options.labelTextStyle.fontSize),
                  // color: options.setLabelTextColor === 'labelThemeTextColor' ? getColors(index, 1) : options.labelTextColor,

                },
                hr: {
                  backgroundColor: 'transparent',
                  borderRadius: 12,
                  width: 0,
                  height: 10,
                  padding: [3, -7, 0, -7],
                }
              }   
                         
              

            },
            labelLine: {
              show: options.showLabelLine,
              length:options.labelLineFirst,
              length2:options.labelLineSecond,
              smooth: `${options.labelLineSmooth * 0.01}`,
              lineStyle:{
                color:options.setLabelLineColor === options.labelThemeColor ? null : options.labelLineColor,
                width:options.labelLineWidth
              }
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
                      color: options.showGradient ? hexToRgba(getColors(params.dataIndex, 0), 0.2) : getColors(params.dataIndex, 0), 
                    },
                    {
                      offset: 1,
                      color: options.showGradient ? hexToRgba(getColors(params.dataIndex, 0), 1) : getColors(params.dataIndex, 1), 
                    }
                    ],
                    global: false
                  }
                },
                borderRadius: options.borderRadius,
                borderColor: options.breakPointColor,
                borderWidth: options.breakPointNumber
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
        align: 'left',
        icon: options.legendIcon === 'none' ? '' : options.legendIcon,
        textStyle: {
          ...legendTextStyle,
          fontSize: parseInt(options.legendTextStyle.fontSize),
        },
        orient: orient,
        width: options.legendArea === 'custom' ? `${options.legendWidth}%` : 'auto',
        height: options.legendArea === 'custom' ? `${options.legendHeight}%` : 'auto',
        formatter:(name) => {
          const _target = data.find((item: any) => item.name === name)
          const _total = data.map((item) => item.value).reduce((prev, next) => prev + next);
          return `${_target.name}  ${_target.value}  ${Number((_target.value / _total* 100 ).toFixed(0))　}%`;
        },
      },
      calculable: true,
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false
      },
      series: getSeries(),
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
      hiddenOptions = hiddenOptions.concat(['legendPosition', 'legendIcon', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle', 'legendArea', 'legendWidth', 'legendHeight'])
    }
    if (updateOptions.properties.legendPosition === 'left' || updateOptions.properties.legendPosition === 'right') {
      hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
    } else {
      hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
    }
    // label
    if (!updateOptions.properties.showLabel) {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'showLabelValue', 'showLabelPercent', 'labelPosition', 'labelDataType', 'labelDataUnit', 'labelTextStyle', 'showLabelTwoLine', 'showLabelName', 'labelTextColor', 'setLabelTextColor'])
    }

    if (updateOptions.properties.labelPosition === 'inside') {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'labelDataType', 'labelDataUnit', 'outerOutside'])
    }
    if (updateOptions.properties.labelPosition === 'outside') {
      hiddenOptions = hiddenOptions.concat(['outer'])
    }
    if (updateOptions.properties.setLabelLineColor === 'labelThemeColor') {
      hiddenOptions = hiddenOptions.concat(['labelLineColor'])
    }
    if (updateOptions.properties.setLabelTextColor === 'labelThemeTextColor') {
      hiddenOptions = hiddenOptions.concat(['labelTextColor'])
    }
    if (!updateOptions.properties.showLabelValue) {
      hiddenOptions = hiddenOptions.concat(['labelDataType', 'labelDataUnit'])
    }
    if (!(updateOptions.properties.showLabelName && updateOptions.properties.showLabelPercent && updateOptions.properties.showLabelValue)) {
      hiddenOptions = hiddenOptions.concat(['showLabelTwoLine'])
      updateOptions.properties.showLabelTwoLine = false
    }



    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}