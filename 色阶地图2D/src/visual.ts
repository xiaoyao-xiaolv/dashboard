import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts';
import china from "echarts/map/json/china.json";
import namedata from './mapname.json';
import { myTooltipC } from './myTooltip.js';
import $ from 'jquery';
(window as any).jQuery = $;

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private drilldown: boolean;
  private timeFn = null;
  private items: any;
  private provincedata: any;
  private provincegraphic: any;
  private graphic: any;
  private sid: any;
  private pieces: any;
  private data: any;
  static mockItems = [];
  private selection: any;
  private selectionManager: any;
  private isTooltipModelShown: boolean;
  private provinceName: any;
  private cityName: any;
  private valuesName: any;
  private map: any;
  private shadowDiv: any;
  private tooltipFields: any;
  private myTooltip: any;
  private config: any;
  private valueFormat: any;
  private flag: any;
  private linelen: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
    this.container.firstElementChild.setAttribute('style', 'height : 0');
    this.host = host;
    this.items = [];
    this.data = [];
    this.graphic = [];
    this.drilldown = false;
    this.properties = {
    };
    this.isTooltipModelShown = false;
    this.selection = [];
    this.selectionManager = host.selectionService.createSelectionManager();
    this.bindEvents();
    this.config = {
      priority: 'top',        // 默认在点上方OR下方（top/bottom）
      partition: 2,         // 左右分割比例
      lineColor: 'rgba(253, 129, 91, 0.8)',      // 引导线颜色
      offset: [5, 5],
      L1: {
        time: 0.2,          // L1动画时长(单位s)
        long: 40            // L1长度
      },
      L2: {
        time: 0.2,
        long: 40
      }
    }
    this.myTooltip = new myTooltipC(dom, this.config);
    this.autoPlayTooltip();
  }
  public autoPlayTooltip() {
    let timer = null;
    const autoPlay = () => {
      let index = 0;
      if (timer) clearInterval(timer);
      timer = setInterval(() => {
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: 0,
          dataIndex: index
        });
        index++;
        if (this.items.length && index >= this.items[0].length) {
          index = 0;
        }
      }, 2000);
    }

    this.chart.on('mousemove', (e) => {
      if (timer) clearInterval(timer);
      this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: e.dataIndex
      });
    })

    this.chart.on('mouseout', (e) => {
      autoPlay();
    })

    autoPlay();
  }

  private dispatch = (type, payload) => this.chart.dispatchAction({ type, ...payload });

  private bindEvents = () => {
    this.chart.getZr().on('click', (e) => {
      if (!e.target) {
        this.selection.forEach(item => this.dispatch('downplay', item));
        this.selection = [];
        this.selectionManager.clear();
        this.selectionManager.select(this.sid, true);
        return;
      }
    })
    this.chart.on('click', (params) => {
      clearTimeout(this.timeFn);
      this.timeFn = setTimeout(() => {
        if (!params.data) {
          this.selection.forEach(item => this.dispatch('downplay', item));
          this.selection = [];
          this.selectionManager.clear();
          if (!this.drilldown) {
            this.selectionManager.select(this.sid, true);
          }
          return;
        } else {
          let dataIndex = params.dataIndex;
          let sid = this.items[1][dataIndex];
          let selectedInfo = {
            seriesIndex: 0,
            dataIndex: dataIndex,
          };
          if (this.selectionManager.contains(sid)) {
            this.dispatch('downplay', selectedInfo);
            this.selectionManager.clear(sid);
            return;
          }
          this.dispatch('highlight', selectedInfo);
          this.selectionManager.select(sid, true);
          this.selection.push(selectedInfo);
        }
      }, 300);
    })
    this.chart.on('dblclick', (params) => {
      clearTimeout(this.timeFn);
      if (!params.data) {
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
      if (this.drilldown) {
        let dataIndex = params.dataIndex;
        this.sid = this.items[1][dataIndex];
        this.selectionManager.select(this.sid, true);
        this.getGeoJson(params.name);
        switch (params.data.drilldownIndex) {
          case 1:
            this.items = this.data[1][dataIndex];
            this.provincedata = this.items;
            this.provincegraphic = this.graphic;
            if (this.flag) {
              this.getPieces(this.properties.pieces);
              this.graphic.push(this.createBreadcrumb(params.name, this.linelen, 2));
            } else {
              this.getPieces(this.properties.citypieces);
              this.graphic.push(this.createBreadcrumb(params.name, this.linelen, 1));
            }
            this.linelen += params.name.length * 20;
            this.graphic[0].children[0].shape.x2 += params.name.length * 20;
            this.graphic[0].children[1].shape.x2 += params.name.length * 20;
            break;
          case 2:
            this.items = this.data[2].find(item => item[2] == params.name);
            this.graphic.push(this.createBreadcrumb(params.name, this.linelen, 2))
            this.graphic[0].children[0].shape.x2 += params.name.length * 20;
            this.graphic[0].children[1].shape.x2 += params.name.length * 20;
            this.getPieces(this.properties.pieces);
            this.drilldown = false;
            break;
        }
        this.render();
      }
    })
  }

  private getMapId(name: any) {

    return namedata.find(item => item.city == name).cityid.toString();
  }

  private getGeoJson(name: any) {
    let mapJson;
    if (name == "中国") {
      mapJson = china;
      this.map = 'china'
    } else {
      let id = this.getMapId(name);
      let href = window.location.href;
      let port = window.location.port;
      let url = href.substring(0, href.indexOf(port) + port.length + 1) + "data/" + id + ".json"
      $.ajaxSettings.async = false;
      $.getJSON(url, function (geoJson) {
        mapJson = geoJson
      })
      this.map = 'area'
    }
    echarts.registerMap(this.map, mapJson);
  }

  private createBreadcrumb = (name: any, left: any, index: any) => {
    let line = [
      [0, 0],
      [5, 5],
      [0, 10],
    ];
    let breadcrumb = {
      type: "group",
      id: name,
      left: left,
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
        onclick: () => {
          switch (index) {
            case 1:
              this.items = this.provincedata;
              this.provincegraphic.pop();
              this.graphic = this.provincegraphic;
              this.graphic[0].children[0].shape.x2 -= name.length * 20;
              this.graphic[0].children[1].shape.x2 -= name.length * 20;
              this.getGeoJson(name);
              this.getPieces(this.properties.citypieces);
              this.drilldown = true;
              this.render();
              break;
            case 2:
              this.render();
              break;
          }
        },
      }
      ]
    };
    return breadcrumb;
  }

  private getgraphic(mapName: any) {
    let namelen = mapName.length * 20;
    this.linelen = namelen;
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
          x2: namelen,
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
          x2: namelen,
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
      id: mapName,
      type: "group",
      left: 20,
      top: 20,
      children: [
        {
          type: "text",
          left: 0,
          top: 0,
          style: {
            text: mapName,
            textAlign: "center",
            fill: "#0ab7ff",
            font: '12px "Microsoft YaHei", sans-serif',
          },
          onclick: () => {
            this.getGeoJson(mapName);
            this.drilldown = true;
            this.items = this.data[0];
            this.selection = [];
            this.selectionManager.clear();
            this.getgraphic(mapName);
            if (this.flag) {
              this.getPieces(this.properties.citypieces);
            } else {
              this.getPieces(this.properties.provincepieces);
            }
            this.sid = [];
            this.render();
          },
        }
      ]
    }]
    this.graphic = arr;
  }

  private classifyMapData = (originMapData: any, level: any) => {
    let mapNames = [];
    originMapData.forEach((data) => {
      if (mapNames.indexOf(data[level]) < 0) {
        mapNames.push(data[level]);
      }
    })

    let classifiedMapData = [];
    mapNames.map(mapName => {
      let mapData = originMapData.filter(data => mapName === data[level]);
      if (mapData.length) {
        classifiedMapData.push(mapData);
      }
    })
    return classifiedMapData;
  }

  private sum(arr: any, filed) {
    let s = 0;
    arr.forEach(item => {
      s += item[filed];
    });
    return s;
  }

  private getSumData(data: any, dimension: any, name: any, drilldown: number) {
    let arr = [[], []];
    data.map((item) => {
      let dataObj = {
        name: item[0][name],
        value: this.sum(item, this.valuesName) || 0,
        drilldownIndex: drilldown
      }

      let tooltips;
      if (this.tooltipFields.length) {
        tooltips = this.tooltipFields.map((filed) => {
          if (filed.dataType === 'number') {
            return {
              filed: filed.display,
              value: this.sum(item, filed.display)
            }
          } else {
            return {
              filed: filed.display,
              value: item[0][filed.display]
            }
          }
        });
        dataObj['tooltipFields'] = tooltips;
      }
      arr[0].push(dataObj);
      const getSelectionId = (item) => {
        const selectionId = this.host.selectionService.createSelectionId();
        selectionId.withDimension(dimension, item[0]);
        return selectionId;
      }
      arr[1].push(getSelectionId(item));
    });
    return arr;
  }

  private getMapData(data: any, dimension: any, name: any) {
    let arr = [[], [], []];
    data.map((item) => {
      let dataObj = {
        name: item[name],
        value: item[this.valuesName] || 0,
      }
      arr[0].push(dataObj);
      let tooltips;
      if (this.tooltipFields.length) {
        tooltips = this.tooltipFields.map((filed) => {
          return {
            filed: filed.display,
            value: item[filed.display]
          }
        });
        dataObj['tooltipFields'] = tooltips;
      }
      const getSelectionId = (item) => {
        const selectionId = this.host.selectionService.createSelectionId();
        selectionId.withDimension(dimension, item);
        return selectionId;
      }
      arr[1].push(getSelectionId(item));
    });
    arr[2] = data[0][this.cityName[0].display]
    return arr;
  }
  private getPieces(param) {
    this.pieces = JSON.parse(param).map((item: number[], i: number) => {
      let j = i % this.properties.piecesColor.length;
      item['color'] = this.properties.piecesColor[j];
      return item;
    });
  }


  private render() {
    let myTooltip = this.myTooltip;
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items[0];
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let max = Math.max.apply(Math, items.map(function (o) { return o.value }));
    let min = Math.min.apply(Math, items.map(function (o) { return o.value }));
    min = min > 0 ? 0 : min;
    myTooltip.config['text'] = {
      time: 0.3,
      font: `${options.tooltipTextStyle.fontStyle} ${options.tooltipTextStyle.fontWeight} ${options.tooltipTextStyle.fontSize} ${options.tooltipTextStyle.fontFamily}`,
      color: options.tooltipTextStyle.color,
      padding: [options.tooltipPadding.top, options.tooltipPadding.right, options.tooltipPadding.bottom, options.tooltipPadding.left],
      width: options.tooltipWidth,
      height: options.tooltipHeight,
      lineHeight: 24,
      backgroundColor: options.tooltipBackgroundColor,
      borderColor: options.tooltipBorderColor,
      borderWidth: 1,
      angle: {
        width: 2,
        long: 15
      }
    }
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
    let left;
    let right;
    if (options.position == "left") {
      left = '2%'
      right = 'auto'
    } else {
      left = 'auto'
      right = '2%'
    }
    let tooltipTemplate = (data) => {
      let locationStr = `${data.name}\n`;
      let tooltipStr = '';
      let valueStr = `${this.valuesName} : ${this.formatData(data.value, options.dataindicateUnit, options.dataindicateType)}\n`;
      if (data.tooltipFields) {
        data.tooltipFields.forEach((tooltip) => {
          tooltipStr = tooltipStr + `${tooltip.filed} : ${tooltip.value}\n`;
        })
      }
      return `${locationStr}${valueStr}${tooltipStr}`;
    }

    var option = {
      tooltip: {
        show: options.showTooltip,
        trigger: 'item',
        backgroundColor: 'transparent',
        position(pos) {
          return myTooltip.getPosOrSize('pos', pos);
        },
        formatter(params: any) {
          if (params.data) {
            let text = tooltipTemplate(params.data);
            return myTooltip.getTooltipDom(text);
          }

        },
      },
      graphic: this.graphic,
      series: [
        {
          name: 'map',
          type: 'map',
          map: this.map,
          zoom: 0.6,
          roam: options.roam,
          itemStyle: {
            opacity: 1,
            areaColor: "#0a4880",
            borderWidth: 1,
            borderColor: options.borderColor,
            emphasis: {
              areaColor: options.emphasisColor,
              borderWidth: 0
            }
          },
          label: {
            show: options.showData || options.showposition,
            formatter: (params) => {
              if (!Number.isNaN(params.value)) {
                let name = options.showposition ? params.name + '\n\n' : '';
                let value = options.showData ? this.formatData(params.value, options.dataindicateUnit, options.dataindicateType) : '';
                return name + value;
              } else {
                let name = options.showposition ? params.name + '\n\n' : '';
                return name;
              }
            },
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
          animationDelayUpdate: 300
        }
      ]
    };
    this.chart.setOption(option);
    this.zoomAnimation();
    if (options.showPieces) {
      this.chart.setOption({
        visualMap: {
          show: options.showVisualMap,
          type: 'piecewise',
          left: left,
          right: right,
          bottom: '5%',
          textStyle: {
            color: options.detailTextStyle.color,
            fontSize: options.detailTextStyle.fontSize.substr(0, 2),
            fontWeight: detailfontWeight,
            fontFamily: options.detailTextStyle.fontFamily,
            fontStyle: options.detailTextStyle.fontStyle
          },
          pieces: this.pieces
        },
      })
    } else {
      this.chart.setOption({
        visualMap: {
          show: options.showVisualMap,
          min: min,
          max: max,
          type: 'continuous',
          left: left,
          right: right,
          bottom: '5%',
          text: ['高', '低'],
          calculable: true,
          inRange: {
            color: options.piecesColor
          },
          textStyle: {
            color: options.detailTextStyle.color,
            fontSize: options.detailTextStyle.fontSize.substr(0, 2),
            fontWeight: detailfontWeight,
            fontFamily: options.detailTextStyle.fontFamily,
            fontStyle: options.detailTextStyle.fontStyle
          }
        },
      })
    }
  }

  public zoomAnimation = () => {
    var count = null;
    var zoom = (per) => {
      if (!count) count = per;
      count = count + per;
      this.chart.setOption({
        series: {
          zoom: count
        }
      });
      if (count < 1.2) window.requestAnimationFrame(() => {
        zoom(0.2);
      });
    };
    window.requestAnimationFrame(() => {
      zoom(0.2);
    });
  }

  public formatData = (number, dataUnit, dataType) => {
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
    format = (format / formatUnit.value).toFixed(2)

    if (dataType === 'number' || dataType === 'none' || dataType === '') {
      format = this.host.formatService.format(this.valueFormat, format).toLocaleString();
    } else if (dataType === '%') {
      format = format + dataType
    } else {
      format = dataType + format
    }
    return format + formatUnit.unit
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    let data = [[], [], []];
    this.tooltipFields = [];
    if (dataView) {
      const plainData = dataView.plain;
      this.provinceName = plainData.profile.province.values[0].display;
      this.cityName = plainData.profile.city.values;
      this.valuesName = plainData.profile.values.values[0].display;
      this.valueFormat = plainData.profile.values.options.valueFormat;
      let toolTipValues = dataView.plain.profile.tooltipFields.values;
      if (toolTipValues.length) {
        this.tooltipFields = toolTipValues.map((value) => {
          return {
            display: value.display,
            dataType: value.dataType
          }
        });
      }
      data[0] = this.getSumData(this.classifyMapData(plainData.data, this.provinceName), plainData.profile.province.values[0], this.provinceName, 1);
      if (this.cityName.length) {
        this.drilldown = true;
        this.classifyMapData(plainData.data, this.provinceName).map((item) => {
          if (this.cityName.length > 1) {
            data[1].push(this.getSumData(this.classifyMapData(item, this.cityName[0].display), this.cityName[0], this.cityName[0].display, 2));
            this.classifyMapData(item, this.cityName[0].display).map((item) => {
              data[2].push(this.getMapData(item, this.cityName[1], this.cityName[1].display));
            })
          } else {
            data[1].push(this.getMapData(item, this.cityName[0], this.cityName[0].display));
          }
        })
      }
    }
    this.data = data;
    this.items = data[0];
    this.properties = options.properties;
    this.flag = this.properties.mapName == "中国" ? false : true;
    if (this.flag) {
      this.getPieces(this.properties.citypieces);
    } else {
      this.getPieces(this.properties.provincepieces);
    }
    this.getgraphic(this.properties.mapName);
    this.getGeoJson(this.properties.mapName);
    this.render();
  }

  public onDestroy() {
  }

  public onResize() {
    this.chart.resize();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.showPieces) {
      return ['provincepieces', 'citypieces', 'pieces'];
    }

    if (!options.properties.showTooltip) {
      return ['tooltipBackgroundColor', 'tooltipWidth', 'tooltipHeight', 'tooltipBorderColor', 'tooltipPadding', 'tooltipTextStyle'];
    }

    if (!options.properties.showLabel) {
      if (options.properties.showData) {
        options.properties.showData = false;
      }
      if (options.properties.showposition) {
        options.properties.showposition = false;
      }
      return ['showData', 'showposition', 'textStyle', 'dataindicateType', 'dataindicateUnit'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}