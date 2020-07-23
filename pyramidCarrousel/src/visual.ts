import '../style/visual.less';
// import '../img';
import _ = require('lodash');
import * as $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "Dept. 1", value: 100 },
    { name: "Dept. 2", value: 153 },
    { name: "Dept. 3", value: 94 },
    { name: "Dept. 4", value: 60 },
    { name: "Dept. 5", value: 65 },
    { name: "Dept. 5", value: 65 }
  ];

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


  private isValue: boolean;

  private value: string;
  private dimensions: string;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.root = $(dom);
    this.isMock = true;
    this.visualHost = host;
    this.isFirstRender = true;
  }

  private drawCircles(circleContainer, options) {
    var side = Visual.elementWidth * 3.5;
    $("<div class='big-circle'>").width(side).height(side)
      .css('top', -side / 2.3)
      .css('left', -side / 2.8)
      .appendTo(circleContainer);
    // custom rotate image
    options.circleImage && $(".big-circle").css('backgroundImage', `url(${options.circleImage})`)

  };

  public update(updateOptions: VisualNS.IVisualUpdateOptions) {

    const options = updateOptions;
    const dataView = options.dataViews[0];

    this.isMock = !(dataView && dataView.plain.profile.values.values.length);
    const plainData: any = this.isMock ? {} : dataView.plain;

    if (this.isMock) {
      this.value = 'value';
      this.dimensions = 'name';
      this.items = Visual.mockItems;
    } else {
      this.value = plainData.profile.values.values[0].display || '';
      this.dimensions = plainData.profile.dimensions.values[0].display || ''
      this.items = plainData.data
    }
    this.options = options.properties;

    this.render();
  }

  public render() {


    this.root.html('').width(Visual.width).height(Visual.height).css('position', 'relative');
    const options = this.options;

    let container = $('<div class="container">').appendTo(this.root),
      elemnetBox = $('<div class="element-box">').appendTo(container).css('transform', `rotateX(${-options.detailtRotateDeg}deg)`),
      element = $('<div class="main">').appendTo(elemnetBox),
      circleContainer = $('<div class="circle-container">').appendTo(container).css('transform', 'translateZ(-200px)'),
      tick = 0.05,
      isActive = true,
      tX = 0,
      width = 200,
      origin = width / 2,
      height = 100,
      rotateY = [],
      elementZ = 500,
      translateZ = this.items.length > 3 ? 400 : 350,
      length = this.items.length;

    this.drawCircles(circleContainer, options);
    var deltaAngle = 360 / length;

    for (var i = 0; i < length; i++) {
      rotateY.push(i * deltaAngle);
    }

    element.css('transform-origin', `${origin}px 0px -${elementZ}px`).height(height).width(width);

    for (var i = 0; i < rotateY.length; i++) {

      let dataText = this.items[i]

      let figureText;
      let figureCircle;
      let figurePyramid;

      figureText = $("<div class='figure-text'>")

      $("<div class='figure-value'>")
        .css({ ...options.textStyle })
        .text(`${this.formatData(dataText[this.value], options.detailValueUnit, options.detailValueType)}`)
        .appendTo(figureText)

      $("<div class='figure-label'>")
        .css({ ...options.dimensionsTextStyle })
        .text(dataText[this.dimensions])
        .appendTo(figureText)
      figureCircle = $("<div class='figure-circle'>")
      const drawPyramid = (pyramid, size?) => {
        const opacity = { opacity: options.pyramidOpacity / 100 };
        const bgColor = {
          front: options.bigPyramidBgColor[0].colorStops ? options.bigPyramidBgColor[0].colorStops[0] : options.bigPyramidBgColor[0],
          back: options.bigPyramidBgColor[0].colorStops ? options.bigPyramidBgColor[0].colorStops[0] : options.bigPyramidBgColor[0],
          left: options.bigPyramidBgColor[1].colorStops ? options.bigPyramidBgColor[1].colorStops[0] : options.bigPyramidBgColor[1],
          right: options.bigPyramidBgColor[1].colorStops ? options.bigPyramidBgColor[1].colorStops[0] : options.bigPyramidBgColor[1]
        }

        if (size) {
          $("<div class='pyramid-wall-small front-small'>")
            .css({ 'borderBottomColor': options.smallPyramidBgColor, ...opacity })
            .appendTo(pyramid);
          $("<div class='pyramid-wall-small back-small'>")
            .css({ 'borderBottomColor': options.smallPyramidBgColor, ...opacity })
            .appendTo(pyramid)
          $("<div class='pyramid-wall-small left-small'>")
            .css({ 'borderBottomColor': options.smallPyramidBgColor, ...opacity })
            .appendTo(pyramid)
          $("<div class='pyramid-wall-small right-small'>")
            .css({ 'borderBottomColor': options.smallPyramidBgColor, ...opacity })
            .appendTo(pyramid)
          $("<div class='bottom-small'>")
            .css({ 'background': options.smallPyramidBgColor, ...opacity })
            .appendTo(pyramid)
        } else {
          $("<div class='pyramid-wall front'>")
            .css({ 'borderBottomColor': bgColor.front, ...opacity })
            .appendTo(pyramid);
          $("<div class='pyramid-wall back'>")
            .css({ 'borderBottomColor': bgColor.back, ...opacity })
            .appendTo(pyramid)
          $("<div class='pyramid-wall left'>")
            .css({ 'borderBottomColor': bgColor.left, ...opacity })
            .appendTo(pyramid)
          $("<div class='pyramid-wall right'>")
            .css({ 'borderBottomColor': bgColor.right, ...opacity })
            .appendTo(pyramid)

          $("<div class='bottom'>").appendTo(pyramid)
        }

      }
      //pyramid
      figurePyramid = $("<div class='figure-pyramid '>")
        .width(width)
        .height(height / (4 / 6))

      const pyramidAxis = $("<div class='pyramid-axis'>").appendTo(figurePyramid)
      const bottomContainer = $("<div class='bottom-container'>").appendTo(pyramidAxis)
      drawPyramid(bottomContainer)

      // small pyramid
      const smallPyramid = $("<div class='figure-pyramid'>").appendTo(figurePyramid);
      const pyramidAxisSmall = $("<div class='pyramid-axis-small'>").appendTo(smallPyramid);
      const bottomContainerSmall = $("<div class='bottom-container-small'>").appendTo(pyramidAxisSmall);
      const topContainerSmall = $("<div class='top-container-small'>").appendTo(pyramidAxisSmall)
      // top
      drawPyramid(topContainerSmall, 'small')
      // bottom
      drawPyramid(bottomContainerSmall, 'smal')

      let figureElement = $("<div>").attr('class', 'figure frame')
        .css({ 'transform': 'rotateY(' + rotateY[i] + 'deg) translateZ(' + translateZ + 'px)' })
        .height(height * 4).width(width).data('rotateY', rotateY[i])
        .append(figureText, figureCircle, figurePyramid)
        .appendTo(element);

    }

    container.on("mouseover", ".figure", () => {
      isActive = false;
    }).on("mouseout", () => {
      isActive = true;
    });

    // start animate
    const startReder = () => {
      const time = this.isFirstRender ? 1500 : 0;
      this.isFirstRender && $(`.main`).addClass('element-animate')

      setTimeout(() => {
        this.isFirstRender && $(`.main`).removeClass('element-animate')
        // bottom circle
        $('.circle-container').css('opacity', options.showBottom ? 1 : 0);
        const circleDirection = options.circleRotateDirection === 'negative' ? 'rotateCircle' : 'rotateCirclePositive';
        $(".big-circle").css({ 'animation': `${circleDirection} ${options.circleRotateTime}s infinite linear` });

        this.isFirstRender = false;
        options.rotateType === 'pause' && retateY()
        animloop()
      }, time)
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
    const ua = navigator.userAgent;
    if (ua.indexOf("Firefox") != -1) {
      this.root.css({ 'transform': `scale(${zoom}) translate(-50%, -50%)`, 'transformOrigin': 'top left' });
    } else {
      this.root.css({ "zoom": zoom });
    }
  };

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.showBottom) {
      return ['circleRotateDirection', 'circleRotateTime', 'circleImage']
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}