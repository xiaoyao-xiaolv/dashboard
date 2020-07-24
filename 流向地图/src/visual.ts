import '../style/visual.less';
import * as echarts from 'echarts';
import "echarts/map/js/china.js"
import geoCoordMap from './geoCoordMap.json';
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private legendData: any;
  private destinationName: string;
  private valuesName: string;
  private departureName: string;
  private items: any;
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
    this.properties = {
      roam: true,
      showLegend: false,
      effect: false,
      pointSize: 6,
      symbolSize: 12,
      period: 6,
      symbolStyle: 'pin',
      symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
      borderColor: 'rgba(147, 235, 248, 1)',
      startColor: 'rgba(147, 235, 248, 0)',
      endColor: 'rgba(147, 235, 248, 0.1)',
      shadowColor: 'rgba(128, 217, 248, 1)',
      emphasisColor: '#389BB7',
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
      dataView.plain.profile.values.values.length && dataView.plain.profile.departure.values.length && dataView.plain.profile.destination.values.length) {
      const plainData = dataView.plain;
      this.destinationName = plainData.profile.destination.values[0].display
      this.valuesName = plainData.profile.values.values[0].display;
      this.departureName = plainData.profile.departure.values[0].display
      this.items = this.classify(plainData.data);
      console.log(this.items)
    }

    this.properties = options.properties;
    this.render();
  }

  public render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
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