import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts'

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private items: any;

  static mockItems = [
    ['1点', '3点', '6点', '9点', '12点'],
    ['周一', '周二', '周三',
      '周四', '周五', '周六', '周日']
  ];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;

  }

  public update(options: VisualNS.IVisualUpdateOptions) {

    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length && dataView.plain.profile.series.values.length) {
      const plainData = dataView.plain;


      const dimension = plainData.profile.dimension.values[0].display;
      const ActualValue = plainData.profile.ActualValue.values[0].display;
      const Series = plainData.profile.series.values[0].display;
      this.items[0] = plainData.data.map((item) => item[dimension]);
      this.items[1] = plainData.data.map((item) => item[Series]);
      this.items[2] = plainData.data.map((item) => item[ActualValue]);
    }
    this.properties = options.properties;

    this.render()
  }

  public render() {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;
    this.container.style.opacity = isMock ? '0.3' : '1';

    let values = [];
    for (let i = 0; i < (Visual.mockItems[0].length * Visual.mockItems[1].length); i++) {
      values.push(i);
    }
    let data: any = [];
    const dx = isMock ? Visual.mockItems[0] : Array.from(new Set(this.items[0]));
    const dy = isMock ? Visual.mockItems[1] : Array.from(new Set(this.items[1]));
    let initData = isMock ? values : this.items[2];
    const maxData = Math.max(...initData)
    const minData = Math.min(...initData)

    for (let i = 0; i < dx.length; i++) {
      for (let j = 0; j < dy.length; j++) {
        const item: any = []
        item[0] = j;
        item[1] = i;
        data.push([item[0], item[1]])
      }
    }
    initData.map((value: any, index: any) => data[index][2] = value || '-')

    const option = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        // left: '5%',
        top: '5%',
        right: '5%',
        bottom: '10%'
      },
      xAxis: {
        type: 'category',
        data: dx,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: dy,
        splitArea: {
          show: true
        }
      },
      // visualMap: {
      //   min: 0,
      //   max: 200,
      //   calculable: true,
      //   orient: 'horizontal',
      //   left: 'center',
      //   bottom: '15%'
      // },
      textStyle: {
        color: options.textStyle.color,
        fontStyle: options.textStyle.fontStyle,
        fontWeight: options.textStyle.fontWeight,
        fontFamily: options.textStyle.fontFamily,
        fontSize: parseFloat(options.textStyle.fontSize)
      },
      series: [{
        name: 'Punch Card',
        type: options.pointEffect ? 'effectScatter' : 'scatter',
        symbolSize: function (item) {
          return item[2] / (maxData - minData) * (Number(options.symbolSize));
        },
        data: data,
        label: {
          show: true
        },
        itemStyle: {
          color: options.pointColor,
        },
        emphasis: {
          itemStyle: {

            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };

    this.chart.setOption(option)
  }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}