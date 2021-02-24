import '../style/visual.less';
import * as echarts from 'echarts';

export default class Visual extends WynVisual {
  private myChart: any;
  private container: HTMLDivElement;
  private isMock: boolean;
  private data: any;
  private properties: any;
  private mockData = {
    workTime : '2021-01-04T08:30:00',
    offTime : '2021-01-04T19:30:00',
    colors: ['#2ec7c9', '#D6737A'],
    statusList: ['正常', '故障'],
    statusData: [
      {
        name: '正常',
        value: ['2021-01-04T8:31:56', '2021-01-04T11:01:59']
      },
      {
        name: '故障',
        value: ['2021-01-04T11:01:59', '2021-01-04T12:02:18']
      },
      {
        name: '正常',
        value: ['2021-01-04T12:02:18', '2021-01-04T12:40:54']
      },
      {
        name: '故障',
        value: ['2021-01-04T12:40:54', '2021-01-04T14:03:59']
      },
      {
        name: '正常',
        value: ['2021-01-04T14:03:59', '2021-01-04T14:05:32']
      },
      {
        name: '故障',
        value: ['2021-01-04T14:05:32', '2021-01-04T14:17:23']
      },
      {
        name: '正常',
        value: ['2021-01-04T14:17:23', '2021-01-04T15:17:23']
      }
    ]
  };

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.myChart = echarts.init(dom);
    this.isMock = true;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.properties = options.properties;
    this.isMock = !options.dataViews.length;
    if (!this.isMock) {
      let plainData = options.dataViews[0].plain
      // 获取字段名称对象
      let filedName= {};
      for (let name in plainData.profile) {
        filedName[name] = plainData.profile[name].values[0].display;
      }

      this.data = {
        workTime : plainData.data[0][filedName['workTime']],
        offTime : plainData.data[0][filedName['offTime']],
        statusList : plainData.sort[filedName['status']].order
      };

      let bindColorLength = this.properties.statusColors.length;
      if (this.data['statusList'].length > bindColorLength) {
        this.data['colors'] = this.data['statusList'].map((status, index) => {
           return this.properties.statusColors[index % bindColorLength];
        })
      } else {
        this.data['colors'] = this.properties.statusColors;
      }

      this.data['statusData'] = plainData.data.map((data) => {
        return {
          name: data[filedName['status']],
          value: [data[filedName['startTime']], data[filedName['endTime']]]
        }
      })
    }
    this.render();
  }

  private render() {
    this.myChart.clear();
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    let data = this.isMock ? this.mockData : this.data;1234
    data.statusData.forEach((item) => {
      let index = data.statusList.indexOf(item.name);
      item['itemStyle'] = {
        normal: {
          color: data.colors[index]
        }
      }
    })

    let renderCustomItem = (params, api) => {
      let start = api.coord([api.value(0), 0]);
      let end = api.coord([api.value(1), 0]);
      let height = this.properties.height;
      return {
        type: 'rect',
        shape: echarts.graphic.clipRectByRect({
          x: start[0],
          y: start[1] - height / 2 - 10,
          width: end[0] - start[0],
          height: height
        }, {
          x: params.coordSys.x,
          y: params.coordSys.y - 10,
          width: params.coordSys.width,
          height: params.coordSys.height
        }),
        style: api.style()
      };
    }

    let option = {
      color: data.colors,
      tooltip: {
        formatter: function () {}
      },
      legend: {
        show: this.properties.showLegend,
        data: data.statusList,
        selectedMode: false,
        icon: this.properties.legendIcon,
        left: this.properties.legendHorizontalPosition,
        top: this.properties.legendVerticalPosition,
        orient:this.properties.legendOrient,
        textStyle: {
          ...this.properties.legendTextStyle,
          fontSize: parseFloat(this.properties.legendTextStyle.fontSize),
        },
      },
      xAxis: {
        type: 'time',
        axisLabel: {
          formatter: '{HH}:{mm}'
        },
        min: function () {
          return new Date(data.workTime);
        },
        max: function () {
          return new Date(data.offTime);
        }
      },
      yAxis: {
        show: false
      },
      series: [
        {
          type: 'custom',
          renderItem : renderCustomItem,
          encode: {
            x: [0, 1],
          },
          data: data.statusData
        },
        {
          type: 'custom',
          renderItem: renderCustomItem,
          encode: {
            x: [0, 1],
          },
          data: [
            {
              itemStyle: {
                normal: {
                  color: '#fafafa'
                }
              },
              value: [data.workTime, data.offTime]
            }
          ],
          zlevel: -1
        },
      ]
    };

    let seriesStatus = data.statusList.map((status) => {
      return {
        name: status,
        type: 'pie',
        data: []
      }
    });
    [].unshift.apply(option.series, seriesStatus);
    this.myChart.setOption(option);

  }

  public onDestroy(): void {

  }

  public onResize(): void {
    this.myChart.resize();
    this.render();
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