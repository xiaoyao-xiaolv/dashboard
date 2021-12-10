import '../style/visual.less';
import cityID from './cityID.json';

let timer = null;
let index = 1;

export default class Visual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;
  private cityListCode: any;
  private cityID: any;

  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.visualHost = host;
    this.cityID = cityID;
    this.properties = {};
  }

  public update(options: any) {
    this.properties = options.properties;
    let config;
    if(options.isFocus || options.isViewer || options.updateType === "propertyChange" || options.updateType === "dataViewChange") {
      this.cityListCode = [];
      switch (this.properties.mode) {
        case 'standard' :
          config = {
            "layout": "1",
            "width": this.properties.width,
            "height": this.properties.height,
            "background": 1,
            "dataColor": this.properties.dataColor,
            "borderRadius": this.properties.borderRadius,
            "key": "e1b995f9292e4303ab28f145ffb6a95d"
          };
          break;
        case 'simple' :
          config = {
            "modules": "012",
            "background": "1",
            "tmpColor": this.properties.dataColor,
            "tmpSize": "18",
            "cityColor": this.properties.dataColor,
            "citySize": "18",
            "aqiColor": this.properties.dataColor,
            "aqiSize": "18",
            "weatherIconSize": "24",
            "alertIconSize": "18",
            "padding": "10px 10px 10px 10px",
            "shadow": "0",
            "borderRadius": this.properties.borderRadius,
            "fixed": "false",
            "vertical": "top",
            "horizontal": "left",
            "key": "78a121dbb5e240d6be62c34d1841131b"
          }
      }

      if(this.properties.language !== "") {
        config["language"] = this.properties.language;
      }

      if(this.properties.autoBackgroundColor) {
        config.background = 4;
        config["backgroundColor"] = this.properties.backgroundColor;
      }

      let autoChangeCity = () => {
        if (timer) clearInterval(timer);
        timer = setInterval(() => {
          config["city"] = this.cityListCode[index];
          this.render(config);
          index++;
          if (index === this.cityListCode.length) {
            index = 0;
          }
        }, this.properties.intervalTime * 1000);
      }

      if(!this.properties.autoCity) {
        let cityList = this.properties.cityList.map(city => city.trim());
        cityList.forEach(((city) => {
          if(city !== '' && this.cityID[`${city}`]) {
            this.cityListCode.push(this.cityID[`${city}`]);
          }
        }))
        if (this.cityListCode.length > 1) {
          this.render(config);
          autoChangeCity();
        } else {
          config["city"] = this.cityListCode[0];
          if (timer) clearInterval(timer);
          this.render(config);
        }
      } else {
        if (timer) clearInterval(timer);
        this.render(config);
      }
    }
  };

  private render(config) {
    this.container.innerHTML = '';
    let div = document.createElement('div');
    div.id = `he-plugin-${this.properties.mode}`;

    let configScript = document.createElement('script');
    configScript.type = "text/javascript";

    let jsScript = document.createElement('script');
    jsScript.type = "text/javascript";
    jsScript.src = `https://widget.heweather.net/${this.properties.mode}/static/js/he-${this.properties.mode}-common.js?v=2.0`;

    this.container.appendChild(div);
    this.container.appendChild(configScript);
    this.container.appendChild(jsScript);

    let WIDGET = {
      CONFIG: config
    }
    configScript.innerHTML = "WIDGET="+JSON.stringify(WIDGET);
  }

  public getInspectorHiddenState(updateOptions: any): string[] {
      const hiddenStatus = [];

      if (updateOptions.properties.autoCity) {
        Array.prototype.push.apply(hiddenStatus, ['cityList', 'intervalTime']);
      }

      if (updateOptions.properties.mode === 'simple') {
        Array.prototype.push.apply(hiddenStatus, ['width', 'height']);
      }

      if (!updateOptions.properties.autoBackgroundColor) {
        hiddenStatus.push('backgroundColor');
      }

      return hiddenStatus;
  }

  // 自定义属性可见性
  public getInspectorVisibilityState(properties: any): string[] {
    return null;
  }
  // 功能按钮可见性
  public getActionBarVisibilityState(updateOptions: any): string[] {
    return null;
  }
  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}
