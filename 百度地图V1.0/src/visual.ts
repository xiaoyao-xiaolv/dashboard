import '../style/visual.less';

// @ts-ignore
import BMapGL from 'BMapGL';
// @ts-ignore
import BMapGLLib from 'BMapGLLib';

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
  private map:any;

  //数据key
  private key_val:any;
  private key_loc:any;
  private key_lng:any;
  private key_lat:any;
  private key_para=[];

  //数据类型
  /***
   * true 为 地址 false 为 坐标
   * @private
   */
  private _dtype:boolean;
  private _data:any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom = dom;
    this.map = new BMapGL.Map("visualDom");    // 创建Map实例
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.styleConfig = options.properties;
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    if (plainDataView) {
      this.key_val = plainDataView.profile.values.values[0].display;
      //地址
      if (plainDataView.profile.location.values.length!=0){
        this.key_loc = plainDataView.profile.location.values[0].display;
        this._dtype=true;
      }else{
        //经纬度
        this.key_lat = plainDataView.profile.latitude.values[0].display;
        this.key_lng = plainDataView.profile.longitude.values[0].display;
        this._dtype=false;
      }
      //参数字段
      plainDataView.profile.para.values.forEach((x)=>{
        this.key_para.push(x.display);
      });

      this.renderConfig ={
        data:plainDataView.data,
        isMock:false
      };
    }else{
      this.renderConfig = Visual.defaultConfig;
    }

    this.render();
  }

  private render() {
    const styleConfig=this.styleConfig;
    const config=this.renderConfig;
    this.map.centerAndZoom(this.isCoordinate(styleConfig.centralLocation), styleConfig.zoom);  // 初始化地图,设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(styleConfig.zoomEnable);     //开启鼠标滚轮缩放
    this.map.setHeading(styleConfig.map_heading);
    this.map.setDisplayOptions({
      poiText: styleConfig.poiText,
      poiIcon: styleConfig.poiIcon
    });
    if (styleConfig.trafficOn){
      this.map.setTrafficOn();
    }else{
      this.map.setTrafficOff();
    }
    //开启卫星地图
    if(styleConfig.wx_show){
      this.map.setMapType(BMAP_EARTH_MAP);
    }else{
      this.map.setMapType(BMAP_NORMAL_MAP);
    }
    //3D视图
    if (styleConfig.sd_show){
      this.map.setTilt(styleConfig.wx_tilt);
      this.map.setDisplayOptions({
        skyColors: [styleConfig.wx_zs_skyColors,styleConfig.wx_gds_skyColors]
      })
    }
    if (styleConfig.scaleControl){
      this.map.addControl( new BMapGL.ScaleControl());
    }
    if (styleConfig.zoomControl){
      this.map.addControl( new BMapGL.ZoomControl());
    }
    if (styleConfig.control3D){
      this.map.addControl( new BMapGL.NavigationControl3D());
    }
    //添加标点
    if (styleConfig.mk_type){
      this.map.clearOverlays();
      // 创建图标
      let myIcon=null;
      if (styleConfig.mk_icon.length>15){
        myIcon = new BMapGL.Icon(styleConfig.mk_icon, new BMapGL.Size(styleConfig.mk_width, styleConfig.mk_height),{
          anchor: new BMapGL.Size(styleConfig.mk_x, styleConfig.mk_y)
        });
      }
      // 创建Marker标点
      config.data.forEach((x)=>{
        if (this._dtype){
          this.addressToPoint(styleConfig,x[this.key_loc],null,myIcon);
        }else{
          const point = new BMapGL.Point(x[this.key_lng], x[this.key_lat]);
          const marker = new BMapGL.Marker(point, {
            icon: myIcon
          });
          this.map.addOverlay(marker);
        }
      });
    }else{
      this.map.clearOverlays();
    }
    //选中区域设置
    this.DrawArea(styleConfig);
    //路线设置
    if (styleConfig.yd_icon_show && styleConfig.yd_show){
      if (styleConfig.yd_line_class=="GD"){
        if (styleConfig.yd_line_text){

        }
      }else{
        if (styleConfig.yd_line_star!="" && styleConfig.yd_line_end!=""){

        }
      }
      var path = [{
        'lng': 116.297611,
        'lat': 40.047363
      }, {
        'lng': 103.307223,
        'lat': 40.056379
      }];

      var point = [];
      for (var i = 0; i < path.length; i++) {
        point.push(new BMapGL.Point(path[i].lng, path[i].lat));
      }
      var polyline = new BMapGL.Polyline(point, {
        strokeColor:styleConfig.yd_strokeColor,
        strokeWeight:styleConfig.yd_strokeWeight,
        strokeOpacity:parseFloat(styleConfig.yd_strokeOpacity)*0.01
      });

      var fly = 'data:image/png;base64,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';
      const lushu = new BMapGLLib.LuShu(this.map, polyline.getPath(), {
        geodesic: true,
        autoView:styleConfig.yd_autoCenter,
        autoCenter: styleConfig.yd_autoCenter,
        icon: new BMapGL.Icon(fly, new BMapGL.Size(styleConfig.dy_icon_size, styleConfig.dy_icon_size), { anchor: new BMapGL.Size(styleConfig.dy_icon_xy, styleConfig.dy_icon_xy) }),
        speed: styleConfig.dy_icon_speed,
        enableRotation: styleConfig.yd_icon_xz
      });
      lushu.start();
      if (styleConfig.yd_line_show){
        this.map.addOverlay(polyline);
      }

    }

  }

  /**
   * 根据名称获取经纬度坐标
   * @param address
   * @param city
   * @private
   */
  private addressToPoint(styleConfig,address,city,icon) {
    const myGeo = new BMapGL.Geocoder();
    // 将地址解析结果显示在地图上，并调整地图视野
    const th = this;
    myGeo.getPoint(address, function (point) {
      if (point) {
        const marker = new BMapGL.Marker(point, {
          icon: icon,
          title: address
        });
        th.map.addOverlay(marker);
      } else {
        return null;
      }
    }, city);
  }
  /**
   * 绘制区域
   * @param styleConfig
   * @constructor
   * @private
   */
  private DrawArea(styleConfig){
    const th=this;
     if (styleConfig.qy_show){
       const citys=styleConfig.qy_citys.split(',');
       citys.forEach((x)=>{
         var bd = new BMapGL.Boundary();
         bd.get(x, function (rs) {
           var count = rs.boundaries.length; //行政区域的点有多少个
           //高亮显示
         if (!styleConfig.qy_type) {
            for (var i = 0; i < count; i++) {
              let path = [];
              const str = rs.boundaries[i].replace(' ', '');
              const points = str.split(';');
              for (var j = 0; j < points.length; j++) {
                var lng = points[j].split(',')[0];
                var lat = points[j].split(',')[1];
                path.push(new BMapGL.Point(lng, lat));
              }
              var prism = new BMapGL.Prism(path, parseInt(styleConfig.qy_height) * 100, {
                topFillColor: styleConfig.qy_topFillColor,
                topFillOpacity: parseFloat(styleConfig.qy_topFillOpacity) / 100,
                sideFillColor: styleConfig.qy_sideFillColor,
                sideFillOpacity: parseFloat(styleConfig.qy_sideFillOpacity) / 100
              });
              th.map.addOverlay(prism);
            }
           }else{
              for (var i = 0; i < count; i++) {
                var ply = new BMapGL.Polygon(rs.boundaries[i], {strokeWeight: 1, strokeColor: '#2eb60c'}); // 建立多边形覆盖物
               th.map.addOverlay(ply);
              }
           }
        });
       });
     }
  }
  /**
   * 判断是否为经纬度坐标
   * @param coord
   * @private
   */

  private isCoordinate(coord){
    let centralLocation;
    const regex=/^\d+(\.\d+)?,\d+(\.\d+)?$/;
    if (regex.test(coord)){
      const lng_lat=coord.split(',');
      centralLocation=new BMapGL.Point(lng_lat[0], lng_lat[1]);
    }else{
      centralLocation=coord;
    }
    return centralLocation;
  }



  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let prop = options.properties;
    let hides = [];

    //移动轨迹
    if (!prop.yd_show){
      hides.push("yd_line_class","yd_dh_type","yd_line_text","yd_line_star","yd_line_end","yd_icon_show","yd_line_icon","dy_icon_size","dy_icon_xy","dy_icon_speed","yd_icon_xz","yd_autoCenter","yd_line_show","yd_strokeColor","yd_strokeWeight","yd_strokeOpacity");
    }
    //显示图标
    if (!prop.yd_icon_show){
      hides.push("dy_icon_size","dy_icon_xy","yd_icon_xz","dy_icon_speed","yd_line_icon")
    }
    //显示路线
    if (!prop.yd_line_show){
      hides.push("yd_strokeColor","yd_strokeOpacity","yd_strokeWeight")
    }
    //路线类型
    if (prop.yd_line_class!="DH"){
      hides.push("yd_dh_type","yd_line_star","yd_line_end")
    }else{
      hides.push("yd_line_text")
    }
    //显示标点
    if (!prop.mk_type){
      hides.push("mk_icon","mk_width","mk_height","mk_x","mk_y")
    }
    return hides;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let prop = options.properties;
    let shows = [];

    //移动轨迹
    if (prop.yd_show){
      shows.push("yd_line_class","yd_dh_type","yd_line_text","yd_line_star","yd_line_end","yd_icon_show","yd_line_icon","dy_icon_size","dy_icon_xy","dy_icon_speed","yd_icon_xz","yd_autoCenter","yd_line_show","yd_strokeColor","yd_strokeWeight","yd_strokeOpacity");
    }
    //显示图标
    if (prop.yd_icon_show){
      shows.push("dy_icon_size","dy_icon_xy","yd_icon_xz","dy_icon_speed","yd_line_icon")
    }
    //显示路线
    if (prop.yd_line_show){
      shows.push("yd_strokeColor","yd_strokeOpacity","yd_strokeWeight")
    }
    //路线类型
    if (prop.yd_line_class=="DH"){
      shows.push("yd_dh_type","yd_line_star","yd_line_end")
    }else{
      shows.push("yd_line_text")
    }
    //移动轨迹
    if (prop.yd_show){
      shows.push("yd_line_class","yd_dh_type","yd_line_text","yd_line_star","yd_line_end","yd_icon_show","yd_line_icon","dy_icon_size","dy_icon_xy","dy_icon_speed","yd_icon_xz","yd_autoCenter","yd_line_show","yd_strokeColor","yd_strokeWeight","yd_strokeOpacity");
    }
    //显示标点
    if (prop.mk_type){
      shows.push("mk_icon","mk_width","mk_height","mk_x","mk_y")
    }
    if (prop.wx_show){

    }
    return shows;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}