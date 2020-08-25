import '../style/visual.less';
// @ts-ignore
import AMap from 'AMap';

export default class Visual extends WynVisual {

  private container: HTMLDivElement;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    console.log('container');
    console.log(this.container);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    let map = new AMap.Map('visualDom', {
      resizeEnable: true,
      zoom:11,//级别
      center: [116.397428, 39.90923],//中心点坐标
    });
  }

  public onDestroy() {

  }

  public onResize() {
    // @ts-ignore
    this.update();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}