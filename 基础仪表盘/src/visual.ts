import '../style/visual.less';
import * as echarts from 'echarts/core';
import { GaugeChart,PieChart,ScatterChart,LineChart   } from 'echarts/charts';
import { TitleComponent , GraphicComponent , AriaComponent , TooltipComponent, LegendComponent, GridComponent   } from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import { number } from 'echarts/core';

echarts.use(
  [ GaugeChart,PieChart , ScatterChart , LineChart ,TitleComponent , GraphicComponent, AriaComponent, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer]
);

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private items: any;
  private properties: any;
  private ActualValue: any;
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
    const dataView = options.dataViews[0];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.ContrastValue.values.length) {
      const plainData = dataView.plain;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
      let ContrastValue = plainData.profile.ContrastValue.values[0].display;
      this.ActualValue = plainData.data[0][ActualValue];
      // custom 
      const _actualValue = options.properties.Actual === 'dataset' ? (<number>plainData.data[0][ActualValue]) : (Number(options.properties.customActual));
      const _contrastValue = options.properties.Contrast === 'dataset' ? (<number>plainData.data[0][ContrastValue]) : (Number(options.properties.customContrast));
      this.items = (_actualValue / _contrastValue).toFixed(4);
     
    }

    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = ((isMock ? Visual.mockItems : this.items) * 100);
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let subtitle = options.showNum ? options.subtitle + '\n' + this.ActualValue : options.subtitle
    let scope = 100 / options.scope
    let color = [];
    for (let i = 0; i < options.scope; i++) {
      let j = i % options.palette.length
      color.push([scope * (i + 1) / 100, options.palette[j]])
    }
   
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

    const _axisLine = {
      show: true,
      lineStyle: {
        width: options.width,
        color: color
      },
    }
    const _splitLine = {
      show: options.showsplitLine,
      length: options.splitLineLength,
      lineStyle: {
        type: "solid",
        color: options.splitLineColor,
        width: options.splitLineWidth,
      }
    }
    const _axisTick = { //刻度样式
      show: options.showaxisTick,
      splitNumber: options.axisTickNum, //分割线之间的刻度数
      lineStyle: {
        type: "solid",
        color: options.axisTickColor,
        width: options.axisTickWidth
      }
    }
    const basicGauge = [{
      name: options.subtitle,
      type: 'gauge',
      radius: `${options.gaugeR}%`,
      min: options.min,
      max: options.max,
      startAngle: options.startAngle,
      endAngle: options.endAngle,
      splitNumber: options.scope,
      axisLine: _axisLine,
      splitLine: _splitLine,
      axisTick: _axisTick,
      pointer: {//指针
        show: true,
        width: 5,
        length: "80%"
      },
      title: { //标题
        show: options.showSubTitle || options.showNum,
        offsetCenter: [0, "30%"], // x, y，单位px
        lineHeight:15,
        color: options.textStyle.color,
        fontSize: options.textStyle.fontSize.substr(0, 2),
        fontWeight: fontWeight,
        fontFamily: options.textStyle.fontFamily,
        fontStyle: options.textStyle.fontStyle
      },
      detail: {//明细
        show: options.showDetail,
        formatter: '{value}%',
        offsetCenter: ["0", "60%"],
        color: options.detailTextStyle.color,
        fontSize: options.detailTextStyle.fontSize.substr(0, 2),
        fontWeight: detailfontWeight,
        fontFamily: options.detailTextStyle.fontFamily,
        fontStyle: options.detailTextStyle.fontStyle

      },
      data: [{
        value: Number(items.toFixed(2)),
        name: subtitle
      }]
    }]
    // const percent = 52; //百分数
    let color_percent0 = '',
        color_percent100 = '',
        dotArray = [];

    const calculateDot = (data) =>{
        if (data <= 20) {
            dotArray.push(80)
            color_percent0 = 'rgba(12,255,0,1)'
            color_percent100 = 'rgba(12,255,0,.3)'
        }else if (data > 20&&data<=40) {
            dotArray.push(...[80,80])
            color_percent0 = 'rgba(12,255,0,1)'
            color_percent100 = 'rgba(12,255,0,.3)'
        }else if (data > 40&&data<=60) {
            dotArray.push(...[80,80,80])
             color_percent0 = 'rgba(255,123,0,1)'
            color_percent100 = 'rgba(255,123,0,.3)'
        }else if (data > 60&&data<=80) {
            dotArray.push(...[80,80,80,80])
             color_percent0 = 'rgba(255,0,36,1)'
            color_percent100 = 'rgba(255,0,36,.3)'
        }else if (data > 80&&data<=100) {
            dotArray.push(...[80,80,80,80,80])
             color_percent0 = 'rgba(255,0,36,1)'
            color_percent100 = 'rgba(255,0,36,.3)'
        }
    
    }
    calculateDot(items)//80%显示4个点，
    const pieGauge = [{
      type: 'gauge',
      // center: ['50%', '60%'],
      radius: `${options.gaugeR - 10}%`,
      startAngle: options.startAngle,
      endAngle: options.endAngle,
      // splitNumber: options.scope,
      min: options.min,
      max: options.max,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0.4, 0, 0, [{
          offset: 0,
          color: color_percent0
        }, {
          offset: 1,
          color: color_percent100
        }]),
      },
      progress: {
        show: true,
        width: options.width
      },
      pointer: {
        show: false
      },
      axisLine: {
        lineStyle: {
          width: options.width
        }
      },
      axisTick: {
        distance: -45,
        splitNumber: 5,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        distance: -52,
        length: 14,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        show: true,
        // distance: -20,
        color: '#999',
        // fontSize: 20,
        formatter: (value) => {
          return `${value.toFixed(0)}`
        } ,
      },
      // axisLine: _axisLine,
      // splitLine: _splitLine,
      // axisTick: _axisTick,
      anchor: {
        show: false
      },
      title: {
        show: true
      },
      detail: {
        valueAnimation: false,
        // width: '60%',
        lineHeight: 40,
        borderRadius: 8,
        offsetCenter: [0, '-15%'],
        fontSize: 24,
        fontWeight: 'bolder',
        formatter: (value) => {
          return `${value.toFixed(0)}°C`
        } ,
        color: '#fff'
      },
      data: [
        {
          value: Number(items)
        }
      ]
    },
    {
      type: 'gauge',
      // center: ['50%', '60%'],
      radius: `${options.gaugeR - 40}%`,
      startAngle: options.startAngle,
      endAngle: options.endAngle,
      splitNumber: options.scope,
      min: options.min,
      max: options.max,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(1, 0.4, 0, 0, [{
          offset: 0,
          color: color_percent0
        }, {
          offset: 1,
          color: color_percent100
        }]),
      },
      progress: {
        show: true,
        // width: 8
      },
      pointer: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        show: false
      },
      detail: {
        show: false
      },
      data: [
        {
          value: Number(items)
        }
      ]
    },
    //总共有5个小球
    {
      name: '',
      symbolOffset: ['20', '0'],//就是把自己向上移动了一半的位置，在 symbol 图形是气泡的时候可以让图形下端的箭头对准数据点。
      type: 'scatter',
      color: '#fff',
      data: [80, 80, 80, 80, 80]
    },
    //根据数据判断小球的颜色
    {
      name: '',
      type: 'scatter',
      symbolOffset: ['20', '0'],//移动小球的位置
      color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: color_percent0
      }, {
        offset: 1,
        color: color_percent100
      }]),
      data: dotArray
    },
    {//第一个线
      name: '',

      type: 'line',
      color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: color_percent0
      }, {
        offset: 1,
        color: color_percent100
      }]),
      symbol: "none",
      data: [85, 85, 85, 85, 85, 85]
    },
    {//第二根线
      name: '',
      type: 'line',
      symbol: "none",//去掉横线上的小点
      color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
        offset: 0,
        color: color_percent0
      }, {
        offset: 1,
        color: color_percent100
      }]),
      data: [75, 75, 75, 75, 75, 75]
    }
    ];

    // progress
    const dataArr = 44;
    const colorSet = {
        color: '#22B95E'
    };
    const color1 = {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
                {
                  offset: 0,
                  color: "rgba(255,255,255,0.1)"
                },
                {
                    offset: 1,
                    color: "rgba(255,255,255,0.3)"
                }
            ],
                global: false
    }

    const color2 = {
        type: "linear",
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        colorStops: [
            {
              offset: 0,
              color: "#30DBBA"
            },
            {
                offset: 1,
                color: "#2DE696"
            }
        ],
            global: false
    }

    const pieGaugeProgress = [
      {
            name: "内部进度条",
            type: "gauge",
            // center: ['20%', '50%'],
            radius: `${options.gaugeR}%`,
            min: options.min,
            max: options.max,
            startAngle: options.startAngle,
            endAngle: options.endAngle,
            splitNumber: options.scope,
            axisLine: {
                lineStyle: {
                    color: [
                        [ Number(items) / 100, colorSet.color],
                        [1, colorSet.color]
                    ],
                    width: 2
                }
            },
            axisLabel: {
                show: false,
            },
            axisTick: {
                show: false,

            },
            splitLine: {
                show: false,
            },
            itemStyle: {
                color:"#ffffff"
            },
            detail: {
              show: false,
                formatter: function(value) {
                    if (value !== 0) {
                        var num = Math.round(value ) ;
                        return parseInt(`${num}`).toFixed(0)+"%";
                    } else {
                        return 0;
                    }
                },
                offsetCenter: [0, 67],
                textStyle: {
                    padding: [0, 0, 0, 0],
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#ffffff'
                }
            },
            title: { //标题
                show: false,
                offsetCenter: [0, 46], // x, y，单位px
                textStyle: {
                    color: "rgba(0,0,0,0)",
                    fontSize: 14, //表盘上的标题文字大小
                    fontFamily: 'PingFangSC'
                }
            },
            data: [{
                name: "",
                value: items,
            }],
            pointer: {
                show: true,
                length: '70%',
                radius: '20%',
                width: 3 //指针粗细

            },
            progress: {
              show: false,
              // width: 5
            },
            // animationDuration: 4000,
      },
      {
          name: "内部阴影",
          type: "gauge",
          radius: `${options.gaugeR - 8}%`,
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: options.endAngle,
          splitNumber: options.scope,
          axisLine: {
              lineStyle: {
                  color: [
                      [Number(items) / 100, new echarts.graphic.LinearGradient(
                          0, 1, 0, 0, [{
                                  offset: 0,
                                  color: 'rgba(45,230,150,0)',
                              }, {
                                  offset: 0.5,
                                  color: 'rgba(45,230,150,0.2)',
                              },
                              {
                                  offset: 1,
                                  color: 'rgba(45,230,150,1)',
                              }
                          ]
                      )],
                      [
                          1, 'rgba(28,128,245,0)'
                      ]
                  ],
                  width: 100

              },
          },
          axisLabel: {
              show: false,
          },
          axisTick: {
              show: false,

          },
          splitLine: {
              show: false,
          },
          itemStyle: {
              show: false,
          },
      
      },
      {
          name: "内部小圆",
          type: "gauge",
          // center: ['20%', '50%'],
          radius: `${options.gaugeR - 6}%`,
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: options.endAngle,
          splitNumber: options.scope,
          axisLine: {
              lineStyle: {
                  color: [
                      [Number(items) / 100, color2],
                      [1, "rgba(0,0,0,0)"]
                  ],
                  width: 50
              }
          },
          axisLabel: {
              show: false,
          },
          axisTick: {
              show: false,

          },
          splitLine: {
              show: false,
          },
          itemStyle: {
              show: false,
          },
      },
      {
          name: '外部刻度',
          type: 'gauge',
          //  center: ['20%', '50%'],
          radius: `${options.gaugeR - 4}%`,
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: options.endAngle,
          splitNumber: options.scope,
          axisLine: {
              show: true,
              lineStyle: {
                  width: 1,
                  color: [
                      [1, 'rgba(0,0,0,0)']
                  ]
              }
          }, //仪表盘轴线
          axisLabel: {
              show: true,
              color: '#ffffff',
              fontSize:14,
              fontFamily:'SourceHanSansSC-Regular',
              fontWeight:'bold',
              // position: "top",
                distance: -30,
          }, //刻度标签。
          axisTick: {
              show: true,
              splitNumber: 3,
              lineStyle: {
                  color: color1, //用颜色渐变函数不起作用
                  width: 1,
              },
              length: -6
          }, //刻度样式
          splitLine: {
              show: true,
              length: -12,
              lineStyle: {
                  color: color1, //用颜色渐变函数不起作用
              }
          }, //分隔线样式
          // axisLine: _axisLine,
          // splitLine: _splitLine,
          // axisTick: _axisTick,
          detail: {
              show: false
          }
      },
      {
          name: "内部进度条",
          type: "gauge",
          // center: ['20%', '50%'],
          radius: `${options.gaugeR - 32}%`,
          min: options.min,
          max: options.max,
          startAngle: options.startAngle,
          endAngle: options.endAngle,
          splitNumber: options.scope,
          axisLine: {
              lineStyle: {
                  color: [
                      [Number(items)  / 100, colorSet.color],
                      [1, colorSet.color]
                  ],
                  width: 1
              }
          },
          axisLabel: {
              show: false,
          },
          axisTick: {
              show: false,

          },
          splitLine: {
              show: false,
          },
          itemStyle: {
              color:"#ffffff"
          },
          detail: {
              formatter: function(value) {
                  if (value !== 0) {
                      var num = Math.round(value ) ;
                      return parseInt(`${num}`).toFixed(0)+"%";
                  } else {
                      return 0;
                  }
              },
              offsetCenter: [0, 67],
              textStyle: {
                  padding: [0, 0, 0, 0],
                  fontSize: 18,
                  color: "#fff"
              }
          },
          title: { //标题
              show: true,
              offsetCenter: [0, 46], // x, y，单位px
              textStyle: {
                  color: "#fff",
                  fontSize: 14, //表盘上的标题文字大小
                  fontWeight: 400,
                  fontFamily: 'MicrosoftYaHei'
              }
          },
          data: [{
              name: "去年优良率",
              value: items,
              itemStyle:{
                color:"#ffffff",
                fontFamily: "MicrosoftYaHei",
                fontSize:14
              }
          }],
          pointer: {
              show: true,
              length: '70%',
              radius: '20%',
              width: 3 //指针粗细

          },
          animationDuration: 4000,
      },
      { //指针上的圆
          type: 'pie',
          tooltip: {
              show: false
          },
          hoverAnimation: false,
          legendHoverLink: false,
          radius: ['0%', '4%'],
          center: ['50%', '50%'],
          label: {
              normal: {
                  show: false
              }
          },
          labelLine: {
              normal: {
                  show: false
              }
          },
          data: [{
              value: 120,
              itemStyle: {
                  normal: {
                      color: "#ffffff",
                  },
              }
          }]
      }, 
    ]

    const getSeries = () => {
      const _option = this.properties.gaugeOptions;
      let series = [];
      switch (_option) {
        case 'basic':
          series = basicGauge;
          break;
        case 'gradient':
          series = pieGauge;
          break;
        case 'shadow':
          series = pieGaugeProgress;
          break;
        default:
          break;
      }
      return series;
    }

    const option = {
      // backgroundColor: '#000',
      // haha chart options
      // title: {
      //     "x": '50%',
      //     "y": '45%',
      //     textAlign: "center",
      //     top: '68%',//字体的位置
      //     'text': '哈哈',
      //     "textStyle": {
      //         "fontWeight": 'normal',
      //         "color": '#FFF',
      //         "fontSize": 60
      //     },
      //     "subtextStyle": {//副标题的文字的样式
      //         "fontWeight": 'bold',
      //         "fontSize": 18,
      //         "color": '#3ea1ff'
      //     },
  
      // },
      xAxis: {
          show: false,//是否展示x轴
          min: function(value) {//调整x轴上面数据的位置
              return value.min - 7;
          },
          max: function(value) {
              return value.max + 7;
          },
          splitLine: {
              lineStyle: {
                  show: true,
                  type: 'dashed'
              }
          },
          "axisLabel": {
              "interval": 0,
              rotate: 40,
              textStyle: {
                  fontSize: 12,
                  color: '#000'
              },
          },
          data: ['1', '2', '3', '4', '5']
      },
      yAxis: {
          show: false,
          name: '万元',
          max: 200,
          splitLine: {
              lineStyle: {
                  type: 'dashed'
              }
          }
      },
      series: [...getSeries()]
    };
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
    let hiddenOptions: Array<string> = [''];
    
    if (!options.properties.showSubTitle) {
      hiddenOptions = hiddenOptions.concat(['subtitle'])
    }
    if (options.properties.Actual == "dataset") {
      hiddenOptions = hiddenOptions.concat(['customActual'])
    }

    if (options.properties.Contrast == "dataset") {
      hiddenOptions = hiddenOptions.concat(['customContrast'])

    }
    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
} 