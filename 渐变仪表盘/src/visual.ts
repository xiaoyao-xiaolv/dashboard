import '../style/visual.less';
import * as echarts from 'echarts'

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private items: any;
  private properties: any;
  private ActualValue: any;
  private ContrastValue: any;
  static mockItems = 0.5;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
    };
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options)
    const dataView = options.dataViews[0];
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

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let color1 = [];
    let color2 = [];
    for (let i = 0; i < options.palette.length - 1; i++) {
      color1.push([1 / options.palette.length * (i + 1), options.palette[i]])
      color2.push({ offset: 1 / options.palette.length * (i + 1), color: options.palette[i] })
    }
    color1.push([1, options.palette[options.palette.length - 1]])
    console.log(color2)
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }

    let detailfontWeight: string;
    if (options.detailTextStyle.fontWeight == "Light") {
      detailfontWeight = options.detailTextStyle.fontWeight + "er"
    } else {
      detailfontWeight = options.detailTextStyle.fontWeight
    }
    let endAngle = options.startAngle - options.endAngle;
    var option = {
      series: [
        {
          type: 'gauge',
          center: ['50%', '50%'],
          radius: '100%',
          splitNumber: 30,
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: endAngle,
          axisLine: {
            show: true,
            lineStyle: {
              width: 0,
              color: color1
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
          radius: '80%',
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: endAngle,
          title: {
            show: options.showSubTitle,
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
              width: 16,
              color: [
                [
                  0.8, new echarts.graphic.LinearGradient(
                    0, 0, 1, 0, [
                    , { offset: 0.09090909090909091, color: "#5edfff" }
                    , { offset: 0.18181818181818182, color: "#ffd348" }
                    , { offset: 0.2727272727272727, color: "#47f4c6" }
                    , { offset: 0.36363636363636365, color: "#66a3ff" }
                    , { offset: 0.4545454545454546, color: "#f38044" }
                    , { offset: 0.5454545454545454, color: "#8484ee" }
                    , { offset: 0.6363636363636364, color: "#fe9200" }
                    , { offset: 0.7272727272727273, color: "#e27300" }
                    , { offset: 0.8181818181818182, color: "#c45100" }
                    , { offset: 0.9090909090909092, color: "#f44e3b" }
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
            formatter: '{value|' + 0.8 + '}{unit|.' + 0.8.toString().split('.')[1] + '%}',
            rich: {
              value: {
                fontSize: 48,
                lineHeight: 48,
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
            value: 0.8,
            name: '人员到岗进度'
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