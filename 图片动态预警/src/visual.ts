import '../style/visual.less';
import chinaMap from './china.json';
const echarts = require('echarts');
echarts.registerMap('china', chinaMap, {});
export default class Visual {
  private visualHost: any;
  private chart: any;
  private container: HTMLDivElement;
  private items: any;
  private x: any;
  private y: any;
  private width: number;
  private height: number;

  static mockItems = [
    [
      [{ name: '北京' }, { name: '上海', value: 95 }],
      [{ name: '北京' }, { name: '广州', value: 90 }],
      [{ name: '北京' }, { name: '大连', value: 80 }],
      [{ name: '北京' }, { name: '南宁', value: 70 }],
      [{ name: '北京' }, { name: '南昌', value: 60 }],
      [{ name: '北京' }, { name: '拉萨', value: 50 }],
      [{ name: '北京' }, { name: '长春', value: 40 }],
      [{ name: '北京' }, { name: '包头', value: 30 }],
      [{ name: '北京' }, { name: '重庆', value: 20 }],
      [{ name: '北京' }, { name: '常州', value: 10 }]
    ],
    [
      [{ name: '上海' }, { name: '包头', value: 95 }],
      [{ name: '上海' }, { name: '昆明', value: 90 }],
      [{ name: '上海' }, { name: '广州', value: 80 }],
      [{ name: '上海' }, { name: '郑州', value: 70 }],
      [{ name: '上海' }, { name: '长春', value: 60 }],
      [{ name: '上海' }, { name: '重庆', value: 50 }],
      [{ name: '上海' }, { name: '长沙', value: 40 }],
      [{ name: '上海' }, { name: '北京', value: 30 }],
      [{ name: '上海' }, { name: '丹东', value: 20 }],
      [{ name: '上海' }, { name: '大连', value: 10 }]
    ],
    [
      [{ name: '广州' }, { name: '福州', value: 95 }],
      [{ name: '广州' }, { name: '太原', value: 90 }],
      [{ name: '广州' }, { name: '长春', value: 80 }],
      [{ name: '广州' }, { name: '重庆', value: 70 }],
      [{ name: '广州' }, { name: '西安', value: 60 }],
      [{ name: '广州' }, { name: '成都', value: 50 }],
      [{ name: '广州' }, { name: '常州', value: 40 }],
      [{ name: '广州' }, { name: '北京', value: 30 }],
      [{ name: '广州' }, { name: '北海', value: 20 }],
      [{ name: '广州' }, { name: '海口', value: 10 }]
    ]
  ]

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.visualHost = host;
    this.chart = echarts.init(dom)
    this.items = [];
    this.x = [];
    this.y = [];
    this.width;
    this.height;
    this.render();
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
    this.render();
  }


  private render() {
    this.container.innerHTML = "";
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    this.chart.clear()
    var x = isMock? Visual.mockx : this.x;
    var y = isMock ? Visual.mocky : this.y;

    var size = getComputedStyle(this.container)
    this.width = parseInt(size.width)
    this.height = parseInt(size.height)

    var options = this.options
    var FontSize = options.textFont

    var w = this.width / (x.length + 3)
    var h = this.height / (y.length + 3)

    if (options.textFont == 'auto') {
        FontSize = (parseInt(this.width / (x.length + 3) / 7) > 12) ? parseInt(this.width / (x.length + 3) / 7) : 12
        FontSize = FontSize > 35 ? 35 : FontSize
    }
    
    if (parseInt(w / options.W_H) > h) {
        w = parseInt(h * options.W_H)
    } else {
        h = parseInt(w / options.W_H)
    }
    var option = {
        tooltip: {
            show: !this.isMock && options.showTooltip,
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(param) {
                var str =  param.value[2]>1?'故障':(param.value[2]<1?'正常':'告警')
                return (param.seriesName + ' : ' +str)
            }
        },
        grid: {
            left: '9%',
            top: '9%',
            right: 0,
            bottom: 0
        },
        xAxis: {
            type: 'category',
            data: x.map(function (item) {
                return {
                    value: item,
                    textStyle: {
                        fontSize: FontSize,
                        color: options.textColor
                    }
                }
            }),
            position: 'top',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisPointer: {
                label: {
                    show: true,
                    margin: 30,
                }
            }
        },
        yAxis: {
            type: 'category',
            data: y.map(function (item) {
                return {
                    value: item,
                    textStyle: {
                        fontSize: FontSize,
                        color: options.textColor
                    }
                }
            }),
            inverse: true,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },

            axisPointer: {
                label: {
                    show: true,
                    margin: 30
                }
            }
        },
        series: [{
            name: '设备状态',
            type: 'scatter',
            label: {
                show: true
            },
            data: items,
            symbolSize: [w - 5, h],
            zlevel: 1
        }, {
            name: '设备状态',
            type: 'effectScatter',
            coordinateSystem: 'cartesian2d',
            data: this.finditem(items, options),
            // data:[{ value: [0,0], itemStyle: { color: 'yellow' } },{ value: [0,1], itemStyle: { color: 'yello' } },{ value: [0,2], itemStyle: { color: 'blue' } }],
            symbol: 'rect',
            symbolSize: [w + 5, h + 10],
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke',
                scale: 1.5,
                period: 3
            },

        }]
    }
    this.chart.setOption(option);
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorVisibilityState(properties: any): string[] {
    return null;
  }

  public getActionBarVisibilityState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}