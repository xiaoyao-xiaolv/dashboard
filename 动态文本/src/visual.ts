import '../style/visual.less';

import $ from 'jquery';
(window as any).jQuery = $;

import '../src/jquery.liMarquee.js';

export default class Visual {
  private container: HTMLDivElement;
  private items: any;
  private properties: any;

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.container.classList.add('visual-dynamic-text');
    this.items = [];
    this.properties = {
      custom: true,
      customText: '这是一个自定义文本',
      scrollDirection: 'left',
      scrollAmount: 50,
      textStyle: {
        color: '#fff',
        fontSize: '10pt',
        fontFamily: '微软雅黑',
        fontStyle: 'Normal',
        fontWeight: 'Normal'
      }
    };
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.dimensions.values.length) {
      const plainData = dataView.plain;
      let dimensions = plainData.profile.dimensions.values;
      this.items = plainData.data.map(function (item) {
        return item[dimensions[0].display];
      });
    }
    this.properties = options.properties;
    this.render();
  };

  private render() {

    this.container.innerHTML = "";
    const options = this.properties;
    const items = options.custom ? [options.customText] : this.items;
    let dowebok: any = document.createElement("div");
    for(let i = 0;i<items.length;i++){
      let p1: any = document.createElement("li");
      p1.innerHTML = items[i];
      p1.style.color = options.textStyle.color;
      p1.style.fontSize = options.textStyle.fontSize;
      p1.style.fontFamily = options.textStyle.fontFamily;
      p1.style.fontStyle = options.textStyle.fontStyle;
      p1.style.fontWeight = options.textStyle.fontWeight;
      dowebok.appendChild(p1);
    }

    this.container.appendChild(dowebok);
    $(dowebok).liMarquee({
      direction: options.scrollDirection,
      scrollamount: options.scrollAmount
    });
  }

  // // 自适应大小
  // private fitSize() {
  //   this.chart.resize();
  // }

  // public abstract onDestroy(): void;
  // public onResize() {
  //   this.fitSize();
  //   this.render();
  // }

  // 自定义属性可见性
  public getInspectorHiddenState(updateOptions: any): string[] {
    if (!updateOptions.properties.custom) {
      return ['customText'];
    }
    return null;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }
  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}