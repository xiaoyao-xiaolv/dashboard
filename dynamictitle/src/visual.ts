import '../style/visual.less';
import '../style/animate.less';

export default class Visual {
  private container: HTMLDivElement;
  private items: any;
  private properties: any;

  constructor(dom: HTMLDivElement, host: any, options: any) {
    this.container = dom;
    this.items = [];
    this.properties = {
      custom: true,
      customText: '请输入标题',
      textStyle: {
        fontSize: '20pt',
        fontFamily:'微软雅黑',
        fontStyle: 'Normal',
        fontWeight: 'Normal'
      },
      customAnimate: false,
      customAnimateName: 'animate__bounceIn',
      customAnimateDelay: '0s',
      customAnimateRepeat: 'animate__repeat-1'
    };
  }

  public update(options: any) {
    this.properties = options.properties;;

    this.render();
  }

  public render () {
    this.container.innerHTML = "";
    const options = this.properties;
    const items = options.customText
    let dowebok: any = document.createElement("div");
    dowebok.className = 'hidden-scrollbar'
    let p1: any = document.createElement("h1");
    p1.innerHTML = items;
    p1.style.color = options.textStyle.color;
    p1.style.fontSize = options.textStyle.fontSize;

    p1.style.fontFamily = options.textStyle.fontFamily;
    p1.style.fontStyle = options.textStyle.fontStyle;
    p1.style.fontWeight = options.textStyle.fontWeight;

    // add  animate class name

    if (options.customAnimate) {
      let addAnimateName = 'animate__';
      
      if(options.customAnimateName === 'flip') {
        addAnimateName =addAnimateName + options.customAnimateName + options.customAnimateFlipDirection
      }else if (options.customAnimateName === 'rotateIn') {
        addAnimateName =addAnimateName + options.customAnimateName + options.customAnimateRotateDirection
      } else {
        addAnimateName = addAnimateName + options.customAnimateName + options.customAnimateDirection
      }
      
      const addAnimateDelay = 'animate__delay-' + options.customAnimateDelay;
      const addAnimateRepeat = 'animate__' + options.customAnimateRepeat;
     
      p1.classList.add('animate__animated', addAnimateName, addAnimateDelay, addAnimateRepeat)
      p1.style.setProperty('--animate-duration', `${options.customAnimateDuration}s`);
    }
    dowebok.appendChild(p1);
    
    this.container.appendChild(dowebok);
  }

  public onDestroy() {

  }

  public onResize() {

  }

  public getInspectorHiddenState(updateOptions: any): string[] {
    // control animate display
    if (!updateOptions.properties.customAnimate) {
      return ['customAnimateName', 'customAnimateDirection', 'customAnimateDuration','customAnimateRotateDirection', 'customAnimateFlipDirection', 'customAnimateDelay', 'customAnimateRepeat'];
    }
    
    if (updateOptions.properties.customAnimateName === 'flip') {
      return ['customAnimateDirection', 'customAnimateRotateDirection'];
    }

    if (updateOptions.properties.customAnimateName === 'rotateIn') {
      return ['customAnimateDirection', 'customAnimateFlipDirection'];
    }
    
    if (updateOptions.properties.customAnimateName !== 'rotateIn' || updateOptions.properties.customAnimateName !== 'flip') {
      return ['customAnimateRotateDirection', 'customAnimateFlipDirection'];
    }

    return null;
  }

  public getActionBarHiddenState(options: any): string[] {
    return null;
  }
}