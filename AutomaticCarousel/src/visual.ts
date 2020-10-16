import '../style/visual.less';
import * as echarts from 'echarts';

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
    // this.bindEvents();
    this.selection = [];
    this.selectionManager = host.selectionService.createSelectionManager();

  }

  // public bindEvents = () => {
  //   this.container.addEventListener('click', (e: any) => {
  //     if (!e.seriesClick) {
  //       this.hideTooltip();
  //       this.selection.forEach(item => this.dispatch('downplay', item));
  //       this.selection = [];
  //       this.selectionManager.clear();
  //       return;
  //     }
  //   })

  //   this.chart.on('click', (params) => {
  //     if (params.componentType !== 'series') return;
  //     params.event.event.seriesClick = true;

  //     let dataIndex = params.dataIndex;
  //     let sid = this.items[5][dataIndex];
  //     let selectedInfo = {
  //       seriesIndex: 1,
  //       dataIndex: dataIndex,
  //     };

  //     if (this.selectionManager.contains(sid)){
  //       this.dispatch('downplay', selectedInfo);
  //       this.selectionManager.clear(sid);
  //       return;
  //     }

  //     this.showTooltip(params);
  //     this.selectionManager.select(sid, true);
  //     this.dispatch('highlight', selectedInfo);
  //     this.selection.push(selectedInfo);
  //   })
  // }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    let arr = []
    if (dataView) {
      const plainData = dataView.plain;
      let dimensions = plainData.profile.dimensions.values[0].display;
      plainData.data.map(function (item) {
        arr.push(item[dimensions])
      })
    }
    this.items = arr.sort(function (a, b) { return a - b })
    console.log(this.items);
    this.properties = options.properties;
    this.render();
  }

  private render() {
    this.chart.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    const options = this.properties;
    let option = {
      timeline: {
        data: items,
        show: true,
        axisType: 'category',
        autoPlay: true,
        top: 'middle',
        left: '5%',
        right: '5%',
        playInterval: options.playInterval*1000,
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
          color: "white",
          fontSize: 14
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

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}