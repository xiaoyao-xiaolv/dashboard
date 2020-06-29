import '../style/visual.less';
import '../style/flip.less';
import '../style/odometer.less';
import '../style/perfect-scrollbar.less';

const { wynbi } = require('./utils.ts')
const { wynbi: digitsChart } = require('./digitsChart.ts')

const { DigitsChart } = digitsChart
export default class Visual extends WynVisual {
  private container: any;
  private chartContainer: any;
  private digitsContainer: any;
  private digitsChart: any;
  private isMock: boolean;
  private number: number;
  private aggregation: any;
  private options: any;
  private ActualValue: any
  static mockNumber = 123456;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);

    let chartDiv = wynbi.utils.createElement('div', 'chart-container');

    this.container = dom;
    this.chartContainer = chartDiv;
    this.digitsContainer = wynbi.utils.createElement('div', 'digits-container');

    this.chartContainer.appendChild(this.digitsContainer);

    dom.appendChild(this.chartContainer);

    this.digitsChart = new DigitsChart(this.digitsContainer);


    this.isMock = true;
    this.number = 0;
    this.aggregation = null;
    this.options = {
      digit: {},
    };
  }

  public renderDigits(number: number) {
    let config = wynbi.utils.clone(this.options.digit);
    if (this.isMock) {
      config.animationDuration = 0;
    }
    this.digitsChart.render(number, config);
  };

  public render() {
    this.container.style.opacity = this.isMock ? 0.3 : 1;

    let number = this.isMock ? Visual.mockNumber : this.number;

    this.renderDigits(number);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const textStyle = options.properties.textStyle
    const font = {
      color: textStyle.color,
      size: textStyle.fontSize,
      family: textStyle.fontFamily,
      bold: textStyle.fontWeight === 'Normal' ? false : textStyle.fontWeight,
      italic: textStyle.fontStyle === 'Normal' ? false : textStyle.fontStyle,
    }
    const bgColor = options.properties.backgroundColor
    const gradientBackgroundColor = `-webkit-linear-gradient(top, ${bgColor} 0%, ${bgColor} 35%, ${font.color} 55%, ${bgColor} 55%, ${bgColor} 100%);`
    const backgroundColor = options.properties.gradientBackgroundColor ? gradientBackgroundColor : options.properties.backgroundColor


    const integerLength = options.properties.integerType === 'auto' ? 'auto' : options.properties.integerLength
    delete options.properties.backgroundColor
    delete options.properties.textStyle
    delete options.properties.integerLength

    this.options.digit = {
      ...options.properties,
      integerLength,
      backgroundColor,
      font,
    }

    const dataView = options.dataViews[0];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length) {
      const plainData = dataView.plain;

      this.ActualValue = plainData.profile.ActualValue.values[0].display;
      this.isMock = false
      plainData.data.map((item: any) => this.number = item[this.ActualValue])
    } else {
      this.isMock = true
    }
    this.render()
  }

  public onDestroy() {

  }

  public onResize() {
    let number = this.isMock ? Visual.mockNumber : this.number;
    this.digitsChart.resize(number);
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {

    if (options.properties.animationMode === 'flip') {
      return ['animationDuration'];
    }

    if (options.properties.integerType === 'auto') {
      return ['integerLength'];
    }

    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}