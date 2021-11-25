import '../style/visual.less';
import * as echarts from 'echarts'

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private items: any;
  private properties: any;
  private ActualValue: any;
  private ContrastValue: any;
  private host: any;
  static mockItems = 50;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.host = host;
    this.properties = {
    };
    
    this.selectEvent();
  }

  private selectEvent() {
    //鼠标右键
    this.container.addEventListener('mouseup', (params) => {
      document.oncontextmenu = function () { return false; };
      console.log(params)
      if (params.button === 2) {
        this.host.contextMenuService.show({
          position: {
            x: params.x,
            y: params.y,
          },
          menu: true
        }, 10)
        return;
      }else{
        this.host.contextMenuService.hide();
      }
    })
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options)
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView) {
      const plainData = dataView.plain;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
      let ContrastValue = plainData.profile.ContrastValue.values[0].display;
      this.items.push(plainData.data[0][ActualValue]);
      this.items.push(plainData.data[0][ContrastValue]);
    }
    this.properties = options.properties;
    this.render()
  }
  public formatData = (number, dataUnit, dataType) => {
    let format = number
    // const dataUnit = options.totalValueUnit
    const units = [{
      value: 1,
      unit: ''
    },
    {
      value: 100,
      unit: '百'
    }, {
      value: 1000,
      unit: '千'
    }, {
      value: 10000,
      unit: '万'
    }, {
      value: 100000,
      unit: '十万'
    }, {
      value: 1000000,
      unit: '百万'
    }, {
      value: 10000000,
      unit: '千万'
    }, {
      value: 100000000,
      unit: '亿'
    }, {
      value: 1000000000,
      unit: '十亿'
    }, {
      value: 100000000000,
      unit: '万亿'
    }]
    const formatUnit = units.find((item) => item.value === Number(dataUnit))
    format = (format / formatUnit.value).toFixed(2)

    if (dataType === 'number') {
      format = format.toLocaleString()
    } else if (dataType === '%') {
      format = format + dataType
    } else {
      format = dataType + format
    }
    return format + formatUnit.unit
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : (this.items[0] / this.items[1] * 100);
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let num = isMock ? '' : this.formatData(this.items[0], options.detailValueUnit, options.detailValueType)
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }
    let endAngle = options.startAngle - options.endAngle;
    var option = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '50%'],
          radius: '100%',
          splitNumber: 20,
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: endAngle,
          axisLine: {
            show: true,
            lineStyle: {
              width: 0,
              color: [
                [0.05, 'rgba(204, 255, 51, 0.5)'],
                [0.10, 'rgba(153, 255, 51, 0.5)'],
                [0.15, 'rgba(102, 255, 51, 0.5)'],
                [0.20, 'rgba(51, 255, 51, 0.5)'],
                [0.25, 'rgba(51, 255, 102, 0.5)'],
                [0.30, 'rgba(51, 255, 153, 0.5)'],
                [0.35, 'rgba(51, 255, 204, 0.5)'],
                [0.40, 'rgba(51, 255, 255, 0.5)'],
                [0.45, 'rgba(51, 204, 255, 0.5)'],
                [0.50, 'rgba(51, 153, 255, 0.5)'],
                [0.55, 'rgba(51, 102, 255, 0.5)'],
                [0.60, 'rgba(51, 51, 255, 0.5)'],
                [0.65, 'rgba(102, 51, 255, 0.5)'],
                [0.70, 'rgba(153, 51, 255, 0.5)'],
                [0.75, 'rgba(204, 51, 255, 0.5)'],
                [0.80, 'rgba(255, 51, 255, 0.5)'],
                [0.85, 'rgba(255, 51, 204, 0.5)'],
                [0.90, 'rgba(255, 51, 153, 0.5)'],
                [0.95, 'rgba(255, 51, 102, 0.5)'],
                [1, 'rgba(153, 153, 153, 0.5)']
              ]
            }
          },
          axisTick: {
            show: true,
            lineStyle: {
              color: 'auto',
              width: 1
            },
            length: 20  //TODO 
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false
          },
          pointer: {
            show: false
          },
          detail: {
            show: false
          }
        },
        {
          name: "实际值",
          type: 'gauge',
          center: ['50%', '50%'],
          radius: '75%',
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: endAngle,
          title: {
            show: options.showNum,
            offsetCenter: [0, '80%'],
            color: options.textStyle.color,
            fontSize: options.textStyle.fontSize.substr(0, 2),
            fontWeight: fontWeight,
            fontFamily: options.textStyle.fontFamily,
            fontStyle: options.textStyle.fontStyle
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 14,
              color: [
                [
                  items / 100, new echarts.graphic.LinearGradient(
                    0, 0, 1, 0, [{
                      offset: 0.05,
                      color: '#cf3'
                    },
                    {
                      offset: 0.10,
                      color: '#9f3'
                    },
                    {
                      offset: 0.15,
                      color: '#6f3'
                    },
                    {
                      offset: 0.20,
                      color: '#3f3'
                    },
                    {
                      offset: 0.25,
                      color: '#3f6'
                    },
                    {
                      offset: 0.30,
                      color: '#3f9'
                    },
                    {
                      offset: 0.35,
                      color: '#3fc'
                    },
                    {
                      offset: 0.40,
                      color: '#3ff'
                    },
                    {
                      offset: 0.45,
                      color: '#3cf'
                    },
                    {
                      offset: 0.50,
                      color: '#39f'
                    },
                    {
                      offset: 0.55,
                      color: '#36f'
                    },
                    {
                      offset: 0.60,
                      color: '#33f'
                    },
                    {
                      offset: 0.65,
                      color: '#63f'
                    },
                    {
                      offset: 0.70,
                      color: '#93f'
                    },
                    {
                      offset: 0.75,
                      color: '#c3f'
                    },
                    {
                      offset: 0.80,
                      color: '#f3f'
                    },
                    {
                      offset: 0.85,
                      color: '#f3c'
                    },
                    {
                      offset: 0.90,
                      color: '#f39'
                    },
                    {
                      offset: 0.95,
                      color: '#f36'
                    }
                  ]
                  )
                ],
                [
                  1, '#2C3136'
                ]
              ]
            }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false
          },
          pointer: {
            show: false,
          },
          detail: {
            show: true,
            offsetCenter: [0, 0],
            formatter: '{value|' + items.toFixed(1) + '}{unit|%}',
            rich: {
              value: {
                fontSize: 40,
                lineHeight: 40,
                color: '#fff'
              },
              unit: {
                fontSize: 24,
                lineHeight: 24,
                color: '#fff',
                padding: [0, 0, 12, 0]
              },
              name: {
                fontSize: 20,
                lineHeight: 30,
                color: '#fff'
              }
            }
          },
          data: [{
            value: items,
            name: num
          }]
        },
      ]

    }

    this.chart.setOption(option);
  }

  public onDestroy() {
    this.chart.dispose();
  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}