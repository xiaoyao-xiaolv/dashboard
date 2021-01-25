import '../style/visual.less';
import { myTooltipC } from './myTooltip.js'
import * as echarts from 'echarts';
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

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private myTooltip: any;
  private config: any;
  private locationName: any;
  private valuesName: any;
  private long: any;
  private lat: any;
  private hourIndex: any;
  private fhourTime: any;
  private items: any;
  private shadowDiv: any;
  private bindCoords: boolean;
  private tooltipFields: any;

  static mockItems = [
    { name: "福州", value: [119.306239, 26.075302, 13] }
    , { name: "太原", value: [112.549248, 37.857014, 71] }
    , { name: "长春", value: [125.3245, 43.886841, 228] }
    , { name: "重庆", value: [106.504962, 29.533155, 171] }
    , { name: "西安", value: [108.948024, 34.263161, 80] }
    , { name: "成都", value: [104.065735, 30.659462, 71] }
    , { name: "常州", value: [119.946973, 31.772752, 128] }
    , { name: "北京", value: [116.405285, 39.904989, 71] }
    , { name: "北海", value: [118.016974, 37.383542, 27] }
    , { name: "海口", value: [110.33119, 20.031971, 8] }
    , { name: "包头", value: [109.840405, 40.658168, 106] }
    , { name: "昆明", value: [102.712251, 25.040609, 77] }
    , { name: "广州", value: [113.280637, 23.125178, 55] }
    , { name: "郑州", value: [113.665412, 34.757975, 7] }
    , { name: "长沙", value: [112.982279, 28.19409, 95] }
  ];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
    this.container.firstElementChild.setAttribute('style','height : 0');
    this.items = [];
    this.properties = {
    };
    this.hourIndex = 0;
    this.fhourTime = null;
    this.config = {
      priority: 'top',        // 默认在点上方OR下方（top/bottom）
      partition: 2,         // 左右分割比例
      lineColor: 'rgba(253, 129, 91, 0.8)',      // 引导线颜色
      offset: [5, 5],
      L1: {
        time: 0.2,          // L1动画时长(单位s)
        long: 40            // L1长度
      },
      L2: {
        time: 0.2,
        long: 40
      }
    }
    this.myTooltip = new myTooltipC('visualDom', this.config);
    this.auto_tooltip();
    this.bindCoords = false;
  }

  private queryData = (keyWord: string) => {
    var reg = new RegExp(keyWord);
    for (var i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }
  }

  private convertData = (data: any) => {
    let res = [];
    for (let i = 0; i < data.length; i++) {
      let dataItem = data[i];
      let valueObj = {
        name: dataItem[this.locationName],
        valueInfo: {
          valueName : this.valuesName,
          value : dataItem[this.valuesName]
        }
      };

      let geoCoord;
      if (this.bindCoords) {
        geoCoord = [dataItem[this.long], dataItem[this.lat]];
      } else {
        geoCoord = this.queryData(dataItem[this.locationName]);
      }

      if (geoCoord) {
        valueObj['value'] = geoCoord.concat(dataItem[this.valuesName]);
      }

      let tooltips;
      if (this.tooltipFields.length) {
        tooltips = this.tooltipFields.map((filed) => {
          return {
            filed : filed,
            value : dataItem[filed]
          }
        });
        valueObj['tooltipFields'] = tooltips;
      }
      res.push(valueObj);
    }
    return res;
  }


  public update(options: VisualNS.IVisualUpdateOptions) {
    this.items = [];
    this.tooltipFields = [];
    let profileItems = options.dataViews[0] && options.dataViews[0].plain.profile;
    if (profileItems && options.dataViews.length) {
      let plainData = options.dataViews[0].plain;
      this.locationName = plainData.profile.location.values[0].display
      this.valuesName = plainData.profile.values.values[0].display;

      this.bindCoords = !!(profileItems.long.values.length && profileItems.lat.values.length);
      if (this.bindCoords) {
        this.long = plainData.profile.long.values[0].display
        this.lat = plainData.profile.lat.values[0].display;
      }

      let toolTipValues = profileItems.tooltipFields.values;
      if (toolTipValues.length) {
        this.tooltipFields = toolTipValues.map(value => value.display);
      }
      this.items = this.convertData(plainData.data);
    }
    this.properties = options.properties;
    this.render();
  }

  private getSymbolSize = (minValue, maxValue) => {
    if (maxValue === minValue) {
      minValue = 0;
    }
    var containerSize = this.container.getBoundingClientRect();
    var width = containerSize.width;
    var height = containerSize.height;
    var min = width > height ? height : width;
    var minSize = min / 70;
    var maxSize = min / 20;
    return function (value) {
      return (maxSize - minSize) / (maxValue - minValue) * (value[2] - minValue) + minSize;
    };
  }

  public render() {
    this.chart.clear();
    this.shadowDiv.style.cssText = '';
    const options = this.properties;
    let myTooltip = this.myTooltip;
    myTooltip.config['text'] = {
      time: 0.3,
      font: `${options.tooltipTextStyle.fontStyle} ${options.tooltipTextStyle.fontWeight} ${options.tooltipTextStyle.fontSize} ${options.tooltipTextStyle.fontFamily}`,
      color: options.tooltipTextStyle.color,
      padding: [options.tooltipPadding.top, options.tooltipPadding.right, options.tooltipPadding.bottom, options.tooltipPadding.left ],
      width: options.tooltipWidth,
      height: options.tooltipHeight,
      lineHeight: 24,
      backgroundColor: options.tooltipBackgroundColor,
      borderColor: options.tooltipBorderColor,
      borderWidth: 1,
      angle: {
        width: 2,
        long: 15
      }
    }
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    let locationName = isMock ? '地点' : this.locationName;
    let valuesName = isMock ? '数量' : this.valuesName;
    this.container.style.opacity = isMock ? '0.3' : '1';
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
    var maxValue = Math.max.apply(null, items.map(function (item) {
      return item.value[2];
    }));
    var minValue = Math.min.apply(null, items.map(function (item) {
      return item.value[2];
    }));
    var symbolSize = this.getSymbolSize(minValue, maxValue);
    let temp = [];
    temp.push(
      {
        type: 'map',
        roam: false,
        label: {
          show: false,
        },
        emphasis: {
          textStyle: {
            color: 'rgb(183,185,14)'
          }
        },
        itemStyle: {
          borderColor: options.borderColor,
          borderWidth: 1,
          areaColor: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.8,
            colorStops: [{
              offset: 0,
              color: options.startColor
            }, {
              offset: 1,
              color: options.endColor
            }],
          },
          emphasis: {
            areaColor: options.emphasisColor,
            borderWidth: 0.1
          }
        },
        zoom: 1.2,
        map: options.mapName
      }
    );
    if (options.symbolStyle == 'effectScatter') {
      temp.push({
        name: '气泡地图',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: items,
        symbolSize: symbolSize,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: options.symbolColor,
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      });
    } else {
      temp.push({
        name: '点地图',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbol: 'pin',
        symbolSize: [50, 50],
        label: {
          normal: {
            show: options.showLabel,
            textStyle: {
              color: options.textColor,
              fontSize: options.textFont,
            },
            formatter(value) {
              return value.data.value[2]
            }
          }
        },
        itemStyle: {
          normal: {
            color: options.symbolColor, //标志颜色
          }
        },
        data: items,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        zlevel: 1
      });
    }

    function tooltipTemplate(data) {
      let locationStr = `${data.name}\n`;
      let tooltipStr = '';
      let valueStr = `${data.valueInfo.valueName} : ${data.valueInfo.value}\n`;
      if (data.tooltipFields) {
        data.tooltipFields.forEach((tooltip) => {
          tooltipStr = tooltipStr + `${tooltip.filed} : ${tooltip.value}\n`;
        })
      }
      return `${locationStr}${valueStr}${tooltipStr}`;
    }

    var option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'transparent',
        position(pos: any) {
          let position = myTooltip.getPosOrSize('pos', pos)
          return position
        },
        formatter(params: any) {
          if (params.seriesType != "map") {
            let text = tooltipTemplate(params.data);
            return myTooltip.getTooltipDom(text);
          }
        }
      },
      legend: {
        show: false
      },
      geo: {
        map: options.mapName,
        zoom: 1.2,
        roam: false,
        itemStyle: {
          shadowColor: options.shadowColor,
          shadowOffsetX: 10,
          shadowOffsetY: 11
        },
        regions: [{
          name: '南海诸岛',
          itemStyle: {
            opacity: 0,
          },
        }],
      },
      series: temp
    }
    this.chart.setOption(option);
  }

  private auto_tooltip() {
    this.chart.dispatchAction({
      type: "showTip",
      seriesIndex: 1,
      dataIndex: this.hourIndex
    });
    this.hourIndex++;
    if (this.hourIndex > this.items.length) {
      this.hourIndex = 0;
    }
    //鼠标移入停止轮播
    this.chart.on("mousemove", (e) => {
      clearTimeout(this.fhourTime)
      this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 1,
        dataIndex: e.dataIndex
      });
    })
    //鼠标移出恢复轮播
    this.chart.on("mouseout", () => {
      this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 1,
        dataIndex: this.hourIndex
      });
      this.hourIndex++;
      if (this.hourIndex > this.items.length) {
        this.hourIndex = 0;
      }
    })
    setTimeout(() => { this.auto_tooltip() }, 3000);
  }

  public onDestroy() {
    this.chart.dispose();
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!(options.properties.symbolStyle == 'effectScatter')) {
      return ['pointSize', 'pointMaxSize', 'pointMinSize'];
    }
    return ['showLabel', 'textColor', 'textFont']
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}
