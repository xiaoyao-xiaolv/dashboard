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

    var div = document.createElement('div');
    div.id = "he-plugin-standard";

    var script1 = document.createElement('script');
    script1.type = "text/javascript";
    var WIDGET = {
      CONFIG: {
        "layout": 1,
        "width": "450",
        "height": "150",
        "background": 1,
        "dataColor": "FFFFFF",
        "borderRadius": 5,
        "key": "e1b995f9292e4303ab28f145ffb6a95d"
      }
    }
    script1.innerHTML = "WIDGET="+JSON.stringify(WIDGET);
    var script2 = document.createElement('script');
    script2.type = "text/javascript";
    script2.src = "https://widget.heweather.net/standard/static/js/he-standard-common.js?v=1.1";
    this.container.appendChild(div);
    this.container.appendChild(script1);
    this.container.appendChild(script2);
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