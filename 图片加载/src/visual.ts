import '../style/visual.less';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;
  private imgUrl: any;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.visualHost = host;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.imgUrl = '';
    console.log(dataView)
    if (dataView &&
      dataView.plain.profile.imgUrl.values.length) {
      const plainData = dataView.plain;
      let imgUrlName = plainData.profile.imgUrl.values[0].display;
      this.imgUrl = plainData.data[0][imgUrlName]
    }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.container.innerHTML = "";
    const isMock = !this.imgUrl.length;
    this.container.style.opacity = isMock ? '0.3' : '1';
    var maskImage = new Image();
    const options = this.properties;
    var that = this;
    maskImage.className = "maskimage"
    maskImage.onload = function () {
      that.container.appendChild(maskImage);
    };
    maskImage.src = this.imgUrl || this.visualHost.assetsManager.getImage('mockImg');

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