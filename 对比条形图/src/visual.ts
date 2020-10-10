import '../style/visual.less';
const echarts = require('echarts');
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  static mockItems = [["人事部", "财务部", "销售部", "市场部", "采购部", "产品部", "技术部", "客服部", "后勤部"]
    , [58, 46, 47, 49, 59, 17, 25, 83, 34]
    , [74, 64, 78, 65, 79, 21, 28, 91, 38]
    , [78.38, 71.88, 60.26, 75.38, 74.68, 80.95, 89.29, 91.21, 89.47]
    , ["复工人数", "总人数"]
  ];
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.properties = {
      barWidth: 14,
      fontSize: 14,
      textColor: '#ffffff',
      barBackgroundColor: '#444a58',
      barStartColor: '#57eabf',
      barEndcolor: '#2563f9',
    };
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.ContrastValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      let dimension = plainData.profile.dimension.values[0].display;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
      let ContrastValue = plainData.profile.ContrastValue.values[0].display;
      this.items[0] = plainData.sort[dimension].order;
      this.items[1] = plainData.data.map(function (item) {
        return item[ActualValue]
      });
      this.items[2] = plainData.data.map(function (item) {
        return item[ContrastValue]
      });
      this.items[3] = plainData.data.map(function (item) {
        return parseFloat((item[ActualValue] / item[ContrastValue] * 100).toFixed(2))
      });
      this.items[4] = [ActualValue, ContrastValue]
    }

    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    var option = {
      tooltip: {
        show: true,
        formatter(params) {
          for (var i = 0; i < items[0].length; i++) {
            if (items[0][i] === params.name) {
              return items[4][0] + ":" + items[1][i] + "<br/>" + items[4][1] + ":" + items[2][i];
            }
          }
        }
      },
      grid: {
        top: '0',
        left: '0',
        right: '4.75%',
        bottom: '0',
        containLabel: true
      },
      yAxis: [{
        type: 'category',
        data: items[0],
        inverse: true,
        axisTick: {
          show: false
        },
        axisLabel: {
          margin: 20,
          textStyle: {
            fontSize: options.fontSize,
            color: options.textColor
          }
        },
        axisLine: {
          show: false
        },
      }],
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
        barWidth: options.barWidth,
        data: items[3],
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}%',
          color: '#ffffff',
          fontSize: 12,
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: options.barStartColor // 0% 处的颜色
          }, {
            offset: 1,
            color: options.barEndcolor // 100% 处的颜色
          }], false),
          barBorderRadius: 14
        }
      }, {
        type: "bar",
        barWidth: options.barWidth,
        xAxisIndex: 0,
        barGap: "-100%",
        data: items[3].map(function (item) {
          return 100
        }),
        itemStyle: {
          color: options.barBackgroundColor,
          barBorderRadius: 14
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