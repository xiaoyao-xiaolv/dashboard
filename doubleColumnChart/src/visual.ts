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
  private format: any;
  private selectionManager: any;
  private selectionIds: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    visualHost = host;
    this.myChart = echarts.init(dom);
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
  }

  private selectEvent() {
    this.container.addEventListener("click", () => {
      this.selectionManager.clear();
      visualHost.toolTipService.hide();
      visualHost.contextMenuService.hide();
      return;
    })

    //鼠标左键
    this.myChart.on('click', (params) => {
      visualHost.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.properties.leftMouseButton;
        const sid = this.selectionIds[params.dataIndex];
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            if(this.selectionManager.contains(sid)){
              this.selectionManager.clear(sid)
            }else{
              if (this.properties.onlySelect) {
                this.selectionManager.clear();
              }
              this.selectionManager.select(sid, true);
            }
            if (this.selectionManager.selected.length == this.selectionIds.length) {
              this.selectionManager.clear();
            }
            break;
          }
          case "showToolTip": {
            this.showTooltip(params, true);
            break;
          }
          default: {
            visualHost.commandService.execute([{
              name: leftMouseButton,
              payload: {
                selectionIds: sid,
                position: {
                  x: params.event.event.x,
                  y: params.event.event.y,
                },
              }
            }])
          }
        }
      }
    })

    this.container.addEventListener('mouseup', (params) => {
      document.oncontextmenu = function () { return false; };
      if (params.button === 2) {
        visualHost.contextMenuService.show({
          position: {
            x: params.x,
            y: params.y,
          },
          menu: true
        }, 10)
        return;
      }else{
        visualHost.contextMenuService.hide();	
      }
    })

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.format = options.dataViews[0].plain.profile.leftData.values[0].format;
    this.isMock = !options.dataViews.length;
    this.properties = options.properties;
    const realData = {};
    if (!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      let leftDataName = profile.leftData.values[0].display;
      let rightDataName = profile.rightData.values[0].display;
      let categoryName = profile.category.values[0].display;
      leftFormat = profile.leftData.values[0].format;
      this.selectionIds = bindData.map(item => {
        const selectionId = visualHost.selectionService.createSelectionId();
        selectionId.withDimension(options.dataViews[0].plain.profile.category.values[0], item);
        return selectionId
      })
      rightFormat = profile.rightData.values[0].format;
      Object.assign(realData, {
        leftData: bindData.map(item => item[leftDataName]),
        rightData: bindData.map(item => item[rightDataName]),
        category: bindData.map(item => item[categoryName]),
        legend: [leftDataName, rightDataName]
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
          data: data.legend,
          icon: this.properties.legendIcon,
          left: this.properties.legendHorizontalPosition,
          top: this.properties.legendVerticalPosition,
          itemWidth: 25,
          itemHeight: 15,
          orient: this.properties.legendOrient,
          textStyle: {
            ...this.properties.legendTextStyle,
            fontSize: parseFloat(this.properties.legendTextStyle.fontSize),
          },
        },
        grid: [{
          show: false,
          left: '5%',
          top: this.properties.legendVerticalPosition != 'top' ? '0px' : '30px',
          bottom: this.properties.legendVerticalPosition != 'bottom' ? '0px' : '30px',
          containLabel: false,
          width: this.properties.leftGridWidth
        }, {
          show: false,
          left: '51%',
          top: this.properties.legendVerticalPosition != 'top' ? '0px' : '30px',
          bottom: this.properties.legendVerticalPosition != 'bottom' ? '0px' : '30px'
        }, {
          show: false,
          right: '5%',
          top: this.properties.legendVerticalPosition != 'top' ? '0px' : '30px',
          bottom: this.properties.legendVerticalPosition != 'bottom' ? '0px' : '30px',
          containLabel: false,
          width: this.properties.rightGridWidth
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
            show: this.properties.showLeftAxisLabel,
            color: textColor,
            formatter: function (value) {
              if (leftFormat) {
                return visualHost.formatService.format(leftFormat, value)
              }
            }
          },
          splitLine: {
            show: this.properties.showLine,
            lineStyle: {
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
            show: this.properties.showRightAxisLabel,
            color: textColor,
            formatter: function (value) {
              if (rightFormat) {
                return visualHost.formatService.format(rightFormat, value)
              }
            }
          },
          splitLine: {
            show: this.properties.showLine,
            lineStyle: {
              color: this.properties.lineColor
            }
          },
        }],
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLine: {
            show: true,
            lineStyle: {
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
            verticalAlign: 'middle',
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
            lineStyle: {
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
          show: this.properties.showLeftLabel,
          position: 'left',
          textStyle: {
            ...this.properties.leftLabelText,
            fontSize: parseFloat(this.properties.leftLabelText.fontSize),
          },
          formatter: function (params) {
            if (leftFormat) {
              return visualHost.formatService.format(leftFormat, params.value)
            }
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
          show: this.properties.showRightLabel,
          position: 'right',
          textStyle: {
            ...this.properties.rightLabelText,
            fontSize: parseFloat(this.properties.rightLabelText.fontSize),
          },
          formatter: function (params) {
            if (rightFormat) {
              return visualHost.formatService.format(rightFormat, params.value)
            }
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

    if (!properties.showLine) {
      hiddenStates.push('lineColor');
    }

    if (!properties.showRightLabel) {
      hiddenStates.push('rightLabelText');
    }
    return hiddenStates;

  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }

  //数据格式
  private formatData(number) {
    const formatService = visualHost.formatService;
    let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
    return formatService.format(this.format, number, realDisplayUnit);
  }

  private showTooltip(params, asModel = false) {
    if (asModel)
      visualHost.toolTipService.show({
        position: {
          x: params.event.event.x,
          y: params.event.event.y,
        },

        fields: [{
          label: params.name,
          value: params.data,
        }],
        selected: this.selectionManager.getSelectionIds(),
        menu: true,
      }, 10);
  }
}