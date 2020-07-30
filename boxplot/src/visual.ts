import '../style/visual.less';
import _ = require('lodash');
import * as Echarts from 'echarts';

import dataTool = require("echarts/extension/dataTool/index")

const echarts = {
  ...Echarts,
  dataTool
}

let isTooltipModelShown = false;
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private chart: any;
  private properties: any;
  private items: any = [];
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string
  private ActualValue: Array<any>
  private Series: string



  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;
    this.isMock = true;
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

      this.isMock = false;
      this.dimension = plainData.profile.dimension.values[0].display;
      // this.ActualValue = plainData.profile.ActualValue.values[0].display;
      this.ActualValue = plainData.profile.ActualValue.values.map((item) => item.display);
      this.Series = plainData.profile.series.values[0].display || '';
      this.items[0] = plainData.data.map((item) => item[this.dimension]);
      this.items[1] = plainData.data.map((item) => item[this.Series]);


      // get data
      this.items[2] = [];
      this.ActualValue.map((item, index) => {
        const data = [];

        if (this.Series) {
          const dimensionData = Array.from(new Set(this.items[0]));
          dimensionData.map((dimension, dimensionIndex) => {
            const dimensionTag = plainData.data.filter((item) => item[this.dimension] === dimension);

            data[dimensionIndex] = dimensionTag.map((item) => item[this.ActualValue[index]])

          })
        } else {
          data.push(plainData.data.map((item) => item[this.ActualValue[index]]))
        }
        this.items[2][index] = echarts.dataTool.prepareBoxplotData(data)
      })


      // const getSelectionId = (item) => {
      //   const selectionId = this.createSelectionId();

      //   this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
      //   this.Series && selectionId.withDimension(plainData.profile.series.values[0], item);
      //   // this.ActualValue && selectionId.withDimension(plainData.profile.ActualValue.values[0], item);
      //   return selectionId
      // }
      // this.items[3] = plainData.data.map((item) => getSelectionId(item));
    } else {
      this.isMock = true;
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


    let data: any = [];
    for (var seriesIndex = 0; seriesIndex < 5; seriesIndex++) {
      var seriesData = [];
      for (var i = 0; i < 18; i++) {
        var cate = [];
        for (var j = 0; j < 90; j++) {
          cate.push(Math.random() * 200);
        }
        for (var j = 0; j < 10; j++) {
          cate.push(Math.random() * 400);
        }
        seriesData.push(cate);
      }
      data.push(echarts.dataTool.prepareBoxplotData(seriesData));
    }

    const drawBoxPolit = () => {
      return data.map((item, index) => {
        return {
          name: this.isMock ? `分类${index + 1}` : this.ActualValue[index],
          type: 'boxplot',
          data: item.boxData,
          itemStyle: {
            color: options.boxFillColor,
            borderColor: options.boxBorderColor[index]
          },
          tooltip: { formatter: formatter }
        }
      })
    }
    const drawPictorialBar = () => {
      return data.map((item, index) => {
        return {
          name: this.isMock ? `分组${index + 1}` : this.ActualValue[index],
          type: 'pictorialBar',
          symbolPosition: 'end',
          symbolSize: 8,
          barGap: '30%',
          itemStyle: {
            color: options.boxBorderColor[index]
          },
          data: item.outliers
        }
      })
    }

    data = this.isMock ? data : this.items[2];
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';
    const legendTextStyle = options.legendTextStyle;
    const option = {
      legend: {
        data: this.isMock ? ['分类1', '分类2', '分类3', '分类4', '分类5'] : this.ActualValue,
        show: options.showLegend,
        left: options.legendPosition === 'left' || options.legendPosition === 'right' ? options.legendPosition : options.legendVerticalPosition,
        top: options.legendPosition === 'top' || options.legendPosition === 'bottom' ? options.legendPosition : options.legendHorizontalPosition,
        align: 'auto',
        icon: 'roundRect',
        textStyle: legendTextStyle,
        orient: orient,
      },
      tooltip: {
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '10%',
        top: '20%',
        right: '10%',
        bottom: '15%'
      },
      xAxis: {
        type: 'category',
        data: this.isMock ? data[0].axisData : Array.from(new Set(this.items[0])),
        boundaryGap: true,
        nameGap: 30,
        // splitArea: {
        //   show: true
        // },
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: false
        },

      },
      yAxis: {
        type: 'value',
        min: -400,
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      textStyle: textStyle,
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 20
        },
        {
          show: true,
          height: 20,
          type: 'slider',
          top: '90%',
          xAxisIndex: [0],
          start: 0,
          end: 20
        }
      ],
      series: [
        ...drawBoxPolit(),
        ...drawPictorialBar()
      ]
    };

    function formatter(param) {
      return [
        `${'分类'}` + param.name + ': ',
        '上边缘: ' + param.data[0],
        '上四分位数: ' + param.data[1],
        '中位数: ' + param.data[2],
        '下四分位数: ' + param.data[3],
        '下边缘: ' + param.data[4]
      ].join('<br/>')
    }

    this.chart.setOption(option)
  }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {

    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}