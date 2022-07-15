import '../style/visual.less';
import * as echarts from 'echarts';
import { registerBmap } from 'echarts-bmap';
// @ts-ignore
import mockPoints from './mockPoints.ts';

export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private boundPoints: any;
  private isMock: boolean;
  private shadowDiv: any;

  constructor(dom: HTMLDivElement, host: any) {
    registerBmap(echarts);
    this.container = dom;
    this.chart = echarts.init(this.container);
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
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
    this.shadowDiv.style.cssText= '';
    this.chart.clear();
    let points = this.isMock ? mockPoints : this.boundPoints;
    let options = this.properties;
    let colorInRange = this.isMock ? ['white', 'blue', 'green', 'yellow', 'red'] : options.colorInRange;
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
    this.container.style.opacity = this.isMock  ? '0.5' : '1';
    let option = {
      bmap: {
        center: [options.centerLongitude, options.centerLatitude],
        roam: options.zoomEnable,
        zoom: options.zoom,
        mapStyleV2: {styleId : "a845146ba74d65c644992847fe911b47"},
      },
      visualMap: {
        show: false,
        top: 'top',
        min: 0,
        max: options.visualMapMax,
        seriesIndex: 0,
        calculable: true,
        inRange: {
          color: colorInRange
        }
      },
      series: [{
        type: 'heatmap',
        coordinateSystem: 'bmap',
        data: points,
        pointSize: options.pointSize,
        blurSize: options.blurSize
      }]
    };
    this.chart.setOption(option);
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
  }
}