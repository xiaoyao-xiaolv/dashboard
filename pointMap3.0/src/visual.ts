import '../style/visual.less';
import * as echarts from 'echarts';
import 'echarts-gl';
import $ from 'jquery';

import ChainJson from './china.json';
import ShanXiJson from './shanxi.json'
import mapAdCodeId from './mapname.json';
import geoCoordMap from './geoCoordMap.json';
import { myTooltipC } from './myTooltip.js';

(window as any).jQuery = $;
let myChart;
const clickLeftMouse = 0;
const clickRightMouse = 2;
const locationReg = /(省|市|自治区|自治州|县|区|特别行政区)/g;
export default class Visual extends WynVisual {

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private bindCoords: boolean;
  private items: any;
  private valuesName: string;
  private locationName: string;
  private toolTipName: string [];
  private longitudeName: string;
  private latitudeName: string;
  private preview: boolean;
  private selectionManager: any;
  private selection: any[] = [];
  private mapAdCodeId: any;
  private mapJsonData: any;
  private config: any;
  private myTooltip: any;
  private properties: any;
  private provinceNameData: any;
  private resultData: any;
  private locationArr: any;
  private format: any;
  private displayUnit: any;
  static mockItems =  [
    {
      name: '北京',
      value: [116.405285, 39.904989],
      datas: 1354,
    },
    {
      name: '陕西省',
      value: [108.948024, 34.263161],
      datas: 1402,
    },
    {
      name: '上海',
      value: [121.472644, 31.231706],
      datas: 2468,
    },
    {
      name: '成都市',
      value: [104.065735, 30.659462],
      datas: 768,
    },
    {
      name: '武汉市',
      value: [114.298572, 30.584355],
      datas: 589,
    },
    {
      name: '福州市',
      value: [119.306239, 26.075302],
      datas: 1500,
    }
  ];
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
  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private getMapJson = (_mapName: string) => {
    if (_mapName == 'china' || _mapName == '陕西省') {
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

  private getCoords = (keyWord: string) => {
    let reg = new RegExp(keyWord);
    for (let i = 0; i < geoCoordMap.length; i++) {
      if (reg.test(geoCoordMap[i].name)) {
        return [geoCoordMap[i].lng, geoCoordMap[i].lat];
      }
    }

  }
  private getSelectionId = (_item, dimension) => {
    const selectionId = this.createSelectionId();
    // profile.location.values[0]
    this.locationName && selectionId.withDimension(dimension , _item);
    return selectionId
  }
  private prepareData(data: any, profile: any) {
    return data.map((item, index) => {
      let geoCoord = this.bindCoords ? [item[this.longitudeName], item[this.latitudeName]] : this.getCoords(item[this.locationName]);
      const toolTip = this.toolTipName.map((_item: string) => { return { [_item]: item[_item]}});
      return {
          name: item[this.locationName],
          value: geoCoord,
          datas: item[this.valuesName],
          toolTip: toolTip,
          selectionId:  this.getSelectionId(item, profile.location.values[0])
      }
    })
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.locationArr = [];
    this.preview = options.isViewer
    this.isMock = !options.dataViews.length;
    
    if (!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      this.valuesName = profile.values.values[0].display;
      this.locationName = profile.location.values[0].display;
      this.toolTipName = profile.tooltipFields.values.map((_item) => _item.display);
      this.bindCoords = !!(profile.longitude.values.length && profile.latitude.values.length);
      if(this.bindCoords) {
        this.longitudeName = profile.longitude.values[0].display;
        this.latitudeName = profile.latitude.values[0].display;
      }
      this.items = this.prepareData(bindData, profile);
      // data format and display unit
      this.format = options.dataViews[0].plain.profile.values.options.valueFormat;
      this.displayUnit = options.dataViews[0].plain.profile.values.options.valueDisplayUnit;
    }
    // registerMap
    this.mapAdCodeId = options.properties.MapId || 'china';

    this.properties = options.properties;
    this.getMapJson('china' ||  this.mapAdCodeId)
   
  }

  public bindEvents = () => {
    
    // this.container.addEventListener('mousedown', (e: any) => {
    //   console.log('dianjiquxiao')
    //   // echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(ChainJson)))
    // })

    myChart.on('mouseup', (params) => {
      this.getMapJson(params.name)
      // click province to drilling
      // if (this.provinceNameData.includes(params.name)) {
      //   this.getMapJson(params.name)
      // } else {
      //   // click city to jump
    
      //   const clickMouse = params.event.event.button;
      //   if (params.componentType !== 'series') return;
      //   params.event.event.seriesClick = true;
      //   if (clickMouse === clickLeftMouse) {
      //     // show data jump
      //     if (this.properties.clickLeftMouse === 'none' || this.properties.clickLeftMouse === 'showToolTip') {
      //       return
      //     } else {
      //       this.getMapJson(params.name)
      //       // if (isTooltipModelShown) return;
      //       this.host.commandService.execute([{
      //         name: this.properties.clickLeftMouse,
      //         payload: {
      //           position: {
      //             x: params.event.event.x,
      //             y: params.event.event.y,
      //             },
      //         }
      //       }])
      //     }
      //   } else if (clickMouse === clickRightMouse) {  
      //     params.event.event.preventDefault();
      //   }
      // }
      
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
   
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    const items = this.isMock ? Visual.mockItems : this.items;
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
        centroid: item.properties.center,
      }
    }).filter((_item: any) => _item.name);
    
    const _barData = items.map((item: any) => {
      return {
        name: item.name,
        value: [item.value[0], item.value[1], 50],
        datas: item.datas,
      }
    })

    const lineMaxHeight = (type?: string) => {
      const maxValue = Math.max(...items.map(item => item.datas))
      return type ? 14/maxValue : 10/maxValue
    }

    const _line3DData = items.map((item: any, index: number) => {
      return {
        name: item.name || " ada",
        value: item.datas,
        coords:[item.value, [items[index ? index -1 : index].value[0], items[index ? index -1 : index].value[1] + 10]]
      }
    })

    const formatList = options.mapCollection;

    const formatColor = (_formatColor, value) => {
      if (formatList.length > 0) {
        formatList.map((_item: any) => {
            if (value >= Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
              if (_item.minRank === '[' && _item.maxRank === ']') {
                // _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                _formatColor = _item.formatColor
              }
            }
            if (value >= Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
              if (_item.minRank === '[' && _item.maxRank === ')') {
                _formatColor = _item.formatColor
              }
            }
            if (value > Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
              if (_item.minRank === '(' && _item.maxRank === ']') {
                _formatColor = _item.formatColor
              }
            }
            if (value > Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
              if (_item.minRank === '(' && _item.maxRank === ')') {
                _formatColor = _item.formatColor
              }
            }
        })
      }
      return _formatColor;
    }
    const hexToRgba = (hex, opacity?: number, isLine?: boolean) => {
      const isHex = hex.slice(0, 1) === '#';
      const _opacity = isLine ? 0.1 : opacity;
      if (isHex) {
        return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
              + parseInt('0x' + hex.slice(5, 7)) + ',' + _opacity + ')';
      } else {
        // fixed rgba to rgba
        var rgb = hex.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var a = isLine ? (Number(rgb[3].split(')')[0]) + 0.2) : Number(rgb[3].split(')')[0])
        return `rgba(${r}, ${g}, ${b}, ${a})`
      }
    }
    const formatLabelColor = () => {
      const _richStyle = {};
      formatList && formatList.map((_item, _index) => {
        _richStyle[`${_item.minFormatValue}To${_item.maxFormatValue}`] = {
          align: 'center',
          verticalAlign: 'middle',
          color: _item.formatColor,
          fontSize: parseInt(options.labelTextStyle.fontSize.slice(0, -2)),
          padding: [options.labelPadding.top, options.labelPadding.bottom,options.labelPadding.left,options.labelPadding.right],
          backgroundColor: options.tooltipBackgroundType === 'color' ? options.labelBackgroundColor : { image: options.labelBackgroundImage },
        }
      })
      return _richStyle;
    }

    const labelOptions = () => {
      return {
        show: options.showLabel,
        distance: options.labelDistance,
        textStyle: {
          ...options.labelTextStyle,
          fontSize: parseInt(options.labelTextStyle.fontSize.slice(0, -2)),
          borderWidth: options.tooltipBackgroundType === 'color' ? 1 : 0,
          borderColor: options.tooltipBackgroundType === 'color' ? options.labelBorderColor : 'rgba(0,0,0,0)',
        },
        formatter: (params: any) => {
            let _text = [];
            let value = params.data.datas;
            const _formatRichName = formatList.map((_item: any) => {
              let _name = '';
              if (value >= Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
                if (_item.minRank === '[' && _item.maxRank === ']') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              if (value >= Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
                if (_item.minRank === '[' && _item.maxRank === ')') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              if (value > Number(_item.minFormatValue) && value <= Number(_item.maxFormatValue)) {
                if (_item.minRank === '(' && _item.maxRank === ']') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              if (value > Number(_item.minFormatValue) && value < Number(_item.maxFormatValue)) {
                if (_item.minRank === '(' && _item.maxRank === ')') {
                  _name = `${_item.minFormatValue}To${_item.maxFormatValue}`
                }
              }
              return _name;
            }).filter(_item => _item)[0] || 'name';
            const _formatTarget = options.useToLabel ? _formatRichName: 'name';
            // const _formatTarget = 'name';
            if (options.showLocation) {
              let name = params.name;
              _text.push(name)
            }
            if (options.showValue) {
              if (this.isMock) {
                value = value;
              } else {
                let realDisplayUnit = this.displayUnit;
                const formatService = this.host.formatService;
                if (formatService.isAutoDisplayUnit(this.displayUnit)) {
                  realDisplayUnit = formatService.getAutoDisplayUnit(value);
                }
                value = formatService.format(this.format, value, realDisplayUnit)
              }
              _text.push(value)
            }
          let _result = _text.join(':');
            return `{${_formatTarget}|${_result}}`;
          },
          rich:{
            name:{
              align: 'center',
              verticalAlign: 'middle',
              color: options.labelTextStyle.color,
              fontSize: parseInt(options.labelTextStyle.fontSize.slice(0, -2)),
              padding: [options.labelPadding.top, options.labelPadding.bottom,options.labelPadding.left,options.labelPadding.right],
              backgroundColor: options.tooltipBackgroundType === 'color' ? options.labelBackgroundColor : { image: options.labelBackgroundImage },
            },
            ...formatLabelColor(),
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
          const _toolTip = items.find((_item) => {
            const name = _item.name.replace(locationReg, '');
            return name === params.name.replace(locationReg, '') && _item;
          });

          if (!this.isMock && _toolTip) {
            let _addToolTipText = `${this.locationName}: ${_toolTip.name} \n${this.valuesName}: ${_toolTip.datas}`
            _toolTip.toolTip.map((_text: any, index: number) => {
              _addToolTipText += `\n${this.toolTipName[index]}: ${_text[this.toolTipName[index]]}`
            })
            return myTooltip.getTooltipDom(_addToolTipText)
          }
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
            barSize:options.showBar ?  [options.barSize * 0.1, options.barSize * 0.1]: [0,0],
            bevelSize: options.barBevelSmoothness / 100,
            bevelSmoothness: options.barBevelSmoothness,
            minHeight: options.barMinHeight,
            silent: true,
            itemStyle: {
              color: (params: any) => {

                const _value = params.data.datas;
                const _color = options.useToBar ? formatColor(options.barColor, _value) : options.barColor;
                return _color
              },
            },
            label: labelOptions(),
        },
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
    let properties = options.properties;
    let hiddenStates = [];
    // bar
    if (!properties.showBar ) {
      hiddenStates = hiddenStates.concat(['barColor', 'barColor', 'barBevelSmoothness', 'barMinHeight', 'barSize'])
    }
    // showLabel
    if (!properties.showLabel ) {
      hiddenStates = hiddenStates.concat(['showLocation', 'showValue', 'tooltipBackgroundType', 'labelBackgroundColor', 'labelBackgroundImage' ,'labelBorderColor', 'labelPadding', 'labelTextStyle', 'labelDistance'])
    } else {
      if (properties.tooltipBackgroundType === 'color') {
        hiddenStates = hiddenStates.concat(['labelBackgroundImage'])
      } else {
        hiddenStates = hiddenStates.concat(['labelBackgroundColor'])
      }
    }

    // showTooltip
    if (!properties.showTooltip ) {
      hiddenStates = hiddenStates.concat(['tooltipBackgroundColor', 'tooltipWidth', 'tooltipHeight', 'tooltipBorderColor', 'tooltipPadding', 'tooltipBgBorderColor', 'tooltipBorderRadius', 'tooltipTextStyle'])
    }
    return hiddenStates;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}