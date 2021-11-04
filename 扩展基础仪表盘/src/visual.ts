import '../style/visual.less';
import * as echarts from 'echarts/core';
import { GaugeChart,PieChart,ScatterChart,LineChart   } from 'echarts/charts';
import { TitleComponent , GraphicComponent , AriaComponent , TooltipComponent, LegendComponent, GridComponent   } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import  CustomStyle  from './customStyle.js';

echarts.use(
  [ GaugeChart,PieChart , ScatterChart , LineChart ,TitleComponent , GraphicComponent, AriaComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]
);
let _styleName = 'default';
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
  private shadowDiv: any;
  static mockItems = 0.5;
  
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.host = host;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
    };
    // create a  div
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
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
    this.properties = options.properties;
    this.render();
  }
 
  private onUpdateStylePropertiesData = () => {
    // 复制CustomStyle， 删除styleName 和initStyleName 属性
    if (this.properties.styleName !== this.properties.initStyleName) {
      _styleName = this.properties.styleName;
      this.host.propertyService.setProperty('initStyleName', this.properties.styleName);
      const _initData = this.properties.styleName === 'default' ? CustomStyle.default : {
        ...CustomStyle.default,
        ...CustomStyle[this.properties.styleName]
      }
      for (let key in _initData ) {
        if (key !== 'styleName') {
          this.host.propertyService.setProperty(key, _initData[key]);
        } 
      }
    }
  }
 
  private render() {
    const isMock = !this.items.length;
    this.chart.clear();
    const items = ((isMock ? Visual.mockItems : this.items) * 100);
    this.container.style.opacity = isMock ? '0.3' : '1';
    const shadowDivSize = this.container.offsetWidth < this.container.offsetHeight ? this.container.offsetWidth : this.container.offsetHeight;
    const options = this.properties;

    this.shadowDiv.style.cssText = options.showBgImage ?  `position: absolute; width: ${shadowDivSize}px; height: ${shadowDivSize}px; top: 50%; left: 50%; pointer-events: none; z-index: -1; border-radius: 50%; background: url(${options.bgImage}) no-repeat center center; background-size: cover ` :'';
    this.shadowDiv.className = options.showBgImage ? (options.bgImageAnimate ? 'rotateBg' : 'gaugeBg' ): '';

    // let fontWeight: string;
    // if (options.textStyle.fontWeight == "Light") {
    //   fontWeight = options.textStyle.fontWeight + "er"
    // } else {
    //   fontWeight = options.textStyle.fontWeight
    // }
    // clear pointer style

    // update capabilities data
    this.onUpdateStylePropertiesData();

    const _getSectionColor = (useTo: boolean, defaultColor?: string) => {
      let _shadowColor = defaultColor || options.gaugeStartColor;
      // if (useTo) {
      //   options.dialSectionColor.map((item: any, index: number) => {
      //     if (index === 0 && Number(this.items) * 100 < Number(item.sectionMax)) {
      //       _shadowColor = item.color
      //     } else {
      //       if (Number(this.items) * 100 < Number(item.sectionMax) && Number(this.items) * 100 > Number(options.dialSectionColor[index -1].sectionMax)) {
      //         _shadowColor = item.color
      //       }
      //     }
      //   })
      // }
      return _shadowColor;
    }
    // 图表样式
    const _gaugeStyle = (radius?: any, splitNumber?: number) => {
      return {
        type: 'gauge',
        radius: radius ? `${radius}%` : `${options.gaugeR}%`,
        center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
        startAngle: options.startAngle,
        endAngle:  options.endAngle,
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
      ..._dataAndDetail('2'),
    },
    ];


    const basicGaugeSeries: any = [
      ...ContrastAndDetailGauge,
      {
        // 外层花瓣
        type: 'gauge',
        startAngle: options.startAngle,
        endAngle:  options.endAngle,
        center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        radius: `${options.gaugeR}%`,
        splitNumber: Number(options.gearNumber),
        axisLine: {
          show: false,
          lineStyle: {
            color: [
              [1, 'green']
            ],
            width: 20
          }
        },
        splitLine: {
          show: options.gaugeGear,
          length: options.gearLength,
          lineStyle: {
            width: options.gearWidth,
            color: options.gearColor,
            distance: 10,
          } //刻度节点线
        },
        pointer: {
          show: false
        },
        ..._title(),
        ..._dataAndDetail('1'),        
      },
      {
        //外部刻度
        type: 'gauge',
        center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
        radius: `${options.gaugeR * 0.75}%`,
        // radius: `${65}%`,
        clockwise: true,
        startAngle: options.startAngle,
        endAngle:  options.endAngle,
        splitNumber: 15,
        detail: {
          show: false
        },
        pointer: {
          show: false
        },
        progress: {
          show: options.showProgress,
          roundCap: options.progressRoundCap,
          width: options.progressRoundCapWidth,
          itemStyle: {
            color: options.progressRoundColor
          }
        },
        axisLine: {
          show: true,          
          lineStyle: {              
            color: [
              [1, options.gaugeBgColor]],
            width: options.gaugeWidth
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        data: [{
          value: Number(items)
        }],
        z: 2,
      }, 
      {
        //中间环形分割线
        type: 'gauge',
        center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
        radius: `${options.gaugeR * 0.75}%`,
        clockwise: true,
        startAngle: options.startAngle,
        endAngle:  options.endAngle,
        splitNumber: 12,
        detail: {
          show: false
        },
        pointer: {
          show: false
        },
        axisLine: {
          show: false,

        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: options.showsplitLine,
          length: options.gaugeWidth,
          distance: options.splitLineDistance,
          lineStyle: {
            color: options.splitLineColor,
            width: options.splitLineWidth,
          }
        },
        axisLabel: {
          show: false
        },
        z: 3,
      },
      {
        //内部圆圈
        type: 'gauge',
        center: [`${options.gaugeXPosition}%`, `${options.gaugeYPosition}%`],
        // radius: `${options.gaugeR}%`,
        radius: `${options.gaugeR * (options.gaugeCircleR / 100)}%`,
        clockwise: true,
        startAngle: options.startAngle,
        endAngle:  options.endAngle,
        // splitNumber: 15,
        detail: {
          show: false
        },
        pointer: {
          show: false
        },
        progress: {
          show: options.gaugeCircle,
          roundCap: true,
          width:options.gaugeCircleWidth,
          itemStyle: {
            color: options.gaugeCircleColor,
            // borderWidth: 2
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false
        },
        data: [{
          value: 100
        }],
      },
    ];

    const option = {
      series: basicGaugeSeries
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

    if (!options.properties.showDataLabel1) {
      hiddenOptions = hiddenOptions.concat(['showActual1', 'showContrast1', 'showDetail1', 'dataLabel1LineHeight', 'dataLabel1XPosition', 'dataLabel1YPosition', 'dataLabel1TextStyle', 'DetailDisplayUnit', 'DetailDisplayUnitTextStyle'])
    }

    if (!options.properties.showDataLabel2) {
      hiddenOptions = hiddenOptions.concat(['showActual2', 'showContrast2', 'showDetail2', 'dataLabel2LineHeight', 'dataLabel2XPosition', 'dataLabel2YPosition', 'dataLabel2TextStyle'])
    }
    // bg
    if (!options.properties.showBgImage) {
      hiddenOptions = hiddenOptions.concat(['bgImage', 'bgImageAnimate'])
    }
    // splitLine
    if (!options.properties.showsplitLine) {
      hiddenOptions = hiddenOptions.concat(['splitLineWidth', 'splitLineLength', 'splitLineDistance', 'splitLineColor'])
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