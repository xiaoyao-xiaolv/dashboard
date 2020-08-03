import '../style/visual.less';
import { myTooltipC, createTooltip } from './myTooltip.js'
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
  private locationName: any;
  private valuesName: any;
  private items: any;
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
    this.chart = echarts.init(dom)
    this.myTooltip = new myTooltipC('visualDom')
    this.items = [];
    this.properties = {
    };
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
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var geoCoord = this.queryData(dataItem[this.locationName]);
      if (geoCoord) {
        res.push({
          name: dataItem[this.locationName],
          value: geoCoord.concat(dataItem[this.valuesName])
        });
      }
    }
    return res;
  };

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView && dataView.plain.profile.long.values.length) {
      const plainData = dataView.plain;
      console.log(plainData)
    } else if (dataView) {
      const plainData = dataView.plain;
      this.locationName = plainData.profile.location.values[0].display
      this.valuesName = plainData.profile.values.values[0].display;
      this.items = this.convertData(plainData.data);
    }

    this.properties = options.properties;
    this.render();
  }
  public render() {
    this.chart.clear();
    let myTooltip = this.myTooltip;
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    console.log(items)
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    var option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'click',
        backgroundColor: 'transparent',
        position(pos) {
          let position = myTooltip.getPosOrSize('pos', pos)
          return position
        },
        formatter(params) {
          let text = `地点：${params.name}\n数量：${params.value[2]}`
          let tooltipDom = myTooltip.getTooltipDom(text)
          return tooltipDom
        }
      },
      legend: {
        show: false
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
      series: [
        {
          name: 'Tooltip Test',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: items,
          symbolSize: function (val) {
            return val[2] / 20;
          },
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
              color: '#f4e925',
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          zlevel: 1
        }
      ]
    }
    this.chart.setOption(option);
  }
  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}
