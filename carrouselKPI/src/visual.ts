import '../style/visual.less';
import _ = require('lodash');
import * as $ from 'jquery';

export default class Visual extends WynVisual {
  private static defaultOptions = {
    dataFormat: "{name}: {rate}",
    totalDataFormat: "Total: {rate}",
  };

  private static mockValueFields = [{ display: 'rate' }];

  private static mockDimensionFields = [{ display: 'name' }];

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
  private totalItem: any;
  private totalContrastItem: any
  private isMock = true;
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
    this.totalItem = null;
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

  private static escapeHTML(a) {
    a = "" + a;
    return a.replace(/"/g, "%22").replace(/</g, "%3C").replace(/>/g, "%3E");
  }

  private drawCircles(circleContainer) {
    var side = Visual.width + Visual.elementWidth * 2;
    $("<div class='big-circle'>").width(side).height(side)
      .css('top', (Visual.elementHeight - side) / 2)
      .css('left', (Visual.elementWidth - side) / 2)
      .appendTo(circleContainer);


    var smallSide = Visual.width * 0.75;
    $("<div class='small-circle'>")
      .width(smallSide)
      .height(smallSide)
      .css('top', (Visual.elementHeight - smallSide) / 2)
      .css('left', (Visual.elementWidth - smallSide) / 2)
      .appendTo(circleContainer);
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

    if (this.value) {
      const totalValues = this.items.map(item => item[this.value])
      this.totalItem = { [this.value]: _.sum(totalValues) };
    }

    if (this.contrast) {
      const totalContrasts = this.items.map(item => item[this.contrast])
      this.totalContrastItem = { [this.contrast]: _.sum(totalContrasts) }
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
      element = $('<div class="main">').appendTo(container).css('transform', 'translateZ(-200px)'),
      circleContainer = $('<div class="circle-container">').appendTo(container).css('transform', 'translateZ(-200px)'),
      lineContainer = $('<div class="line-container">').appendTo(this.root).width(Visual.width).height(Visual.height),
      tick = 0.05,
      isActive = true,
      tX = 0,
      width = 200,
      origin = width / 2,
      height = 100,
      rotateY = [],
      elementZ = 200,
      translateZ = 400,
      length = this.items.length;

    // start draw circle 

    this.drawCircles(circleContainer);
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
      options.rotateFigureImage && figureElement.css({ 'background': 'transparent', 'background-image': `url(${options.rotateFigureImage})`, 'backgroundSize': '100% 100%' })
    }

    container.on("mouseover", ".figure", () => {
      isActive = false;
    }).on("mouseout", () => {
      isActive = true;
    });


    var allLightsElementSide = Visual.width / 4;
    var allLightsElement = $("<div class='all-lights1'>")
      .width(allLightsElementSide)
      .height(allLightsElementSide)
      .css('top', -allLightsElementSide / 2 - 10)
      .css('left', (Visual.width - allLightsElementSide) / 2)
      .appendTo(container);

    var allLights2ElementSide = Visual.width / 6;
    var allLights2Element = $("<div class='all-lights2'>")
      .width(allLights2ElementSide)
      .height(allLights2ElementSide)
      .css('top', -allLightsElementSide / 2 + 10)
      .css('left', (Visual.width - allLights2ElementSide) / 2)
      .appendTo(container);

    var earthElementSide = Visual.width / 5;
    var earthElement = $("<div class='earth'>")
      .width(earthElementSide)
      .height(earthElementSide)
      .css('top', -Visual.height * 0.2)
      .css('left', (Visual.width - earthElementSide) / 2)
      .appendTo(container);
    // custom rotate image
    options.rotateCenterImage && earthElement.css('backgroundImage', `url(${options.rotateCenterImage})`)

    var stepsSide = Visual.width / 5;
    var stepsElement = $("<div class='steps fixed-element'>")
      .width(stepsSide)
      .height(stepsSide)
      .css('left', '50%')
      .css('transform', 'translateX(-50%)')
      .appendTo(container);



    var totalElement = $('<idv class="total-item frame">')
      .appendTo(this.root)
      .css({ 'visibility': options.totalShow ? 'visiable' : 'hidden' });
    // custom rotate image
    options.rotateFigureImage && totalElement.css({ 'background': 'transparent', 'backgroundImage': `url(${options.rotateFigureImage})`, 'backgroundSize': '100% 100%' })

    if (this.totalItem || this.totalContrastItem) {

      let figureTitle;
      let figureValues;
      const width = 300;
      const height = 120;
      if (this.isMock || this.isRate) {

        figureTitle = $("<div class='figure-title'>")
          .css({ ...options.textStyleTotalText, 'fontFamily': options.customFontFamily, 'justifyContent': options.titlePosition })
          .width(width)
          .height(height / 2)
          .text(options.totalName)

        let figureValue = $("<div class='figure-value'>")
          .height(height / 2)
          .width(width * (2 / 3))


        let figureRate = $("<div class='figure-rate'>")
          .height(height / 2)
          .width(width * (1 / 3))


        figureValues = $("<div class='figure-values'>")
          .width(width)
          .append(figureValue, figureRate)
        //  format data


        const actualValue = $('<span></span>').text(`${this.value}: ${this.formatData(this.totalItem[this.value], options.totalValueUnit, options.totalValueType)}`);
        const contrastValue = $('<span></span>').text(`${this.contrast}: ${this.formatData(this.totalContrastItem[this.contrast], options.totalValueUnit, options.totalValueType)}`);
        const rateText = $('<span></span>').text('完成率');
        const rate = (this.totalItem[this.value] / this.totalContrastItem[this.contrast] * 100).toFixed(2) + '%'
        const rateValue = $('<span></span>').text(rate);

        figureValue.css({ ...options.valueTextStyleTotalValue, 'textAlign': options.totalValuePosition }).append(actualValue, contrastValue);
        figureRate.css({ ...options.rateTextStyleTotalRate }).append(rateText, rateValue)
      } else {
        if (this.isValue || this.isContrast) {
          figureTitle = $("<div class='figure-title'>")
            .css({ ...options.textStyleTotalText, 'fontFamily': options.customFontFamily, 'justifyContent': options.titlePosition })
            .width(width)
            .height(height / 2)
            .text(options.totalName)
          const currentValue = this.isValue && this.totalItem[this.value] || this.isContrast && this.totalContrastItem[this.contrast]

          figureValues = $("<div> class='figure-value-only'>")
            .css({ ...options.valueTextStyleTotalValue, 'textAlign': options.totalValuePosition })
            .width(width)
            .height(height / 2)
            .text(this.formatData(currentValue, options.totalValueUnit, options.totalValueType))
        } else {
          figureTitle = $("<div class='figure-title-only'>")
            .css({ ...options.textStyleTotalText, 'fontFamily': options.customFontFamily, 'justifyContent': options.titlePosition })
            .width(width)
            .height(height)
            .text(options.totalName)
          figureValues = ''
        }
      }
      totalElement
        .append(figureTitle, figureValues)
    } else {
      totalElement.text(options.totalName)
        .css({ ...options.textStyleTotalText, 'fontFamily': options.customFontFamily, 'justifyContent': options.titlePosition })
        .addClass('figure-title')
    }

    const renderCore = (tX) => {
      const elementDirection = options.detailtRotateDirection === 'negative' ? - tX : tX;
      element.css("transform", `rotateY(${elementDirection}deg) translateZ(${-elementZ}px)`);
      // pause  animate type
      options.rotateType === 'pause' && element.css({ 'transition': 'transform .5s ease-in-out' });
      options.totalShow && Visual.drawLines(container, lineContainer);
    }

    var self = this;
    (function animloop() {
      self.renderTimer = requestAnimationFrame(animloop);
      if (isActive) {
        tX += tick * - Number(options.rotateTime);
        if (options.rotateType === 'continuous') {
          if (tX < -360) {
            tX += 360;
          }
          renderCore(tX)
        } else {
          options.totalShow && Visual.drawLines(container, lineContainer);
        }
        const circleDirection = options.rotateDirection === 'negative' ? - tX : tX;
        $(".big-circle").css("transform", `rotateY(${circleDirection}deg) rotateX(${90}deg) translateZ(${-70}px)`)
        $(".small-circle").css("transform", `rotateY(${circleDirection}deg) rotateX(${90}deg) translateZ(${0}px)`)
      } else {
        isActive = false;
      }
    })();

    const retateY = (tX = 0) => {
      if (isActive) {
        renderCore(tX)
      }
      setTimeout(() => {
        if (isActive && !document.hidden) {
          tX += -(deltaAngle)
        }
        retateY(tX);
      }, Number(options.rotateTime) * 1000);
    }

    options.rotateType === 'pause' && retateY(-deltaAngle)

    this.resize();
  }

  public formatData = (number, dataUnit, dataType) => {
    let format = number
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

  private static drawLines(container, lineContainer) {
    let svg = $(`<svg viewBox="0 0 ${Visual.width} ${Visual.height}" xmlns="http://www.w3.org/2000/svg"></svg>`);
    let totalPoint = { left: Visual.width / 2, top: 170 };
    let subs = container.find('.figure');
    subs.each((index, item) => {
      let lineInfo = Visual.createLine(totalPoint, item);
      lineInfo.y2 += 15;
      lineInfo.stroke = 'rgba(0,126,255,0.8)';

      let line = $('<line>').attr(lineInfo);
      svg.append(line);
    });


    let svgHtml = Visual.escapeHTML(svg[0].outerHTML);
    let bg = `url('data:image/svg+xml, ${svgHtml}')`;
    lineContainer
      .css('background-image', bg);
  };

  private static createLine(start, endEle): any {
    var end = endEle.getBoundingClientRect();
    var line = {
      x1: start.left,
      y1: start.top,
      x2: end.left + end.width / 2,
      y2: end.top
    };
    return line;
  };

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
    if (!options.properties.totalShow) {
      return ['totalName', 'textStyleTotalText', 'totalValueType', 'totalValueUnit', 'totalValuePosition', 'valueTextStyleTotalValue', 'rateTextStyleTotalRate']
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}