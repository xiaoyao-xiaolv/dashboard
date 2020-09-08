import '../style/visual.less';
import * as echarts from 'echarts';
import 'jquery';
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

let myChart;
let rawData = [
  ["南京",10,20,30],
  ["镇江",10,25,30],
  ["常州",10,20,35],
  ["无锡",15,20,25],
  ["苏州",10,20,30],
  ["扬州",10,20,30],
  ["泰州",10,25,35],
  ["南通",10,20,30],
  ["徐州",15,20,35],
  ["宿迁",10,25,30],
  ["淮安",15,20,35],
  ["盐城",10,20,30],
  ["连云港",10,25,35],
];

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private isMock: boolean;
  private valuesName: string;
  private seriesName: string;
  private locationName: string;
  private longitudeName: string;
  private latitudeName: string;
  private properties: any;
  private resultData: any;
  private series: any;
  private locationArr: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.isMock = true;
    myChart = echarts.init(dom);
  }

  private prepareData(dataArr: any) {
     return this.locationArr.map((location) => {
      let locationTempData = dataArr.filter(data => data[this.locationName] === location);
      let tempObj = {};
      locationTempData.forEach((temp) => {
        tempObj[temp[this.seriesName]] = temp[this.valuesName];
      })
      let seriesData = this.series.map((item) => {
        return  tempObj[item] ? tempObj[item] : 0;
      })
      return [location].concat(seriesData);
    });
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.isMock = !options.dataViews.length;
    if (!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      this.valuesName = profile.values.values[0].display;
      this.seriesName = profile.series.values[0].display;
      this.locationName = profile.location.values[0].display;
      if(profile.longitude.values.length && profile.latitude.values.length) {
        this.longitudeName = profile.longitude.values[0].display;
        this.latitudeName = profile.latitude.values[0].display;
      }
      this.series = options.dataViews[0].plain.sort[this.seriesName].order;
      this.locationArr = options.dataViews[0].plain.sort[this.locationName].order;
      this.resultData = this.prepareData(bindData);
    }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    myChart.clear();
    let options = this.properties;
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    let colorList = this.isMock ? ['#a6c84c', '#ffa022', '#46bee9'] : options.palette;
    let map = this.isMock ? '江苏' : options.mapName;
    let mapOption = {
      animation: false,
      tooltip: {
        trigger: 'axis'
      },
      geo: {
        map: map,
        roam: options.roam,
        itemStyle: {
          normal: {
            areaColor:options.mapColor,
            borderColor: options.mapBorderColor,
            borderWidth: 1,
            shadowColor: 'rgba(128, 217, 248, 1)',
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10,
          },
          emphasis: {
            areaColor: 'rgba(119,119,119,0)',
          }
        },
        label: {
          emphasis: {
            show: false
          }
        },
      },
      series: []
    };
    let renderEachArea = () => {
      let getCoords = (keyWord: string) => {
        let reg = new RegExp(keyWord);
        for (let i = 0; i < geoCoordsMap.length; i++) {
          if (reg.test(geoCoordsMap[i].name)) {
            return [geoCoordsMap[i].lng, geoCoordsMap[i].lat];
          }
        }
      };
      let areaData = this.isMock ? rawData: this.resultData;
      let series = this.isMock ? ["学校","教师","学生"] : this.series;
      let maxValue = this.isMock ? 50 : options.maxValue;
      let gridWidth = 10 * series.length;
      let option = {
        legend:[],
        xAxis: [],
        yAxis: [],
        grid: [],
        series: []
      };
      if (options.showLegend) {
        option.legend.push({
          data : series,
          left:'center',
          top:'bottom',
          itemWidth:25,
          itemHeight:15,
          textStyle:{
            color:'#ddd',
            fontSize:15
          }
        });
      }
      echarts.util.each(areaData, function(dataItem, idx) {
        let locationName = dataItem[0];
        let geoCoords = getCoords(locationName);
        let seriesData = dataItem.slice(1);
        let pixel = myChart.convertToPixel('geo', geoCoords);
        idx += '';
        let xAxis = {
          id: idx,
          gridId: idx,
          type: 'category',
          nameTextStyle: {color: options.locationNameColor},
          nameLocation: 'middle',
          nameGap: 3,
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
          },
          minInterval:10,
          data: [locationName],
          z: 100
        };
        if (options.showLocationName) {
          xAxis['name']= locationName;
        }
        option.xAxis.push(xAxis);
        option.yAxis.push({
          id: idx,
          gridId: idx,
          show: false,
          max: maxValue,
          z: 100
        });
        option.grid.push({
          id: idx,
          width: gridWidth,
          height: 40,
          left: pixel[0] - 20,
          top: pixel[1] - 30,
          z: 100
        });
        for (let i = 0; i < series.length; i++) {
          option.series.push({
            name : series[i],
            type : 'bar',
            xAxisId : idx,
            yAxisId : idx,
            barWidth: 7,
            itemStyle : {
              normal : {
                color : colorList[i]
              }
            },
            data : [ seriesData[i] ]
          });
        }
      });
      myChart.setOption(option);
    }
    let throttleRender = (fn, delay, debounce) => {
      let currCall, lastCall = 0, lastExec = 0, timer = null, diff, scope, args;
      delay = delay || 0;
      function exec() {
        lastExec = (new Date()).getTime();
        timer = null;
        fn.apply(scope, args || []);
      }

      let callRender = function() {
        currCall = (new Date()).getTime();
        scope = this;
        args = arguments;
        diff = currCall - (debounce ? lastCall : lastExec) - delay;
        clearTimeout(timer);
        if (debounce) {
          timer = setTimeout(exec, delay);
        } else {
          if (diff >= 0) {
            exec();
          } else {
            timer = setTimeout(exec, -diff);
          }
        }
        lastCall = currCall;
      };
      return callRender;
    };
    setTimeout(renderEachArea, 0);
    let roamRenderEachCity = throttleRender(renderEachArea,0, 0);
    myChart.on('geoRoam', roamRenderEachCity);
    myChart.setOption(mapOption);
  }

  public onDestroy() {

  }

  public onResize() {
    myChart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let properties = options.properties;
    let hiddenStates = [];
    if (!properties.showLocationName) {
      hiddenStates.push('locationNameColor');
    }
    return hiddenStates;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}