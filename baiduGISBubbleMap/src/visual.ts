import '../style/visual.less';
import * as echarts from 'echarts';
import { registerBmap } from 'echarts-bmap';
import geoCoordMap from './geoCoordMap.json';
import { myTooltipC } from './myTooltip.js';

let ins;
export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private myTooltip: any;
  private config: any;
  private properties: any;
  private locationName: any;
  private valuesName: any;
  private longitude: any;
  private latitude: any;
  private tooltipFields: any;
  private items: any;
  private shadowDiv: any;
  private bindCoords: boolean;
  private bindValues: boolean;
  private static mockItems = [
    { name: "太原", value: [119.306239, 26.075302, 13] }
    , { name: "福州", value: [112.549248, 37.857014, 71] }
    , { name: "长春", value: [125.3245, 43.886841, 228] }
    , { name: "重庆", value: [106.504962, 29.533155, 171] }
    , { name: "西安", value: [108.948024, 34.263161, 80] }
    , { name: "成都", value: [104.065735, 30.659462, 71] }
    , { name: "常州", value: [119.946973, 31.772752, 128] }
    , { name: "北京", value: [116.405285, 39.904989, 71] }
    , { name: "北海", value: [118.016974, 37.383542, 27] }
    , { name: "海口", value: [110.33119, 20.031971, 8] }
    , { name: "包头", value: [109.840405, 40.658168, 106] }
    , { name: "昆明", value: [102.712251, 25.040609, 77] }
    , { name: "广州", value: [113.280637, 23.125178, 55] }
    , { name: "郑州", value: [113.665412, 34.757975, 7] }
    , { name: "长沙", value: [112.982279, 28.19409, 95] }
  ];

  constructor(dom: HTMLDivElement, host: any) {
    registerBmap(echarts);
    this.container = dom;
    this.bindCoords = false;
    this.bindValues = false;
    this.chart = echarts.init(this.container);
    this.shadowDiv = document.createElement("div");
    this.container.appendChild(this.shadowDiv);
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
    this.autoPlayTooltip();
    ins = this;
  }

  private getCoords = (keyWord: string) => {
    let reg = new RegExp(keyWord);
    for (let i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }
  }

  private convertData = (dataItems: any) => {
    let res = [];
    dataItems.forEach((dataItem) => {
      let valueObj = {
        name: dataItem[this.locationName]
      };
      let geoCoord;
      if (this.bindCoords) {
        geoCoord = [dataItem[this.longitude], dataItem[this.latitude]];
      } else {
        geoCoord = this.getCoords(dataItem[this.locationName]);
      }

      if (geoCoord) {
        valueObj['value'] = geoCoord.concat(dataItem[this.valuesName]);
      }

      if(this.bindValues) {
        valueObj['valueInfo'] = {
          valueName : this.valuesName,
          value : dataItem[this.valuesName]
        }
      }

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

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.items = [];
    this.tooltipFields = [];
    let profileItems = options.dataViews[0] && options.dataViews[0].plain.profile;
    if (profileItems && options.dataViews.length) {
      let plainData = options.dataViews[0].plain;
      this.locationName = profileItems.location.values[0].display;
      this.bindValues = !!profileItems.values.values.length;
      if(this.bindValues) {
        this.valuesName = profileItems.values.values[0].display;
      }
      this.bindCoords = !!(profileItems.longitude.values.length && profileItems.latitude.values.length);
      if (this.bindCoords) {
        this.longitude = profileItems.longitude.values[0].display;
        this.latitude = profileItems.latitude.values[0].display;
      }

      let toolTipValues = profileItems.tooltipFields.values;
      if (toolTipValues.length) {
        this.tooltipFields = toolTipValues.map(value => value.display);
      }
      this.items = this.convertData(plainData.data);
    }
    this.properties = options.properties;
    this.render();
  }

  private getSymbolSize = (minValue, maxValue) => {
    if (maxValue === minValue) {
      minValue = 0;
    }
    let containerSize = this.container.getBoundingClientRect();
    let width = containerSize.width;
    let height = containerSize.height;
    let min = width > height ? height : width;
    let minSize = min / 70;
    let maxSize = min / 20;
    return function (value) {
      return (maxSize - minSize) / (maxValue - minValue) * (value[2] - minValue) + minSize;
    };
  }

  public render() {
    let myTooltip = this.myTooltip;
    this.chart.clear();
    this.shadowDiv.style.cssText = '';
    let options = this.properties;
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
    let isMock = !this.items.length;
    let items = isMock ? Visual.mockItems : this.items;
    this.shadowDiv.style.cssText = `box-shadow: inset 0 0 ${options.borderShadowBlurLevel}px ${options.borderShadowWidth}px ${options.borderShadowColor}; position: absolute; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
    this.container.style.opacity = isMock ? '0.5' : '1';
    let maxValue = Math.max.apply(null, items.map(function (item) {
      return item.value[2];
    }));
    let minValue = Math.min.apply(null, items.map(function (item) {
      return item.value[2];
    }));
    let symbolSize;
    if (!isMock && !this.bindValues) {
      symbolSize = options.symbolSize;
    } else {
      symbolSize = this.getSymbolSize(minValue, maxValue);
    }
    let series = [];
    series.push(
        {
          type: 'scatter',
          coordinateSystem: 'bmap',
          data: items,
          symbolSize: symbolSize,
          symbol: options.symbol,
          label: {
            normal: {
              show: options.showLabel,
              textStyle: {
                color: options.textColor,
                fontSize: options.textFont,
              },
              formatter(value) {
                return value.data.value[2]
              }
            }
          },
          itemStyle: {
            normal: {
              color: options.symbolColor,
            }
          }
        }
    )

    if (options.showEffect) {
      series.push(
          {
            type: 'effectScatter',
            coordinateSystem: 'bmap',
            data: items,
            symbolSize: symbolSize,
            symbol: options.symbol,
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
              normal: {
                show: options.showLabel,
                textStyle: {
                  color: options.textColor,
                  fontSize: options.textFont,
                },
                formatter(value) {
                  return value.data.value[2]
                }
              }
            },
            itemStyle: {
              normal: {
                color: options.symbolColor,
                shadowBlur: 10,
                shadowColor: '#fff'
              }
            },
            zlevel: 1
          }
      );
    }

    if (options.showRankData) {
      let rankItems = items.sort(function (a, b) {
        if (options.rank === 'top') {
          return b.value[2] - a.value[2];
        } else {
          return a.value[2] - b.value[2];
        }
      }).slice(0, options.level);

      if (!options.showEffect) {
        series.push(
            {
              type: 'scatter',
              coordinateSystem: 'bmap',
              data: rankItems,
              symbolSize: symbolSize,
              symbol: options.symbol,
              label: {
                normal: {
                  show: options.showLabel,
                  textStyle: {
                    color: options.textColor,
                    fontSize: options.textFont,
                  },
                  formatter(value) {
                    return value.data.value[2]
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: options.rankSymbolColor
                }
              }
            }
        );
      } else {
        series.push(
            {
              type: 'effectScatter',
              coordinateSystem: 'bmap',
              data: rankItems,
              symbolSize: symbolSize,
              symbol: options.symbol,
              showEffectOn: 'render',
              rippleEffect: {
                brushType: 'stroke'
              },
              hoverAnimation: true,
              label: {
                normal: {
                  show: options.showLabel,
                  textStyle: {
                    color: options.textColor,
                    fontSize: options.textFont,
                  },
                  formatter(value) {
                    return value.data.value[2]
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: options.rankSymbolColor,
                  shadowBlur: 10,
                  shadowColor: '#fff'
                }
              },
              zlevel: 1
            }
        );
      }
    }

    let bmap = {
      resizeEnable: true,
      zoom:options.zoom,
      roam: options.zoomEnable,
      mapStyle:  {style : options.mapStyle},
    }
    if (options.centerEnable) {
      bmap['center'] = [options.longitude, options.latitude];
    }

    function tooltipTemplate(data) {
      let locationStr = `${data.name}\n`;
      let valueStr = '';
      let tooltipStr = '';

      if (data.valueInfo) {
        valueStr = `${data.valueInfo.valueName} : ${data.valueInfo.value}\n`;
      }

      if (data.tooltipFields) {
        data.tooltipFields.forEach((tooltip) => {
          tooltipStr = tooltipStr + `${tooltip.filed} : ${tooltip.value}\n`;
        })
      }
      return `${locationStr}${valueStr}${tooltipStr}`;
    }


    let option = {
      bmap: bmap,
      tooltip: {
        show: options.showTooltip,
        trigger: 'item',
        backgroundColor : 'transparent',
        position (pos) {
          return myTooltip.getPosOrSize('pos', pos);
        },
        formatter(params: any) {
          let text = tooltipTemplate(params.data);
          return myTooltip.getTooltipDom(text);
        },
      },
      legend: {
        show: false
      },
      geo: {
        map: 'bamp',
        type: 'map',
        label: {
          emphasis: {
            show: true,
            color: '#fff'
          }
        }
      },
      series: series
    };
    this.chart.setOption(option);
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
        if (index >= this.items.length) {
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

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: any): string[] {
    let properties = updateOptions.properties;
    let hiddenStates = [];
    let profileItems = updateOptions.dataViews[0] && updateOptions.dataViews[0].plain.profile;
    this.bindValues = profileItems && !!profileItems.values.values.length;

    if (profileItems && !this.bindValues) {
      properties.showLabel = false;
      properties.showRankData = false;
      hiddenStates.push('showLabel', 'showRankData');
    } else {
      hiddenStates.push('symbolSize');
    }

    if (!properties.centerEnable) {
      hiddenStates.push('latitude','longitude');
    }
    if(!properties.showLabel) {
      hiddenStates.push('textColor','textFont');
    }
    if(!properties.showRankData) {
      hiddenStates.push('rank','level', 'rankSymbolColor');
    }

    if(!properties.showTooltip) {
      hiddenStates.push('tooltipBackgroundColor','tooltipWidth','tooltipHeight','tooltipBorderColor','tooltipPadding','tooltipTextStyle');
    }
    return hiddenStates;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}