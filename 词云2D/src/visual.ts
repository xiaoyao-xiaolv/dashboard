import '../style/visual.less';
var echarts = require('echarts');
require('echarts-wordcloud');

export default class Visual {
  private container: HTMLDivElement;
  private visualHost: any;
  private chart: any;
  private items: any;
  private properties: any;

  static mockItems = [{ "name": "山西省", "value": 2201 }, { "name": "江苏省", "value": 1251 }, { "name": "西藏自治区", "value": 1104 }, { "name": "陕西省", "value": 1529 }, { "name": "四川省", "value": 2771 }, { "name": "江西省", "value": 1649 }, { "name": "河南省", "value": 2566 }, { "name": "河北省", "value": 2256 }, { "name": "新疆维吾尔自治区", "value": 1332 }, { "name": "福建省", "value": 1077 }, { "name": "吉林省", "value": 814 }, { "name": "安徽省", "value": 1290 }, { "name": "重庆市", "value": 748 }, { "name": "云南省", "value": 1770 }, { "name": "甘肃省", "value": 971 }, { "name": "广西壮族自治区", "value": 1338 }, { "name": "广东省", "value": 1677 }, { "name": "黑龙江省", "value": 1884 }, { "name": "山东省", "value": 1908 }, { "name": "湖南省", "value": 1338 }, { "name": "海南省", "value": 504 }, { "name": "内蒙古自治区", "value": 1087 }, { "name": "上海市", "value": 140 }, { "name": "辽宁省", "value": 1513 }, { "name": "青海省", "value": 980 }, { "name": "宁夏回族自治区", "value": 354 }, { "name": "湖北省", "value": 1204 }, { "name": "北京市", "value": 184 }, { "name": "浙江省", "value": 1262 }, { "name": "贵州省", "value": 914 }, { "name": "澳门特别行政区", "value": 190 }, { "name": "香港特别行政区", "value": 104 }, { "name": "天津市", "value": 176 }];
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.visualHost = host;
    this.chart = echarts.init(dom)
    this.items = [];
    this.properties = {
      shape: 'circle',
      showImage: false
    };
    this.render();
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.values.values.length && dataView.plain.profile.dimensions.values.length) {
      const plainData = dataView.plain;
      let dimensions = plainData.profile.dimensions.values;
      let values = plainData.profile.values.values;
      this.items = plainData.data.map(function (item) {
        return {
          name: item[dimensions[0].display],
          value: item[values[0].display] || 0,
        };
      });
    }
    this.properties = options.properties;
    this.render();
  };

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    var option = {
      tooltip: {
        show: true
      },
      series: [{
        type: 'wordCloud',
        shape: options.shape,
        sizeRange: [12, 50],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 2,
        drawOutOfBound: false,
        textStyle: {
          normal: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            color: function () {
              return 'rgb(' + [
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255),
                Math.round(Math.random() * 255)
              ].join(',') + ')';
            }
          },
          emphasis: {
            shadowBlur: 10,
            shadowColor: '#333'
          }
        },
        left: "center",
        top: "center",
        right: null,
        bottom: null,
        width: "100%",
        height: "100%",
        data: items
      }]
    };
    this.chart.setOption(option);
    if (options.showImage) {
      var that = this;
      var maskImage = new Image();
      maskImage.onload = function () {
        that.chart.setOption({
          series: [{
            maskImage: maskImage
          }]
        });
      }
      maskImage.src = options.maskImage || this.visualHost.assetsManager.getImage('testImg')
    }
  }
  public onDestroy() {
  }
  public onResize() {
    this.chart.resize();
    this.render();
  }

  // 自定义属性可见性
  public getInspectorHiddenState(updateOptions: any): string[] {
    if (!updateOptions.properties.showImage) {
      return ['maskImage'];
    }
    return null;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}