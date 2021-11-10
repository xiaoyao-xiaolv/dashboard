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
      // console.log(params);

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

    // console.log(options);
    this.getFunnelPairData();
    this.onResize()
  }

  public onDestroy(): void {

  }

  //属性隐藏设置
  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    this.properties = options;
    //是否是对比图
    this.isDoubleFunnel = (this.properties.dataViews[0].plain.profile.reduced_value.values.length == 0) ? false : true;

    let hiddenOptions: Array<string> = [''];
    if (options.properties.funnelStyle === 'style2' || this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['maxSize', 'minSize']);
    }
    if (!this.isDoubleFunnel) {
      hiddenOptions = hiddenOptions.concat(['actualMaxSize', 'actualMinSize', 'reducedMaxSize', 'reducedMinSize']);
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
    let option = null;
    if (this.isDoubleFunnel) {
      option = this.getOptionForDouble()
    } else {
      option = this.getOptionForOnce();
    }
    this.myEcharts.setOption(option);
  }

  //获取数据集所有数据，并保存在funnelDate
  public getFunnelPairData() {

    // console.log(this.isDoubleFunnel)
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

        if (this.isDoubleFunnel) {
          selectionId.withDimension(dataView.profile.reduced_value.values[0], dataPoint);
          allData.reduced_value = dataPoint[reducedDisplay];
        }
        this.selectionIds.push(selectionId);
        this.funnelData.push(allData);
      })
    };
  }

  //单个漏斗图显示options
  getOptionForOnce() {
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
    var ySize = 10;
    let rgb = [255, 0, 255]
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
        x: 400,
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
          curveness: -(showData.length + 2 - i)
        }
      };
      links.push(data);
    }


    var option = {
      legend: {
        data: this.funnelData.forEach((data) => { return data.series }),
        textStyle: {
          color: '#fff',
          fontSize: 10
        }
      },

      series: [

        // 数值显示
        {
          // color: colors,
          z: 2,
          //不触发响应事件
          silent: false,
          //开启动画
          animation: false,
          //联动亮度
          legendHoverLink: false,
          top: '10%',
          bottom: 0,
          type: 'funnel',
          left: '20%',
          right: '0%',
          width: '60%',
          minSize: styleValue.minSize,
          maxSize: styleValue.maxSize,
          // sort: 'descending',
          gap: this.properties.properties.gapSize,
          label: {
            show: true,
            position: 'inside'
          },
          emphasis: {
            focus: 'series'
          },
          data: showData
        },

        //转换率计算
        {
          top: '10%',
          bottom: 0,
          type: 'funnel',
          gap: this.properties.properties.gapSize,
          minSize: styleValue.minSize,
          maxSize: styleValue.maxSize,
          left: '25%',
          width: '60%',
          right: "0",
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
                color: '#fff',
                fontSize: '15',
                lineHeight: '30'
              }
            }
          },
          data: showData2
        },

        //占上一位的百分比
        {
          z: 1,
          top: '10%',
          bottom: '0%',
          // height: 400,
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
              rotate: 40,
              position: 'middle',
              backgroundColor: '#e4f5da',
              borderRadius: 4,
              color: '#333',
              verticalAlign: 'middle',
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
                  color: '#333',
                  position: 'right',
                  fontSize: 14,
                  lineHeight: 20,
                  padding: [0, 0, 5, 0],
                }
              }
            }
          },
          data: showData,
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
    // console.log(this.funnelData)
    var actual_links = [];
    var reduced_links = [];
    let ySize = 0;
    for (var i = 0; i < this.funnelData.length - 1; i++) {
      var data1 = {
        source: this.funnelData[i].series,
        target: this.funnelData[i + 1].series,
        value: (Math.round((this.funnelData[i + 1].actual_value / this.funnelData[i].actual_value) * 100 * 100) / 100).toFixed(2),
        lineStyle: {
          curveness: -(this.funnelData.length + 3 - i - 0.5)
        }
      };
      actual_links.push(data1);
      var data2 = {
        source: this.funnelData[i].series,
        target: this.funnelData[i + 1].series,
        value: (Math.round((this.funnelData[i + 1].reduced_value / this.funnelData[i].reduced_value) * 100 * 100) / 100).toFixed(2),
        lineStyle: {
          curveness: (this.funnelData.length + 3 - i - 0.5)
        }
      };
      reduced_links.push(data2);
    }

    var option = {

      legend: {
        data: this.funnelData.map((data) => { return data.series }),
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      tooltip: {
        formatter: "{a} <br/>{b} : {c}",
      },

      series: [

        {     //实际数值
          name: this.properties.dataViews[0].plain.profile.actual_value.values[0].display,
          //相应鼠标时间
          silent: false,
          // color: colors,
          top: '10%',
          bottom: 0,
          type: 'funnel',
          // left: '20%',
          // right: '0',
          width: '40%',
          x: '10%',
          funnelAlign: 'right',
          maxSize: this.properties.properties.actualMaxSize + "%",
          minSize: this.properties.properties.actualMinSize + "%",
          sort: 'descending',
          gap: this.properties.properties.gapSize,
          label: {
            show: true,
            formatter: '{b}:{c|{c}}\n{d|{d}}%',
            position: 'insideLeft',
            rich: {
              c: {
                fontSize: 18,
              },
              d: {
                fontSize: 18,
              }
            }
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
            borderWidth: 1
          },
          // emphasis: {
          //   label: {
          //     fontSize: 20
          //   }
          // },
          data: this.funnelData.map((data, index) => {
            return Object.assign({}, {
              name: data.series,
              value: data.actual_value,
              itemStyle: {
                color: this.getColors(index, 1)
              }
            })
          })
        },

        {     //对比数值
          name: this.properties.dataViews[0].plain.profile.reduced_value.values[0].display,
          // color: colors,
          top: '10%',
          bottom: 0,
          type: 'funnel',
          // left: '20%',
          // right: '0',
          x: '50%',
          width: '40%',
          funnelAlign: 'left',
          maxSize: this.properties.properties.reducedMaxSize + "%",
          minSize: this.properties.properties.reducedMinSize + "%",
          sort: 'descending',
          gap: this.properties.properties.gapSize,
          label: {
            show: true,
            formatter: '{b}:{c|{c}}\n{d|{d}}%',
            position: 'insideRight',
            rich: {
              c: {
                fontSize: 18,
              },
              d: {
                fontSize: 18,
              }
            }
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
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: this.funnelData.map((data,index) => {
            return Object.assign({}, {
              name: data.series,
              value: data.reduced_value,
              itemStyle: {
                color: this.getColors(index, 1)
              }
            })
          })
        },

        //实际数占上一位的百分比
        {
          x: '35%',
          z: 1,
          top: '10%',
          bottom: '0%',
          // height: 400,
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
              rotate: 45,
              position: 'middle',
              backgroundColor: '#e4f5da',
              borderRadius: 4,
              color: '#333',
              verticalAlign: 'bottom',
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
                  color: '#333',
                  position: 'right',
                  fontSize: 14,
                  lineHeight: 20,
                  padding: [0, 0, 5, 0],
                }
              }
            }
          },
          data: this.funnelData.map((data) => { return Object.assign({}, { name: data.series, x: 400, y: ySize++ }) }),
          links: actual_links

        },
        //对比值占上一位的百分比
        {
          x: '48%',
          z: 1,
          top: '10%',
          bottom: '0%',
          // height: 400,
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
              rotate: -45,
              position: 'middle',
              backgroundColor: '#e4f5da',
              borderRadius: 4,
              color: '#333',
              verticalAlign: 'bottom',
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
                  color: '#333',
                  position: 'right',
                  fontSize: 14,
                  lineHeight: 20,
                  padding: [0, 0, 5, 0],
                }
              }
            }
          },
          data: this.funnelData.map((data) => { return Object.assign({}, { name: data.series, x: 400, y: ySize++ }) }),
          links: reduced_links,

        }

      ]
    }
    return option;
  }

  //对比图样式2
  getStyleOption2() {
    //console.log( this.funnelData.map((data)=>{ return {name: data.series, value: data.actual_value, com: (Math.round((data.actual_value / data.reduced_value) * 100 * 100) / 100).toFixed(2)}}))

    var option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}%'
      },
      legend: {
        data: this.funnelData.map((data) => { return data.series }),
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },

      series: [
        //对比值
        {
          z: 1,
          name: this.properties.dataViews[0].plain.profile.reduced_value.values[0].display,
          type: 'funnel',
          left: '10%',
          width: '80%',
          maxSize: this.properties.properties.reducedMaxSize + "%",
          minSize: this.properties.properties.reducedMinSize + "%",
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          itemStyle: {
            opacity: 0.7
          },
          emphasis: {
            label: {
              position: 'inside',
              formatter: '{b}Expected: {c}%'
            }
          },
          data: this.funnelData.map((data,index) => { return { name: data.series, value: data.reduced_value ,itemStyle: {color: this.getColors(index, 1)}} })
        },
        //实际值
        {
          name: this.properties.dataViews[0].plain.profile.actual_value.values[0].display,
          type: 'funnel',
          left: '10%',
          width: '80%',
          maxSize: this.properties.properties.actualMaxSize + "%",
          minSize: this.properties.properties.actualMinSize + "%",
          label: {
            position: 'inside',
            formatter: function (d) {
              return d.data.name + ':' + d.data.com + '%'
            },
            color: '#fff',
          },
          itemStyle: {
            opacity: 1,
            borderColor: '#fff',
            borderWidth: 2
          },
          data: this.funnelData.map((data,index) => { return { name: data.series, value: data.actual_value, com: (Math.round((data.actual_value / data.reduced_value) * 100 * 100) / 100).toFixed(2),itemStyle: {color: this.getColors(index, 1)} } }),
          // Ensure outer shape will not be over inner shape when hover.
          z: 2
        }
      ]
    };
    return option;
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


