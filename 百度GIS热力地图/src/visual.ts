import '../style/visual.less';

export default class Visual extends WynVisual {
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
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