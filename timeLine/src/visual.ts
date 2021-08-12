import '../style/visual.less';
import '../style/timeline.less';
const {timeline} = require('./timeline');
import $ from 'jquery';

export default class Visual extends WynVisual {
  // private static mockItems = [
  //   { name: "Dept. 1", '实际值': 100, '对比值': 100 },
  //   { name: "Dept. 2", '实际值': 153, '对比值': 95 },
  //   { name: "Dept. 3", '实际值': 94, '对比值': 10 },
  //   { name: "Dept. 4", '实际值': 60, '对比值': 80 },
  //   { name: "Dept. 5", '实际值': 65, '对比值': 52 },
  //   { name: "Dept. 6", '实际值': 55, '对比值': 62 },
  //   { name: "Dept. 7", '实际值': 120, '对比值': 71 },
  //   { name: "Dept. 8", '实际值': 52, '对比值': 66 },
  // ];
  private static mockItems = ['下达', '确认', '出厂', '预约', '到厂' , '入仓' ,'完成']
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

    [0,1,2,3,4,5,6,].forEach(element => {
      const _timeline__item = $('<div class="timeline__item">').appendTo(_timeline__items);
      const _timeline__content = $('<div class="timeline__content">').appendTo(_timeline__item);
      _timeline__content.text(Visual.mockItems[element])
    });
  
    timeline(document.querySelectorAll('.timeline'), {
      forceVerticalMode: _options.timeLineDirection,
      mode: 'horizontal',
      visibleItems: _options.visibleItems
    });
  };

  public render() {

    this.root.html('').css({'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'});
    const options = this.options
    this._initHtml(options);

     
    this.resize();
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
