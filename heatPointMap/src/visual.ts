import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts'

let isTooltipModelShown = false;
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private items: any;
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string
  private ActualValue: string
  private Series: string

  static mockItems = [
    ['周一', '周二', '周三',
      '周四', '周五', '周六', '周日'],
    ['1点', '3点', '6点', '9点', '12点']

  ];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.properties = {
      customColor: ["#fff4d1", "#ffe9a4", "#ffde76", "#ffd348", "#bf9e36", "#806a24"]
    }
  }

  // toolTip
  private showTooltip = _.debounce((params, asModel = false) => {
    if (asModel) isTooltipModelShown = true;
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },

      fields: [{
        label: this.ActualValue,
        value: params.data,
      }],
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    }, 10);
  });

  private hideTooltip = () => {
    this.host.toolTipService.hide();
    isTooltipModelShown = false;
  }

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private dispatch = (type, payload) => this.chart.dispatchAction({ ...payload, type });

  public bindEvents = () => {
    // lister click 
    this.container.addEventListener('click', (e: any) => {
      if (!e.seriesClick) {
        // clear tooltip
        this.hideTooltip();
        // clear selection
        this.selection.forEach(i => this.dispatch('downplay', i));
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })

    this.container.addEventListener('mouseleave', (e: any) => {
      if (isTooltipModelShown) return;
      this.hideTooltip();
    })

    this.chart.on('click', (params) => {

      if (params.componentType !== 'series') return;

      this.showTooltip(params, true);

      params.event.event.seriesClick = true;

      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };

      if (this.items[3][params.dataIndex]) {
        const sid = this.items[3][params.dataIndex];
        this.selectionManager.select(sid, true);
      }
      this.dispatch('highlight', selectInfo);
      this.selection.push(selectInfo)

    })

  }

  public update(options: VisualNS.IVisualUpdateOptions) {

    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length && dataView.plain.profile.series.values.length) {
      const plainData = dataView.plain;


      this.dimension = plainData.profile.dimension.values[0].display;
      this.ActualValue = plainData.profile.ActualValue.values[0].display;
      this.Series = plainData.profile.series.values[0].display;
      this.items[0] = plainData.data.map((item) => item[this.dimension]);
      this.items[1] = plainData.data.map((item) => item[this.Series]);
      this.items[2] = plainData.data.map((item) => item[this.ActualValue]);

      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();

        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        this.Series && selectionId.withDimension(plainData.profile.series.values[0], item);
        // this.ActualValue && selectionId.withDimension(plainData.profile.ActualValue.values[0], item);
        return selectionId
      }
      this.items[3] = plainData.data.map((item) => getSelectionId(item));
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
    const maxData = Math.max(...initData);

    const visualMapColor = options.heatType === 'heatmap' ? options.customColor : (options.heatFillType === 'single' ? options.pointColorSingle : options.pointColorMultiple)
    for (let i = 0; i < dy.length; i++) {
      for (let j = 0; j < dx.length; j++) {
        const item: any = []
        item[0] = j;
        item[1] = i;
        data.push([item[0], item[1]])
      }
    }

    initData.map((value: any, index: any) => data[index][2] = value || '-')

    const max3 = data.sort((a, b) => b[2] - a[2]).slice(0, 3);
    const min3 = data.sort((a, b) => a[2] - b[2]).slice(0, 3);
    const start3 = data.slice(0, 3);
    const end3 = data.slice(data.length - 3, data.length);
    const option = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      grid: {
        // left: '5%',
        top: '5%',
        // right: '5%',
        bottom: '17%'
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
      visualMap: {
        type: "continuous",
        min: 0,
        max: maxData,
        calculable: true,
        hoverLink: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        textStyle: {
          color: options.textStyle.color,
          fontStyle: options.textStyle.fontStyle,
          fontWeight: options.textStyle.fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontSize: parseFloat(options.textStyle.fontSize)
        },
        inRange: {
          color: visualMapColor,
          symbolSize: [options.symbolSizeMin, options.symbolSizeMax]
        },
        outOfRange: {
          symbolSize: [options.symbolSizeMin, options.symbolSizeMax],
          color: ['rgba(255,255,255,.2)']
        },
      },
      textStyle: {
        color: options.textStyle.color,
        fontStyle: options.textStyle.fontStyle,
        fontWeight: options.textStyle.fontWeight,
        fontFamily: options.textStyle.fontFamily,
        fontSize: parseFloat(options.textStyle.fontSize)
      },
      series: [{
        name: 'Punch Card',
        type: options.heatType,
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: data,
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: 'max',
        type: 'effectScatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: options.maxNumber ? max3 : '',
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }, {
        name: 'min',
        type: 'effectScatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: options.minNumber ? min3 : '',
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }, {
        name: 'start',
        type: 'effectScatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: options.startNumber ? start3 : '',
        label: {
          show: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }, {
        name: 'end',
        type: 'effectScatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: options.endNumber ? end3 : '',
        label: {
          show: true
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
    if (options.properties.heatType === 'scatter') {
      const color = options.properties.heatFillType === 'single' ? ['pointColorMultiple'] : ['pointColorSingle']
      return ['customColor'].concat(color)
    }

    if (options.properties.heatType == 'heatmap') {

      return ['pointColorSingle', 'pointColorMultiple', 'symbolSizeMin', 'symbolSizeMax', 'heatFillType', 'maxNumber', 'minNumber', 'startNumber', 'endNumber']
    }

    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}