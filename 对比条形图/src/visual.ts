import '../style/visual.less';
import _ = require('lodash');
const echarts = require('echarts');

const clickLeftMouse = 0;
const clickRightMouse = 2;
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
  private ActualValue: string;
  private Dimension: string;
  private ContrastValue: string;
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
  }
  private showTooltip = _.debounce((params) => {
    this.isTooltipModelShown = true;
    const fields = [{ label: params.name, value: `${params.data}%` }]
    this.host.contextMenuService.show({
      position: {
      x: params.event.event.x,
      y: params.event.event.y,
      }
    })
  });

  private hideTooltip = () => {
    this.host.contextMenuService.hide();
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
      const clickMouse = params.event.event.button;
      if (params.componentType !== 'series') return;
      params.event.event.seriesClick = true;
      let dataIndex = params.dataIndex;
      let selectedInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: dataIndex,
      };
      if (this.items[5][params.dataIndex]) {
        const sid = this.items[5][params.dataIndex];
        this.selectionManager.select(sid, true);
      }
      // this.selectionManager.select(sid, true);
      this.dispatch('highlight', selectedInfo);
      this.selection.push(selectedInfo);
      if (clickMouse === clickLeftMouse) {
        // dataIndex = (params.dataIndex === dataIndex)?'':params.dataIndex
        // show data jump
        if (this.properties.clickLeftMouse === 'none' || this.properties.clickLeftMouse === 'showToolTip') {
          return
        } else {
          if (this.isTooltipModelShown) return;
          this.hideTooltip();
          const selectionIds = this.selectionManager.getSelectionIds();
          this.host.commandService.execute([{
            name: this.properties.clickLeftMouse,
            payload: {
              selectionIds: selectionIds,
              position: {
                x: params.event.event.x,
                y: params.event.event.y,
                },
            }
          }])
        }
      }
    })

    this.chart.on('mouseup', (params) => {
      const clickMouse = params.event.event.button;
      if (clickMouse === clickRightMouse) {
          this.showTooltip(params, true);
      }
      this.container.addEventListener('contextmenu', (e: any) => {
        e.preventDefault();
      })
      })
  }



  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [[], [], [], [], [], []];

    if (dataView && dataView.plain.profile.ActualValue.values.length) {
      this.isMock = false;
      const plainData = dataView.plain;
      this.ActualValue = plainData.profile.ActualValue.values.length?plainData.profile.ActualValue.values[0].display:'';
      this.ContrastValue = plainData.profile.ContrastValue.values.length?plainData.profile.ContrastValue.values[0].display:'';
      this.Dimension = plainData.profile.dimension.values.length?plainData.profile.dimension.values[0].display : '';
      
     this.isActualValue = !!plainData.profile.ActualValue.values.length;
     this.isDimension = !!plainData.profile.dimension.values.length;
     this.isContrastValue = !!plainData.profile.ContrastValue.values.length;
      let datas = plainData.data;

      datas.map((data: any) => {
        this.actualFormate =  this.ActualValue && plainData.profile.ActualValue.values[0].format;
        this.contrastFormate =  this.ContrastValue && plainData.profile.ContrastValue.values[0].format;
        this.ActualValue && this.items[1].push(data[this.ActualValue]);
        this.ContrastValue && this.items[2].push(data[ this.ContrastValue]);
        if ( this.ActualValue &&  this.ContrastValue) {
          this.items[3].push(Number((data[this.ActualValue] / data[this.ContrastValue] * 100).toFixed(2)));
        } else if ( this.ActualValue) {
          this.items[3].push(Number((data[this.ActualValue] / 100 * 100).toFixed(2)));
        }
        
        this.Dimension && this.items[0].push(data[this.Dimension]);

        const getSelectionId = (_item) => {
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainData.profile.dimension.values[0], _item);
          return selectionId;
        }
        this.Dimension && this.items[5].push(getSelectionId(data));
      })

      if (this.ActualValue && this.ContrastValue && this.Dimension) {
        this.allShow = true;
        this.items[4] = [this.ActualValue, this.ContrastValue, this.Dimension];
        this.items[0] = plainData.sort[this.Dimension] ? plainData.sort[this.Dimension].order : '';

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
    }else if(sorttype == "desc" && according === 'accordingPercent'){
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
    }
    return;
  }

  private _getRichList(_options,allData:any) {
    const {rankingConditionCollection: rankingArr, rankingTextStyle: textStyle,rankingShape: bgShape, rankingSize: widthSize,  rankingBackgroundImage: bgImage, rankingBackgroundColor: bgColor ,showBackgroundColor} = _options;
   const _basicTextStyle = {
    fontSize: this.setFontSize(textStyle.fontSize),
    fontWeight: textStyle.fontWeight == "Light"?textStyle.fontWeight + "er":textStyle.fontWeight,
    fontFamily: textStyle.fontFamily,
    fontStyle: textStyle.fontStyle,
    borderRadius: bgShape === 'circular' ? 100 : '',
    width:10,
    height:10,
    align: 'left',
    padding: [widthSize, widthSize],
    }
    let styleList = {
      idx: {
        color: textStyle.color,
        backgroundColor:bgShape === 'none' || this.isMock ? 'transparent' : this.setBackgroundImage(bgImage,bgColor),
        ..._basicTextStyle    
      }
    }
     rankingArr.map((_item) => {
      if (_item.rankingConditionValue) {
        styleList[`idx${_item.rankingConditionValue}`] = {
          color: _item.rankingFontColor || textStyle.color,
          backgroundColor: this.setBackgroundImage(_item.rankingConditionImage,_item.rankingConditionColor) || this.setBackgroundImage(bgImage,bgColor),
          ..._basicTextStyle    
        }
     }
    })
    return styleList;
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
    const _target = array.find((_item) => Number(_item.rankingConditionValue) === index);
    if(type === 'bg') {
      if(_target) {
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

  public setFontSize(fontSizeValue: any){
    let fontUnit  = fontSizeValue.substring(0,fontSizeValue.length-2)
    let fontLastTwo = fontSizeValue.substring(fontSizeValue.length-2,fontSizeValue.length)
    return fontLastTwo === 'px'?  fontUnit : fontUnit*(96/72)  // windows, no apple
  }

  public setBackgroundImage(newSrc: any,newColor: any){
    if(newSrc){
      const newImage = new Image();
      newImage.src = newSrc
      return {image:newImage}
    }else{
      return newColor
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
        trigger: 'item',
        backgroundColor:'rgba(253,245,230,1)',
        padding: [10, 15],
        textStyle:{
          color:'#363636'
        },
        formatter: (params) => {
          if (this.isMock) {
            return this.items[4][0]
          } else {
            let _toolTipText = ''
            // .toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,') 
            let actualTip = items[1][params.dataIndex]
            let contrast = items[2][params.dataIndex]
            _toolTipText += this.isDimension ? `${this.Dimension}: ${items[0][params.dataIndex]} <br>` : ''
            _toolTipText += this.isActualValue ? `${this.ActualValue}: ${this.formatData(actualTip, options.showSecondBarActualUnit, this.actualFormate)}<br>` : '';
            _toolTipText += this.isContrastValue ? `${this.ContrastValue}: ${this.formatData(contrast, options.showSecondBarContrastUnit, this.contrastFormate)}<br>` : '';
            ;
            return _toolTipText;
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
        data:  this.isMock ? items[3]: (this.isDimension ? items[0]: items[1]),
        inverse: true,
        axisTick: {
          show: false
        },
        position: 'right',
        axisLabel: {
          show: options.showLabel,
          formatter: (params, formatterIndex) => {
            let dataRatio = ''
            if (this.isMock) {
              dataRatio = params + '%';
            } else {
              if (this.isDimension) {
                let percent = options.showSecondBarPercent && this.isActualValue ? this.items[3][formatterIndex].toFixed(options.showSecondPercentFormate) + '%' : '';
                let actual = options.showSecondBarActual && this.isActualValue ? `${this.formatData(this.items[1][formatterIndex], options.showSecondBarActualUnit, this.actualFormate)}` : '';
                let contrast = options.showSecondBarContrast && this.isContrastValue ? this.formatData(this.items[2][formatterIndex], options.showSecondBarContrastUnit, this.contrastFormate) : '';
                const _target = [percent, actual, contrast];
                dataRatio = _target.filter((_text) => _text).join('/');
              } else {
                dataRatio = items[1];
              }
            }
            return dataRatio 
          },
          color: options.textStyle.color,
          fontSize: this.setFontSize(options.textStyle.fontSize),
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
        type: options.barSymbolType === 'default' ? "bar" : 'pictorialBar',
        barWidth: options.barWidth,
        data: this.isMock ?  items[3] : (this.isContrastValue ? items[3]: items[1]),
        symbolRepeat: "fixed",
        symbolMargin: options.barSymbolMargin,
        symbol: options.barSymbolType === 'default' ? '' : (options.barSymbolType === 'custom' ? `image://${options.barSymbolImage}` : options.barSymbolType),
        symbolClip: true,
        symbolSize: [`${options.barSymbolSizeX}`, `${options.barSymbolSizeY}`],
        symbolPosition: "start",
        symbolOffset: [0, 0],
        // with: 12,
        label: {
          show: options.showBarLabel,
          margin: 1,
          position: [options.firstBarPositionX,options.firstBarPositionY],
          rotate : options.rotationDegree,
          width: 65,
          color: options.labelTextStyle.color,
          fontSize:this.setFontSize(options.labelTextStyle.fontSize),
          fontWeight: _fontWeight,
          fontFamily: options.labelTextStyle.fontFamily,
          fontStyle: options.labelTextStyle.fontStyle,
          // backgroundColor:'red',
          formatter: (value) => {
            let dataRatio = ''
            if (this.isMock) {
              `${value.data}%`
            } else {
              if (this.isDimension) {
                let name = options.showFirstBarCategory && this.isDimension ? value.name:''
                let percent = options.showFirstBarPercent && this.isActualValue ? this.items[3][value.dataIndex].toFixed(options.showFirstPercentFormate) + '%' : '';
                let actual = options.showFirstBarActual && this.isActualValue ? `${this.formatData(this.items[1][value.dataIndex], options.showFirstBarActualUnit, this.actualFormate)}` : '';
                let contrast = options.showFirstBarContrast && this.isContrastValue ? this.formatData(this.items[2][value.dataIndex], options.showFirstBarContrastUnit, this.contrastFormate) : '';
                let _target = [name, percent, actual, contrast];
                if(options.displayPolicy === 'lineFeed'){
                  _target.splice(1,0,'\n')
                  dataRatio = _target.splice(0,2).join('') + _target.filter((_text) => _text).join('/');
                }else if(options.displayPolicy === 'ellipsis'){
                  let _targetArr = _target.filter((_text) => _text)[0] && [_target.filter((_text) => _text)[0],'...']
                  _target.length = 0
                  _target = _target.concat(_targetArr)
                  dataRatio = _target.join('')
                }else{
                  dataRatio = _target.filter((_text) => _text).join('/');
                }
              } else {
                dataRatio = items[1];
              }
            }
            return dataRatio 
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
          barBorderRadius: [options.radiusLeftTop,options.radiusRightTop,options.radiusLeftDown,options.radiusRightDown]
        }
      }, {
        type: options.barSymbolType === 'default' ? "bar" : 'pictorialBar',
        barWidth: options.barWidth,
        xAxisIndex: 0,
        barGap: "-100%",
        data: items[this.isMock ? 0 : 3].map(function (item) {
          return 100
        }),
        symbolRepeat: "fixed",
        symbolMargin: options.barSymbolMargin,
        symbol: options.barSymbolType === 'default' ? '' : (options.barSymbolType === 'custom' ? (options.barSymbolImage?`image://${options.barSymbolImage}`:'default') : options.barSymbolType),
        symbolClip: true,
        symbolSize: [`${options.barSymbolSizeX}`, `${options.barSymbolSizeY}`],
        symbolPosition: "start",
        symbolOffset: [0, 0],
        itemStyle: {
          color: options.barBackgroundColor,
          opacity: options.barSymbolType === 'custom' ? 0.5 : 1,
          barBorderRadius: [options.radiusLeftTop,options.radiusRightTop,options.radiusLeftDown,options.radiusRightDown]
        },
        label: {
          show: options.showRanking,
          margin: 1,
          position: [options.secondBarPositionX, options.secondBarPositionY] ,
          width:65,
          lineHeight:options.barWidth,
          formatter: (value) => {
            if (this.isMock) {
              return  '{idx|' +  items[0][value.dataIndex]+ '}'
            } else if(options.showRanking && !this.isMock){
                const _target = options.rankingConditionCollection.find((_item) => Number(_item.rankingConditionValue) === (value.dataIndex+1));
                let replaceOrder = !!_target&&_target.rankingReplaceValue || (value.dataIndex+1)
              
              if (options.showBackgroundColor) {
                if (_target) {
                  return '{idx'+ (value.dataIndex+1) +'|'+ replaceOrder + '}'
                } else {
                  return '{idx|'+ replaceOrder + '}'
                }
              } else {
                return '{idx|'+ replaceOrder + '}'
              }
              // if (options.showBackgroundColor && options.rankingConditionCollection) {
              //     return '{idx'+ (value.dataIndex+1) +'|'+ replaceOrder + '}'
              //   }else {
              //     return '{idx|'+ replaceOrder + '}'
              //   }
            } 
            
          },
          rich:this._getRichList(options ,items),
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

    // fill shape
    if (updateOptions.properties.barSymbolType === 'default') {
      hiddenOptions = hiddenOptions.concat(['barSymbolImage', 'barSymbolSizeX', 'barSymbolSizeY','barSymbolMargin'])
    } else {
      hiddenOptions = hiddenOptions.concat(['radiusLeftTop', 'radiusRightTop', 'radiusLeftDown', 'radiusRightDown'])
    }
    
    if (updateOptions.properties.barSymbolType !== 'custom') {
      hiddenOptions = hiddenOptions.concat(['barSymbolImage'])
    }

    if (updateOptions.properties.rankingShape !== 'custom') {
      hiddenOptions = hiddenOptions.concat(['rankingBackgroundImage'])
    }
    if (updateOptions.properties.rankingShape === 'none') {
      hiddenOptions = hiddenOptions.concat(['rankingBackgroundColor', 'rankingSize'])
    }
    if (updateOptions.properties.barSymbolType !== 'custom') {
      hiddenOptions = hiddenOptions.concat(['barSymbolImage'])
    }

    // dataLabel
    if (!updateOptions.properties.showBarLabel) {
      hiddenOptions = hiddenOptions.concat(['axisYWidth', 'firstBarPositionX', 'firstBarPositionY','rotationDegree', 'showFirstBarCategory', 'showFirstBarPercent', 'showFirstBarActual', 'showFirstBarContrast','labelTextStyle', 'displayPolicy'])
    }
    // Classification axis
    if (!updateOptions.properties.showLabel) {
      hiddenOptions = hiddenOptions.concat([ 'showSecondBarPercent','showSecondPercentFormate','showSecondBarActual', 'showSecondBarContrast', 'textStyle'])
    }

    if (!updateOptions.properties.showRanking) {
      hiddenOptions = hiddenOptions.concat(['secondBarPositionX', 'secondBarPositionY','rankingShape', 'rankingBackgroundColor', 'rankingBackgroundImage', 'rankingSize', 'rankingTextStyle','showBackgroundColor', 'rankingConditionCollection' ])
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
