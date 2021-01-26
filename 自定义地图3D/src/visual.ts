import '../style/visual.less';
import "echarts/map/js/china.js"
import "echarts-gl"
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  private dataView: any;
  private shadowDiv: any;
  static mockItems = [];
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = require('echarts').init(dom);
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
    this.container.firstElementChild.setAttribute('style','height : 0');
    this.items = [];
    this.dataView = [];
    this.properties = {
      showPieces: true,
      showVisualMap: true,
      textColor: '#ffffff',
      mapColor: "#2d8080",
      borderColor: 'rgba(147, 235, 248, 1)',
      distance: 95,
      alpha: 55,
      beta: 5,
      pieces: "[{\"gt\": 10000,\"label\": \">10000\"},{\"gte\": 1000,\"lte\": 10000,\"label\": \"1000 - 10000\"},{\"gte\": 100,\"lt\": 1000,\"label\": \"100 - 999\"},{\"gte\": 1,\"lt\": 100,\"label\": \"1 - 99\"},{\"lte\": 0,\"label\": \"0\"}]",
    };
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
    this.shadowDiv.style.cssText = '';
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
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
              tootip += params.name
              for (let j = 0; j < valuesName.length; j++) {
                tootip += "<br/>" + params.marker + " " + valuesName[j].display + ":" + plainData.data[i][valuesName[j].display]
              }
              return tootip;
            }
          }
        }
      },
      series: [
        {
          name: 'map',
          type: 'map3D',
          map: 'china',

          itemStyle: {
            opacity: 1,
            areaColor:options.mapColor,
            borderWidth: 1,
            borderColor: options.borderColor
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
          viewControl: {
            distance: options.distance,
            alpha: options.alpha,
            beta: options.beta,
          },
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