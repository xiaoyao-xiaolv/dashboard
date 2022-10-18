import '../style/visual.less';
import * as echarts from 'echarts';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private isMock: boolean;
  private isSeries: boolean;
  private items: any;
  private valuesFormat: any;
  private valuesDisplayUnit: any;
  private host: any;
  private values: any;
  private series: any;
  static mockSeries = ['Direct', 'Mail Ad', 'Affiliate Ad', 'Video Ad', 'Search Engine']
  static mockItems = [['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    , [320, 302, 301, 334, 390, 330, 320]
    , [120, 132, 101, 134, 90, 230, 210]
    , [220, 182, 191, 234, 290, 330, 310]
    , [-150, -212, -201, -154, -190, -330, -410]
    , [820, 832, 901, 934, 1290, 1330, 1320]
  ];
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.isMock = true;
    this.isSeries = false;
    this.host = host;
    this.properties = {};
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.items = [];
    this.values = [];
    this.series = [];
    this.isMock = true;
    const dataView = options.dataViews[0];
    if (dataView) {
      this.isMock = false;
      const plainData = dataView.plain;
      let valuesName = plainData.profile.values.values;
      let dimensionName = plainData.profile.dimension.values[0].display;
      let seriesName = plainData.profile.series.values;
      let dimension = plainData.sort[dimensionName].order;
      this.valuesFormat = plainData.profile.values.options.valueFormat;
      this.valuesDisplayUnit = plainData.profile.values.options.valueDisplayUnit;
      this.items.push(dimension);
      if (seriesName.length) {
        this.isSeries = true;
        this.values = plainData.profile.values.values[0].display;
        this.series = plainData.sort[seriesName[0].display].order;
        this.series.map(serie => {
          let newItems: any = [];
          dimension.map(flags => {
            plainData.data.map(item => {
              if (item[dimensionName] === flags && item[seriesName[0].display] === serie) {
                newItems.push(item[this.values]);
              }
            })
          });
          this.items.push(newItems);
        });
      } else {
        this.isSeries = false;
        valuesName.map(value => {
          let newItems: any = [];
          dimension.map(flags => {
            plainData.data.map(item => {
              if (item[dimensionName] === flags) {
                newItems.push(item[value.display]);
              }
            })
          });
          this.values.push(value.display);
          this.items.push(newItems);
        });
      }
    }
    // this.items[0].map((items, i) => {
    //   if (i == 0 || i == 1) {
    //     this.items[1].push(items);
    //   }else{
    //     let arr = [];
    //     items.map((item, j) => {
    //       arr.push(item + this.items[1][i-1][j])
    //     })
    //     this.items[1].push(arr);
    //   }
    // })

    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const options = this.properties;
    this.container.style.opacity = this.isMock ? '0.3' : '1';
    const items = this.isMock ? Visual.mockItems : this.items;
    const seriesName = this.isMock ? Visual.mockSeries : this.isSeries ? this.series : this.values;

    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';

    let legendfontWeight: string;
    if (options.legendTextStyle.fontWeight == "Light") {
      legendfontWeight = options.legendTextStyle.fontWeight + "er"
    } else {
      legendfontWeight = options.legendTextStyle.fontWeight
    }
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }

    let YlabelfontWeight: string;
    if (options.YlabelTextStyle.fontWeight == "Light") {
      YlabelfontWeight = options.YlabelTextStyle.fontWeight + "er"
    } else {
      YlabelfontWeight = options.YlabelTextStyle.fontWeight
    }

    let XlabelfontWeight: string;
    if (options.XlabelTextStyle.fontWeight == "Light") {
      XlabelfontWeight = options.XlabelTextStyle.fontWeight + "er"
    } else {
      XlabelfontWeight = options.XlabelTextStyle.fontWeight
    }
    let series = [];
    for (let i = 0, len = seriesName.length; i < len; i++) {
      let item = {
        name: seriesName[i],
        type: 'bar',
        stack: 'total',
        label: {
          show: options.showLabel,
          color: options.textStyle.color,
          fontSize: parseInt(options.textStyle.fontSize.replace("pt", "")),
          fontWeight: fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle,
          position: options.labelPosition,
          formatter: ((params) => {
            return this.host.formatService.format(this.valuesFormat,params.data, this.valuesDisplayUnit);
          })
        },
        itemStyle: {
          borderRadius: options.radius,
        },
        barWidth: options.barWidth,
        emphasis: {
          focus: 'series',
        },
        data: items[i + 1]
      };
      series.push(item);
    }
    let option = {
      color: options.barColor,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        },
        valueFormatter: ((value) => {
          return this.host.formatService.format(this.valuesFormat,value, this.valuesDisplayUnit);
        })
      },
      legend: {
        show: options.showLegend,
        left: options.legendPosition === 'left' || options.legendPosition === 'right' ? options.legendPosition : options.legendVerticalPosition,
        top: options.legendPosition === 'top' || options.legendPosition === 'bottom' ? options.legendPosition : options.legendHorizontalPosition,
        align: 'left',
        icon: options.legendIcon === 'none' ? '' : options.legendIcon,
        textStyle: {
          color: options.legendTextStyle.color,
          fontSize: parseInt(options.legendTextStyle.fontSize.replace("pt", "")),
          fontWeight: legendfontWeight,
          fontFamily: options.legendTextStyle.fontFamily,
          fontStyle: options.legendTextStyle.fontStyle,
        },
        orient: orient,
      },
      grid: {
        left: options.legendPosition === 'left' ? '12%' : '5%',
        right: options.legendPosition === 'right' ? '12%' : '5%',
        top: options.legendPosition === 'top' ? '10%' : '5%',
        bottom: options.legendPosition === 'bottom' ? '10%' : '5%',
        containLabel: true
      },
      xAxis: [
        {
          show: options.showXLabel,
          position: options.XPosition,
          type: 'value',
          axisLine: {
            show: options.showXAxisLine,
            lineStyle: {
              color: options.XaxisLineColor,
              type: options.XaxisLineType,
              width: options.XaxisLineWidth
            }
          },
          axisTick: {
            show: options.showXAxisTick,
            lineStyle: {
              color: options.XaxisLineColor,
              type: options.XaxisLineType,
              width: options.XaxisLineWidth
            }
          },
          axisLabel: {
            show: options.showXAxisLabel,
            rotate: options.Xrotate,
            color: options.XlabelTextStyle.color,
            fontSize: parseInt(options.XlabelTextStyle.fontSize.replace("pt", "")),
            fontWeight: XlabelfontWeight,
            fontFamily: options.XlabelTextStyle.fontFamily,
            fontStyle: options.XlabelTextStyle.fontStyle,
          },
          splitLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          show: options.showYLabel,
          position: options.YPosition,
          type: 'category',
          axisLine: {
            show: options.showYAxisLine,
            lineStyle: {
              color: options.YaxisLineColor,
              type: options.YaxisLineType,
              width: options.YaxisLineWidth
            }
          },
          axisTick: {
            show: options.showYAxisTick,
            lineStyle: {
              color: options.YaxisLineColor,
              type: options.YaxisLineType,
              width: options.YaxisLineWidth
            }
          },
          axisLabel: {
            show: options.showYAxisLabel,
            rotate: options.Yrotate,
            color: options.YlabelTextStyle.color,
            fontSize: parseInt(options.YlabelTextStyle.fontSize.replace("pt", "")),
            fontWeight: YlabelfontWeight,
            fontFamily: options.YlabelTextStyle.fontFamily,
            fontStyle: options.YlabelTextStyle.fontStyle,
          },
          data: items[0]
        }
      ],
      series: series
    };

    this.chart.setOption(option)
  }

  public onResize() {
    this.chart.resize();
  }

  public onDestroy(): void {
    this.chart.dispose();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<string> = [''];
    if (!options.properties.showLabel){
      hiddenOptions = hiddenOptions.concat(['labelPosition','textStyle']);
    }
    if (!options.properties.showLegend){
      hiddenOptions = hiddenOptions.concat(['legendIcon','legendPosition','legendVerticalPosition','legendHorizontalPosition','legendTextStyle']);
    }
    if (!options.properties.showYLabel){
      hiddenOptions = hiddenOptions.concat(['YPosition','showYAxisLine','showYAxisTick','YaxisLineColor','YaxisLineWidth','YaxisLineType','showYAxisLabel','Yrotate','YlabelTextStyle']);
    }
    if (!options.properties.showXLabel){
      hiddenOptions = hiddenOptions.concat(['XPosition','showXAxisLine','showXAxisTick','XaxisLineColor','XaxisLineWidth','XaxisLineType','showXAxisLabel','Xrotate','XlabelTextStyle']);
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