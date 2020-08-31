import '../style/visual.less';
import * as echarts from 'echarts';
import "echarts-amap";
// @ts-ignore
import mockPoints from './mockPoints.ts';

let loaded = false;
let ins;
(window as any).__init = function() {
  loaded = true;
  if(ins) {
    ins.init();
  }
}

export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private boundPoints: any;
  private isMock: boolean;

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.properties = {
      colorInRange: ['white', 'blue', 'green', 'yellow', 'red']
    };
    ins = this;
  }

  init() {
    this.chart = echarts.init(this.container);
    this.render();
  }

  public update(options: any) {
    console.log(options)
    this.properties = options.properties;
    this.isMock = !options.dataViews.length;
    if (!this.isMock) {
      let dataView = options.dataViews[0].plain;
      let lgLabel = dataView.profile.longitude.values[0].display;
      let laLabel = dataView.profile.latitude.values[0].display;
      let boundData = dataView.data;
      this.boundPoints = boundData.map((data) => {
        return [data[lgLabel], data[laLabel], 1]
      })
    }
    this.render();
  };

  private render() {
    if (!loaded) {
      return;
    }
    this.chart.clear();
    let points = this.isMock ? mockPoints : this.boundPoints;
    this.container.style.opacity = this.isMock  ? '0.5' : '1';
    let options = this.properties;
    console.log(this.properties);
    let option = {
      amap: {
        center: [options.centerLongitude, options.centerLatitude],
        zoomEnable: options.zoomEnable,
        zoom: options.zoom,
        mapStyle: `amap://styles/${options.mapStyle}`,
      },
      visualMap: {
        show: false,
        top: 'top',
        min: 0,
        max: options.visualMapMax,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: options.colorInRange
        }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'amap',
        data: points,
        pointSize: options.pointSize,
        blurSize: options.blurSize
      }]
    };
    this.chart.setOption(option);
    // this.map = this.chart.getModel().getComponent('amap').getAMap();
  }

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