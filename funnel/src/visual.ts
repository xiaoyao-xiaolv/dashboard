import '../style/visual.less';
import * as D3Funnel from 'd3-funnel';
import _ = require('lodash')

let isTooltipModelShown = false;
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  private host: any;
  private selectionManager: any;
  private selection: any[] = [];
  private _svg: SVGSVGElement;
  private svg: any
  private dimension: string
  private ActualValue: string
  private x: number
  private y: number

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
    this.host = host;


    let dowebok: any = document.createElement("div");
    dowebok.setAttribute('id', 'funnel-container')

    this.container.appendChild(dowebok);
    this.chart = new D3Funnel('#funnel-container');

    this.selectionManager = host.selectionService.createSelectionManager();
  }


  public getNodeSelectionId = (label: any, value: any) => {
    const { selectionId } = this.items.find((item: any) => item.label === label && item.value === value)

    if (!this.selectionManager.contains(selectionId)) {
      this.selectionManager.select(selectionId, true);
    } else {
      this.selectionManager.clear(selectionId);
    }
    return selectionId
  }

  private clickHandler = (node: any) => {
    this.host.toolTipService.show({
      position: {
        x: this.x,
        y: this.y,
      },
      selectionId: this.getNodeSelectionId(node.label.raw, node.value),
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    });
  }

  public render() {
    this.host.eventService.renderStart();
    const options = this.properties;
    const isMock = !this.items.length;
    const data = isMock ? Visual.mockItems : this.items;

    const option = {
      chart: {
        bottomWidth: 1 / options.bottomWidth,
        bottomPinch: options.bottomPinch,
        inverted: options.inverted,
        curve: {
          enabled: options.curve,
          height: options.curveHeight
        },
        animate: options.animateEnabled ? options.animateTime : 0
      },
      block: {
        dynamicHeight: options.dynamicHeight,
        minHeight: 15,
        barOverlay: options.barOverlay,
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
      },
      events: {
        click: {
          block: (e) => {
            setTimeout(() => {
              this.clickHandler(e)
            })
          }
        }
      }
    };

    document.addEventListener('click', (e) => {
      this.x = e.clientX
      this.y = e.clientY
    })

    this.chart.draw(data, option);

    this.host.eventService.renderFinish();
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      this.dimension = plainData.profile.dimension.values[0].display;
      this.ActualValue = plainData.profile.ActualValue.values[0].display;

      const items = plainData.data.reduce((result: any, item: any, i: number) => {
        if (item[this.dimension] && item[this.ActualValue]) {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId
            .withDimension(plainData.profile.dimension.values[0], item)
            .withDimension(plainData.profile.ActualValue.values[0], item);
          result.push({
            label: item[this.dimension],
            value: item[this.ActualValue],
            selectionId,
          });
        }
        return result;
      }, []);
      this.items = items;
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