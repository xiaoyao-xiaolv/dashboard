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
  private allShow: any;
  private actualFormate: any;
  private contrastFormate: any;
  private selectionManager: any;
  private rankingNumber: any;
  private isActualValue: boolean;
  private isDimension: boolean;
  private isContrastValue: boolean;
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
    this.allShow = true;
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
    this.items = [[], [], [], [], [], []];

    if (dataView && dataView.plain.profile.ActualValue.values.length) {
      this.isMock = false;
      const plainData = dataView.plain;
      let ActualValue = plainData.profile.ActualValue.values.length?plainData.profile.ActualValue.values[0].display:'';
      let ContrastValue = plainData.profile.ContrastValue.values.length?plainData.profile.ContrastValue.values[0].display:'';
      let dimension = plainData.profile.dimension.values.length ? plainData.profile.dimension.values[0].display : '';
      
     this.isActualValue = !!plainData.profile.ActualValue.values.length;
     this.isDimension = !!plainData.profile.ActualValue.values.length;
     this.isContrastValue = !!plainData.profile.ActualValue.values.length;
      let datas = plainData.data;

      datas.map((data: any) => {
        ActualValue && this.items[1].push(data[ActualValue]);
        ContrastValue && this.items[2].push(data[ContrastValue]);
        if (ActualValue && ContrastValue) {
          this.items[3].push(Number((data[ActualValue] / data[ContrastValue] * 100).toFixed(2)));
        } else if (ActualValue) {
          this.items[3].push(Number((data[ActualValue] / 100 * 100).toFixed(2)));
        }
        
        dimension && this.items[0].push(data[dimension]);

        const getSelectionId = (_item) => {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainData.profile.dimension.values[0], _item);
          return selectionId;
        }
        dimension && this.items[5].push(getSelectionId(data));
      })

      if (ActualValue && ContrastValue && dimension) {
        this.allShow = true;
        this.items[4] = [ActualValue, ContrastValue];
        this.actualFormate = plainData.profile.ActualValue.values[0].format;
        this.contrastFormate = plainData.profile.ContrastValue.values[0].format;
        this.items[0] = plainData.sort[dimension] ? plainData.sort[dimension].order : '';

      }
      this.actualFormat = plainData.profile.ActualValue.options.valueFormat;
      this.contrastFormat = plainData.profile.ContrastValue.options.valueFormat;
    
    } else {
      this.isMock = true
    }
    this.properties = options.properties;
    this.render();
  }

  private selectionSort(arr: any, sorttype: any, according: any) {
    if (according == "noOrder") {
      return;
    }
    var len = arr[3].length;
    var index, temp;
    if (sorttype == "asc" && according === 'accordingPercent') {
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
    } else if(sorttype == "desc" && according === 'accordingPercent'){
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
    }else if(sorttype == "asc" && according === 'accordingActual'){
      for (var i = 0; i < len - 1; i++) {
        index = i;
        for (var j = i + 1; j < len; j++) {
          if (arr[1][j] < arr[1][index]) {
            index = j;
          }
        }
        temp = arr[1][i];
        arr[1][i] = arr[1][index];
        arr[1][index] = temp;
        temp = arr[0][i];
        arr[0][i] = arr[0][index];
        arr[0][index] = temp;
        temp = arr[3][i];
        arr[3][i] = arr[3][index];
        arr[3][index] = temp;
        temp = arr[2][i];
        arr[2][i] = arr[2][index];
        arr[2][index] = temp;
        temp = arr[5][i];
        arr[5][i] = arr[5][index];
        arr[5][index] = temp;
      }
    }else if(sorttype == "desc" && according === 'accordingActual'){
      for (var i = 0; i < len - 1; i++) {
        index = i;
        for (var j = i + 1; j < len; j++) {
          if (arr[1][j] > arr[1][index]) {
            index = j;
          }
        }
        temp = arr[1][i];
        arr[1][i] = arr[1][index];
        arr[1][index] = temp;
        temp = arr[0][i];
        arr[0][i] = arr[0][index];
        arr[0][index] = temp;
        temp = arr[3][i];
        arr[3][i] = arr[3][index];
        arr[3][index] = temp;
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

  private setPosition(positionType: any,num:Number,axisYWidth: Number) {
    if (positionType === 'topLeft') {
      return num === 1?[25,-15]:[0,-20]
    }else if(positionType === 'topRight'){
      return num === 1?[400,-15]:[380,-20]
    }else if(positionType === 'bottomLeft'){
      return num === 1?[25,20]:[0,15]
    }else if(positionType === 'bottomRight'){
      return num === 1?[400,20]:[380,15]
    }else if(positionType === 'left'){
      return num === 1?[-axisYWidth+20,3]:[-axisYWidth,0]
    }else if(positionType === 'right'){
      return num === 1?[400,-15]:[380,-20]
    }else if(positionType === 'inside'){
      return ['50%','30%']
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

  public formatData = (number, dataUnit, formate) => {
    let format = number
    if(dataUnit === 'auto'){
      const formatService = this.host.formatService;
      let realDisplayUnit = dataUnit;
      if (formatService.isAutoDisplayUnit(dataUnit)) {
          realDisplayUnit = formatService.getAutoDisplayUnit([number]);
      }
      return format = formatService.format(formate, number, realDisplayUnit);
    } else {
      const units = [{
        value: 1,
        unit: ''
      },{
        value: 100,
        unit: '百'
      }, {
        value: 1000,
        unit: '千'
      }, {
        value: 10000,
        unit: '万'
      }, {
        value: 100000,
        unit: '十万'
      }, {
        value: 1000000,
        unit: '百万'
      }, {
        value: 10000000,
        unit: '千万'
      }, {
        value: 100000000,
        unit: '亿'
      }, {
        value: 1000000000,
        unit: '十亿'
      }, {
        value: 100000000000,
        unit: '万亿'
      }]
      let formatUnit = units.find((item) => item.value === Number(dataUnit))
      return format + formatUnit.unit
    }
  }

  public setTopColor(array: any, index:Number, type: string){
    const options = this.properties;
    if(!options.showBackgroundColor) return '';

    const _target = array.find((_item) => Number(_item.rankingConditionValue) === index);
    if(type === 'bg') {
      if(_target) {
        console.log(_target.rankingConditionImage && { image: _target.rankingConditionImage} || _target.rankingConditionColor || ' ', '000')
        return _target.rankingConditionImage && { image: _target.rankingConditionImage} || _target.rankingConditionColor || ' '
      }else {
         return ''
      }
    }else if (type === 'font') {
      if(_target) {
        return _target.rankingFontColor || ''
      }
     
    }
  }

  private render() {
    this.chart.clear();
    const options = this.properties;
    const items = this.isMock ? Visual.mockItems : this.items;
    if (!this.isMock) {
      this.selectionSort(items, options.sorttype, options.sortAccording);
    }
    this.container.style.opacity = this.isMock ? '0.3' : '1';
    let _fontWeight: string;
    if (options.labelTextStyle.fontWeight == "Light") {
      _fontWeight = options.labelTextStyle.fontWeight + "er"
    } else {
      _fontWeight = options.labelTextStyle.fontWeight
    }
    let labelfontWeight: string;
    if (options.textStyle.fontWeight == "Light") {
      labelfontWeight = options.textStyle.fontWeight + "er"
    } else {
      labelfontWeight = options.textStyle.fontWeight
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
        left: options.axisYWidth,
        right: '4.75%',
        bottom: '0',
        containLabel: true
      },
      yAxis: [{
        type: 'category',
        data:  this.isMock ? items[0]: (this.isDimension ? items[0]: items[1]),
        inverse: true,
        axisTick: {
          show: false
        },
        position: 'right',
        axisLabel: {
          show: options.showLabel,
          formatter: (params,formatterIndex) => {
            let dataRatio = ''
            if(this.allShow){
              this.items[0].map((element,index) => {
                if(params === element){
                  let percent = options.showSecondBarPercent?this.items[3][index].toFixed(options.showSecondPercentFormate)+'%':''
                  let actual = options.showSecondBarActual && !this.isMock ?'/'+ this.formatData(this.items[1][index],options.showSecondBarActualUnit,this.actualFormate):''
                  let contrast = options.showSecondBarContrast && !this.isMock?'/'+this.formatData(this.items[2][index],options.showSecondBarContrastUnit,this.contrastFormate):''
                  dataRatio = `${percent}${actual}${contrast}`
                }
              })
            }else if(formatterIndex < this.items[3].length){
              dataRatio = this.items[3][formatterIndex].value
            }else if(this.isMock){
              
            }
            return dataRatio
          },
          color: options.textStyle.color,
          fontSize: options.textStyle.fontSize.substr(0, 2),
          fontWeight: labelfontWeight,
          fontFamily: options.textStyle.fontFamily,
          fontStyle: options.textStyle.fontStyle,
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
        data: this.isMock ?  items[3] : (this.isContrastValue ? items[3]: items[1]),
        label: {
          show: options.showBarLabel,
          margin: 1,
          position: options.firstBarAboutPosition==='inside'?options.firstBarInsidePosition:options.firstBarOutsidePosition,
          rotate : options.rotationDegree,
          width:65,
          // backgroundColor:'red',
          formatter: (value) => {
            if (this.isMock) {
                return `${value.data}%`
            } else {
             let name = options.showFirstBarCategory?value.name:''
            let percent = options.showFirstBarPercent?'/'+this.items[3][value.dataIndex].toFixed(options.showFirstPercentFormate)+'%':''
            let actual = options.showFirstBarActual && !this.isMock?'/'+this.formatData(this.items[1][value.dataIndex],options.showFirstBarActualUnit,this.actualFormate):''
            let contrast = options.showFirstBarContrast && !this.isMock?'/'+this.formatData(this.items[2][value.dataIndex],options.showFirstBarContrastUnit,this.contrastFormate):''
            return `{title|${name}${percent}${actual}${contrast}}`
            }
          },
          rich: {
            title: {
              color: options.labelTextStyle.color,
              fontSize: options.labelTextStyle.fontSize.substr(0, 2),
              fontWeight: _fontWeight,
              fontFamily: options.labelTextStyle.fontFamily,
              fontStyle: options.labelTextStyle.fontStyle,

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
        label: {
          show: options.showRanking,
          margin: 1,
          position: [options.secondBarPositionX, options.secondBarPositionY] ,
          width:65,
          lineHeight:options.barWidth,
          formatter: (value) => {
            if (this.isMock) {
              return  '{idx|' +  value.name+ '}'
            } else if(options.showRanking && !this.isMock && options.sortAccording !== 'noOrder'){
                this.rankingNumber = [];
                this.selectionSort(this.items, 'desc', options.sortAccording);
                const _targetCopy  = this.rankingNumber&&this.rankingNumber.filter(element => value.name === element.name)[0];
                const _target = JSON.parse(JSON.stringify(_targetCopy))
                _target.index = this.setRankingType(options.rankingType, _target.index)
                const targetCopyIndex = _targetCopy.index
                if (targetCopyIndex <= 3) { 
                  return '{idx' + targetCopyIndex + '|' +  _target.index + '}'
                }  else {
                  return '{idx|' +  _target.index + '}'
                }
            } else if (options.showRanking && !this.isMock && options.sortAccording == 'noOrder'){
              if ((value.dataIndex + 1) <= 3) { 
                return '{idx' + (value.dataIndex + 1) + '|' + (value.dataIndex + 1) + '}'
              }  else {
                return '{idx|' +  (value.dataIndex + 1) + '}'
              }
            }
            
          },
          rich: {
            idx1: {
                color: this.setTopColor(options.rankingConditionCollection, 1, 'font') || options.rankingTextStyle.color,
                backgroundColor: this.setTopColor(options.rankingConditionCollection,1, 'bg') || options.rankingBackgroundColor,
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                padding: options.rankingType === 'number'?[options.rankingSize, options.rankingSize+2]:[options.rankingSize, options.rankingSize],
                width:options.rankingType === 'number'?null:options.rankingSize+4,
                height:options.rankingType === 'number'?null:options.rankingSize+4,
                align: 'left',
                fontSize: options.rankingTextStyle.fontSize.substr(0, 2),
                fontWeight: options.rankingTextStyle.fontWeight == "Light"?options.rankingTextStyle.fontWeight + "er":options.rankingTextStyle.fontWeight,
                fontFamily: options.rankingTextStyle.fontFamily,
                fontStyle: options.rankingTextStyle.fontStyle,
            },
            idx2: {
                color: this.setTopColor(options.rankingConditionCollection, 2, 'font') || options.rankingTextStyle.color,
                backgroundColor: this.setTopColor(options.rankingConditionCollection,2, 'bg') || options.rankingBackgroundColor,
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                padding: options.rankingType === 'number'?[options.rankingSize, options.rankingSize+2]:[options.rankingSize, options.rankingSize],
                width:options.rankingType === 'number'?null:10,
                height:options.rankingType === 'number'?null:10,
                align: 'left',
                fontSize: options.rankingTextStyle.fontSize.substr(0, 2),
                fontWeight: options.rankingTextStyle.fontWeight == "Light"?options.rankingTextStyle.fontWeight + "er":options.rankingTextStyle.fontWeight,
                fontFamily: options.rankingTextStyle.fontFamily,
                fontStyle: options.rankingTextStyle.fontStyle,
            },
            idx3: {
                color: this.setTopColor(options.rankingConditionCollection, 3, 'font') || options.rankingTextStyle.color,
                backgroundColor: this.setTopColor(options.rankingConditionCollection,3, 'bg') || options.rankingBackgroundColor,
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                padding: options.rankingType === 'number'?[options.rankingSize, options.rankingSize+2]:[options.rankingSize, options.rankingSize],
                width:options.rankingType === 'number'?null:10,
                height:options.rankingType === 'number'?null:10,
                align: 'left',
                fontSize: options.rankingTextStyle.fontSize.substr(0, 2),
                fontWeight: options.rankingTextStyle.fontWeight == "Light"?options.rankingTextStyle.fontWeight + "er":options.rankingTextStyle.fontWeight,
                fontFamily: options.rankingTextStyle.fontFamily,
                fontStyle: options.rankingTextStyle.fontStyle,
            },
            idx: {
                color: options.rankingTextStyle.color,
                borderRadius: options.rankingShape === 'circular' ? 100 : '',
                width:10,
                height:10,
                align: 'left',
                padding: [options.rankingSize, options.rankingSize],
                backgroundColor:options.rankingBackgroundColor,
                fontSize: options.rankingTextStyle.fontSize.substr(0, 2),
                fontWeight: options.rankingTextStyle.fontWeight == "Light"?options.rankingTextStyle.fontWeight + "er":options.rankingTextStyle.fontWeight,
                fontFamily: options.rankingTextStyle.fontFamily,
                fontStyle: options.rankingTextStyle.fontStyle,
            }
          },
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
    let hiddenOptions: Array<string> = [''];
    if (!updateOptions.properties.showRanking) {
      hiddenOptions = hiddenOptions.concat(['secondBarPosition', 'rankingShape', 'rankingType', 'showRankingColor'])
    }
    if (!updateOptions.properties.showFirstBarPercent) {
      hiddenOptions = hiddenOptions.concat(['showFirstPercentFormate'])
    }
    if (!updateOptions.properties.showFirstBarActual) {
      hiddenOptions = hiddenOptions.concat(['showFirstBarActualUnit'])
    }
    if (!updateOptions.properties.showFirstBarContrast) {
      hiddenOptions = hiddenOptions.concat(['showFirstBarContrastUnit'])
    }
    if (!updateOptions.properties.showSecondBarPercent) {
      hiddenOptions = hiddenOptions.concat(['showSecondPercentFormate'])
    }
    if (!updateOptions.properties.showSecondBarActual) {
      hiddenOptions = hiddenOptions.concat(['showSecondBarActualUnit'])
    }
    if (!updateOptions.properties.showSecondBarContrast) {
      hiddenOptions = hiddenOptions.concat(['showSecondBarContrastUnit'])
    }
    if (updateOptions.properties.firstBarAboutPosition === 'inside') {
      hiddenOptions = hiddenOptions.concat(['firstBarOutsidePosition'])
    }
    if (updateOptions.properties.firstBarAboutPosition === 'outside') {
      hiddenOptions = hiddenOptions.concat(['firstBarInsidePosition'])
    }
    if (!updateOptions.properties.showRankingColor) {
      hiddenOptions = hiddenOptions.concat(['rankingFontCollection'])
    }
    if (!updateOptions.properties.showBackgroundColor) {
      hiddenOptions = hiddenOptions.concat(['rankingConditionCollection'])
    }

    return hiddenOptions;
  }

  // 功能按钮可见性
  public getActionBarHiddenState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}


