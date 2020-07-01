import '../style/visual.less';
import chinaMap from './china.json';
import geoCoordMap from './geoCoordMap.json';
const echarts = require('echarts');
echarts.registerMap('china', chinaMap, {});
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  private departureValue: any;
  static mockItems = [
    [
      [{ name: '北京' }, { name: '上海', value: 95 }],
      [{ name: '北京' }, { name: '广州市', value: 90 }],
      [{ name: '北京' }, { name: '大连市', value: 80 }],
      [{ name: '北京' }, { name: '南宁市', value: 70 }],
      [{ name: '北京' }, { name: '南昌市', value: 60 }],
      [{ name: '北京' }, { name: '拉萨市', value: 50 }],
      [{ name: '北京' }, { name: '长春市', value: 40 }],
      [{ name: '北京' }, { name: '包头市', value: 30 }],
      [{ name: '北京' }, { name: '重庆', value: 20 }],
      [{ name: '北京' }, { name: '常州市', value: 10 }]
    ],
    [
      [{ name: '上海' }, { name: '包头市', value: 95 }],
      [{ name: '上海' }, { name: '昆明市', value: 90 }],
      [{ name: '上海' }, { name: '广州市', value: 80 }],
      [{ name: '上海' }, { name: '郑州市', value: 70 }],
      [{ name: '上海' }, { name: '长春市', value: 60 }],
      [{ name: '上海' }, { name: '重庆', value: 50 }],
      [{ name: '上海' }, { name: '长沙市', value: 40 }],
      [{ name: '上海' }, { name: '北京', value: 30 }],
      [{ name: '上海' }, { name: '丹东市', value: 20 }],
      [{ name: '上海' }, { name: '大连市', value: 10 }]
    ],
    [
      [{ name: '广州市' }, { name: '福州市', value: 95 }],
      [{ name: '广州市' }, { name: '太原市', value: 90 }],
      [{ name: '广州市' }, { name: '长春市', value: 80 }],
      [{ name: '广州市' }, { name: '重庆', value: 70 }],
      [{ name: '广州市' }, { name: '西安市', value: 60 }],
      [{ name: '广州市' }, { name: '成都市', value: 50 }],
      [{ name: '广州市' }, { name: '常州市', value: 40 }],
      [{ name: '广州市' }, { name: '北京', value: 30 }],
      [{ name: '广州市' }, { name: '北海市', value: 20 }],
      [{ name: '广州市' }, { name: '海口市', value: 10 }]
    ]
  ]

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.departureValue = [];
    this.properties = {
      roam: true,
      showLegend: false,
      effect: false,
      symbolSize: 10,
      symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
      borderColor: 'rgba(147, 235, 248, 1)',
      startColor: 'rgba(147, 235, 248, 0)',
      endColor: 'rgba(147, 235, 248, 0.1)',
      shadowColor: 'rgba(128, 217, 248, 1)',
      emphasisColor: '#389BB7',
    };
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.values.values.length && dataView.plain.profile.departure.values.length && dataView.plain.profile.destination.values.length) {
      const plainData = dataView.plain;
      let destinationName = plainData.profile.destination.values[0].display
      let valuesName = plainData.profile.values.values[0].display;
      let departureName = plainData.profile.departure.values[0].display
      let departureValue = plainData.sort[departureName].order;
      this.departureValue = departureValue;
      for (let i = 0; i < departureValue.length; i++) {
        this.items[i] = plainData.data.map(function (item) {
          if (departureValue[i] == item[departureName]) {
            return [
              { name: item[departureName] },
              {
                name: item[destinationName],
                value: item[valuesName] || 0,
              }];
          }
        })
          .filter(function (item) {
            if (!(typeof item == "undefined")) {
              return [
                { name: item[departureName] },
                {
                  name: item[destinationName],
                  value: item[valuesName] || 0,
                }];
            }
          });
      }
    }
    this.properties = options.properties;
    this.render();
  }
  private convertData(data: number[]) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];
      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord],
          value: dataItem[1].value
        });
      }
    }
    return res;
  };


  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    var convertData = this.convertData;
    let planePath = options.effect ? options.symbol : 'circle';
    let symbolSize = options.effect ? 15 : 5;
    let departureValue = isMock ? ['北京', '上海', '广州市'] : this.departureValue;
    let color = isMock ? ['#a6c84c', '#ffa022', '#46bee9'] : options.palette;
    var series = [];
    items.map(function (item: number[], i: number) {
      if (item.length) {
        let j = i % color.length;
        series.push({
          name: item[0][0].name,
          type: 'lines',
          zlevel: 1,
          effect: {
            show: true,
            period: 6,
            trailLength: 0.7,
            color: '#fff',
            symbolSize: 3
          },
          lineStyle: {
            normal: {
              color: color[j],
              width: 0,
              curveness: 0.2
            }
          },
          data: convertData(item)
        },
          {
            name: item[0][0].name,
            type: 'lines',
            zlevel: 2,
            symbol: ['none', 'arrow'],
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: planePath,
              symbolSize: symbolSize
            },
            lineStyle: {
              normal: {
                color: color[j],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(item)
          },
          {
            name: item[0][0].name,
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
            symbolSize: options.symbolSize,
            itemStyle: {
              normal: {
                color: color[j]
              }
            },
            data: item.map(function (dataItem) {
              return {
                name: dataItem[1].name,
                value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
              };
            })
          }, {
          name: item[0][0].name,
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
          symbolSize: options.symbolSize,
          itemStyle: {
            normal: {
              color: color[j]
            }
          },
          data: item.map(function (dataItem) {
            return {
              name: dataItem[0].name,
              value: geoCoordMap[dataItem[0].name]
            };
          })
        });
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
        map: 'china',
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
    return null;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}