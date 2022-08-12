
import '../style/bootstrap.css';

import videojs from 'video.js'

import $ from 'jquery'

import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'

interface IRenderConfig {
  jData;
  key:string,
  name:string,
  isMock: boolean;
}
export default class Visual extends WynVisual {

  private static defaultConfig: IRenderConfig = {
    jData: [{"name":"测试视频","url":"https://videos.grapecity.com.cn/WynEnterprise/online/20210624_产品应用视频.mp4"}],
    key:'url',
    name:'name',
    isMock: true,
  }

  private dom:HTMLDivElement;
  private styleConfig: any;
  private renderConfig: IRenderConfig;

  private bgImage:string;
  private th_host:any;
  private img_close:any;

  private rg_guid:string;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom=dom;
    this.bgImage= host.assetsManager.getImage('bg');
    this.th_host=host;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.rg_guid=this.guid();
    this.styleConfig = options.properties;
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    if (plainDataView) {
      const key = plainDataView.profile.urlData.values[0].display;
      const name = plainDataView.profile.nameData.values[0].display;
      this.renderConfig = {
        jData: plainDataView.data,
        key:key,
        name:name,
        isMock: false,
      };
    }else{
      this.renderConfig = Visual.defaultConfig;
    }
    if (this.styleConfig.url_show) {
      let r_url = [];
      this.styleConfig.url_def.forEach((x) => {
        if (x.url) {
          r_url.push({'name':x.name,'url': x.url});
        }
      });
      if (r_url.length==0){
        this.renderConfig = Visual.defaultConfig;
      }else{
        this.renderConfig = {
          jData: r_url,
          name:'name',
          key: 'url',
          isMock: false,
        };
      }
    }
    this.render();
    document.documentElement.style.overflowX = 'hidden';
    if (!this.styleConfig.xy_show){
      document.documentElement.style.overflowY = 'hidden';
    }else{
      document.documentElement.style.overflowY = 'scroll';
    }

    if (this.renderConfig.isMock) {
      this.dom.style.opacity = '0.3';
    } else {
      this.dom.style.opacity = '1';
    }
  }



  private render() {
    const style = this.styleConfig;
    const config = this.renderConfig;

    const opt = {
      autoplay: true, // 设置自动播放
      muted: true, // 设置了它为true，才可实现自动播放,同时视频也被静音（Chrome66及以上版本，禁止音视频的自动播放）
      preload: 'auto', // 预加载
      controls: true, // 显示播放的控件
      loop:true,
      poster:this.bgImage
    };

    let jData=[];
    for (const i in config.jData) {
      if(style.data_show){
        if(i>=style.data_value){
          break;
        }
      }
      jData.push(config.jData[i]);
    }

    //判断视频类型
    let videoType = "MP4";
    switch (style.videoType) {
      case "mp4":
        videoType = "video/mp4";
        break;
      case "webm":
        videoType = "video/webm";
        break;
      case "m3u8":
        videoType = "application/x-mpegURL";
        break;
      case "ogg":
        videoType = "video/ogg";
        break;
    }

    //css
    let t_01=document.createTextNode(`.div_fd_0 {z-index:10;width: ${style.img_width}px;height: ${style.img_width}px;}`);
    let t_02=document.createTextNode(`.title{display:black;padding-left:5px;border-radius:${style.radius}px ${style.radius}px 0 0 ;background:${style.title_color};color: ${style.title_style.color}; font-family: ${style.title_style.fontFamily}; font-size: ${style.title_style.fontSize}; font-style:${style.title_style.fontStyle}; font-weight: ${style.title_style.fontWeight};}`);
    let t_03=document.createTextNode(`.card {margin:${style.margin}px;border: ${style.border}px solid ${style.solid};border-radius: ${style.radius}px;background:${style.solid}}`);
    let t_04=document.createTextNode(`.div_fd_1 {position: absolute;z-index:10;width: ${style.img_width}px;height: ${style.img_width}px;top:5px;right:5px;}`);

    const domstyle = document.createElement('style');
    domstyle.appendChild(t_01);
    domstyle.appendChild(t_02);
    domstyle.appendChild(t_03);
    domstyle.appendChild(t_04);
    document.body.appendChild(domstyle);
    const grid = document.createElement('div');
    grid.className = 'container-fluid';
    grid.id='r_item';
    $(this.dom).empty();
    if ($(this.dom).find('.item_content').length == 0) {
      this.dom.append(grid);
    }
    const openImage=this.th_host.assetsManager.getImage(style.img_style);
    let r;
    let videoHeight=style.videoHeight;
    if (jData.length==1){
      videoHeight=$(this.dom).height()-60;
    }
    //填充模式
    if (style.videoAdd=="def"){
      const ys=jData.length%style.videoWidth;
      for (let i = 0; i < ys; i++) {
        jData.push({});
      }
    }

    for (const i in jData) {
      const val = jData[i][config.key];
      const name = jData[i][config.name];

      if (parseInt(i) % style.videoWidth == 0) {
        const row = document.createElement('div');
        row.className = "row";
        row.id = `d_${i}`;
        grid.append(row);
        r = i;
      }
      const v_id = "video_" + i.toString() + this.rg_guid;
      const d_id = "dv_" + i.toString();
      const box_id = "box_" + i.toString();
      if ($(`#${box_id}`).length == 0) {
        if (name != undefined && val != undefined) {
          const v_html = `
            <div id="${box_id}" class="col">
              <div class="card">
                <div class="card-header title">
                    <div class="row">
                        <div class="col">${name}</div>
                        <div class="col" style='text-align:right'>
                            <img title="放大" alt="${val}" ale="${name}" class="div_fd_0" style="cursor: pointer;z-index: 11" src="${openImage}" alt=""/>
                        </div>
                    </div>
                </div>
                <img title="放大" alt="${val}" ale="${name}" class="div_fd_1" style="cursor: pointer;z-index: 11" src="${openImage}" alt=""/>
                <div id="${d_id}" class="card-body">
                </div> 
              </div>
            </div>
            `;
          $(`#d_${r}`).append(v_html);
          $(`#${d_id}`).append(`<video id="${v_id}" class="video-js vjs-big-play-centered" style="width: 100%;height: ${videoHeight}px;"></video>`);
          const player = videojs(v_id, opt);
          player.src([
            {
              src: val,  // 地址
              type: videoType
            }
          ]);
        }else{
          $(`#d_${r}`).append(`<div id="${box_id}" class="col"></div>`);
        }
      } else {
        $(`#${v_id}`).show()
      }
    }

    if (!style.title_show){
      $('.title').hide();
      $('.div_fd_0').hide(1000);
      $('.div_fd_1').show(1000);
    }else{
      $('.title').show();
      $('.div_fd_0').show(1000);
      $('.div_fd_1').hide(1000);
    }
    $('.div_fd').attr('src',openImage);
    const th=this;
    $('.div_fd_0,.div_fd_1').unbind("click");
    $('.div_fd_0,.div_fd_1').bind('click',function(){
      th.openModel(videoType,opt,$(this).attr('alt'),$(this).attr('ale'));
      $('#model_id').attr('class','model animate__animated animate__zoomIn');
      $('#model_id').show();
    });
    this.openStyle();
  }

  private guid() {
    return 'Axxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private openStyle(){
    const style = this.styleConfig;
    const domstyle = document.createElement('style');

    const height=document.body.clientHeight-60;
    const v_height=height-style.div_height-2*style.v_border;
    //弹出框
    const t_01=document.createTextNode(`.model{position: absolute;left: 10px;right: 10px;top: 10px;height: ${height}px;border-radius:6px;z-index: 120;border: ${style.v_border}px solid ${style.v_solid};border-radius: ${style.v_radius}px;background:${style.v_solid}}`);
    const t_02=document.createTextNode(`.timg {width: 100%;padding-top:${style.div_height}px;height: ${v_height}px;border-radius:0 0 6px 6px;}`);
    const t_03=document.createTextNode(`.title_rc{position:absolute;padding-left:5px;position: absolute;border-radius: 6px 6px 0 0;background: ${style.div_color};left:0px;right:0px;text-align: ${style.div_loc};line-height:${style.div_height}px;height:${style.div_height}px;color: ${style.title_div.color}; font-family: ${style.title_div.fontFamily}; font-size: ${style.title_div.fontSize}; font-style:${style.title_div.fontStyle}; font-weight: ${style.title_div.fontWeight};}`);
    const t_04=document.createTextNode(`.div_gb{position:absolute;width: ${style.div_width}px;height: ${style.div_width}px;right: 5px;top: 5px;}`);
    domstyle.appendChild(t_01);
    domstyle.appendChild(t_02);
    domstyle.appendChild(t_03);
    domstyle.appendChild(t_04);
    document.body.appendChild(domstyle);
    this.img_close=this.th_host.assetsManager.getImage(style.div_style);
    $('.div_gb').attr('src',this.img_close);
  }
  private openModel(videoType,opt,url,name){
    const mod=document.createElement('div');
    mod.className='model ';
    mod.id='model_id';
    if ($('#model_id').length==0){
      this.dom.append(mod);
    }
    $('#model_id').empty();
    const div_dideo='Mu_'+this.guid();
    $('#model_id').append(`<div class="title_rc">${name}<img title="关闭" class="div_gb" style="cursor: pointer" src="${this.img_close}" alt=""/></div><div class="timg"><video id="${div_dideo}" class="timg video-js vjs-big-play-centered" style=""></video></div>`);
    const player = videojs(div_dideo, opt);
    player.src([
      {
        src: url,  // 地址
        type: videoType
      }
    ]);

    $('.div_gb').unbind("click");
    $('.div_gb').bind('click',function(){
      $('#model_id').attr('class','model animate__animated animate__zoomOut');
      setTimeout(function (){
        $('#model_id').hide();
      },500);
    });
  }

  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let prop = options.properties;
    let states = [];
    if (!prop.data_show) {
      states.push("data_value");
    }
    if (!prop.url_show) {
      states.push("url_def");
    }
    if (!prop.title_show){
      states.push("title_style","title_color","img_width","img_style",);
    }
    return states;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let prop = options.properties;
    let states = [];
    if (prop.data_show) {
      states.push("data_value");
    }
    if (!prop.url_show) {
      states.push("url_def");
    }
    if (prop.title_show){
      states.push("title_style","title_color","img_width","img_style",);
    }
    return states;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}