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

let myChart;
let allSeriesData;
let bindCoords;
let longitude;
let latitude;
let rawData = [
  ["陕西",10,20,30],
  ["四川",10,25,30],
  ["北京",10,20,35],
  ["广州",15,20,25],
  ["福建",10,20,30],
  ["浙江",10,20,30],
  ["青海",10,25,35],
  ["黑龙江",10,20,30],
  ["新疆",15,20,35],
  ["西藏",10,25,30],
  ["云南",15,20,35]
];

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private isMock: boolean;
  private valuesName: string;
  private seriesName: string;
  private locationName: string;
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
    allSeriesData = [];
    return this.locationArr.map((location) => {
      let locationTempData = dataArr.filter(data => data[this.locationName] === location);
      let tempObj = {};
      locationTempData.forEach((temp) => {
        tempObj[temp[this.seriesName]] = temp[this.valuesName];
      });
      let seriesData = this.series.map((item) => {
        return tempObj[item] ? tempObj[item] : 0;
      });
      allSeriesData = allSeriesData.concat(seriesData);
      return [location].concat(seriesData);
    });
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.series = [];
    this.locationArr = [];
    this.isMock = !options.dataViews.length;
    if (!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      this.valuesName = profile.values.values[0].display;
      this.seriesName = profile.series.values[0].display;
      this.locationName = profile.location.values[0].display;
      bindCoords = !!(profile.longitude.values.length && profile.latitude.values.length);
      if(profile.longitude.values.length && profile.latitude.values.length) {
        longitude = profile.longitude.values[0].display;
        latitude = profile.latitude.values[0].display;
      }
      bindData.forEach((data) => {
        if(this.series.indexOf(data[this.seriesName]) < 0) {
          this.series.push(data[this.seriesName]);
        }
      })
      bindData.forEach((data) => {
        if(this.locationArr.indexOf(data[this.locationName]) < 0) {
          this.locationArr.push(data[this.locationName]);
        }
      })
      this.resultData = this.prepareData(bindData);
    }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    myChart.clear();
    let options = this.properties;
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    let colorList = this.isMock ? ['#a6c84c', '#7b64ff', '#46bee9'] : options.palette;
    let mapOption = {
      animation: false,
      tooltip: {
        trigger: 'axis'
      },
      geo: {
        map: options.mapName,
        roam: options.roam,
        zoom: 1.2,
        itemStyle: {
          normal: {
            areaColor:options.mapColor,
            borderColor: options.mapBorderColor,
            borderWidth: 1,
            shadowColor: options.mapBorderShadowColor,
            shadowOffsetX: -3,
            shadowOffsetY: 3,
            shadowBlur: 10,
          },
          emphasis: {
            areaColor: options.emphasisColor,
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
      let maxValue = this.isMock ? 50 : Math.max.apply(null, allSeriesData);
      let gridWidth = 10 * series.length;
      let totalSeriesDataList = [];
      areaData.forEach((item) => {
        let total = item.slice(1).reduce((prev,current) => {
          return prev+current;
        }, 0)
        totalSeriesDataList.push(total);
      });
      let maxTotalSeriesData = Math.max.apply(null, totalSeriesDataList);
      let minTotalSeriesData = Math.min.apply(null, totalSeriesDataList);
      let option = {
        legend:[],
        xAxis: [],
        yAxis: [],
        title: [],
        grid: [],
        series: []
      };
      if (options.showLegend) {
        option.legend.push({
          data : series,
          icon: options.legendIcon,
          left: options.legendHorizontalPosition,
          top: options.legendVerticalPosition,
          itemWidth:25,
          itemHeight:15,
          orient:options.legendOrient,
          textStyle: {
            ...options.legendTextStyle,
            fontSize: parseFloat(options.legendTextStyle.fontSize),
          },
        });
      }
      echarts.util.each(areaData, function(dataItem, idx) {
        let locationName = dataItem[0];
        let geoCoords;
        if (bindCoords) {
          geoCoords = [dataItem[longitude], dataItem[latitude]];
        } else {
          geoCoords = getCoords(locationName);
        }
        let pixel = myChart.convertToPixel('geo', geoCoords);
        let seriesData = dataItem.slice(1);
        let pieSeriesData = series.map((item, index) => {
          return {
            name: item,
            value: seriesData[index]
          }
        });
        idx += '';
        if (options.chartType === 'bar') {
          let xAxis = {
            id: idx,
            gridId: idx,
            type: 'category',
            nameTextStyle: {
              ...options.locationNameTextStyle,
              fontSize: parseFloat(options.locationNameTextStyle.fontSize),
            },
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
                  color : colorList[i],
                  opacity: options.chartOpacity * 0.01
                }
              },
              data : [ seriesData[i] ]
            });
          }
        } else {
          let radius = 10 + 15 * (totalSeriesDataList[idx] - minTotalSeriesData)/(maxTotalSeriesData - minTotalSeriesData);
          option.grid.push({
            id: idx,
            gridId:idx,
            width: 30,
            height: 40,
            left: pixel[0] - 25,
            top: pixel[1] - 30,
            z: 100
          });
          option.title.push({
            show: options.showLocationName,
            subtext: locationName,
            left: pixel[0] - 20,
            top: pixel[1]+ radius - 12,
            subtextStyle: {
              ...options.locationNameTextStyle,
              fontSize: parseFloat(options.locationNameTextStyle.fontSize)
            }
          });
          let pieSeries = {
            id: idx,
            type: 'pie',
            animationType : 'expansion',
            tooltip: {
              trigger: "item",
              formatter: "{b} : {c} ({d}%)"
            },
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            },
            center: pixel,
            data: pieSeriesData,
            z: 100,
            radius: radius,
            itemStyle: {
              normal: {
                color: function (params) {
                  return colorList[params.dataIndex];
                },
                opacity: options.chartOpacity * 0.01,
                shadowColor: options.chartShadowColor,
                shadowBlur: 4
              }
            }
          };
          if (options.chartType === 'rosePie') {
            pieSeries['roseType'] = 'radius';
          }
          option.series.push(pieSeries);
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
      hiddenStates.push('locationNameTextStyle');
    }
    if (!properties.showLegend) {
      hiddenStates.push('legendIcon', 'legendOrient', 'legendHorizontalPosition', 'legendVerticalPosition', 'legendTextStyle');
    }

    if (properties.chartType === 'bar') {
      hiddenStates.push('chartShadowColor');
    }
    return hiddenStates;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}