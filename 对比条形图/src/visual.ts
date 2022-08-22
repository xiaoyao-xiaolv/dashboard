import '../style/visual.less';
import _ = require('lodash');
import CustomStyle from './customStyle.js';
const echarts = require('echarts');

const clickLeftMouse = 0;
const clickRightMouse = 2;
let _styleName = 'default';
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
  private compareCol: any;
  private ContrastValue: string;
  private richStyle: any;
  private format1: any;
  private format2: any;
  // static mockItems = [["人事部", "财务部", "销售部", "市场部", "采购部", "产品部", "技术部", "客服部", "后勤部"]
  //   , [58, 46, 47, 49, 59, 17, 25, 83, 34]
  //   , [74, 64, 78, 65, 79, 21, 28, 91, 38]
  //   , [78.38, 71.88, 60.26, 75.38, 74.68, 80.95, 89.29, 91.21, 89.47]
  //   , ["复工人数", "总人数"]
  // ];
  static mockItems = [["人事部", "财务部", "销售部", "市场部"]
    , [58, 46, 47, 49]
    , [74, 64, 78, 65]
    , [78.38, 71.88, 60.26, 75.38]
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
    this.items = [[], [], [], [], [], [],[]];

    if (dataView && dataView.plain.profile.ActualValue.values.length) {
      this.isMock = false;
      const plainData = dataView.plain;
      this.ActualValue = plainData.profile.ActualValue.values.length ? plainData.profile.ActualValue.values[0].display : '';
      this.ContrastValue = plainData.profile.ContrastValue.values.length ? plainData.profile.ContrastValue.values[0].display : '';
      this.Dimension = plainData.profile.dimension.values.length ? plainData.profile.dimension.values[0].display : '';
      this.compareCol = plainData.profile.compareCol.values.length ? plainData.profile.compareCol.values[0].display : '';
      this.actualFormate = this.ActualValue && plainData.profile.ActualValue.values[0].format;
      this.isActualValue = !!plainData.profile.ActualValue.values.length;
      this.isContrastValue = !!plainData.profile.ContrastValue.values.length;
      this.isDimension = !!plainData.profile.dimension.values.length;
      let tooltipFields = [];
      if (this.Dimension != '') {
        let datas = plainData.data;
        const sortFlags = plainData.sort[this.Dimension].order;
        let newItems: any = sortFlags.map((flags) => {
          return newItems = datas.find((item) => item[this.Dimension] === flags && item)
        })
        //get tooltipFields
        if(plainData.profile.tooltipFields.values.length != 0){
          this.items.push([])
          plainData.profile.tooltipFields.values.forEach((val) => {
            this.items.push([])
            tooltipFields.push(val.display)
          });
          this.items[7] = tooltipFields
        }

        datas = newItems.filter((item) => item)
        datas.map((data: any) => {
          this.contrastFormate = this.ContrastValue && plainData.profile.ContrastValue.values[0].format;
          this.ActualValue && this.items[1].push(data[this.ActualValue]);
          this.ContrastValue && this.items[2].push(data[this.ContrastValue]);
          tooltipFields.forEach((val,index) => {
            this.items[8+index].push(data[val])
          })
          if (plainData.profile.compareCol.values.length != 0) {
            this.items[6].push(data[this.compareCol])
          }

          if (this.ActualValue && this.ContrastValue) {
            this.items[3].push(Number((data[this.ActualValue] / data[this.ContrastValue] * 100).toFixed(2)));
          } else if (this.ActualValue) {
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
          // this.items[0] = plainData.sort[this.Dimension] ? plainData.sort[this.Dimension].order : '';

        }
        this.actualFormat = plainData.profile.ActualValue.options.valueFormat;
        this.contrastFormat = plainData.profile.ContrastValue.options.valueFormat;
      } else {
        if (this.ContrastValue != '') {
          this.items[0].push(this.ActualValue)
          this.items[1].push(plainData.data[0][this.ActualValue])
          this.items[2].push(plainData.data[0][this.ContrastValue])
          this.items[3].push(Number((plainData.data[0][this.ActualValue] / plainData.data[0][this.ContrastValue] * 100).toFixed(2)))
          this.items[4].push(this.ActualValue)
          this.items[4].push(this.ContrastValue)
        } else {
          this.items[0].push(this.ActualValue)
          this.items[1].push(plainData.data[0][this.ActualValue])
          this.items[3].push(100)
          this.items[4].push(this.ActualValue)
        }
      }
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
    } else if (sorttype == "desc" && according === 'accordingPercent') {
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
    } else if (sorttype == "asc" && according === 'accordingActual') {
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
    } else if (sorttype == "desc" && according === 'accordingActual') {
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

  private _getRichList(_options, allData: any) {
    const { rankingConditionCollection: rankingArr, rankingTextStyle: textStyle, rankingShape: bgShape, rankingSize: widthSize, rankingBackgroundImage: bgImage, rankingBackgroundColor: bgColor, showBackgroundColor } = _options;
    const _basicTextStyle = {
      fontSize: this.setFontSize(textStyle.fontSize),
      fontWeight: textStyle.fontWeight == "Light" ? textStyle.fontWeight + "er" : textStyle.fontWeight,
      fontFamily: textStyle.fontFamily,
      fontStyle: textStyle.fontStyle,
      borderRadius: bgShape === 'circular' ? 100 : '',
      width: 10,
      height: 10,
      align: 'left',
      padding: [widthSize, widthSize],
    }
    let styleList = {
      idx: {
        color: textStyle.color,
        backgroundColor: bgShape === 'none' || this.isMock ? 'transparent' : this.setBackgroundImage(bgImage, bgColor),
        ..._basicTextStyle
      }
    }
    rankingArr.map((_item) => {
      if (_item.rankingConditionValue) {
        styleList[`idx${_item.rankingConditionValue}`] = {
          color: _item.rankingFontColor || textStyle.color,
          backgroundColor: this.setBackgroundImage(_item.rankingConditionImage, _item.rankingConditionColor) || this.setBackgroundImage(bgImage, bgColor),
          ..._basicTextStyle
        }
      }
    })
    this.richStyle = styleList;
    return styleList;
  }

  public formatData = (number, dataUnit, formate) => {
    let format = number
    if (dataUnit === 'auto') {
      const formatService = this.host.formatService;
      let realDisplayUnit = dataUnit;
      if (formatService.isAutoDisplayUnit(dataUnit)) {
        realDisplayUnit = formatService.getAutoDisplayUnit([number]);
      }
      return format = formatService.format(formate, number, realDisplayUnit);
    } else {
      const units = [{
        value: 1,
        unit: '',
        DisplayUnit: 'none'
      }, {
        value: 100,
        unit: '百',
        DisplayUnit: 'hundreds'
      }, {
        value: 1000,
        unit: '千',
        DisplayUnit: 'thousands'
      }, {
        value: 10000,
        unit: '万',
        DisplayUnit: 'tenThousands'
      }, {
        value: 100000,
        unit: '十万',
        DisplayUnit: 'hundredThousand'
      }, {
        value: 1000000,
        unit: '百万',
        DisplayUnit: 'millions'
      }, {
        value: 10000000,
        unit: '千万',
        DisplayUnit: 'tenMillion'
      }, {
        value: 100000000,
        unit: '亿',
        DisplayUnit: 'hundredMillion'
      }, {
        value: 1000000000,
        unit: '十亿',
        DisplayUnit: 'billions'
      }]
      let formatUnit = units.find((item) => item.value === Number(dataUnit))
      return this.host.formatService.format(formate, format, formatUnit.DisplayUnit)
    }
  }


  public setTopColor(array: any, index: Number, type: string) {
    const _target = array.find((_item) => Number(_item.rankingConditionValue) === index);
    if (type === 'bg') {
      if (_target) {
        return _target.rankingConditionImage && { image: _target.rankingConditionImage } || _target.rankingConditionColor || ' '
      } else {
        return ''
      }
    } else if (type === 'font') {
      if (_target) {
        return _target.rankingFontColor || ''
      }

    }
  }

  public setFontSize(fontSizeValue: any) {
    let fontUnit = fontSizeValue.substring(0, fontSizeValue.length - 2)
    let fontLastTwo = fontSizeValue.substring(fontSizeValue.length - 2, fontSizeValue.length)
    return fontLastTwo === 'px' ? fontUnit : fontUnit * (96 / 72)  // windows, no apple
  }

  public setBackgroundImage(newSrc: any, newColor: any) {
    if (newSrc) {
      const newImage = new Image();
      newImage.src = newSrc
      return { image: newImage }
    } else {
      return newColor
    }
  }

  private onUpdateStylePropertiesData = () => {
    if (this.properties.styleName !== this.properties.initStyleName) {
      this.host.propertyService.setProperty('initStyleName', this.properties.styleName);
      _styleName = this.properties.styleName;
      const _initData = this.properties.styleName === 'default' ? CustomStyle.default : {
        ...CustomStyle.default,
        ...CustomStyle[this.properties.styleName]
      }
      for (let key in _initData) {
        if (key !== 'styleName') {
          this.host.propertyService.setProperty(key, _initData[key]);
        }
      }
    }
  }
  private render() {
    this.chart.clear();
    const options = this.properties;

    // update custom style 
    this.onUpdateStylePropertiesData();
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
    this._getRichList(options, items)
    let option = {

      tooltip: {
        show: true,
        trigger: 'item',
        backgroundColor: 'rgba(253,245,230,1)',
        padding: [10, 15],
        textStyle: {
          color: '#363636'
        },
        formatter: (params) => {
          if (this.isMock) {
            return this.items[4][0]
          } else {
            let _toolTipText = ''
            let dataIndex = params.dataIndex;
            // .toString().replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,') 
            let actualTip = items[1][params.dataIndex]
            let contrast = items[2][params.dataIndex]
            _toolTipText += this.isDimension ? `${this.Dimension}: ${items[0][params.dataIndex]} <br>` : ''
            _toolTipText += this.isActualValue ? `${this.ActualValue}: ${this.formatData(actualTip, options.showSecondBarActualUnit, this.actualFormate)}<br>` : '';
            _toolTipText += this.isContrastValue ? `${this.ContrastValue}: ${this.formatData(contrast, options.showSecondBarContrastUnit, this.contrastFormate)}<br>` : '';
            if(this.items.length > 7){
              this.items[7].forEach((val,index) => {
                _toolTipText += `${val}  : ${this.items[8+index][dataIndex]}<br>`;
              });
            }
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
        data: this.isMock ? items[3] : (this.isDimension ? items[0] : items[1]),
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
                dataRatio = this.formatData(this.items[1][0], options.showSecondBarActualUnit, this.actualFormate);
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
      series: [
        {
        type: options.barSymbolType === 'default' ? "bar" : 'pictorialBar',
        // barWidth: options.barWidth,
        barWidth: options.styleName ==="style4" ? options.barWidthStyle :options.barWidth,
        data: this.isMock ? items[3] : (this.isContrastValue ? items[3] : items[1]),
        showBackground: !this.isContrastValue && options.showBackground,
        backgroundStyle: {
          color: options.barBackgroundColor,
          borderRadius: [options.radiusLeftTop,options.radiusRightTop,options.radiusRightDown,options.radiusLeftDown]
        },
        symbolRepeat: "fixed",
        symbolMargin: options.barSymbolMargin,
        symbol: options.barSymbolType === 'default' ? '' : (options.barSymbolType === 'custom' ? (options.barSymbolImage ? `image://${options.barSymbolImage}` : 'default') : options.barSymbolType),
        symbolClip: true,
        symbolSize: [`${options.barSymbolSizeX}`, `${options.barSymbolSizeY}`],
        symbolPosition: "start",
        symbolOffset: [0, 0],
        // with: 12,
        label: {
          show: options.showBarLabel,
          margin: 1,
          position: [options.firstBarPositionX, options.firstBarPositionY],
          rotate: options.rotationDegree,
          width: 65,
          color: options.labelTextStyle.color,
          fontSize: this.setFontSize(options.labelTextStyle.fontSize),
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
                var strs = value.name.split(''); //字符串数组
                var str = ''
                var len = options.categoryLen;
                for (var i = 0, s; s = strs[i++];) { //遍历字符串数组
                  str += s;
                  if (!(i % len)) str += '\n'; //按需要求余
                }
                let name = options.showFirstBarCategory && this.isDimension ? str : ''
                let percent = options.showFirstBarPercent && this.isActualValue ? this.items[3][value.dataIndex].toFixed(options.showFirstPercentFormate) + '%' : '';
                let actual = options.showFirstBarActual && this.isActualValue ? `${this.formatData(this.items[1][value.dataIndex], options.showFirstBarActualUnit, this.actualFormate)}` : '';
                let contrast = options.showFirstBarContrast && this.isContrastValue ? this.formatData(this.items[2][value.dataIndex], options.showFirstBarContrastUnit, this.contrastFormate) : '';
                let _target = [name, percent, actual, contrast];

                const getTextWidth = (_string) => {
                  const _canvas = document.createElement('canvas')
                  const context = _canvas.getContext('2d');
                  const { width } = context.measureText(_string);
                  return width;
                }

                if (options.displayPolicy === 'lineFeed') {
                  _target.splice(1, 0, '\n')
                  dataRatio = _target.splice(0, 2).join('') + _target.filter((_text) => _text).join('/');
                } else if (options.displayPolicy === 'ellipsis') {
                  let _targetArr = _target.filter((_text) => _text)[0] && [_target.filter((_text) => _text)[0], '...']
                  _target.length = 0
                  _target = _target.concat(_targetArr)
                  dataRatio = _target.join('')
                } else {
                  dataRatio = _target.filter((_text) => _text).join('/');
                }
              } else {
                dataRatio = items[1];
              }
            }
            if(!this.isDimension){
              if(this.isContrastValue){
                dataRatio = this.items[4][0] + "/" + this.items[4][1]
              }else{
                dataRatio = this.items[4][0]
              }
            }
            return dataRatio
          },
        },
        itemStyle:{
          normal: {
            color: (params) => {
              if(this.compareCol){
                return params.value / 100 >= items[6][params.dataIndex] ?  options.greCompareCol : options.lesCompareCol ;
              }else{
                return this.properties.showBackgroundColor && this.properties.rankingConditionCollection.length>params.dataIndex &&  this.properties.rankingConditionCollection[params.dataIndex].rankingStartConditionColor &&  this.properties.rankingConditionCollection[params.dataIndex].rankingEndConditionColor  ? 
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                //   {
                //   offset: 0,
                //   // color: options.barStartColor
                //   color: this.properties.rankingConditionCollection[params.dataIndex].rankingStartConditionColor 
                // },
                {
                  offset: options.inner/100,
                  // color: options.barStartColor
                  color: this.properties.rankingConditionCollection[params.dataIndex].rankingStartConditionColor 
                },
                {
                  offset: 1,
                  // color: options.barEndcolor,
                  color: this.properties.rankingConditionCollection[params.dataIndex].rankingEndConditionColor 
                }
                ],
                global: false
              }:
              {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                //   {
                //   offset: 0,
                //   color: options.barEndcolor
                // },
                {
                  offset: options.inner/100,
                  // color: options.barStartColor
                  color: options.barEndcolor
                },
                {
                  offset: 1,
              
                  color: options.barStartColor
                }
                ],
                global: false
              }
              }
            },
            barBorderRadius: [options.radiusLeftTop, options.radiusRightTop, options.radiusRightDown, options.radiusLeftDown]
          },
        }
        // itemStyle: {
        //   color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
        //     offset: 0,
        //     color: options.barStartColor // 0% 处的颜色
        //   }, {
        //     offset: 1,
        //     color: options.barEndcolor // 100% 处的颜色
        //   }], false),
        //   barBorderRadius: [options.radiusLeftTop, options.radiusRightTop, options.radiusRightDown, options.radiusLeftDown]
        // }
      }, {
        type: options.barSymbolType === 'default' ? "bar" : 'pictorialBar',
        // barWidth: options.barWidth,
        barWidth: options.styleName==="style4" ? options.barWidthStyle :options.barWidth,
        xAxisIndex: 0,
        barGap: "-100%",
        data: items[this.isMock ? 0 : 3].map(function (item) {
          return 100
        }),
        symbolRepeat: "fixed",
        symbolMargin: options.barSymbolMargin,
        symbol: options.barSymbolType === 'default' ? '' : (options.barSymbolType === 'custom' ? (options.barSymbolImage ? `image://${options.barSymbolImage}` : 'default') : options.barSymbolType),
        symbolClip: true,
        symbolSize: [`${options.barSymbolSizeX}`, `${options.barSymbolSizeY}`],
        symbolPosition: "start",
        symbolOffset: [0, 0],
        itemStyle: {
          color: options.barBackgroundColor,
          opacity: options.barSymbolType === 'custom' ? 0.5 : 1,
          barBorderRadius: [options.radiusLeftTop, options.radiusRightTop, options.radiusLeftDown, options.radiusRightDown]
        },
        label: {
          show: options.showRanking,
          margin: 1,
          position: [options.secondBarPositionX, options.secondBarPositionY],
          width: 65,
          lineHeight: options.barWidth,
          formatter: (value) => {
            if (this.isMock) {
              return '{idx|' + items[0][value.dataIndex] + '}'
            } else if (options.showRanking && !this.isMock) {
              const _target = options.rankingConditionCollection.find((_item) => Number(_item.rankingConditionValue) === (value.dataIndex + 1));
              let replaceOrder = !!_target && _target.rankingReplaceValue || (value.dataIndex + 1)

              if (options.showBackgroundColor) {
                if (_target) {
                  return '{idx' + (value.dataIndex + 1) + '|' + replaceOrder + '}'
                } else {
                  return '{idx|' + replaceOrder + '}'
                }
              } else {
                return '{idx|' + replaceOrder + '}'
              }
            }

          },
          rich: this.richStyle,
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
    //样式4
    let series=[];
    // let aircraft = 'path://M107.000,71.000 C104.936,71.000 102.665,70.806 100.273,70.467 C94.592,76.922 86.275,81.000 77.000,81.000 C70.794,81.000 65.020,79.170 60.172,76.029 C66.952,74.165 72.647,69.714 76.173,63.817 C69.821,61.362 64.063,58.593 60.000,56.039 L60.000,52.813 C70.456,53.950 80.723,55.000 83.000,55.000 C88.972,55.000 93.000,53.723 93.000,50.000 C93.000,47.071 89.222,45.000 83.000,45.000 C80.723,45.000 70.456,46.050 60.000,47.187 L60.000,43.989 C64.057,41.431 69.807,38.644 76.168,36.173 C72.641,30.281 66.948,25.834 60.172,23.971 C65.020,20.830 70.794,19.000 77.000,19.000 C86.270,19.000 94.584,23.074 100.265,29.524 C102.647,29.191 104.918,29.000 107.000,29.000 C129.644,29.000 148.000,50.000 148.000,50.000 C148.000,50.000 129.644,71.000 107.000,71.000 ZM113.000,38.000 C106.373,38.000 101.000,43.373 101.000,50.000 C101.000,56.627 106.373,62.000 113.000,62.000 C119.627,62.000 125.000,56.627 125.000,50.000 C125.000,43.373 119.627,38.000 113.000,38.000 ZM113.000,56.000 C109.686,56.000 107.000,53.314 107.000,50.000 C107.000,46.686 109.686,44.000 113.000,44.000 C116.314,44.000 119.000,46.686 119.000,50.000 C119.000,53.314 116.314,56.000 113.000,56.000 ZM110.500,19.000 C109.567,19.000 108.763,18.483 108.334,17.726 C100.231,9.857 89.187,5.000 77.000,5.000 C64.813,5.000 53.769,9.857 45.666,17.726 C45.237,18.483 44.433,19.000 43.500,19.000 C42.119,19.000 41.000,17.881 41.000,16.500 C41.000,15.847 41.256,15.259 41.665,14.813 L41.575,14.718 C50.629,5.628 63.156,-0.000 77.000,-0.000 C90.844,-0.000 103.371,5.628 112.425,14.718 L112.335,14.813 C112.744,15.259 113.000,15.847 113.000,16.500 C113.000,17.881 111.881,19.000 110.500,19.000 ZM53.000,49.484 C61.406,48.626 77.810,47.000 81.345,47.000 C87.353,47.000 91.000,48.243 91.000,50.000 C91.000,52.234 87.111,53.000 81.345,53.000 C77.810,53.000 61.406,51.374 53.000,50.516 L53.000,49.484 ZM53.000,47.000 L9.000,50.000 L53.000,53.000 L53.000,56.000 L-0.000,50.000 L53.000,44.000 L53.000,47.000 ZM43.500,81.000 C44.433,81.000 45.237,81.517 45.666,82.274 C53.769,90.143 64.813,95.000 77.000,95.000 C89.187,95.000 100.231,90.143 108.334,82.274 C108.763,81.517 109.567,81.000 110.500,81.000 C111.881,81.000 113.000,82.119 113.000,83.500 C113.000,84.153 112.744,84.741 112.335,85.187 L112.425,85.282 C103.371,94.372 90.844,100.000 77.000,100.000 C63.156,100.000 50.629,94.372 41.575,85.282 L41.665,85.187 C41.256,84.741 41.000,84.153 41.000,83.500 C41.000,82.119 42.119,81.000 43.500,81.000 Z'
    if(this.properties.styleName=="style4"){
      let obj={
          type: 'pictorialBar',
          symbol: `image://${options.SymbolImage}`,
          // symbol:`${ `${aircraft}` }`,
          symbolSize: [`${options.SymbolSizeX}`, `${options.SymbolSizeY}`],
          symbolOffset: [`${options.SymbolMargin}`, 0],
          // symbolOffset:[options.SymbolSizeX/2.5 === options.SymbolMargin ? options.SymbolSizeX/2.5 :options.SymbolMargin ,0],
          z: 12,
          itemStyle: {
              normal: {
                  color: '#fff',
              },
          },
          data: this.getSymbolData(this.isMock ? items[3] : (this.isContrastValue ? items[3] : items[1])),
      }
      series.push(obj)
    }
    option.series=option.series.concat(series)
    this.chart.setOption(option)
  }
  public getSymbolData = (data) => {
    let arr = [];
    for (var i = 0; i < data.length; i++) {
        arr.push({
            value: data[i],
            symbolPosition: 'end',
        });
    }
    return arr;
  };

  
  public onResize() {
    this.chart.resize();
    this.render();
  }
  // 自定义属性可见性
  public getInspectorHiddenState(updateOptions: any): string[] {
    let hiddenOptions: Array<string> = [''];
    if(updateOptions.dataViews.length > 0){
        //compareCol
        if(updateOptions.dataViews[0].plain.profile.compareCol.values.length == 0){
          hiddenOptions = hiddenOptions.concat(['greCompareCol', 'lesCompareCol'])
        }else{
          hiddenOptions = hiddenOptions.concat(['barEndcolor', 'inner','barStartColor'])
        }
        // fill shape
        if (updateOptions.properties.barSymbolType === 'default') {
          hiddenOptions = hiddenOptions.concat(['barSymbolImage', 'barSymbolSizeX', 'barSymbolSizeY', 'barSymbolMargin'])
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
        if (updateOptions.dataViews[0].plain.profile.ContrastValue.values.length != 0) {
          hiddenOptions = hiddenOptions.concat(['showBackground'])
        }else{
          if (!updateOptions.properties.showBackground) {
            hiddenOptions = hiddenOptions.concat(['barBackgroundColor'])
          }
        }

        // dataLabel
        if (!updateOptions.properties.showBarLabel) {
          hiddenOptions = hiddenOptions.concat(['axisYWidth', 'firstBarPositionX', 'firstBarPositionY', 'rotationDegree', 'showFirstBarCategory', 'showFirstBarPercent', 'showFirstBarActual', 'showFirstBarContrast', 'labelTextStyle', 'displayPolicy'])
        }
        // Classification axis
        if (!updateOptions.properties.showLabel) {
          hiddenOptions = hiddenOptions.concat(['showSecondBarPercent', 'showSecondPercentFormate', 'showSecondBarActual', 'showSecondBarContrast', 'textStyle'])
        }

        if (!updateOptions.properties.showRanking) {
          hiddenOptions = hiddenOptions.concat(['secondBarPositionX', 'secondBarPositionY', 'rankingShape', 'rankingBackgroundColor', 'rankingBackgroundImage', 'rankingSize', 'rankingTextStyle', 'showBackgroundColor', 'rankingConditionCollection'])
        }
        if (!updateOptions.properties.showFirstBarCategory) {
          hiddenOptions = hiddenOptions.concat(['categoryLen'])
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
        if (updateOptions.properties.sortAccording === 'noOrder') {
          hiddenOptions = hiddenOptions.concat(['sorttype'])
        }

        if (updateOptions.properties.styleName === 'style4') {
          hiddenOptions = hiddenOptions.concat(['barWidth'])
        }

        if (updateOptions.properties.styleName !== 'style4') {
          hiddenOptions = hiddenOptions.concat(['SymbolImage','SymbolSizeX','SymbolSizeY','SymbolMargin','barWidthStyle'])
        }

    }else{
      hiddenOptions=hiddenOptions.concat(['barWidthStyle','showBackground','SymbolImage','SymbolSizeX','SymbolSizeY','SymbolMargin','barSymbolImage','barSymbolSizeX','barSymbolSizeY','barSymbolMargin'])
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
