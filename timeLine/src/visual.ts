import '../style/visual.less';
import '../style/timeline.less';
const {timeline} = require('./timeline');
import $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "下达", state: 1, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "确认", state: 1, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "出厂", state: 2, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "预约", state: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "到厂", state: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "入仓", state: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "完成", state: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'}
  ];
  // private static mockItems = ['下达', '确认', '出厂', '预约', '到厂' , '入仓' ,'完成']
  private root: JQuery<HTMLElement>;
  private items = [];

  private isMock = true;
  private isFirstRender: boolean;
  private options: any
  private visualHost: any;
  private renderTimer: any;
  private static width = 800;
  private static height = 500;
  private static elementWidth = 200;
  private static elementHeight = 100;

  private isDimensions: boolean;
  private isValue: boolean;
  private isContrast: boolean;
  private isRate: boolean;

  private dimensions: any;
  private value: any;
  private contrast: any;
  private valueFormat: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.root = $(dom);
    this.isMock = true;
    this.visualHost = host;
    this.isFirstRender = true;
    
  }


  public update(updateOptions: VisualNS.IVisualUpdateOptions) {

    const options = updateOptions;
    const dataView = options.dataViews[0];


    this.isMock = !(dataView && dataView.plain.profile.dimensions.values.length);
    const plainData: any = this.isMock ? {} : dataView.plain;

    this.isValue = !!(dataView && dataView.plain.profile.values.values.length);
    this.isContrast = !!(dataView && dataView.plain.profile.contrast.values.length);
    this.isRate = this.isValue && this.isContrast

    if (this.isMock) {
      this.dimensions = 'name';
      this.value = '实际值'
      this.contrast = '对比值'
      this.items = Visual.mockItems
    } else {
      this.dimensions = !this.isMock && plainData.profile.dimensions.values[0].display || '';
      this.value = this.isValue && plainData.profile.values.values[0].display || '';
      this.contrast = this.isContrast && plainData.profile.contrast.values[0].display || '';
      this.items = plainData.data;
      this.valueFormat = plainData.profile.values.options.valueFormat;
    }

    this.options = options.properties;

    if (!this.options.dataFormat) {
      this.options.dataFormat = `${this.dimensions}: ${this.value}`;
    }

    if (!this.options.totalDataFormat) {
      this.options.totalDataFormat = `汇总: ${this.value}`;
    }

    this.render();
  }
  
  public _initHtml = (_options: any) => {
    let _timeline = $('<div class="timeline">').appendTo(this.root),
    _timeline__wrap = $('<div class="timeline__wrap">').appendTo(_timeline),
    _timeline__items = $('<div class="timeline__items">').appendTo(_timeline__wrap);
    

    // custom label text
    const timeline__content__fontStyle = {
      ..._options.labelTextStyle,
      fontSize: parseInt(_options.labelTextStyle.fontSize),
      backgroundColor: _options.labelBg,
      border: `1px solid ${_options.labelBg}`
    };

    [0,1,2,3,4,5,6,].forEach(element => {
      const _timeline__item = $('<div class="timeline__item">').appendTo(_timeline__items);
      const _timeline__content = $('<div class="timeline__content">').appendTo(_timeline__item);

      _timeline__content.text(Visual.mockItems[element].name);
      _timeline__content.css(timeline__content__fontStyle);
    });
    
    // horizontal timeline content
    $(`<style>.timeline--horizontal .timeline__item .timeline__content::before{border-top: 12px solid ${_options.labelBg};}</style>`).appendTo(document.head)
    $(`<style>.timeline--horizontal .timeline__item .timeline__content::after{border-top: 10px solid ${_options.labelBg};}</style>`).appendTo(document.head)
    // horizontal timeline bottom content
    $(`<style>.timeline--horizontal .timeline__item--bottom .timeline__content::before{border-bottom: 12px solid ${_options.labelBg};border-top: none; }</style>`).appendTo(document.head)
    $(`<style>.timeline--horizontal .timeline__item--bottom .timeline__content::after{border-bottom: 10px solid ${_options.labelBg};border-top: none;}</style>`).appendTo(document.head)
    // mobile timeline content
    $(`<style>.timeline--mobile .timeline__item .timeline__content::before {border-right: 12px solid ${_options.labelBg};}</style>`).appendTo(document.head)
    $(`<style>.timeline--mobile .timeline__item .timeline__content::after  {border-right: 10px solid ${_options.labelBg};}</style>`).appendTo(document.head)
        
    timeline(document.querySelectorAll('.timeline'), {
      forceVerticalMode: _options.timeLineDirection === 'auto' ? 'auto' : (_options.timeLineDirection === 'horizontal'? 10: 10000),
      mode: _options.timeLineDirection === 'auto'? 'horizontal' : _options.timeLineDirection,
      visibleItems: _options.visibleItems,
      verticalStartPosition: 'right',
      verticalTrigger: '15%',
    });

    // custom vertical line color
    $(`<style>.timeline:not(.timeline--horizontal)::before{background-color: ${_options.timeLineBg};}</style>`).appendTo(document.head)
    // custom horizontal line color
    $('.timeline-divider').css('backgroundColor', `${_options.timeLineBg}`);
    // custom time line point color
    $(`<style>.timeline__item::after {background-color: ${_options.timeLinePointColor}; border: 4px solid ${_options.timeLinePointBg}}</style>`).appendTo(document.head)
  };

  public render() {

    this.root.html('').css({'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'});
    const options = this.options
    this._initHtml(options);
    // this.resize();
  }



  public onDestroy() {
    if (this.renderTimer != null) {
      cancelAnimationFrame(this.renderTimer);
      this.renderTimer = null;
    }
  }

  public onResize() {
    // this.resize();
    this.render();
  }

  private resize() {
    var width = Visual.width,
      height = Visual.height,
      winWidth = $(window).width(),
      winHeight = $(window).height(),
      xZoom = winWidth / width,
      yZoom = winHeight / height,
      zoom = Math.min(xZoom, yZoom);
    const ua = navigator.userAgent;
    if (ua.indexOf("Firefox") != -1) {
      this.root.css({ 'transform': `scale(${zoom}) translateY(-50%)`, 'transformOrigin': 'top left' });
    } else {
      this.root.css({ "zoom": zoom });
    }

  };

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<any> = [];

    // detail 
    // if (options.properties.rotateType === 'continuous') {
    //   hiddenOptions = hiddenOptions.concat(['stopSpeed'])
    // }

  
    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}

function forEach(arg0: (element: any) => void) {
  throw new Error('Function not implemented.');
}
