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
  private host: any;
  private selectionManager: any;
  private selectionId: any
  static mockNumber = 123456;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);

    let chartDiv = wynbi.utils.createElement('div', 'chart-container');

    this.container = dom;
    this.host = host
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

    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
  }

  private selectEvent() {
    this.container.addEventListener("click", () => {
      this.selectionManager.clear();
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })
  
     //tooltip	跳转保留等
     this.container.addEventListener('mouseup', (params) => {
      document.oncontextmenu = function () { return false; };
      if (params.button === 2) {
        this.host.contextMenuService.show({
          position: {
            x: params.x,
            y: params.y,
          },
          menu: true
        }, 10)
        return;
      }else{
        this.host.contextMenuService.hide();	
      }
    })
  }

  public renderDigits(number: number) {
    let config = wynbi.utils.clone(this.options.digit);
    if (this.isMock) {
      config.animationDuration = 0;
    }

    this.digitsChart.render(number, config);
  };

  public render() {
    this.host.eventService.renderStart();
    this.container.style.opacity = this.isMock ? 0.3 : 1;

    let number = this.isMock ? Visual.mockNumber : this.number;

    this.renderDigits(number);
    this.host.eventService.renderFinish();
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
    const gradientColor = options.properties.gradientBackgroundColor
    let backgroundColor = options.properties.backgroundColor

    if (options.properties.animationMode === 'slide') {
      if (options.properties.gradientType === 'center') {
        backgroundColor = `-webkit-linear-gradient(top, ${bgColor} 0%, ${bgColor} 35%, ${gradientColor} 55%, ${bgColor} 55%, ${bgColor} 100%);`
      } else if (options.properties.gradientType === 'topToBottom') {
        backgroundColor = `-webkit-linear-gradient(top, ${gradientColor} 0%, ${bgColor} 25%, ${bgColor} 55%, ${bgColor} 75%, ${gradientColor} 100%);`
      }
    }

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
      plainData.data.map((item: any) => {

        const selectionId = this.host.selectionService.createSelectionId();
        selectionId
          .withDimension(plainData.profile.ActualValue.values[0], item)
        this.selectionId = selectionId

        return this.number = item[this.ActualValue];
      })
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
      const integerLength = options.properties.integerType === 'auto' && ['integerLength'] || []
      return ['animationDuration', 'gradientType', 'gradientBackgroundColor'].concat(integerLength);
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