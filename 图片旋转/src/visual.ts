import '../style/visual.less';

export default class Visual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.visualHost = host;
    this.properties = {
    };
    this.render();
  }
  public update(options: any) {
    this.properties = options.properties;
    this.render();
  };
  private render() {
    this.container.innerHTML = "";
    var maskImage = new Image();
    var that = this;
    const options = this.properties;
    maskImage.className = "A image"
    maskImage.onload = function () {
      that.container.appendChild(maskImage);
    };
    maskImage.src = options.maskImage || this.visualHost.assetsManager.getImage('testImg1')
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