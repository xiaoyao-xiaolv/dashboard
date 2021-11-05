import '../style/visual.less';
import * as echarts from 'echarts'

export default class Visual extends WynVisual {

  private myEcharts: any;
  private selectionManager: any;
  private visualHost: any;
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
    this.visualHost = host;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
    this.selectionIdsArray = new Array<any>();
    // console.log(options)
  }

  private selectEvent() {

    this.dom.addEventListener("click", () => {
      this.selectionManager.clear();
      this.selectionIdsArray = new Array<any>();
      this.visualHost.toolTipService.hide();
      return;
    })

    this.myEcharts.on("click", (params) => {

      console.log(params);
      console.log(this.selectionIds);
      // console.log(this.selectionManager);


      params.event.event.stopPropagation();
      if (this.selectionManager.isEmpty()) {
        this.selectionIdsArray.push((this.selectionIds[(params.dataIndex * 2) + params.seriesIndex]));
        this.selectionManager.select(this.selectionIdsArray, true);
        return
      }

      if (!this.selectionManager.contains(this.selectionIds[params.dataIndex])) {
        this.selectionIdsArray.push(this.selectionIds[(params.dataIndex * 2) + params.seriesIndex]);
      } else {
        this.selectionIdsArray.splice(this.selectionIdsArray.indexOf(this.selectionIds[params.dataIndex]), 1);
        this.selectionManager.clear(this.selectionIds[params.dataIndex])
      }
      if (this.selectionIdsArray.length == this.selectionIds.length) {
        this.selectionManager.clear();
        this.selectionIdsArray = new Array<any>();
        this.visualHost.toolTipService.hide();
        return;
      }
      this.selectionManager.select(this.selectionIdsArray, true);

    })

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.properties = options;
    // console.log(options);
    this.getfunnelPairData();
    this.render();
  }

  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
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
  public getfunnelPairData() {

    //是否是对比图
    this.isDoubleFunnel = (this.properties.dataViews[0].plain.profile.reduced_value.values.length == 0) ? false : true;
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
      dataView.data.forEach((dataPoint) => {
        //数据共享
        const actual_selectionId = this.visualHost.selectionService.createSelectionId();
        actual_selectionId.withDimension(dataView.profile.actual_value.values[0], dataPoint);
        actual_selectionId.withDimension(dataView.profile.series.values[0], dataPoint);
        this.selectionIds.push(actual_selectionId);

        allData = {
          series: dataPoint[seriesDisplay],
          actual_value: Number(dataPoint[actualDisplay]),
          reduced_value: Number,
        }

        if (this.isDoubleFunnel) {
          allData.reduced_value = dataPoint[reducedDisplay];
          const rerduced_selectionId = this.visualHost.selectionService.createSelectionId();
          rerduced_selectionId.withDimension(dataView.profile.series.values[0], dataPoint);
          rerduced_selectionId.withDimension(dataView.profile.reduced_value.values[0], dataPoint);
          this.selectionIds.push(rerduced_selectionId);
        }
        this.funnelData.push(allData)

      })
      //漏斗图排序
      this.funnelData.sort((a, b) => (b.actual_value - a.actual_value));
      for (let i = 0; i < this.selectionIds.length-2; i = +2) {
        if(this.selectionIds[i] < this.selectionIds[i+2]){
          let a = this.selectionIds[i];
          let b = this.selectionIds[i+1]
          this.selectionIds[i] = this.selectionIds[i+2];
          this.selectionIds[i+1] = this.selectionIds[i+3];
          this.selectionIds[i+2] = a;
          this.selectionIds[i+3] = b;
        }
      }
    };
  }

  //单个漏斗图显示options
  getOptionForOnce() {

    // console.log(this.funnelData)

    var colors = [];

    var showData = [];
    //渐变颜色设置
    var showData2 = [];
    var ySize = 10;
    let rgb = [255, 0, 255]
    this.funnelData.forEach((data) => {


      let colorRadom = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2];
      var myData1 = {
        name: data.series,
        value: data.actual_value,
        x: 400,
        y: ySize,
        itemStyle: {
          color: colorRadom
        }
      };
      ySize = ySize + 10;
      var myData2 = {
        name: data.series,
        value: data.actual_value,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
              offset: 0,
              color: colorRadom + ",0.2)"
            }, {
              offset: 1,
              color: colorRadom + ",0.7)"
            }]),
            borderWidth: 0,
            opacity: 1
          }
        },
      };
      showData.push(myData1);
      showData2.push(myData2);

      //颜色渐变
      if (rgb[0] == 0) {
        rgb[1] = rgb[1] - 100;
        rgb[2] = rgb[1] - 150;
        if (rgb[2] < 0) {
          rgb[2] = 255;
        }
        if (rgb[1] < 0) {
          rgb[0] = 255;
          rgb[1] = 0;
          rgb[2] = 255;
        }
      }
      if (rgb[1] == 0) {
        rgb[0] = rgb[0] - 100;
        rgb[2] = rgb[2] - 150;
        if (rgb[2] < 0) {
          rgb[2] = 255;
        }
        if (rgb[0] < 0) {
          rgb[0] = 255;
          rgb[1] = 255;
          rgb[2] = 0;
        }
      }
      if (rgb[2] == 0) {
        rgb[0] = rgb[0] - 100;
        rgb[1] = rgb[1] - 150;
        if (rgb[1] < 0) {
          rgb[1] = 255;
        }
        if (rgb[0] < 0) {
          rgb[0] = 0;
          rgb[1] = 255;
          rgb[2] = 255;
        }
      }
    })

    // console.log(showData)

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
    // console.log(links) 


    var option = {
      legend: {
        data: this.funnelData.forEach((data) => { return data.series }),
        textStyle: {
          color: '#fff',
          fontSize: 16
        }
      },
      grid: {
        top: '-10',
        left: "2%",
        right: 20,
        bottom: '0'
      },
      xAxis: {
        show: false
      },
      yAxis: [{
        show: false,
        boundaryGap: false,
        type: "category",
        data: ["转化率", "转化率", "转化率", "转化率", "转化率", "转化率"],
      }],

      series: [

        //转换率计算
        {
          top: '10%',
          bottom: 0,
          type: 'funnel',
          gap: 10,
          minSize: (this.properties.properties.funnelStyle == "样式1") ? "0%" : this.properties.properties.funnelStyle.minSize,
          maxSize: (this.properties.properties.funnelStyle == "样式1") ? "100%" : this.properties.properties.funnelStyle.maxSize,
          left: '25%',
          width: '60%',
          right: "0",
          z: 2,
          //不触发响应事件
          silent: true,
          itemStyle: {
            opacity: 1
          },
          label: {
            overflow: 'break',
            borderColor: '#000',
            position: 'right',
            formatter: ['{d|{d}%}'].join('\n'),
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
        // 数值显示
        {
          // color: colors,
          //不触发响应事件
          silent: false,
          top: '10%',
          bottom: 0,
          name: 'Funnel',
          type: 'funnel',
          left: '20%',
          right: '0%',
          width: '60%',
          minSize: (this.properties.properties.funnelStyle == "样式1") ? "0%" : this.properties.properties.funnelStyle.minSize,
          maxSize: (this.properties.properties.funnelStyle == "样式1") ? "100%" : this.properties.properties.funnelStyle.maxSize,
          sort: 'descending',
          gap: 10,
          label: {
            show: true,
            position: 'inside'
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
          data: showData
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

    var option = (this.properties.properties.funnelStyle == '样式1') ? this.getStyleOption1() : this.getStyleOption2();
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
      xAxis: {
        show: false
      },
      yAxis: [{
        show: false,
        boundaryGap: false,
        type: "category",
      }],
      grid: {
        top: '-10',
        left: "2%",
        right: 20,
        bottom: '0'
      },

      series: [

        {     //实际数值
          name: this.properties.dataViews[0].plain.profile.actual_value.values[0].display,
          // color: colors,
          top: '10%',
          bottom: 0,
          type: 'funnel',
          // left: '20%',
          // right: '0',
          width: '40%',
          x: '10%',
          funnelAlign: 'right',
          minSize: "10%",
          maxSize: '100%',
          sort: 'descending',
          // gap: 10,
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
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: this.funnelData.map((data) => { return Object.assign({}, { name: data.series, value: data.actual_value }) })
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
          minSize: "10%",
          maxSize: '100%',
          sort: 'descending',
          // gap: 10,
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
          data: this.funnelData.map((data => { return Object.assign({}, { name: data.series, value: data.reduced_value }) }))
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
          data: this.funnelData.map((data) => { return { name: data.series, value: data.reduced_value } })
        },
        //实际值
        {
          name: this.properties.dataViews[0].plain.profile.actual_value.values[0].display,
          type: 'funnel',
          left: '10%',
          width: '80%',
          maxSize: '80%',
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
          data: this.funnelData.map((data) => { return { name: data.series, value: data.actual_value, com: (Math.round((data.actual_value / data.reduced_value) * 100 * 100) / 100).toFixed(2) } }),
          // Ensure outer shape will not be over inner shape when hover.
          z: 2
        }
      ]
    };
    return option;
  }
}


