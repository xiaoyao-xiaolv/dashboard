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
  private selectionManager: any;
  private host: any;
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
      outsideColor: "#0ff",
      insideColor: "#0ff",
      pointColor: "#0ff",
    };
    this.animation();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.host = host;
    this.selectEvent();
  }

  private selectEvent() {
    this.container.addEventListener("click", () => {
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })

    //鼠标左键
    this.chart.on('click', (params) => {
      let leftMouseButton = this.properties.leftMouseButton;
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            return;

          }
          default: {
            const selectionIds = this.selectionManager.getSelectionIds();
            this.host.commandService.execute([{
              name: leftMouseButton,
              payload: {
                selectionIds,
                position: {
                  x: params.event.event.x,
                  y: params.event.event.y,
                },
              }
            }])
          }
        }
      }
    })

    this.chart.on('mouseup', (params) => {
      if (params.event.event.button === 2) {
        document.oncontextmenu = function () { return false; };
        params.event.event.preventDefault();
        this.host.contextMenuService.show({
          position: {
            //跳转的selectionsId(左键需要)
            x: params.event.event.x,
            y: params.event.event.y,
          },
          menu: true
        }, 10)
        return;
      } else {
        this.host.contextMenuService.hide();
      }
    })

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
    items = items * 100
    let color;
    options.setShowColor.forEach((data, index) => {
      if (items > data.sectionMin) {
        if (items <= data.sectionMax) {
          color = this.getColors(index, 1);
        }
      }
    });
    return color
  }

  private render() {
    this.chart.clear();
    const options = this.properties;
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }

    let color;
    if (this.properties.setShowColor.length == 0) {
      color = this.getColors(0, 1)
    } else {
      color = this.findInterval(options, items);
    }
    let backgroundStyle;
    if (this.properties.showShade) {
      backgroundStyle = {
        borderWidth: options.borderWidth,
        borderColor: options.borderColor,
        color: {
          type: 'radial',
          x: 0.5,
          y: 0.5,
          r: 0.5,
          colorStops: [{
            offset: 0,
            color: 'rgba(0,24,55, 0)'
          },
          {
            offset: 0.55,
            color: 'rgba(0,24,55, 0)'
          },
          {
            offset: 1,
            color: options.backgroundColor
          }],
          globalCoord: false
        },
      }
    } else {
      backgroundStyle = {
        borderWidth: options.borderWidth,
        borderColor: options.borderColor,
        color: options.backgroundColor
      }
    }
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
      backgroundStyle: backgroundStyle,
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
    let series = [];
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

  private getColors(index, position: number) {
    let backgroundColor = ''
    const pieColor: [{
      colorStops: [] | any
    }] = this.properties.piecesColor && this.properties.piecesColor || [];
    if (index < pieColor.length) {
      backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
    } else {
      backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
        ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
        : pieColor[index % (pieColor.length)]
    }
    return backgroundColor
  }
}