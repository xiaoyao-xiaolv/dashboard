import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts';
import namedata from './china.json';
import $ from 'jquery';
(window as any).jQuery = $;
$.ajaxSettings.async = false;

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private drilldown: boolean;
  private timeFn = null;
  private items: any;
  private graphic: any;
  private sid: any;
  private data: any;
  static mockItems = [];
  private selection: any;
  private selectionManager: any;
  private isTooltipModelShown: boolean;
  private provinceName: any;
  private cityName: any;
  private valuesName: any;


  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.host = host;
    this.items = [];
    this.data = [];
    this.graphic = [];
    this.drilldown = false;
    this.getGeoJson("中国");
    this.properties = {
    };
    this.isTooltipModelShown = false;
    this.selection = [];
    this.selectionManager = host.selectionService.createSelectionManager();
    this.bindEvents();

  }

  private dispatch = (type, payload) => this.chart.dispatchAction({ type, ...payload });

  private bindEvents = () => {
    this.chart.getZr().on('click', (e) => {
      if (!e.target) {
        this.hideTooltip();
        this.selection.forEach(item => this.dispatch('downplay', item));
        this.selection = [];
        this.selectionManager.clear();
        if (!this.drilldown) {
          this.selectionManager.select(this.sid, true);
        }
        return;
      }
    })
    this.chart.on('click', (params) => {
      clearTimeout(this.timeFn);
      this.timeFn = setTimeout(() => {
        if (!params.data) {
          this.hideTooltip();
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
            this.hideTooltip();
            this.dispatch('downplay', selectedInfo);
            this.selectionManager.clear(sid);
            return;
          }
          this.showTooltip(params);
          this.dispatch('highlight', selectedInfo);
          this.selectionManager.select(sid, true);
          this.selection.push(selectedInfo);
        }
      }, 300);
    })
    this.chart.on('dblclick', (params) => {
      clearTimeout(this.timeFn);
      if (!params.data) {
        this.hideTooltip();
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
      if (this.drilldown) {
        let dataIndex = params.dataIndex;
        this.sid = this.items[1][dataIndex];
        this.selectionManager.select(this.sid, true);
        this.getGeoJson(params.name);
        console.log(params.data.drilldownIndex)
        switch (params.data.drilldownIndex) {
          case 1:
            this.items = this.data[1][dataIndex];
            break;
          case 2:
            this.items = this.data[2].find(item => item[3] == params.name);
            this.drilldown = false;
            break;
        }

        this.graphic[0].children[0].shape.x2 += 60;
        this.graphic[0].children[1].shape.x2 += 60;
        this.graphic.push(this.createBreadcrumb(params.name))
        this.hideTooltip();
        this.render();
      }
    })
  }

  private showTooltip = _.debounce((params) => {
    this.isTooltipModelShown = true;
    const fields = [{ label: params.name, value: params.data.value }]
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
    this.isTooltipModelShown = false;
  }

  private getMapId(name: any) {

    return namedata.find(item => item.city == name).cityid.toString();
  }

  private getGeoJson(name: any) {
    let mapJson;
    let id = name == "中国" ? "100000" : this.getMapId(name);
    let url = "https://geo.datav.aliyun.com/areas_v2/bound/" + id + "_full.json";
    $.getJSON(url, function (geoJson) {
      mapJson = geoJson
    })
    echarts.registerMap('Map', mapJson);
  }

  private createBreadcrumb = (name) => {
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
          x2: 50,
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
          x2: 50,
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
          onclick: () => {
            this.getGeoJson("中国");
            this.drilldown = true;
            this.items = this.data[0];
            this.hideTooltip();
            this.selection = [];
            this.selectionManager.clear();
            this.getgraphic();
            this.render();
          },
        }
      ]
    }]
    this.graphic = arr;
  }

  private classify = (arr: any, name: any) => {
    let obj = {}
    arr.map(v => {
      obj[v[name]] = 0
    })
    let nameArr = Object.keys(obj)
    let result = [];
    nameArr.map(v => {
      let temp = arr.filter(_v => v == _v[name]);
      if (temp.length) {
        result.push(temp)
      }
    })
    return result
  }

  private sum(arr: any) {
    let s = 0;
    arr.forEach(item => {
      s += item[this.valuesName];
    });
    return s;
  }

  private getSumData(data: any, dimension: any, name: any, drilldown: number) {
    let arr = [[], []];
    data.map((item) => {
      arr[0].push({
        name: item[0][name],
        value: this.sum(item) || 0,
        drilldownIndex: drilldown
      });
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
      arr[0].push({
        name: item[name],
        value: item[this.valuesName] || 0,
      })
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

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items[0];
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let pieces = JSON.parse(options.pieces).map(function (item: number[], i: number) {
      let j = i % options.piecesColor.length;
      item['color'] = options.piecesColor[j];
      return item;
    });

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
    var option = {
      tooltip: {
        show: false,
      },
      graphic: this.graphic,
      series: [
        {
          name: 'map',
          type: 'map',
          map: "Map",
          zoom: 1.2,
          roam: options.roam,
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
          animationDelayUpdate: 300
        }
      ]
    };
    this.chart.setOption(option);
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
          pieces: pieces
        },
      })
    }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    let data = [[], [], []];
    if (dataView) {
      const plainData = dataView.plain;
      this.provinceName = plainData.profile.province.values[0].display;
      this.cityName = plainData.profile.city.values;
      this.valuesName = plainData.profile.values.values[0].display;
      data[0] = this.getSumData(this.classify(plainData.data, this.provinceName), plainData.profile.province.values[0], this.provinceName, 1);
      if (this.cityName.length) {
        this.drilldown = true;
        this.classify(plainData.data, this.provinceName).map((item) => {
          if (this.cityName.length > 1) {
            data[1].push(this.getSumData(this.classify(item, this.cityName[0].display), this.cityName[0], this.cityName[0].display, 2));
            this.classify(item, this.cityName[0].display).map((item) => {
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
    console.log(data)
    this.properties = options.properties;
    this.getgraphic();
    this.render();
  }

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