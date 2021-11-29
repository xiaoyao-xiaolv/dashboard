import '../style/visual.less';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/timeline';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  private host: any;
  private selection: any;
  private selectionManager: any;
  static mockItems = ["2014", "2015", "2016", "2017", "2018", "2019"];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.host = host;
    this.chart = echarts.init(dom);
    this.items = [];
    this.properties = {
    };
    this.bindEvents();
    this.selection = [];
    this.selectionManager = host.selectionService.createSelectionManager();

  }

  public bindEvents = () => {
    this.container.addEventListener("click", () => {
      this.selection = [];
      this.selectionManager.clear();
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })

    this.chart.on('timelinechanged', (params) => {
      let dataIndex = params.currentIndex;
      if (this.items.length) {
        let sid = this.items[1][dataIndex];
        this.selectionManager.clear();
        this.selectionManager.select(sid, true);
      }
    })

    this.chart.on('click', (params) => {
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        let leftMouseButton = this.properties.leftMouseButton;
        console.log(leftMouseButton)
        switch (leftMouseButton) { 
          case "none": {
            this.selectionManager.clear();
            this.selectionManager.select(this.selection[params.dataIndex], true);
            break;
          }
          default: {
            const selectionIds = this.selection[params.dataIndex];
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
    let arr = [[], []]
    if (dataView) {
      const plainData = dataView.plain;
      let dimensions = plainData.profile.dimensions.values[0].display;
      plainData.data.map((item) => {
        arr[0].push(item[dimensions])
        const getSelectionId = (item) => {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainData.profile.dimensions.values[0], item);
          this.selection.push(selectionId)
          return selectionId;
        }
        arr[1].push(getSelectionId(item));
      })
      this.items = arr
    }
    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items[0];
    const options = this.properties;
    let fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      fontWeight = options.textStyle.fontWeight + "er"
    } else {
      fontWeight = options.textStyle.fontWeight
    }
    let option = {
      timeline: {
        data: items,
        show: true,
        axisType: 'category',
        autoPlay: true,
        top: 'middle',
        left: '5%',
        right: '5%',
        playInterval: options.playInterval * 1000,
        symbolSize: options.symbolSize,
        lineStyle: {
          show: true,
          color: options.lineColor,
        },
        checkpointStyle: {
          color: options.checkpointColor,
          symbolSize: options.symbolSize,
          borderWidth: 5,
          borderColor: options.borderColor
        },
        label: {
          show: true,
          color: options.textStyle.color,
          fontSize: options.textStyle.fontSize.substr(0, 2),
          fontWeight: fontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle
        },
        controlStyle: {
          show: true,
          showPrevBtn: false,
          showNextBtn: false
        }
      }
    }
    this.chart.setOption(option)
  }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize()
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}