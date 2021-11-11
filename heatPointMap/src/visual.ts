import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts'

import jslinq = require("jslinq");

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

  private r_data:any;

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

      this.r_data=plainData.data;

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
    const textStyle = options.textStyle
    let values = [];
    for (let i = 0; i < (Visual.mockItems[0].length * Visual.mockItems[1].length); i++) {
      values.push(i);
    }
    let data: any = [];
    const dx = (isMock ? Visual.mockItems[0] : Array.from(new Set(this.items[0]))).sort();
    const dy = (isMock ? Visual.mockItems[1] : Array.from(new Set(this.items[1]))).sort();


    let initData = isMock ? values : this.items[2];

    const maxData = Math.max(...initData);

    const visualMapColor = options.heatType === 'heatmap' ? options.customColor : (options.heatFillType === 'single' ? options.pointColorSingle : options.pointColorMultiple)
    var th=this;
    for (let i = 0; i < dy.length; i++) {
      for (let j = 0; j < dx.length; j++) {
        const item: any = []
        item[0] = j;
        item[1] = i;
        const items=jslinq(th.r_data).where(x=>x[th.Series]==dy[i] && x[th.dimension]==dx[j])["items"];
        let valuc="0";
        if (items.length>0){
          valuc=items[0][th.ActualValue];
        }
        data.push([item[0], item[1],valuc])
      }
    }

    //这种方式赋值,会导致data中有些值空缺
    //initData.map((value: any, index: any) => data[index][2] = value || '-');


    const max3 = data.sort((a, b) => b[2] - a[2]).slice(0, options.effectNumber);
    const min3 = data.sort((a, b) => a[2] - b[2]).slice(0, options.effectNumber);
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';
    let legendName = ''
    if (options.heatType === 'scatter' && options.openEffect) {
      legendName = options.effectType === 'max' ? '最大值' : '最小值'
    }

    const option = {
      tooltip: {
        position: 'top'
      },
      animation: false,
      legend: {
        data: [this.ActualValue, { name: legendName, icon: 'circle' }],
        show: options.showLegend,
        left: options.legendPosition === 'left' || options.legendPosition === 'right' ? options.legendPosition : options.legendVerticalPosition,
        top: options.legendPosition === 'top' || options.legendPosition === 'bottom' ? options.legendPosition : options.legendHorizontalPosition,
        align: 'auto',
        icon: 'roundRect',
        textStyle: {
          color: options.legendTextStyle.color,
          fontStyle: options.legendTextStyle.fontStyle,
          fontWeight: options.legendTextStyle.fontWeight,
          fontFamily: options.legendTextStyle.fontFamily,
          fontSize: parseFloat(options.legendTextStyle.fontSize)
        },
        orient: orient,
      },
      grid: {
        // left: '5%',
        top: '10%',
        // right: '5%',
        bottom: '17%'
      },
      xAxis: {
        type: 'category',
        data: dx,
        splitArea: {
          show: options.heatType === 'heatmap' ? true : false
        }
      },
      yAxis: {
        type: 'category',
        data: dy,
        splitArea: {
          show: options.heatType === 'heatmap' ? true : false
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
        textStyle: textStyle,
        inRange: {
          color: visualMapColor,
          symbolSize: [options.symbolSizeMin, options.symbolSizeMax]
        },
        outOfRange: {
          symbolSize: [options.symbolSizeMin, options.symbolSizeMax],
          color: ['rgba(255,255,255,.2)']
        },
      },
      textStyle: textStyle,
      series: [{
        name: this.ActualValue || '数量',
        type: options.heatType,
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: data,
        label: {
          show: options.dataindicate,
          textStyle: {
            color: options.dataindicateTextStyle.color,
            fontStyle: options.dataindicateTextStyle.fontStyle,
            fontWeight: options.dataindicateTextStyle.fontWeight,
            fontFamily: options.dataindicateTextStyle.fontFamily,
            fontSize: parseFloat(options.dataindicateTextStyle.fontSize)
          }
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      },
      {
        name: '最大值',
        type: 'effectScatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: options.openEffect && options.effectType === 'max' && options.heatType === 'scatter' ? max3 : '',
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
        name: '最小值',
        type: 'effectScatter',
        xAxisIndex: 0,
        yAxisIndex: 0,
        data: options.openEffect && options.effectType === 'min' && options.heatType === 'scatter' ? min3 : '',
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

  public getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {
    let legend = [];

    if (!updateOptions.properties.showLegend) {
      legend = ['legendPosition', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle']
    } else {

      if (updateOptions.properties.legendPosition === 'top' || updateOptions.properties.legendPosition === 'bottom') {
        legend = ['legendHorizontalPosition']
      }

      if (updateOptions.properties.legendPosition === 'right' || updateOptions.properties.legendPosition === 'left') {
        legend = ['legendVerticalPosition']
      }

    }

    if (updateOptions.properties.heatType == 'scatter') {

      const effect = updateOptions.properties.openEffect ? [''] : ['effectNumber', 'effectType']
      const color = updateOptions.properties.heatFillType === 'single' ? effect.concat(['pointColorMultiple']) : effect.concat(['pointColorSingle'])
      const dataindicate = updateOptions.properties.dataindicate ? [''] : ['dataindicateTextStyle']

      return ['customColor'].concat(color, dataindicate, legend)
    }


    if (updateOptions.properties.heatType == 'heatmap') {

      return ['pointColorSingle', 'pointColorMultiple', 'symbolSizeMin', 'symbolSizeMax', 'heatFillType', 'openEffect', 'effectNumber', 'effectType'].concat(legend)
    }






    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}