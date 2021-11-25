import '../style/visual.less';

import * as echarts from 'echarts';



export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private chart: any;
  private properties: any;
  private items: any = [];
  private selectionManager: any;
  private selectionIdsArray: Array<any>;
  private selection: any[] = [];
  private dimension: string;
  private value: string;
  private formatIn: any;
  private formatOut: any;

  private static mockItemsIn = [
    { value: 1548, name: '搜索引擎' },
    { value: 775, name: '直达' },
    { value: 679, name: '营销广告', selected: true }
  ];

  private static mockItemsOut = [
    { value: 1048, name: '百度' },
    { value: 335, name: '直达' },
    { value: 310, name: '邮件营销' },
    { value: 251, name: '谷歌' },
    { value: 234, name: '联盟广告' },
    { value: 147, name: '必应' },
    { value: 135, name: '视频广告' },
    { value: 102, name: '其他' }
  ];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    var chartDom = dom;
    //myChart = echarts.init(chartDom);
    //option && myChart.setOption(option);

    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;
    this.isMock = true;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectionIdsArray = new Array<any>();
    this.selectionIdsArray[1] = [];
    this.selectionIdsArray[3] = [];
    this.properties = {}
    this.selectEvent();
  }

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private selectEvent() {
    this.container.addEventListener("click", () => {
      this.selectionManager.clear();
      this.selectionIdsArray[1] = [];
      this.selectionIdsArray[3] = [];
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })

    //鼠标左键
    this.chart.on('click', (params) => {
      let index = params.dataIndex > this.items[1].length - 1 ? params.dataIndex - this.items[1].length : params.dataIndex
      let isInside = params.dataIndex > this.items[1].length - 1 ? 3 : 1
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.properties.leftMouseButton;
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            if (this.properties.onlySelect) {
              if (!this.selectionManager.contains(this.selection[params.dataIndex])) {
                this.selectionIdsArray[1] = [];
                this.selectionIdsArray[3] = [];
                this.selectionManager.clear();
                this.selectionIdsArray[isInside].push(this.selection[params.dataIndex]);
              } else {
                this.selectionIdsArray[1] = [];
                this.selectionIdsArray[3] = [];
                this.selectionManager.clear();
              }
            } else {
              if (!this.selectionManager.contains(this.selection[params.dataIndex])) {
                this.selectionIdsArray[isInside].push(this.selection[params.dataIndex]);
              } else {
                this.selectionIdsArray[isInside].splice(this.selectionIdsArray[isInside].indexOf(this.selection[params.dataIndex]), 1);
                this.selectionManager.clear(this.selection[params.dataIndex])
                return
              }
            }
            this.selectionManager.select(this.selectionIdsArray[isInside], true);
            if (this.selectionIdsArray[isInside].length == this.items[isInside].length) {
              this.selectionManager.clear(this.selectionIdsArray[isInside]);
              this.selectionIdsArray[isInside] = [];
            }
            break;
          }
          case "showTool": {
            this.showTooltip(params, true);
            break;
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

    this.container.addEventListener('mouseup', (params) => {
      document.oncontextmenu = function () { return false; };
      if (params.button === 2) {
        this.host.contextMenuService.show({
          position: {
            x: params.x,
            y: params.y,
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
    this.formatIn = options.dataViews[0].plain.profile.valueIn.values[0].format;
    this.formatOut = options.dataViews[0].plain.profile.valueOut.values[0].format;
    this.selection = [];
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.valueIn.values.length && dataView.plain.profile.valueOut.values.length) {
      const plainData = dataView.plain;
      let items = plainData.data;
      this.isMock = false;
      if (dataView.plain.profile.dimensionIn.values.length) {

        this.dimension = plainData.profile.dimensionIn.values[0].display;
        this.value = plainData.profile.valueIn.values[0].display;

        this.items[0] = items.map((item) => item[this.dimension]).filter(onlyUnique);

        this.items[1] = [];
        items.forEach((item) => {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainData.profile.dimensionIn.values[0], item);
          this.selection.push(selectionId)
          let findObj = findObjInArray(this.items[1], item[this.dimension]);
          if (findObj == null) {
            this.items[1].push({ name: item[this.dimension], value: item[this.value] });
          }
          else {
            findObj.value = findObj.value + item[this.value];
          }
        });
      }
      else {
        // 如果没设定内圈维度，只绑定了值，此时就用plainData.profile.valueIn.values的各个display项目作为 维度(items[0])
        // 值(item1)的项目为  values的display作为name,data中的同名的属性，对应的值是value
        //this.items[0] = items.map((item) => item[this.dimension]);
        this.items[0] = plainData.profile.valueIn.values.map((i) => i.display);
        this.items[1] = plainData.profile.valueIn.values.map((i) => { return { name: i.display, value: plainData.data[0][i.display] } });
      }

      if (dataView.plain.profile.dimensionOut.values.length) {

        this.dimension = plainData.profile.dimensionOut.values[0].display;
        this.value = plainData.profile.valueOut.values[0].display;

        this.items[2] = items.map((item) => item[this.dimension]).filter(onlyUnique);

        this.items[3] = [];
        items.forEach((item) => {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainData.profile.dimensionOut.values[0], item);
          this.selection.push(selectionId)
          let findObj = findObjInArray(this.items[3], item[this.dimension]);
          if (findObj == null) {
            this.items[3].push({ name: item[this.dimension], value: item[this.value] });
          }
          else {
            findObj.value = findObj.value + item[this.value];
          }
        });
      }
      else {
        this.items[2] = plainData.profile.valueOut.values.map((i) => i.display);
        this.items[3] = plainData.profile.valueOut.values.map((i) => { return { name: i.display, value: plainData.data[0][i.display] } });
      }
      // data sort 
      /*if (isSort) {
        const sortFlage = plainData.sort[this.dimension].order;
        let newItems: any = sortFlage.map((flage) => {
          return newItems = items.find((item) => item[this.dimension] === flage && item)
        })
        items = newItems.filter((item) => item)
      }*/


      // get data
      /*const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimensionIn.values[0], item);
        return selectionId
      }
      this.items[4] = items.map((item) => getSelectionId(item));
      */
    }

    else {
      this.isMock = true;
    }
    this.properties = options.properties;
    this.render(options);
  }

  public render(bb) {
    const options = this.properties;

    let totalInside = 0;
    let totalExternal = 0;
    if (!this.isMock) {
      this.items[1].forEach((data) => { totalInside += data.value });
      this.items[3].forEach((data) => { totalExternal += data.value });
    }
    this.chart.clear();
    const isMock = !this.items.length

    this.container.style.opacity = isMock ? '0.5' : '1';
    const legendTextStyle = { ...options.legendTextStyle };

    //const data: any = this.isMock ? Visual.mockItems : this.items[1];
    const orient = options.legendPosition === 'left' || options.legendPosition === 'right' ? 'vertical' : 'horizontal';

    const getColors = (index, position: number) => {
      let backgroundColor = ''
      const pieColor = options.pieColor;
      if (index < pieColor.length) {
        backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
      } else {
        backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
          ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
          : pieColor[Math.floor((Math.random() * pieColor.length))]
      }
      return backgroundColor
    }
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: (data) => {
          let format = data.componentIndex == 0 ? this.formatIn : this.formatOut;
          let total = data.componentIndex == 0 ? totalInside : totalExternal;
          let showData = data.seriesName + "<br>" + data.data.name +":"+ this.formatData(format,data.data.value)  +" ("+(Math.round((data.data.value / total) * 100 * 100) / 100).toFixed(2)+"%)";
          return showData                 //'{a} <br/>{b}: {c} ({d}%)'
        }
      },
      legend: {
        data: isMock ? Visual.mockItemsIn.map(a => a.name).concat(Visual.mockItemsOut.map(a => a.name)) :
          this.items[0].concat(this.items[2]),
        textStyle: {//图例文字的样式
          color: options.legendTextColor
        }
      },
      series: [
        {
          name: isMock ? "访问来源" : bb.dataViews[0].plain.profile.dimensionIn.values.length ? bb.dataViews[0].plain.profile.dimensionIn.values[0].display : "",
          type: 'pie',
          radius: [0, '30%'],
          selectedMode: options.onlySelect ? "single" : "multiple",
          label: {
            show: options.showInsideLabel,
            position: 'inner',
            color: options.showInsideTextStyle.color,
            fontFamily: options.showInsideTextStyle.fontFamily,
            fontSize: options.showInsideTextStyle.fontSize.replace("pt", ""),
            fontStyle: options.showInsideTextStyle.fontStyle,
            fontWeight: options.showInsideTextStyle.fontWeight,
            formatter: (data) => {
              let showData = data.data.name;
              if (options.showInsideLabelValue) {
                showData += "\n" + this.formatData(this.formatIn,data.data.value)
              }
              if (options.showInsideLabelPercent) {
                showData += "\n" + (Math.round((data.data.value / totalInside) * 100 * 100) / 100).toFixed(2) + "%";
              }
              return isMock ? "****" : showData;
            }
          },
          labelLine: {
            show: false
          },
          color: options.pieColor,
          data: isMock ? Visual.mockItemsIn : this.items[1]
        },
        {
          name: isMock ? "访问来源" : bb.dataViews[0].plain.profile.dimensionOut.values.length ? bb.dataViews[0].plain.profile.dimensionOut.values[0].display : "",
          type: 'pie',
          radius: ['45%', '60%'],
          selectedMode: options.onlySelect ? "single" : "multiple",
          labelLine: {
            show: options.showExternalLabel,
            length: 30,
          },
          color: options.ringColor,
          label: {
            position: 'outside',
            backgroundColor: options.legendRichColor,
            borderColor: options.legendRichBorderColor,
            borderWidth: options.legendRichBorderWidth,
            borderRadius: options.legendRichBorderRadius,
            show: options.showExternalLabel,
            color: options.showExternalTextStyle.color,
            fontFamily: options.showExternalTextStyle.fontFamily,
            fontSize: options.showExternalTextStyle.fontSize.replace("pt", ""),
            fontStyle: options.showExternalTextStyle.fontStyle,
            fontWeight: options.showExternalTextStyle.fontWeight,
            formatter: (data) => {
              let showData = data.data.name;
              if (options.showExternalLabelValue) {
                showData += ":" + this.formatData(this.formatOut,data.data.value)
              }
              if (options.showExternalLabelPercent) {
                showData += " " + (Math.round((data.data.value / totalExternal) * 100 * 100) / 100).toFixed(2) + "%";
              }
              return isMock ? "{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%} " : showData;
            }
          },
          data: isMock ? Visual.mockItemsOut : this.items[3]
        }
      ]
    }

    this.chart.setOption(option)
    this.chart.resize();
  }


  public onDestroy(): void {

  }

  public onResize() {
    this.chart.resize();
    //this.render();
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

  //数据格式
  private formatData(format,number) {
    const formatService = this.host.formatService;
    let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
    return formatService.format(format, number, realDisplayUnit);
  }


  private showTooltip(params, asModel = false) {
    if (asModel)
      this.host.toolTipService.show({
        position: {
          x: params.event.event.x,
          y: params.event.event.y,
        },

        fields: [{
          label: params.name,
          value: params.data,
        }],
        selected: this.selectionManager.getSelectionIds(),
        menu: true,
      }, 10);
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
function findObjInArray(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i].name === obj) {
      return arr[i];
    }
  }
  return null;
}
