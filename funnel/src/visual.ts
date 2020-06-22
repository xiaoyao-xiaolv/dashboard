import '../style/visual.less';
import * as D3Funnel from 'd3-funnel';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;

  static mockItems = [
    { label: 'Inquiries', value: 5000 },
    { label: 'Applicants', value: 2500 },
    { label: 'Admits', value: 500 },
    { label: 'Deposits', value: 200 }
  ]

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.properties = {
      bottomWidth: 3,
      bottomPinch: 0,
      inverted: false,
      textStyle: {
        fontSize: '14px',
        fontFamily: '微软雅黑',
        color: '#fff'
      },
    };

    let dowebok: any = document.createElement("div");
    dowebok.setAttribute('id', 'funnel-container')
    this.container.appendChild(dowebok);
    this.chart = new D3Funnel('#funnel-container');


  }

  public render() {
    const options = this.properties;
    const data = this.items.length ? this.items : Visual.mockItems;

    const option = {
      chart: {
        bottomWidth: 1 / options.bottomWidth, // 底部宽度
        bottomPinch: options.bottomPinch, // 脖子长度, 数据的长度
        inverted: options.inverted, //是否 反转
        curve: {
          enabled: options.curve, // 3D
          height: options.curveHeight // 3D 的倾斜度
        },
        animate: options.animateEnabled ? options.animateTime : 0
      },
      block: {
        dynamicHeight: options.dynamicHeight,
        minHeight: 15,
        barOverlay: options.barOverlay, //侧影
        highlight: true,
        fill: {
          type: options.fillType
        }
      },
      label: {
        enabled: options.labelEnabled,
        fontFamily: options.textStyle.fontFamily,
        fontSize: options.textStyle.fontSize,
        fill: options.textStyle.color,
        format: '{l}: ${v}'
      }
    };

    this.chart.draw(data, option);

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      const dimension = plainData.profile.dimension.values[0].display;
      const ActualValue = plainData.profile.ActualValue.values[0].display;
      this.items = plainData.data.map((item: any) => {
        let label = item[dimension]
        let value = item[ActualValue]
        return { label, value }
      })
    }

    this.properties = options.properties;
    this.render()
  }

  public onDestroy() {

  }

  public onResize() {
    this.render()
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.curve) {
      return ['curveHeight'];
    }

    if (!options.properties.animateEnabled) {
      return ['animateTime'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}