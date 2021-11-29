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
  private format: any;

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
    const fieldsName = [params.name + (params.seriesName), 'Min', 'Q1', 'Median', 'Q3', 'Max']
    const fields = params.data.map((item, index) => { return { label: fieldsName[index], value: index ? this.formatData(item) : '' } })
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },
      fields,
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
        this.host.toolTipService.hide();
        this.host.contextMenuService.hide();
        return;
      }
    })

    this.container.addEventListener('mouseleave', (e: any) => {
      if (isTooltipModelShown) return;
      this.hideTooltip();
    })

    //鼠标左键
    this.chart.on('click', (params) => {
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.properties.leftMouseButton;
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            if (this.properties.onlySelect) {
              if (!this.selectionManager.contains(this.items[3][params.dataIndex])) {
                this.selection = [];
                this.selectionManager.clear();
                this.selection.push(this.items[3][params.dataIndex]);
              } else {
                this.selection = [];
                this.selectionManager.clear();
              }
            } else {
              if (!this.selectionManager.contains(this.items[3][params.dataIndex])) {
                this.selection.push(this.items[3][params.dataIndex]);
              } else {
                this.selection.splice(this.selection.indexOf(this.items[3][params.dataIndex]), 1);
                this.selectionManager.clear(this.items[3][params.dataIndex])
                return
              }
            }
            this.selectionManager.select(this.selection, true);
            if (this.selection.length == this.items[0].length) {
              this.selectionManager.clear(this.selection);
              this.selection = [];
            }
            break;
          }
          case "showToolTip": {
            this.showTooltip(params, true);
            break;
          }
          default: {
            const selectionIds = this.items[3][params.dataIndex];
            this.host.commandService.execute([{
              name: leftMouseButton,
              payload: {
                selectionIds,
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

    this.chart.on('mouseup', (params) => {
      if (params.event.event.button === 2) {
        document.oncontextmenu = function () { return false; };
        params.event.event.preventDefault();
        this.host.contextMenuService.show({
          position: {								
            x: params.event.event.x,
            y: params.event.event.y,
          },
          menu: true
        }, 10)
        return;
      }else{
        this.host.contextMenuService.hide();	
      }
    })


  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.format = options.dataViews[0].plain.profile.ActualValue.values[0].format;
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;

      this.isMock = false;
      this.dimension = plainData.profile.dimension.values[0].display;
      this.ActualValue = plainData.profile.ActualValue.values.map((item) => item.display);

      this.items[0] = plainData.data.map((item) => item[this.dimension]);
      this.items[1] = plainData.data.map((item) => item[this.Series]);

      // get data
      this.items[2] = [];
      this.ActualValue.map((item, index) => {
        const data = [];

        if (this.dimension) {
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


      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();

        this.dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item);
        return selectionId
      }
      this.items[3] = plainData.data.map((item) => getSelectionId(item));
      this.items[3] = _.uniqWith(this.items[3], _.isEqual)
    } else {
      this.isMock = true;
    }
    this.properties = options.properties;
    this.render()
  }

  public formatUnit = (value: any, dataUnit) => {
    if (value) {
      const units = [{
        value: 1,
        unit: ''
      },
      {
        value: 100,
        unit: '百'
      }, {
        value: 1000,
        unit: '千'
      }, {
        value: 10000,
        unit: '万'
      }, {
        value: 100000,
        unit: '十万'
      }, {
        value: 1000000,
        unit: '百万'
      }, {
        value: 10000000,
        unit: '千万'
      }, {
        value: 100000000,
        unit: '亿'
      }, {
        value: 1000000000,
        unit: '十亿'
      }, {
        value: 100000000000,
        unit: '万亿'
      }]
      const format = units.find((item) => item.value === Number(dataUnit))
      return value / format.value + format.unit
    } else {
      return value
    }
  }


  public render() {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;

    this.container.style.opacity = isMock ? '0.3' : '1';
    const textStyle = { ...options.textStyle };

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
          tooltip: { 
            formatter: (param) => {
            return [
              `${'分类'}` + param.name + ': ',
              'Max: ' + this.formatData(param.data[5]),
              'Q3: ' + this.formatData(param.data[4]),
              'Median: ' + this.formatData(param.data[3]),
              'Q1: ' + this.formatData(param.data[2]),
              'Min: ' + this.formatData(param.data[1])
            ].join('<br/>')
          } }
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
    const gridStyle = {
      left: options.legendPosition === 'left' ? '10%' : '8%',
      top: options.legendPosition === 'top' ? '10%' : '5%',
      right: options.legendPosition === 'right' ? '10%' : '3%',
      bottom: options.showDataZoom ? (options.legendPosition === 'bottom' ? '30%' : '20%') : (options.legendPosition === 'bottom' ? '10%' : '5%')
    };
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
      grid: gridStyle,
      xAxis: {
        type: 'category',
        show: options.xAxis,
        axisTick: {
          show: options.xAxisTick
        },
        axisLine: {
          show: options.xAxisLine
        },
        axisLabel: {
          show: options.xAxisLabel,
          formatter: '{value}',
          ...textStyle,
          fontSize: parseFloat(options.textStyle.fontSize),
        },
        data: this.isMock ? data[0].axisData : Array.from(new Set(this.items[0])),
        boundaryGap: true,
        nameGap: 30
      },
      yAxis: {
        type: 'value',
        show: options.leftAxis,
        axisLabel: {
          show: options.leftAxisLabel,
          formatter: (value) => {
            return this.formatUnit(value, options.dataUnit)
          },
          ...textStyle,
          fontSize: parseFloat(options.textStyle.fontSize),

        },
        axisTick: {
          show: options.leftAxisTick
        },
        axisLine: {
          show: options.leftAxisLine
        },
        splitLine: {
          show: options.leftSplitLine
        }
      },

      dataZoom: [
        {
          type: 'inside',
          start: Number(options.dataStart),
          end: options.showDataZoom ? Number(options.dataEnd) : 100
        },
        {
          show: options.showDataZoom,
          height: 20,
          type: 'slider',
          top: options.legendPosition === 'bottom' ? '80%' : '90%',
          fillerColor: options.dataZoomBgColor,
          xAxisIndex: [0],
          start: Number(options.dataStart),
          end: options.showDataZoom ? Number(options.dataEnd) : 100
        }
      ],
      series: [
        ...drawBoxPolit(),
        ...drawPictorialBar()
      ]
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
    let hiddenOptions: Array<string> = [''];
    // legend
    if (!updateOptions.properties.showLegend) {
      hiddenOptions = hiddenOptions.concat(['legendPosition', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle'])
    }
    if (updateOptions.properties.legendPosition === 'left' || updateOptions.properties.legendPosition === 'right') {
      hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
    } else {
      hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
    }
    // data zoom
    if (!updateOptions.properties.showDataZoom) {
      hiddenOptions = hiddenOptions.concat(['dataStart', 'dataEnd', 'dataZoomBgColor'])
    }
    //axis
    if (!updateOptions.properties.xAxis) {
      hiddenOptions = hiddenOptions.concat(['xAxisLabel', 'xAxisTick', 'xAxisLine'])
    }

    if (!updateOptions.properties.leftAxis) {
      hiddenOptions = hiddenOptions.concat(['leftAxisLabel', 'leftAxisTick', 'leftAxisLine', 'leftSplitLine', 'dataUnit'])
    }
    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  private formatData (number) {
    const formatService = this.host.formatService;
    let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
    return formatService.format(this.format, number, realDisplayUnit);
  }
}