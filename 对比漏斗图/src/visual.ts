import '../style/visual.less';
import * as echarts from 'echarts'

export default class Visual extends WynVisual {

  private myEcharts: any;
  private selectionManager: any;
  private host: any;
  private selectionIds: any;
  private dom: any;
  private selectionIdsArray: Array<any>;
  private funnelData: any[];
  private isDoubleFunnel: boolean;
  private properties: any;
  private actualValueTotal: number;
  private reducedValueTotal: number;



  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.myEcharts = echarts.init(dom);
    this.dom = dom;
    this.host = host;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
    this.selectionIdsArray = new Array<any>();
  }

  public onResize() {
    this.myEcharts.resize();
    this.render();
  }

  private selectEvent() {

    this.dom.addEventListener("click", () => {
      this.selectionManager.clear();
      this.selectionIdsArray = new Array<any>();
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })


    //鼠标左键
    this.myEcharts.on('click', (params) => {
      params.event.event.stopPropagation();

      //鼠标左键功能
      let leftMouseButton = this.properties.properties.leftMouseButton;
      switch (leftMouseButton) {
        //鼠标联动设置    
        case "none": {
          if (this.selectionManager.isEmpty()) {
            this.selectionIdsArray.push(this.selectionIds[params.dataIndex]);
            this.selectionManager.select(this.selectionIdsArray, true);
            return
          }

          if (!this.selectionManager.contains(this.selectionIds[params.dataIndex])) {
            this.selectionIdsArray.push(this.selectionIds[params.dataIndex]);
          } else {
            this.selectionIdsArray.splice(this.selectionIdsArray.indexOf(this.selectionIds[params.dataIndex]), 1);
            this.selectionManager.clear(this.selectionIds[params.dataIndex])
          }
          if (this.selectionIdsArray.length == this.selectionIds.length) {
            this.selectionManager.clear();
            this.selectionIdsArray = new Array<any>();
            this.host.toolTipService.hide();
            return;
          }
          this.selectionManager.select(this.selectionIdsArray, true);
          break;
        }
        default: {
          const selectionIds = this.selectionIds[params.dataIndex];
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

    })

    //鼠标右键
    this.myEcharts.on('mouseup', (params) => {
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
      }
    })

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.getFunnelPairData();
    this.render();
  }

  public onDestroy(): void {

  }

  //属性隐藏设置
  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    this.properties = options;
    //是否是对比图
    this.isDoubleFunnel = (this.properties.dataViews[0].plain.profile.reduced_value.values.length == 0) ? false : true;


    let hiddenOptions: Array<string> = [''];
    hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition']);

    //图例宽高自定义
    if (options.properties.legendArea === 'auto') {
      hiddenOptions = hiddenOptions.concat(['legendWidth', 'legendHeight']);
    }

    if (options.properties.funnelStyle === 'style2' || this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['maxSize', 'minSize']);
    }
    //样式切换  漏斗样式
    if (!this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['actualMaxSize', 'actualMinSize', 'reducedMaxSize', 'reducedMinSize']);
    }

    //标签
    //单漏斗  标签显示
    if (!this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['labelWidth']);
    }
    if (!this.properties.properties.showLabelName || !this.properties.properties.showLabelValue) {
      hiddenOptions = hiddenOptions.concat(['showTwoRow']);
    }
    if (!this.properties.properties.showLabelName && !this.properties.properties.showLabelValue) {
      hiddenOptions = hiddenOptions.concat(['LabelPosition', 'showTextStyle']);
    }
    //单漏斗  实际占比
    if (!this.properties.properties.showActualPro) {
      hiddenOptions = hiddenOptions.concat(['guideLineLength', 'guideLineWidth', 'showActualTextStyle']);
    }
    //单漏斗  上下占比
    if (!this.properties.properties.showConPro) {
      hiddenOptions = hiddenOptions.concat(['showComTextStyle']);
    }
    //对比漏斗
    //隐藏
    if (this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['showTwoRow', 'LabelPosition', 'guideLineLength', 'guideLineWidth', 'showActualTextStyle']);
    }
    if (this.isDoubleFunnel && options.properties.funnelStyle == 'style2') {
      hiddenOptions = hiddenOptions.concat(['showConPro'])
    }

    //图例
    //显示图例
    if (!options.properties.showLegend) {
      hiddenOptions = hiddenOptions.concat(['itemGap', 'showLegendName', "legendSeriesWidth", "showLegendValue", "legendValueWidth", "showLegendCom", "legendIcon", "legendPosition", "legendVerticalPosition", "legendHorizontalPosition", "legendArea", "legendTextStyle"]);
    }
    //图例显示之间宽度
    if (!options.properties.showLegendName) {
      hiddenOptions = hiddenOptions.concat(['legendSeriesWidth']);
    }
    //图例字体隐藏
    if ((!options.properties.showLegendValue && !options.properties.showLegendCom && !options.properties.showLegendName)) {
      hiddenOptions = hiddenOptions.concat(['legendTextStyle']);
    }
    //图例字体
    if ((!options.properties.showLegendValue && !options.properties.showLegendCom)) {
      hiddenOptions = hiddenOptions.concat(['legendSeriesWidth']);
    }
    if (!options.properties.showLegendValue || !options.properties.showLegendCom) {
      hiddenOptions = hiddenOptions.concat(['legendValueWidth']);
    }
    //对比图
    if (this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['showLegendValue', 'showLegendCom']);
    }

    return hiddenOptions;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }

  private render() {
    this.myEcharts.clear();
    let option = null;
    if (this.isDoubleFunnel) {
      option = this.getOptionForDouble()
    } else {
      option = this.getOptionForOnce();
    }
    this.myEcharts.setOption(option);
  }

  //单个漏斗图显示options
  getOptionForOnce() {

    //漏斗边框
    let funnelWin = {
      top: this.dom.clientHeight * 0.1,
      left: this.dom.clientWidth * 0.2,
      bottom: 0,
      width: this.dom.clientWidth * 0.6,
      height: this.dom.clientHeight * 0.8
    }

    //grape边框
    let grapeWin = {
      top: funnelWin.top + (funnelWin.height / this.funnelData.length) / 2,
      height: (funnelWin.height / this.funnelData.length) * (this.funnelData.length - 1)
    }

    let curvenessValues = this.getCurveness(funnelWin.width, this.funnelData.map((data) => { return data.actual_value }), this.properties.properties.maxSize, this.properties.properties.minSize);


    const typeValue = (data) => {
      if (this.properties.properties.funnelStyle == "style1") {
        return data.data.value;
      } else {
        return data.data.actualValue
      }
    }

    //数据标签显示
    let showLabel = (data) => {
      let showTwoRow = this.properties.properties.showTwoRow ? '\n' : ':'
      if (this.properties.properties.showLabelName && this.properties.properties.showLabelValue) {
        return data.data.name + showTwoRow + typeValue(data);
      } else {
        if (this.properties.properties.showLabelName) {
          return data.data.name;
        }
        if (this.properties.properties.showLabelValue) {
          return typeValue(data);
        }
      }
      return ""
    }


    let colorIndex = 0;

    //样式属性设置
    let styleValue = {
      minSize: "0%",
      maxSize: "100%"
    }
    if (this.properties.properties.funnelStyle == "style1") {
      styleValue.minSize = this.properties.properties.minSize + "%";
      styleValue.maxSize = this.properties.properties.maxSize + "%"
    }
    let addActualValue = 0;
    var showData = [];
    var showData2 = [];
    var ySize = 1;

    let widthXMath = this.funnelData[0].actual_value - this.funnelData[this.funnelData.length - 1].actual_value;
    let x = 0;
    this.funnelData.forEach((data, index, arr) => {

      addActualValue = addActualValue + Number(data.actual_value);
      let name, value;
      name = data.series;
      if (this.properties.properties.funnelStyle === "style2") {
        value = arr.length - index;
      } else {
        value = data.actual_value;
      }

      //上下比例
      var myData1 = {
        name: name,
        value: value,
        actualValue: data.actual_value,
        x: 10,
        y: ySize,
        itemStyle: {
          color: this.getColors(index, 1)
        }
      };
      //背景百分比
      ySize = ySize + 10;
      var myData2 = {
        name: name,
        value: value,
        actual_value: data.actual_value,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: this.getColors(index, 1) + "33"
            }, {
              offset: 1,
              color: this.getColors(index, 1)
            }]),
            borderWidth: 0,
            opacity: 1
          }
        },
      };
      showData.push(myData1);
      showData2.push(myData2);


    })

    //指向线设置
    var links = [];
    for (var i = 0; i < showData.length - 1; i++) {
      var data = {
        source: showData[i].name,
        target: showData[i + 1].name,
        value: (Math.round((showData[i + 1].value / showData[i].value) * 100 * 100) / 100).toFixed(2),
        lineStyle: {
          // curveness: -1 - (this.properties.properties.minSize * 0.04),
          curveness: -curvenessValues[i],
          color: {
            colorStops: [{
              offset: 0,
              color: this.getColors(colorIndex++, 0) // 0% 处的颜色
            }, {
              offset: 1,
              color: this.getColors(colorIndex, 0) // 100% 处的颜色
            }],
            // global: false // 缺省为 false
          }
        }
      };
      links.push(data);
    }

    const orient = this.properties.properties.legendPosition === 'left' || this.properties.properties.legendPosition === 'right' ? 'vertical' : 'horizontal';


    var option = {
      //图例
      legend: {
        left: this.properties.properties.legendPosition === 'left' || this.properties.properties.legendPosition === 'right' ? this.properties.properties.legendPosition : this.properties.properties.legendVerticalPosition,
        top: this.properties.properties.legendPosition === 'top' || this.properties.properties.legendPosition === 'bottom' ? this.properties.properties.legendPosition : this.properties.properties.legendHorizontalPosition,
        orient: orient,
        width: this.properties.properties.legendArea === 'custom' ? `${this.properties.properties.legendWidth}%` : 'auto',
        height: this.properties.properties.legendArea === 'custom' ? `${this.properties.properties.legendHeight}%` : 'auto',
        //图例间距
        itemGap: this.properties.properties.itemGap,
        //图例形状
        icon: this.properties.properties.legendIcon === 'none' ? '' : this.properties.properties.legendIcon,
        show: this.properties.properties.showLegend,
        data: this.funnelData.map((data) => { return { name: data.series } }),
        // data: this.funnelData.forEach((data) => { return data.series }),
        formatter: (name) => {
          let legendText = ""
          if (this.properties.properties.showLegendName) {
            legendText = '{a|' + name + '}'
          }
          this.funnelData.forEach((data, index) => {
            if (data.series == name) {
              //显示数值
              if (this.properties.properties.showLegendValue) {
                legendText += '{b|' + data.actual_value + '}';
              }
              //显示比值
              if (this.properties.properties.showLegendCom) {
                legendText += " " + (Math.round((data.actual_value / addActualValue) * 100 * 100) / 100).toFixed(2) + "%"
              }
            }
          })

          //显示
          if (this.properties.properties.showLegend) {
            return legendText;
          } else {
            return "";
          }
        },
        textStyle: {
          color: this.properties.properties.legendTextStyle.color,
          fontFamily: this.properties.properties.legendTextStyle.fontFamily,
          fontSize: this.properties.properties.legendTextStyle.fontSize.replace("pt", ""),
          fontStyle: this.properties.properties.legendTextStyle.fontStyle,
          fontWeight: this.properties.properties.legendTextStyle.fontWeight,
          rich: {
            a: {
              align: 'left',
              fontSize: 14,
              // color: legendTextStyle.color,
              width: this.properties.properties.legendSeriesWidth,
              padding: [0, 15, 0, 0]
            },
            b: {
              align: 'left',
              fontSize: 14,
              // color: legendTextStyle.color,
              width: this.properties.properties.legendValueWidth,
              padding: [0, 15, 0, 0]
            },
          }
        }
      },

      series: [

        // 数值显示
        {
          itemStyle: {
            opacity: 1
          },
          type: 'funnel',
          // color: colors,
          z: 2,
          //不触发响应事件
          silent: false,
          //开启动画
          animation: false,
          //联动亮度
          legendHoverLink: false,
          top: funnelWin.top,
          left: funnelWin.left,
          // bottom: funnelWin.bottom,
          height: funnelWin.height,
          width: funnelWin.width,
          minSize: styleValue.minSize,
          maxSize: styleValue.maxSize,
          // sort: 'descending',
          gap: this.properties.properties.gapSize,
          label: {
            show: true,
            position: 'inside',
            formatter: function (data) {
              return showLabel(data);
            },
            padding: [0, 0, 0, this.properties.properties.LabelPosition],
            color: this.properties.properties.showTextStyle.color,
            fontFamily: this.properties.properties.showTextStyle.fontFamily,
            fontSize: this.properties.properties.showTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.properties.properties.showTextStyle.fontStyle,
            fontWeight: this.properties.properties.showTextStyle.fontWeight

          },
          emphasis: {
            focus: 'series'
          },
          data: showData
        },

        //转换率计算
        {
          type: 'funnel',
          gap: this.properties.properties.gapSize,
          minSize: styleValue.minSize,
          maxSize: styleValue.maxSize,
          left: '25%',
          top: funnelWin.top,
          height: funnelWin.height,
          width: funnelWin.width,
          z: 1,
          //不触发响应事件
          silent: true,
          label: {
            overflow: 'break',
            borderColor: '#000',
            position: 'right',
            formatter: function (d) {
              return '{d|' + (Math.round((d.data.actual_value / addActualValue) * 100 * 100) / 100).toFixed(2) + '}';
            },
            rich: {
              d: {
                align: 'center',
                color: this.properties.properties.showActualTextStyle.color,
                fontSize: this.properties.properties.showActualTextStyle.fontSize.replace("pt", ""),
                fontStyle: this.properties.properties.showActualTextStyle.fontStyle,
                fontWeight: this.properties.properties.showActualTextStyle.fontWeight
              }
            }
          },
          labelLine: {
            show: true,
            length: this.properties.properties.guideLineLength,
            lineStyle: {
              width: this.properties.properties.guideLineWidth,
              type: 'solid'
            }
          },
          data: this.properties.properties.showActualPro ? showData2 : null
        },

        //占上一位的百分比
        {
          z: 1,
          top: grapeWin.top,
          height: grapeWin.height,
          type: 'graph',
          layout: 'none',
          symbolSize: 0,
          roam: false,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [0, 10],
          lineStyle: {
            normal: {
              width: 2,
            }
          },
          edgeLabel: {
            normal: {
              show: true,
              rotate: 0,
              position: 'end',
              verticalAlign: 'bottom',
              align: 'right',
              // fontSize: 20,
              formatter: function (d) {
                if (d.value) {
                  var ins = '{words|' + d.value + '%}';
                  return ins;
                }
              },
              rich: {
                words: {
                  color: this.properties.properties.showComTextStyle.color,
                  fontFamily: this.properties.properties.showComTextStyle.fontFamily,
                  fontSize: this.properties.properties.showComTextStyle.fontSize.replace("pt", ""),
                  fontStyle: this.properties.properties.showComTextStyle.fontStyle,
                  fontWeight: this.properties.properties.showComTextStyle.fontWeight
                }
              }
            }
          },
          data: this.properties.properties.showConPro ? showData : null,
          links: links,

        }
      ]
    };
    return option;
  }

  //漏斗对比图的options
  getOptionForDouble() {

    var option = (this.properties.properties.funnelStyle == 'style1') ? this.getStyleOption1() : this.getStyleOption2();
    return option
  }


  //对比图样式1
  getStyleOption1() {


    //漏斗边框
    let leftFunnelWin = {
      top: this.dom.clientHeight * 0.1,
      left: this.dom.clientWidth * 0.2,
      width: this.dom.clientWidth * 0.3,
      height: this.dom.clientHeight * 0.8
    }

    let rightFunnelWin = {
      top: this.dom.clientHeight * 0.1,
      right: this.dom.clientWidth * 0.1,
      width: this.dom.clientWidth * 0.3,
      height: this.dom.clientHeight * 0.8
    }

    //grape边框
    let leftGrapeWin = {
      top: leftFunnelWin.top + (leftFunnelWin.height / this.funnelData.length) / 2,
      height: (leftFunnelWin.height / this.funnelData.length) * (this.funnelData.length - 1)
    }
    let rightGrapeWin = {
      top: rightFunnelWin.top + (rightFunnelWin.height / this.funnelData.length) / 2,
      height: (rightFunnelWin.height / this.funnelData.length) * (this.funnelData.length - 1)
    }

    let leftCurvenessValues = this.getCurveness(leftFunnelWin.width * 2, this.funnelData.map((data) => { return data.actual_value }), this.properties.properties.actualMaxSize, this.properties.properties.actualMinSize);
    let rightCurvenessValues = this.getCurveness(rightFunnelWin.width * 2, this.funnelData.map((data) => { return data.reduced_value }), this.properties.properties.reducedMaxSize, this.properties.properties.reducedMinSize);



    let properties = this.properties.properties;
    let addActualValue = 0;
    let addReducedValue = 0;
    var actual_links = [];
    var reduced_links = [];
    let ySize = 0;
    for (var i = 0; i < this.funnelData.length - 1; i++) {
      addActualValue += this.funnelData[i].actual_value;
      addReducedValue += this.funnelData[i].reduced_value;
      var data1 = {
        source: this.funnelData[i].series,
        target: this.funnelData[i + 1].series,
        value: (Math.round((this.funnelData[i + 1].actual_value / this.funnelData[i].actual_value) * 100 * 100) / 100).toFixed(2),
        lineStyle: {
          curveness: -leftCurvenessValues[i]
        }
      };
      actual_links.push(data1);
      var data2 = {
        source: this.funnelData[i].series,
        target: this.funnelData[i + 1].series,
        value: (Math.round((this.funnelData[i + 1].reduced_value / this.funnelData[i].reduced_value) * 100 * 100) / 100).toFixed(2),
        lineStyle: {
          curveness: rightCurvenessValues[i]
        }
      };
      reduced_links.push(data2);
    }

    const orient = this.properties.properties.legendPosition === 'left' || this.properties.properties.legendPosition === 'right' ? 'vertical' : 'horizontal';

    var option = {

      legend: {
        left: this.properties.properties.legendPosition === 'left' || this.properties.properties.legendPosition === 'right' ? this.properties.properties.legendPosition : this.properties.properties.legendVerticalPosition,
        top: this.properties.properties.legendPosition === 'top' || this.properties.properties.legendPosition === 'bottom' ? this.properties.properties.legendPosition : this.properties.properties.legendHorizontalPosition,
        orient: orient,
        width: this.properties.properties.legendArea === 'custom' ? `${this.properties.properties.legendWidth}%` : 'auto',
        height: this.properties.properties.legendArea === 'custom' ? `${this.properties.properties.legendHeight}%` : 'auto',
        //图例间距
        itemGap: this.properties.properties.itemGap,
        //图例形状
        icon: this.properties.properties.legendIcon === 'none' ? '' : this.properties.properties.legendIcon,
        show: this.properties.properties.showLegend,
        data: this.funnelData.map((data) => { return data.series }),
        formatter: (data) => {
          let legendText = "";
          if (properties.showLegendName) {
            legendText += data
          }
          return legendText
        },
        textStyle: {
          color: this.properties.properties.legendTextStyle.color,
          fontFamily: this.properties.properties.legendTextStyle.fontFamily,
          fontSize: this.properties.properties.legendTextStyle.fontSize.replace("pt", ""),
          fontStyle: this.properties.properties.legendTextStyle.fontStyle,
          fontWeight: this.properties.properties.legendTextStyle.fontWeight,
        }
      },


      tooltip: {
        formatter: "{a} <br/>{b} : {c}",
      },

      series: [

        {

          //实际数值
          name: this.properties.dataViews[0].plain.profile.actual_value.values[0].display,
          //相应鼠标时间
          silent: false,
          // color: colors,
          top: leftFunnelWin.top,
          left: leftFunnelWin.left,
          width: leftFunnelWin.width,
          height: leftFunnelWin.height,
          type: 'funnel',
          funnelAlign: 'right',
          maxSize: this.properties.properties.actualMaxSize + "%",
          minSize: this.properties.properties.actualMinSize + "%",
          sort: 'descending',
          gap: this.properties.properties.gapSize,
          label: {
            show: true,
            //超出宽度是否换行  设置width时有效   
            overflow: 'break',
            width: properties.labelWidth,
            color: this.properties.properties.showTextStyle.color,
            fontFamily: this.properties.properties.showTextStyle.fontFamily,
            fontSize: this.properties.properties.showTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.properties.properties.showTextStyle.fontStyle,
            fontWeight: this.properties.properties.showTextStyle.fontWeight,
            formatter: (data) => {
              let labelText = "";
              if (properties.showLabelName) {
                labelText += `${data.data.name}`
              }
              if (properties.showLabelName && properties.showLabelValue) {
                labelText += `: `
              }
              if (properties.showLabelValue) {
                labelText += `${data.data.value}`
              }
              if (properties.showActualPro && properties.showLabelValue) {
                labelText += ` `
              }
              if (properties.showActualPro) {
                labelText += `${data.data.percent}%`
              }
              return labelText
            },
            position: 'insideLeft',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
            opacity: 1
          },
          data: this.funnelData.map((data, index) => {
            return Object.assign({}, {
              name: data.series,
              value: data.actual_value,
              percent: (Math.round((data.actual_value / addActualValue) * 100 * 100) / 100).toFixed(2),
              itemStyle: {
                color: this.getColors(index, 1)
              }
            })
          })
        },

        {
          //对比数值
          name: this.properties.dataViews[0].plain.profile.reduced_value.values[0].display,
          //相应鼠标时间
          silent: false,
          top: rightFunnelWin.top,
          // right: rightFunnelWin.right,
          width: rightFunnelWin.width,
          height: rightFunnelWin.height,
          type: 'funnel',
          x: '50%',
          funnelAlign: 'left',
          maxSize: this.properties.properties.reducedMaxSize + "%",
          minSize: this.properties.properties.reducedMinSize + "%",
          sort: 'descending',
          gap: this.properties.properties.gapSize,
          label: {
            show: true,
            //超出宽度是否换行  设置width时有效   
            overflow: 'break',
            width: properties.labelWidth,
            color: properties.showTextStyle.color,
            fontFamily: properties.showTextStyle.fontFamily,
            fontSize: properties.showTextStyle.fontSize.replace("pt", ""),
            fontStyle: properties.showTextStyle.fontStyle,
            fontWeight: properties.showTextStyle.fontWeight,
            formatter: (data) => {
              let labelText = "";
              if (properties.showLabelName) {
                labelText += `${data.data.name}`
              }
              if (properties.showLabelName && properties.showLabelValue) {
                labelText += `: `
              }
              if (properties.showLabelValue) {
                labelText += `${data.data.value}`
              }
              if (properties.showActualPro && properties.showLabelValue) {
                labelText += ` `
              }
              if (properties.showActualPro) {
                labelText += `${data.data.percent}%`
              }
              return labelText
            },
            position: 'insideRight',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
            opacity: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: this.funnelData.map((data, index) => {
            return Object.assign({}, {
              name: data.series,
              value: data.reduced_value,
              percent: (Math.round((data.reduced_value / addReducedValue) * 100 * 100) / 100).toFixed(2),
              itemStyle: {
                color: this.getColors(index, 1)
              }
            })
          })
        },

        //实际数占上一位的百分比
        {
          z: 1,
          top: leftGrapeWin.top,
          height: leftGrapeWin.height,
          type: 'graph',
          layout: 'none',
          symbolSize: 0,
          roam: false,
          edgeSymbol: ['circle', 'arrow'],
          //不触发响应事件
          silent: true,
          lineStyle: {
            normal: {
              width: 2,
            }
          },
          edgeLabel: {
            normal: {
              show: true,
              rotate: 0,
              position: 'end',
              verticalAlign: 'bottom',
              align: 'right',
              backgroundColor: '#e4f5da',
              borderRadius: 4,
              color: '#333',
              fontSize: 14,
              legendHoverLink: true,
              padding: [3, 10, 5, 10],
              formatter: function (d) {
                if (d.value) {
                  var ins = '{words|' + d.value + '%}';
                  return ins;
                }
              },
              rich: {
                words: {
                  color: this.properties.properties.showComTextStyle.color,
                  fontFamily: this.properties.properties.showComTextStyle.fontFamily,
                  fontSize: this.properties.properties.showComTextStyle.fontSize.replace("pt", ""),
                  fontStyle: this.properties.properties.showComTextStyle.fontStyle,
                  fontWeight: this.properties.properties.showComTextStyle.fontWeight
                }
              }
            }
          },
          data: properties.showConPro ? this.funnelData.map((data) => { return Object.assign({}, { name: data.series, x: 400, y: ySize++ }) }) : null,
          links: actual_links

        },
        //对比值占上一位的百分比
        {
          z: 1,
          top: rightGrapeWin.top,
          height: rightGrapeWin.height,
          type: 'graph',
          layout: 'none',
          symbolSize: 0,
          roam: false,
          edgeSymbol: ['circle', 'arrow'],
          //不触发响应事件
          silent: true,
          lineStyle: {
            normal: {
              width: 2,
            }
          },
          edgeLabel: {
            normal: {
              show: true,
              rotate: 0,
              position: 'end',
              verticalAlign: 'bottom',
              align: 'left',
              backgroundColor: '#e4f5da',
              borderRadius: 4,
              color: '#333',
              fontSize: 14,
              legendHoverLink: true,
              padding: [3, 10, 5, 10],
              formatter: function (d) {
                if (d.value) {
                  var ins = '{words|' + d.value + '%}';
                  return ins;
                }
              },
              rich: {
                words: {
                  color: this.properties.properties.showComTextStyle.color,
                  fontFamily: this.properties.properties.showComTextStyle.fontFamily,
                  fontSize: this.properties.properties.showComTextStyle.fontSize.replace("pt", ""),
                  fontStyle: this.properties.properties.showComTextStyle.fontStyle,
                  fontWeight: this.properties.properties.showComTextStyle.fontWeight
                }
              }
            }
          },
          data: properties.showConPro ? this.funnelData.map((data) => { return Object.assign({}, { name: data.series, x: 400, y: ySize++ }) }) : null,
          links: reduced_links,
        }

      ]
    }
    return option;
  }

  //对比图样式2
  getStyleOption2() {

    const orient = this.properties.properties.legendPosition === 'left' || this.properties.properties.legendPosition === 'right' ? 'vertical' : 'horizontal';

    var option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      legend: {
        left: this.properties.properties.legendPosition === 'left' || this.properties.properties.legendPosition === 'right' ? this.properties.properties.legendPosition : this.properties.properties.legendVerticalPosition,
        top: this.properties.properties.legendPosition === 'top' || this.properties.properties.legendPosition === 'bottom' ? this.properties.properties.legendPosition : this.properties.properties.legendHorizontalPosition,
        orient: orient,
        width: this.properties.properties.legendArea === 'custom' ? `${this.properties.properties.legendWidth}%` : 'auto',
        height: this.properties.properties.legendArea === 'custom' ? `${this.properties.properties.legendHeight}%` : 'auto',
        //图例间距
        itemGap: this.properties.properties.itemGap,
        //图例形状
        icon: this.properties.properties.legendIcon === 'none' ? '' : this.properties.properties.legendIcon,
        show: this.properties.properties.showLegend,
        data: this.funnelData.map((data) => { return data.series }),
        formatter: (data) => {
          let legendText = "";
          if (this.properties.properties.showLegendName) {
            legendText += data
          }
          return legendText
        },
        textStyle: {
          color: this.properties.properties.legendTextStyle.color,
          fontFamily: this.properties.properties.legendTextStyle.fontFamily,
          fontSize: this.properties.properties.legendTextStyle.fontSize.replace("pt", ""),
          fontStyle: this.properties.properties.legendTextStyle.fontStyle,
          fontWeight: this.properties.properties.legendTextStyle.fontWeight,
        }
      },

      series: [

        //实际值
        {
          name: this.properties.dataViews[0].plain.profile.actual_value.values[0].display,
          type: 'funnel',
          top: '10%',
          left: '10%',
          height: '90%',
          width: '70%',
          maxSize: this.properties.properties.actualMaxSize + "%",
          minSize: this.properties.properties.actualMinSize + "%",
          label: {
            width: this.properties.properties.labelWidth,
            overflow: 'break',
            position: 'inside',
            formatter: (data) => {
              let labelText = "";
              if (this.properties.properties.showLabelName) {
                labelText += `${data.data.name}`
              }
              if (this.properties.properties.showLabelName && this.properties.properties.showLabelValue) {
                labelText += `: `
              }
              if (this.properties.properties.showLabelValue) {
                labelText += `${data.data.value}`
              }
              if (this.properties.properties.showActualPro && this.properties.properties.showLabelValue) {
                labelText += ` `
              }
              if (this.properties.properties.showActualPro) {
                labelText += `${data.data.com}%`
              }
              return labelText
            },
            color: this.properties.properties.showTextStyle.color,
            fontFamily: this.properties.properties.showTextStyle.fontFamily,
            fontSize: this.properties.properties.showTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.properties.properties.showTextStyle.fontStyle,
            fontWeight: this.properties.properties.showTextStyle.fontWeight
          },
          itemStyle: {
            opacity: 1,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: this.funnelData.map((data, index) => { return { name: data.series, value: data.actual_value, com: (Math.round((data.actual_value / data.reduced_value) * 100 * 100) / 100).toFixed(2), itemStyle: { color: this.getColors(index, 1) } } }),
          // Ensure outer shape will not be over inner shape when hover.
          z: 2
        },

        //对比值
        {
          z: 1,
          name: this.properties.dataViews[0].plain.profile.reduced_value.values[0].display,
          type: 'funnel',
          top: '10%',
          left: '10%',
          height: '90%',
          width: '70%',
          maxSize: this.properties.properties.reducedMaxSize + "%",
          minSize: this.properties.properties.reducedMinSize + "%",
          label: {
            width: this.properties.properties.labelWidth,
            overflow: 'break',
            position: 'right',
            formatter: function (d) {
              return d.data.name + ':' + d.data.value
            },
            color: this.properties.properties.showTextStyle.color,
            fontFamily: this.properties.properties.showTextStyle.fontFamily,
            fontSize: this.properties.properties.showTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.properties.properties.showTextStyle.fontStyle,
            fontWeight: this.properties.properties.showTextStyle.fontWeight
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            opacity: 0.3
          },
          // emphasis: {
          //   label: {
          //     position: 'inside',
          //     formatter: '{b}: {c}%'
          //   }
          // },
          data: this.funnelData.map((data, index) => { return { name: data.series, value: data.reduced_value, com: (Math.round((data.actual_value / data.reduced_value) * 100 * 100) / 100).toFixed(2), itemStyle: { color: this.getColors(index, 1) + "99" } } })
        }
      ]
    };
    return option;
  }

  //获取数据集所有数据，并保存在funnelDate
  public getFunnelPairData() {
    this.actualValueTotal = 0;
    this.reducedValueTotal = 0;
    let allData;

    this.funnelData = [];
    this.selectionIds = [];

    const dataView = this.properties.dataViews[0] && this.properties.dataViews[0].plain;

    const seriesDisplay = dataView.profile.series.values[0].display;
    const actualDisplay = dataView.profile.actual_value.values[0].display
    let reducedDisplay: string
    if (this.isDoubleFunnel) {
      reducedDisplay = dataView.profile.reduced_value.values[0].display;
    }

    if (dataView) {
      dataView.data.sort((a, b) => { return b[actualDisplay] - a[actualDisplay] })
      dataView.data.forEach((dataPoint) => {
        //数据共享
        const selectionId = this.host.selectionService.createSelectionId();
        selectionId.withDimension(dataView.profile.series.values[0], dataPoint);
        selectionId.withDimension(dataView.profile.actual_value.values[0], dataPoint);

        allData = {
          series: dataPoint[seriesDisplay],
          actual_value: Number(dataPoint[actualDisplay]),
          reduced_value: Number,
        }
        this.actualValueTotal += Number(dataPoint[actualDisplay]);

        if (this.isDoubleFunnel) {
          selectionId.withDimension(dataView.profile.reduced_value.values[0], dataPoint);
          allData.reduced_value = dataPoint[reducedDisplay];
          this.reducedValueTotal += Number(dataPoint[reducedDisplay]);
        }
        this.selectionIds.push(selectionId);
        this.funnelData.push(allData);
      })
    };
  }

  //获取曲率指数
  private getCurveness(funnelWidth, data, maxSize, minSize) {
    let curvenessValues = [];
    let maxValue = data[0];
    let topWidth
    //高合曲率
    let cors = ((this.dom.clientHeight * 0.8) / this.funnelData.length) / 1.6
    let minWidth
    let width
    let nedSize

    if (maxSize >= minSize) {
      topWidth = funnelWidth * (maxSize / 100)
      minWidth = (minSize / 100) * funnelWidth;
      width = topWidth - minWidth;
      nedSize = funnelWidth * (minSize / 100);
      for (let i = 1; i < data.length; i++) {
        curvenessValues.push((width * (data[i] / maxValue) + nedSize) / cors);
      }
    } else {
      topWidth = funnelWidth * (minSize / 100)
      minWidth = (maxSize / 100) * funnelWidth;
      width = topWidth - minWidth;
      nedSize = funnelWidth * (maxSize / 100);
      for (let i = 1; i < data.length; i++) {
        curvenessValues.push((width * (data[i] / maxValue) + nedSize) / cors+1);
      }

      curvenessValues.reverse()
    }
  
    return curvenessValues;
  }

  private getColors(index, position: number) {
    let backgroundColor = ''
    const pieColor: [{
      colorStops: [] | any
    }] = this.properties.properties.pallet && this.properties.properties.pallet || [];
    if (index < pieColor.length) {
      backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
    } else {
      backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
        ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
        : pieColor[index % (pieColor.length)]
    }
    return backgroundColor
  }
}


