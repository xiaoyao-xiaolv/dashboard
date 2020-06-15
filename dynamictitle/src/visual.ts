import '../style/visual.less';
import '../style/animate.less';

export default class Visual {
  private container: HTMLDivElement;
  private items: any;
  private properties: any;

  constructor(dom: HTMLDivElement, host: any, options: any) {
    
    console.log(options, '======init options')
    this.container = dom;
    this.items = [];
    this.properties = {
      custom: true,
      customText: '这是一个自定义标题',
      customTextPosition: 'center',
      textStyle: {
        color: 'red',
        fontSize: '10pt',
        fontFamily: '微软雅黑',
        fontStyle: 'Normal',
        fontWeight: 'Normal'
      }
    };
    this.render();
  }

  public update(options: any) {
    console.log(options, 'update options')
    this.properties = options.properties;;

    this.render();
  }

  public render () {
    this.container.innerHTML = "";
    const options = this.properties;
    const items = options.custom ? [options.customText] : this.items;
    let dowebok: any = document.createElement("div");
    for(let i = 0;i<items.length;i++){
      let p1: any = document.createElement("h1");
      p1.innerHTML = items[i];
      p1.style.color = options.textStyle.color;
      p1.style.fontSize = options.textStyle.fontSize;
      p1.style.fontFamily = options.textStyle.fontFamily;
      p1.style.fontStyle = options.textStyle.fontStyle;
      p1.style.fontWeight = options.textStyle.fontWeight;

      p1.style.textAlign = options.customTextPosition
      // add  animate class name
      p1.className = 'animate__animated' 
      p1.classList.add('animate__bounce', 'animate__repeat-5')
      dowebok.appendChild(p1);
    }

    this.container.appendChild(dowebok);
  }

  public onDestroy() {

  }

  public onResize() {

  }

  public getInspectorHiddenState(options: any): string[] {
    return null;
  }

  public getActionBarHiddenState(options: any): string[] {
    return null;
  }
}