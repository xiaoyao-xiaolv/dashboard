import '../style/visual.less';
import _ = require('lodash');
import * as $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "Dept. 1", '实际值': 100, '对比值': 100 },
    { name: "Dept. 2", '实际值': 153, '对比值': 95 },
    { name: "Dept. 3", '实际值': 94, '对比值': 10 },
    { name: "Dept. 4", '实际值': 60, '对比值': 80 },
    { name: "Dept. 5", '实际值': 65, '对比值': 52 },
    { name: "Dept. 6", '实际值': 55, '对比值': 62 },
    { name: "Dept. 7", '实际值': 120, '对比值': 71 },
    { name: "Dept. 8", '实际值': 52, '对比值': 66 },
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

  private isDimensions: boolean;
  private isValue: boolean;
  private isContrast: boolean;
  private isRate: boolean;

  private dimensions: any;
  private value: any;
  private contrast: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.root = $(dom);
    this.isMock = true;
    this.visualHost = host;
    this.isFirstRender = true;
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

  private drawCircles(circleContainer, options) {
    var side = Visual.elementWidth * 3.5;
    $("<div class='big-circle'>").width(side).height(side)
      .css('top', -side / 2.8)
      .css('left', -side / 2.8)
      .appendTo(circleContainer);
    options.circleBigImage && $(".big-circle").css('backgroundImage', `url(${options.circleBigImage})`)

    var smallSide = Visual.elementWidth * 1.5;;
    $("<div class='small-circle'>")
      .width(smallSide)
      .height(smallSide)
      .css('top', (- smallSide) * 0.1)
      .css('left', (- smallSide) / 6)
      .appendTo(circleContainer);
    options.circleSmallImage && $(".small-circle").css('backgroundImage', `url(${options.circleSmallImage})`)
  };


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
      this.items = plainData.data
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

  public render() {


    this.root.html('').width(Visual.width).height(Visual.height).css('position', 'relative');
    const options = this.options

    let container = $('<div class="container">').appendTo(this.root),
      elemnetBox = $('<div class="element-box">').appendTo(container).css('transform', `rotateX(${options.detailtRotateDeg}deg)`),
      element = $('<div class="main">').appendTo(elemnetBox).css('transform', 'translateZ(-400px)'),
      circleContainer = $('<div class="circle-container">')
        .appendTo(container)
        .css({ 'transform': 'translateZ(-200px)', 'visibility': options.showBottom ? 'visiable' : 'hidden' }),
      staticContainer = $('<div class="static-container">')
        .css({ 'visibility': options.showBottom ? 'visiable' : 'hidden' })
        .appendTo(container),
      tick = 0.05,
      isActive = true,
      tX = 0,
      width = 200,
      origin = width / 2,
      height = 100,
      rotateY = [],
      elementZ = 400,
      translateZ = 500,
      length = this.items.length;

    // start draw circle 

    this.drawCircles(circleContainer, options);
    var deltaAngle = 360 / length;

    for (var i = 0; i < length; i++) {
      rotateY.push(i * deltaAngle);
    }

    element.css('transform-origin', `${origin}px 0px -${elementZ}px`).height(height).width(width);

    for (var i = 0; i < rotateY.length; i++) {

      let dataText = this.items[i]
      let figureTitle;
      let figureValues;

      if (this.isMock || this.isRate) {

        figureTitle = $("<div class='figure-title'>")
          .css({ ...options.textStyle, 'justifyContent': options.titlePosition })
          .width(width).text(dataText[this.dimensions])

        let figureValue = $("<div class='figure-value'>")
          .width(width * (2 / 3))


        let figureRate = $("<div class='figure-rate'>")
          .width(width * (1 / 3))


        figureValues = $("<div class='figure-values'>")
          .width(width)
          .append(figureValue, figureRate)

        const actualValue = $('<span></span>').text(`${this.value}: ${this.formatData(dataText[this.value], options.detailValueUnit, options.detailValueType)}`);
        const contrastValue = $('<span></span>').text(`${this.contrast}: ${this.formatData(dataText[this.contrast], options.detailValueUnit, options.detailValueType)}`);
        const rateText = $('<span></span>').text('完成率');
        const rate = (dataText[this.value] / dataText[this.contrast] * 100).toFixed(2) + '%'
        const rateValue = $('<span></span>').text(rate);

        figureValue.css({ ...options.valueTextStyle, 'textAlign': options.detailValuePosition }).append(actualValue, contrastValue);
        figureRate.css({ ...options.rateTextStyle }).append(rateText, rateValue)
      } else {
        if (this.isValue || this.isContrast) {
          figureTitle = $("<div class='figure-title'>")
            .css({ ...options.textStyle, 'justifyContent': options.titlePosition })
            .width(width)
            .height(height / 2)
            .text(dataText[this.dimensions])
          const currentFigureVlaue = this.isValue && dataText[this.value] || this.isContrast && dataText[this.contrast]
          figureValues = $("<div> class='figure-value-only'>")
            .css({ ...options.valueTextStyle, 'textAlign': options.detailValuePosition })
            .width(width)
            .height(height / 2)
            .text(this.formatData(currentFigureVlaue, options.detailValueUnit, options.detailValueType))
        } else {
          figureTitle = $("<div class='figure-title-only'>")
            .css({ ...options.textStyle, 'justifyContent': options.titlePosition })
            .width(width)
            .height(height)
            .text(dataText[this.dimensions])
          figureValues = ''
        }
      }

      let figureElement = $("<div>").attr('class', 'figure frame')
        .css({ 'transform': 'rotateY(' + rotateY[i] + 'deg) translateZ(' + translateZ + 'px)' })
        .height(height).width(width).data('rotateY', rotateY[i])
        .append(figureTitle, figureValues)
        .appendTo(element);

      // custom rotate image
      options.detailImage && figureElement.css('backgroundImage', `url(${options.detailImage})`)
      options.detailBgColor && figureElement.css({ 'backgroundColor': options.detailBgColor })
    }

    container.on("mouseover", ".figure", () => {
      isActive = false;
    }).on("mouseout", () => {
      isActive = true;
    });


    let allLightsElementSide = Visual.width / 8;
    let allLightsElement = $("<div class='all-lights1'>")
      .width(allLightsElementSide)
      .height(allLightsElementSide)
      .css({ 'top': (-allLightsElementSide) * 0.1, 'left': (allLightsElementSide) * 3.5, 'visibility': options.showBottomLight ? 'visiable' : 'hidden' })
      .appendTo(staticContainer);

    let allLights2ElementSide = Visual.width / 12;
    let allLights2Element = $("<div class='all-lights2'>")
      .width(allLights2ElementSide)
      .height(allLights2ElementSide)
      .css({ 'top': '10px', 'left': (Visual.width - allLights2ElementSide) / 2, 'visibility': options.showBottomLight ? 'visiable' : 'hidden' })
      .appendTo(staticContainer);

    let earthElementSide = Visual.width / 10;
    let earthElement = $("<div class='earth'>")
      .width(earthElementSide)
      .height(earthElementSide)
      .css('top', '10px')
      .css('left', earthElementSide * 4.5)
      .appendTo(staticContainer);
    // custom rotate image
    options.circleCenterImage && earthElement.css('backgroundImage', `url(${options.circleCenterImage})`)

    let stepsSide = Visual.width / 10;
    let stepsElement = $("<div class='steps fixed-element'>")
      .width(stepsSide)
      .height(stepsSide)
      .css('left', '50%')
      .css('top', '33%')
      .css('transform', 'translateX(-50%)')
      .appendTo(staticContainer);

    // start animate
    const startReder = () => {
      // 1. first rotate circle
      const time = this.isFirstRender ? 2000 : 0;
      this.isFirstRender && $(".big-circle")
        .css('opacity', 1)
        .addClass('rotate-start')
        .css({ 'transition': 'opacity .5s ease' });

      // 2. after 1s, all rotate
      setTimeout(() => {
        const boxName = ['main', 'static-container', 'small-circle']
        boxName.map((item) => {
          $(`.${item}`).css('opacity', 1)
        })
        this.isFirstRender && $(".big-circle").removeClass('rotate-start');
        this.isFirstRender = false
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
        tX += tick * - Number(options.rotateSpeed);
        if (options.rotateType === 'continuous') {
          if (tX < -360) {
            tX += 360;
          }
          renderCore(tX)
        }
        const circleBigDirection = options.circleRotateDirection === 'negative' ? 'rotateCircle' : 'rotateCirclePositive';
        const circlesmallDirection = options.circleRotateDirection === 'negative' ? 'rotateSmallCircle' : 'rotateSmallCirclePositive';
        $(".big-circle").css({ 'animation': `${circleBigDirection} ${options.circleRotateTime}s infinite linear` });
        $(".small-circle").css({ 'animation': `${circlesmallDirection} ${options.circleRotateTime}s infinite linear` });

      } else {
        isActive = false;
        $(".big-circle").css({ 'animationPlayState': `paused` });
        $(".small-circle").css({ 'animationPlayState': `paused` });
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
      }, Number(options.stopSpeed) * 1000);

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
    let width = Visual.width,
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
    let hiddenOptions: Array<any> = [];

    // detail 
    if (options.properties.rotateType === 'continuous') {
      hiddenOptions = hiddenOptions.concat(['stopSpeed'])
    }

    if (options.properties.rotateType === 'pause') {
      hiddenOptions = hiddenOptions.concat(['rotateSpeed'])
    }
    // bottom
    if (!options.properties.showBottom) {
      hiddenOptions = hiddenOptions.concat(['circleRotateDirection', 'showBottomLight', 'circleRotateTime', 'circleCenterImage', 'circleSmallImage', 'circleBigImage'])
    }
    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}