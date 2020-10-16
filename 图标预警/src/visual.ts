import '../style/visual.less';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;
  private items: any;
  static mockItems = [10000];
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

    for (let index = 0; index < 5; index++) {
      let name = 'Interval' + (index + 1);
      let flag = false;
      let str = options[name].split(",");
      if (str.length-1) {
        let left = str[0].length;
        let right = str[1].length;
        if (left - 1) {
          let leftValue = str[0].substring(1);
          flag = str[0].substring(0, 1) === "[" ? (items[0] >= leftValue) : (items[0] > leftValue);
        }
        if (right - 1) {
          let rightValue = str[1].substring(0, str[1].length - 1);
          flag = str[1].substring(right - 1, right) === "]" ? (items[0] <= rightValue) : (items[0] < rightValue);
        }
      }
      if (flag) {
        let name = 'Image' + (index + 1);
        maskImage.src = options[name] || this.visualHost.assetsManager.getImage(name)
        break;
      }
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