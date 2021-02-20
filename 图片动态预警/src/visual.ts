import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private items: any;
  private x: any;
  private y: any;
  private axisX: any;
  private axisY: any;
  private status: any;
  private selection: any;
  private selectionManager: any;
  private isTooltipModelShown: boolean;
  private properties: any;
  private mockItems: any;
  static mockx = ['印刷机', '贴片机', 'AOI', '回流焊', '测试设备']
  static mocky = ['产品线1', '产品线2', '产品线3']

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.host = host;
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.x = [];
    this.y = [];
    this.properties = {
    };
    this.bindEvents();
    this.isTooltipModelShown = false;
    this.selection = [];
    this.selectionManager = host.selectionService.createSelectionManager();
    this.mockItems = [{
      value: [0, 0, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img1")
    },
    {
      value: [1, 0, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img2")
    },
    {
      value: [2, 0, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img3")
    },
    {
      value: [3, 0, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img4")
    },
    {
      value: [4, 0, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img5")
    },
    {
      value: [0, 1, 1],
      symbol: "image://" + this.host.assetsManager.getImage("Img6")
    },
    {
      value: [1, 1, 2],
      symbol: "image://" + this.host.assetsManager.getImage("Img7")
    },
    {
      value: [2, 1, 1],
      symbol: "image://" + this.host.assetsManager.getImage("Img8")
    },
    {
      value: [3, 1, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img9")
    },
    {
      value: [4, 1, 2],
      symbol: "image://" + this.host.assetsManager.getImage("Img10")
    },
    {
      value: [0, 2, 1],
      symbol: "image://" + this.host.assetsManager.getImage("Img11")
    },
    {
      value: [1, 2, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img12")
    },
    {
      value: [2, 2, 2],
      symbol: "image://" + this.host.assetsManager.getImage("Img13")
    },
    {
      value: [3, 2, 1],
      symbol: "image://" + this.host.assetsManager.getImage("Img14")
    },
    {
      value: [4, 2, 0],
      symbol: "image://" + this.host.assetsManager.getImage("Img15")
    }
    ]

  }

  public bindEvents = () => {
    this.container.addEventListener('click', (e: any) => {
      if (!e.seriesClick) {
        this.hideTooltip();
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })

    this.chart.on('click', (params) => {
      if (params.componentType !== 'series') return;
      params.event.event.seriesClick = true;
      let dataIndex = params.dataIndex;
      let sid = this.items[1][dataIndex];
      let selectedInfo = {
        seriesIndex: 1,
        dataIndex: dataIndex,
      };
      if (this.selectionManager.contains(sid)) {
        this.selectionManager.clear(sid);
        if (this.selectionManager.isEmpty()) {
          this.hideTooltip();
        } else {
          this.showTooltip(params);
        }
        return;
      }
      this.showTooltip(params);
      this.selectionManager.select(sid, true);
      this.selection.push(selectedInfo);
    })
  }

  private showTooltip = _.debounce((params) => {
    this.isTooltipModelShown = true;
    const fields = [{ label: this.axisX.display, value: `${params.value[0]}` }, { label: this.axisY.display, value: `${params.value[1]}` }, { label: this.status, value: `${params.value[2]}` }]
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },
      title: params.seriesName,
      fields,
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    }, 10);
  });

  private hideTooltip = () => {
    this.host.toolTipService.hide();
    this.isTooltipModelShown = false;
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    let data = [[], []];
    if (dataView) {
      const plainData = dataView.plain;
      this.axisX = plainData.profile.axisX.values[0];
      this.axisY = plainData.profile.axisY.values[0];
      let deviceImg = plainData.profile.deviceImg.values[0].display;
      this.status = plainData.profile.status.values[0].display;
      this.x = plainData.sort[this.axisX.display].order;
      this.y = plainData.sort[this.axisY.display].order;
      plainData.data.map((item) => {
        data[0].push({
          value: [item[this.axisX.display], item[this.axisY.display], item[this.status]],
          symbol: 'image://' + item[deviceImg],
        })
        const selectionId = this.host.selectionService.createSelectionId();
        selectionId.withDimension(this.axisX, item)
          .withDimension(this.axisY, item);
        data[1].push(selectionId);
      })
    }
    this.items = data;
    this.properties = options.properties;
    this.render();
  }

  private finditem(items) {
    let datatemp;
    let i, j;
    let datas = [];
    let obj = JSON.parse(this.properties.arrColor);
    for (i = 0; i < items.length; i++) {
      if (obj[items[i].value[2]]) {
        datatemp = { value: items[i].value, itemStyle: { color: obj[items[i].value[2]] } }
        datas.push(datatemp);
      }
    }
    return datas;
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items[0].length;
    const items = isMock ? this.mockItems : this.items[0];
    this.container.style.opacity = isMock ? '0.3' : '1';
    const x = isMock ? Visual.mockx : this.x
    const y = isMock ? Visual.mocky : this.y
    const options = this.properties;
    let XfontWeight: string;
    if (options.XTextStyle.fontWeight == "Light") {
      XfontWeight = options.XTextStyle.fontWeight + "er"
    } else {
      XfontWeight = options.XTextStyle.fontWeight
    }
    let YfontWeight: string;
    if (options.YTextStyle.fontWeight == "Light") {
      YfontWeight = options.YTextStyle.fontWeight + "er"
    } else {
      YfontWeight = options.YTextStyle.fontWeight
    }
    let size = getComputedStyle(this.container)
    let width = Number(size.width.replace('px', '')) / (x.length + 3)
    let height = Number(size.height.replace('px', '')) / (y.length + 3)
    if ((width / options.W_H) > height) {
      width = height * options.W_H
    } else {
      height = width / options.W_H
    }
    width = Number(width.toFixed());
    height = Number(height.toFixed());

    var option = {
      tooltip: {
        show: true,
        trigger: 'item',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (param) => {
          return (param.seriesName + '</br>' + this.axisX.display + ' : ' + param.value[0] + '</br>' + this.axisY.display + ' : ' + param.value[1] + '</br>' + this.status + ' : ' + param.value[2])
        }
      },
      grid: {
        left: '9%',
        top: '9%',
        right: 0,
        bottom: 0
      },
      xAxis: {
        type: 'category',
        data: x,
        position: 'top',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: options.showXAxisLabel,
          rotate: options.Xrotate,
          fontSize: options.XTextStyle.fontSize.substr(0, 2),
          fontWeight: XfontWeight,
          fontFamily: options.XTextStyle.fontFamily,
          fontStyle: options.XTextStyle.fontStyle,
          color: options.XTextStyle.color,
        }
      },
      yAxis: {
        type: 'category',
        data: y,
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: options.showYAxisLabel,
          rotate: options.Yrotate,
          fontSize: options.YTextStyle.fontSize.substr(0, 2),
          fontWeight: YfontWeight,
          fontFamily: options.YTextStyle.fontFamily,
          fontStyle: options.YTextStyle.fontStyle,
          color: options.YTextStyle.color,
        }
      },
      series: [{
        name: '设备状态',
        type: 'scatter',
        label: {
          show: true
        },
        data: items,
        symbolSize: [width, height],
        zlevel: 1
      }, {
        name: '设备状态',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: this.finditem(items),
        // data:[{ value: [0,0], itemStyle: { color: 'yellow' } },{ value: [0,1], itemStyle: { color: 'yello' } },{ value: [0,2], itemStyle: { color: 'blue' } }],
        symbol: 'rect',
        symbolSize: [width + 5, height + 10],
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 1.5,
          period: 3
        },

      }]
    }
    this.chart.setOption(option)
  }


  public onDestroy() {
    this.chart.dispose();
  }

  public onResize() {
    this.chart.resize()
    this.render()
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.showXAxisLabel) {
      return ['Xrotate', 'XTextStyle'];
    }
    if (!options.properties.showYAxisLabel) {
      return ['Yrotate', 'YTextStyle'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}