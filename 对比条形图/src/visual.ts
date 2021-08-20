import '../style/visual.less';
import _ = require('lodash');
const echarts = require('echarts');

export default class Visual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private isMock: boolean;
  private items: any;
  private actualFormat: any;
  private contrastFormat: any;
  private host: any;
  private selection: any;
  private selectionManager: any;
  private rankingNumber: any;
  private isTooltipModelShown: boolean;
  static mockItems = [["人事部", "财务部", "销售部", "市场部", "采购部", "产品部", "技术部", "客服部", "后勤部"]
    , [58, 46, 47, 49, 59, 17, 25, 83, 34]
    , [74, 64, 78, 65, 79, 21, 28, 91, 38]
    , [78.38, 71.88, 60.26, 75.38, 74.68, 80.95, 89.29, 91.21, 89.47]
    , ["复工人数", "总人数"]
  ];
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.chart = echarts.init(dom);
    this.items = [];
    this.isMock = true;
    this.host = host;
    this.properties = {};
    this.bindEvents();
    this.isTooltipModelShown = false;
    this.selection = [];
    this.selectionManager = host.selectionService.createSelectionManager();
    this.rankingNumber = [];
  }
  private showTooltip = _.debounce((params) => {
    this.isTooltipModelShown = true;
    const fields = [{ label: params.name, value: `${params.data}%` }]
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },
      fields,
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    }, 10);
  });

  private hideTooltip = () => {
    this.host.toolTipService.hide();
    this.isTooltipModelShown = false;
  }

  private dispatch = (type, payload) => this.chart.dispatchAction({ type, ...payload });

  public bindEvents = () => {
    this.container.addEventListener('click', (e: any) => {
      if (!e.seriesClick) {
        this.hideTooltip();
        this.selection.forEach(item => this.dispatch('downplay', item));
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })

    this.chart.on('click', (params) => {
      if (params.componentType !== 'series') return;
      params.event.event.seriesClick = true;

      let dataIndex = params.dataIndex;
      let sid = this.items[5][dataIndex];
      let selectedInfo = {
        seriesIndex: 1,
        dataIndex: dataIndex,
      };

      if (this.selectionManager.contains(sid)) {
        this.dispatch('downplay', selectedInfo);
        this.selectionManager.clear(sid);
        return;
      }

      this.showTooltip(params);
      this.selectionManager.select(sid, true);
      this.dispatch('highlight', selectedInfo);
      this.selection.push(selectedInfo);
    })
  }



  public update(options: any) {
    const dataView = options.dataViews[0];
    this.isMock = !dataView;
    this.items = [[], [], [], [], [], []];
    if (dataView) {
      const plainData = dataView.plain;
      let ActualValue = plainData.profile.ActualValue.values.length?plainData.profile.ActualValue.values[0].display:'';
      let ContrastValue = plainData.profile.ContrastValue.values.length?plainData.profile.ContrastValue.values[0].display:'';
      let dimension = plainData.profile.dimension.values.length?plainData.profile.dimension.values[0].display:'';
      let data = plainData.data;

      this.actualFormat = plainData.profile.ActualValue.options.valueFormat;
      this.contrastFormat = plainData.profile.ContrastValue.options.valueFormat;
      
      for (let index = 0; index < data.length; index++) {
        data.forEach((item) => {
          if(ActualValue&&!ContrastValue&&!dimension){
            this.items[0].push(ActualValue);
            this.items[3].push(item[ActualValue]);
          }else if(ActualValue&&ContrastValue&&!dimension){
            this.items[0].push(ActualValue,ContrastValue);
            this.items[3].push(item[ActualValue],item[ContrastValue]);
          }else if(ActualValue&&!ContrastValue&&dimension){
            this.items[0].push(ActualValue,dimension);
            this.items[3].push({value:item[ActualValue],name:item[dimension]});
            var obj = {};
            this.items[3] = this.items[3].reduce(function(a, b) {
              obj[b.name] ? '' : obj[b.name] = true && a.push(b);
              return a;
            }, [])
          }else if(ActualValue&&ContrastValue&&dimension){
            this.items[0] = plainData.sort[dimension]?plainData.sort[dimension].order:'';
            if (item[dimension] == this.items[0][index]) {
              this.items[4] = [ActualValue, ContrastValue];        
              this.items[1].push(item[ActualValue]);
              this.items[2].push(item[ContrastValue]);
              this.items[3].push(parseFloat((item[ActualValue] / item[ContrastValue] * 100).toFixed(2)));
              const getSelectionId = (item) => {
                const selectionId = this.host.selectionService.createSelectionId();
                selectionId.withDimension(plainData.profile.dimension.values[0], item);
                return selectionId;
              }
              this.items[5].push(getSelectionId(item));
            }
          }
        })
      }
    }
    this.properties = options.properties;
    this.render();
  }

  private selectionSort(arr: any, sorttype: any) {
    if (sorttype == "default") {
      return;
    }
    var len = arr[3].length;
    var index, temp;
    if (sorttype == "asc") {
      for (var i = 0; i < len - 1; i++) {
        index = i;
        for (var j = i + 1; j < len; j++) {
          if (arr[3][j] < arr[3][index]) {
            index = j;
          }
        }
        temp = arr[3][i];
        arr[3][i] = arr[3][index];
        arr[3][index] = temp;
        temp = arr[0][i];
        arr[0][i] = arr[0][index];
        arr[0][index] = temp;
        temp = arr[1][i];
        arr[1][i] = arr[1][index];
        arr[1][index] = temp;
        temp = arr[2][i];
        arr[2][i] = arr[2][index];
        arr[2][index] = temp;
        temp = arr[5][i];
        arr[5][i] = arr[5][index];
        arr[5][index] = temp;
      }
    } else {
      for (var i = 0; i < len - 1; i++) {
        index = i;
        for (var j = i + 1; j < len; j++) {
          if (arr[3][j] > arr[3][index]) {
            index = j;
          }
        }
        temp = arr[3][i];
        arr[3][i] = arr[3][index];
        arr[3][index] = temp;
        temp = arr[0][i];
        arr[0][i] = arr[0][index];
        arr[0][index] = temp;
        temp = arr[1][i];
        arr[1][i] = arr[1][index];
        arr[1][index] = temp;
        temp = arr[2][i];
        arr[2][i] = arr[2][index];
        arr[2][index] = temp;
        temp = arr[5][i];
        arr[5][i] = arr[5][index];
        arr[5][index] = temp;
      }
      arr[0].forEach((element,index) => {
        this.rankingNumber.push({name:element,index:index+1})
      });
    }
    return;
  }

  private setPosition(positionType: any) {
    if (positionType === 'topLeft') {
      return [0,-20]
    }else if(positionType === 'topRight'){
      return [535,-20]
    }else if(positionType === 'bottomLeft'){
      return [0,20]
    }else if(positionType === 'bottomRight'){
      return [535,20]
    }else {
      return positionType
    }
  }

  private setRankingType(rankingType: any, targetIndex: any ) {
    if(targetIndex <= 3){
      let championList = ['冠','亚','季']
      let excellentList = ['优','良','中']
      if(rankingType === 'champion'){
        let champion
        return champion = championList.filter((ele,index) => (index+1) === targetIndex)
      } else if(rankingType === 'excellent'){
        let excellent
        return excellent = excellentList.filter((ele,index) => (index+1) === targetIndex)
      } else {
        return targetIndex
      } 
    }else{
      return targetIndex
    }
  }

  private render() {
    this.chart.clear();
    const options = this.properties;
    const items = this.isMock ? Visual.mockItems : this.items;
    if (!this.isMock) {
      this.selectionSort(items, options.sorttype);
    }
    this.container.style.opacity = this.isMock ? '0.3' : '1';
    let _fontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      _fontWeight = options.textStyle.fontWeight + "er"
    } else {
      _fontWeight = options.textStyle.fontWeight
    }
    let labelfontWeight: string;
    if (options.labelTextStyle.fontWeight == "Light") {
      labelfontWeight = options.labelTextStyle.fontWeight + "er"
    } else {
      labelfontWeight = options.labelTextStyle.fontWeight
    }

    const hexToRgba = (hex, opacity) => {
      return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
              + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
    }

    const rgbaToHex = (color) => {
      var values = color
        .replace(/rgba?\(/, '')
        .replace(/\)/, '')
        .replace(/[\s+]/g, '')
        .split(',');
      var a = parseFloat(values[3] || 1),
          r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
          g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
          b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
      return "#" +
        ("0" + r.toString(16)).slice(-2) +
        ("0" + g.toString(16)).slice(-2) +
        ("0" + b.toString(16)).slice(-2);
    }
    

    let option = {
      tooltip: {
        show: true,
        formatter: (params) => {
          for (var i = 0; i < items[0].length; i++) {
            if (items[0][i] === params.name) {
              // return items[4][0] + ":" + items[1][i] + "<br/>" + items[4][1] + ":" + items[2][i];
              return items[4][0] + ":" + this.host.formatService.format(this.actualFormat, items[1][i]).toLocaleString() + "<br/>" + items[4][1] + ":" + this.host.formatService.format(this.contrastFormat, items[2][i]).toLocaleString();
            }
          }
        }
      },
      grid: {
        top: '10',
        left: options.RankingPosition === 'left'? '75':'10',
        right: '4.75%',
        bottom: '0',
        containLabel: true
      },
      yAxis: [{
        type: 'category',
        data: items[0],
        inverse: true,
        axisTick: {
          show: false
        },
        position: 'right',
        axisLabel: {
          show: options.showBarLabel,
          formatter: (params) => {
            let dataRatio = ''
            this.items[0].map((element,index) => {
              if(params === element){
                dataRatio = `${this.items[3][index].toFixed(1)}%`
              }
            })
            return dataRatio
          },
          color: options.labelTextStyle.color,
          fontSize: options.labelTextStyle.fontSize.substr(0, 2),
          fontWeight: labelfontWeight,
          fontFamily: options.labelTextStyle.fontFamily,
          fontStyle: options.labelTextStyle.fontStyle,
        },
        axisLine: {
          show: false
        },
      }],
      xAxis: [{
        type: 'value',
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        type: 'bar',
        barWidth: options.barWidth,
        data: items[3],
        label: {
          show: options.showLabel,
          margin: 1,
          position: this.setPosition(options.RankingPosition) ,
          rotate : options.rotationDegree,
          width:65,
          // backgroundColor:'red',
          formatter: (value) => {
            if(options.showRanking && !this.isMock){
              this.rankingNumber = [];
              this.selectionSort(this.items, 'desc');
              const _targetCopy  = this.rankingNumber&&this.rankingNumber.filter(element => value.name === element.name)[0];

              const _target = JSON.parse(JSON.stringify(_targetCopy))
              _target.index = this.setRankingType(options.rankingType, _target.index)
              const targetCopyIndex = _targetCopy.index
              if (targetCopyIndex <= 3) { 
                return '{idx' + targetCopyIndex + '|' +  _target.index + '} {title|' + value.name + '}'
              }  else {
                return '{idx|' +  _target.index + '} {title|' + value.name + '}'
              }
            }else{
              return `{title|${value.name}}`
            }
          },
          rich: {
            idx1: {
                color: options.rankingColor[0],
                backgroundColor: rgbaToHex(hexToRgba(options.rankingColor[0],0.2)),
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                padding: [4, 4],
                width:10,
                height:10,
                align: 'left',
            },
            idx2: {
                color: options.rankingColor[1],
                backgroundColor: rgbaToHex(hexToRgba(options.rankingColor[1],0.2)),
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                padding: [4, 4],
                width:10,
                height:10,
                align: 'left',
            },
            idx3: {
                color: options.rankingColor[2],
                backgroundColor: rgbaToHex(hexToRgba(options.rankingColor[2],0.2)),
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                padding: [4, 4],
                width:10,
                height:10,
                align: 'left',
            },
            idx: {
                color: 'white',
                borderRadius: 100,
                width:10,
                height:10,
                align: 'left',
                padding: [2, 4]
            },
            title: {
              color: options.textStyle.color,
              fontSize: options.textStyle.fontSize.substr(0, 2),
              fontWeight: _fontWeight,
              fontFamily: options.textStyle.fontFamily,
              fontStyle: options.textStyle.fontStyle,
            }
          },
        },
        itemStyle: {
          color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
            offset: 0,
            color: options.barStartColor // 0% 处的颜色
          }, {
            offset: 1,
            color: options.barEndcolor // 100% 处的颜色
          }], false),
          barBorderRadius: 14
        }
      }, {
        type: "bar",
        barWidth: options.barWidth,
        xAxisIndex: 0,
        barGap: "-100%",
        data: items[3].map(function (item) {
          return 100
        }),
        itemStyle: {
          color: options.barBackgroundColor,
          barBorderRadius: 14
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
          }
        },
        zlevel: -1
      }]
    }
    this.chart.setOption(option)

  }
  public onResize() {
    this.chart.resize();
    this.render();
  }
  // 自定义属性可见性
  public getInspectorHiddenState(updateOptions: any): string[] {
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


// {
//   "name": "RankingDeviationX",
//   "type": "Integer",
//   "displayName": "左右偏移",
//   "defaultValue": -50
// },
// {
//   "name": "RankingDeviationY",
//   "type": "Integer",
//   "displayName": "上下偏移",
//   "defaultValue": 0
// },