import '../style/visual.less';
declare const echarts: any;
import $ from 'jquery';
import ChainJson from './china.json';
import ShanXiJson from './shanxi.json'
import mapAdCodeIds from './mapname.json';
import geoCoordMap from './geoCoordMap.json';
import { myTooltipC } from './myTooltip.js';
var _ = require('lodash');
(window as any).jQuery = $;
let myChart;

let isTooltipModelShown = false;
const clickLeftMouse = 0;
const clickRightMouse = 2;
const locationReg = /(省|市|自治区|自治州|县|区|特别行政区)/g;
let _locationMapName = '';
export default class Visual extends WynVisual {

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private bindCoords: boolean;
  private items: any;
  private initItems: any;
  
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
  private cityNameData: any;
  private resultData: any;
  private locationArr: any;
  private format: any;
  private displayUnit: any;
  private profile: any;
  private bindData: any;
  private linelen: any;
  private graphic: any;
  private timeInterval: any;

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
    this.provinceNameData = JSON.parse(JSON.stringify(ChainJson)).features.map((item: any) => item.properties.name.replace(locationReg, '')).filter((_item: any) => _item);
    
  }
  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private getMapJson = (_mapName: string, isENd?: boolean) => {
    const _name = _mapName.replace(locationReg, '');
    if (_mapName == 'china' ||_mapName == '陕西省' ) {
      this.mapJsonData = _mapName === 'china' ? ChainJson : ShanXiJson;
    } else {
      let _adCodeId = '100000'
      let mapJson = ChainJson;
      mapAdCodeIds.map((_map: any) => {
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
      // echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(mapJson)))
    }
    if (_mapName !== 'china') {
      const _filterCity = JSON.parse(JSON.stringify(this.mapJsonData)).features.map((item: any) => 
        item.properties.name.replace(locationReg, '')).filter((_item: any) => _item);
      if (this.locationArr.length > 1) {
        this.bindData.filter((_data: any) => {
          this.locationArr.map((_location) => {
            if (_filterCity.includes(_data[_location].replace(locationReg, ''))) {
              this.locationName = _location;
            }
          })
        })
        this.items = this.prepareData(this.bindData, this.profile);
        this.items = this.items.filter((_item: any) => _filterCity.includes(_item.name.replace(locationReg, '')))
      } else {
        this.items = this.items.filter((_item: any) => {
          if (_filterCity.includes(_item.name.replace(locationReg, '')) || _item.name.replace(locationReg, '') === _name ) {
            return _item;
          }
        });
      }
    } else {
      this.items = this.initItems;
    }
    const _dataNames: [] = this.items.map((_item: any) => _item.name.replace(locationReg, ''))
    this.items = _dataNames.map((_dataName: any) => {
      const _target = this.items.filter((_item: any) => _item.name.replace(locationReg, '') === _dataName && _item);
      if (_target) {
        if (_target.length > 1) {
          return {
            ..._target[0],
            datas: _target.reduce((_init, _target) => _init + _target.datas, 0)
          }
        } else {
          return _target[0]
        }
      }
  
    });
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
    // this.host.propertyService.setProperty('mapLevel', options.properties.MapId !== 'china' ? 1: 0);
    if (!this.isMock) {
      let profile = options.dataViews[0].plain.profile;
      let bindData = options.dataViews[0].plain.data;
      this.profile = profile;
      this.bindData = bindData;
      this.valuesName = profile.values.values[0].display;
      //  default show first location
      this.locationName = profile.location.values[0].display;
      this.locationArr = profile.location.values.map((_item: any) => _item.display);
      this.toolTipName = profile.tooltipFields.values.map((_item) => _item.display);
      this.bindCoords = !!(profile.longitude.values.length && profile.latitude.values.length);
      if(this.bindCoords) {
        this.longitudeName = profile.longitude.values[0].display;
        this.latitudeName = profile.latitude.values[0].display;
      }
     
      // bindData.push({'客户省份': '陕西省', '客户城市':'渭南市', '标准价格': 666})
      this.items = this.prepareData(bindData, profile);
      this.initItems = this.prepareData(bindData, profile);
      // data format and display unit
      this.format = options.dataViews[0].plain.profile.values.options.valueFormat;
      this.displayUnit = options.dataViews[0].plain.profile.values.options.valueDisplayUnit;
       // registerMap
      this.mapAdCodeId = options.properties.MapId || 'china';
      const provinceName = options.properties.provinceName;
      const cityName = options.properties.cityName;
      this.properties = options.properties;
      this.getgraphic(this.mapAdCodeId);
      if (this.mapAdCodeId !== 'china') {
        this.linelen = 40;
        provinceName && this.createBreadcrumb(provinceName, this.linelen, 1)
        this.linelen += provinceName.length * 20;
        cityName && this.createBreadcrumb(cityName,  this.linelen, 2)
      }
      
      this.getMapJson(this.mapAdCodeId);
    } else {
       // registerMap
      this.mapAdCodeId = 'china';
      this.mapJsonData = ChainJson;
      this.properties = options.properties;
      this.getgraphic(this.mapAdCodeId);
      // if (this.mapAdCodeId !== 'china') {
      //   this.linelen = this.mapAdCodeId.length * 20;
      //   this.createBreadcrumb(this.mapAdCodeId, this.linelen, 2)
      //   }
       
    }
    this.cityNameData = this.mapAdCodeId === 'china' ?  [] : JSON.parse(JSON.stringify(this.mapJsonData)).features.map((item: any) => item.properties.name.replace(locationReg, '')).filter((_item: any) => _item);
    echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(this.mapJsonData)));
    myChart.clear();
    this.render();
    
  }
  private dispatch = (type, payload) => myChart.dispatchAction({ ...payload, type });
  private hideTooltip = () => {
    this.host.contextMenuService.hide();
    isTooltipModelShown = false;
  }

  private showTooltip = _.debounce((params, asModel = false) => {
    if (asModel) isTooltipModelShown = true;
    this.host.contextMenuService.show({
      position: {
        x: params.clientX,
        y: params.clientY,
      }
    })
  });

  public getNodeSelectionId = (label: any) => {
    const _filterCity = JSON.parse(JSON.stringify(this.mapJsonData)).features.map((item: any) => 
        item.properties.name.replace(locationReg, '')).filter((_item: any) => _item);
    const _target = this.items.find((_item: any) => {
      const name = _item.name.replace(locationReg, '');
      if (_filterCity.includes(name) || name === label.replace(locationReg, '')) {
        return _item
      }
    })
    return _target && _target.selectionId || ''
  }
  
  public autoPlayTimer = () => {
    let timer;
    this.timeInterval = [];
    const timerPlay = () => {
      let index = 0;
      let dataLength = this.items.length;
      clearInterval(timer);
      timer = setInterval(() => {
        if (timer !==  this.timeInterval[this.timeInterval.length - 1]) {
          return clearInterval(timer);
        }
        const name = this.items[index].name.replace(locationReg,'')
        const autoStopInfo = {
          seriesIndex: 0,
          // dataIndex: index,
          name,
        };
       
        this.dispatch('downplay', autoStopInfo)
        index++;
        if (index >= dataLength) {
          index = 0;
          // this.timeInterval.map(_timer => clearInterval(_timer))
          clearInterval(timer)
        }
        const nameText = this.items[index].name.replace(locationReg, '')
        const autoInfo = {
          seriesIndex: 0,
          // dataIndex: index,
          name: nameText,
        };
        this.dispatch('highlight', autoInfo)
        this.dispatch('showTip', autoInfo)
      }, (Number(this.properties.rotationInterval) * 1000));
      this.timeInterval.push(timer);
    }

    myChart.on('mousemove', (e) => {
        clearInterval(timer);
        myChart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: e.dataIndex
      });
    })

    timerPlay();
    this.container.addEventListener('mouseenter', (e: any) => {
      clearInterval(timer)
      this.items.forEach((element, index) => {
        const name = element.name.replace(locationReg,'')
        const selectInfo = {
          seriesIndex: 0,
          // dataIndex: index,
          name: name,
        };
        this.dispatch('downplay',selectInfo)
      });
    })
    this.container.addEventListener('mouseleave', (e: any) => {
      if (timer) clearInterval(timer);
      timerPlay();
    })
  }
  public bindEvents = () => {
    
    this.container.addEventListener('mousedown', (e: any) => {
      document.oncontextmenu = function () { return false; }; 
      if (!e.seriesClick) {
        // clear tooltip
        this.hideTooltip();
        // clear selection
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })
    myChart.off('mouseup')
    const toDrilling = (params: any, isJump?: boolean) => {
        const clickMouse = params.event.event.button;
        if (params.componentType !== 'series') return;
        params.event.event.seriesClick = true;
        const selectionId = this.getNodeSelectionId(params.name);
        const selectInfo = {
          seriesIndex: params.seriesIndex,
          dataIndex: params.dataIndex,
        }; 
        if (selectionId) {
          if (!this.selectionManager.contains(selectionId)) {
            this.selectionManager.select(selectionId, true);
            // this.dispatch('highlight', selectInfo);
            this.selection.push(selectInfo);
          } else {
            this.selectionManager.clear(selectionId);
          }
          if (clickMouse === clickLeftMouse) {
            if (this.properties.clickLeftMouse === 'none' || this.properties.clickLeftMouse === 'showToolTip') {
              return
            } else {
              // if (isTooltipModelShown) return;
              // this.hideTooltip();
              const selectionIds = this.selectionManager.getSelectionIds();
              this.host.commandService.execute([{
                name: isJump ? 'Jump' : this.properties.clickLeftMouse,
                payload: {
                  selectionIds,
                  position: {
                    x: params.event.event.clientX,
                    y: params.event.event.clientY,
                    },
                }
              }])
            }
          } else if (clickMouse === clickRightMouse) {  
            params.event.event.preventDefault();
            this.showTooltip(params.event.event, true);
          }
        }
         
    }
    myChart.on('mouseup', (params) => {
      if (this.properties.MapId !== params.name && this.properties.mapLevel !== 2) {
        if (this.provinceNameData.includes(params.name.replace(locationReg, ''))) {
          this.host.propertyService.setProperty('mapLevel', 1);
          this.host.propertyService.setProperty('MapId', params.name);
          this.host.propertyService.setProperty('provinceName', params.name);
          this.host.propertyService.setProperty('cityName', '');
          this.getMapJson(params.name);
          toDrilling(params);
        }else if (this.cityNameData.includes(params.name.replace(locationReg, ''))) {
          this.host.propertyService.setProperty('mapLevel', 2);
          this.host.propertyService.setProperty('MapId', params.name);
          this.host.propertyService.setProperty('cityName', params.name);
          this.getMapJson(params.name);
        } 
      } else {
        toDrilling(params, true);
      }
    })

    myChart.on('mouseout', (params) => {
      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };
      // this.dispatch('downplay',selectInfo)
    })
  }
  private createBreadcrumb = (name: any, left: any, index: any) => {
    let line = [
      [0, 0],
      [5, 5],
      [0, 10],
    ];
    let breadcrumb = {
      type: "group",
      id: index,
      // left: left,
      // top: 20,
      left: Number(this.properties.mapLevelNameX + left), // 20
      top:  Number(this.properties.mapLevelNameY + 10), // 20
      children: [{
        type: "polyline",
        left: 20,
        top: 0,
        shape: {
          points: line,
        },
        style: {
          stroke: this.properties.mapLevelNameColor,
          key: `${name}`,
        }
      },
      {
        type: "text",
        left: 35,
        top: 0,
        style: {
          text: `${name}`,
          textAlign: "center",
          fill: this.properties.mapLevelNameColor,
          font: '12px "Microsoft YaHei", sans-serif',
        },
        onclick: () => {
          switch (index) {
            case 1:
              this.host.propertyService.setProperty('mapLevel', 1);
              this.host.propertyService.setProperty('MapId', name);
              this.host.propertyService.setProperty('cityName', '');
              this.getMapJson(name);
              break;
            case 2:
              break;
          }
        },
        },
      
      ]
    };
    return this.graphic.push(breadcrumb);
  }

  private getgraphic(mapName: any) {
    mapName = '中国'
    let namelen = mapName.length * 20;
    this.linelen = namelen;
    let arr = [{
      //标题的线
      type: "group",
      left: this.properties.mapLevelNameX, // 15
      top: this.properties.mapLevelNameY, // 10
      zlevel: 10,
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
          stroke: this.properties.mapLevelNameColor,
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
          stroke: this.properties.mapLevelNameColor,
        },
      },
      ],
    },
    {
      //省级标题样式
      id: '中国',
      type: "group",
      left: this.properties.mapLevelNameX + 5, // 20
      top: this.properties.mapLevelNameY + 10, // 20
      children: [
        {
          type: "text",
          left: 0,
          top: 0,
          style: {
            text: '中国',
            textAlign: "center",
            fill: this.properties.mapLevelNameColor,
            font: '12px "Microsoft YaHei", sans-serif',
          },
          onclick: () => {
            this.host.propertyService.setProperty('mapLevel', 0);
            this.host.propertyService.setProperty('MapId', 'china');
            this.host.propertyService.setProperty('provinceName', '');
            this.getMapJson('china');
          },
        }
      ]
    }]
    this.graphic = arr;
  }

  private render() {
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    const items = this.isMock ? Visual.mockItems : this.items;
    let myTooltip = this.myTooltip;
    let options: any= this.properties;
    // echarts.registerMap('3DMapCustom', JSON.parse(JSON.stringify(options.MapId === 'china' ? ChainJson : ShanXiJson)));
    
    // options.automaticRotation && this.preview && this.autoPlayTimer();
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
      graphic: this.graphic,
      tooltip: {
        trigger: 'item',
        // padding: [15, 15],
        show: options.showTooltip,
        backgroundColor: 'transparent',
        borderColor:'transparent',
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
        boxWidth: options.mapBoxWidth,
        boxHeight: options.mapBoxHeight, //4:没有bar. 30:有bar,bar最高度30，按比例分配高度
        regionHeight: options.mapBoxDepth,
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
            
            distance: options.mapAdCodeId === 'china'?  110 : options.mapDistance, //默认视角距离主体的距离
            center: [0, 0, 0],

            animation: true,
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut'
        },
        itemStyle: {
        color: 'red', //地图颜色
        borderWidth: 3, //分界线wdith
        distance: 5,
        borderColor: 'green', //分界线颜色
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
      },
      series: [
        {
            type: 'map3D',
            map: '3DMapCustom',
            name: '3DMapCustom',
            boxWidth: options.mapBoxWidth,
            boxHeight: options.mapBoxHeight,
            regionHeight: options.mapBoxDepth,
            viewControl: {
              projection: 'perspective',
              autoRotate: false,
              damping: 0,
              rotateSensitivity: 2, //旋转操作的灵敏度
              rotateMouseButton: 'left', //旋转操作使用的鼠标按键
              zoomSensitivity: 2, //缩放操作的灵敏度
              panSensitivity: 2, //平移操作的灵敏度
              panMouseButton: 'right', //平移操作使用的鼠标按键

              distance: options.mapAdCodeId === 'china'?  110 : options.mapDistance, //默认视角距离主体的距离
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
                color: options.mapColor, //地图颜色
                borderWidth: options.mapDemarcationBorder, //分界线wdith
                distance: 5,
                borderColor: options.mapDemarcationColor, //分界线颜色
            },
            emphasis: {
                label: {
                    show: true, //是否显示高亮
                    textStyle: {
                        color: '#fff', //高亮文字颜色
                    },
                },
                itemStyle: {
                    color: options.mapHoverColor, //地图高亮颜色
                },
            },
            data: _data,
            zlevel: 1,
          // silent: true,
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