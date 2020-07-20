import '../style/visual.less';
import _ = require('lodash');
import * as $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "Dept. 1", '实际值': 100, '对比值': 100 },
    { name: "Dept. 2", '实际值': 153, '对比值': 95 },
    { name: "Dept. 3", '实际值': 94, '对比值': 10 },
    // { name: "Dept. 4", '实际值': 60, '对比值': 80 },
    // { name: "Dept. 5", '实际值': 65, '对比值': 52 },
    // { name: "Dept. 6", '实际值': 55, '对比值': 62 },
    // { name: "Dept. 7", '实际值': 120, '对比值': 71 },
    // { name: "Dept. 8", '实际值': 52, '对比值': 66 },
  ];

  private root: JQuery<HTMLElement>;
  private items = [];

  private isMock = true;
  private options: any
  private visualHost: any;
  private renderTimer: any;
  private static width = 800;
  private static height = 500;
  private static elementWidth = 200;
  private static elementHeight = 100;


  private isValue: boolean;

  private value: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.root = $(dom);
    this.isMock = true;
    this.visualHost = host;

    //  custom font famliy
    var newStyle = document.createElement('style');
    newStyle.appendChild(document.createTextNode("\
      @font-face {\
        font-family: "+ options.properties.customFontFamily + ";\
        src: url('/fonts/"+ options.properties.customFontFamilyURL + ".ttf') format('truetype'),\
        url('/fonts/"+ options.properties.customFontFamilyURL + ".otf') format('otf')\
    }\
    "));

    document.head.appendChild(newStyle);
  }

  // private drawCircles(circleContainer) {
  //   var side = Visual.elementWidth * 3.5;
  //   $("<div class='big-circle'>").width(side).height(side)
  //     .css('top', -side / 2.8)
  //     .css('left', -side / 2.8)
  //     .appendTo(circleContainer);

  // };


  public update(updateOptions: VisualNS.IVisualUpdateOptions) {

    const options = updateOptions;
    const dataView = options.dataViews[0];

    console.log(dataView, '====dataView')
    this.isMock = !(dataView && dataView.plain.profile.values.values.length);
    const plainData: any = this.isMock ? {} : dataView.plain;

    if (this.isMock) {

      this.value = '实际值'
      this.items = Visual.mockItems
    } else {

      this.value = plainData.profile.values.values[0].display || '';
      this.items = plainData.data
    }
    this.options = options.properties;

    this.render();
  }

  public render() {


    this.root.html('').width(Visual.width).height(Visual.height).css('position', 'relative');
    const options = this.options

    let container = $('<div class="container">').appendTo(this.root),
      elemnetBox = $('<div class="element-box">').appendTo(container).css('transform', `rotateX(${-options.detailtRotateDeg}deg)`),
      element = $('<div class="main">').appendTo(elemnetBox).css('transform', 'translateZ(-0px)'),

      tick = 0.05,
      isActive = true,
      tX = 0,
      width = 200,
      origin = width / 2,
      height = 100,
      rotateY = [],
      elementZ = 700,
      translateZ = 350,
      length = this.items.length;

    // start draw circle 

    // this.drawCircles(circleContainer);
    var deltaAngle = 360 / length;

    for (var i = 0; i < length; i++) {
      rotateY.push(i * deltaAngle);
    }

    element.css('transform-origin', `${origin}px 0px -${elementZ}px`).height(height).width(width);

    for (var i = 0; i < rotateY.length; i++) {

      let dataText = this.items[i]
      let figureTitle;
      let figureLogo;
      let figureCircle;
      let figurePyramid;
      figureTitle = $("<div class='figure-title'>")
        .css({ ...options.textStyle, 'justifyContent': options.titlePosition })
        .width(width)
        .height(height / 6)
        .text(dataText[this.value])

      const side = Visual.elementWidth * 2;
      // figureCircle = $("<div class='figure-circle'>").width(side).height(side)

      //pyramid

      figurePyramid = $("<div class='figure-pyramid '>")
        .css({ ...options.textStyle, 'justifyContent': options.titlePosition })
        .width(width)
        .height(height / (4 / 6))

      const pyramidAxis = $("<div class='pyramid-axis'>").appendTo(figurePyramid)
      const bottomContainer = $("<div class='bottom-container'>").appendTo(pyramidAxis)
      // wall
      $("<div class='figure-circle'>").appendTo(bottomContainer)
      $("<div class='pyramid-wall front'>").appendTo(bottomContainer);
      $("<div class='pyramid-wall back'>").appendTo(bottomContainer)
      $("<div class='pyramid-wall left'>").appendTo(bottomContainer)
      $("<div class='pyramid-wall right'>").appendTo(bottomContainer)
      $("<div class='bottom'>").appendTo(bottomContainer)

      let figureElement = $("<div>").attr('class', 'figure frame')
        .css({ 'transform': 'rotateY(' + rotateY[i] + 'deg) translateZ(' + translateZ + 'px)' })
        .height(height * 4).width(width).data('rotateY', rotateY[i])
        .append(figureTitle, figureLogo, figureCircle, figurePyramid)
        .appendTo(element);

    }

    container.on("mouseover", ".figure", () => {
      isActive = false;
    }).on("mouseout", () => {
      isActive = true;
    });

    // start animate
    const startReder = () => {

      setTimeout(() => {
        const boxName = ['main']
        boxName.map((item) => {
          $(`.${item}`).css('opacity', 1)
        })
        options.rotateType === 'pause' && retateY()
        animloop()
      }, 1000)
    }
    startReder()

    const renderCore = (tX) => {
      const elementDirection = options.detailtRotateDirection === 'negative' ? - tX : tX;
      element.css("transform", `rotateY(${elementDirection}deg) translateZ(${-elementZ}px)`);
      // pause  animate type
      options.rotateType === 'pause' && element.css({ 'transition': 'transform .5s ease-in-out' });

    }

    var self = this;
    const animloop = () => {
      self.renderTimer = requestAnimationFrame(animloop);

      if (isActive) {
        tX += tick * - Number(options.rotateTime);
        if (options.rotateType === 'continuous') {
          if (tX < -360) {
            tX += 360;
          }
          renderCore(tX)
        }
        // const circleDirection = options.rotateDirection === 'negative' ? - tX : tX;
        // $(".big-circle").css("transform", `rotateY(${circleDirection}deg) rotateX(${90}deg) translateZ(${-70}px)`)
      } else {
        isActive = false;
      }
    };

    const retateY = (deg = 0) => {
      if (isActive) {
        renderCore(deg)
      }
      setTimeout(() => {
        if (isActive && !document.hidden) {
          deg += -(deltaAngle)
        }

        retateY(deg);
      }, Number(options.rotateTime) * 1000);

    }

    this.resize();
  }

  public formatData = (number, dataUnit, dataType) => {
    let format = number
    // const dataUnit = options.totalValueUnit
    const units = [{
      value: 1,
      unit: ''
    },
    {
      value: 100,
      unit: '百'
    }, {
      value: 1000,
      unit: '千'
    }, {
      value: 10000,
      unit: '万'
    }, {
      value: 100000,
      unit: '十万'
    }, {
      value: 1000000,
      unit: '百万'
    }, {
      value: 10000000,
      unit: '千万'
    }, {
      value: 100000000,
      unit: '亿'
    }, {
      value: 1000000000,
      unit: '十亿'
    }, {
      value: 100000000000,
      unit: '万亿'
    }]
    const formatUnit = units.find((item) => item.value === Number(dataUnit))
    format = (format / formatUnit.value).toFixed(2)

    if (dataType === 'number') {
      format = format.toLocaleString()
    } else if (dataType === '%') {
      format = format + dataType
    } else {
      format = dataType + format
    }
    return format + formatUnit.unit
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
    this.root.css("zoom", zoom);
  };

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}