import '../style/visual.less';
import _ = require('lodash');
const echarts = require('echarts');

export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private isMock: boolean;
  private items: any;
  private actualFormat: any;
  private contrastFormat: any;
  private host: any;
  static mockItems = [["人事部", "财务部", "销售部", "市场部", "采购部", "产品部", "技术部", "客服部", "后勤部"]
    , [58, 46, 47, 49, 59, 17, 25, 83, 34]
    , [74, 64, 78, 65, 79, 21, 28, 91, 38]
    , [78.38, 71.88, 60.26, 75.38, 74.68, 80.95, 89.29, 91.21, 89.47]
    , ["复工人数", "总人数"]
  ];
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.isMock = true;
    this.host = host;
    this.properties = {
    };
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.isMock = !dataView;
    this.items = [[], [], [], [], [], []];
    if (dataView) {
      const plainData = dataView.plain;
      let dimension = plainData.profile.dimension.values[0].display;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
      let ContrastValue = plainData.profile.ContrastValue.values[0].display;
      let data = plainData.data;
      this.items[0] = plainData.sort[dimension].order;
      this.items[4] = [ActualValue, ContrastValue];
      this.actualFormat = plainData.profile.ActualValue.options.valueFormat;
      this.contrastFormat = plainData.profile.ContrastValue.options.valueFormat;
      for (let index = 0; index < data.length; index++) {
        data.forEach((item) => {
          if (item[dimension] == this.items[0][index]) {
            this.items[1].push(item[ActualValue]);
            this.items[2].push(item[ContrastValue]);
            this.items[3].push(parseFloat((item[ActualValue] / item[ContrastValue] * 100).toFixed(2)));
          }
        })
      }
    }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const options = this.properties;
    const items = this.isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = this.isMock ? '0.3' : '1';
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }
    let labelfontWeight: string;
    if (options.labelTextStyle.fontWeight == "Light") {
      labelfontWeight = options.labelTextStyle.fontWeight + "er"
    } else {
      labelfontWeight = options.labelTextStyle.fontWeight
    }
    let legendfontWeight: string;
    if (options.legendtextStyle.fontWeight == "Light") {
      labelfontWeight = options.legendtextStyle.fontWeight + "er"
    } else {
      labelfontWeight = options.legendtextStyle.fontWeight
    }

    let option = {
      tooltip: {
        show: true,
        formatter: (params) => {
          for (var i = 0; i < items[0].length; i++) {
            if (items[0][i] === params.name) {
              // return items[4][0] + ":" + items[1][i] + "<br/>" + items[4][1] + ":" + items[2][i];
              return items[4][0] + ":" + this.host.formatService.format(this.actualFormat, items[1][i]).toLocaleString() + "<br/>" + items[4][1] + ":" + this.host.formatService.format(this.contrastFormat, items[2][i]).toLocaleString();
            }
          }
        }
      },
      grid: {
        top: '0',
        left: '0',
        bottom: '0',
        containLabel: true
      },
      legend: {
        show: options.showlegend,
        left: 'center',
        top: 0,
        textStyle: {
          color: options.legendtextStyle.color,
          fontSize: options.legendtextStyle.fontSize.substr(0, 2),
          fontWeight: legendfontWeight,
          fontFamily: options.legendtextStyle.fontFamily,
          fontStyle: options.legendtextStyle.fontStyle
        },
        data: items[4]
      },
      color: [options.piecesColor[0], options.barBackgroundColor],
      yAxis: [
        {
          type: 'category',
          data: items[0],
          offset: options.offset,
          inverse: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: options.showLabel,
            margin: 20,
            align: options.align,
            color: options.textStyle.color,
            fontSize: options.textStyle.fontSize.substr(0, 2),
            fontWeight: fontWeight,
            fontFamily: options.textStyle.fontFamily,
            fontStyle: options.textStyle.fontStyle,
          },
          axisLine: {
            show: false
          },
        },
        {
          show: true,
          type: 'category',
          data: items[0],
          inverse: true,
          axisTick: "none",
          axisLine: "none",
          align: "right",
          axisLabel: {
            show: options.showLabel,
            align: options.align,
            color: options.textStyle.color,
            fontSize: options.textStyle.fontSize.substr(0, 2),
            fontWeight: fontWeight,
            fontFamily: options.textStyle.fontFamily,
            fontStyle: options.textStyle.fontStyle,
            rich: {
              a: { width: options.LabelWidth, align: "left" }
            },
            formatter: (params) => {
              var index = items[0].indexOf(params)
              var item1 = this.host.formatService.format(this.contrastFormat, items[2][index]).toLocaleString()
              var item2 = this.host.formatService.format(this.actualFormat, items[1][index]).toLocaleString()
              return [
                "{a|" + item1 + "}{a|" + item2 + "}"
              ];
            }
          }
        }
      ],
      xAxis: [{
        type: 'value',
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        type: 'bar',
        name: items[4][0],
        barWidth: options.barWidth,
        data: items[3],
        label: {
          show: options.showBarLabel,
          position: 'inside',
          formatter: (params) => {
            return params.value.toFixed(1) + "%";
          },
          color: options.labelTextStyle.color,
          fontSize: options.labelTextStyle.fontSize.substr(0, 2),
          fontWeight: labelfontWeight,
          fontFamily: options.labelTextStyle.fontFamily,
          fontStyle: options.labelTextStyle.fontStyle,
        },
        itemStyle: {
          color: options.piecesColor[0],
          barBorderRadius: options.barBorderRadius
        }
      }, {
        type: "bar",
        name: items[4][1],
        barWidth: options.barWidth,
        xAxisIndex: 0,
        barGap: "-100%",
        data: items[3].map(function (item) {
          return 100
        }),
        itemStyle: {
          color: options.barBackgroundColor,
          barBorderRadius: options.barBorderRadius
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
          }
        },
        zlevel: -1
      }]
    }
    this.chart.setOption(option)

  }
  public onResize() {
    this.chart.resize();
    this.render();
  }
  // 自定义属性可见性
  public getInspectorHiddenState(updateOptions: any): string[] {
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