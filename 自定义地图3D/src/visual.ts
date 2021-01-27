import '../style/visual.less';
import "echarts/map/js/china.js"
import "echarts-gl"
import { myTooltipC } from './myTooltip.js';

export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  private dataView: any;
  private shadowDiv: any;
  private locationName: any;
  private valuesName: any;
  static mockItems = [];
  private myTooltip: any;
  private tooltipFields: any;
  private config: any;

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
    this.myTooltip = new myTooltipC('visualDom', this.config);
  }

  private convertData = (dataItems: any) => {
    let res = [];
    dataItems.forEach((dataItem) => {
      let valueObj = {
        name: dataItem[this.locationName],
        value : dataItem[this.valuesName] || 0,
        valueInfo : {
          valueName : this.valuesName,
          value : dataItem[this.valuesName] || 0
        }
      };

      let tooltips;
      if (this.tooltipFields.length) {
        tooltips = this.tooltipFields.map((filed) => {
          return {
            filed : filed,
            value : dataItem[filed]
          }
        });
        valueObj['tooltipFields'] = tooltips;
      }
      res.push(valueObj);
    })
    return res;
  }

  public update(options: any) {
    this.items = [];
    this.tooltipFields = [];
    let profileItems = options.dataViews[0] && options.dataViews[0].plain.profile;
    if (profileItems && options.dataViews.length) {
      let plainData = options.dataViews[0].plain;
      this.locationName = profileItems.province.values[0].display;
      this.valuesName = profileItems.values.values[0].display;

      let toolTipValues = profileItems.tooltipFields.values;
      if (toolTipValues.length) {
        this.tooltipFields = toolTipValues.map(value => value.display);
      }
      this.items = this.convertData(plainData.data);
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
    let myTooltip = this.myTooltip;
    myTooltip.config['text'] = {
      time: 0.3,
      font: `${options.tooltipTextStyle.fontStyle} ${options.tooltipTextStyle.fontWeight} ${options.tooltipTextStyle.fontSize} ${options.tooltipTextStyle.fontFamily}`,
      color: options.tooltipTextStyle.color,
      padding: [options.tooltipPadding.top, options.tooltipPadding.right, options.tooltipPadding.bottom, options.tooltipPadding.left ],
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

    let pieces = JSON.parse(options.pieces).map(function (item: number[], i: number) {
      let j = i % options.piecesColor.length;
      item['color'] = options.piecesColor[j];
      return item;
    });

    function tooltipTemplate(data) {
      let locationStr = `${data.name}\n`;
      let valueStr = `${data.valueInfo.valueName} : ${data.valueInfo.value}\n`;
      let tooltipStr = '';

      if (data.tooltipFields) {
        data.tooltipFields.forEach((tooltip) => {
          tooltipStr = tooltipStr + `${tooltip.filed} : ${tooltip.value}\n`;
        })
      }
      return `${locationStr}${valueStr}${tooltipStr}`;
    }


    var option = {
      tooltip: {
        trigger: 'item',
        triggerOn: 'click',
        backgroundColor : 'transparent',
        position (pos) {
          return myTooltip.getPosOrSize('pos', pos);
        },
        formatter(params: any) {
          if(params.data.valueInfo) {
            let text = tooltipTemplate(params.data);
            return myTooltip.getTooltipDom(text);
          }
        },
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