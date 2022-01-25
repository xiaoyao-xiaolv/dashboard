import '../style/visual.less';
import * as echarts from 'echarts';

export default class Visual extends WynVisual {

  private host: any;
  private myEcharts: any;
  private selectionManager: any;
  private selectionIds: any;
  private format: any;
  private options: any;
  private items: any;
  private isMock: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.host = host;
    this.myEcharts = echarts.init(dom);
    this.selectionIds = [];
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.isMock = true;
    console.log(options);

    const dataView = options.dataViews[0] && options.dataViews[0].plain;
    if (dataView) {
      const valueDisplay = dataView.profile.value.values[0].display;
      const y = [];
      let value2Display;
      let y2;
      if (dataView.profile.value.values.length == 2) {
        value2Display = dataView.profile.value.values[1].display;
        y2 = [];
      }
      const seriesDisplay = dataView.profile.series.values[0].display;
      const x = [];
      let series2Display
      let x2
      if (dataView.profile.series.values.length == 2) {
        series2Display = dataView.profile.series.values[1].display;
        x2 = [];
      }
      dataView.data.forEach((data) => {
        let index = 0;
        if (x.indexOf(data[seriesDisplay]) == -1) {
          x.push(data[seriesDisplay])
          y[x.indexOf(data[seriesDisplay])] = 0;
        }
        index = x.indexOf(data[seriesDisplay]);
        y[index] += data[valueDisplay];
        if (dataView.profile.value.values.length == 2) {
          if (dataView.profile.series.values.length == 2) {
            if (x2.indexOf(data[series2Display]) == -1) {
              x2.push(data[series2Display])
              y2[x2.indexOf(data[series2Display])] = 0;
            }
            index = x2.indexOf(data[series2Display]);
            y2[index] += data[value2Display];
          } else {
            if (typeof (y2[index]) == "undefined") {
              y2[index] = 0
            }
            y2[index] += data[value2Display]
          }
        }
      })
      this.items = {
        x: x,
        x2: x2,
        y: y,
        y2: y2
      };
    }
    console.log(this.items)
    this.options = options.properties;
    this.render();
    
  }

  public render() {
    let option = {
      grid: {
        bottom: 80
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          restore: {},
          saveAsImage: {}
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          animation: false,
          label: {
            backgroundColor: '#505765'
          }
        }
      },
      legend: {
        data: ['Flow', 'Rainfall'],
        left: 10
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          start: 65,
          end: 85
        },
        {
          type: 'inside',
          realtime: true,
          start: 65,
          end: 85
        }
      ],
      xAxis: [
        {
          id: 1,
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#5470C6'
            }
          },
          // prettier-ignore
          data: this.items.x
        },
        {
          id: 2,
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#EE6666'
            }
          },
          // prettier-ignore
          data: typeof(this.items.x2) == undefined ? null : this.items.x2
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Flow',
          type: 'line',
          areaStyle: {},
          lineStyle: {
            width: 1
          },
          emphasis: {
            focus: 'series'
          },
          // prettier-ignore
          data: this.items.y
        },
        {
          name: 'Rainfall',
          type: 'line',
          areaStyle: {},
          lineStyle: {
            width: 1
          },
          emphasis: {
            focus: 'series'
          },
          // prettier-ignore
          data: this.items.y2
        }
      ]
    };
    this.myEcharts.setOption(option);

  }

  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}