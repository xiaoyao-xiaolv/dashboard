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
    valueDisplay: ["销售价格", "销售利润"],
    seriesDisplay: ["省份", "城市"],
    x: ["陕西", "四川", "青海", "吉林", "云南", "黑龙江"],
    x2: ["西安", "太原", "成都", "南京", "温州", "青岛", "大连", "深圳"],
    y: [74624, 59448, 65487, 98745, 56478, 74891, 65781, 54789],
    y2: [201545, 113450, 214563, 221450, 120013, 246513]
  }

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.myEcharts = echarts.init(dom);
    this.host = host;
    this.dom = dom;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectEvent();
  }

  public selectEvent() {

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);

    if (options.dataViews[0] && options.dataViews[0].plain) {
      const plain = options.dataViews[0].plain
      this.items = {
        data: [],
        classification: [],
        series: [],
        columnSection: [],
        rowSection: []
      };
      let index = 0
      let valueDisplay = options.dataViews[0].plain.profile.value.values[0].display;
      let columnSectionDisplay;
      let rowSectionDisplay;
      let classificationDisplay;
      let seriesDisplay;
      if (plain.profile.columnSection.values.length != 0) {
        columnSectionDisplay = options.dataViews[0].plain.profile.columnSection.values[0].display;
      }
      if (plain.profile.rowSection.values.length != 0) {
        rowSectionDisplay = options.dataViews[0].plain.profile.rowSection.values[0].display;
      }
      if (plain.profile.classification.values.length != 0) {
        classificationDisplay = options.dataViews[0].plain.profile.classification.values[0].display;
      }
      if (plain.profile.series.values.length != 0) {
        seriesDisplay = options.dataViews[0].plain.profile.series.values[0].display;
      }

      options.dataViews[0].plain.data.forEach((val) => {
        let data = this.items
        if (typeof (columnSectionDisplay) != "undefined") {
          if (this.items.columnSection.indexOf(val[columnSectionDisplay]) == -1) {
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
    console.log(this.items)
    this.render();
  }

  public render() {
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      dataset: [

      ],
      legend: {},
      grid: [
      ],
      xAxis: [
      ],
      yAxis: [
      ],
      series: [

      ]
    };
    if (this.items.data[0].type == "columnSection") {


    }
    if (this.items.data[0].type == "rowSection") {
      let top = (1 / this.items.rowSection.length) * 100
      let t = 0;
      this.items.data.forEach((val, index) => {
        option.grid.push({ containLabel: true, top: t + "%", height: top + "%",containLabe: false })
        option.xAxis.push({
          show: index == this.items.rowSection.length-1 ? true : false,
          splitLine: {
            show: false
          },
          alignTicks: true,
          gridIndex: index,
          inverse: true,
          type: 'value',
        })
        option.yAxis.push({
          gridIndex: index,
          position: 'right',
          type: 'category',
          data: this.items.classification
        })
        option.dataset.push(this.getSource(val.data));
        option.series = option.series.concat(this.getSeries(this.items.series, index, index, index))
        t = top + t
      });
      // this.getGrid()
    }
    if (this.items.data[0].type == "series") {
      if (this.items.classification.length != 0) {
        option.dataset.push(this.getSource(this.items.data));
        option.series = option.series.concat(this.getSeries(this.items.series, 0, 0, 0))
      } else {

      }
    }

    if (this.items.data[0].type == "classification") {
      let ser = {
        xAxisIndex: 0,
        yAxisIndex: 0,
        type: 'bar',
        data: this.items.data.map((val) => { return val.data.value })
      }
      option.series.push(ser)
    }

    console.log(option)
    this.myEcharts.setOption(option);
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
    data.forEach((val) => {
      val.data.forEach((value, index) => {
        source[index + 1].push(value.data.value)
      });
    });
    let dataset = {
      source: source
    }
    return dataset
  }

  public getSeries(series, datasetIndex, xAxisIndex, yAxisIndex) {
    let ser = []
    series.forEach((val, index) => {
      ser.push({
        show: false,
        xAxisIndex: xAxisIndex,
        yAxisIndex: yAxisIndex,
        type: "bar",
        name: val,
        datasetIndex: datasetIndex
      })
    });
    return ser
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
}