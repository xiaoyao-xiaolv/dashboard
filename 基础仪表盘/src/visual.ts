import '../style/visual.less';
import * as echarts from 'echarts/core';
import { GaugeChart,PieChart,ScatterChart,LineChart   } from 'echarts/charts';
import { TitleComponent , GraphicComponent , AriaComponent , TooltipComponent, LegendComponent, GridComponent   } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
  [ GaugeChart,PieChart , ScatterChart , LineChart ,TitleComponent , GraphicComponent, AriaComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]
);

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private _actualValue: any;
  private _contrastValue: any;
  private _ActualValue: any;
  private _ContrastValue: any;
  private items: any;
  private properties: any;
  private ActualValue: any;
  static mockItems = 0.5;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
    };
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.ContrastValue.values.length) {
      const plainData = dataView.plain;
      this._ActualValue = plainData.profile.ActualValue.values[0].display;
      this._ContrastValue = plainData.profile.ContrastValue.values[0].display;
      this.ActualValue = plainData.data[0][this._ActualValue];
      // custom 
      this._actualValue = options.properties.Actual === 'dataset' ? (<number>plainData.data[0][this._ActualValue]) : (Number(options.properties.customActual));
      this._contrastValue = options.properties.Contrast === 'dataset' ? (<number>plainData.data[0][this._ContrastValue]) : (Number(options.properties.customContrast));
      this.items = (this._actualValue / this._contrastValue).toFixed(4);
     
    }

    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = ((isMock ? Visual.mockItems : this.items) * 100);
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let subtitle = options.showNum ? options.subtitle + '\n' + this.ActualValue : options.subtitle
    let scope = 100 / options.scope
    let color = [];
    for (let i = 0; i < options.scope; i++) {
      let j = i % options.palette.length
      color.push([scope * (i + 1) / 100, options.palette[j]])
    }
   
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }
    // let detailfontWeight: string;
    // if (options.detailTextStyle.fontWeight == "Light") {
    //   detailfontWeight = options.detailTextStyle.fontWeight + "er"
    // } else {
    //   detailfontWeight = options.detailTextStyle.fontWeight
    // }
    // 图表样式
    const _gaugeStyle = (radius?: any, splitNumber?: number) => {
      return {
        type: 'gauge',
        radius: radius ? `${radius}%` : `${options.gaugeR}%`,
        center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
        min: options.min,
        max: options.max,
        startAngle: options.startAngle,
        endAngle: options.endAngle,
        splitNumber: options.scope,
      }
    }
    // 仪表盘轴线
    const _axisLine = (_width?: number , _color?: any) => {
      return {
        show: true,
        roundCap: options.gaugeRoundCap,
        lineStyle: {
          width: _width || options.width,
          color: _color || color,
        },
      }
    }
    // 分割线
    const _splitLine = (_distance?: number) => {
      return {
        show: options.showsplitLine,
        length: options.splitLineLength,
        distance: options.splitLineDistance,
        lineStyle: {
          type: "solid",
          color: options.splitLineColor,
          width: options.splitLineWidth,
        }
      }
    }
    //刻度样式
    const _axisTick = (_distance?: number) => {
      return {
        show: options.showaxisTick,
        splitNumber: options.axisTickNum, //分割线之间的刻度数
        distance:  options.axisTickDistance ||  _distance || 10,
        lineStyle: {
          type: "solid",
          color: options.axisTickColor,
          width: options.axisTickWidth
        }
      }
    }
    const _title = () => {
      return {
        title: { //标题
          show: options.showSubTitle,
          // offsetCenter: [0, "30%"], // x, y，单位px
          offsetCenter: [`${options.titleXPosition}%`,`${options.titleYPosition}%`],
          lineHeight:15,
          color: options.textStyle.color,
          fontSize: options.textStyle.fontSize.substr(0, 2),
          // fontWeight: fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle
        },
      }
    }
    // 数据标注和标题
    const _dataAndDetail = (_labelNumber?: string) => {
      if (_labelNumber) {
        console.log(options[`${_labelNumber}TextStyle`], '=====')
      }
      
      return {
        detail: {//明细
          show: options[`show${_labelNumber}`] || options.showDataLabel,
          formatter: (value) => {
            let _detail = [];
            if (!isMock) {
              if (options[`show${_labelNumber}`]) {
                if (_labelNumber === 'Detail') {
                  _detail.push(`(${value}%)`)
                } else {
                  _detail.push(this[`_${_labelNumber.toLowerCase()}Value`])
                }
              }
            } else {
              _detail.push(`(${value}%)`)
            }
            return _detail.join('\n')
          },
          offsetCenter: [`${options[`${_labelNumber}XPosition`]}%`,`${options[`${_labelNumber}YPosition`]}%`],
          color: options[`${_labelNumber}TextStyle`].color,
          fontSize: options[`${_labelNumber}TextStyle`].fontSize.substr(0, 2),
          // fontWeight: detailfontWeight,
          fontFamily: options[`${_labelNumber}TextStyle`].fontFamily,
          // fontStyle: options.detailTextStyle.fontStyle
          fontStyle: options[`${_labelNumber}TextStyle`].fontStyle
        },
        data: [{
          value: Number(items.toFixed(2)),
          name: options.subtitle || this._ActualValue || '实际值'
        }]
      }
    }
    
    const _disableStyle = {
      progress: { show: false},
      pointer: { show: false },
      axisLine: {show: false },
      axisTick: { show: false },
      splitLine: { show: false},
      axisLabel: { show: false },
      title: {show: false},
    }

    const ContrastAndDetailGauge = [{
      name: 'Contrast',
      ..._disableStyle,
      ..._gaugeStyle(),
      ..._dataAndDetail('Contrast')
    },
    {
      name: 'Detail',
      ..._disableStyle,
      ..._gaugeStyle(),
      ..._dataAndDetail('Detail')
      }];
    
    const basicGauge = [{
      name: options.subtitle,
      ..._gaugeStyle(),
      axisLine: _axisLine((options.width * (options.gaugeR / 100))),
      splitLine: _splitLine(),
      axisTick: _axisTick(),
      pointer: {//指针
        show: true,
        width: 5,
        length: "80%"
      },
      ..._title(),
      ..._dataAndDetail('Actual')
    },
    ...ContrastAndDetailGauge,
    ];
    
    // const percent = 52; //百分数
    let color_percent0 = '',
        color_percent100 = '',
        dotArray = [];

    const calculateDot = (data) => {
      const _number = 90;
        if (data <= 20) {
            dotArray.push(_number)
            color_percent0 = 'rgba(12,255,0,1)'
            color_percent100 = 'rgba(12,255,0,.3)'
        }else if (data > 20&&data<=40) {
            dotArray.push(...[_number,_number])
            color_percent0 = 'rgba(12,255,0,1)'
            color_percent100 = 'rgba(12,255,0,.3)'
        }else if (data > 40&&data<=60) {
            dotArray.push(...[_number,_number,_number])
             color_percent0 = 'rgba(255,123,0,1)'
            color_percent100 = 'rgba(255,123,0,.3)'
        }else if (data > 60&&data<=80) {
            dotArray.push(...[_number,_number,_number,_number])
             color_percent0 = 'rgba(255,0,36,1)'
            color_percent100 = 'rgba(255,0,36,.3)'
        }else if (data > 80&&data<=100) {
            dotArray.push(...[_number,_number,_number,_number,_number])
            color_percent0 = 'rgba(255,0,36,1)'
            color_percent100 = 'rgba(255,0,36,.3)'
        }
    }

    calculateDot(items)//80%显示4个点，
    const pieGauge = [{
      ..._gaugeStyle( options.gaugeR),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0.4, 0, 0, [{
          offset: 0,
          color: color_percent0
        }, {
          offset: 1,
          color: color_percent100
        }]),
      },
      progress: {
        show: true,
        width: (options.width * (options.gaugeR /100))
      },
      pointer: {
        show: false
      },
      axisLine: _axisLine((options.width * (options.gaugeR / 100)), [[1, options.gradientBgColor]]),
      axisTick: _axisTick(-(options.width + 20)),
      axisLabel: {
        show: true,
        // distance: -20,
        color: '#999',
        // fontSize: 20,
        formatter: (value) => {
          return `${value.toFixed(0)}`
        } ,
      },
      anchor: {
        show: false
      },
      ..._title(),
      ..._dataAndDetail('Actual')
    },
    {
      ..._gaugeStyle(options.gaugeR * 0.7),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0.4, 0, 0, [{
          offset: 0,
          color: color_percent0
        }, {
          offset: 1,
          color: color_percent100
        }]),
      },
      progress: {
        show: true,
      },
      ..._disableStyle,
      detail: { show: false },
      data: [
        {
          value: Number(items)
        }
      ]
    },
    ...ContrastAndDetailGauge,
    //总共有5个小球
    {
      name: '',
      symbolOffset: ['20', '0'],//就是把自己向上移动了一半的位置，在 symbol 图形是气泡的时候可以让图形下端的箭头对准数据点。
      type: 'scatter',
      color: '#fff',
      data: [90, 90, 90, 90, 90]
    },
    //根据数据判断小球的颜色
    {
      name: '',
      type: 'scatter',
      symbolOffset: ['20', '0'],//移动小球的位置
      color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: color_percent0
      }, {
        offset: 1,
        color: color_percent100
      }]),
      data: dotArray
    },
    {//第一个线
      name: '',
      type: 'line',
      color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: color_percent0
      }, {
        offset: 1,
        color: color_percent100
      }]),
      symbol: "none",
      data: [95, 95, 95, 95, 95, 95]
    },
    {//第二根线
      name: '',
      type: 'line',
      symbol: "none",//去掉横线上的小点
      color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: color_percent0
      }, {
        offset: 1,
        color: color_percent100
      }]),
      data: [85, 85, 85, 85, 85, 85]
    }
    ];

    // progress
    const  RgbToHex  = (a, b, c)  =>{
      var r = /^\d{1,3}$/;
      if (!r.test(a) || !r.test(b) || !r.test(c)) return window.alert("输入错误的rgb颜色值");
      var hexs = [a.toString(16), b.toString(16), c.toString(16)];
      for (var i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
      return "#" + hexs.join("");
    }
    
    const  HexToRgb = (str) =>{
      var r = /^\#?[0-9a-f]{6}$/;
      //test方法检查在字符串中是否存在一个模式，如果存在则返回true，否则返回false
      if (!r.test(str)) return console.log("输入错误的hex");
      //replace替换查找的到的字符串
      str = str.replace("#", "");
      //match得到查询数组
      var hxs = str.match(/../g);
      //alert('bf:'+hxs)
      for (var i = 0; i < 3; i++) hxs[i] = parseInt(hxs[i], 16);
      return hxs;
    }
    const getLightOrDarkColor = (color, level, isLight?: boolean) => {
      var r = /^\#?[0-9a-f]{6}$/;
      let rgbc = [];
      if (!r.test(color)) {
        var rgb = color.split(',');
        var _r = parseInt(rgb[0].split('(')[1]);
        var _g = parseInt(rgb[1]);
        var _b = parseInt(rgb[2].split(')')[0]);
        rgbc = HexToRgb(RgbToHex(_r, _g, _b));
      } else {
        rgbc = HexToRgb(color);
      }
      if (isLight) {
        for (var i = 0; i < 3; i++) {
          rgbc[i] = Math.floor((255 - rgbc[i]) * level + rgbc[i]);
        }
        return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
      } else {
        for (var i = 0; i < 3; i++) {
          rgbc[i] = Math.floor(rgbc[i] * (1 - level));
        }
        return RgbToHex(rgbc[0], rgbc[1], rgbc[2]);
      }
    }

    const hexToRgba = (hex, opacity?: number, isLine?: boolean) => {
      const isHex = hex.slice(0, 1) === '#';
      const _opacity = isLine ? 0.1 : opacity;
      if (isHex) {
        return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
              + parseInt('0x' + hex.slice(5, 7)) + ',' + _opacity + ')';
      } else {
        // fixed rgba to rgba
        var rgb = hex.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var a = isLine ? (Number(rgb[3].split(')')[0]) + 0.2) : Number(rgb[3].split(')')[0])
        return `rgba(${r}, ${g}, ${b}, ${a})`
      }
    }

    const colorSet = {
        color: options.shadowColor,
        lightColor: getLightOrDarkColor(options.shadowColor, 0.1, true)
    };
    const color2 = {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
            {
              offset: 0,
              color: colorSet.lightColor
            },
            {
                offset: 1,
                color: colorSet.color
            }
        ],
            global: false
    }

    const pieGaugeProgress = [
      ...ContrastAndDetailGauge,
      {
            name: "外部进度条",
            ..._gaugeStyle(),
            axisLine: _axisLine(2, [[ Number(items) / 100, colorSet.color], [1, colorSet.color]]),
            axisLabel: {show: false,},
            axisTick: { show: false,},
            splitLine: {show: false,},
            itemStyle: {color:"#ffffff"},
            ..._title(),
            ..._dataAndDetail('Actual'),
            pointer: {
                show: true,
                length: '70%',
                radius: '20%',
                width: 3 //指针粗细
            },
            progress: {
              show: false,
            },
      },
      {
          name: "内部阴影",
          type: "gauge",
          ..._gaugeStyle(options.gaugeR * (46 / 52)),
          axisLine: _axisLine((100 * (options.gaugeR / 100)), [[Number(items) / 100, new echarts.graphic.LinearGradient(
                0, 1, 0, 0, [{
                        offset: 0,
                        color: hexToRgba(options.shadowColor, 0.1),
                    }, {
                        offset: 0.5,
                        color: hexToRgba(options.shadowColor, 0.2),
                    },
                    {
                        offset: 1,
                        color: hexToRgba(options.shadowColor, 1),
                    }
                ]
            )],
            [
                1, 'rgba(0,0,0,0)'
            ]
          ]),
          axisLabel: {
              show: false,
          },
          axisTick: {
              show: false,

          },
          splitLine: {
              show: false,
          },
          itemStyle: {
              show: false,
          },
      },
      {
          name: "内部小圆",
          ..._gaugeStyle(options.gaugeR * (48 / 52)),
          axisLine: _axisLine((10 * (options.gaugeR / 100)),  [
            [Number(items) / 100, color2],
            [1, "rgba(0,0,0,0)"]
          ]),
          axisLabel: { show: false,},
          axisTick: { show: false,},
          splitLine: { show: false,},
          itemStyle: { show: false, },
      },
      {
          name: '外部刻度',
          ..._gaugeStyle(options.gaugeR * (48 / 52)),
          axisLine: _axisLine(1,  [[1, 'rgba(0,0,0,0)']]),
          axisLabel: {
              show: true,
              color: '#ffffff',
              fontSize:14,
              fontFamily:'SourceHanSansSC-Regular',
              fontWeight:'bold',
              // position: "top",
                distance: -30,
          }, //刻度标签。
        axisTick: _axisTick(),
          splitLine: _splitLine(),
          detail: {
              show: false
        }
      },
      {
          name: "内部进度条",
          ..._gaugeStyle(options.gaugeR * (20 / 52)),
          axisLine: _axisLine(1,  [
            [Number(items)  / 100, colorSet.color],
            [1, colorSet.color]
          ]),
          axisLabel: { show: false,},
          axisTick: { show: false, },
          splitLine: { show: false, },
          itemStyle: { color:"#ffffff"},
      },
      { //指针上的圆
          type: 'pie',
          tooltip: { show: false },
          hoverAnimation: false,
          legendHoverLink: false,
          radius: ['0%', '4%'],
          center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
          label: {
              normal: {
                  show: false
              }
          },
          labelLine: {
              normal: {
                  show: false
              }
          },
          data: [{
              value: 120,
              itemStyle: {
                  normal: {
                      color: "#ffffff",
                  },
              }
          }]
      }, 
    ]

    const getSeries = () => {
      const _option = this.properties.gaugeOptions;
      let series = [];
      switch (_option) {
        case 'basic':
          series = basicGauge;
          break;
        case 'gradient':
          series = pieGauge;
          break;
        case 'shadow':
          series = pieGaugeProgress;
          break;
        default:
          break;
      }
      return series;
    }

    const option = {
      // backgroundColor: '#000',
      // haha chart options
      // title: {
      //     "x": '50%',
      //     "y": '45%',
      //     textAlign: "center",
      //     top: '68%',//字体的位置
      //     'text': '哈哈',
      //     "textStyle": {
      //         "fontWeight": 'normal',
      //         "color": '#FFF',
      //         "fontSize": 60
      //     },
      //     "subtextStyle": {//副标题的文字的样式
      //         "fontWeight": 'bold',
      //         "fontSize": 18,
      //         "color": '#3ea1ff'
      //     },
  
      // },
      xAxis: {
          show: false,//是否展示x轴
          min: function(value) {//调整x轴上面数据的位置
              return value.min - 7;
          },
          max: function(value) {
              return value.max + 7;
          },
          splitLine: {
              lineStyle: {
                  show: true,
                  type: 'dashed'
              }
          },
          "axisLabel": {
              "interval": 0,
              rotate: 40,
              textStyle: {
                  fontSize: 12,
                  color: '#000'
              },
          },
          data: ['1', '2', '3', '4', '5']
      },
      yAxis: {
          show: false,
          name: '万元',
          max: 200,
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          }
      },
      series: [...getSeries()]
    };
    this.chart.setOption(option);
  }

  public onDestroy() {
    this.chart.dispose();
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<string> = [''];
    
    if (!options.properties.showSubTitle) {
      hiddenOptions = hiddenOptions.concat(['subtitle'])
    }
    if (options.properties.Actual == "dataset") {
      hiddenOptions = hiddenOptions.concat(['customActual'])
    }

    if (options.properties.Contrast == "dataset") {
      hiddenOptions = hiddenOptions.concat(['customContrast'])
    }

    if (!options.properties.showActual) {
      hiddenOptions = hiddenOptions.concat(['ActualLineHeight', 'ActualXPosition', 'ActualYPosition', 'ActualTextStyle'])
    }

    if (!options.properties.showContrast) {
      hiddenOptions = hiddenOptions.concat(['ContrastLineHeight', 'ContrastXPosition', 'ContrastYPosition', 'ContrastTextStyle'])
    }

    if (!options.properties.showDetail) {
      hiddenOptions = hiddenOptions.concat(['DetailLineHeight', 'DetailXPosition', 'DetailYPosition', 'DetailTextStyle'])
    }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
} 