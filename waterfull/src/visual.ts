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
  private format: any;

  static mockItems = [
    ["1月", "2月", "3月", "4月", "5月", "累计"], [12, 20, 6, -7, 59]
  ];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.properties = {
      fontSize: 14,
      textColor: '#ffffff',
      customPaletteColor: ['#eb4b5c', '#b7d62d', 'eb4b5c', 'eb4b5c'],
      customShowMark: 'false'
    };

    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
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
        label: params.name,
        value: params.data[params.data.length - 1],
      }],
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    }, 10);
  });

  //数据格式
  private formatData(number) {
    const formatService = this.host.formatService;
    let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
    return formatService.format(this.format, number, realDisplayUnit);
  }

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


    this.chart.on('click', (params) => {
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.properties.leftMouseButton;
        const sid = this.items[2][params.dataIndex];
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            if (this.selectionManager.contains(sid)) {
              this.selectionManager.clear(sid)
            } else {
              if (this.properties.onlySelect) {
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

    this.chart.on('mouseup', (params) => {
      if (params.event.event.button === 2) {
        document.oncontextmenu = function () { return false; };
        params.event.event.preventDefault();
        this.host.contextMenuService.show({
          position: {								//跳转的selectionsId(左键需要)
            x: params.event.event.x,
            y: params.event.event.y,
          },
          menu: true
        }, 10)
        return;
      } else {
        this.host.contextMenuService.hide();
      }
    })


  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      this.format = options.dataViews[0].plain.profile.ActualValue.values[0].format;
      const plainData = dataView.plain;
      const dimension = plainData.profile.dimension.values[0].display;
      const ActualValue = plainData.profile.ActualValue.values[0].display;

      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        dimension && selectionId.withDimension(plainData.profile.dimension.values[0], item)
        // ActualValue && selectionId.withDimension(plainData.profile.ActualValue.values[0], item)
        return selectionId
      }

      this.items[0] = plainData.data.map((item) => item[dimension]);
      if (options.properties.showTotal) {
        this.items[0].push('累计')
      }
      this.items[1] = plainData.data.map((item) => item[ActualValue]);
      this.items[2] = plainData.data.map((item) => getSelectionId(item));
    }

    this.properties = options.properties;
    this.render();
  }

  public getBasicData = (dy, zt = [], label = [], options: any) => {
    for (let i = 0; i < dy.length; i++) {
      let obj = [];
      let getBarColor = (index) => {
        let barColor = ''
        if (index === 0) {
          barColor = options.customPaletteColor[2].colorStops ? options.customPaletteColor[2].colorStops[0] : options.customPaletteColor[2]
        } else {
          barColor = options.customPaletteColor[3].colorStops ? options.customPaletteColor[3].colorStops[0] : options.customPaletteColor[3]
        }
        return barColor
      }
      const lastIndex = options.showTotal ? dy.length - 1 : dy.length;
      if (i === 0 || i === lastIndex) {
        let x = parseFloat(dy[i]);
        if (x < 0) {
          label.push({
            value: dy[i],
            coord: [i, x],
            label: {
              position: 'bottom',
              show: true,
              fontSize: options.fontSize,
              color: getBarColor(i)
            }
          });
        } else {
          label.push({ value: dy[i], coord: [i, x] });
        }
        obj.push(0);
        obj.push(dy[i]);
        obj.push(dy[i]);
        obj.push(dy[i]);
        if (i === lastIndex) {
          let data = {
            value: obj,
            itemStyle: !this.items.length ? options.totalColor : null
          }
          zt.push(data);
        } else {
          zt.push(obj);
        }
      } else {
        var start = zt[i - 1][1];
        var val = parseFloat(dy[i]);
        var end = start + val;
        if (dy[i] < 0) {
          label.push({
            value: dy[i],
            coord: [i, end],
            label: {
              position: 'bottom',
              show: options.customShowMark,
              fontSize: options.fontSize,
              color: options.customPaletteColor[1].colorStops ? options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1]
            }
          });
        } else {
          label.push({
            value: dy[i],
            coord: [i, end]
          });
        }
        obj.push(start);
        obj.push(end);
        obj.push(end);
        obj.push(end);
        zt.push(obj);
      }
    }
    return {
      dy,
      zt,
      label
    }
  }

  public getLineData = (data: Array<number>, options: any) => {
    let line = []
    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        line[0] = data[0]
      } else {
        let sumData = data.slice(0, i + 1)
        line[i] = _.sum(sumData)
      }
    }
    if (options.showTotal) {
      line[data.length - 1] = 0
    }
    return line
  }

  public render() {
    this.chart.clear();
    // get data
    const isMock = !this.items.length
    const options = this.properties;
    const initData = isMock ? Visual.mockItems[1] : this.items[1]
    const dx: Array<any> = isMock ? Visual.mockItems[0] : this.items[0]
    const dyData: Array<any> = options.showTotal ? initData.concat([_.sum(initData)]) : initData;
    let { dy, zt, label } = this.getBasicData(dyData, [], [], options);
    const lineData = this.getLineData(dyData, options);
    // get properties
    let itemStyle = {
      color: options.totalColor
    }
    zt[zt.length - 1]["itemStyle"] = itemStyle

    const option = {
      xAxis: {
        data: dx,
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: options.fontSize,
            color: options.textColor
          }
        },
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          textStyle: {
            fontSize: options.fontSize,
            color: options.textColor
          }
        },
      },
      legend: {
        data: [{
          name: '上升',
          fontSize: options.legendFontSize,
          textStyle: { color: options.customPaletteColor[0].colorStops ? options.customPaletteColor[0].colorStops[0] : options.customPaletteColor[0] }
        }, {
          name: '下降',
          fontSize: options.legendFontSize,
          textStyle: { color: options.customPaletteColor[1].colorStops ? options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1] }
        }],
        show: options.customShowLegend,
        left: options.legendVerticalPosition,
        top: options.legendHorizontalPosition
      },
      series: [{
        type: 'candlestick',
        name: '上升',
        barCategoryGap: '10',
        //开始值、结束值、最大值、最小值
        //[[1,2,3,4]
        data: zt,
        itemStyle: {
          color: options.customPaletteColor[0].colorStops ? options.customPaletteColor[0].colorStops[0] : options.customPaletteColor[0],
          color0: options.customPaletteColor[1].colorStops ? options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1],
          opacity: options.customOpacity / 100,
          borderWidth: 0,
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 0.000000000000001,
          label: {
            show: options.customShowMark,
            color: options.showTextStyle.color,
            fontFamily: options.showTextStyle.fontFamily,
            fontSize: options.showTextStyle.fontSize.replace("pt", ""),
            fontStyle: options.showTextStyle.fontStyle,
            fontWeight: options.showTextStyle.fontWeight,
            position: options.labelPosition,
            formatter: (res) => {
              return this.formatData(res.data.value);
            }
          },
          data: label
        },
        emphasis: {
          itemStyle: {
            borderWidth: 0
          }
        }
      },
      {
        type: 'line',
        step: 'end',
        symbol: 'none',
        data: options.customShowLine ? lineData : [],
        itemStyle: {
          normal: {
            lineStyle: {
              width: 1,
              color: options.customLineColor,
              type: 'dotted'
            }
          }
        }
      },
      {
        name: '下降',
        type: 'bar',
        data: [],
        itemStyle: {
          normal: {
            color: options.customPaletteColor[1].colorStops ? options.customPaletteColor[1].colorStops[0] : options.customPaletteColor[1]
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

    let hiddenOptions: Array<string> = [''];

    if (!options.properties.customShowLegend) {
     hiddenOptions = hiddenOptions.concat(['legendFontSize', 'legendVerticalPosition', 'legendHorizontalPosition'])
    }

    if (!options.properties.customShowLine) {
      hiddenOptions = hiddenOptions.concat(['customLineColor'])
    }

    if(!options.properties.customShowMark){
      hiddenOptions = hiddenOptions.concat(['showTextStyle','labelPosition'])
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}