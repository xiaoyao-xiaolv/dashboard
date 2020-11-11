import '../style/visual.less';
import * as echarts from 'echarts';
import "echarts/map/js/china.js"
export default class Visual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private items: any;
  private valueFormat: any;
  private dataView: any;
  static mockItems = [];
  private hourIndex: any;
  private fhourTime: any;
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = echarts.init(dom);
    this.host = host;
    this.items = [];
    this.dataView = [];
    this.properties = {
      roam: true,
      showPieces: true,
      showVisualMap: true,
      textColor: '#ffffff',
      mapColor: '#0a4880',
      borderColor: 'rgba(147, 235, 248, 1)',
      pieces: "[{\"gt\": 10000,\"label\": \">10000\"},{\"gte\": 1000,\"lte\": 10000,\"label\": \"1000 - 10000\"},{\"gte\": 100,\"lt\": 1000,\"label\": \"100 - 999\"},{\"gte\": 1,\"lt\": 100,\"label\": \"1 - 99\"},{\"lte\": 0,\"label\": \"0\"}]",
    };
    this.hourIndex = 0;
    this.fhourTime = null;
    this.auto_tooltip();
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.dataView = dataView;
    this.items = [];
    if (dataView &&
      dataView.plain.profile.values.values.length && dataView.plain.profile.province.values.length) {
      const plainData = dataView.plain;
      let provinceName = plainData.profile.province.values[0].display;
      let valuesName = plainData.profile.values.values;
      this.valueFormat = plainData.profile.values.options.valueFormat;
      this.items = plainData.data.map(function (item) {
        return {
          name: item[provinceName],
          value: item[valuesName[0].display] || 0,
        }
      });
    }

    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let pieces = JSON.parse(options.pieces).map(function (item: number[], i: number) {
      let j = i % options.piecesColor.length;
      item['color'] = options.piecesColor[j];
      return item;
    });

    let plainData = isMock ? Visual.mockItems : this.dataView.plain;
    let provinceName = isMock ? Visual.mockItems : plainData.profile.province.values[0].display;
    let valuesName = isMock ? Visual.mockItems : plainData.profile.values.values;
    let showtooltip = isMock ? false : true

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
      tooltip: {
        show: showtooltip,
        trigger: 'item',
        formatter:(params)=> {
          let tootip = ''
          for (let i = 0; i < plainData.data.length; i++) {
            if (plainData.data[i][provinceName] === params.name) {
              tootip = '<span style="color:#fff;font-size:15px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + params.name + '</span>' + '<p style="height: 1px; width: 100%; background: rgba(190,190,190,.4); margin-top: 5px;" ></p>';
              for (let j = 0; j < valuesName.length; j++) {
                tootip += params.marker + " " + '<span style="color: #fff;">' + valuesName[j].display + '</span>' + " :  " + '<span style="color: #ffcf07;">' + this.formatData(plainData.data[i][valuesName[j].display], options.dataindicateUnit, options.dataindicateType) + '</span>' + "<br/>";
              }
              return tootip;
            }
          }
        },
        backgroundColor: 'rgba(0, 62, 108, 0.9)',
        borderColor: '#3edfd8',
        borderWidth: 2
      },
      series: [
        {
          name: 'map',
          type: 'map',
          map: 'china',
          zoom:1.2,
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

  private auto_tooltip() {
    this.chart.dispatchAction({
      type: "showTip",
      seriesIndex: 0,
      dataIndex: this.hourIndex
    });
    this.hourIndex++;
    if (this.hourIndex > this.items.length) {
      this.hourIndex = 0;
    }
    //鼠标移入停止轮播
    this.chart.on("mousemove", (e) => {
      clearTimeout(this.fhourTime)
      this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: e.dataIndex
      });
    })
    //鼠标移出恢复轮播
    this.chart.on("mouseout", () => {
      this.chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: this.hourIndex
      });
      this.hourIndex++;
      if (this.hourIndex > this.items.length) {
        this.hourIndex = 0;
      }
    })
    setTimeout(() => { this.auto_tooltip() }, 3000);
  }


  public onResize() {
    this.chart.resize();
    this.render();
  }
  // 自定义属性可见性
  public getInspectorHiddenState(updateOptions: any): string[] {
    if (!updateOptions.properties.showPieces) {
      return ['showVisualMap', 'textColor', 'pieces', 'piecesColor'];
    }
    if (!updateOptions.properties.showVisualMap) {
      return ['textColor'];
    }
    return null;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}