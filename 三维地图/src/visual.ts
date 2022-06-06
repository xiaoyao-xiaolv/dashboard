import '../style/visual.less';
// @ts-ignore
import AMap from 'AMap';

import $ from 'jquery';
import jslinq from "jslinq";

import AreaJson from './AreaJson.json';
interface IRenderConfig {
  isMock: boolean;
}

export default class Visual extends WynVisual {

  private static defaultConfig: IRenderConfig = {
    isMock: true
  }


  private dom: HTMLDivElement;
  private container:HTMLDivElement;
  private map: any;
  private styleConfig: any;
  private renderConfig: IRenderConfig;

  private host: any;
  private selectionManager: any;
  private isViewer:boolean;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom = dom;
    this.container = document.createElement('div');
    this.container.className = 'outer-box';
    this.container.id = 'container';

    this.dom.append(this.container);
    this.isViewer=options.isViewer;
    this.host = host;
    this.selectionManager = host.selectionService.createSelectionManager();
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.styleConfig = options.properties;
    this.render();
  }
  public render() {
    const style=this.styleConfig;
    var opts = {
      subdistrict: 0,
      extensions: 'all',
      level: 'city'
    };
    //也可以直接通过经纬度构建mask路径
    var district = new AMap.DistrictSearch(opts);

    const th=this;

    let city = jslinq(AreaJson).where(x => x.name.indexOf(style.centerText.trim()) > -1)["items"];
    if (city.length==0){
      city = jslinq(AreaJson).where(x => x.name=='北京市')["items"];
    }
    district.search(city[0].name, function(status, result) {
      var bounds = result.districtList[0].boundaries;
      var mask = []
      for(var i =0;i<bounds.length;i+=1){
        mask.push([bounds[i]])
      }
      th.map = new AMap.Map('container', {
        mask: mask,
        center:city[0].center,
        disableSocket:true,
        viewMode:'3D',
        mapStyle: 'amap://styles/'+style.mapStyle,
        showLabel:false,
        labelzIndex:130,
        pitch:style.pitch,
        zoom:style.zoom,
        zooms:[style.zoom_min,20],
        layers:[
          new AMap.TileLayer.Satellite()
        ]
      });

      //卫星地图
      var roadNetLayer = new AMap.TileLayer.RoadNet();


      if (style.v_dl) {
        th.map.add(roadNetLayer);
      }

      //添加高度面
      var object3Dlayer = new AMap.Object3DLayer({zIndex:1});
      th.map.add(object3Dlayer);
      var wall = new AMap.Object3D.Wall({
        path:bounds,
        height:0-style.height*10,
        color:style.wall_color
      });
      wall.transparent = true
      object3Dlayer.add(wall)
      //添加描边
      for(var i =0;i<bounds.length;i+=1){
        new AMap.Polyline({
          path:bounds[i],
          strokeColor:style.bg_strokeColor,
          strokeWeight:style.strokeWeight,
          map:th.map
        })
      }
      if (style.sn_show){
        loadBoundar(city[0].adcode);
      }

    });

    function loadBoundar(adcode){
      let citys = jslinq(AreaJson).where(x => x.parent==adcode)["items"];
      citys.forEach((x)=>{
        district.search(x.name, function(status, res) {
          let bound = res.districtList[0].boundaries;
          //添加描边
          for(var i =0;i<bound.length;i+=1){
            new AMap.Polyline({
              path:bound[i],
              strokeColor:style.bg_strokeColor,
              strokeWeight:style.strokeWeight,
              map:th.map
            })
          }
        });
        if (style.v_text){
          //标题
          var text = new AMap.Text({
            text: x.name + '</br>(' + x.adcode + ')',
            verticalAlign: 'bottom',
            position: x.center,
            height: 50,
            style: {
              'background-color': style.bt_bgcolor,
              'border': `1px solid ${style.bt_text}`,
              '-webkit-text-stroke-width': '0.5px',
              'text-align': 'center',
              ...style.bt_text_style
            }
          });

          text.setMap(th.map);
        }

      })

    }

  }

  public onDestroy(): void {

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