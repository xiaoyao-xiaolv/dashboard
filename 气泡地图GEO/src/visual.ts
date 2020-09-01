import '../style/visual.less';
import * as echarts from 'echarts';
import "echarts-amap";
// @ts-ignore
import AMap from 'AMap';
import geoCoordMap from './geoCoordMap.json';
// import { myTooltipC } from './myTooltip.js'

let loaded = false;
let ins;
(window as any).__init = function() {
  loaded = true;
  if(ins) {
    ins.init();
  }
}

export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  // private myTooltip: any;
  private locationName: any;
  private valuesName: any;
  private longitude: any;
  private latitude: any;
  private items: any;
  private isBoundCoords: boolean;
  private static mockItems = [
      { name: "太原", value: [119.306239, 26.075302, 13] }
    , { name: "福州", value: [112.549248, 37.857014, 71] }
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

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.isBoundCoords = false;
    // this.myTooltip = new myTooltipC('visualDom');
    ins = this;
  }

  init() {
    this.chart = echarts.init(this.container);
    this.render();
  }

  private getCoords = (keyWord: string) => {
    let reg = new RegExp(keyWord);
    for (let i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }
  }

  private convertData = (dataItems: any) => {
    let res = [];
    dataItems.forEach((dataItem) => {
      let geoCoord;
      if (this.isBoundCoords) {
        geoCoord = [dataItem[this.longitude], dataItem[this.latitude]];
      } else {
        geoCoord = this.getCoords(dataItem[this.locationName]);
      }

      if (geoCoord) {
        res.push({
          name: dataItem[this.locationName],
          value: geoCoord.concat(dataItem[this.valuesName])
        });
      }
    })

    return res;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.items = [];
    let profileItems = options.dataViews[0] && options.dataViews[0].plain.profile;
    if (profileItems && options.dataViews.length) {
      let plainData = options.dataViews[0].plain;
      this.valuesName = profileItems.values.values[0].display;
      this.isBoundCoords = !!(profileItems.longitude.values.length && profileItems.latitude.values.length);
      this.locationName = profileItems.location.values[0].display;
      if (this.isBoundCoords) {
        this.longitude = profileItems.longitude.values[0].display;
        this.latitude = profileItems.latitude.values[0].display;
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
    let containerSize = this.container.getBoundingClientRect();
    let width = containerSize.width;
    let height = containerSize.height;
    let min = width > height ? height : width;
    let minSize = min / 70;
    let maxSize = min / 20;
    return function (value) {
      return (maxSize - minSize) / (maxValue - minValue) * (value[2] - minValue) + minSize;
    };
  }

  public render() {
    if (!loaded) {
      return;
    }
    this.chart.clear();
    // let myTooltip = this.myTooltip;
    let options = this.properties;
    let isMock = !this.items.length;
    let items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.5' : '1';
    let maxValue = Math.max.apply(null, items.map(function (item) {
      return item.value[2];
    }));
    let minValue = Math.min.apply(null, items.map(function (item) {
      return item.value[2];
    }));
    let symbolSize = this.getSymbolSize(minValue, maxValue);
    let series = [
      {
        type: 'scatter',
        coordinateSystem: 'amap',
        data: items,
        symbolSize: symbolSize,
        symbol: options.symbol,
        itemStyle: {
          normal: {
            color: options.symbolColor
          }
        }
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'amap',
        data: items,
        symbolSize: symbolSize,
        symbol: options.symbol,
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
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
            color: options.symbolColor,
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        zlevel: 1
      },
    ];

    if (options.showRankData) {
      let rankItems = items.sort(function (a, b) {
        if (options.rank === 'top') {
          return b.value[2] - a.value[2];
        } else {
          return a.value[2] - b.value[2];
        }
      }).slice(0, options.level);
      series.push(
          {
            type: 'effectScatter',
            coordinateSystem: 'amap',
            data: rankItems,
            symbolSize: symbolSize,
            symbol: options.symbol,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
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
                color: options.rankSymbolColor,
                shadowBlur: 10,
                shadowColor: '#333'
              }
            },
            zlevel: 1
          }
      )
    }

    let amap = {
      resizeEnable: true,
      zoom:options.zoom,//级别
      zoomEnable: options.zoomEnable,
      mapStyle: `amap://styles/${options.mapStyle}`,
    }
    if (options.centerEnable) {
      amap['center'] = [options.longitude, options.latitude];
    }
    // let locationName = isMock ? '地点' : this.locationName;
    // let valuesName = isMock ? '数量' : this.valuesName;
    let option = {
      amap: amap,
      // tooltip: {
      //   trigger: 'item',
      //   // triggerOn: 'click',
      //   backgroundColor: 'transparent',
      //   position(pos: any) {
      //     let position = myTooltip.getPosOrSize('pos', pos)
      //     return position
      //   },
      //   formatter(params: any) {
      //     let text = locationName + ' : ' + params.name + '\n' + valuesName + ' : ' + params.value[2];
      //     let tooltipDom = myTooltip.getTooltipDom(text)
      //     return tooltipDom
      //   }
      // },
      legend: {
        show: false
      },
      geo: {
        map: 'amap',
        type: 'map',
        label: {
          emphasis: {
            show: true,
            color: '#fff'
          }
        }
      },
      series: series
    };
    this.chart.setOption(option);

    // let map = this.chart.getModel().getComponent('amap').getAMap();
    // let polygons = []
    // let district = null;
    // AMap.plugin('AMap.DistrictSearch', function () {
    //   if (options.mapName === 'world') {
    //     map.setZoom(3);
    //     map.remove(polygons);
    //     return;
    //   }
    //   if (!district) {
    //     let opts = {
    //       subdistrict: 0,
    //       extensions: 'all',
    //       level: 'province'
    //     };
    //     district = new AMap.DistrictSearch(opts);
    //   }
    //
    //   if (options.mapName === '中国') {
    //     district.setLevel('country');
    //   }
    //   district.search(options.mapName, function(status, result) {
    //     map.remove(polygons)
    //     polygons = [];
    //     let bounds = result.districtList[0].boundaries;
    //     if (bounds) {
    //       for (let i = 0, l = bounds.length; i < l; i++) {
    //         let polygon = new AMap.Polygon({
    //           map: map,
    //           strokeWeight: 1,
    //           path: bounds[i],
    //           fillOpacity: 0,
    //           strokeColor: options.boundColor,
    //         });
    //         polygons.push(polygon);
    //       }
    //
    //       if (!options.centerEnable) {
    //         let centerPosition = ins.getCoords(options.mapName);
    //         map.setCenter(centerPosition);
    //       }
    //     }
    //   })
    // })
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: any): string[] {
    let properties = updateOptions.properties;
    let hiddenStates = [];
    if (!properties.centerEnable) {
      hiddenStates.push('latitude','longitude');
    }
    if(!properties.showLabel) {
      hiddenStates.push('textColor','textFont');
    }
    if(!properties.showRankData) {
      hiddenStates.push('rank','level', 'rankSymbolColor');
    }
    return hiddenStates;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}