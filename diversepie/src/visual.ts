import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { GraphicComponent ,AriaComponent , TooltipComponent, LegendComponent, GridComponent   } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
  [ PieChart, GraphicComponent, AriaComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]
);

let isTooltipModelShown = false;
const clickLeftMouse = 0;
const clickRightMouse = 2;
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
  private format: any;
  private items: any = [];
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string;
  private value: string;
  private _total : any;
  private timeInterval : any;
  private preview : boolean;
  private payWay: any;
  private allItems: any;
  
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;
    this.isMock = true;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.properties = {};
    this.format = {};
    this.preview = false
  }

  // toolTip
  private showTooltip = _.debounce((params, asModel = false) => {
    if (asModel) isTooltipModelShown = true;
    this.host.contextMenuService.show({
      position: {
      x: params.event.event.x,
      y: params.event.event.y,
      },
      menu: true
    }, 10)
  });

  private hideTooltip = () => {
    this.host.contextMenuService.hide();
    isTooltipModelShown = false;
  }

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private dispatch = (type, payload) => this.chart.dispatchAction({ ...payload, type });

  public timer = () => {
    let index = -1
    let dataLength = this.properties.pieColor.length 
    this.timeInterval =  setInterval(() => {
      const autoStopInfo = {
        seriesIndex: 0,
        dataIndex: index,
      };
      this.dispatch('downplay', autoStopInfo)
      index = (index + 1) % dataLength
      const autoInfo = {
        seriesIndex: 0,
        dataIndex: index ,
      };
      this.dispatch('highlight',autoInfo)
      if (index > dataLength) {
        index = 0
      }
    }, Number(this.properties.rotationInterval)*1000)
  }
    

  public bindEvents = () => {
    this.container.addEventListener('mousedown', (e: any) => {
      document.oncontextmenu = function () { return false; }; 
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
      this.clearOperation()
      if (isTooltipModelShown) return;
      this.hideTooltip();
    })

    this.container.addEventListener('mouseleave', (e: any) => {
      if (this.properties.automaticRotation && this.preview) this.timer()
      if (isTooltipModelShown) return;
      this.hideTooltip();
    })


    this.chart.on('mouseover',(params)=> {
      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };
      this.dispatch('highlight',selectInfo)
    })

    this.chart.on('mouseout', (params) => {
      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };
      this.dispatch('downplay',selectInfo)
    })

    this.chart.on('mousedown', (params) => {
      const clickMouse = params.event.event.button;
      if (params.componentType !== 'series') return;
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
      this.selection.push(selectInfo);

      if (clickMouse === clickLeftMouse) {
        // show data jump
        if (this.properties.clickLeftMouse === 'none' || this.properties.clickLeftMouse === 'showToolTip') {
          return
        } else {
          if (isTooltipModelShown) return;
          this.hideTooltip();
          const selectionIds = this.selectionManager.getSelectionIds();
          this.host.commandService.execute([{
            name: this.properties.clickLeftMouse,
            payload: {
              selectionIds,
              position: {
                x: params.event.event.x,
                y: params.event.event.y,
                },
            }
          }])
        }
      } else if (clickMouse === clickRightMouse) {  
        params.event.event.preventDefault();
        this.showTooltip(params, true);
      }
    })
  }

  public clearOperation = () => {
    this.items[2] && this.items[2].forEach((element,index) => {
      const selectInfo = {
        seriesIndex: 0,
        dataIndex: index,
      };
      this.dispatch('downplay',selectInfo)
    });
    clearInterval(this.timeInterval)
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.preview = options.isViewer
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.value.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;

      this.isMock = false;
      this.dimension = plainData.profile.dimension.values[0].display;
      this.value = plainData.profile.value.values[0].display;
      this.payWay = plainData.profile.tooltipFields.values.length?plainData.profile.tooltipFields.values.map((value,index) => {
        return value.display
      }):''
      let items = plainData.data;
      // const isSort = plainData.sort[this.dimension].priority === 0 ? true : false;
      // data sort 
        const sortFlags = plainData.sort[this.dimension].order;
        let newItems: any = sortFlags.map((flags) => {
          return newItems = items.find((item) => item[this.dimension] === flags && item)
        })
        items = newItems.filter((item) => item)
      this.allItems = items;
      this.items[0] = items.map((item) => item[this.dimension]);
      this.items[1] = items.map((item) => {return { name: item[this.dimension], value: item[this.value]}});
      
      // get data
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        return selectionId
      }
      this.items[2] = items.map((item) => getSelectionId(item));
      this.format = options.dataViews[0].plain.profile.value.values[0].format;
      
    } else {
      this.isMock = true;
    }
    this.properties = options.properties;
    this.render()
  }


  public formatData = (number, dataUnit, dataType) => {
    let format = number
    if(dataUnit === 'auto'){
      const formatService = this.host.formatService;
      let realDisplayUnit = dataUnit;
      if (formatService.isAutoDisplayUnit(dataUnit)) {
          realDisplayUnit = formatService.getAutoDisplayUnit([number]);
      }
      return format = formatService.format(this.format, number, realDisplayUnit);
    } else {
      const units = [{
        value: 1,
        unit: ''
      },{
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
      let formatUnit = units.find((item) => item.value === Number(dataUnit))
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
      } else if (dataType === 'custom') {
        
      } else {
        format = dataType + format
      }
      return format + formatUnit.unit
    }
  }

  public render() {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;

    this.container.style.opacity = isMock ? '0.3' : '1';
    const legendTextStyle = { ...options.legendTextStyle };

    let data: any = this.isMock ? Visual.mockItems : this.items[1];
    this._total = data.map((item) => item.value).reduce((prev, next) => prev + next);
      let finalAngle = 360;
      let drawingStartAngle = options.startAngle%360
      let drawingEndAngle = options.endAngle%360
      if (drawingStartAngle && drawingEndAngle) {
        finalAngle = drawingStartAngle + (drawingEndAngle-drawingStartAngle)
      } else if (drawingStartAngle && !drawingEndAngle) {
        finalAngle = 360
      } else if (!drawingStartAngle && drawingEndAngle) {
        finalAngle = drawingEndAngle
      }  
      let ratio = finalAngle/360
      data = [...data,{
        value:this._total/ratio*(1-ratio), 
        name:'',
        label: {
          show:false,
        },
        itemStyle:{normal:{color:'rgba(0,0,0,0)'}}
      }]
    
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
          : pieColor[index%(pieColor.length)]
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
                color: (params) => {                  
                  return {
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
              show: options.labelPosition === 'center' ? false: options.showLabel,
              position: options.labelPosition,
              formatter: (params) => {
                let name = options.showLabelName ? params.name : ''
                let value = options.showLabelValue && !this.isMock ? this.formatData(params.value, options.labelDataUnit, options.labelDataType) : '';
                let percent = options.showLabelPercent ? `${(params.value/this._total*100).toFixed(options.LabelPercentDecimalPlaces)}%` : '';
                let lineFeed = options.showLabelTwoLine ? '\n':''

                if(!options.showLabelTwoLine){
                  return `{b|${name} ${value} ${percent}}`
                }else{
                  if(name && !value && !percent){
                    return `{b|${name}}`
                  }else if(!name && value && !percent){
                    return `{b|${value}}`
                  }else if(!name && !value && percent){
                    return `{b|${percent}}`
                  }else if(name && value && !percent){
                    return `{b|${name}${lineFeed}${value}}`
                  }else if(name && !value && percent){
                    return `{b|${name}${lineFeed}${percent}}`
                  }else if(!name && value && percent){
                    return `{b|${value}${lineFeed}${percent}}`
                  }else {
                    return `{b|${name} ${lineFeed}${value}${'/'}${percent}}`
                  }
                }
              },
              rich:{
                b: {
                  lineHeight: 20,
                  ...options.labelTextStyle,
                  fontSize: parseInt(options.labelTextStyle.fontSize),
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
            emphasis: {
              label: {
                  show: true,
                  ...options.labelTextStyle,
                fontSize: parseInt(options.labelTextStyle.fontSize)
              },
              scale: true,
              scaleSize: options.autoScaleSize,
              focus: 'global',
              blurScope: 'coordinateSystem'
            },
            labelLine: {
              show: options.showLabelLine,
              length:options.labelLineFirst,
              length2:options.labelLineSecond,
              smooth: `${options.labelLineSmooth * 0.01}`,
              lineStyle:{
                color:null,
                width:options.labelLineWidth
              }
            },
            itemStyle: {
              normal: {
                color: (params) => {
                  return options.showGradient?{
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
                  }:getColors(params.dataIndex, 1)
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
        position:(point,params,dom,rect,size)=>{
          let x = 0;
          let y = 0;
          let pointX = point[0];
          let pointY = point[1];
          var boxWidth = size.contentSize[0];
          var boxHeight = size.contentSize[1];
          if (boxWidth > pointX) {
            x = 0; 
            y -= 5; 
        } else { 
            x = pointX - boxWidth - 5;
        }
        
        if (boxHeight + 10 > pointY) {
            y = pointY + 5;
        } else if (boxHeight > pointY) {
            y = 0;
        } else { 
            y += pointY - boxHeight;
        }
        return [x, y];
        },
        formatter: (params) => {
          let eachSector = this.allItems.find((ele)=> ele[this.dimension] === params.name)
          let toolTips = ''
          let lineWrap = '<br/>'
          this.payWay && this.payWay.forEach((element,index) => {
            toolTips += `${lineWrap}${element}${': '}${eachSector[this.payWay[index]]}`
          });
          
          return `${this.isMock ? '访问量' : this.dimension} ${lineWrap}${params.name}
           :${this.formatData(params.value, options.labelDataUnit, options.labelDataType)}
            (${(params.value/this._total*100).toFixed(options.LabelPercentDecimalPlaces)}%)
            ${toolTips}`
        }
      },
      legend: {
        data: this.isMock ? ['一月', '二月', '三月', '四月', '五月', '六月'] : this.items[0],
        show: options.showLegend,
        type: options.openLegendPage ?  'scroll' : 'plain',
        left: options.legendPosition === 'left' || options.legendPosition === 'right' ? options.legendPosition : options.legendVerticalPosition,
        top: options.legendPosition === 'top' || options.legendPosition === 'bottom' ? options.legendPosition : options.legendHorizontalPosition,
        align: 'left',
        icon: options.legendIcon === 'none' ? '' : options.legendIcon,
        textStyle: {
          ...legendTextStyle,
          fontSize: parseInt(options.legendTextStyle.fontSize),
          rich: {
            a: {
              align: 'left',
              fontSize: 14,
              color: legendTextStyle.color,
              width:20,
              padding: [0, 0, 10, 0]
            },
            b: {
              align: 'center',
              fontSize: 14,
              color: legendTextStyle.color,
              width:5,
              padding: [0, 0, 10, 0]
            },
            c: {
              align: 'right',
              fontSize: 14,
              color: legendTextStyle.color,
              width:5,
              padding: [0, 0, 10, 0]
            }
          }
        },
        orient: orient,
        width: options.legendArea === 'custom' ? `${options.legendWidth}%` : 'auto',
        height: options.legendArea === 'custom' ? `${options.legendHeight}%` : 'auto',
        formatter: (name) => {
          let _firstLegendText = false;
          const _target = data.find((item: any, index) => {
            if (item.name === name && !index) {
              _firstLegendText = true;
            }
            return item.name === name
          })
          let _legendText = '';
          let _title = '';
          if (options.showLegendSeries) {
            _legendText += `${_target.name}`;
            _title += `{a|${this.dimension}}`
          }
          if (options.showLegendValue) {
            _legendText += ` ${this.formatData(_target.value, options.labelDataUnit, options.labelDataType)}`;
            _title += `{b|数值}`
          }
          if (options.showLegendPercent) {
            _legendText += ` ${Number((_target.value / this._total * 100).toFixed(options.LabelPercentDecimalPlaces))}%`;
            _title += `{c|占比}`
          }
          _title += '\n'
          return _firstLegendText ? `${_legendText}`: _legendText;
        },
        
      },
      // graphic: {
      //   type: "text",
      //   left: "center",
      //   top: "40%",
      //   style: {
      //     text: "总计",
      //     textAlign: "center",
      //     fill: "#FFF",
      //     fontSize: 20,
      //   }
      // },
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
      hiddenOptions = hiddenOptions.concat(['legendPosition', 'legendIcon', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle', 'legendArea', 'legendWidth', 'legendHeight'
      , 'showLegendSeries', 'showLegendPercent', 'showLegendValue', 'openLegendPage'])
    }
    if (updateOptions.properties.legendPosition === 'left' || updateOptions.properties.legendPosition === 'right') {
      hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
    } else {
      hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
    }
    if (updateOptions.properties.legendArea === 'auto') {
      hiddenOptions = hiddenOptions.concat(['legendWidth', 'legendHeight'])
    }
    // label
    if (!updateOptions.properties.showLabel) {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'showLabelValue', 'showLabelPercent', 'labelPosition', 'labelDataType', 'labelDataUnit', 'labelTextStyle', 'showLabelTwoLine',
       'showLabelName', 'labelTextColor', 'setLabelTextColor', 'LabelPercentDecimalPlaces', 'showLabelLine'])
    }

    if (updateOptions.properties.labelPosition === 'inside') {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'labelDataType', 'labelDataUnit', 'outerOutside'])
    }
    if (updateOptions.properties.labelPosition === 'outside') {
      hiddenOptions = hiddenOptions.concat(['outer'])
    }
    if (!updateOptions.properties.showLabelLine || !updateOptions.properties.showLabel){
      hiddenOptions = hiddenOptions.concat(['labelLineFirst', 'labelLineSecond', 'labelLineWidth', 'labelLineSmooth'])
    }
    if (!updateOptions.properties.showLabelValue) {
      hiddenOptions = hiddenOptions.concat(['labelDataType', 'labelDataUnit'])
    }
    if (!updateOptions.properties.showLabelPercent) {
      hiddenOptions = hiddenOptions.concat(['LabelPercentDecimalPlaces'])
    }
    if (!updateOptions.properties.automaticRotation) {
      hiddenOptions = hiddenOptions.concat(['rotationInterval'])
    }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}