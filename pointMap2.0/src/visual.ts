import '../style/visual.less';
// @ts-ignore
import * as echarts from 'echarts';
import geoCoordsMap from './geoCoordMap.json';
import "echarts/map/js/china.js";
import "echarts/map/js/world.js";
import "echarts/map/js/province/anhui.js";
import "echarts/map/js/province/aomen.js";
import "echarts/map/js/province/beijing.js";
import "echarts/map/js/province/chongqing.js";
import "echarts/map/js/province/fujian.js";
import "echarts/map/js/province/gansu.js";
import "echarts/map/js/province/guangdong.js";
import "echarts/map/js/province/guangxi.js";
import "echarts/map/js/province/guizhou.js";
import "echarts/map/js/province/hainan.js";
import "echarts/map/js/province/hebei.js";
import "echarts/map/js/province/heilongjiang.js";
import "echarts/map/js/province/henan.js";
import "echarts/map/js/province/hubei.js";
import "echarts/map/js/province/hunan.js";
import "echarts/map/js/province/jiangsu.js";
import "echarts/map/js/province/jiangxi.js";
import "echarts/map/js/province/jilin.js";
import "echarts/map/js/province/liaoning.js";
import "echarts/map/js/province/neimenggu.js";
import "echarts/map/js/province/ningxia.js";
import "echarts/map/js/province/qinghai.js";
import "echarts/map/js/province/shandong.js";
import "echarts/map/js/province/shanghai.js";
import "echarts/map/js/province/shanxi.js";
import "echarts/map/js/province/shanxi1.js";
import "echarts/map/js/province/sichuan.js";
import "echarts/map/js/province/taiwan.js";
import "echarts/map/js/province/tianjin.js";
import "echarts/map/js/province/xianggang.js";
import "echarts/map/js/province/xinjiang.js";
import "echarts/map/js/province/xizang.js";
import "echarts/map/js/province/yunnan.js";
import "echarts/map/js/province/zhejiang.js";
import geoCoordMap from './geoCoordMap.json';
import { captureRejectionSymbol } from 'events';

let myChart;
let rawData;
const image = {
  pyramid : 'image://data:image/png;base64,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',
  water: []
}
const getImage = (host, name) => {
  return `image://${host.assetsManager.getImage(name)}`
} 
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private bindCoords: boolean;
  private valuesName: string;
  private locationName: string;
  private longitudeName: string;
  private latitudeName: string;
  private properties: any;
  private resultData: any;
  private locationArr: any;
  private shadowDiv: any;
  private format: any;
  private displayUnit: any;
  private totalValue: any;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    [].push.call(image.water, getImage(host, 'image1'), getImage(host, 'image2'), getImage(host, 'image3'));
    this.container = dom;
    this.host = host;
    this.isMock = true;
    this.bindCoords = false;
    myChart = echarts.init(dom, null ,{ renderer: 'canvas'});
    // myChart = echarts.init(dom, null ,{ renderer: 'svg'});
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
    this.container.style.transform = 'rotate3d(-70, -1, 0, -45deg)';
    this.container.firstElementChild.setAttribute('style','height : 0');
    rawData = [
      {
        name: '北京',
        value: [116.405285, 39.904989],
        datas: 1354,
        img: image.water[0],
      },
      {
        name: '陕西省',
        value: [108.948024, 34.263161],
        datas: 1402,
        img: image.water[1],
      },
      {
        name: '上海',
        value: [121.472644, 31.231706],
        datas: 2468,
        img: image.water[2],
      },
      {
        name: '成都市',
        value: [104.065735, 30.659462],
        datas: 768,
        img: image.water[0],
      },
      {
        name: '武汉市',
        value: [114.298572, 30.584355],
        datas: 589,
        img: image.water[1],
      },
      {
        name: '福州市',
        value: [119.306239, 26.075302],
        datas: 1500,
        img: image.water[2],
      },
    ];
  }

  private getCoords = (keyWord: string) => {
    let reg = new RegExp(keyWord);
    for (let i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }
  }

  private prepareData(data: any) {
    return data.map((item, index) => {
      let geoCoord = this.bindCoords ? [item[this.longitudeName], item[this.latitudeName]] : this.getCoords(item[this.locationName]);
      return {
          name: item[this.locationName],
          value: geoCoord,
          datas: item[this.valuesName],
          img: image.water[index % 3]
      }
    })
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.locationArr = [];
    this.isMock = !options.dataViews.length;
    if (!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      this.valuesName = profile.values.values[0].display;
      this.locationName = profile.location.values[0].display;
      this.bindCoords = !!(profile.longitude.values.length && profile.latitude.values.length);
      if(this.bindCoords) {
        this.longitudeName = profile.longitude.values[0].display;
        this.latitudeName = profile.latitude.values[0].display;
      }
      this.resultData = this.prepareData(bindData);
      // data format and display unit
      this.format = options.dataViews[0].plain.profile.values.options.valueFormat;
      this.displayUnit = options.dataViews[0].plain.profile.values.options.valueDisplayUnit; 
    }
    this.properties = options.properties;
    let renderData = this.isMock ? rawData : this.resultData;
    this.totalValue = renderData.map((_item: any) => _item.datas).reduce((prev, current) => {
      return prev + current;
    });
    this.render(renderData);
  }

  private render(data) {
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    myChart.clear(); 
    this.shadowDiv.style.cssText = '';
    let options = this.properties;
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1; `;
    // add map background
    //  background: url(${options.mapShadowImage})
    // this.container.style.background = `url(${options.mapShadowImage}) center center no-repeat`;
    // this.container.style.backgroundSize = '100% 100%'
    
    const formatList = options.mapCollection;
    const isSymBolChart = options.symbolStyle === 'pyramid' || options.symbolStyle === 'water';
    const formatColor = (defaultColor, value) => {
      if (formatList.length > 0) {
        formatList.map((_item: any) => {
            if (value >= Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
              if (_item.minRank === '[' && _item.maxRank === ']') {
                // _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                defaultColor = _item.formatColor
              }
            }
            if (value >= Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
              if (_item.minRank === '[' && _item.maxRank === ')') {
                defaultColor = _item.formatColor
              }
            }
            if (value > Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
              if (_item.minRank === '(' && _item.maxRank === ']') {
                defaultColor = _item.formatColor
              }
            }
            if (value > Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
              if (_item.minRank === '(' && _item.maxRank === ')') {
                defaultColor = _item.formatColor
              }
            }
        })
      }
      return defaultColor;
    }

    const formatLabelColor = () => {
      const _richStyle = {};
      formatList && formatList.map((_item, _index) => {
        _richStyle[`${_item.minFormatValue}To${_item.maxFormatValue}`] = {
          padding: [5, 0],
          color: _item.formatColor,
          fontSize: parseInt(options.tooltipTextStyle.fontSize.slice(0, -2))
        }
      })
      return _richStyle;
    }

    const labelOptions = () => {
      return {
        normal: {
          show: options.showTooltip,
          position: options.symbolStyle === 'water'  || options.symbolStyle === 'pyramid' ? [Number(Math.floor(options.mapSymbolWidth / 2)), -options.tooltipDistance] : 'end',
          borderWidth: 1,
          align: 'center',
          verticalAlign: 'middle',
          borderType: 'solid',
          borderColor: options.tooltipBackgroundType === 'color' ? options.tooltipBorderColor : options.tooltipBgBorderColor,
          borderRadius: options.tooltipBorderRadius,
          padding: [options.tooltipPadding.top, options.tooltipPadding.right, options.tooltipPadding.bottom, options.tooltipPadding.left ],
          fontSize: parseInt(options.tooltipTextStyle.fontSize.slice(0, -2)),
          fontFamily: options.tooltipTextStyle.fontFamily,
          fontStyle: options.tooltipTextStyle.fontStyle,
          fontWeight: options.tooltipTextStyle.fontWeight,
          backgroundColor: options.tooltipBackgroundType === 'color' ? options.tooltipBackgroundColor : { image: options.tooltipBackgroundImage },
          formatter: (params: any) => {
            let _text = [];
            let value = params.data.datas;
            const _formatRichName = formatList.map((_item: any) => {
              let _name = '';
              if (value >= Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
                if (_item.minRank === '[' && _item.maxRank === ']') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              if (value >= Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
                if (_item.minRank === '[' && _item.maxRank === ')') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              if (value > Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
                if (_item.minRank === '(' && _item.maxRank === ']') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              if (value > Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
                if (_item.minRank === '(' && _item.maxRank === ')') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              return _name;
            }).filter(_item => _item)[0] || 'name';
            const _formatTarget = options.useToLabel ? _formatRichName: 'name';
            if (options.showLocation) {
              let name = params.name;
              _text.push(name)
            }
            if (options.showValue) {
              if (this.isMock) {
                value = value;
              } else {
                let realDisplayUnit = this.displayUnit;
                const formatService = this.host.formatService;
                if (formatService.isAutoDisplayUnit(this.displayUnit)) {
                  realDisplayUnit = formatService.getAutoDisplayUnit(value);
                }
                value = formatService.format(this.format, value, realDisplayUnit)
              }
              _text.push(value)
            }
            const _result = _text.join('\n');
            return `{${_formatTarget}|${_result}}`;
          },
          rich:{
            name:{
              padding: [5, 0],
              color: options.tooltipTextStyle.color,
              fontSize: parseInt(options.tooltipTextStyle.fontSize.slice(0, -2))
            },
            ...formatLabelColor(),
          }
        }
        }
    }
    
    const lineMaxHeight = (type?: string) => {
      const maxValue = Math.max(...data.map(item => item.datas))
      return type ? 14/maxValue : 10/maxValue
    }

    const hexToRgba = (hex, opacity, isLine?: boolean) => {
      const isHex = hex.slice(0, 1) === '#';
      const _opacity = isLine ? (opacity + 0.2) : opacity;
      if (isHex) {
        return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
              + parseInt('0x' + hex.slice(5, 7)) + ',' + _opacity + ')';
      } else {
        // fixed rgba to rgba
        var rgb = hex.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var a = isLine ? (Number(rgb[3].split(')')[0]) + 0.2) : Number(rgb[3].split(')')[0])
        return `rgba(${r}, ${g}, ${b}, ${a})`
      }
    }

    const lineData = (type?: string) => {
      return data.map((item) => {
        return {
          ...item,
          coords: [item.value, [item.value[0], item.value[1] + item.datas * lineMaxHeight(type)]]
        }
      })
    }

    const scatterData = () => {
      return data.map((item) => {
        return [item.value[0], item.value[1] + item.datas * lineMaxHeight(), item.datas]
      })
    }
    // 柱状体的底部
    const scatterData2 = () => {
        return data.map((item) => {
          return {
            name: item.name,
            value: item.value,
            datas:item.datas,
          }
        })
    }
    
    const effectOptions = !isSymBolChart && {
      show: !isSymBolChart ? options.mapBarAnimate : !isSymBolChart,
      period: options.mapBarAnimateTime,
      symbol: options.mapBarAnimateSymbolType === 'default' ? options.mapBarAnimateSymbol : `image://${options.mapBarAnimateImage}`,
      // symbol: 'image://data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7',
      symbolSize: [options.mapBarAnimateSymbolWidth, options.mapBarAnimateSymbolHeight], // 图标大小
      color: options.useToBar && options.mapCollection.length ? '' : options.mapBarAnimateSymbolColorType === 'default' ? options.mapBarColor : options.mapBarAnimateSymbolColor,
      delay: 0,
      trailLength: options.mapBarAnimateSymbolTrailLength / 100,
    }
    const setBarData = [{// 柱状体的主干
      type: 'lines',
      zlevel: 5,
      effect: effectOptions,
      lineStyle: {
        width: options.mapBarWidth, // 尾迹线条宽度
        color: (params: any) => {
          const _value = params.data.datas;
          const _color = options.useToBar ? formatColor(options.mapBarColor, _value) : options.mapBarColor;
          const _lightColor =options.useToBar ? formatColor(options.mapBarHightColor, _value) : options.mapBarHightColor;
          if (options.mapBarClose) return 'rgba(255, 255, 255, 0)';
          return {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: hexToRgba(_color, 0.8),
              },
              {
                offset: 0.2,
                color: hexToRgba(_color, 0.8),
              },
              {
                offset: 0.5,
                color: hexToRgba(_lightColor, 0.8, options.symbolStyle === 'diamond'),
              },
              {
                offset: 0.7,
                color: hexToRgba(_lightColor, 0.8, options.symbolStyle === 'diamond'),
              },
              {
                offset: 1,
                color: hexToRgba(_color, 0.6),
              }
            ],
            global: false // 缺省为 false
          }
        },
        opacity: options.mapBarClose ? 0.1 : 0.1, // 尾迹线条透明度
        curveness: 0 // 尾迹线条曲直度
      },
      animation:false,
      silent: true,
      data: lineData()
    },
    {// 柱状体的主干Label
        type: 'lines',
        zlevel: 6,
        effect: {
          show: false
        },
        lineStyle: {
          with: 0,
          opacity: 0, // 尾迹线条透明度
        },
        label: labelOptions(),
        silent: true,
        data: lineData('lable')
    },
    // 柱状体的顶部
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 5,
      symbol: options.symbolStyle,
      symbolSize: [options.mapBarWidth, options.mapBarWidth / 2],
      itemStyle: {
        color: (params: any) => {
          const _value = params.data[2];
          const _color = options.useToBar? formatColor(options.mapBarColor, _value) : options.mapBarColor;
          return _color; 
        },
        opacity: options.mapBarClose ? 0 : 1
      },
      silent: true,
      data: scatterData()
    },
    // 柱状体的底部
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 4,
      // label: {
      //   // 这儿是处理的
      //   formatter: '{b}',
      //   position: 'bottom',
      //   color: '#fff',
      //   fontSize: 12,
      //   distance: 10,
      //   show: false
      // },
      symbol: options.symbolStyle,
      symbolSize: [options.mapBarWidth, options.mapBarWidth / 2],
      itemStyle: {
        color: (params: any) => {
          const _color = options.useToBar ? formatColor(options.mapBarColor, params.data.datas) : options.mapBarColor;
          return options.mapBarClose ? 'rgba(255, 255, 255, 0)' : _color;
        },
        opacity: 1,
        shadowColor: '#000',
        shadowBlur: 5,
        shadowOffsetY: 2,
      },
      silent: true,
      data: scatterData2()
    },
    // 底部外框
    {
      tooltip: {
        show: false,
      },
      type: 'effectScatter',
      coordinateSystem: 'geo',
      geoIndex: 0,
      zlevel: 4,
      label: {
        show: false
      },
      symbol: 'circle',
      symbolSize: [10, 5],
      rippleEffect: {
        scale: options.mapBarBottomAnimate === 'stroke' ?(options.mapBarBottomAnimateSize + 2): options.mapBarBottomAnimateSize,
        brushType: options.mapBarBottomAnimate,
        period: options.mapBarBottomAnimateTime,
      },
      showEffectOn: 'render',
      itemStyle: {
        color: (params: any) => {
          const _value = params.data.datas;
          const _isBarColor = options.mapBarBottomColorType === 'default' ? options.mapBarColor :  options.mapBarBottomAnimateColor;
          const _color = options.useToBar ?  formatColor(_isBarColor, _value) : _isBarColor;
          return {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0, color: hexToRgba(_color, 0) // 0% 处的颜色
              },
              {
                offset: .75, color: hexToRgba(_color, 0) // 100% 处的颜色
              },
              {
                offset: .751, color: hexToRgba(_color, 1)// 100% 处的颜色
              },
              {
                offset: 1, color: hexToRgba(_color, 1) // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        },
        opacity: 1
      },
      silent: true,
      data: options.mapBarBottomCircle ? scatterData2(): []
    }];
    
    const setSymbolData = [{
      tooltip: {
        show: false,
      },
      type: 'effectScatter',
      coordinateSystem: 'geo',
      zlevel: 4,
      label: {
        show: false,
      },
      symbol: 'circle',
      symbolSize: [20, 10],
      rippleEffect: {
        scale: options.mapBarBottomAnimate === 'stroke' ? (options.mapBarBottomAnimateSize):  (options.mapBarBottomAnimateSize - 2),
        brushType: options.mapBarBottomAnimate,
        period: options.mapBarBottomAnimateTime,
      },
      showEffectOn: 'render',
      itemStyle: {
        normal: {
          shadowColor: '#0ff',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          color: (params: any) => {
            const _value = params.data.datas;
            const _isBarColor = options.mapBarBottomColorType === 'default' ? options.mapBarColor :  options.mapBarBottomAnimateColor;
            const _color = options.useToBar ? formatColor(_isBarColor, _value) : _isBarColor;
            return {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [
                {
                  offset: 0, color: hexToRgba(_color, 0) // 0% 处的颜色
                },
                {
                  offset: .75, color: hexToRgba(_color, 0) // 100% 处的颜色
                },
                {
                  offset: .751, color: hexToRgba(_color, 1)// 100% 处的颜色
                },
                {
                  offset: 1, color: hexToRgba(_color, 1) // 100% 处的颜色
                }
              ],
              global: false // 缺省为 false
            }
          },
        },
      },
      silent: true,
      data:  options.mapBarBottomCircle ? data : [],
    },
    {
      type: 'scatter',
      coordinateSystem: 'geo',
      itemStyle: {
        color: '#f00', 
      },
      symbol: function (value, params) {
        if(options.symbolStyle === 'pyramid') {
          return image.pyramid;
        } else {
          return params.data.img;
        }
      },
      symbolSize: [options.mapSymbolWidth, options.mapSymbolHeight],
      symbolOffset: [0, -options.mapSymbolWidth],
      label: labelOptions(),
      z: 99,
      zlevel: 5,
      data: data,
    }];
    
    const getSeries = () => {
      switch (options.symbolStyle) {
        case 'circle':
          return setBarData;
        case 'diamond':
         return setBarData;
        case 'pyramid':
          return setSymbolData;
        case 'water':
          return setSymbolData;
        default:
          break;
      }
    }

    let mapOption = {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      },
      geo: [{
          map: options.mapName,
          zoom: options.zoom,
          roam: false,
          zlevel: 2,
          layoutSize: '95%',
          layoutCenter: [`${50}%`,`${50}%`],
          itemStyle: {
            normal: {
                areaColor: options.mapColor,
                // areaColor: 'transparent',
                color: () => {
                  return 'red'
                },
                borderColor: options.mapBorderColor,
                borderWidth: 1,
                shadowColor: options.mapBorderShadowColor,
                shadowBlur: 10,
            },
            emphasis: {
                areaColor: options.emphasisColor,
            }
          }
        }, {
        map: options.mapName,
        zoom: options.zoom,
        roam: false,
        zlevel: 1,
        layoutSize: '95%',
        layoutCenter: [`${options.mapShadowX}%`,`${options.mapShadowY}%`],
        // aspectScale: 1.3,
        silent: true,
        itemStyle: {
          normal: {
            areaColor: options.mapShadowColor,
            borderWidth: 0,
          }
        },
        regions: [{
          name: '南海诸岛',
          itemStyle: {
            opacity: 0,
          },
        }]
       
      }],
      series: [{
        type: 'scatter',
        coordinateSystem: 'geo',
        itemStyle: {
          color: 'rgba(255, 255, 255, 0)', 
        },
        symbolSize: [options.mapSymbolWidth, options.mapSymbolHeight],
        symbolOffset: [0, -options.mapSymbolWidth],
        label: {
          // 这儿是处理的
          formatter: '{b}',
          position: 'bottom',
          color: options.mapBarBottomLabelText.color,
          fontSize: parseInt(options.mapBarBottomLabelText.fontSize),
          distance: 20,
          show: options.mapBarBottomLabel
        },
        z: 99,
        zlevel: 5,
        data: data,
       },
        ...getSeries(),
      ],
    };
    myChart.setOption(mapOption);
  }

  public onDestroy() {

  }

  public onResize() {
    myChart.resize();
    let renderData = this.isMock ? rawData : this.resultData;
    this.render(renderData);
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let properties = options.properties;
    let hiddenStates = [];
    if(!properties.showTooltip) {
      [].push.apply(hiddenStates, ['tooltipBackgroundColor', 'tooltipDistance', 'tooltipBorderColor', 'tooltipBgBorderColor', 'tooltipBorderRadius', 'tooltipPadding', 'tooltipTextStyle', 'showLocation', 'showValue', 'tooltipBackgroundType', 'tooltipBackgroundImage'])
    }
    
    if (properties.symbolStyle == 'pyramid' || properties.symbolStyle == 'water') {
      hiddenStates = hiddenStates.concat(['mapBarClose', 'mapBarColor', 'mapBarHightColor', 'mapBarWidth', 'mapBarAnimate', 'mapBarAnimateTime','mapBarAnimateImage', 'mapBarAnimateSymbol', 'mapBarAnimateSymbolColorType', 'mapBarAnimateSymbolColor', 'mapBarAnimateSymbolWidth', 'mapBarAnimateSymbolHeight', 'mapBarAnimateSymbolTrailLength', 'mapBarAnimateSymbolType', 'mapBarAnimateSymbol'])
    }

    if (properties.symbolStyle == 'circle' || properties.symbolStyle == 'diamond') {
      hiddenStates = hiddenStates.concat(['mapSymbolWidth', 'mapSymbolHeight', 'tooltipDistance'])
    }

    if (!properties.mapBarBottomCircle) {
      hiddenStates = hiddenStates.concat(['mapBarBottomAnimate', 'mapBarBottomAnimateColor','mapBarBottomColorType', 'mapBarBottomAnimateSize', 'mapBarBottomAnimateTime'])
    }
    if (properties.tooltipBackgroundType == 'color') {
      hiddenStates = hiddenStates.concat(['tooltipBackgroundImage', 'tooltipBgBorderColor'])
    } else {
      hiddenStates = hiddenStates.concat(['tooltipBackgroundColor', 'tooltipBgBorderColor'])
    }

    if (properties.mapBarAnimateSymbolType == 'default') {
      hiddenStates = hiddenStates.concat(['mapBarAnimateImage'])
    } else {
      hiddenStates = hiddenStates.concat(['mapBarAnimateSymbol', 'mapBarAnimateSymbolColor'])
    }

    if (properties.mapBarAnimateSymbolColorType == 'default') {
      hiddenStates = hiddenStates.concat(['mapBarAnimateSymbolColor'])
    }
    
    if (!properties.mapBarAnimate) {
      hiddenStates = hiddenStates.concat([ 'mapBarAnimateTime','mapBarAnimateImage', 'mapBarAnimateSymbol', 'mapBarAnimateSymbolColorType', 'mapBarAnimateSymbolColor', 'mapBarAnimateSymbolWidth', 'mapBarAnimateSymbolHeight', 'mapBarAnimateSymbolTrailLength', 'mapBarAnimateSymbolType', 'mapBarAnimateSymbol'])
    }
   
    if (properties.mapBarBottomColorType == 'default') {
      hiddenStates = hiddenStates.concat(['mapBarBottomAnimateColor'])
    }
    return hiddenStates;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {

    return null;
  }
}