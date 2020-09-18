import '../style/visual.less';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;
  private items: any;
  static mockItems = 10000;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.visualHost = host;
    this.items = [];
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    if (dataView) {
      const plainData = dataView.plain;
      let values = plainData.profile.values.values[0].display;
      this.items = [plainData.data[0][values]]
    }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.container.innerHTML = "";
    const isMock = !this.items.length;
    this.container.style.opacity = isMock ? '0.3' : '1';
    let items = isMock ? Visual.mockItems : this.items;
    var maskImage = new Image();
    const options = this.properties;
    maskImage.className = "maskimage"
    maskImage.onload = () => {
      this.container.appendChild(maskImage);
    };
    let interval = JSON.parse(options.Interval)
    if (items >= interval[1].gte) {
      if (items >= interval[0].gte) {
        maskImage.src = this.visualHost.assetsManager.getImage(interval[0].color + 'Img');
      } else {
        maskImage.src = this.visualHost.assetsManager.getImage(interval[1].color + 'Img');
      }
    } else {
      maskImage.src = this.visualHost.assetsManager.getImage(interval[2].color + 'Img');
    }
  }

  public onDestroy() {

  }

  public onResize() {
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}