import '../style/visual.less';
export default class Visual {
  private container: HTMLDivElement;
  private properties: any;
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.properties = {
      videoUrl: 'http://video1.grapecity.com.cn/WynEnterprise/online/wyn3.0.mp4',
    };
    this.render();
  }

  public update(options: any) {
    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.container.innerHTML = "";
    const options = this.properties;
    let video: any = document.createElement("video");
    video.muted = true;
    video.setAttribute("controls", "controls");
    video.setAttribute("autoplay", "autoplay");
    video.setAttribute("loop", "loop");
    video.setAttribute("preload", "auto");
    video.setAttribute("height", "100%");
    video.setAttribute("width", "100%");
    video.setAttribute("src", options.videoUrl);
    this.container.appendChild(video);
  }

  public getInspectorVisibilityState(properties: any): string[] {
    return null;
  }
  public getActionBarVisibilityState(updateOptions: any): string[] {
    return null;
  }
  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}
