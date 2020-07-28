import '../style/visual.less';
import * as $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "Dept. 1", '实际值': 100, '对比值': 100 },
    { name: "Dept. 2", '实际值': 153, '对比值': 95 },
    { name: "Dept. 3", '实际值': 94, '对比值': 10 },
    { name: "Dept. 4", '实际值': 60, '对比值': 80 },
    { name: "Dept. 5", '实际值': 65, '对比值': 52 },
    { name: "", '实际值': '', '对比值': '' }
  ];

  private root: JQuery<HTMLElement>;
  private items = [];
  private isMock = true;
  private isFirstRender: boolean;
  private options: any;

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
    this.isFirstRender = true;
  }

  public update(updateOptions: VisualNS.IVisualUpdateOptions) {
    const options = updateOptions;
    const dataView = options.dataViews[0];


    this.isMock = !(dataView && dataView.plain.profile.dimensions.values.length);
    const plainData: any = this.isMock ? {} : dataView.plain;

    this.isValue = !!(dataView && dataView.plain.profile.values.values.length);
    // this.isContrast = !!(dataView && dataView.plain.profile.contrast.values.length);
    // this.isRate = this.isValue && this.isContrast

    if (this.isMock) {
      this.dimensions = 'name';
      this.value = '实际值'
      // this.contrast = '对比值'
      this.items = Visual.mockItems;
      // this.items.push({ [this.dimensions]: '', [this.value]: '' })

    } else {
      this.dimensions = !this.isMock && plainData.profile.dimensions.values[0].display || '';
      this.value = this.isValue && plainData.profile.values.values[0].display || '';
      // this.contrast = this.isContrast && plainData.profile.contrast.values[0].display || '';
      this.items = plainData.data
      this.items.push({ [this.dimensions]: '', [this.value]: '' })
    }

    this.options = options.properties;
    this.render()

  }

  public render() {
    this.resize();
    this.root.html('').width(800).height(400).css('position', 'relative');
    let container = $('<div class="container">').appendTo(this.root);
    let isActive = true;
    container.on("mouseover", ".s2d", () => {
      isActive = false;
    }).on("mouseout", () => {
      isActive = true;
    });
    const options = this.options;
    let length = this.items.length;

    // pyramid container
    const rotateDirection = options.rotateDirection === 'positive' ? 'positiveR' : 'negativeR';
    let pyramidContainer = $('<div class="a3d">').appendTo(container);

    const retateY = (deg = 0) => {
      if (isActive) {
        const rotateDirection = options.rotateDirection === 'positive' ? deg : -deg;
        pyramidContainer.css({ "transform": `rotateY(${rotateDirection}deg)`, 'transition': `transform 3s ease` })
      }
      setTimeout(() => {
        if (isActive && !document.hidden) {
          deg += -(90)
        }
        retateY(deg);
      }, Number(options.stopSpeed) * 1000);

    }
    options.rotateType === 'pause' ? retateY(0) : pyramidContainer.css({ 'animation': `${rotateDirection} ${options.rotateSpeed}s linear infinite` })
    let xInterval = 1 / (2 * length) * 100;
    let yInterval = 1 / (length) * 100;
    const drawS3d = (pyramidContainer, index, options) => {
      // s3d
      const translateY = {
        "transform": `translateY(${-index * Number(options.yInterval) * 0.1}em)`,
        "transition": `transform 1s ease`
      }
      let s3dContainer = $('<div class="s3d">').css({ ...translateY }).appendTo(pyramidContainer)
      // s2d
      let x0 = (index + 1) * xInterval;
      let x1 = (100 - (index + 1) * xInterval);
      let y0 = (length - (index + 1)) * yInterval;

      let x2 = index ? (100 - index * xInterval) : 100;
      let x3 = index ? index * xInterval : 0;
      let y1 = index ? (length - index) * yInterval : 100;
      let backgroundColors = options.pyramidBgColor;

      const backgroundColor = backgroundColors[Math.floor((Math.random() * backgroundColors.length))].colorStops
        ? backgroundColors[Math.floor((Math.random() * backgroundColors.length))].colorStops[0]
        : backgroundColors[Math.floor((Math.random() * backgroundColors.length))]
      const s2dBgColor = {
        'opacity': options.pyramidOpacity / 100,
        'backgroundColor': index < 6 ? options.pyramidBgColor[index] : backgroundColor
      }
      // Y animate

      for (let i = 0; i < 4; i++) {

        let s2d = $('<div class="s2d">')
          .css({ ...s2dBgColor, 'clipPath': `polygon(${x0}% ${y0}%,  ${x1}% ${y0}%, ${x2}% ${y1}% , ${x3}% ${y1}%)` })
          .appendTo(s3dContainer);
        if (index < length - 1) {
          i === 0 && $('<div class="s2d-text">')
            .text(this.items[index][this.dimensions])
            .css({ ...options.dimensionsTextStyle, top: `${(length - (index + 1)) * yInterval + (yInterval / 4)}%` })
            .appendTo(s2d);
          i === 2 && $('<div class="s2d-text">')
            .text(this.formatData(this.items[index][this.value], options.detailValueUnit, options.detailValueType))
            .css({ ...options.textStyle, top: `${(length - (index + 1)) * yInterval + (yInterval / 4)}%` })
            .appendTo(s2d);
        }
      }

      $('<div class="s2d">')
        .css({
          ...s2dBgColor,
          'width': `${(x1 - x0) * 0.01 * 0}em`,
          'height': `${(x1 - x0) * 0.01 * 0}em`,
          'transform': `translateY(${12 * (index + 1)}%) rotateX(90deg) translateX(${-12 * (index + 1)}%)`
        })
        .appendTo(s3dContainer);

    }
    for (let i = 0; i < length; i++) {
      drawS3d(pyramidContainer, i, options)
    }

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

  }

  public onResize() {
    this.resize();
    this.render();
  }

  private resize() {
    let width = 700,
      height = 350,
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
    let hiddenOptions: Array<any> = []

    // detail
    if (options.properties.rotateType === 'continuous') {
      hiddenOptions = hiddenOptions.concat(['stopSpeed'])
    }

    if (options.properties.rotateType === 'pause') {
      hiddenOptions = hiddenOptions.concat(['rotateSpeed'])
    }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}