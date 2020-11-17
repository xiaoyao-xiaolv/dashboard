import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts';
import "echarts/map/js/china.js";
import "echarts/map/js/province/anhui.js";
import "echarts/map/js/province/aomen.js";
import "echarts/map/js/province/beijing.js";
import "echarts/map/js/province/chongqing.js";
import "echarts/map/js/province/fujian.js";
import "echarts/map/js/province/gansu.js";
import "echarts/map/js/province/guangdong.js";
import "echarts/map/js/province/guangxi.js";
import "echarts/map/js/province/guizhou.js";
import "echarts/map/js/province/hainan.js";
import "echarts/map/js/province/hebei.js";
import "echarts/map/js/province/heilongjiang.js";
import "echarts/map/js/province/henan.js";
import "echarts/map/js/province/hubei.js";
import "echarts/map/js/province/hunan.js";
import "echarts/map/js/province/jiangsu.js";
import "echarts/map/js/province/jiangxi.js";
import "echarts/map/js/province/jilin.js";
import "echarts/map/js/province/liaoning.js";
import "echarts/map/js/province/neimenggu.js";
import "echarts/map/js/province/ningxia.js";
import "echarts/map/js/province/qinghai.js";
import "echarts/map/js/province/shandong.js";
import "echarts/map/js/province/shanghai.js";
import "echarts/map/js/province/shanxi.js";
import "echarts/map/js/province/shanxi1.js";
import "echarts/map/js/province/sichuan.js";
import "echarts/map/js/province/taiwan.js";
import "echarts/map/js/province/tianjin.js";
import "echarts/map/js/province/xianggang.js";
import "echarts/map/js/province/xinjiang.js";
import "echarts/map/js/province/xizang.js";
import "echarts/map/js/province/yunnan.js";
import "echarts/map/js/province/zhejiang.js";

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private graphic: any;
  private drilldown: boolean;
  private items: any;
  private provinceName: any;
  private cityName: any;
  private valuesName: any;
  private valueFormat: any;
  private dataView: any;
  private map: any;
  static mockItems = [];
  // private hourIndex: any;
  // private fhourTime: any;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.host = host;
    this.items = [];
    this.dataView = [];
    this.graphic = [];
    this.drilldown = true;
    this.map = 'china';
    this.properties = {
    };
    // this.hourIndex = 0;
    // this.fhourTime = null;
    this.bindEvents();
    // this.auto_tooltip();
  }

  private bindEvents = () => {
    this.chart.on('click', (params) => {
      if (this.drilldown) {
        let dataIndex = params.dataIndex;
        this.map = params.name;
        this.drilldown = false;
        //传递标题

        this.render(this.items[1][dataIndex]);
      }
    })
  }
  private createBreadcrumb = (name) => {
    let pos = {
      leftPlus: 115,
      leftCur: 150,
      left: 198,
      top: 50,
    };
    let line = [
      [0, 0],
      [5, 5],
      [0, 10],
    ];
    let breadcrumb = {
      type: "group",
      id: name,
      left: 60,
      top: 20,
      children: [{
        type: "polyline",
        left: 20,
        top: 0,
        shape: {
          points: line,
        },
        style: {
          stroke: "#0ab7ff",
          key: name,
        }
      },
      {
        type: "text",
        left: 45,
        top: 0,
        style: {
          text: name,
          textAlign: "center",
          fill: "#0ab7ff",
          font: '12px "Microsoft YaHei", sans-serif',
        },
        onclick: function () {
        },
      }
      ]
    };
    pos.leftCur += pos.leftPlus;
    return breadcrumb;
  }

  private getgraphic() {
    let arr = [{
      //标题的线
      type: "group",
      left: 15,
      top: 10,
      children: [{
        type: "line",
        left: 0,
        top: -15,
        shape: {
          x1: 0,
          y1: 0,
          x2: 100,
          y2: 0,
        },
        style: {
          stroke: "rgba(147, 235, 248, 0.5)",
        },
      },
      {
        type: "line",
        left: 0,
        top: 10,
        shape: {
          x1: 0,
          y1: 0,
          x2: 100,
          y2: 0,
        },
        style: {
          stroke: "rgba(147, 235, 248, 0.5)",
        },
      },
      ],
    },
    {
      //省级标题样式
      id: "中国",
      type: "group",
      left: 20,
      top: 20,
      children: [
        {
          type: "text",
          left: 0,
          top: 0,
          style: {
            text: "中国",
            textAlign: "center",
            fill: "#0ab7ff",
            font: '12px "Microsoft YaHei", sans-serif',
          },
          onclick: function () {
          },
        }
      ]
    }]
    
  }

  private render(data: any) {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : data;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let pieces = JSON.parse(options.pieces).map(function (item: number[], i: number) {
      let j = i % options.piecesColor.length;
      item['color'] = options.piecesColor[j];
      return item;
    });
    // let plainData = isMock ? Visual.mockItems : this.dataView.plain;
    // let provinceName = isMock ? Visual.mockItems : plainData.profile.province.values[0].display;
    // let valuesName = isMock ? Visual.mockItems : plainData.profile.values.values;
    // let showtooltip = isMock ? false : true
    let mapname = this.map;

    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }
    let detailfontWeight: string;
    if (options.detailTextStyle.fontWeight == "Light") {
      detailfontWeight = options.detailTextStyle.fontWeight + "er"
    } else {
      detailfontWeight = options.detailTextStyle.fontWeight
    }
    var option = {
      // tooltip: {
      //   show: showtooltip,
      //   trigger: 'item',
      //   formatter: (params) => {
      //     let tootip = ''
      //     for (let i = 0; i < plainData.data.length; i++) {
      //       if (plainData.data[i][provinceName] === params.name) {
      //         tootip = '<span style="color:#fff;font-size:15px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + params.name + '</span>' + '<p style="height: 1px; width: 100%; background: rgba(190,190,190,.4); margin-top: 5px;" ></p>';
      //         for (let j = 0; j < valuesName.length; j++) {
      //           tootip += params.marker + " " + '<span style="color: #fff;">' + valuesName[j].display + '</span>' + " :  " + '<span style="color: #ffcf07;">' + this.formatData(plainData.data[i][valuesName[j].display], options.dataindicateUnit, options.dataindicateType) + '</span>' + "<br/>";
      //         }
      //         return tootip;
      //       }
      //     }
      //   },
      //   backgroundColor: 'rgba(0, 62, 108, 0.9)',
      //   borderColor: '#3edfd8',
      //   borderWidth: 2
      // },
      // graphic: ,
      series: [
        {
          name: 'map',
          type: 'map',
          map: mapname,
          zoom: 1.2,
          itemStyle: {
            opacity: 1,
            areaColor: options.mapColor,
            borderWidth: 1,
            borderColor: options.borderColor,
            emphasis: {
              areaColor: options.emphasisColor,
              borderWidth: 0
            }
          },
          label: {
            show: options.showlabel,
            textStyle: {
              color: options.textStyle.color,
              fontSize: options.textStyle.fontSize.substr(0, 2),
              fontWeight: fontWeight,
              fontFamily: options.textStyle.fontFamily,
              fontStyle: options.textStyle.fontStyle,
              backgroundColor: 'rgba(0,0,0,0)'
            },
          },
          data: items,
        }
      ]
    };

    this.chart.setOption(option);
    if (options.showPieces) {
      this.chart.setOption({
        visualMap: {
          show: options.showVisualMap,
          type: 'piecewise',
          right: '2%',
          bottom: '5%',
          textStyle: {
            color: options.detailTextStyle.color,
            fontSize: options.detailTextStyle.fontSize.substr(0, 2),
            fontWeight: detailfontWeight,
            fontFamily: options.detailTextStyle.fontFamily,
            fontStyle: options.detailTextStyle.fontStyle
          },
          pieces: pieces
        },
      })
    }
  }

  private formatData = (number, dataUnit, dataType) => {
    let format = number
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
    const formatUnit = units.find((item) => item.value === Number(dataUnit))
    format = (format / formatUnit.value).toFixed(2);

    if (dataType === 'number' || dataType === 'none') {
      format = this.host.formatService.format(this.valueFormat, format).toLocaleString();
    } else if (dataType === '%') {
      format = format + dataType
    } else {
      format = dataType + format
    }
    return format + formatUnit.unit
  }

  private classify = (arr: any) => {
    let obj = {}
    arr.map(v => {
      obj[v[this.provinceName]] = 0
    })
    let nameArr = Object.keys(obj)
    let result = [];
    nameArr.map(v => {
      let temp = arr.filter(_v => v == _v[this.provinceName]);
      if (temp.length) {
        result.push(temp)
      }
    })
    return result
  }

  private sum(arr: any) {
    let s = 0;
    arr.forEach(item => {
      s += item[this.valuesName[0].display];
    });
    return s;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.dataView = dataView;
    let arr = [[], []]
    if (dataView) {
      const plainData = dataView.plain;
      this.provinceName = plainData.profile.province.values[0].display;
      this.valuesName = plainData.profile.values.values;
      this.valueFormat = plainData.profile.values.options.valueFormat;
      this.cityName = plainData.profile.city.values;
      if (this.cityName.length) {
        this.classify(plainData.data).map((item) => {
          arr[0].push({
            name: item[0][this.provinceName],
            value: this.sum(item)
          });
          arr[1].push(item.map((item) => {
            return {
              provincename: item[this.provinceName],
              name: item[this.cityName[0].display],
              value: item[this.valuesName[0].display]
            };
          }))
        });
      } else {
        plainData.data.map((item) => {
          arr[0].push({
            name: item[this.provinceName],
            value: item[this.valuesName[0].display] || 0,
          })
        });
      }
      this.items = arr;
    }
    this.properties = options.properties;
    this.render(this.items[0]);
  }

  // private auto_tooltip() {
  //   this.chart.dispatchAction({
  //     type: "showTip",
  //     seriesIndex: 0,
  //     dataIndex: this.hourIndex
  //   });
  //   this.hourIndex++;
  //   if (this.hourIndex > this.items.length) {
  //     this.hourIndex = 0;
  //   }
  //   //鼠标移入停止轮播
  //   this.chart.on("mousemove", (e) => {
  //     clearTimeout(this.fhourTime)
  //     this.chart.dispatchAction({
  //       type: "showTip",
  //       seriesIndex: 0,
  //       dataIndex: e.dataIndex
  //     });
  //   })
  //   //鼠标移出恢复轮播
  //   this.chart.on("mouseout", () => {
  //     this.chart.dispatchAction({
  //       type: "showTip",
  //       seriesIndex: 0,
  //       dataIndex: this.hourIndex
  //     });
  //     this.hourIndex++;
  //     if (this.hourIndex > this.items.length) {
  //       this.hourIndex = 0;
  //     }
  //   })
  //   setTimeout(() => { this.auto_tooltip() }, 3000);
  // }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.showPieces) {
      return ['showVisualMap', 'textColor', 'pieces', 'piecesColor'];
    }
    if (!options.properties.showVisualMap) {
      return ['textColor'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}