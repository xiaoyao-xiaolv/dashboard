import '../style/visual.less';
import * as echarts from 'echarts';

export default class Visual extends WynVisual {

  private host: any;
  private myEcharts: any;
  private selectionManager: any;
  private dom: any;
  private format: any;
  private options: any;
  private items: any;
  private isMock: any;
  static mockItems = {
    valueDisplay: ["销售价格", "销售利润"],
    seriesDisplay: ["省份", "城市"],
    x: ["陕西", "四川", "青海", "吉林", "云南", "黑龙江"],
    x2: ["西安", "太原", "成都", "南京", "温州", "青岛", "大连", "深圳"],
    y: [74624, 59448, 65487, 98745, 56478, 74891, 65781, 54789],
    y2: [201545, 113450, 214563, 221450, 120013, 246513]
  }

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom = dom;
    this.host = host;
    this.myEcharts = echarts.init(dom);
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
  }

  private selectEvent() {
    this.dom.addEventListener("click", () => {
      this.selectionManager.clear();
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })



    this.myEcharts.on('click', (params) => {
      console.log(params)
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.options.leftMouseButton;
        let sid;
        if (typeof (this.items.selectionIds2) == "undefined") {
          sid = this.items.selectionIds1[params.dataIndex]
        } else {
          if (params.seriesId == 0)
            sid = this.items.selectionIds1[params.dataIndex]
          else
            sid = this.items.selectionIds2[params.dataIndex]
        }
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            if (this.selectionManager.contains(sid)) {
              this.selectionManager.clear(sid)
            } else {
              if (this.options.onlySelect) {
                this.selectionManager.clear();
              }
              this.selectionManager.select(sid, true);
            }
            if (this.selectionManager.selected.length == this.items[2].length) {
              this.selectionManager.clear();
            }
            break;
          }
          case "showToolTip": {
            this.showTooltip(params, true);
            break;
          }
          default: {
            this.host.commandService.execute([{
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

    this.myEcharts.on('mouseup', (params) => {
      if (params.event.event.button === 2) {
        document.oncontextmenu = function () { return false; };
        params.event.event.preventDefault();
        this.host.contextMenuService.show({
          position: {								//跳转的selectionsId(左键需要)
            x: params.event.event.x,
            y: params.event.event.y,
          }
        })
        return;
      } else {
        this.host.contextMenuService.hide();
      }
    })
  }

  public onResize() {
    this.myEcharts.resize();
    this.render();
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.isMock = true;
    console.log(options)

    const dataView = options.dataViews[0] && options.dataViews[0].plain;
    if (dataView) {
      this.isMock = false;
      let selectionIds1 = []
      this.format = options.dataViews[0].plain.profile.value.values[0].format;
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
      let selectionIds2;
      if (dataView.profile.series.values.length == 2) {
        selectionIds2 = [];
        series2Display = dataView.profile.series.values[1].display;
        x2 = [];
      }
      dataView.data.forEach((data) => {
        let index = 0;
        if (x.indexOf(data[seriesDisplay]) == -1) {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(dataView.profile.series.values[0], data);
          selectionIds1.push(selectionId)
          x.push(data[seriesDisplay])
          y[x.indexOf(data[seriesDisplay])] = 0;
        }
        index = x.indexOf(data[seriesDisplay]);
        y[index] += data[valueDisplay];
        if (dataView.profile.value.values.length == 2) {
          if (dataView.profile.series.values.length == 2) {
            if (x2.indexOf(data[series2Display]) == -1) {
              const selectionId = this.host.selectionService.createSelectionId();
              selectionId.withDimension(dataView.profile.series.values[1], data);
              selectionIds2.push(selectionId)
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
      let vd = []
      vd.push(valueDisplay)
      if (typeof (value2Display) != "undefined") {
        vd.push(value2Display)
      }
      let sd = []
      sd.push(seriesDisplay)
      if (typeof (series2Display) != "undefined") {
        sd.push(series2Display)
      }
      this.items = {
        valueDisplay: vd,
        seriesDisplay: sd,
        x: x,
        x2: x2,
        y: y,
        y2: y2,
        selectionIds1: selectionIds1,
        selectionIds2: selectionIds2
      };
    }
    if (this.isMock)
      this.items = Visual.mockItems
    this.options = options.properties;
    this.render();

  }

  public render() {
    this.myEcharts.clear();
    const orient = this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? 'vertical' : 'horizontal';
    let option = {
      grid: [
        {
          id: 0,
          bottom: '10%',
          top: this.options.style == 'style1' ? '10%' : '55%',
          height: this.options.style == 'style1' ? '80%' : '35%'
        },
        {
          is: 1,
          show: false,
          bottom: this.options.style == 'style1' ? '10%' : '55%',
          height: this.options.style == 'style1' ? '80%' : '35%'
        }
      ],
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
        show: this.options.showLegend,
        left: this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? this.options.legendPosition : this.options.legendVerticalPosition,
        top: this.options.legendPosition === 'top' || this.options.legendPosition === 'bottom' ? this.options.legendPosition : this.options.legendHorizontalPosition,
        orient: orient,
        width: this.options.legendArea === 'custom' ? `${this.options.legendWidth}%` : 'auto',
        height: this.options.legendArea === 'custom' ? `${this.options.legendHeight}%` : 'auto',
        itemGap: this.options.itemGap,
        icon: this.options.legendIcon === 'none' ? '' : this.options.legendIcon,
        textStyle: {
          color: this.options.legendTextStyle.color,
          fontFamily: this.options.legendTextStyle.fontFamily,
          fontSize: this.options.legendTextStyle.fontSize == "1.0x" ? 10 : this.options.legendTextStyle.fontSize.replace("pt", ""),
          fontStyle: this.options.legendTextStyle.fontStyle,
          fontWeight: this.options.legendTextStyle.fontWeight,
        },
        data: this.items.valueDisplay.length == 2 ? [this.items.valueDisplay[0], this.items.valueDisplay[1]] : [this.items.valueDisplay[0]],
      },
      dataZoom: [
        {
          xAxisIndex: 0,
          show: this.options.dataZoomShow,
          realtime: true,
          start: 0,
          end: 100
        },
        {
          top: 0,
          xAxisIndex: 1,
          show: typeof (this.items.x2) == 'undefined' ? false : this.options.dataZoomShow,
          realtime: true,
          start: 0,
          end: 100
        }
      ],
      xAxis: [
        {
          position: 'bottom',
          gridIndex: 0,
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: this.options.Color[0]
            }
          },
          // prettier-ignore
          data: this.items.x
        },
        {
          position: 'top',
          gridIndex: 1,
          type: 'category',
          axisTick: {
            alignWithLabel: true
          },
          axisLine: {
            onZero: false,
            lineStyle: {
              color: this.options.Color[1]
            }
          },
          // prettier-ignore
          data: typeof (this.items.x2) == "undefined" ? null : this.items.x2
        }
      ],
      yAxis: [
        {
          splitNumber: 5,
          gridIndex: 0,
          type: 'value'
        },
        {
          show: typeof (this.items.x2) == "undefined" ? false : true,
          splitNumber: 5,
          position: 'right',
          gridIndex: 1,
          type: 'value',
          inverse: true
        }
      ],
      series: [
        {
          name: this.items.valueDisplay[0],
          xAxisIndex: 0,
          yAxisIndex: 0,
          type: 'line',
          step: this.options.lineStyle == 'style3',
          smooth: this.options.lineStyle == 'style2',
          showSymbol: this.options.showSymbol,
          symbol: this.options.symbol,
          symbolSize: this.options.symbolSize,
          connectNulls: this.options.connectNulls,
          areaStyle: {
            opacity: this.isMock ? 0.3 : (this.options.areaStyle ? this.options.opacity / 100 : 0),
          },
          lineStyle: {
            color: this.options.Color[0],
            type: this.options.lineConStyle,
            width: 1
          },
          emphasis: {
            focus: 'series'
          },
          label: {
            show: this.options.showLabel,
            padding: [this.options.LabelPosition.bottom, this.options.LabelPosition.left, this.options.LabelPosition.top, this.options.LabelPosition.right],
            offset: [0, this.options.LabelPosition.bottom],
            color: this.options.labelTextStyle.color,
            fontFamily: this.options.labelTextStyle.fontFamily,
            fontSize: this.options.labelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.options.labelTextStyle.fontStyle,
            fontWeight: this.options.labelTextStyle.fontWeight,
            formatter: (data) => {
              let result = "";
              if (this.options.showLabelName) {
                result = data.name + ": ";
              }
              if (this.options.showLabel) {
                result = result + this.formatData(data.data, this.options.valueUnit, this.format);
              }
              return result
            }
          },
          // prettier-ignore
          data: this.items.y
        },
        {
          name: this.items.valueDisplay.length == 2 ? this.items.valueDisplay[1] : "",
          type: 'line',
          step: this.options.lineStyle == 'style3',
          smooth: this.options.lineStyle == 'style2',
          showSymbol: this.options.showSymbol,
          symbol: this.options.symbol,
          symbolSize: this.options.symbolSize,
          connectNulls: this.options.connectNulls,
          xAxisIndex: typeof (this.items.x2) == "undefined" ? 0 : 1,
          yAxisIndex: typeof (this.items.x2) == "undefined" ? 0 : 1,
          areaStyle: {
            opacity: this.isMock ? 0.3 : (this.options.areaStyle ? this.options.opacity / 100 : 0),
          },
          lineStyle: {
            color: this.options.Color[1],
            type: this.options.lineConStyle,
            width: 1
          },
          emphasis: {
            focus: 'series'
          },
          label: {
            show: this.options.showLabel,
            padding: [this.options.LabelPosition.bottom, this.options.LabelPosition.left, this.options.LabelPosition.top, this.options.LabelPosition.right],
            offset: [0, this.options.LabelPosition.bottom],
            color: this.options.labelTextStyle.color,
            fontFamily: this.options.labelTextStyle.fontFamily,
            fontSize: this.options.labelTextStyle.fontSize == '1.0x' ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.options.labelTextStyle.fontStyle,
            fontWeight: this.options.labelTextStyle.fontWeight,
            formatter: (data) => {
              let result = "";
              if (this.options.showLabelName) {
                result = data.name + ": ";
              }
              if (this.options.showLabel) {
                result = result + this.formatData(data.data, this.options.valueUnit, this.format);
              }
              return result
            }
          },
          // prettier-ignore
          data: this.items.y2
        }
      ]
    };
    this.myEcharts.setOption(option);

  }

  public formatData = (number, dataUnit, formate) => {
    let format = number
    if (dataUnit === 'auto') {
      const formatService = this.host.formatService;
      let realDisplayUnit = dataUnit;
      if (formatService.isAutoDisplayUnit(dataUnit)) {
        realDisplayUnit = formatService.getAutoDisplayUnit([number]);
      }
      return format = formatService.format(formate, number, realDisplayUnit);
    } else {
      const units = [{
        value: 1,
        unit: '',
        DisplayUnit: 'none'
      }, {
        value: 100,
        unit: '百',
        DisplayUnit: 'hundreds'
      }, {
        value: 1000,
        unit: '千',
        DisplayUnit: 'thousands'
      }, {
        value: 10000,
        unit: '万',
        DisplayUnit: 'tenThousands'
      }, {
        value: 100000,
        unit: '十万',
        DisplayUnit: 'hundredThousand'
      }, {
        value: 1000000,
        unit: '百万',
        DisplayUnit: 'millions'
      }, {
        value: 10000000,
        unit: '千万',
        DisplayUnit: 'tenMillion'
      }, {
        value: 100000000,
        unit: '亿',
        DisplayUnit: 'hundredMillion'
      }, {
        value: 1000000000,
        unit: '十亿',
        DisplayUnit: 'billions'
      }]
      let formatUnit = units.find((item) => item.value === Number(dataUnit))
      return this.formatD(format, formate, formatUnit.DisplayUnit)
    }
  }

  private formatD(number, formate, DisplayUnit) {
    const formatService = this.host.formatService;
    return formatService.format(formate, number, DisplayUnit);
  }

  private showTooltip(params, asModel = false) {
    if (asModel)
      this.host.toolTipService.show({
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

  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    this.options = options.properties;
    let hiddenOptions: Array<string> = [''];

   if(options.dataViews.length != 0){
    if (options.dataViews[0].plain.profile.series.values.length == 1) {
      this.options.style = "style1";
      hiddenOptions = hiddenOptions.concat(['style']);
    }
    if (!this.options.areaStyle) {
      hiddenOptions = hiddenOptions.concat(['opacity']);
    }
    if (!this.options.showSymbol) {
      hiddenOptions = hiddenOptions.concat(['symbol', 'symbolSize']);
    }
    if (!this.options.showLabel) {
      hiddenOptions = hiddenOptions.concat(['showLabelName', 'LabelPosition', 'valueUnit', 'labelTextStyle']);
    }
    if (this.options.legendArea === 'auto') {
      hiddenOptions = hiddenOptions.concat(['legendWidth', 'legendHeight']);
    }
    if (!this.options.showLegend) {
      hiddenOptions = hiddenOptions.concat(['itemGap', "legendIcon", "legendPosition", "legendVerticalPosition", "legendHorizontalPosition", "legendWidth", "legendHeight", "legendArea", "legendTextStyle"]);
    }
    if (this.options.legendPosition === 'left' || this.options.legendPosition === 'right') {
      hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
    } else {
      hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
    }
   }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}