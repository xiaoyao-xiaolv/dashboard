import '../style/visual.less';
import * as echarts from 'echarts';

export default class Visual extends WynVisual {
  private myChart: any;
  private container: HTMLDivElement;
  private isMock: boolean;
  private data: any;
  private properties: any;
  private multiCategories: boolean;
  private mockData = {
    workTime : '2021-01-04T08:30:00',
    offTime : '2021-01-04T19:30:00',
    colors: ['#2ec7c9', '#D6737A'],
    categories:['产线1','产线2'],
    statusList: ['正常', '故障'],
    statusData: [
      {
        name: '正常',
        value: [0, '2021-01-04T8:31:56', '2021-01-04T11:01:59']
      },
      {
        name: '故障',
        value: [0, '2021-01-04T11:01:59', '2021-01-04T12:02:18']
      },
      {
        name: '正常',
        value: [0, '2021-01-04T12:02:18', '2021-01-04T12:40:54']
      },
      {
        name: '故障',
        value: [0, '2021-01-04T12:40:54', '2021-01-04T14:03:59']
      },
      {
        name: '正常',
        value: [0, '2021-01-04T14:03:59', '2021-01-04T14:05:32']
      },
      {
        name: '正常',
        value: [0, '2021-01-04T14:05:32', '2021-01-04T14:17:23']
      },
      {
        name: '正常',
        value: [0, '2021-01-04T14:17:23', '2021-01-04T15:17:23']
      },
      {
        name: '正常',
        value: [1, '2021-01-04T8:31:56', '2021-01-04T11:01:59']
      },
      {
        name: '故障',
        value: [1, '2021-01-04T11:01:59', '2021-01-04T12:02:18']
      },
      {
        name: '正常',
        value: [1, '2021-01-04T12:02:18', '2021-01-04T12:40:54']
      },
      {
        name: '正常',
        value: [1, '2021-01-04T12:40:54', '2021-01-04T14:03:59']
      },
      {
        name: '正常',
        value: [1, '2021-01-04T14:03:59', '2021-01-04T14:05:32']
      },
      {
        name: '正常',
        value: [1, '2021-01-04T14:05:32', '2021-01-04T14:17:23']
      },
      {
        name: '故障',
        value: [1, '2021-01-04T14:17:23', '2021-01-04T15:17:23']
      }
    ]
  };

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.myChart = echarts.init(dom);
    this.isMock = true;
    this.multiCategories = false;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.properties = options.properties;
    this.isMock = !options.dataViews.length;
    this.multiCategories = !options.dataViews.length;
    if (!this.isMock) {
      let plainData = options.dataViews[0].plain;
      this.multiCategories = !!(plainData.profile.categories && plainData.profile.categories.values.length);
      // 获取字段名称对象
      let filedName= {};
      for (let name in plainData.profile) {
        filedName[name] = plainData.profile[name].values[0] && plainData.profile[name].values[0].display;
      }

      this.data = {
        workTime : plainData.data[0][filedName['workTime']],
        offTime : plainData.data[0][filedName['offTime']],
        statusList : plainData.sort[filedName['status']].order
      };
      this.data.statusList = this.data.statusList.map((data) => {return data + ""})

      if (this.multiCategories) {
        this.data['categories'] = plainData.sort[filedName['categories']].order;
      }

      if (!this.properties.mainColorAssignment) {
        let bindColorLength = this.properties.statusColors.length;
        if (this.data['statusList'].length > bindColorLength) {
          this.data['colors'] = this.data['statusList'].map((status, index) => {
            return this.properties.statusColors[index % bindColorLength];
          })
        } else {
          this.data['colors'] = this.properties.statusColors;
        }
      } else {
        this.data['colors'] = this.data['statusList'].map((status) => {
          return this.properties.mainColorAssignment[status];
        })
      }

      this.data['statusData'] = plainData.data.map((data) => {
        let resultData = {
          name: data[filedName['status']] + "",
          value: [data[filedName['startTime']], data[filedName['endTime']]]
        }
        if (this.multiCategories && this.data.categories.indexOf(data[filedName['categories']]) >= 0) {
          resultData.value.unshift(this.data.categories.indexOf(data[filedName['categories']]));
        }
        return resultData;
      })
    }
    this.render();
  }

  private render() {
    this.myChart.clear();
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    let data = this.isMock ? this.mockData : this.data;
    data.statusData.forEach((item) => {
      if (this.properties.mainColorAssignment) {
        item['itemStyle'] = {
          normal: {
            color: this.properties.mainColorAssignment[item.name]
          }
        }
      } else {
        let index = data.statusList.indexOf(item.name);
        item['itemStyle'] = {
          normal: {
            color: data.colors[index]
          }
        }
      }
    })

    let renderCustomItem = (params, api) => {
      let categoryIndex = this.multiCategories ? api.value(0) : 0;
      let startIndex = this.multiCategories ? 1 : 0;
      let endIndex = this.multiCategories ? 2 : 1;
      let start = api.coord([api.value(startIndex), categoryIndex]);
      let end = api.coord([api.value(endIndex), categoryIndex]);
      let height = this.properties.height;
      return {
        type: 'rect',
        shape: {
          x: start[0],
          y: start[1] - height/2,
          width: end[0] - start[0],
          height: this.multiCategories ? height : -height
        },
        style: api.style()
      };
    }

    let option = {
      color: data.colors,
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
        show: true,
        type: 'time',
        axisLabel: {
          formatter: this.properties.startCustom ? this.properties.customTimeFormat : this.properties.timeFormat,
          textStyle: {
            ...this.properties.aAxisTextStyle,
            fontSize: parseFloat(this.properties.aAxisTextStyle.fontSize),
          },

        },
        axisLine : {
          show: true
        },
        axisTick : {
          show: true,
          alignWithLabel: true
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
      tooltip: {
        show: true
      },
      series: [
        {
          tooltip: {
            formatter: (params,ticket,callback) => {
              let res = params.name + "<br/>";
              if(this.multiCategories){
                res = res + "开始时间:" + params.value[1] + "<br/>"
                res = res + "结束时间:" + params.value[2]
              }else{
                res = res + "开始时间:" + params.value[0] + "<br/>"
                res = res + "结束时间:" + params.value[1]
              }
              return res
            }
          },
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
            x: [0, 1]
          },
          data: [{
            itemStyle: {
              normal: {
                color: this.properties.statusBgColors
              }
            },
            value: [ data.workTime, data.offTime]
          }],
          zlevel: -1
        }
      ]
    };

    if (this.multiCategories) {
      option.yAxis.show = true;
      option.yAxis['data'] = data.categories;
      option.yAxis['axisLine'] = {
        show : false
      };
      option.yAxis['axisTick'] = {
        show : false,
        alignWithLabel: true
      };
      option.yAxis['axisLabel'] = {
        show : this.properties.showAxisLabel,
        textStyle: {
          ...this.properties.yAxisTextStyle,
          fontSize: parseFloat(this.properties.yAxisTextStyle.fontSize),
        },
      };
      option.series.forEach((series) => {
        series.encode['x'] = [1, 2];
        series.encode['y'] = [0];
      })
      for (let i = 0; i < data.categories.length; i++) {
        if (i === 0) {
          option.series[1].data[0].value.unshift(i);
        } else {
          option.series[1].data.push({
            itemStyle: {
              normal: {
                color: this.properties.statusBgColors
              }
            },
            value: [ i, data.workTime, data.offTime]
          })
        }
      }
    }


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
    this.myChart.dispose();
  }

  public onResize(): void {
    this.myChart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    const hiddenStatus = [];

    if (options.properties.startCustom) {
      hiddenStatus.push('timeFormat');
    } else {
      hiddenStatus.push('customTimeFormat');
    }

    if (options.properties.mainColorAssignment) {
      hiddenStatus.push('statusColors');
    }

    return hiddenStatus;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    if (!dataViews.length) {
      return null;
    }
    const plain = dataViews[0].plain;
    const statusProfile = plain.profile.status.values[0];
    if (!statusProfile) {
      return null;
    }
    const colorValues = plain.data.map(d => d[statusProfile.display]);
    return {
      mainColorAssignment: {
        values: Array.from(new Set(colorValues)),
        type: 'dimension',
        columns: [statusProfile],
      },
    };
  }
}
