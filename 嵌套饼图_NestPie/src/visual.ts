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
    private selection: any[] = [];
    private dimension: string;
    private value: string;
  
    private static mockItemsIn = [
        {value: 1548, name: '搜索引擎'},
        {value: 775, name: '直达'},
        {value: 679, name: '营销广告', selected: true}
      ];

      private static mockItemsOut = [
        {value: 1048, name: '百度'},
        {value: 335, name: '直达'},
        {value: 310, name: '邮件营销'},
        {value: 251, name: '谷歌'},
        {value: 234, name: '联盟广告'},
        {value: 147, name: '必应'},
        {value: 135, name: '视频广告'},
        {value: 102, name: '其他'}
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
    //this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.properties = {}
  }

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.valueIn.values.length && dataView.plain.profile.dimensionIn.values.length && dataView.plain.profile.valueOut.values.length && dataView.plain.profile.dimensionOut.values.length) {
      const plainData = dataView.plain;

      this.isMock = false;
      
      this.dimension = plainData.profile.dimensionIn.values[0].display;
      this.value = plainData.profile.valueIn.values[0].display;

      let items = plainData.data;
      const isSort = plainData.sort[this.dimension].priority === 0 ? true : false;
      this.items[0] = items.map((item) => item[this.dimension]).filter( onlyUnique );

      this.items[1] = [];
      items.forEach((item) => { 
          let findObj = findObjInArray(this.items[1],item[this.dimension]);
          if (findObj == null)
          {
            this.items[1].push({ name: item[this.dimension], value: item[this.value] } );
          }
          else{
            findObj.value = findObj.value + item[this.value];
          }
        });

      this.dimension = plainData.profile.dimensionOut.values[0].display;
      this.value = plainData.profile.valueOut.values[0].display;

      //this.items[2] = items.map((item) => item[this.dimension]);
      //this.items[3] = items.map((item) => { return { name: item[this.dimension], value: item[this.value] } });

      this.items[2] = items.map((item) => item[this.dimension]).filter( onlyUnique );

      this.items[3] = [];
      items.forEach((item) => { 
          let findObj = findObjInArray(this.items[3],item[this.dimension]);
          if (findObj == null)
          {
            this.items[3].push({ name: item[this.dimension], value: item[this.value] } );
          }
          else{
            findObj.value = findObj.value + item[this.value];
          }
        });

      // data sort 
      /*if (isSort) {
        const sortFlage = plainData.sort[this.dimension].order;
        let newItems: any = sortFlage.map((flage) => {
          return newItems = items.find((item) => item[this.dimension] === flage && item)
        })
        items = newItems.filter((item) => item)
      }*/


      // get data
      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();
        this.dimension && selectionId.withDimension(plainData.profile.dimensionIn.values[0], item);
        return selectionId
      }
      this.items[4] = items.map((item) => getSelectionId(item));

    } else {
      this.isMock = true;
    }
    this.properties = options.properties;
    this.render(options);
  }

  public render(bb)
  {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;

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
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            data: isMock? Visual.mockItemsIn.map(a=>a.name).concat(Visual.mockItemsOut.map(a=>a.name)):
            this.items[0].concat(this.items[2]),
            textStyle:{//图例文字的样式
              color: options.legendTextColor
          }
        },
        series: [
            {
                name: isMock?"访问来源":bb.dataViews[0].plain.profile.dimensionIn.values[0].display,
                type: 'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
                label: {
                    position: 'inner',
                    fontSize: 14,
                },
                labelLine: {
                    show: false
                },
                data: isMock?Visual.mockItemsIn:this.items[1]
            },
            {
                name:  isMock?"访问来源":bb.dataViews[0].plain.profile.dimensionOut.values[0].display,
                type: 'pie',
                radius: ['45%', '60%'],
                labelLine: {
                    length: 30,
                },
                label: {
                    formatter: isMock?"{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ": options.legendRichFormat,
                    backgroundColor: '#F6F8FC',
                    borderColor: '#8C8D8E',
                    borderWidth: 1,
                    borderRadius: 4,
                    
                    rich: JSON.parse(options.legendRichStyle)
                },
                data: isMock?Visual.mockItemsOut: this.items[3]
            }
        ]
    };

    this.chart.setOption(option)
    this.chart.resize();
  }


  public onDestroy(): void {

  }

  public onResize()
  {
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
