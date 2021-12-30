import '../style/visual.less';
import _ = require('lodash');
import * as $ from 'jquery';

export default class Visual extends WynVisual {
  private static mockItems = [
    { name: "Dept. 1", '实际值': 100 },
    { name: "Dept. 2", '实际值': 97 },
    { name: "Dept. 3", '实际值': 94 },
    { name: "Dept. 4", '实际值': 65 },
    { name: "Dept. 5", '实际值': 60 },
    { name: "", '实际值': '' }
  ];

  private root: JQuery<HTMLElement>;
  private items = [];
  private isMock = true;
  private isFirstRender: boolean;
  private renderTimer: any;
  private options: any;

  private isValue: boolean;
  private isContrast: boolean;
  private isRate: boolean;

  private dimensions: any;
  private value: any;
  private contrast: any;
  private host: any;
  private format: any;
  private selectionIds: any;
  private selectionManager: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.root = $(dom);
    this.isMock = true;
    this.host = host;
    this.isFirstRender = true;
    this.selectionManager = host.selectionService.createSelectionManager();
  }

  public update(updateOptions: VisualNS.IVisualUpdateOptions) {
    const options = updateOptions;
    this.selectionIds = [];
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
      this.format = options.dataViews[0].plain.profile.values.values[0].format;
      this.dimensions = !this.isMock && plainData.profile.dimensions.values[0].display || '';
      this.value = this.isValue && plainData.profile.values.values[0].display || '';
      // this.contrast = this.isContrast && plainData.profile.contrast.values[0].display || '';
      // sort data
      // this.items = _.sortBy(plainData.data, (item) => -item[this.value])
      let items = plainData.data;
      const isSort = plainData.sort[this.dimensions].priority === 0 ? true : false;

      // data sort 
      if (isSort) {
        const sortFlage = plainData.sort[this.dimensions].order;
        let newItems: any = sortFlage.map((flage) => {
          return newItems = items.find((item) => item[this.dimensions] === flage && item)
        })
        items = newItems.filter((item) => item)
      }
      this.items = items
      items.forEach((data) => {
        const selectionId = this.host.selectionService.createSelectionId();
        selectionId.withDimension(options.dataViews[0].plain.profile.dimensions.values[0], data);
        this.selectionIds.push(selectionId);
      })
      this.items.push({ [this.dimensions]: '', [this.value]: '' })
    }

    this.options = options.properties;
    this.render()

  }

  private selectEvent(data,sid,properties) {
    let leftMouseButton = properties.leftMouseButton;
    switch (leftMouseButton) {
      //鼠标联动设置    
      case "none": {
        if(this.selectionManager.contains(this.selectionIds[sid])){
          this.selectionManager.clear(this.selectionIds[sid])
        }else{
          if (properties.onlySelect) {
            this.selectionManager.clear();
          }
          this.selectionManager.select(this.selectionIds[sid], true);
        }
        if (this.selectionManager.selected.length == this.items.length) {
          this.selectionManager.clear();
        }
        break;
      }
      default: {
        this.host.commandService.execute([{
          name: leftMouseButton,
          payload: {
            selectionIds: this.selectionIds[sid],
            position: {
              x: data.screenX,
              y: data.screenY,
            },
          }
        }])
      }
    }
  }

  public render() {
    this.resize();
    this.root.html('').width(800).height(800).css('position', 'relative');
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
    const pyramidRotate = options.statePyramid === 'dynamic'
      ? {
        'transform': `rotateX(${0}deg) rotateY(${0}deg) rotateZ(${0}deg)`
      }
      : {
        'transform': `rotateX(${options.xRotateDeg}deg) rotateY(${options.yRotateDeg}deg) rotateZ(${options.zRotateDeg}deg)`
      }
    let pyramidContainer = $('<div class="a3d">').css({ ...pyramidRotate }).appendTo(container);

    const pauseRetateY = (deg = 0) => {
      if (isActive) {
        const rotateDirection = options.rotateDirection === 'positive' ? deg : -deg;
        pyramidContainer.css({ "transform": `rotateY(${rotateDirection}deg)`, 'transition': `transform 3s ease` })
      }
      setTimeout(() => {
        if (isActive && !document.hidden) {
          deg += -(45)
        }
        pauseRetateY(deg);
      }, Number(options.stopSpeed) * 1000);

    }
    const self = this;
    const continuousRetateY = () => {
      self.renderTimer = requestAnimationFrame(continuousRetateY);
      if (isActive) {
        pyramidContainer
          .css({ 'animation': `${rotateDirection} ${options.rotateSpeed}s linear infinite` })
      } else {
        pyramidContainer.css({ 'animationPlayState': `paused` })
      }
    }
    // control rotate type

    if (options.statePyramid == 'dynamic') {
      options.rotateType === 'pause' ? pauseRetateY(0) : continuousRetateY();
    }


    let xInterval = 1 / (2 * length) * 100;
    let yInterval = 1 / (length) * 100;
    const drawS3d = (pyramidContainer, index, options) => {
      // s3d

      let s3dContainer = $('<div class="s3d">').appendTo(pyramidContainer);



      const stretchAnimate = (interval) => {

        const yInterval = interval ? 0 : options.yInterval;

        const translateY = {
          "transform": `translateY(${-index * Number(yInterval) * 0.1}em)`,
          "transition": `transform ${options.pyramidTime}s ease`
        }

        setTimeout(() => {
          s3dContainer.css({ ...translateY });
          yInterval ? stretchAnimate(yInterval) : stretchAnimate(0);
        }, 3000)
      }
      options.statePyramid === 'stretch' && stretchAnimate(0);
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
      const xRotateDeg = Math.abs(options.xRotateDeg) < 90 || Math.abs(options.xRotateDeg) > 270 ? 0 : 180;
      const zRotateDeg = Math.abs(options.zRotateDeg) < 90 || Math.abs(options.zRotateDeg) > 270 ? 0 : 180;

      for (let i = 0; i < 4; i++) {
        const positionText = options.statePyramid === 'dynamic'
          ? {
            'transform': `translateX(-50%) rotateX(${0}deg) rotateZ(${0}deg)`
          }
          : {
            'transform': `translateX(-50%) rotateX(${0}deg) rotateZ(${zRotateDeg === xRotateDeg ? 0 : zRotateDeg || xRotateDeg}deg)`
          }
        let s2d = $('<div class="s2d">')
          .css({ ...s2dBgColor, 'clipPath': `polygon(${x0}% ${y0}%,  ${x1}% ${y0}%, ${x2}% ${y1}% , ${x3}% ${y1}%)` })
          .appendTo(s3dContainer);
        if (index < length - 1) {
          i === 0 && $('<div class="s2d-text">')
            .text(this.items[index][this.dimensions])
            .click((data) => this.selectEvent(data,index,options))
            .css({ ...positionText, ...options.dimensionsTextStyle, top: `${(length - (index + 1)) * yInterval + (yInterval / 4)}%` })
            .appendTo(s2d);
          i === 1 && $('<div class="s2d-text">')
            .text(this.formatData(this.items[index][this.value],options.detailValueUnit))
            .click((data) => this.selectEvent(data,index,options))
            .css({ ...positionText, ...options.textStyle, top: `${(length - (index + 1)) * yInterval + (yInterval / 4)}%` })
            .appendTo(s2d);
          
        } else {
          s2d.css({ 'visibility': options.pyramidSharp ? 'visiable' : 'hidden' })
        }
      }

      $('<div class="s2d">')
        .css({
          ...s2dBgColor,
          // 'background': '#000',
          'width': `${(x1 - x0) * 0.01 * 17.5}em`,
          'height': `${(x1 - x0) * 0.01 * 17.5}em`,
          'transform': `translateY(${-(17 + 9 * index)}%) rotateX(90deg) translateX(${-(43 - (2 * index + 1))}%)`
        })
        // .appendTo(s3dContainer);

    }
    for (let i = 0; i < length; i++) {
      drawS3d(pyramidContainer, i, options)
    }

  }

  // public formatData = (number, dataUnit, dataType) => {
  //   let format = number
  //   // const dataUnit = options.totalValueUnit
  //   const units = [{
  //     value: 1,
  //     unit: ''
  //   },
  //   {
  //     value: 100,
  //     unit: '百'
  //   }, {
  //     value: 1000,
  //     unit: '千'
  //   }, {
  //     value: 10000,
  //     unit: '万'
  //   }, {
  //     value: 100000,
  //     unit: '十万'
  //   }, {
  //     value: 1000000,
  //     unit: '百万'
  //   }, {
  //     value: 10000000,
  //     unit: '千万'
  //   }, {
  //     value: 100000000,
  //     unit: '亿'
  //   }, {
  //     value: 1000000000,
  //     unit: '十亿'
  //   }, {
  //     value: 100000000000,
  //     unit: '万亿'
  //   }]
  //   const formatUnit = units.find((item) => item.value === Number(dataUnit))
  //   format = (format / formatUnit.value).toFixed(2)

  //   if (dataType === 'number') {
  //     format = format.toLocaleString()
  //   } else if (dataType === '%') {
  //     format = format + dataType
  //   } else {
  //     format = dataType + format
  //   }
  //   return format + formatUnit.unit
  // }

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
    let width = 600,
      height = 274,
      winWidth = $(window).width(),
      winHeight = $(window).height(),
      xZoom = winWidth / width,
      yZoom = winHeight / height,
      zoom = Math.min(xZoom, yZoom);

    const ua = navigator.userAgent;
    if (ua.indexOf("Firefox") != -1) {
      this.root.css({ 'transform': `scaleX(${xZoom}) scaleY(${yZoom}) translate(-50%, -50%)`, 'transformOrigin': 'top left' });
    } else {
      this.root.css({ 'transform': ` scaleX(${xZoom}) scaleY(${yZoom}) translate(-50%, -50%)`, 'transformOrigin': 'top left' });
    }
  };

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<any> = []

    // state pyramid
    if (options.properties.statePyramid === 'static') {
      hiddenOptions = hiddenOptions.concat(['rotateType', 'rotateSpeed', 'stopSpeed', 'rotateDirection', 'yInterval', 'pyramidTime'])
    }

    if (options.properties.statePyramid === 'dynamic') {
      hiddenOptions = hiddenOptions.concat(['xRotateDeg', 'yRotateDeg', 'zRotateDeg', 'rotateDirection', 'yInterval', 'pyramidTime'])
    }

    if (options.properties.statePyramid === 'stretch') {
      hiddenOptions = hiddenOptions.concat(['rotateType', 'rotateSpeed', 'stopSpeed', 'rotateDirection', 'rotateDirection'])
    }

    // rotate type
    if (!options.properties.rotateType) {
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

  //数据格式
  private formatData (number,realDisplayUnit) {
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
    const formatUnit = units.find((item) => item.value === Number(realDisplayUnit))
    format = (format / formatUnit.value).toFixed(2)
    const formatService = this.host.formatService;
    return formatService.format(this.format, format,realDisplayUnit)+ formatUnit.unit;
  }

  
}