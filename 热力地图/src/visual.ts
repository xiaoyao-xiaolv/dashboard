import '../style/visual.less';
import BMap from 'BMap';
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private map: any;
  private items: any;
  private properties: any;
  private valueField: any;
  private ActualValue: any;
  private ContrastValue: any;
  static mockItems = 0.5;

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = require('echarts').init(dom);
    this.items = [];
    this.properties = {
      zoom: 14,
      mapStyle: 'style',
      styleValue: 'normal'

    };
    this.render();
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    console.log(dataView)
    this.items = [];
    if ((dataView &&
      dataView.plain.profile.values.values.length) || (dataView &&
        dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.ContrastValue.values.length)) {
      const plainData = dataView.plain;
      this.valueField = plainData.profile.values.values;
      this.ActualValue = plainData.profile.ActualValue.values;
      this.ContrastValue = plainData.profile.ContrastValue.values;
      if (this.valueField.length == 1) {
        this.items = plainData.data[0][this.valueField[0].display].toFixed(4);
      } else {
        this.items = (plainData.data[0][this.ActualValue[0].display] / plainData.data[0][this.ContrastValue[0].display]).toFixed(4);
      }
    }
    this.properties = options.properties;
    this.render();
  };

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;

    var option = {
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
        max: 5,
        dimension: 2,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: ['blue', 'blue', 'green', 'yellow', 'red']
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
    this.chart.setOption(option);
    this.map = this.chart.getModel().getComponent('bmap').getBMap();




  }
  // public abstract onDestroy(): void;
  public onResize() {
    this.chart.resize();
    this.render();
  }
  // 自定义属性可见性
  public getInspectorVisibilityState(properties: any): string[] {
    return null;
  }
  // 功能按钮可见性
  public getActionBarVisibilityState(updateOptions: any): string[] {
    return null;
  }
  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}