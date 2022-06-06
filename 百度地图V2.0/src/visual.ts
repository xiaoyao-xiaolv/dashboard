import '../style/visual.less';


// @ts-ignore
import BMapGL from 'BMapGL';
// @ts-ignore
import BMapGLLib from 'BMapGLLib';

import mapvgl =require('mapvgl');

import jslinq from "jslinq";

import AreaJson from './AreaJson.json';


/**
 * 雷达图
 */
import _circle = require("./MCircleLayer");
import _heatmap =require("./MHeatmapLayer");
/**
 * 主题样式
 */
import _bmapStyle =require("./BMapStyle");



interface IRenderConfig {
  data;
  isMock:boolean;
}


export default class Visual extends WynVisual {

  private static defaultConfig: IRenderConfig = {
    data:[],
    isMock:true
  };

  private styleConfig: any;
  private renderConfig: IRenderConfig;
  private dom: HTMLDivElement;
  private container: HTMLDivElement;
  private map:any;
  private view:any;

  //上次修改的样式
  private _oldStryle:string;

  //数据绑定字段
  private _numKey:string;
  private _titleKey:string;
  private _addKey:string;
  private _lngKey:string;
  private _latKey:string;
  private _dataType:string;
  private _tooltipFields: any;

  //数据整合
  private _items:any;
  private maxNum:any;

  public oldStyle:any;


  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);

    this.dom = dom;

    this.container = document.createElement('div');
    this.container.id = 'container';

    this.dom.append(this.container);
    this.map = new BMapGL.Map("container",{
      style:{}
    });

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.dateLog(0);
    this.styleConfig = options.properties;
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    if (plainDataView) {
      this._numKey= plainDataView.profile.values.values[0].display;
      this._titleKey= plainDataView.profile.title.values[0].display;
      //地址
      if (plainDataView.profile.location.values.length!=0){
        this._addKey= plainDataView.profile.location.values[0].display;
        this._dataType="D";
      }
      //经纬度
      if (plainDataView.profile.longitude.values.length!=0 && plainDataView.profile.latitude.values.length!=0){
        this._lngKey= plainDataView.profile.longitude.values[0].display;
        this._latKey= plainDataView.profile.latitude.values[0].display;
        this._dataType="L";
      }

      const points=[];
      plainDataView.data.forEach((items) => {
        if (this._dataType=="D"){
          const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(items[this._addKey])) > -1 && r.name.substring(3)==this.AreaFormatter(items[this._addKey]).substring(3) )["items"];
          if (area.length>0) {
            points.push({
              r_key:"".concat(area[0].lng.toString().replace('.',''),"_",area[0].lng.toString().replace('.','')),
              name:area[0].name,
              lng:area[0].lng,
              lat:area[0].lat,
              data:items
            });
          }
        }else{
          //if (this.checkLng(items[this._lngKey]) && this.checkLat(items[this._latKey])) {
            points.push({
              r_key:"".concat(items[this._lngKey].toString().replace('.',''),"_",items[this._latKey].toString().replace('.','')),
              name:items[this._titleKey],
              lng:items[this._lngKey],
              lat:items[this._latKey],
              data:items
            });
          //}
        }
      });
      const th=this;
      this._items=jslinq(points).groupBy(x=>x['r_key'])["items"];
      this.maxNum=1;
      this._items.map((item, index) => {
        let rNum=0;
        item.elements.forEach((x)=>{
          rNum+=x.data[th._numKey];
        });
        if (rNum>this.maxNum){
          this.maxNum=rNum;
        }
      });

      this.renderConfig = {
        data:points,
        isMock: true
      };
    }else{
      this._items=[];
    }
    this.dateLog(1);
    this.render();

  }

  /**
   * 打印时间日志
   * @param type
   */
  public dateLog(type){
    const tName=type==0?"开始":"结束";
    console.log(tName,this.dateFtt(new Date()));
  }
  /**
   * 时间格式化
   * @param date
   * @param fmt
   */
  public dateFtt(date,fmt="yyyy-MM-dd hh:mm:ss.S"){
    var o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  }


  private render() {
    const styleConfig=this.styleConfig;
    const config=this.renderConfig;

    if (this.oldStyle!=styleConfig){
      this.oldStyle=styleConfig;
      this.map.centerAndZoom(this.strToCoord(styleConfig.centralLocation), styleConfig.zoom);  // 初始化地图,设置中心点坐标和地图级别
      this.map.setZoom(styleConfig.zoom);
      //开启鼠标滚轮缩放
      if (styleConfig.zoomEnable){
        this.map.enableScrollWheelZoom();
      }else{
        this.map.disableScrollWheelZoom();
      }
      this.map.enableKeyboard();
      this.map.enableInertialDragging();
      this.map.enableContinuousZoom();
      this.map.setHeading(styleConfig.map_heading);
      this.map.setDisplayOptions({
        poiText: styleConfig.poiText,
        poiIcon: styleConfig.poiIcon
      });
      //更改主题
      if (this._oldStryle!=styleConfig.mapStyle){
        const _style=new _bmapStyle.BMapStyle().mapStyle(styleConfig.mapStyle);
        this.map.setMapStyleV2({
          styleJson:_style
        });
        this._oldStryle=styleConfig.mapStyle;
      }
      //倾斜角度
      this.map.setTilt(styleConfig.wx_tilt);
      //天空颜色
      this.map.setDisplayOptions({
        skyColors: [styleConfig.wx_zs_skyColors,styleConfig.wx_gds_skyColors]
      });

      const _this=this;
      if (!this.view){
        this.view = new mapvgl.View({
          map: _this.map
        });
      }else{
        this.view.removeAllLayers();
      }


    }
    //图点处理
    switch (styleConfig.mapType){
      case 'point':
        const _cire = new _circle.MCircleLayer();
        _cire.buildChart(this);
        break;
      case 'heatmap':
        const _heat = new _heatmap.MHeatmapLayer();
        _heat.buildChart(this);
        break;
      default:
        break;
    }
  }
  /**
   * 转换坐标点
   * @param coord
   * @private
   */

  private strToCoord(coord){
    let centralLocation;
    const regex=/^\d+(\.\d+)?,\d+(\.\d+)?$/;
    if (regex.test(coord)){
      const lng_lat=coord.split(',');
      centralLocation=new BMapGL.Point(lng_lat[0], lng_lat[1]);
    }else{
      const area = jslinq(AreaJson).where(r => r.name.indexOf(this.AreaFormatter(coord)) > -1 && r.name.substring(3)==this.AreaFormatter(coord).substring(3) )["items"];
      if (area.length>0){
        centralLocation=new BMapGL.Point(area[0].lng, area[0].lat);
      }else{
        centralLocation=new BMapGL.Point(116.305354, 40.055018);
      }

    }
    return centralLocation;
  }
  /**
   * 格式化区县名称
   * @param name
   * @constructor
   */
  public AreaFormatter(name){
    switch (name) {
      case '西藏藏族自治区':
      case '西藏':
        name = '西藏自治区';
        break;
    }
    return name;
  }

  /**
   * 检查经度是否合法
   * @param lon 经度
   * @returns 返回true|false
   */
  public checkLng(lon) {
    var reg = /^(\-|\+)?\d+(\.\d+)?$/;
    if (reg.test(lon)){
      if (parseFloat(lon)>=-180 && parseFloat(lon)<=180){
        return true;
      }
    }
    return false;
  };

  /**
   * 检查纬度是否合法
   * @param lat 维度
   * @returns 返回true|false
   */
  public checkLat(lat) {
    var reg = /^(\-|\+)?\d+(\.\d+)?$/;
    if (reg.test(lat)){
      if (parseFloat(lat)>=-90 && parseFloat(lat)<=90){
        return true;
      }
    }
    return false;
  };

  public onDestroy(): void {

  }

  /**
   * 隐藏
   * @param options
   */
  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let properties = options.properties;
    let states = [];
    //图点类型
    if (properties.mk_type!='radar') {
      states = states.concat(["ra_fx","ra_random","ra_duration","ra_trail"]);
    }
    return states;
  }

  /***
   * 显示
   * @param options
   */
  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let properties = options.properties;
    let states = [];
    //图点类型
    if (properties.mk_type=='radar') {
      states = states.concat(["ra_fx","ra_random","ra_duration","ra_trail"]);
    }

    return states;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}