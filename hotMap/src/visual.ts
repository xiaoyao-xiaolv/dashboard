
import '../style/visual.less';
import mockData from './mock.json';

import echarts from 'echarts';
// import * as bmap from 'bmap'
// require('echarts/extension/bmap/bmap')

export default class Visual extends WynVisual {
  private container: HTMLDivElement
  private chart: any
  private map: any
  private isMock: Boolean
  private items: []
  private maxNum: any
  private aggregation: any
  private options: {}
  private properties: any

  static mockItems = [].concat.apply([], mockData.map(function (track) {
    return track.map(function (seg) {
      return seg.coord.concat([Math.floor(Math.random() * (5)) + 1])
    })
  }))

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.properties = options.properties;
    this.chart = echarts.init(dom)
    this.map = ''
    this.isMock = true
    this.render()
  }

  public render() {

    this.chart.clear()
    this.container.style.opacity = this.isMock ? '0.3' : '1'
    var items = this.isMock ? Visual.mockItems : this.items
    let options = this.properties;


    var maxNumber = this.isMock ? 15 : this.maxNum * 3

    const option = {
      animation: false,
      bmap: {
        center: [120.14066322374, 30.250018034923],
        zoom: options.zoom,
        roam: true,
      },
      visualMap: {
        type: 'continuous',
        show: false,
        top: 'top',
        min: 0,
        max: maxNumber,
        dimension: 2,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: options.color
        }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'bmap',
        data: items,
        pointSize: 5,
        blurSize: 6
      }]
    }
    this.chart.setOption(option)

    this.map = this.chart.getModel().getComponent('bmap').getBMap()

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    this.properties = options.properties;
  }

  public onDestroy() {

  }

  public onResize() {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}