import '../style/visual.less';
import * as echarts from 'echarts';
//@ts-ignore
import liquidfill from 'echarts-liquidfill'
(window as any).q = liquidfill;
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private items: any;
  private angle = 0;
  private series: any;
  private properties: any;
  private ActualValue: any;
  private ContrastValue: any;
  static mockItems = 0.5;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
      outsideColor:"#0ff",
      insideColor:"#0ff",
      pointColor:"#0ff",
    };
    this.animation();
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    if (dataView && dataView.plain.profile.ActualValue.values.length) {
      const plainData = dataView.plain;
      this.ActualValue = plainData.profile.ActualValue.values;
      this.ContrastValue = plainData.profile.ContrastValue.values;
      this.items = this.ContrastValue.length ? ([<number>plainData.data[0][this.ActualValue[0].display] / <number>plainData.data[0][this.ContrastValue[0].display]]) : [plainData.data[0][this.ActualValue[0].display]];
    }
    this.properties = options.properties;
    this.render();

  }

  private findInterval(options: any, items: any) {
    for (let index = 0; index < 5; index++) {
      let name = 'Interval' + (index + 1);
      let flag = false;
      let str = options[name].split(",");
      if (str.length - 1) {
        let left = str[0].length;
        let right = str[1].length;
        if (left - 1) {
          let leftValue = str[0].substring(1);
          flag = str[0].substring(0, 1) === "[" ? (items >= leftValue) : (items > leftValue);
        }
        if (right - 1) {
          let rightValue = str[1].substring(0, str[1].length - 1);
          flag = str[1].substring(right - 1, right) === "]" ? (items <= rightValue) : (items < rightValue);
        }
      }
      if (flag) {
        return index;
      }
    }
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }
    let color = !options.showColor ? options.piecesColor[0] : options.piecesColor[this.findInterval(options, items)];
    this.series = 
      {
        type: 'liquidFill',
        radius: '78%',
        name: options.subtitle,
        shape: options.shape,
        center: ['50%', '50%'],
        data: [items, items * 0.9, items * 0.8, items * 0.7],
        color: [color],
        outline: {
          show: options.showoutline,
          borderDistance: options.borderDistance,
          itemStyle: {
            borderWidth: options.outlineborderWidth,
            borderColor: options.outlineborderColor,
          }
        },
        backgroundStyle: {
          borderWidth: options.borderWidth,
          borderColor: options.borderColor,
          color: options.backgroundColor
        },
        label: {
          show: options.showlabel,
          formatter: function () {
            return (items * 100).toFixed(2) + '%';
          },
          color: options.textStyle.color,
          fontSize: options.textStyle.fontSize.substr(0, 2),
          fontWeight: fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle,
          insideColor: '#fff',
        }
      }
    var option = {
      series: [this.series]
    };
    this.chart.setOption(option);
  }

  private animation() {
    let angle = this.angle;
    let series =[];
    const options = this.properties;
    series = [
    {
      name: "内线",
      type: "custom",
      coordinateSystem: "none",
      renderItem: function (params, api) {
        return {
          type: "arc",
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(
              api.getWidth(),
              api.getHeight()
            ) / 2.3,
            startAngle: ((0 + angle) * Math.PI) / 180,
            endAngle: ((90 + angle) * Math.PI) / 180
          },
          style: {
            stroke: options.insideColor,
            fill: "transparent",
            lineWidth: 3.5
          },
          silent: true
        };
      },
      data: [0]
    },
    {
      name: "内线",
      type: "custom",
      coordinateSystem: "none",
      renderItem: function (params, api) {
        return {
          type: "arc",
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(
              api.getWidth(),
              api.getHeight()
            ) / 2.3,
            startAngle: ((180 + angle) * Math.PI) / 180,
            endAngle: ((270 + angle) * Math.PI) / 180
          },
          style: {
            stroke: options.insideColor,
            fill: "transparent",
            lineWidth: 3.5
          },
          silent: true
        };
      },
      data: [0]
    },
    {
      name: "外线",
      type: "custom",
      coordinateSystem: "none",
      renderItem: function (params, api) {
        return {
          type: "arc",
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(
              api.getWidth(),
              api.getHeight()
            ) / 2.1,
            startAngle: ((270 + -angle) * Math.PI) / 180,
            endAngle: ((40 + -angle) * Math.PI) / 180
          },
          style: {
            stroke: options.outsideColor,
            fill: "transparent",
            lineWidth: 3.5
          },
          silent: true
        };
      },
      data: [0]
    },
    {
      name: "外线",
      type: "custom",
      coordinateSystem: "none",
      renderItem: function (params, api) {
        return {
          type: "arc",
          shape: {
            cx: api.getWidth() / 2,
            cy: api.getHeight() / 2,
            r: Math.min(
              api.getWidth(),
              api.getHeight()
            ) / 2.1,
            startAngle: ((90 + -angle) * Math.PI) / 180,
            endAngle: ((220 + -angle) * Math.PI) / 180
          },
          style: {
            stroke: options.outsideColor,
            fill: "transparent",
            lineWidth: 3.5
          },
          silent: true
        };
      },
      data: [0]
    },
    {
      name: "线头点",
      type: "custom",
      coordinateSystem: "none",
      renderItem: (params, api) => {
        let x0 = api.getWidth() / 2;
        let y0 = api.getHeight() / 2;
        let r =
          Math.min(api.getWidth(), api.getHeight()) / 2.1;
        let point = this.getCirlPoint(x0, y0, r, 90 + -angle);
        return {
          type: "circle",
          shape: {
            cx: point.x,
            cy: point.y,
            r: 5
          },
          style: {
            stroke: options.pointColor, //绿
            fill: options.pointColor
          },
          silent: true
        };
      },
      data: [0]
    },
    {
      name: "线头点",
      type: "custom",
      coordinateSystem: "none",
      renderItem: (params, api) => {
        let x0 = api.getWidth() / 2;
        let y0 = api.getHeight() / 2;
        let r =
          Math.min(api.getWidth(), api.getHeight()) / 2.1;
        let point = this.getCirlPoint(x0, y0, r, 270 + -angle);
        return {
          type: "circle",
          shape: {
            cx: point.x,
            cy: point.y,
            r: 5
          },
          style: {
            stroke: options.pointColor, //绿
            fill: options.pointColor
          },
          silent: true
        };
      },
      data: [0]
    }];
    series.push(this.series);
    this.chart.setOption({
      series: series
    })
    this.angle = this.angle + 3;
    setTimeout(() => { this.animation() }, 100);
  }

  private getCirlPoint(x0, y0, r, angle) {
    let x1 = x0 + r * Math.cos((angle * Math.PI) / 180);
    let y1 = y0 + r * Math.sin((angle * Math.PI) / 180);
    return {
      x: x1,
      y: y1
    };
  }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.showColor) {
      return ['Interval1', 'Interval2', 'Interval3', 'Interval4', 'Interval5'];
    }
    if (!options.properties.showoutline) {
      return ['borderDistance', 'outlineborderWidth', 'outlineborderColor'];
    }
    if (!options.properties.showlabel) {
      return ['textStyle'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}