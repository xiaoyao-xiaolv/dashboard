import '../style/visual.less';
import * as echarts from 'echarts';
import 'echarts-gl';
import ChainJson from './china.json';
import ShanXiJson from './shanxi.json'
import mapAdCodeId from './mapname.json';
import $ from 'jquery';
import { myTooltipC } from './myTooltip.js';
(window as any).jQuery = $;
let myChart;
const locationReg = /(省|市|自治区|自治州|县|区|特别行政区)/g;
export default class Visual extends WynVisual {

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private bindCoords: boolean;
  private preview: boolean;
  private selectionManager: any;
  private selection: any[] = [];
  private mapAdCodeId: any;
  private mapJsonData: any;
  private config: any;
  private myTooltip: any;
  private properties: any;
  
  
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.host = host;
    this.isMock = true;
    this.bindCoords = false;
    this.preview = false;
    this.selectionManager = host.selectionService.createSelectionManager();
    myChart = echarts.init(dom, null, { renderer: 'canvas' });
    this.bindEvents();

    // toolTip
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
  }
  private getMapJson = (_mapName: string) => {
    if (_mapName == 'china') {
      this.mapJsonData = ChainJson;
      echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(_mapName === 'china' ? ChainJson : ShanXiJson)))
    } else {
    
      const _name = _mapName.replace(locationReg, '');
      let _adCodeId = '100000'
      let mapJson = ChainJson;
      mapAdCodeId.map((_map: any) => {
        const _mapName = _map.city.replace(locationReg, '');
        if (_mapName === _name) {
            _adCodeId = _map.cityid;
        }
      })
      let href = window.location.href;
      let port = window.location.port;

      let url = href.substring(0, href.indexOf(port) + port.length + 1) + "data/" + _adCodeId + ".json"
      $.ajaxSettings.async = false;
      $.getJSON(url, function (geoJson) {
        mapJson = geoJson
      })
      this.mapJsonData = mapJson
      echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(mapJson)))
    }
    this.render();
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    // registerMap
    this.mapAdCodeId = options.properties.MapId || 'china';
    this.properties = options.properties;
    this.getMapJson('china' ||  this.mapAdCodeId)
   
    console.log( this.properties, '=== this.properties', options)
  }

  public bindEvents = () => {
    
    // this.container.addEventListener('mousedown', (e: any) => {
    //   console.log('dianjiquxiao')
    //   // echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(ChainJson)))
    // })

    myChart.on('click',(params)=> {
      this.getMapJson(params.name)
    })

    myChart.on('mouseout', (params) => {
      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };
      // this.dispatch('downplay',selectInfo)
    })
  }
 
  private render() {
   
    // this.container.style.opacity = this.isMock ? '0.5' : '1';
    let myTooltip = this.myTooltip;
    myChart.clear();
  
    let options = this.properties;
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
    const _data = JSON.parse(JSON.stringify(this.mapJsonData)).features.map((item: any) => {
      return {
        name: item.properties.name || '',
        centroid: item.properties.center
      }
    });

    const _barData = _data.map((item: any) => {
      return {
        name: item.name,
        value: item.centroid ? [item.centroid[0] ,item.centroid[1] ,10] : [10,10,10]
      }
    })

    const lineMaxHeight = (type?: string) => {
      // const maxValue = Math.max(...this.items.map(item => item.datas))
      const maxValue = 1;
      return type ? 14/maxValue : 10/maxValue
    }

    const _line3DData = _data.map((item: any) => {
      return {
        name: item.name ||　" ada",
        coords:item.centroid ?  [item.centroid, [item.centroid[0], item.centroid[1] + 10 * lineMaxHeight()]] : [ [10,10], [10,20]]
      }
    })
    

    const labelOptions = () => {
      return {
        show: options.showLabel,
        textStyle: {
          ...options.labelTextStyle,
          fontSize: parseInt(options.labelTextStyle.fontSize.slice(0, -2)),
          borderWidth: 1,
          borderColor: options.tooltipBackgroundType === 'color' ? options.labelBorderColor : options.tooltipBgBorderColor,
        },
        formatter: (params: any) => {
          console.log(params, '===params')
          return `{name|${params.name || ' '}}`;
            // return params.name || 'ada'
            // let _text = [];
            // let value = params.data.datas;
            // const _formatRichName = formatList.map((_item: any) => {
            //   let _name = '';
            //   if (value >= Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
            //     if (_item.minRank === '[' && _item.maxRank === ']') {
            //       _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
            //     }
            //   }
            //   if (value >= Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
            //     if (_item.minRank === '[' && _item.maxRank === ')') {
            //       _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
            //     }
            //   }
            //   if (value > Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
            //     if (_item.minRank === '(' && _item.maxRank === ']') {
            //       _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
            //     }
            //   }
            //   if (value > Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
            //     if (_item.minRank === '(' && _item.maxRank === ')') {
            //       _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
            //     }
            //   }
            //   return _name;
            // }).filter(_item => _item)[0] || 'name';
            // const _formatTarget = options.useToLabel ? _formatRichName: 'name';
            // if (options.showLocation) {
            //   let name = params.name;
            //   _text.push(name)
            // }
            // if (options.showValue) {
            //   if (this.isMock) {
            //     value = value;
            //   } else {
            //     let realDisplayUnit = this.displayUnit;
            //     const formatService = this.host.formatService;
            //     if (formatService.isAutoDisplayUnit(this.displayUnit)) {
            //       realDisplayUnit = formatService.getAutoDisplayUnit(value);
            //     }
            //     value = formatService.format(this.format, value, realDisplayUnit)
            //   }
            //   _text.push(value)
            // }
            // const _result = _text.join('\n');
            // return `{${_formatTarget}|${_result}}`;
          },
          rich:{
            name:{
              align: 'center',
              verticalAlign: 'middle',
              color: options.labelTextStyle.color,
              fontSize: parseInt(options.labelTextStyle.fontSize.slice(0, -2)),
              borderRadius: options.tooltipBorderRadius,
              padding: [options.labelPadding.top, options.labelPadding.right],
              backgroundColor: options.tooltipBackgroundType === 'color' ? options.labelBackgroundColor : { image: options.tooltipBackgroundImage },
            },
            // ...formatLabelColor(),
          }
        
        }
    }
    
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        // padding: [15, 15],
        show: options.showTooltip,
        backgroundColor: 'transparent',
        position(pos) { 
          return myTooltip.getPosOrSize('pos', pos);
        },
        formatter: (params) => {
          return myTooltip.getTooltipDom(params.name || ' ')
          // const _toolTip = this.items.find((_item) => {
          //   const name = _item.name.replace(locationReg, '');
          //   return name === params.name && _item;
          // });
          // if (!this.isMock && _toolTip) {
          //   let _addToolTipText = `${this.locationName}: ${_toolTip.name} \n${this.valuesName}: ${_toolTip.datas}`
          //   _toolTip.toolTip.map((_text: any, index: number) => {
          //     _addToolTipText += `\n${this.toolTipName[index]}: ${_text[this.toolTipName[index]]}`
          //   })
          //   return myTooltip.getTooltipDom(_addToolTipText)
          // }
        },
      },
      geo3D: {
        map: '3DMapCustom',
        show: false,
        zlevel: -10,
        boxWidth: 200,
        boxHeight: 15, //4:没有bar. 30:有bar,bar最高度30，按比例分配高度
        regionHeight: 0.5,
        shading: 'lambert',
        viewControl: {
            projection: 'perspective',
            autoRotate: false,
            damping: 0,
            rotateSensitivity: 2, //旋转操作的灵敏度
            rotateMouseButton: 'left', //旋转操作使用的鼠标按键
            zoomSensitivity: 2, //缩放操作的灵敏度
            panSensitivity: 2, //平移操作的灵敏度
            panMouseButton: 'right', //平移操作使用的鼠标按键

            distance: 220, //默认视角距离主体的距离
            center: [0, 0, 0],

            animation: true,
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut'
        },
      },
      series: [
        {
          type: 'map3D',
          map: '3DMapCustom',
          name: '3DMapCustom',
          // viewControl: {
          //   distance: 110, //地图视角 控制初始大小
          //   rotateSensitivity: [1, 1],
          // },
          viewControl: {
            projection: 'perspective',
            autoRotate: false,
            damping: 0,
            rotateSensitivity: 2, //旋转操作的灵敏度
            rotateMouseButton: 'left', //旋转操作使用的鼠标按键
            zoomSensitivity: 2, //缩放操作的灵敏度
            panSensitivity: 2, //平移操作的灵敏度
            panMouseButton: 'right', //平移操作使用的鼠标按键

            distance: 110, //默认视角距离主体的距离
            center: [0, 0, 0],
            animation: true,
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut'
          },
          realisticMaterial: {
            roughness: 0.8,
            metalness: 0
          },
          postEffect: {
            enable: true
          },
          groundPlane: {
            show: false
          },
          light: {
            main: {
              intensity: 1,
              alpha: 30
            },
            ambient: {
              intensity: 0
            }
          },
          label: {
              show: false, //是否显示市
              textStyle: {
                  color: '#fff', //文字颜色
                  fontSize: 20, //文字大小
            },
            formatter: (test: any,) => {
              const _label = test.data.name || ' '
              return _label
            }
          },
          itemStyle: {
              color: '#2B5890', //地图颜色
              borderWidth: 3, //分界线wdith
              distance: 5,
              borderColor: '#5578A5', //分界线颜色
          },
          emphasis: {
              label: {
                  show: true, //是否显示高亮
                  textStyle: {
                      color: '#fff', //高亮文字颜色
                  },
              },
              itemStyle: {
                  color: '#0489d6', //地图高亮颜色
              },
          },
        data: _data,
        zlevel:1,
      },
      {
          type: 'bar3D',
          zlevel: 2,
          coordinateSystem: 'geo3D',
          shading: 'lambert',
          data: _barData,
          barSize: 0.1,
          minHeight: 0.2,
          silent: true,
          itemStyle: {
            color: 'orange'
            // opacity: 0.8
        },
          label: labelOptions(),
          // label: {
          //   show: options.showLabel, //是否显示市
          //   textStyle: {
          //       color: '#fff', //文字颜色
          //     fontSize: 20, //文字大小
                
          //   },
          //     formatter: (label: any,) => {
          //       const _label = label.name || ' '
          //     return _label === '河北省' ? '      12121' : _label;
          //   }
          // },
        },
        // {
        //   type: 'lines3D',
        //   coordinateSystem: 'geo3D',
        //   effect: {
        //     show: true,
        //     trailWidth: 1,
        //     trailOpacity: 0.5,
        //     trailLength: 0.2,
        //     constantSpeed: 5
        //   },
        //   blendMode: 'lighter',
        //   lineStyle: {
        //     width: 20,
        //     opacity: 1,
        //     color: 'red'
        //   },
        //   data: _line3DData
        // }
    //   {
    //     type: 'scatter3D',
    //     // type: 'bar3D',
    //     coordinateSystem: 'geo3D',
    //     zlevel: 0,
    //     symbol: 'path://m232.99844,160.209511l15.863519,0l0,-14.211071l16.27296,0l0,14.211071l15.863521,0l0,14.577861l-15.863521,0l0,14.211069l-16.27296,0l0,-14.211069l-15.863519,0l0,-14.577861z',
    //     // symbol: 'circle',
    //     // symbol: 'path://M658.059636 187.826424a31.030303 31.030303 0 0 1 0 43.876849l-288.364606 288.364606 288.364606 288.364606a31.030303 31.030303 0 0 1-43.876848 43.876848l-310.30303-310.30303a31.030303 31.030303 0 0 1 0-43.876848l310.30303-310.303031a31.030303 31.030303 0 0 1 43.876848 0z'
    //     symbolSize: 16,

    //     label: {
    //         normal: {
    //             show: true,
    //             position: 'right',
    //             formatter: '{b}',

    //             textStyle: {
    //                 color: '#fff',
    //                 fontSize: 14,
    //                 backgroundColor: 'transparent' // 字体背景色
    //             },

    //         }
    //     },

    //     // data: mapData,
    //     itemStyle: { //坐标点颜色
    //         color: '#2681cf',
    //         shadowBlur: 20,
    //         shadowColor: '#fff'
    //     },
    //     emphasis: {
    //         itemStyle: { //坐标点颜色
    //             color: '#1ca1d2',
    //         },
    //     }
    // }, {
    //   type: 'scatter3D',
    //   // type: 'bar3D',
    //   coordinateSystem: 'geo3D',
    //   zlevel: 0,
    //   // symbol: 'path://m232.99844,160.209511l15.863519,0l0,-14.211071l16.27296,0l0,14.211071l15.863521,0l0,14.577861l-15.863521,0l0,14.211069l-16.27296,0l0,-14.211069l-15.863519,0l0,-14.577861z',
    //   symbol: 'circle',
    //   // symbol: 'path://M658.059636 187.826424a31.030303 31.030303 0 0 1 0 43.876849l-288.364606 288.364606 288.364606 288.364606a31.030303 31.030303 0 0 1-43.876848 43.876848l-310.30303-310.30303a31.030303 31.030303 0 0 1 0-43.876848l310.30303-310.303031a31.030303 31.030303 0 0 1 43.876848 0z'
    //   symbolSize: 5,
    //     label: {
    //       show: false,
    //       normal: {
    //           show: true,
    //           position: 'right',
    //           formatter: '{b}',

    //           textStyle: {
    //               color: '#fff',
    //               fontSize: 14,
    //               backgroundColor: 'transparent' // 字体背景色
    //           },

    //       }
    //   },
    //   // data: mapData2,
    //   itemStyle: { //坐标点颜色
    //       color: '#fff',
    //       shadowBlur: 20,
    //       shadowColor: '#fff'
    //   },
    //   emphasis: {
    //       itemStyle: { //坐标点颜色
    //           color: '#1ca1d2',
    //       },
    //   }
    //     }
      ]
  });
  }

  public onDestroy(): void {

  }

  public onResize() {
    myChart.resize();
    this.render();
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