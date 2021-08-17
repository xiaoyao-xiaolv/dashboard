import '../style/visual.less';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private iFrame: HTMLIFrameElement;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom
    var ifrm = document.createElement("iframe");
    
    this.iFrame = ifrm;
    this.iFrame.src = "https://www.grapecity.com.cn/";
    ifrm.setAttribute("style", "width:100%;height:100%");
    dom.setAttribute("style","overflow:hidden");
    dom.appendChild(ifrm);
    
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    //console.log(options);
    const dataView = options.dataViews[0];
    if(dataView && dataView.plain.data.length>0 && dataView.plain.profile.linkAddress.values.length)
    {
      this.iFrame.src = dataView.plain.data[0][dataView.plain.profile.linkAddress.values[0].display].toString();
    }
  }

  public onResize() {
    
  }

  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}