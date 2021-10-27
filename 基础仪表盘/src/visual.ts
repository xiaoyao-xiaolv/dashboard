import '../style/visual.less';
import * as echarts from 'echarts/core';
import { GaugeChart,PieChart,ScatterChart,LineChart   } from 'echarts/charts';
import { TitleComponent , GraphicComponent , AriaComponent , TooltipComponent, LegendComponent, GridComponent   } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
  [ GaugeChart,PieChart , ScatterChart , LineChart ,TitleComponent , GraphicComponent, AriaComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]
);
let gaugeStyle = 'basic';
let pointerStyle = 'pointer';
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private host: any;
  private _actualValue: any;
  private _contrastValue: any;
  private _ActualValue: any;
  private _ContrastValue: any;
  private items: any;
  private properties: any;
  private ActualValue: any;
  private isActual: boolean;
  private isContrast: boolean;
  private ActualFormat: any;
  private ActualDisplayUnit: any;
  private ContrastFormat: any;
  private ContrastDisplayUnit: any;
  static mockItems = 0.5;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.host = host;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
    };
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    if (dataView && dataView.plain.profile.ActualValue.values.length) {
      const plainData = dataView.plain;
      this.isActual = !!plainData.profile.ActualValue.values.length;
      this.isContrast = !!plainData.profile.ContrastValue.values.length;
      this._ActualValue = this.isActual && plainData.profile.ActualValue.values[0].display ;
      this._ContrastValue = this.isContrast && plainData.profile.ContrastValue.values[0].display || '';
      this.ActualValue = plainData.data[0][this._ActualValue];
      // custom 
      this._actualValue = options.properties.Actual === 'dataset' ? (this.isActual && <number>plainData.data[0][this._ActualValue] || 0) : (Number(options.properties.customActual));
      this._contrastValue = options.properties.Contrast === 'dataset' ? (this.isContrast && <number>plainData.data[0][this._ContrastValue] || 0) : (Number(options.properties.customContrast));
      this.items = this._contrastValue ? (this._actualValue / this._contrastValue).toFixed(4) : '1';

      // format 
      this.ActualFormat = dataView.plain.profile.ActualValue.options.valueFormat;
      this.ActualDisplayUnit = dataView.plain.profile.ActualValue.options.valueDisplayUnit;
      this.ContrastFormat = dataView.plain.profile.ContrastValue.options.valueFormat;
      this.ContrastDisplayUnit = dataView.plain.profile.ContrastValue.options.valueDisplayUnit;
    } else {
      this._actualValue = options.properties.Actual === 'customdata' && (Number(options.properties.customActual)) || 0;
      this._contrastValue = options.properties.Contrast === 'customdata' &&  (Number(options.properties.customContrast)) || 0;
      if (this._actualValue > 0 && this._contrastValue > 0) {
        this.items = (this._actualValue / this._contrastValue).toFixed(4);
      }

    }
    // if (dataView && dataView.plain.profile.ContrastValue.values.length && !dataView.plain.profile.ActualValue.values.length) {
    //   this.items = '1';
    // }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    const isMock = !this.items.length;
    const items = ((isMock ? Visual.mockItems : this.items) * 100);
    this.container.style.opacity = isMock ? '0.3' : '1';
    
    const options = this.properties; 
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
    const _getSectionColor = (useTo: boolean, defaultColor?: string) => {
      let _shadowColor = defaultColor || options.gaugeStartColor;
      if (useTo) {
        options.dialSectionColor.map((item: any, index: number) => {
          if (index === 0 && Number(this.items) * 100 < Number(item.sectionMax)) {
            _shadowColor = item.color
          } else {
            if (Number(this.items) * 100 < Number(item.sectionMax) && Number(this.items) * 100 > Number(options.dialSectionColor[index -1].sectionMax)) {
              _shadowColor = item.color
            }
          }
        })
      }
      return _shadowColor;
    }
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
        splitNumber:  options.scope,
      }
    }
    // 仪表盘轴线
    const _axisLine = (_width?: number , _color?: any) => {
      return {
        show: true,
        lineStyle: {
          width: _width,
          color: _color || '#fff',
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
        distance: options.axisTickShadowDistance,
        lineStyle: {
          type: "solid",
          color: options.axisTickColor,
          width: options.axisTickWidth
        }
      }
    }

    // 刻度标签
    const _axisLabel =  {
      show: options.showAxisLabel,
      color: options.axisLabelColor,
      fontSize: options.axisLabelTextStyle.fontSize.substr(0, 2),
      fontFamily:options.axisLabelTextStyle.fontFamily,
      fontWeight:options.axisLabelTextStyle.fontWeight,
      distance: options.axisLabelShadowDistance,
      formatter: (value) => {
        let _label = `${value.toFixed(0)}`
        options.axisLabelCustom.length && options.axisLabelCustom.map((item: any) => {
          if (Number(value.toFixed(0)) === Number(item.axisLabel)) {
            _label = item.newAxisLabel 
          } else {
            // min and max
            _label = options.showDefaultLabel ? _label : '';
          }
        })
        return _label
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
          fontWeight: options.textStyle.fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle
        },
      }
    }

    // 指针样式
    const _pointer = {
      show: options.showPointer,
      length: `${options.pointerLength}%`,
      radius: '20%',
      width: options.pointerWidth, //指针粗细
      itemStyle: {
        color: _getSectionColor(options.dialColorUseToPointer, options.pointerColor),
      }
      // offsetCenter: [`${options.pointerXPosition}%`, `${options.pointerYPosition}%`]
    }
    // 数据标注和标题
    const _dataAndDetail = (_labelNumber?: string) => {
      return {
        detail: {//明细
          show: options[`showDataLabel${_labelNumber}`],
          formatter: (value) => {
            let _detail = [];
            let _text = '';
            let _unit = '';
            if (!isMock) {
              const formatAndDisplayUnit = (_value: number, _label: string) => {
                let realDisplayUnit = this[`${_label}DisplayUnit`];
                const formatService = this.host.formatService;
                if (formatService.isAutoDisplayUnit(this[`${_label}DisplayUnit`])) {
                  realDisplayUnit = formatService.getAutoDisplayUnit([_value]);
                }
                return formatService.format(this[`${_label}Format`], _value, realDisplayUnit);
              }
              if (options[`showActual${_labelNumber}`] && this.isActual && this._actualValue) {
                _detail.push(formatAndDisplayUnit(this._actualValue, 'Actual'))
              }
              if (options[`showContrast${_labelNumber}`] && this.isContrast) {
                _detail.push(formatAndDisplayUnit(this._contrastValue, 'Contrast'))
              }

              if (options[`showDetail${_labelNumber}`]) {
                _detail.length > 0
                  ? _detail.push(`(${value}%)`)
                  : _detail.push(`${value}%`);
              }
              // _labelNumber is 1 
              _text = _detail.join('/');
              if (Number(_labelNumber) === 1 && options.DetailDisplayUnit) {
                _unit = options.DetailDisplayUnit;
              }
            } else {
              // data label 1
              if (_labelNumber === '1') {
                _detail.push(`20`)
              } else {
                _detail.length > 0
                  ? _detail.push(`(${value}%)`)
                  : _detail.push(`${value}%`)
              }
              _text = _detail.join('/');
            }
            return `${_text} {unitFont|${_unit}}`;         
          },
          rich: {
            unitFont: {
              color: options.DetailDisplayUnitTextStyle.color,
              fontSize: options.DetailDisplayUnitTextStyle.fontSize.substr(0, 2),
              fontFamily: options.DetailDisplayUnitTextStyle.fontFamily,
              fontWeight: options.DetailDisplayUnitTextStyle.fontWeight,
              fontStyle: options.DetailDisplayUnitTextStyle.fontStyle,
              // verticalAlign: 'text-bottom',
            }
          },
          offsetCenter: [`${options[`dataLabel${_labelNumber}XPosition`]}%`, `${options[`dataLabel${_labelNumber}YPosition`]}%`],
          color: _getSectionColor(options[`dialColorUseToLabel${_labelNumber}`], options[`dataLabel${_labelNumber}TextStyle`].color),
          fontSize: options[`dataLabel${_labelNumber}TextStyle`].fontSize.substr(0, 2),
          fontWeight: options[`dataLabel${_labelNumber}TextStyle`].fontWeight,
          fontFamily: options[`dataLabel${_labelNumber}TextStyle`].fontFamily,
          // fontStyle: options.detailTextStyle.fontStyle
          fontStyle: options[`dataLabel${_labelNumber}TextStyle`].fontStyle,
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
      ..._dataAndDetail('2')},
    ];

    let dotArray = [];

    const calculateDot = (data) => {
      const _number = 90;
      if (data <= 20) {
          dotArray.push(_number)
      }else if (data > 20&&data<=40) {
          dotArray.push(...[_number,_number])
      }else if (data > 40&&data<=60) {
          dotArray.push(...[_number,_number,_number])
      }else if (data > 60&&data<=80) {
          dotArray.push(...[_number,_number,_number,_number])
      }else if (data > 80&&data<=100) {
          dotArray.push(...[_number,_number,_number,_number,_number])
      }
    }
    calculateDot(items)//80%显示4个点，
    const centerPointerStyle = [{
      // 五个小球
        name: '',
        symbolSize: 5,
        symbolOffset: ['10', '0'],//就是把自己向上移动了一半的位置，在 symbol 图形是气泡的时候可以让图形下端的箭头对准数据点。
        type: 'scatter',
        color: _getSectionColor(options.dialColorUseToPointer),
        data: [90, 90, 90, 90, 90]
      },
      //根据数据判断小球的颜色
      {
        name: '',
        type: 'scatter',
        symbolSize: 5,
        symbolOffset: ['10', '0'],//移动小球的位置
        color: _getSectionColor(options.dialColorUseToPointer),
        data: dotArray
      },
      {//第一个线
        name: '',
        type: 'line',
        color: _getSectionColor(options.dialColorUseToPointer),
        symbol: "none",
        data: [95, 95, 95, 95, 95, 95]
      },
      {//第二根线
        name: '',
        type: 'line',
        symbol: "none",//去掉横线上的小点
        color: _getSectionColor(options.dialColorUseToPointer),
        data: [85, 85, 85, 85, 85, 85]
      }]
    
    // progress
    const RgbToHex  = (a, b, c)  =>{
      var r = /^\d{1,3}$/;
      if (!r.test(a) || !r.test(b) || !r.test(c)) return window.alert("输入错误的rgb颜色值");
      var hexs = [a.toString(16), b.toString(16), c.toString(16)];
      for (var i = 0; i < 3; i++) if (hexs[i].length == 1) hexs[i] = "0" + hexs[i];
      return "#" + hexs.join("");
    }
    
    const HexToRgb = (str) =>{
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

 
    const _getDialColor = () => {
      let _colors;
      // is use to dial
      if (options.dialColorUseToDial) {
        _colors = options.dialSectionColor.map((item: any, index: number) => {
          return [
            Number(item.sectionMax) / options.max,
            new echarts.graphic.LinearGradient(
              0, 1, 1, 0, [{
                      offset: 0,
                      color: item.color,
                  },
                  {
                      offset: 1,
                      color: item.color,
                  }
              ]                            
          )
          ]
        })
      } else {
        _colors = [[1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color:  options.gaugeStartColor
          },
          {
            offset: 0.3,
            color:options.gaugeCenterColor ||  options.gaugeStartColor
          },
          {
            offset: 0.6,
            color:options.gaugeCenterColor ||  options.gaugeStartColor
          },
          {
            offset: 1,
            color:options.gaugeEndColor ||  options.gaugeStartColor
         }
        ])]]
      }
      
      return _colors;
    }
    const _dialColor = _getDialColor();
    
    const pieGaugeProgress : any = [
      ...ContrastAndDetailGauge,
      {
            name: "外部进度条",
            ..._gaugeStyle(),
            // axisLine: _axisLine(2, [[ Number(items) / 100, colorSet.color], [1, colorSet.color]]),
            axisLine: {
              lineStyle: {
                  width: 2,
                  color: _dialColor,
              }
            },
            axisLabel: { show: false, },
            axisTick: { show: false,},
            splitLine: {show: false,},
            itemStyle: {color:"#ffffff"},
            ..._title(),
            ..._dataAndDetail('1'),
            pointer: options.pointerStyle === 'pointer'  ? _pointer : {
              show: false,
            },
            progress: {
              show: false,
            },
      },
      {
          name: "内部阴影",
          type: "gauge",
          ..._gaugeStyle(options.gaugeR * (46 / 52)),
          axisLine: _axisLine((options.shadowWidth * (options.gaugeR / 100)), [[Number(items) / options.max, new echarts.graphic.LinearGradient(
                0, 1, 0, 0, [{
                        offset: 0,
                        color: hexToRgba(_getSectionColor(options.dialColorUseToShadow, options.shadowColor), 0.1),
                    }, {
                        offset: 0.5,
                        color: hexToRgba(_getSectionColor(options.dialColorUseToShadow, options.shadowColor), 0.2),
                    },
                    {
                        offset: 1,
                        color: hexToRgba(_getSectionColor(options.dialColorUseToShadow, options.shadowColor), 1),
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
          name: "内部刻度",
          ..._gaugeStyle(options.gaugeR * (48 / 52)),
          axisLine: {
            lineStyle: {
                width: 10 * (options.gaugeR / 100),
                color: _dialColor,
            }
          },
          axisLabel: { show: false,},
          axisTick: { show: false,},
          splitLine: { show: false,},
          itemStyle: { show: false, },
      },
      {
          name: '外部刻度',
          ..._gaugeStyle(options.gaugeR * (48 / 52)),
          axisLine: _axisLine(1,  [[1, 'rgba(0,0,0,0)']]),
          axisLabel: _axisLabel, //刻度标签。
          axisTick: _axisTick(),
          splitLine: _splitLine(),
          detail: {
              show: false
        }
      },
      { //指针上的圆
          type: 'pie',
          tooltip: { show: false },
          hoverAnimation: false,
          legendHoverLink: false,
          radius: ['0%', `${options.showPointer && options.pointerStyle === 'pointer' ? '4%' : '0%'}`],
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
                      color:_getSectionColor(options.dialColorUseToPointer, options.pointerColor) ,
                  },
              }
          }]
      },
      ...(options.showPointer && options.pointerStyle === 'dot' ?  centerPointerStyle: []),
    ]
    // clear pointer style
    const _option = this.properties.pointerStyle;
    if (pointerStyle !== _option) {
      this.chart.clear();
      pointerStyle = _option;
    }

    const option = {
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
      series: pieGaugeProgress
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
    //  hidden gauge style
    let hiddenOptions: Array<string> = ['gaugeOptions'];
    
    if (!options.properties.showSubTitle) {
      hiddenOptions = hiddenOptions.concat(['subtitle'])
    }
    if (options.properties.Actual == "dataset") {
      hiddenOptions = hiddenOptions.concat(['customActual'])
    }

    if (options.properties.Contrast == "dataset") {
      hiddenOptions = hiddenOptions.concat(['customContrast'])
    }

    // pointer style
    if (!options.properties.showPointer) {
      hiddenOptions = hiddenOptions.concat(['pointerLength', 'pointerWidth', 'pointerStyle', 'pointerColor'])
    } else {
      if (options.properties.pointerStyle === 'dot') {
        hiddenOptions = hiddenOptions.concat(['pointerLength', 'pointerWidth', 'pointerColor'])
      }
    }
    if (!options.properties.showDataLabel1) {
      hiddenOptions = hiddenOptions.concat(['showActual1', 'showContrast1', 'showDetail1', 'dataLabel1LineHeight', 'dataLabel1XPosition', 'dataLabel1YPosition', 'dataLabel1TextStyle'])
    }

    if (!options.properties.showDataLabel2) {
      hiddenOptions = hiddenOptions.concat(['showActual2', 'showContrast2', 'showDetail2', 'dataLabel2LineHeight', 'dataLabel2XPosition', 'dataLabel2YPosition', 'dataLabel2TextStyle', 'DetailDisplayUnit'])
    }
    // dial section 
    // if (options.properties.dialColor == "single") {
    //   hiddenOptions = hiddenOptions.concat(['dialSectionColor', 'dialColorUseToLabel', 'dialColorUseToShadow', 'dialColorUseToPointer'])
    // } else {
    //   hiddenOptions = hiddenOptions.concat(['dialSingleColor'])
    // }
    // splitLine
    if (!options.properties.showsplitLine) {
      hiddenOptions = hiddenOptions.concat(['splitLineWidth', 'splitLineLength', 'splitLineDistance', 'splitLineColor'])
    }

     // axisTick
     if (!options.properties.showaxisTick) {
      hiddenOptions = hiddenOptions.concat(['axisTickNum', 'axisTickWidth', 'axisTickShadowDistance', 'axisTickColor'])
    }

     // axisLabel
     if (!options.properties.showAxisLabel) {
      hiddenOptions = hiddenOptions.concat(['axisLabelShadowDistance', 'axisLabelColor', 'axisLabelTextStyle', 'scope', 'axisLabelCustom', 'showDefaultLabel'])
    }
    // SubTitle
    if (!options.properties.showSubTitle) {
      hiddenOptions = hiddenOptions.concat(['subtitle', 'titleXPosition', 'titleYPosition', 'textStyle'])
    }

    // DataLabel1
    if (!options.properties.showDataLabel1) {
      hiddenOptions = hiddenOptions.concat(['showActual1', 'showContrast1', 'showDetail1', 'dataLabel1LineHeight', 'dataLabel1XPosition', 'dataLabel1YPosition', 'dataLabel1TextStyle'])
    }

     // DataLabel2
     if (!options.properties.showDataLabel2) {
      hiddenOptions = hiddenOptions.concat(['showActual2', 'showContrast2', 'showDetail2', 'dataLabel2LineHeight', 'dataLabel2XPosition', 'dataLabel2YPosition', 'dataLabel2TextStyle'])
    }

   
    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
} 