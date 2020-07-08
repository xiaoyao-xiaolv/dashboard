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
    { name: "Dept. 1", rate: 100 },
    { name: "Dept. 2", rate: 153 },
    { name: "Dept. 3", rate: 94 },
    { name: "Dept. 4", rate: 60 },
    { name: "Dept. 5", rate: 65 },
    { name: "Dept. 6", rate: 55 },
    { name: "Dept. 7", rate: 120 },
    { name: "Dept. 8", rate: 52 },
  ];

  private root: JQuery<HTMLElement>;
  private items = [];
  private totalItem;
  private isMock = true;
  private options: any
  private visualHost: any;
  private renderTimer: any;
  private static width = 800;
  private static height = 500;
  private static elementWidth = 200;
  private static elementHeight = 100;

  static dimensions: any;
  static value: any;
  static contrast: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.root = $(dom);
    this.totalItem = null;
    this.isMock = true;
    this.visualHost = host;
  }

  private static format(format: any, data: any): string {
    if (Visual.contrast) {
      // return `${data[this.dimensions] || '汇总'}    ${data[this.value]} | ${data[this.contrast]} `
    }
    return `${data[this.dimensions] || '汇总'}: ${data[this.value]}`
  }

  private static escapeHTML(a) {
    a = "" + a;
    return a.replace(/"/g, "%22").replace(/</g, "%3C").replace(/>/g, "%3E");
  }

  private drawCircles(element) {
    var side = Visual.width + Visual.elementWidth * 2;
    $("<div class='big-circle'>").width(side).height(side)
      .css('top', (Visual.elementHeight - side) / 2)
      .css('left', (Visual.elementWidth - side) / 2)
      .appendTo(element);


    var smallSide = Visual.width * 0.75;
    $("<div class='small-circle'>")
      .width(smallSide)
      .height(smallSide)
      .css('top', (Visual.elementHeight - smallSide) / 2)
      .css('left', (Visual.elementWidth - smallSide) / 2)
      .appendTo(element);
  };


  public update(updateOptions: VisualNS.IVisualUpdateOptions) {
    console.log(updateOptions, '=====update options');

    const options = updateOptions;
    const dataView = options.dataViews[0];

    this.isMock = !(dataView &&
      dataView.plain.profile.values.values.length &&
      dataView.plain.profile.dimensions.values.length && dataView.plain.profile.contrast.values.length);
    let valueFields, dimensionFields, contrastFields;
    const plainData: any = this.isMock ? {} : dataView.plain;

    Visual.value = this.isMock ? Visual.mockValueFields[0].display : plainData.profile.values.values[0].display;
    Visual.dimensions = this.isMock ? Visual.mockDimensionFields[0].display : plainData.profile.dimensions.values[0].display;
    Visual.contrast = this.isMock ? '' : plainData.profile.contrast.values[0].display;
    this.items = this.isMock ? Visual.mockItems : plainData.data;
    valueFields = this.isMock ? Visual.mockValueFields : plainData.profile.values.values;
    dimensionFields = this.isMock ? Visual.mockDimensionFields : plainData.profile.dimensions.values;
    contrastFields = this.isMock ? '' : plainData.profile.contrast.values;

    const totalValues = this.items.map(item => item[Visual.value])
    this.totalItem = { [Visual.value]: _.sum(totalValues) };

    this.options = options.properties;

    if (!this.options.dataFormat) {
      this.options.dataFormat = `${Visual.dimensions}: ${Visual.value}`;
    }

    if (!this.options.totalDataFormat) {
      this.options.totalDataFormat = `汇总: ${Visual.value}`;
    }

    this.render();
  }

  public render() {
    this.root.html('').width(Visual.width).height(Visual.height).css('position', 'relative');
    const options = this.options
    let container = $('<div class="container">').appendTo(this.root),
      element = $('<div class="main">').appendTo(container),
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
    this.drawCircles(element);
    var deltaAngle = 360 / length;

    for (var i = 0; i < length; i++) {
      rotateY.push(i * deltaAngle);
    }
    console.log(origin, '===origin')
    element.css('transform-origin', `${origin}px 0px -${elementZ}px`).height(height).width(width);

    let totalMsg = this.options.totalDataFormat,
      msg = this.options.dataFormat;

    for (var i = 0; i < rotateY.length; i++) {
      var text = Visual.format(msg, this.items[i]);
      $("<div>").attr('class', 'figure frame').text(text)
        .css({ 'transform': 'rotateY(' + rotateY[i] + 'deg) translateZ(' + translateZ + 'px)' })
        .height(height).width(width).data('rotateY', rotateY[i])
        .appendTo(element);
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


    var stepsSide = Visual.width * 0.4;
    var stepsElement = $("<div class='steps fixed-element'>")
      .width(stepsSide)
      .height(stepsSide)
      .css('top', -40)
      .css('left', (Visual.elementWidth - stepsSide) / 2)
      .appendTo(element);

    var totalElement = $('<idv class="total-item frame">').appendTo(this.root);
    if (this.totalItem) {
      var totalItemText = Visual.format(totalMsg, this.totalItem);
      totalElement.text(totalItemText);
    }

    var self = this;
    (function animloop() {
      self.renderTimer = requestAnimationFrame(animloop);
      if (isActive) {
        tX += tick * - Number(options.rotateSpeed);
        if (tX < -360) {
          tX += 360;
        }
        rotateY.map(rotate => {
          if (tX > - (rotate - 5) && tX < - rotate) {
            return tX = - rotate
          } else {
            return tX
          }
        })
        renderCore()
      } else {
        isActive = false;
      }
    })();

    function renderCore() {
      element.css("transform", 'rotateY(' + tX + 'deg) translateZ(-' + elementZ + 'px)');
      element.find('.fixed-element').each((index, item) => {
        $(item).css("transform", 'rotateY(' + (-tX) + 'deg) rotateX(-30deg)');
      });

      Visual.drawLines(container, lineContainer);
    }

    this.resize();
  }

  private static drawLines(container, lineContainer) {
    var svg = $(`<svg viewBox="0 0 ${Visual.width} ${Visual.height}" xmlns="http://www.w3.org/2000/svg"></svg>`);
    var totalPoint = { left: Visual.width / 2, top: 170 };
    var subs = container.find('.figure');
    subs.each((index, item) => {
      var lineInfo = Visual.createLine(totalPoint, item);
      lineInfo.y2 += 15;
      lineInfo.stroke = 'rgba(0,126,255,0.8)';
      var line = $('<line>').attr(lineInfo);
      svg.append(line);
    });

    var svgHtml = Visual.escapeHTML(svg[0].outerHTML);
    var bg = `url('data:image/svg+xml, ${svgHtml}')`;
    lineContainer.css('background-image', bg);
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
    // if (this.renderTimer != null) {
    //   cancelAnimationFrame(this.renderTimer);
    //   this.renderTimer = null;
    // }
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