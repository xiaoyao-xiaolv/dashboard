import '../style/visual.less';
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
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private legendData: any;
  private destinationName: string;
  private valuesName: string;
  private departureName: string;
  private destinationlatName: string;
  private destinationlongName: string;
  private departurelatName: string;
  private departurelongName: string;
  private items: any;
  private host: any;
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
    this.container = dom;
    this.chart = echarts.init(dom);
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
    this.container.firstElementChild.setAttribute('style','height : 0');
    this.items = [];
    this.properties = {
      roam: true,
      showLegend: false,
      effect: false,
      pointSize: 6,
      symbolSize: 12,
      period: 6,
      mapName:'china',
      symbolStyle: 'pin',
      symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
      borderColor: 'rgba(147, 235, 248, 1)',
      startColor: 'rgba(147, 235, 248, 0)',
      endColor: 'rgba(147, 235, 248, 0.1)',
      shadowColor: 'rgba(128, 217, 248, 1)',
      emphasisColor: '#389BB7',
    };
    this.host = host;
    this.bindEvents();
  }

  public bindEvents = () => {
    this.chart.on('click', (params) => {
      if (params.componentSubType !== 'effectScatter') return;
      let dataIndex = params.dataIndex;
      let sid = this.items[0][dataIndex] && this.items[0][dataIndex].selectionId || 0;

      this.host.commandService.execute([{
        name: 'Jump',
        payload: {
          selectionIds: [sid],
          position: {
            x: params.event.event.x,
            y: params.event.event.y,
          },
        },
      }]);
    })
  }

  private queryData = (keyWord: string) => {
    var reg = new RegExp(keyWord);
    for (var i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }
  }

  private convertData = (data: number[]) => {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = this.queryData(dataItem[this.departureName]);
      var toCoord = this.queryData(dataItem[this.destinationName]);
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[this.departureName],
          toName: dataItem[this.destinationName],
          coords: [fromCoord, toCoord],
          value: dataItem[this.valuesName]
        });
      }
    }
    return res;
  };

  private classify = (arr: any) => {
    let obj = {}
    arr.map(v => {
      obj[v[this.departureName]] = 0
    })
    let nameArr = Object.keys(obj)
    this.legendData = nameArr
    let result = [];
    nameArr.map(v => {
      let temp = this.convertData(arr.filter(_v => v == _v[this.departureName]));
      if (temp.length) {
        result.push(temp)
      }
    })
    return result
  }

  private convertData1 = (data: number[]) => {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = [dataItem[this.departurelongName],dataItem[this.departurelatName]];
      var toCoord = [dataItem[this.destinationlongName],dataItem[this.destinationlatName]];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[this.departureName],
          toName: dataItem[this.destinationName],
          coords: [fromCoord, toCoord],
          value: dataItem[this.valuesName]
        });
      }
    }
    return res;
  };
  private classify1 = (arr: any) => {
    let obj = {}
    arr.map(v => {
      obj[v[this.departureName]] = 0
    })
    let nameArr = Object.keys(obj)
    this.legendData = nameArr
    let result = [];
    nameArr.map(v => {
      let temp = this.convertData1(arr.filter(_v => v == _v[this.departureName]));
      if (temp.length) {
        result.push(temp)
      }
    })
    return result
  }

  private parseData = (arr: any) => {
    let result = [];
    arr.map(a => {
      result.push({
        name: a.toName,
        value: a.coords[1].concat(a.value)
      })
    });
    result.push({
      name: arr[0].fromName,
      value: arr[0].coords[0].concat(0)
    })
    return result
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.values.values.length && dataView.plain.profile.departure.values.length && dataView.plain.profile.destination.values.length &&
      dataView.plain.profile.departurelat.values.length && dataView.plain.profile.departurelong.values.length &&
      dataView.plain.profile.destinationlong.values.length && dataView.plain.profile.destinationlat.values.length) {
      const plainData = dataView.plain;
      this.destinationName = plainData.profile.destination.values[0].display
      this.valuesName = plainData.profile.values.values[0].display;
      this.departureName = plainData.profile.departure.values[0].display
      this.destinationlatName = plainData.profile.destinationlat.values[0].display
      this.destinationlongName = plainData.profile.destinationlong.values[0].display;
      this.departurelatName = plainData.profile.departurelat.values[0].display
      this.departurelongName = plainData.profile.departurelong.values[0].display
      this.items = this.classify1(plainData.data);
    } else if (dataView) {
      const plainData = dataView.plain;
      this.destinationName = plainData.profile.destination.values[0].display
      this.valuesName = plainData.profile.values.values[0].display;
      this.departureName = plainData.profile.departure.values[0].display
      this.items = this.classify(plainData.data);
    }

    if (this.items.length && this.items[0]) {
      this.items[0].forEach((item) => {
        const selectionId = this.host.selectionService.createSelectionId();
        selectionId.withDimension(dataView.plain.profile.values.values[0], item);
        item.selectionId= selectionId;
      })
    }
    this.properties = options.properties;
    this.render();
  }

  public render() {
    this.chart.clear();
    this.shadowDiv.style.cssText = '';
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
    let planePath = options.effect ? options.symbol : options.symbolStyle;
    let departureValue = isMock ? ['北京', '上海', '广州市'] : this.legendData;
    let color = isMock ? ['#a6c84c', '#ffa022', '#46bee9'] : options.palette;
    var series = [];
    items.map((item: any, i: number) => {
      if (item.length) {
        let j = i % color.length;
        series.push(
          {
            name: item[0].fromName,
            type: 'lines',
            zlevel: 1,
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
                width: 0.1,
                curveness: 0.2
              }
            },
            data: item
          },
          {
            name: item[0].fromName,
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'arrow'],
            symbolSize: 10,
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
            coordinateSystem: 'geo',
            zlevel: 2,
            rippleEffect: {
              brushType: 'stroke'
            },
            label: {
              normal: {
                show: true,
                position: "right", //显示位置
                offset: [5, 0], //偏移设置
                formatter: "{b}" //圆环显示文字
              },
              emphasis: {
                show: true
              }
            },
            symbolSize: options.pointSize,
            itemStyle: {
              normal: {
                color: color[j]
              }
            },
            data: this.parseData(item)
          }
        );
      }
    });
    var option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params, ticket, callback) {
          if (params.seriesType == "lines") {
            return params.data.fromName + " --> " + params.data.toName + "<br />" + params.data.value;
          } else {
            return params.name;
          }

        }
      },
      legend: {
        show: options.showLegend,
        orient: 'vertical',
        top: 'bottom',
        left: 'right',
        data: departureValue,
        textStyle: {
          color: '#fff'
        },
        selectedMode: 'multiple',
      },
      geo: {
        map: options.mapName,
        label: {
          emphasis: {
            sfalsehow: true,
            color: '#fff'
          }
        },
        roam: options.roam,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "125%",
        itemStyle: {
          normal: {
            borderColor: options.borderColor,
            borderWidth: 1,
            areaColor: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [{
                offset: 0,
                color: options.startColor // 0% 处的颜色
              }, {
                offset: 1,
                color: options.endColor // 100% 处的颜色
              }],
              // globalCoord: true // 缺省为 false
            },
            shadowColor: options.shadowColor,
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10
          },
          emphasis: {
            areaColor: options.emphasisColor,
            borderWidth: 0
          }
        }
      },
      series: series
    };
    this.chart.setOption(option);
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: any): string[] {
    if (!updateOptions.properties.effect) {
      return ['symbol'];
    }
    return ['symbolStyle'];
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}