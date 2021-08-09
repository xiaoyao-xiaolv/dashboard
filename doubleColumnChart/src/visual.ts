import '../style/visual.less';
import * as echarts from 'echarts'

const mockData = {
  leftData: [3, 20, 72, 34, 55, 65, 33],
  rightData: [11, 38, 23, 39, 66, 66, 79],
  category: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
  legend: ['2017', '2018']
}
let visualHost;
let leftFormat;
let rightFormat;
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private myChart: any;
  private isMock: any;
  private properties: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    visualHost = host;
    this.myChart = echarts.init(dom);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.isMock = !options.dataViews.length;
    this.properties = options.properties;
    const realData = {};
    if(!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      let leftDataName = profile.leftData.values[0].display;
      let rightDataName = profile.rightData.values[0].display;
      let categoryName = profile.category.values[0].display;
      leftFormat = profile.leftData.values[0].format;
      rightFormat = profile.rightData.values[0].format;
      Object.assign(realData, {
        leftData: bindData.map(item => item[leftDataName]),
        rightData: bindData.map(item => item[rightDataName]),
        category: bindData.map(item => item[categoryName]),
        legend: [ leftDataName, rightDataName ]
      })
    }
    let data = this.isMock ? mockData : realData;
    this.render(data);
  }


  private render(data) {
    this.container.style.opacity = this.isMock ? '0.5' : '1'
    this.myChart.clear();
    let textColor = "#fff";
    let option = {
      baseOption: {
        timeline: {
          show: false,
          top: 0,
          data: []
        },
        legend: {
          data : data.legend,
          icon: this.properties.legendIcon,
          left: this.properties.legendHorizontalPosition,
          top: this.properties.legendVerticalPosition,
          itemWidth:25,
          itemHeight:15,
          orient:this.properties.legendOrient,
          textStyle: {
            ...this.properties.legendTextStyle,
            fontSize: parseFloat(this.properties.legendTextStyle.fontSize),
          },
        },
        grid: [{
          show: false,
          left: '5%',
          top: '10%',
          bottom: '8%',
          containLabel: true,
          width: '37%'
        }, {
          show: false,
          left: '50%',
          top: '10%',
          bottom: '8%'
        }, {
          show: false,
          right: '5%',
          top: '10%',
          bottom: '8%',
          containLabel: true,
          width: '37%'
        }],
        xAxis: [{
          type: 'value',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          position: this.properties.leftLabelLocation,
          axisLabel: {
            show: true,
            color: textColor,
            formatter: function (value) {
              if (leftFormat) {
                return visualHost.formatService.format(leftFormat, value)
              }
            }
          },
          splitLine:{
            show: true,
            lineStyle:{
              color: this.properties.lineColor
            }
          },
        }, {
          gridIndex: 1,
          show: false
        }, {
          gridIndex: 2,
          type: 'value',
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          position: this.properties.rightLabelLocation,
          axisLabel: {
            show: true,
            color: textColor,
            formatter: function (value) {
              if (rightFormat) {
                return visualHost.formatService.format(rightFormat, value)
              }
            }
          },
          splitLine:{
            show: true,
            lineStyle:{
              color:this.properties.lineColor
            }
          },
        }],
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLine: {
            show: true,
            lineStyle:{
              color: this.properties.lineColor
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          data: data.category
        }, {
          gridIndex: 1,
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            padding: [0,0,0,15],
            textStyle: {
              ...this.properties.categoryTextStyle,
              fontSize: parseFloat(this.properties.categoryTextStyle.fontSize),
            },
            align: "center"
          },
          data: data.category
        }, {
          gridIndex: 2,
          type: 'category',
          inverse: true,
          axisLine: {
            show: true,
            lineStyle:{
              color:this.properties.lineColor
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false

          },
          data: data.category
        }],
        series: []

      },
      options: []
    }
    option.options.push({
      series: [{
        name: data.legend[0],
        type: "bar",
        itemStyle: {
          normal: {
            color: this.properties.leftBarColor
          }
        },
        label: {
          normal: {
            show: false,
          }
        },
        data: data.leftData,
        animationEasing: "elasticOut"
      },
        {
          name: data.legend[1],
          type: "bar",
          xAxisIndex: 2,
          yAxisIndex: 2,
          itemStyle: {
            normal: {
              color: this.properties.rightBarColor
            }
          },
          label: {
            normal: {
              show: false,
            }
          },
          data: data.rightData,
          animationEasing: "elasticOut"
        }
      ]
    });
    if (!this.properties.autoLeftBarWidth) {
      option.options[0].series[0].barWidth = this.properties.leftBarWidth;
    }
    if (!this.properties.autoRightBarWidth) {
      option.options[0].series[1].barWidth = this.properties.rightBarWidth;
    }
    this.myChart.setOption(option);
  }

  public onDestroy(): void {

  }

  public onResize() {
    this.myChart.resize();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let properties = options.properties;
    let hiddenStates = [];
    if (properties.autoLeftBarWidth) {
      hiddenStates.push('leftBarWidth');
    }
    if (properties.autoRightBarWidth) {
      hiddenStates.push('rightBarWidth');
    }

    if (properties.autoInterval) {
      hiddenStates.push('intervalValue');
    }
    return hiddenStates;

  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}