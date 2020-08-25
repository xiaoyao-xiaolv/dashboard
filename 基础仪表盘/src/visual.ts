import '../style/visual.less';
import * as echarts from 'echarts'

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
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
    if (dataView && dataView.plain.profile.values.values.length) {
      const plainData = dataView.plain;
      let valueField = plainData.profile.values.values[0].display;
      this.ActualValue = plainData.data[0][valueField];
      this.items = plainData.data[0][valueField];
    } else if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.ContrastValue.values.length) {
      const plainData = dataView.plain;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
      let ContrastValue = plainData.profile.ContrastValue.values[0].display;
      this.ActualValue = plainData.data[0][ActualValue];
      this.items = ((<number>plainData.data[0][ActualValue]) / (<number>plainData.data[0][ContrastValue])).toFixed(4);
    }
    this.properties = options.properties;
    this.render();
  }
  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = ((isMock ? Visual.mockItems : this.items) * 100).toFixed(2);
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let subtitle = options.showNum ? options.subtitle + '\n' + this.ActualValue : options.subtitle
    let scope = options.max / options.scope
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
    let detailfontWeight: string;
    if (options.detailTextStyle.fontWeight == "Light") {
      detailfontWeight = options.detailTextStyle.fontWeight + "er"
    } else {
      detailfontWeight = options.detailTextStyle.fontWeight
    }
    var option = {

      series: [{
        name: options.subtitle,
        type: 'gauge',
        radius: '100%',
        min: options.min,
        max: options.max,
        startAngle: options.startAngle,
        endAngle: options.endAngle,
        splitNumber: options.splitLineNum,
        axisLine: {
          show: true,
          lineStyle: {
            width: 100 - options.width,
            color: color
          },
        },
        splitLine: {
          show: options.showsplitLine,
          length: 100 - options.width,
          lineStyle: {
            type: "solid",
            color: options.splitLineColor,
            width: options.splitLineWidth,
          }
        },
        axisTick: { //刻度样式
          show: options.showaxisTick,
          splitNumber: options.axisTickNum, //分割线之间的刻度数
          lineStyle: {
            type: "solid",
            color: options.axisTickColor,
            width: options.axisTickWidth
          }
        },
        pointer: {//指针
          show: true,
          width: 5,
          length: "80%"
        },
        title: { //标题
          show: options.showSubTitle || options.showNum,
          offsetCenter: [0, "30%"], // x, y，单位px
          lineHeight:15,
          color: options.textStyle.color,
          fontSize: options.textStyle.fontSize.substr(0, 2),
          fontWeight: fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle
        },
        detail: {//明细
          show: options.showDetail,
          formatter: '{value}%',
          offsetCenter: ["0", "60%"],
          color: options.detailTextStyle.color,
          fontSize: options.detailTextStyle.fontSize.substr(0, 2),
          fontWeight: detailfontWeight,
          fontFamily: options.detailTextStyle.fontFamily,
          fontStyle: options.detailTextStyle.fontStyle

        },
        data: [{
          value: items,
          name: subtitle
        }]
      }]
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
    if (!options.properties.showSubTitle) {
      return ['subtitle'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}