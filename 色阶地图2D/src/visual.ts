import '../style/visual.less';
import * as echarts from 'echarts';
import "echarts/map/js/china.js"
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  private dataView: any;
  static mockItems = [];
  private hourIndex: any;
  private fhourTime: any;
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = echarts.init(dom)
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
    var option = {
      tooltip: {
        show: showtooltip,
        trigger: 'item',
        formatter(params) {
          let tootip = ''
          for (let i = 0; i < plainData.data.length; i++) {
            if (plainData.data[i][provinceName] === params.name) {
              tootip = '<span style="color:#fff;font-size:15px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + params.name + '</span>' + '<p style="height: 1px; width: 100%; background: rgba(190,190,190,.4); margin-top: 5px;" ></p>';
              for (let j = 0; j < valuesName.length; j++) {
                tootip += params.marker + " " + '<span style="color: #fff;">' + valuesName[j].display + '</span>' + " :  " + '<span style="color: #ffcf07;">' + plainData.data[i][valuesName[j].display] + '</span>' + "<br/>";
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
          roam: options.roam,
          itemStyle: {
            opacity: 1,
            areaColor: options.mapColor,
            borderWidth: 1,
            borderColor: options.borderColor,
            shadowColor: 'rgba(128, 217, 248, 1)',
            // shadowColor: 'rgba(255, 255, 255, 1)',
            shadowOffsetX: -2,
            shadowOffsetY: 2,
            shadowBlur: 10,
            emphasis: {
              areaColor: '#389BB7',
              borderWidth: 0
            }
          },
          label: {
            show: true,
            textStyle: {
              color: '#fff', //地图初始化区域字体颜色
              fontSize: 13,
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
            color: options.textColor
          },
          pieces: pieces
        },
      })
    }
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