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
    data: [
      {
        data: [
          {
            data: {name: "销售数量",type: "value",value: 152 },
            name: "销售城市",
            type: "classification",
            value: "西安"
          },{
            data: {name: "销售数量",type: "value",value: 132 },
            name: "销售城市",
            type: "classification",
            value: "榆林"
          },{
            data: {name: "销售数量",type: "value",value: 134 },
            name: "销售城市",
            type: "classification",
            value: "成都"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 140 },
            name: "销售城市",
            type: "classification",
            value: "上海"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 158 },
            name: "销售城市",
            type: "classification",
            value: "深圳"
          }
        ],
        name: "水果",
        type: "series",
        value: "苹果"
      },{
        data: [
          {
            data: {name: "销售数量",type: "value",value: 168 },
            name: "销售城市",
            type: "classification",
            value: "西安"
          },{
            data: {name: "销售数量",type: "value",value: 180 },
            name: "销售城市",
            type: "classification",
            value: "榆林"
          },{
            data: {name: "销售数量",type: "value",value: 173 },
            name: "销售城市",
            type: "classification",
            value: "成都"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 195 },
            name: "销售城市",
            type: "classification",
            value: "上海"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 174 },
            name: "销售城市",
            type: "classification",
            value: "深圳"
          }
        ],
        name: "水果",
        type: "series",
        value: "火龙果"
      },{
        data: [
          {
            data: {name: "销售数量",type: "value",value: 188 },
            name: "销售城市",
            type: "classification",
            value: "西安"
          },{
            data: {name: "销售数量",type: "value",value: 200 },
            name: "销售城市",
            type: "classification",
            value: "榆林"
          },{
            data: {name: "销售数量",type: "value",value: 165 },
            name: "销售城市",
            type: "classification",
            value: "成都"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 178 },
            name: "销售城市",
            type: "classification",
            value: "上海"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 167 },
            name: "销售城市",
            type: "classification",
            value: "深圳"
          }
        ],
        name: "水果",
        type: "series",
        value: "西瓜"
      },{
        data: [
          {
            data: {name: "销售数量",type: "value",value: 125 },
            name: "销售城市",
            type: "classification",
            value: "西安"
          },{
            data: {name: "销售数量",type: "value",value: 113 },
            name: "销售城市",
            type: "classification",
            value: "榆林"
          },{
            data: {name: "销售数量",type: "value",value: 145 },
            name: "销售城市",
            type: "classification",
            value: "成都"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 125 },
            name: "销售城市",
            type: "classification",
            value: "上海"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 158 },
            name: "销售城市",
            type: "classification",
            value: "深圳"
          }
        ],
        name: "水果",
        type: "series",
        value: "甘蔗"
      },{
        data: [
          {
            data: {name: "销售数量",type: "value",value: 145 },
            name: "销售城市",
            type: "classification",
            value: "西安"
          },{
            data: {name: "销售数量",type: "value",value: 165 },
            name: "销售城市",
            type: "classification",
            value: "榆林"
          },{
            data: {name: "销售数量",type: "value",value: 133 },
            name: "销售城市",
            type: "classification",
            value: "成都"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 147 },
            name: "销售城市",
            type: "classification",
            value: "上海"
          }
          ,{
            data: {name: "销售数量",type: "value",value: 123 },
            name: "销售城市",
            type: "classification",
            value: "深圳"
          }
        ],
        name: "水果",
        type: "series",
        value: "梨"
      }
    ],
    classification: ['西安', '榆林', '成都', '上海', '深圳'],
    series: ['苹果', '火龙果', '西瓜', '甘蔗', '梨'],
    columnSection: [],
    rowSection: [],
    selectionId: {
      columnSection: [],
      rowSection: [],
      classification: [],
      series: []
    },
    valueDisplay: "销售数量",
    size: 25,
    maxValue: 200
  }

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.myEcharts = echarts.init(dom);
    this.host = host;
    this.dom = dom;
    this.isMock = true
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
  }


  public selectEvent() {
    this.dom.addEventListener("click", () => {
      this.selectionManager.clear();
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })




    //鼠标左键
    this.myEcharts.on('click', (params) => {
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.options.leftMouseButton;
        let sids = [];
        if (this.items.classification.length != 0) {
          sids.push(this.items.selectionId.classification[params.dataIndex])
        }
        if (this.items.series.length != 0) {
          let seriesId = params.seriesIndex % this.items.series.length;
          sids.push(this.items.selectionId.series[seriesId])
        }
        if (this.items.rowSection.length != 0) {
          if (this.items.series.length == 0) {
            sids.push(this.items.selectionId.rowSection[params.seriesIndex])
          } else {
            let index;
            if (this.items.columnSection.length == 0) {
              index = Math.ceil((params.seriesIndex / this.items.series.length)) - 1
              index = index == -1 ? 0 : index
              sids.push(this.items.selectionId.rowSection[Math.ceil((params.seriesIndex / this.items.series.length)) - 1])
            } else {
              index = parseInt((params.seriesIndex / this.items.series.length) + '') % this.items.columnSection.length
              index = index == -1 ? 0 : index
              sids.push(this.items.selectionId.rowSection[index])
            }
          }
        }
        if (this.items.columnSection.length != 0) {
          if (this.items.series.length == 0) {
            sids.push(this.items.selectionId.columnSection[params.seriesIndex])
          } else {
            let index;
            if (this.items.rowSection.length == 0) {
              index = Math.ceil((params.seriesIndex / this.items.series.length)) - 1
              index = index == -1 ? 0 : index
              sids.push(this.items.selectionId.columnSection[index])
            } else {
              index = parseInt((params.seriesIndex / (this.items.series.length * this.items.rowSection.length)) + '')
              index = index == -1 ? 0 : index
              sids.push(this.items.selectionId.columnSection[index])
            }
          }
        }
        switch (leftMouseButton) {
          //鼠标联动设置   100/4   32 / 25 1   33 33 33 1 
          case "none": {
            if (this.options.onlySelect) {
              this.selectionManager.clear();
            }
            this.selectionManager.select(sids, true);
          }
          case "showToolTip": {
            this.showTooltip(params, true);
            break;
          }
          default: {
            this.host.commandService.execute([{
              name: leftMouseButton,
              payload: {
                selectionIds: sids,
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
          position: {
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
    console.log(options.dataViews[0])
    if (options.dataViews[0] && options.dataViews[0].plain) {
      const plain = options.dataViews[0].plain
      this.format = plain.profile.value.values[0].format
      let valueDisplay = options.dataViews[0].plain.profile.value.values[0].display;
      this.items = {
        data: [],
        classification: [],
        series: [],
        columnSection: [],
        rowSection: [],
        selectionId: {
          columnSection: [],
          rowSection: [],
          classification: [],
          series: []
        },
        valueDisplay: valueDisplay,
        size: 0,
        maxValue: 0
      };
      let index = 0
      let columnSectionDisplay;
      let rowSectionDisplay;
      let classificationDisplay;
      let seriesDisplay;
      if (plain.profile.columnSection.values.length != 0) {
        columnSectionDisplay = options.dataViews[0].plain.profile.columnSection.values[0].display;
        // const sortFlags = plain.profile.sort[columnSectionDisplay].order;
        // let newItems: any = sortFlags.map((flags) => {
        //   return newItems = plain.data.find((item) => item[columnSectionDisplay] === flags && item)
        // })
      }
      if (plain.profile.rowSection.values.length != 0) {
        rowSectionDisplay = options.dataViews[0].plain.profile.rowSection.values[0].display;
        // const sortFlags = plain.profile.sort[rowSectionDisplay].order;
        // let newItems: any = sortFlags.map((flags) => {
        //   return newItems = plain.data.find((item) => item[rowSectionDisplay] === flags && item)
        // })
      }
      if (plain.profile.classification.values.length != 0) {
        classificationDisplay = options.dataViews[0].plain.profile.classification.values[0].display;
        // const sortFlags = plain.profile.sort[classificationDisplay].order;
        // let newItems: any = sortFlags.map((flags) => {
        //   return newItems = plain.data.find((item) => item[classificationDisplay] === flags && item)
        // })
      }
      if (plain.profile.series.values.length != 0) {
        seriesDisplay = options.dataViews[0].plain.profile.series.values[0].display;
        // const sortFlags = plain.profile.sort[seriesDisplay].order;
        // let newItems: any = sortFlags.map((flags) => {
        //   return newItems = plain.data.find((item) => item[seriesDisplay] === flags && item)
        // })
      }

      options.dataViews[0].plain.data.forEach((val) => {
        this.isMock = false
        this.items.size++
        this.items.maxValue = this.items.maxValue < val[valueDisplay] ? val[valueDisplay] : this.items.maxValue;
        let data = this.items
        let selectionId
        if (typeof (columnSectionDisplay) != "undefined") {
          if (this.items.columnSection.indexOf(val[columnSectionDisplay]) == -1) {
            selectionId = this.host.selectionService.createSelectionId();
            selectionId.withDimension(options.dataViews[0].plain.profile.columnSection.values[0], val);
            this.items.selectionId.columnSection.push(selectionId)
            this.items.columnSection.push(val[columnSectionDisplay])
          }
          index = this.items.columnSection.indexOf(val[columnSectionDisplay])
          if (typeof (data.data[index]) == "undefined") {
            data.data[index] = {
              type: "columnSection",
              name: columnSectionDisplay,
              value: val[columnSectionDisplay],
              data: []
            }
          }
          data = data.data[index]
        };

        if (typeof (rowSectionDisplay) != "undefined") {
          if (this.items.rowSection.indexOf(val[rowSectionDisplay]) == -1) {
            selectionId = this.host.selectionService.createSelectionId();
            selectionId.withDimension(options.dataViews[0].plain.profile.rowSection.values[0], val);
            this.items.selectionId.rowSection.push(selectionId)
            this.items.rowSection.push(val[rowSectionDisplay])
          }
          index = this.items.rowSection.indexOf(val[rowSectionDisplay])
          if (typeof (data.data[index]) == "undefined") {
            data.data[index] = {
              type: "rowSection",
              name: rowSectionDisplay,
              value: val[rowSectionDisplay],
              data: []
            }
          }
          data = data.data[index]
        };


        if (typeof (seriesDisplay) != "undefined") {
          if (this.items.series.indexOf(val[seriesDisplay]) == -1) {
            selectionId = this.host.selectionService.createSelectionId();
            selectionId.withDimension(options.dataViews[0].plain.profile.series.values[0], val);
            this.items.selectionId.series.push(selectionId)
            this.items.series.push(val[seriesDisplay])
          }
          index = this.items.series.indexOf(val[seriesDisplay])
          if (typeof (data.data[index]) == "undefined") {
            data.data[index] = {
              type: "series",
              name: seriesDisplay,
              value: val[seriesDisplay],
              data: []
            }
          }
          data = data.data[index]
        };

        if (typeof (classificationDisplay) != "undefined") {
          if (this.items.classification.indexOf(val[classificationDisplay]) == -1) {
            selectionId = this.host.selectionService.createSelectionId();
            selectionId.withDimension(options.dataViews[0].plain.profile.classification.values[0], val);
            this.items.selectionId.classification.push(selectionId)
            this.items.classification.push(val[classificationDisplay])
          }
          index = this.items.classification.indexOf(val[classificationDisplay])
          if (typeof (data.data[index]) == "undefined") {
            data.data[index] = {
              type: "classification",
              name: classificationDisplay,
              value: val[classificationDisplay],
              data: null
            }
          }
          data = data.data[index]
        };

        data.data = {
          type: "value",
          name: valueDisplay,
          value: val[valueDisplay]
        }
      })
    }
    this.options = options.properties
    this.render();
  }

  public render() {
    this.items = this.isMock ? Visual.mockItems : this.items
    this.myEcharts.clear();
    let colors = [];
    let colorBy = () => {
      let colors = [];
      this.items.series.forEach((data, index) => {
        colors.push({
          type: 'linear',
          colorStops: [
            {
              offset: 1, color: this.getColors(index, this.options.Color, 1) + (this.options.Gradual ? "66" : "FF")
            }, {
              offset: 0, color: this.getColors(index, this.options.Color, 1) + "FF"
            }
          ]
        })
      });
      return colors
    }
    colors = colorBy()
    const orient = this.options.legendPosition === 'left' || this.options.legendPosition === 'right' ? 'vertical' : 'horizontal';
    let option = {
      legend: {
        data: this.items.series,
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
      },
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      dataset: [

      ],
      grid: [
      ],
      xAxis: [
      ],
      yAxis: [
      ],
      series: [

      ]
    };

    let rowSection = (data, option, ind, top, height, left, width, showy) => {
      data.forEach((val, index) => {
        this.getOnePoint(option, val, index + ind, top + (height * index), height, left, width, showy)
      });
    }

    if (this.items.data[0].type == "columnSection") {

      if (this.items.data[0].data[0].type == 'rowSection') {
        this.items.data.forEach((data, index) => {
          let showy = index == 0 ? true : this.options.showClassificationAll
          rowSection(data.data, option, index * this.items.rowSection.length, 10, 80 / this.items.rowSection.length, (100 - (10 + ((80 / this.items.columnSection.length) * index))) - (80 / this.items.columnSection.length), 80 / this.items.columnSection.length, showy)
        });
      } else {
        this.items.data.forEach((val, index) => {
          let showy = index == 0 ? true : this.options.showClassificationAll
          this.getOnePoint(option, val, index, 10, 80, (100 - (10 + ((80 / this.items.columnSection.length) * index))) - (80 / this.items.columnSection.length), 80 / this.items.columnSection.length, showy)
        });
      }
    }

    if (this.items.data[0].type == "rowSection") {
      rowSection(this.items.data, option, 0, 10, 80 / this.items.rowSection.length, 10, 80, true);
    }



    if (this.items.data[0].type == "series") {
      this.getOnePoint(option, this.items, 0, 10, 80, 10, 80, true)
    }

    if (this.items.data[0].type == "classification") {
      this.getOnePoint(option, this.items, 0, 10, 80, 10, 80, true)
    }

    this.myEcharts.setOption(option);
  }

  public getOnePoint(option, value, index, top, height, left, width, showy) {
    option.dataset.push(this.getSource(value.data));
    option.series = option.series.concat(this.getSeries(this.items.series, index))
    option.xAxis.push(this.getX(index))
    option.yAxis.push(this.getY(index, showy))
    option.grid.push(this.getGrid(top, height, left, width))
    return option
  }

  public getSource(data) {
    let source = [];
    source[0] = ["product"]
    if (this.items.series.length != 0) {
      source[0] = source[0].concat(this.items.series)
    }
    this.items.classification.forEach((val, index) => {
      source[index + 1] = [val]
    });
    if (this.items.classification.length != 0 && this.items.series.length != 0) {
      data.forEach((val) => {
        val.data.forEach((value, index) => {
          source[index + 1].push(value.data.value)
        });
      });

    } else {
      if (this.items.classification.length == 0) {
        source[1] = [""]
        data.forEach((val) => {
          source[1].push(val.data.value)
        })
      }
      if (this.items.series.length == 0) {
        data.forEach((value, index) => {
          source[index + 1].push(value.data.value)
        });
      }
    }

    let dataset = {
      source: source
    }
    return dataset
  }

  public getSeries(series, Index) {
    let ser = []
    if (this.items.series.length != 0) {
      series.forEach((val, index) => {
        ser.push({
          xAxisIndex: Index,
          yAxisIndex: Index,
          type: "bar",
          name: val,
          animation: false,
          datasetIndex: Index,
          barCategoryGap: this.options.autoGap ? null : this.options.barCategoryGap,
          barGap: this.options.autoGap ? null : this.options.seriesInterval / 10,
          label: {
            show: this.options.showLabel,
            position: this.items.labelPosition,
            rotate: this.items.labelDirection,
            color: this.options.labelTextStyle.color,
            fontFamily: this.options.labelTextStyle.fontFamily,
            fontSize: this.options.labelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
            fontStyle: this.options.labelTextStyle.fontStyle,
            fontWeight: this.options.labelTextStyle.fontWeight,
            formatter: (data) => {
              let result = "";
              if (this.options.showLabelSeries) {
                result = result + data.seriesName + " "
              }
              if (this.options.showLabelClassification) {
                result = result + data.name + " "
              }
              if (this.options.showLabelValue) {
                let val = data.value[data.seriesIndex % this.items.series.length + 1];
                val = this.formatData(val, this.options.valueUnit, this.format)
                result = result + val
              }
              return result
            }
          },
          itemStyle: {
            opacity: this.isMock ? 0.4 : this.options.opacity / 100,
            borderRadius: this.options.borderRadius
          },
          emphasis: {
            disabled: true,
            focus: "self",
            itemStyle: {

            }
          },
          selectedMode: this.options.onlySelect ? 'single' : 'multiple'
        })
      });
    } else {
      ser.push({

        xAxisIndex: Index,
        yAxisIndex: Index,
        type: "bar",
        datasetIndex: Index,
        animation: false,
        barCategoryGap: this.options.autoGap ? null : this.options.barCategoryGap,
        label: {
          show: this.options.showLabel,
          position: this.items.labelPosition,
          rotate: this.items.labelDirection,
          color: this.options.labelTextStyle.color,
          fontFamily: this.options.labelTextStyle.fontFamily,
          fontSize: this.options.labelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
          fontStyle: this.options.labelTextStyle.fontStyle,
          fontWeight: this.options.labelTextStyle.fontWeight,
          formatter: (data) => {
            let result = ""
            if (this.options.showLabelClassification) {
              result = result + data.name + " "
            }
            if (this.options.showLabelValue) {
              let val = data.value[1];
              val = this.formatData(val, this.options.valueUnit, this.format)
              result = result + val
            }
            return result
          }
        },
        itemStyle: {
          color: this.options.Color[0],
          opacity: this.isMock ? 0.4 : this.options.opacity / 100,
          borderRadius: this.options.borderRadius
        }
      })
    }
    return ser
  }

  public getX(index) {
    return {
      show: this.items.rowSection.length == 0 ? this.options.showValue : (index % 4 == this.items.rowSection.length - 1 ? this.options.showValue : false),
      axisLine: {
        show: this.options.showValueLine
      },
      axisLabel: {
        show: this.options.showValueLabel,
        rotate: this.options.valueLabelDirection,
        color: this.options.valueLabelTextStyle.color,
        fontFamily: this.options.valueLabelTextStyle.fontFamily,
        fontSize: this.options.valueLabelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
        fontStyle: this.options.valueLabelTextStyle.fontStyle,
        fontWeight: this.options.valueLabelTextStyle.fontWeight,
      },
      axisTick: {
        show: this.options.showValueSign
      },
      splitLine: {
        show: false
      },
      min: this.options.showValueDetailed ? this.options.showValueMin : 0,
      max: !this.options.showValueDetailed ? Math.ceil(this.items.maxValue / 100) * 100 : this.options.showValueMax,
      interval: this.options.showValueDetailed ? this.options.showValueInterval : null,
      name: !this.options.showValueTitle ? null : this.items.valueDisplay,
      nameLocation: "center",
      nameTextStyle: {
        lineHeight: 50,
        color: this.options.valueLabelTextStyle.color,
        fontFamily: this.options.valueLabelTextStyle.fontFamily,
        fontSize: this.options.valueLabelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
        fontStyle: this.options.valueLabelTextStyle.fontStyle,
        fontWeight: this.options.valueLabelTextStyle.fontWeight,
      },
      alignTicks: true,
      gridIndex: index,
      inverse: true,
      type: 'value',
    }
  }

  public getY(index, showy) {
    let name = ""
    let data = this.items.data[0]
    while (data.type != "classification") {
      if (data.type == "value") {
        break
      }
      data = data.data[0]
    }
    name = !this.options.showClassificationTitle ? null : data.name
    return {
      show: showy ? this.options.showClassification : false,
      axisLine: {
        show: this.options.showClassificationLine
      },
      axisLabel: {
        show: this.options.showClassificationLabel,
        rotate: this.options.classificationLabelDirection,
        color: this.options.classificationLabelTextStyle.color,
        fontFamily: this.options.classificationLabelTextStyle.fontFamily,
        fontSize: this.options.classificationLabelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
        fontStyle: this.options.classificationLabelTextStyle.fontStyle,
        fontWeight: this.options.classificationLabelTextStyle.fontWeight,
      },
      axisTick: {
        show: this.options.showClassificationSign
      },
      name: name,
      nameLocation: "center",
      hideOverlap: this.options.hideOverlap == "hide" ? true : false,
      overflow: this.options.hideOverlap != "hide" ? this.options.hideOverlap : 'none',
      nameTextStyle: {
        lineHeight: 50,
        color: this.options.classificationLabelTextStyle.color,
        fontFamily: this.options.classificationLabelTextStyle.fontFamily,
        fontSize: this.options.classificationLabelTextStyle.fontSize == "1.0x" ? 10 : this.options.labelTextStyle.fontSize.replace("pt", ""),
        fontStyle: this.options.classificationLabelTextStyle.fontStyle,
        fontWeight: this.options.classificationLabelTextStyle.fontWeight,
      },
      gridIndex: index,
      position: 'right',
      type: 'category',
      data: this.items.classification.length == 0 ? "" : this.items.classification
    }
  }

  public getGrid(top, height, left, width) {
    return { show: this.options.showGlobal, top: top + "%", height: height + "%", left: left + "%", width: width + "%", containLabe: false }
  }

  private getColors(index, pallet, position: number) {
    let backgroundColor = ''
    const pieColor: [{
      colorStops: [] | any
    }] = pallet && pallet || [];
    if (index < pieColor.length) {
      backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
    } else {
      backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
        ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
        : pieColor[index % (pieColor.length)]
    }
    return backgroundColor
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
    let hiddenOptions: Array<string> = ['']

    if (options.dataViews[0] && options.dataViews[0].plain) {
      if (!this.options.showLegend) {
        hiddenOptions = hiddenOptions.concat(['itemGap', "legendIcon", "legendPosition", "legendVerticalPosition", "legendHorizontalPosition", "legendWidth", "legendHeight", "legendArea", "legendTextStyle"]);
      }
      if (this.options.legendPosition === 'left' || this.options.legendPosition === 'right') {
        hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
      } else {
        hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
      }
      if (this.options.legendArea === 'auto') {
        hiddenOptions = hiddenOptions.concat(['legendWidth', 'legendHeight']);
      }
  
      if (this.options.autoGap) {
        hiddenOptions = hiddenOptions.concat(['barCategoryGap', 'seriesInterval']);
      }
      if (!this.options.showLabel) {
        hiddenOptions = hiddenOptions.concat(['showLabelValue', 'valueUnit', 'showLabelSeries', 'showLabelClassification', 'labelPosition', 'labelDirection', 'labelTextStyle']);
      }
      if (options.dataViews[0].plain.profile.series.values.length == 0) {
        hiddenOptions = hiddenOptions.concat(['showLabelSeries']);
      }
      if (options.dataViews[0].plain.profile.columnSection.values.length == 0) {
        hiddenOptions = hiddenOptions.concat(['showClassificationAll']);
      }
  
      if (!this.options.showClassification) {
        hiddenOptions = hiddenOptions.concat(['showClassificationAll', 'showClassificationLine', 'showClassificationLabel', 'showClassificationSign', 'showClassificationTitle', 'classificationLabelDirection', 'classificationLabelBeyond', 'classificationLabelTextStyle']);
      }
  
      if (!this.options.showValue) {
        hiddenOptions = hiddenOptions.concat(['showValueDetailed', 'showValueMin', 'showValueMax', 'showValueInterval', 'showValueLine', 'showValueLabel', 'showValueSign', 'showValueTitle', 'valueLabelDirection', 'valueLabelTextStyle']);
      }
  
      if (!this.options.showValueDetailed) {
        hiddenOptions = hiddenOptions.concat(['showValueMin', 'showValueMax', 'showValueInterval']);
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