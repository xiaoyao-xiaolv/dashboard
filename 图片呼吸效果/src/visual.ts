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
  }
  public update(options: any) {
    this.properties = options.properties;
    this.render();
  };
  private render() {
    this.container.innerHTML = "";
    var maskImage1 = new Image();
    var maskImage2 = new Image();
    const options = this.properties;
    var that = this;
    maskImage1.className = "A image"
    maskImage1.onload = function () {
      that.container.appendChild(maskImage1);
    };
    maskImage1.src = options.Image1 || this.visualHost.assetsManager.getImage('testImg1');

    maskImage2.className = "B image"
    maskImage2.onload = function () {
      that.container.appendChild(maskImage2);
    };
    maskImage2.src = options.Image2 || this.visualHost.assetsManager.getImage('testImg2');
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