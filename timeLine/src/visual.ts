import '../style/visual.less';
import '../style/timeline.less';
import '../fonts/iconfont.css';
const {timeline} = require('./timeline');
import $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "下达", value: 1, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "确认", value: 1, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "出厂", value: 2, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "预约", value: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "到厂", value: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "入仓", value: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'},
    { name: "完成", value: 0, image:'../assets/icon.png' , describe: '这个可能是一段文本'}
  ];
  private root: JQuery<HTMLElement>;
  private items = [];

  private isMock = true;
  private isFirstRender: boolean;
  private options: any
  private visualHost: any;
  private renderTimer: any;
  private static width = 600;
  private static height = 100;

  private isName: boolean;
  private isValue: boolean;
  private isImage: boolean;
  private isDescribe: boolean;

  private name: any;
  private value: any;
  private image: any;
  private describe: any;

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
    this.isMock = !(dataView && dataView.plain.profile.name.values.length);
    const plainData: any = this.isMock ? {} : dataView.plain;
    if (!this.isMock) {
      this.items = plainData.data;
    }
    this.isValue = !!(dataView && dataView.plain.profile.value.values.length);
    this.isImage = !!(dataView && dataView.plain.profile.image.values.length);
    this.isDescribe = !!(dataView && dataView.plain.profile.describe.values.length);

    if (this.isMock) {
      this.name = 'name';
      this.value = 'value'
      this.image = 'image'
      this.describe= 'describes'
      this.items = Visual.mockItems
    } else {
      this.name = !this.isMock && plainData.profile.name.values[0].display || '';
      this.value = this.isValue && plainData.profile.value.values[0].display || '';
      this.image = this.isImage && plainData.profile.image.values[0].display || '';
      this.describe = this.isDescribe && plainData.profile.describe.values[0].display || '';
      this.items = plainData.data;
      // this.valueFormat = plainData.profile.values.options.valueFormat;
    }

    this.options = options.properties;
    this.render();
  }
  
  public _initHtml = (_options: any, timeLineData: any) => {
    let _timeline = $('<div class="timeline">').appendTo(this.root),
    _timeline__wrap = $('<div class="timeline__wrap">').appendTo(_timeline),
    _timeline__items = $('<div class="timeline__items">').appendTo(_timeline__wrap);
    

    // custom label text
    const { useToPoint, timeLinePointColor: pointBg, useToLabel, labelBg, timeLineCollection } = _options;
    const _isFormatList = timeLineCollection.length;
    const _formatList = timeLineCollection[0];
    const _useToLabel = useToLabel && _isFormatList;
    const _labelBorderColor = _useToLabel ? (_formatList.formatImage ? 'transparent' : _formatList.formatColor) : labelBg;
    const _useToPoint = useToPoint && _isFormatList;
    _formatList.formatColor = _formatList.formatColor || '#FFF';
    const _useToPointValue = _isFormatList ? _formatList.formatValue : '';
    const _usePointBg = _useToPoint ? (_formatList.formatImage ? `url(${_formatList.formatImage}) center center /cover no-repeat`: _formatList.formatColor): pointBg;
   
    const timeline__content__fontStyle = {
      border: `1px solid ${_labelBorderColor}`,
      background: _useToLabel ? `${_formatList.formatImage ? `url(${_formatList.formatImage}) center center /cover no-repeat`: _formatList.formatColor } ` : labelBg,
    };

    const hiddenLabel = {
      opacity: 0
    }

    const _timeline__title__style = {
      ..._options.labelTextStyle,
      fontSize: _options.labelTextStyle.fontSize,
      textAlign:  _options.labelTitleAlign,
    }

    timeLineData.map((_element, index) => {
        const _timeline__item = $(`<div class="timeline__item timeline__item__${index} iconfont icon-approve">`)
          .appendTo(_timeline__items);
        const _timeline__content = $('<div class="timeline__content">')
          .appendTo(_timeline__item);
        const _timeline__content_text = $('<div>')
        $(_timeline__content)
          .append(_timeline__content_text);
        const _timeline__title = $('<h2 class="timeline__title">')
        const _timeline__describe = $('<p class="timeline__describe">')
        //  show label
        if (_options.showLabel === 'none') {
          _timeline__content.css(hiddenLabel);
        } else if (_options.showLabel === 'content' && this.isDescribe) {
          $(_timeline__content_text).addClass('timeline__content_text')
          $(_timeline__content_text).append(_timeline__title, _timeline__describe);
          _timeline__title.text(this.items[index][this.name]);
          _timeline__describe.text(this.items[index][this.describe]);
          
        } else {
          $(_timeline__content_text).addClass('timeline__content_text_title')
          $(_timeline__content_text).append(_timeline__title);
          _timeline__title.text(this.items[index][this.name]);
        }
        // custom label
        _timeline__content.css(timeline__content__fontStyle);
        _timeline__title.css(_timeline__title__style);
        _timeline__describe.css(_options.labelDescribeStyle);
        
        const _pointColorIndex = _element[this.value] ? (_element[this.value] <= 2 ? _element[this.value] : 2) : 0;
        let _formatPoint =_useToPoint && _element[this.name] === _formatList.formatValue;
        // custom point
        $(`<style>.timeline__item__${index}::after {
          content: '';
          border: ${_formatPoint ? 0: _options.timeLinePointBorder}px solid ${_formatPoint ? '' :_options.timeLinePointBg};
          background:  ${_formatPoint ? _usePointBg : pointBg};
          </style>`)
        .appendTo(document.head);
      
    });
    
    // horizontal timeline content
    $(`<style>
        .timeline--horizontal
        .timeline__item
        .timeline__content::before{
          border-top: 12px solid ${ _labelBorderColor}}

        .timeline--horizontal
        .timeline__item
        .timeline__content::after{
          border-top: 10px solid ${_labelBorderColor };}
      </style>`)
      .appendTo(document.head)

    // horizontal timeline bottom content
    $(`<style>
        .timeline--horizontal
        .timeline__item--bottom
        .timeline__content::before{
          border-bottom: 12px solid ${_labelBorderColor};
          border-top: none; }
          
        .timeline--horizontal
        .timeline__item--bottom
        .timeline__content::after{
          border-bottom: 10px solid ${_labelBorderColor};
          border-top: none;}
      </style>`)
      .appendTo(document.head)

    // mobile timeline content
    $(`<style>
      .timeline--mobile
      .timeline__item
      .timeline__content::before {
        border-right: 12px solid ${_labelBorderColor};}

      .timeline--mobile
      .timeline__item
      .timeline__content::after {
        border-right: 10px solid ${_labelBorderColor};}
      </style>`)
      .appendTo(document.head)

     // left and right content
    $(`<style>
      .timeline__content::before {
        border-left: 12px solid ${_labelBorderColor};}
      .timeline__content::after {
        border-left: 11px solid ${_labelBorderColor};}

      .timeline__item--right
      .timeline__content::before {
        border-right: 12px solid ${_labelBorderColor};}
      .timeline__item--right
      .timeline__content::after {
        border-right: 11px solid ${_labelBorderColor};}
      </style>`)
      .appendTo(document.head);
        
    timeline(document.querySelectorAll('.timeline'), {
      forceVerticalMode: _options.timeLineDirection === 'auto' ? 'auto' : (_options.timeLineDirection === 'horizontal'? 10: 600),
      mode: _options.timeLineDirection === 'auto'? 'horizontal' : _options.timeLineDirection,
      visibleItems: _options.visibleItems === 'default' ? timeLineData.length : _options.customVisibleItems,
      horizontalAllPosition: _options.horizontalItemsLayout,
      verticalAllPosition: _options.verticalItemsLayout,
      verticalTrigger: `${0}%`,
    });

    // custom vertical line color
    $(`<style>.timeline:not(.timeline--horizontal)::before{background-color: ${_options.timeLineBg};}</style>`).appendTo(document.head)
    // custom horizontal line color
    $('.timeline-divider').css('backgroundColor', `${_options.timeLineBg}`);
    
    // custom time line point color
    $(`<style>.timeline__item::after {
      width: ${_options.timeLinePointSize}px; 
      height: ${_options.timeLinePointSize}px;}
      </style>`)
      .appendTo(document.head);
  };

  public render() {
    this.root.html('').css({'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'});
    const options = this.options;
    let _data = this.isMock ? Visual.mockItems : this.items;
    this.resize();
    this._initHtml(options, _data);
  }



  public onDestroy() {
    if (this.renderTimer != null) {
      cancelAnimationFrame(this.renderTimer);
      this.renderTimer = null;
    }
  }

  public onResize() {
    this.resize();
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
      this.root.css({ 'transform': `scale(${zoom})`, 'transformOrigin': 'top left' });
    } else {
      this.root.css({ "zoom": 1 });
    }

  };

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<any> = [];

    if (options.properties.visibleItems === 'default') {
      hiddenOptions = hiddenOptions.concat(['customVisibleItems'])
    }

    // time line layout 
    if (options.properties.timeLineDirection === 'horizontal') {
      hiddenOptions = hiddenOptions.concat(['verticalItemsLayout'])
    } else if(options.properties.timeLineDirection === 'vertical') {
      hiddenOptions = hiddenOptions.concat(['horizontalItemsLayout'])
    }
    
    // fonts setting 
    if (options.properties.showLabel === 'none') {
      hiddenOptions = hiddenOptions.concat(['labelTextStyle', 'labelDescribeStyle'])
    } else if (options.properties.showLabel === 'title') {
      hiddenOptions = hiddenOptions.concat(['labelDescribeStyle'])
    }

    // format list
    // if (options.properties.useToPoint && options.properties.useToPoint) {
    //   hiddenOptions = hiddenOptions.concat(['timeLineCollection'])
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
