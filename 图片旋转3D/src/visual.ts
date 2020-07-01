import '../style/visual.less';

export default class Visual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.visualHost = host;
    this.properties = {
      X: 40,
      Y: 20,
      fps:60
    };
  }
  public update(options: any) {
    this.properties = options.properties;
    this.render();
  };
  private render() {
    this.container.innerHTML = "";
    cancelAnimationFrame(raf_id);
    var maskImage = new Image();
    var that = this;
    const options = this.properties;
    maskImage.className = "A image";
    maskImage.onload = function () {
      that.container.appendChild(maskImage);
    };
    maskImage.src = options.maskImage || this.visualHost.assetsManager.getImage('testImg1')
    var raf_id = null;
    var fps = options.fps;
    var interval = 1000 / fps;
    //当前执行时间
    var nowTime = 0;
    //记录每次动画执行结束的时间
    var lastTime = Date.now();
    //我们自己定义的动画时间差值
    var diffTime = 0;
    (function animloop(time) {
      //记录当前时间
      nowTime = Date.now()
      diffTime = nowTime - lastTime
      // 当前时间-上次执行时间如果大于diffTime，那么执行动画，并更新上次执行时间
      if (diffTime > interval) {
        lastTime = nowTime - (diffTime % interval);
        let transform = "transform:rotateX(" + options.X + "deg) rotateY(" + options.Y + "deg) rotateZ(" + options.Z + "deg);";
        maskImage.setAttribute("style", transform);
        if (options.Z < 360) {
          options.Z++;
        } else {
          options.Z = -360;
        }
      }
      raf_id = requestAnimationFrame(animloop);
    })();
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