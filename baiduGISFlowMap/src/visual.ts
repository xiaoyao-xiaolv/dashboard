import '../style/visual.less';
import * as echarts from 'echarts';
import { registerBmap } from 'echarts-bmap';
// @ts-ignore
import BMap from 'BMap';
import geoCoordMap from './geoCoordMap.json';

let ins;
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private legendData: any;
  private destinationName: string;
  private valuesName: string;
  private originName: string;
  private destinationLatName: string;
  private destinationLongName: string;
  private originLatName: string;
  private originLongName: string;
  private originResultData: any;
  private isAllBound: boolean;
  private shadowDiv: any;
  static mockItems = [
    [
      { fromName: "广州", toName: "福州", coords: [[113.280637, 23.125178], [119.306239, 26.075302]], value: 13 }
      , { fromName: "广州", toName: "太原", coords: [[113.280637, 23.125178], [112.549248, 37.857014]], value: 71 }
      , { fromName: "广州", toName: "长春", coords: [[113.280637, 23.125178], [125.3245, 43.886841]], value: 82 }
      , { fromName: "广州", toName: "重庆", coords: [[113.280637, 23.125178], [106.504962, 29.533155]], value: 56 }
      , { fromName: "广州", toName: "西安", coords: [[113.280637, 23.125178], [125.14904, 42.927]], value: 80 }
      , { fromName: "广州", toName: "成都", coords: [[113.280637, 23.125178], [104.065735, 30.659462]], value: 71 }
      , { fromName: "广州", toName: "常州", coords: [[113.280637, 23.125178], [119.946973, 31.772752]], value: 30 }
      , { fromName: "广州", toName: "北京", coords: [[113.280637, 23.125178], [116.405285, 39.904989]], value: 69 }
      , { fromName: "广州", toName: "北海", coords: [[113.280637, 23.125178], [118.016974, 37.383542]], value: 27 }
      , { fromName: "广州", toName: "海口", coords: [[113.280637, 23.125178], [110.33119, 20.031971]], value: 8 }
    ],
    [
      { fromName: "上海", toName: "长春", coords: [[121.472644, 31.231706], [125.3245, 43.886841]], value: 77 }
      , { fromName: "上海", toName: "重庆", coords: [[121.472644, 31.231706], [106.504962, 29.533155]], value: 21 }
      , { fromName: "上海", toName: "北京", coords: [[121.472644, 31.231706], [116.405285, 39.904989]], value: 95 }
      , { fromName: "上海", toName: "包头", coords: [[121.472644, 31.231706], [109.840405, 40.658168]], value: 83 }
      , { fromName: "上海", toName: "昆明", coords: [[121.472644, 31.231706], [102.712251, 25.040609]], value: 55 }
      , { fromName: "上海", toName: "广州", coords: [[121.472644, 31.231706], [113.280637, 23.125178]], value: 2 }
      , { fromName: "上海", toName: "郑州", coords: [[121.472644, 31.231706], [113.665412, 34.757975]], value: 92 }
      , { fromName: "上海", toName: "长沙", coords: [[121.472644, 31.231706], [112.982279, 28.19409]], value: 7 }
      , { fromName: "上海", toName: "丹东", coords: [[121.472644, 31.231706], [124.383044, 40.124296]], value: 17 }
      , { fromName: "上海", toName: "大连", coords: [[121.472644, 31.231706], [121.618622, 38.91459]], value: 9 }
    ],
    [
      { fromName: "北京", toName: "长春", coords: [[116.405285, 39.904989], [125.3245, 43.886841]], value: 15 }
      , { fromName: "北京", toName: "重庆", coords: [[116.405285, 39.904989], [106.504962, 29.533155]], value: 31 }
      , { fromName: "北京", toName: "常州", coords: [[116.405285, 39.904989], [119.946973, 31.772752]], value: 99 }
      , { fromName: "北京", toName: "包头", coords: [[116.405285, 39.904989], [109.840405, 40.658168]], value: 20 }
      , { fromName: "北京", toName: "广州", coords: [[116.405285, 39.904989], [113.280637, 23.125178]], value: 60 }
      , { fromName: "北京", toName: "大连", coords: [[116.405285, 39.904989], [121.618622, 38.91459]], value: 98 }
      , { fromName: "北京", toName: "上海", coords: [[116.405285, 39.904989], [121.472644, 31.231706]], value: 63 }
      , { fromName: "北京", toName: "南宁", coords: [[116.405285, 39.904989], [108.320004, 22.82402]], value: 14 }
      , { fromName: "北京", toName: "南昌", coords: [[116.405285, 39.904989], [115.892151, 28.676493]], value: 34 }
      , { fromName: "北京", toName: "拉萨", coords: [[116.405285, 39.904989], [91.132212, 29.660361]], value: 82 }
    ]
  ]

  constructor(dom: HTMLDivElement, host: any) {
    registerBmap(echarts);
    this.container = dom;
    this.originResultData = [];
    this.isAllBound = false;
    this.properties = {
      zoom: 4,
      zoomEnable: true,
      centerEnable: false,
      showLegend: false,
      longitude: 108.948024,
      latitude: 34.263161,
      effect: false,
      pointSize: 6,
      symbolSize: 12,
      period: 6,
      mapName: '中国',
      symbolStyle: 'pin',
      symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
    };
    this.chart = echarts.init(this.container);
    ins = this;
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
  }

  private getCoords = (keyWord: string) => {
    let reg = new RegExp(keyWord);
    for (let i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }
  }

  private convertData = (originRawData: number[]) => {
    let result = [];
    originRawData.forEach((dataItem) => {
      let fromCoords;
      let toCoords;
      if (this.isAllBound) {
        fromCoords = [dataItem[this.originLongName],dataItem[this.originLatName]];
        toCoords = [dataItem[this.destinationLongName],dataItem[this.destinationLatName]];
      } else {
        fromCoords = this.getCoords(dataItem[this.originName]);
        toCoords = this.getCoords(dataItem[this.destinationName]);
      }
      // @ts-ignore
      if (fromCoords && toCoords) {
        result.push({
          fromName: dataItem[this.originName],
          toName: dataItem[this.destinationName],
          coords: [fromCoords, toCoords],
          value: dataItem[this.valuesName]
        });
      }
    });
    return result;
  };

  private prepareOriginData = (rawData: any) => {
    let originSet = new Set();
    rawData.forEach((data) => {
      originSet.add(data[this.originName]);
    })

    let originArray = Array.from(originSet);
    this.legendData = originArray;

    let originResultData = [];
    originArray.forEach((origin) => {
      let originRawData = rawData.filter(data => data[this.originName] === origin);
      let originData = this.convertData(originRawData);
      originResultData.push(originData);
    });
    return originResultData;
  }

  private prepareData = (itemArr: any) => {
    let result = [];
    itemArr.forEach(data => {
      result.push({
        name: data.toName,
        value: data.coords[1].concat(data.value)
      })
    });
    result.push({
      name: itemArr[0].fromName,
      value: itemArr[0].coords[0].concat(0)
    });
    return result;
  }

  private getBoundStatus = (items) => {
    if (!items) {
      return;
    }
    for (let key in items) {
      if (!items[key].values.length) {
        this.isAllBound = false;
        return;
      }
      this.isAllBound = true;
    }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    let profileItems = options.dataViews[0] && options.dataViews[0].plain.profile;
    this.getBoundStatus(profileItems);
    this.originResultData = [];
    if (profileItems && options.dataViews.length) {
      let plainData = options.dataViews[0].plain;
      this.destinationName = profileItems.destination.values[0].display;
      this.valuesName = profileItems.values.values[0].display;
      this.originName = profileItems.origin.values[0].display;
      if (this.isAllBound) {
        this.destinationLatName = profileItems.destinationLat.values[0].display;
        this.destinationLongName = profileItems.destinationLong.values[0].display;
        this.originLatName = profileItems.originLat.values[0].display;
        this.originLongName = profileItems.originLong.values[0].display;
      }
      this.originResultData = this.prepareOriginData(plainData.data);
    }
    this.properties = options.properties;
    this.render();
  }

  public render() {
    this.chart.clear();
    let isMock = !this.originResultData.length;
    let originItems = isMock ? Visual.mockItems : this.originResultData;
    let options = this.properties;
    let planePath = options.effect ? options.symbol : options.symbolStyle;
    let originValues= isMock ? ['北京', '上海', '广州市'] : this.legendData;
    let color = isMock ? ['#a6c84c', '#ffa022', '#46bee9'] : options.palette;
    this.container.style.opacity = isMock ? '0.3' : '1';
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
    let series = [];
    originItems.map((item: any, i: number) => {
      if (item.length) {
        let j = i % color.length;
        series.push(
          {
            name: item[0].fromName,
            type: 'lines',
            zlevel: 5,
            coordinateSystem: 'bmap',
            effect: {
              show: true,
              period: options.period,
              trailLength: 0.7,
              color: color[j],
              symbolSize: 4
            },
            lineStyle: {
              normal: {
                color: color[j],
                width: 0,
                curveness: 0.2
              }
            },
            data: item
          },
          {
            name: item[0].fromName,
            type: 'lines',
            zlevel: 11,
            coordinateSystem: 'bmap',
            effect: {
              show: true,
              period: options.period,
              trailLength: 0,
              symbol: planePath,
              symbolSize: options.symbolSize
            },
            lineStyle: {
              normal: {
                color: color[j],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: item
          },
          {
            name: item[0].fromName,
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            zlevel: 12,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },
            symbolSize: options.pointSize,
            showEffectOn: 'render',
            itemStyle: {
              normal: {
                color: color[j]
              }
            },
            data: this.prepareData(item)
          }
        );
      }
    });

    let bmap = {
      resizeEnable: true,
      zoom:options.zoom,
      roam: options.zoomEnable,
      mapStyle: {style : options.mapStyle},
    }
    if (options.centerEnable) {
      bmap['center'] = [options.longitude, options.latitude];
    }

    let option = {
      bmap: bmap,
      tooltip: {
        trigger: 'item',
        formatter: function (params, ticket, callback) {
          if (params.seriesType == "lines") {
            return params.data.fromName + " -> " + params.data.toName + "<br />" + params.data.value;
          } else {
            return params.name;
          }
        },
        backgroundColor : options.tooltipBackgroundColor,
        borderColor : options.tooltipBorderColor,
        borderWidth : options.tooltipBorderWidth,
        padding : [options.tooltipPadding.top, options.tooltipPadding.right, options.tooltipPadding.bottom, options.tooltipPadding.left ],
        textStyle: {
          ...options.tooltipTextStyle,
          fontSize: parseFloat(options.tooltipTextStyle.fontSize),
        },
        extraCssText: `
                        background-image:url(${options.tooltipBackgroundImage});
                        width: ${options.tooltipWidth}px;
                        height: ${options.tooltipHeight}px;
                        box-sizing: border-box;
                        background-size:100% 100%;
                      `,
      },
      legend: {
        show: options.showLegend,
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: originValues,
        textStyle: {
          color: '#fff'
        },
        selectedMode: 'multiple',
      },
      geo: {
        map: 'bmap',
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
    let map = this.chart.getModel().getComponent('bmap').getBMap();
    function getBoundary(){
      if (options.mapName === 'world') {
        map.setZoom(3);
        return;
      }
      let boundary = new BMap.Boundary();
      boundary.get(options.mapName, function(rs){
        let count = rs.boundaries.length;
        let pointArray = [];
        for (let i = 0; i < count; i++) {
          let ply = new BMap.Polygon(rs.boundaries[i],
              {
                strokeWeight: 2,
                fillColor:options.fillColor,
                fillOpacity: 0,
                strokeColor: options.boundColor
              });
          map.addOverlay(ply);
          pointArray = pointArray.concat(ply.getPath());
        }
        if (!options.centerEnable) {
          let centerPosition = ins.getCoords(options.mapName);
          map.setCenter(centerPosition);
        }
      });
    }
    getBoundary();
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: any): string[] {
    let properties = updateOptions.properties;
    let hiddenStates = [];
    let hiddenEffect = properties.effect ? 'symbolStyle' : 'symbol';
    hiddenStates.push(hiddenEffect);
    if (!properties.centerEnable) {
      hiddenStates.push('latitude','longitude');
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