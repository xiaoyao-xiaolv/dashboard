import '../style/visual.less';
import * as echarts from 'echarts';
import _ = require('lodash');

export default class Visual extends WynVisual {
  private echarts: any;
  private properties: any;
  private host: any;
  private selectionIds: any;
  private selectionManager: any;
  private container: any;
  private num : number;
  private format: any;
  private selectionIdsArray: Array<any>;
  private _total : any;
  private isMock: boolean;
  private isFlag = false;
  private mockSource=[
    ['product', 'A', 'B'],
    ['系列1-1', 43.3],
    ['系列1-2', 83.1],
    ['系列1-3', 86.4],
    ['系列1-4', 72.4],
    ['系列1-5', 72.4],
    ['系列2-1', 53.9],
    ['系列2-2', 85.8],
    ['系列2-3', 145.8]
  ];
  private static minInner = 1;
  private markLineData =[];
  private items: any = [];
  private mockItems: any=[];
  private nums: any=[];
  private sorts: any=[];

  private dimension: string;
  private payWay: any;
  private allItems: any;
  private value: string;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.echarts=echarts.init(dom);
    this.container = dom;
    this.host=host;
    this.bindEvents();
    this.selectionManager = this.host.selectionService.createSelectionManager();
    this.selectionIdsArray = new Array<any>();
    this.items = [];
    this.isMock = true;
  }

  private bindEvents=()=>{
    this.container.addEventListener('click',()=>{
      this.selectionManager.clear();
      this.selectionIdsArray = new Array<any>();
      this.host.toolTipService.hide();
      this.host.contextMenuService.hide();
      return;
    })
    //鼠标左键
     this.echarts.on('click', (params) => {
      params.event.event.stopPropagation();
      // console.log(params);

      //鼠标左键功能
      let leftMouseButton = this.properties.clickLeftMouse;
      switch (leftMouseButton) {
        //鼠标联动设置    
        case "none": {
          if (this.selectionManager.isEmpty()) {
            this.selectionIdsArray.push(this.selectionIds[params.name]);
            this.selectionManager.select(this.selectionIdsArray, true);
            return
          }

          if (!this.selectionManager.contains(this.selectionIds[params.name])) {
            this.selectionIdsArray.push(this.selectionIds[params.name]);
          } else {
            this.selectionIdsArray.splice(this.selectionIdsArray.indexOf(this.selectionIds[params.name]), 1);
            this.selectionManager.clear(this.selectionIds[params.name])
          }
          if (this.selectionIdsArray.length == this.selectionIds.length) {
            this.selectionManager.clear();
            this.selectionIdsArray = new Array<any>();
            this.host.toolTipService.hide();
            return;
          }
          this.selectionManager.select(this.selectionIdsArray, true);
          break;
        }
        default: {
          const selectionIds = this.selectionIds[params.name];
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

    })

    //鼠标右键
    this.echarts.on('mouseup', (params) => {
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
      }
    })

  }
  
  public update(options: VisualNS.IVisualUpdateOptions) {
    
    this.properties = options.properties;
    //分割数值
    this.num =this.properties.autoScaleSize;
    this.items = [];
    this.selectionIds={};
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    if(plainDataView&&
      plainDataView.profile.num.values.length && plainDataView.profile.sort.values.length){
      this.isFlag=true;
      this.nums=[];
      this.sorts=[];
      let items = plainDataView.data;
      const numDisplay=plainDataView.profile.num.values[0].display;
      const sortDisplay = plainDataView.profile.sort.values[0].display;
      
      this.dimension = plainDataView.profile.sort.values[0].display;
      const sortFlags = plainDataView.sort[this.dimension].order;
        let newItems: any = sortFlags.map((flags) => {
          return newItems = items.find((item) => item[this.dimension] === flags && item)
        })
        items = newItems.filter((item) => item)
      this.allItems = items;
      this.items[0] = items.map((item) => item[this.dimension]);
      this.items[1] = items.map((item) => {return { name: item[this.dimension], value: item[this.value]}});

      plainDataView.data.forEach((data)=>{
        console.log(data)
          this.nums.push(data[numDisplay]);
          this.sorts.push(data[sortDisplay]);
          const selectionId = this.host.selectionService.createSelectionId();
          selectionId.withDimension(plainDataView.profile.sort.values[0], data);
          this.selectionIds[data[sortDisplay]] = selectionId;
      })
    }else{
      // this.isMock = false;
      //准备数据
      this.sorts=['系列1-1','系列1-2','系列1-3','系列1-4','系列1-5','系列2-1','系列2-2','系列2-3'];
      this.dimension=this.sorts;
      this.nums=[43.3,83.1,86.4,72.4,72.4,53.9,85.8,145.8];
    }
     this.render();
  }
  //数据组合，按value排序降序
  private combine(bSorts,aNums) {
      let newArray =[['product', 'A', 'B']];
      let c = [];
      //组合成二维数组
      bSorts.forEach((item,i)=>{
        let arr1=[];
        arr1.push(item);
        arr1.push(aNums[i]);
        c.push(arr1);
      })
      //按value降序排序
      c = c.sort((a, b) => {
        if(a[1] > b[1]) {
          return -1;
        } else {
          return 1;
        }
      })
      this.mockItems = c;
      c.forEach((item,i)=>{
        newArray.push(c[i]);
      })
      console.log(newArray)
      return newArray;
  }
  // 获取表标线 对应点坐标
  private  getMarkLineData(percent) {
    // 1.获取画布 width,height
      let height = this.echarts.getHeight();
      let width = this.echarts.getWidth();
        
    // 2.  根据 series[0].center 获取圆心坐标
      //let x0 = width*0.35 // 圆心x轴坐标
    let x0 = width * this.properties.centerX/100
    //3.圆边上点坐标
      // let x1   =   x0   +   r   *   cos(ao   *   3.14   /180   )
      // let y1   =   y0   +   r   *   sin(ao   *   3.14   /180   )
    //最小宽高
    var newheight = height>width?width:height
   //“其他” 终点坐标series[0].startAngle 45
     let realx = newheight/4/0.5*this.properties.outer/100
     let realy = height*this.properties.centerY/100

    // let x1 = x0 + realx * Math.cos(45 * 3.14 / 180)
    // let y1 = realy   -   realx   *   Math.sin(45   *   3.14   /180   )
    
    let x1 = x0 + realx * Math.cos(this.properties.startAngle * 3.14 / 180)
    let y1 = realy   -   realx   *   Math.sin(this.properties.startAngle   *   3.14   /180   )
    
    let ao = 360 * (percent/100) // 扇形角度
    
    let ao1 = 0 // 用来计算的坐标角度
    // ao1=(ao<=45)?(45-ao):(360-(ao-45))
    // if(ao1<270 && ao1>45)ao1=270 // 角度当270用，要不样式不好看
    ao1=(ao<=this.properties.startAngle)?(this.properties.startAngle-ao):(360-(ao-this.properties.startAngle))
    if(ao1<270 && ao1>this.properties.startAngle)ao1=270 // 角度当270用，要不样式不好看
    
    
    let x2=0,y2=0;
    
    x2=x0 + realx * Math.cos(ao1 * 3.14 / 180)
    y2 = realy  -   realx   *   Math.sin(ao1   *   3.14   /180   )
    
    let realX;
    let rightX;
    if(this.properties.combineType=="pie"){//饼图
      // realX = `${this.properties.rightCenterX}%` 
      realX = (40 + this.properties.centerX) +"%"
      let rightX = newheight/4/0.5*this.properties.rightOuter/100
      // let righty = height*this.properties.rightCenterY/100centerY
      let righty = height*this.properties.centerY/100
      var topy = height * this.properties.centerY/100-newheight/2*this.properties.rightOuter/100
      var boty = height * this.properties.centerY/100+newheight/2*this.properties.rightOuter/100

      // var topy = height * this.properties.rightCenterY/100-newheight/2*this.properties.rightOuter/100
      // var boty = height * this.properties.rightCenterY/100+newheight/2*this.properties.rightOuter/100
      
      return [[{x:x1,y:y1},{x: realX, y: topy}],[{x:x2,y:y2},{x:realX, y: boty}]]
    }else{
      //柱形图已好
      // realX = `${this.properties.rightBarCenterX}%`
      realX = 30+this.properties.centerX+"%"
      // var barY = `${this.properties.rightBarCenterY}%`
      // var realY = this.properties.rightBarCenterY/100*height +this.properties.barHeight
      var barY = -15+this.properties.centerY+"%"
      var realY = (this.properties.centerY-15)/100*height +this.properties.barHeight
     
      return [[{x:x1,y:y1},{x: realX, y: barY}],[{x:x2,y:y2},{x:realX, y: realY}]]
    }
  }

 // 添加其他
 private  addOtherData(num,option) {
    //console.log(datasetSource)
    var percent = 0;
    var sum = 0; // 总计
    this.mockSource.forEach((data, rowIndex) => {
      if (rowIndex > 0) {
        // 第一行数据不算
        let count = 0;
        for (let key in data) {
          let value = Number(data[key]);
          if (count === 1) sum += value;
          count++;
        }
      }
    });
    //截取到需要转到小图上的数据
    let endData = this.mockSource.slice(this.mockSource.length - num);
    
    var other = [];
    other.push('其他');
    for (let i = 0; i < endData.length; i++) {
      let j = 0;
      for (let key in endData[i]) {
        let value = Number(endData[i][key]);
        if (j) {
          other[j] ? (other[j] += value) : other.push(value);
          
        }
        j++;
        
      }
      //参数0代表新增
      endData[i].splice(1, 0, '');
    }
   other[1]=other[1].toFixed(2);
   this.mockSource.push(other);                                
    // "其他"占比
    var test = ((other[1] / sum) * 100).toFixed(2);
    percent = sum ? Number(test ): 100;
    // this.markLineData = this.getMarkLineData(percent);
    option.series[0].markLine.data  = this.getMarkLineData(percent);
  }

  private render() {
    this.mockSource=[];
    this.mockSource=this.combine(this.sorts,this.nums);
    this.echarts.clear();
    let data: any = this.isMock ? this.mockItems : this.items[1];
    this._total = data.map(
      (a) => a[1]
      ).reduce((prev, next) => prev + next, 0);
    const isMock = !this.items.length;
    const hexToRgba = (hex, opacity) => {
      return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
              + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
    }
    
    const legendTextStyle = { ...this.properties.legendTextStyle };
    const getColors = (index, position: number) => {
      let backgroundColor = ''
      const pieColor: [{
        colorStops: [] | any
      }] = this.properties.pieColor && this.properties.pieColor || [];
      if (index < pieColor.length) {
        backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
      } else {
        backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
          ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
          : pieColor[index%(pieColor.length)]
      }
      return backgroundColor
    }
    let flag = this.isMock && this.isFlag ?true:false;
    let option={
      legend: {
        data: !flag ? ['系列1-1', '系列1-2', '系列1-3', '系列1-4', '系列1-5', '系列2-1','系列2-2','系列2-3'] : this.items[0].map((_item) => `${_item}`),
        show: this.properties.showLegend,
        type: this.properties.openLegendPage ?  'scroll' : 'plain',
        left: this.properties.legendPosition === 'left' || this.properties.legendPosition === 'right' ? this.properties.legendPosition : this.properties.legendVerticalPosition,
        top: this.properties.legendPosition === 'top' || this.properties.legendPosition === 'bottom' ? this.properties.legendPosition : this.properties.legendHorizontalPosition,
        orient:'vertical',
        width: this.properties.legendArea === 'custom' ? `${this.properties.legendWidth}%` : 'auto',
        height: this.properties.legendArea === 'custom' ? `${this.properties.legendHeight}%` : 'auto',
        align: 'left',
        itemGap: this.properties.itemGap,
        icon: this.properties.legendIcon === 'none' ? '' : this.properties.legendIcon,
        textStyle: {
          ...legendTextStyle,
          fontSize: parseInt(this.properties.legendTextStyle.fontSize),
          rich: {
            a: {
              align: 'left',
              fontSize: 14,
              color: legendTextStyle.color,
              width:this.properties.legendSeriesWidth,
              padding: [0, 15, 0, 0]
            },
            b: {
              align: 'left',
              fontSize: 14,
              color: legendTextStyle.color,
              width:this.properties.showLegendPercent,
              padding: [0, 15, 0, 0]
            },
            c: {
              align: 'left',
              fontSize: 14,
              color: legendTextStyle.color,
              width:this.properties.legendValueWidth,
              padding: [0, 15, 0, 0]
            }
          }
        },
        formatter: (name) => {
          let _firstLegendText = false;
          const _target = data.find((item: any, index) => {
            if (item[0] === name && !index) {
              _firstLegendText = true;
            }
            return item[0].toString() === name.toString()
          })
          let _legendText = '';
          let _title = '';
          if (this.properties.showLegendSeries) {
            _legendText += `{a|${_target[0].toString()}}`;
            _title += `{a|${this.dimension.toString()}}`
          }
          if (this.properties.showLegendValue) {
            if(_target[1]!=""){
              _legendText += `{b|${this.formatData(_target[1], this.properties.labelDataUnit, this.properties.labelDataType)}}`;
            }else{
              _legendText += `{b|${this.formatData(_target[2], this.properties.labelDataUnit, this.properties.labelDataType)}}`;
            }
            _title += `{b|数值}`
          }
          if (this.properties.showLegendPercent) {
            if(_target[1]!=""){
              _legendText += `{c|${Number((_target[1] / this._total * 100).toFixed(this.properties.LabelPercentDecimalPlaces))}%}`;
            }else{
              _legendText += `{c|${Number((_target[2] / this._total * 100).toFixed(this.properties.LabelPercentDecimalPlaces))}%}`;
            }
            _title += `{c|占比}`
          }
          _title += '\n'
          return _firstLegendText ? `${_legendText}`: _legendText;
        }
      },
      tooltip: {
        // formatter: "{a} : {c}",
        rigger: 'item',
        formatter: (params) => {
          let eachSector = this.allItems.find((ele)=> ele[this.dimension] === params.name)
          let toolTips = ''
          let lineWrap = '<br/>'
          this.payWay && this.payWay.forEach((element,index) => {
            toolTips += `${lineWrap}${element}${': '}${eachSector[this.payWay[index]]}`
          });
          
          if(params.value[1]!=""){
            return `${!this.isMock ? '访问量' : this.dimension} ${lineWrap}${params.name}
            :${this.formatData(params.value[1], this.properties.labelDataUnit, this.properties.labelDataType)}
             (${(params.value[1]/this._total*100).toFixed(this.properties.LabelPercentDecimalPlaces)}%)
             ${toolTips}`
          }else{
            return `${!this.isMock ? '访问量' : this.dimension} ${lineWrap}${params.name}
            :${this.formatData(params.value[2], this.properties.labelDataUnit, this.properties.labelDataType)}
             (${(params.value[2]/this._total*100).toFixed(this.properties.LabelPercentDecimalPlaces)}%)
             ${toolTips}`
          }
        }
      },
      dataset: {
          source: this.mockSource,
      },
      series: [
        {
          type: 'pie',
          //radius: '50%',
          radius: this.properties.labelPosition === 'inside' ? [`${this.properties.breakPointNumber && !this.properties.inner ? Visual.minInner : this.properties.inner}%`, `${this.properties.outer}%`] : [`${this.properties.breakPointNumber && !this.properties.inner ? Visual.minInner : this.properties.inner}%`, `${this.properties.outerOutside}%`],
          //center: ['35%', '50%'],
          center: [`${this.properties.centerX}%`, `${this.properties.centerY}%`],
          label: {
            //show: true,
            show: this.properties.labelPosition === 'center' ? false : this.properties.showLabel,
            //position: 'inside',
            position: this.properties.labelPosition,
            // formatter:'{b|数值}',
            formatter: (params) => {
              let name = this.properties.showLabelName ? params.name : ''
              let value =  this.properties.showLabelValue && this.isMock ? this.formatData(params.value[1],  this.properties.labelDataUnit,  this.properties.labelDataType) : '';
              let percent = this.properties.showLabelPercent ? `${(params.value[1]/this._total*100).toFixed( this.properties.LabelPercentDecimalPlaces)}%` : '';
              let lineFeed =  this.properties.showLabelTwoLine ? '\n':''
              if(!this.properties.showLabelTwoLine){
                return `{b|${name} ${value} ${percent}}`
              }else{
                if(name && !value && !percent){
                  return `{b|${name}}`
                }else if(!name && value && !percent){
                  return `{b|${value}}`
                }else if(!name && !value && percent){
                  return `{b|${percent}}`
                }else if(name && value && !percent){
                  return `{b|${name}${lineFeed}${value}}`
                }else if(name && !value && percent){
                  return `{b|${name}${lineFeed}${percent}}`
                }else if(!name && value && percent){
                  return `{b|${value}${lineFeed}${percent}}`
                }else {
                  return `{b|${name} ${lineFeed}${value}${'/'}${percent}}`        
                }
              }
            },
            rich:{
              b: {
                lineHeight: 20,
                ...this.properties.labelTextStyle,
                fontSize: parseInt(this.properties.labelTextStyle.fontSize),
              },
              hr: {
                backgroundColor: 'transparent',
                borderRadius: 12,
                width: 0,
                height: 10,
                padding: [3, -7, 0, -7],
              }
            } 
          },
          emphasis: {
            label: {
                show: true,
                ...this.properties.labelTextStyle,
              fontSize: parseInt(this.properties.labelTextStyle.fontSize)
            },
            scale: true,
            scaleSize: this.properties.autoScaleSize,
          },
          labelLine: {
            show: this.properties.showLabelLine,
            smooth: `${this.properties.labelLineSmooth * 0.01}`,
            lineStyle: {
              color: null,
              width: this.properties.labelLineWidth
            }
          },
          // startAngle: 45, // 起始角度 45
          startAngle:this.properties.startAngle,
          clockwise: false, // 逆时针
          markLine: {
            lineStyle: {
             
                type: 'solid',
                //color: '#BFBFBF',
                color: this.properties.lineColor[0],
                //width:'10',
                width: this.properties.connectorLine,
             
            },
            symbol: 'none',
            data: this.markLineData
          },
          itemStyle: {
            normal: {
              color: (params) => {
                return this.properties.showGradient?{
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: this.properties.showGradient ? hexToRgba(getColors(params.dataIndex, 0), 0.2) : getColors(params.dataIndex, 0), 
                  },
                  {
                    offset: 1,
                    color: this.properties.showGradient ? hexToRgba(getColors(params.dataIndex, 0), 1) : getColors(params.dataIndex, 1), 
                  }
                  ],
                  global: false
                }:getColors(params.dataIndex, 1)
              },
              borderRadius: this.properties.borderRadius,
              borderColor: this.properties.breakPointColor,
              borderWidth: this.properties.breakPointNumber
            },
            emphasis: {
              opacity: 1
            },
            borderRadius: this.properties.borderRadius,
            borderColor: this.properties.breakPointColor,
            borderWidth: this.properties.breakPointNumber
          },
          animationType: this.properties.pieStartType,
          animationEasing: this.properties.pieStartType === 'scale' ? 'elasticOut' : 'linear',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        },
        {
          type: 'pie',
          //radius: '30%',
          radius: this.properties.labelRPosition === 'inside' ? [`${this.properties.breakPointNumber && !this.properties.rightInner ? Visual.minInner : this.properties.rightInner}%`, `${this.properties.rightOuter}%`] : [`${this.properties.breakPointNumber && !this.properties.rightInner ? Visual.minInner : this.properties.rightInner}%`, `${this.properties.rightOuterOutside}%`],
          //center: ['65%', '50%'],
          // center: [`${this.properties.rightCenterX}%`, `${this.properties.rightCenterY}%`],
          center: [40+this.properties.centerX+"%", `${this.properties.centerY}%`],
          encode: {
            itemName: 'product',
            value: 'B',
          },
          label: {
            //show: true,
            show: this.properties.labelRPosition === 'center' ? false : this.properties.showRLabel,
            //position: 'inside',
            position: this.properties.labelRPosition,
            // formatter:'{b}',
            formatter: (params) => {
              let name = this.properties.showRLabelName ? params.name : ''
              let value =  this.properties.showRLabelValue && this.isMock ? this.formatData(params.value[2],  this.properties.labelRDataUnit,  this.properties.labelRDataType) : '';
              let percent =  this.properties.showRLabelPercent ? `${(params.value[2]/this._total*100).toFixed( this.properties.LabelRPercentDecimalPlaces)}%` : '';
              let lineFeed =  this.properties.showRLabelTwoLine ? '\n':''
              if(!this.properties.showRLabelTwoLine){
                return `{b|${name} ${value} ${percent}}`
              }else{
                if(name && !value && !percent){
                  return `{b|${name}}`
                }else if(!name && value && !percent){
                  return `{b|${value}}`
                }else if(!name && !value && percent){
                  return `{b|${percent}}`
                }else if(name && value && !percent){
                  return `{b|${name}${lineFeed}${value}}`
                }else if(name && !value && percent){
                  return `{b|${name}${lineFeed}${percent}}`
                }else if(!name && value && percent){
                  return `{b|${value}${lineFeed}${percent}}`
                }else {
                  return `{b|${name} ${lineFeed}${value}${'/'}${percent}}`        
                }
              }
            },
            rich:{
              b: {
                lineHeight: 20,
                ...this.properties.labelRTextStyle,
                fontSize: parseInt(this.properties.labelRTextStyle.fontSize),
              },
              hr: {
                backgroundColor: 'transparent',
                borderRadius: 12,
                width: 0,
                height: 10,
                padding: [3, -7, 0, -7],
              }
            } 
          },
          emphasis: {
            label: {
                show: true,
                ...this.properties.labelRTextStyle,
              fontSize: parseInt(this.properties.labelRTextStyle.fontSize)
            },
            scale: true,
            scaleSize: this.properties.autoScaleSize,
          },
          labelLine: {
            show: this.properties.showRLabelLine,
            smooth: `${this.properties.labelRLineSmooth * 0.01}`,
            lineStyle: {
              color: null,
              width: this.properties.labelRLineWidth
            }
          },
          itemStyle: {
            normal: {
              color: (params) => {
                return this.properties.showGradient?{
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 1,
                  y2: 1,
                  colorStops: [{
                    offset: 0,
                    color: this.properties.showGradient ? hexToRgba(getColors(params.dataIndex, 0), 0.2) : getColors(params.dataIndex, 0), 
                  },
                  {
                    offset: 1,
                    color: this.properties.showGradient ? hexToRgba(getColors(params.dataIndex, 0), 1) : getColors(params.dataIndex, 1), 
                  }
                  ],
                  global: false
                }:getColors(params.dataIndex, 1)
              },
              borderRadius: this.properties.borderRadius,
              borderColor: this.properties.breakPointColor,
              borderWidth: this.properties.breakPointNumber
            },
            emphasis: {
              opacity: 1
            },
            borderRadius: this.properties.borderRadius,
            borderColor: this.properties.breakPointColor,
            borderWidth: this.properties.breakPointNumber
          },
          animationType: this.properties.pieStartType,
          animationEasing: this.properties.pieStartType === 'scale' ? 'elasticOut' : 'linear',
        },
      ]
    };
    
   if(this.properties.combineType=="bar"){//条形图
      option['grid']=this.getBarHeight(),
      option['xAxis']=[
          {
              show:false,
              type: 'category',
              data: ['周一']
          }
      ],
      option['yAxis']=[
          {
              show:false,
              max:"dataMax",
              type: 'value'
          }
      ],
      option.series.pop();
      this.addOtherBarData(option);
    }else{
        this.addOtherData(this.num,option);
    }
    this.echarts.setOption(option);
  }
  
  public formatData = (number, dataUnit, dataType) => {
    let format = number
    if(dataUnit === 'auto'){
      const formatService = this.host.formatService;
      let realDisplayUnit = dataUnit;
      if (formatService.isAutoDisplayUnit(dataUnit)) {
          realDisplayUnit = formatService.getAutoDisplayUnit([number]);
      }
      return format = formatService.format(this.format, number, realDisplayUnit);
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
      format = (format / formatUnit.value).toFixed(2)
      if (dataType === 'number') {
        format = format.toLocaleString()
      } else if (dataType === '%') {
        format = format + dataType
      } else if (dataType === 'none') {
        format = Number(format).toFixed(0)
      } else if (dataType === ',') {
        let integer = format.split('.')
        format = integer[0].replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
      } else if (dataType === 'custom') {
        
      } else {
        format = dataType + format
      }
      return format + formatUnit.unit
    }
  }
  // 获取柱形图的高 
  private getBarHeight(){
    let height = this.echarts.getHeight()
    height+=this.properties.barHeight
    //return [ {x: '60%', y: '35%', width: '100', height: height*0.3 }]
    return [{show:true,x: 30+this.properties.centerX+"%",//rightBarCenterX
      // y: `${this.properties.rightBarCenterY}%`, centerY
      y: -15+this.properties.centerY+"%",
      width: `${this.properties.barWidth}%`,
      height:this.properties.barHeight}]

  }
  // 添加其他 
  private addOtherBarData(option){
    let percent = 0;
    let sum=0 ;// 总计
    this.mockSource.forEach((data, rowIndex) => {
      if (rowIndex > 0) {
        // 第一行数据不算
        let count = 0;
        for (let key in data) {
          let value = Number(data[key]);
          if (count === 1) sum += value;
          count++;
        }
      }
    });
    let endData = this.mockSource.splice(this.mockSource.length-this.num)
    let other = ["其他"];
    
    for (let i = 0; i < endData.length; i++) {
      let j = 0;
      for (let key in endData[i]) {
        let value = Number(endData[i][key]);
        if (j) {
          // @ts-ignore
          other[j] ? (other[j] += value) : other.push(value);
        }
        j++;
      }
    }
    // @ts-ignore
    other[1]=other[1].toFixed(2);
    this.mockSource.push(other);
     // "其他"占比
     // @ts-ignore
    var test = ((other[1] / sum) * 100).toFixed(2);
    percent = sum ? Number(test ): 100;
    option.series[0].markLine.data  = this.getMarkLineData(percent);
    let minHeight = 0
    if(!other[1]){ // 设置最小最小高度，防止为0时没有高度
        var height = this.echarts.getHeight()*0.3;
        minHeight = height/this.num;
        
    }
    this.getBarSeries(endData,option,minHeight);
 }
 private getBarSeries(endData,option,minHeight){
  let series=[];
  const hexToRgba = (hex, opacity) => {
    return 'rgba(' + parseInt('0x' + hex.slice(1, 3)) + ',' + parseInt('0x' + hex.slice(3, 5)) + ','
            + parseInt('0x' + hex.slice(5, 7)) + ',' + opacity + ')';
  }

  const getColors = (index, position: number) => {
    let backgroundColor = ''
    const pieColor: [{
      colorStops: [] | any
    }] = this.properties.pieColor && this.properties.pieColor || [];
    if (index < pieColor.length) {
      backgroundColor = pieColor[index].colorStops ? pieColor[index].colorStops[position] : pieColor[index]
    } else {
      backgroundColor = pieColor[Math.floor((Math.random() * pieColor.length))].colorStops
        ? pieColor[Math.floor((Math.random() * pieColor.length))].colorStops[position]
        : pieColor[index%(pieColor.length)]
    }
    return backgroundColor
  }

  endData = endData.sort((a, b) => {
    if(this.properties.showROrder=="asc"?a[1] < b[1]:a[1] > b[1]){
      return -1;
    }else{
      return 1;
    }
  });
  endData.map((endData, index) => {
    let obj =  {
              name: endData[0],
              type: 'bar',
              stack: '系列2',
              data: [endData[1]],
              barWidth:'100%',
              barMinHeight:minHeight,
              label:{
                  //show:true,
                  show: this.properties.labelRPosition === 'center' ? false : this.properties.showRLabel,
                  position :"inside",
                  //position: this.properties.labelRPosition,
                  // formatter:'{a}\n{c}'
                  formatter: (params) => {
                    let name = this.properties.showRLabelName ? params.seriesName : ''
                    let value =  this.properties.showRLabelValue && this.isMock ? this.formatData(params.value,  this.properties.labelRDataUnit,  this.properties.labelRDataType) : '';
                    let percent =  this.properties.showRLabelPercent ? `${(params.value/this._total*100).toFixed( this.properties.LabelRPercentDecimalPlaces)}%` : '';
                    let lineFeed =  this.properties.showRLabelTwoLine ? '\n':''
                    if(!this.properties.showRLabelTwoLine){
                      return `{b|${name} ${value} ${percent}}`
                    }else{
                      if(name && !value && !percent){
                        return `{b|${name}}`
                      }else if(!name && value && !percent){
                        return `{b|${value}}`
                      }else if(!name && !value && percent){
                        return `{b|${percent}}`
                      }else if(name && value && !percent){
                        return `{b|${name}${lineFeed}${value}}`
                      }else if(name && !value && percent){
                        return `{b|${name}${lineFeed}${percent}}`
                      }else if(!name && value && percent){
                        return `{b|${value}${lineFeed}${percent}}`
                      }else {
                        return `{b|${name} ${lineFeed}${value}${'/'}${percent}}`        
                      }
                    }
                  },
                  rich:{
                    b: {
                      lineHeight: 20,
                      ...this.properties.labelRTextStyle,
                      fontSize: parseInt(this.properties.labelRTextStyle.fontSize),
                    },
                    hr: {
                      backgroundColor: 'transparent',
                      borderRadius: 12,
                      width: 0,
                      height: 10,
                      padding: [3, -7, 0, -7],
                    }
                  } 
              },
              tooltip:{
                  // formatter: "{a} <br/>{b} : {c}",
                  rigger: 'item',
                  formatter: (params) => {
                    let eachSector = this.allItems.find((ele)=> ele[this.dimension] === params.seriesName)
                    let toolTips = ''
                    let lineWrap = '<br/>'
                    this.payWay && this.payWay.forEach((element,index) => {
                      toolTips += `${lineWrap}${element}${': '}${eachSector[this.payWay[index]]}`
                    });
                    
                      return `${!this.isMock ? '访问量' : this.dimension} ${lineWrap}${params.seriesName}
                      :${this.formatData(params.value, this.properties.labelDataUnit, this.properties.labelDataType)}
                       (${(params.value/this._total*100).toFixed(this.properties.LabelPercentDecimalPlaces)}%)
                       ${toolTips}`
                    
                  }
              },
              formatter: (name) => {
                let _firstLegendText = false;
                const _target = endData.find((item: any, index) => {
                  if (item[0] === name && !index) {
                    _firstLegendText = true;
                  }
                  return item[0].toString() === name.toString()
                })
                let _legendText = '';
                let _title = '';
                if (this.properties.showLegendSeries) {
                  _legendText += `{a|${_target[0].toString()}}`;
                  _title += `{a|${this.dimension.toString()}}`
                }
                if (this.properties.showLegendValue) {
                  if(_target[1]!=""){
                    _legendText += `{b|${this.formatData(_target[1], this.properties.labelDataUnit, this.properties.labelDataType)}}`;
                  }else{
                    _legendText += `{b|${this.formatData(_target[2], this.properties.labelDataUnit, this.properties.labelDataType)}}`;
                  }
                  _title += `{b|数值}`
                }
                if (this.properties.showLegendPercent) {
                  if(_target[1]!=""){
                    _legendText += `{c|${Number((_target[1] / this._total * 100).toFixed(this.properties.LabelPercentDecimalPlaces))}%}`;
                  }else{
                    _legendText += `{c|${Number((_target[2] / this._total * 100).toFixed(this.properties.LabelPercentDecimalPlaces))}%}`;
                  }
                  _title += `{c|占比}`
                }
                _title += '\n'
                return _firstLegendText ? `${_legendText}`: _legendText;
              },
             itemStyle: {
                normal: {
                  color: (params) => {
                    return this.properties.showGradient?{
                      type: 'linear',
                      x: 0,
                      y: 0,
                      x2: 1,
                      y2: 1,
                      colorStops: [{
                        offset: 0,
                        color: this.properties.showGradient ? hexToRgba(getColors(index, 0), 0.2) : getColors(index, 0), 
                      },
                      {
                        offset: 1,
                        color: this.properties.showGradient ? hexToRgba(getColors(index, 0), 1) : getColors(index, 1), 
                      }
                      ],
                      global: false
                    }:getColors(index, 1)
                  },
                  borderRadius: this.properties.borderRadius,
                  borderColor: this.properties.breakPointColor,
                  borderWidth: this.properties.breakPointNumber
                },
                emphasis: {
                  opacity: 1
                },
                borderRadius: this.properties.borderRadius,
                borderColor: this.properties.breakPointColor,
                borderWidth: this.properties.breakPointNumber
              },
              emphasis: {
                label: {
                    show: true,
                    ...this.properties.labelRTextStyle,
                  fontSize: parseInt(this.properties.labelRTextStyle.fontSize)
                },
                scale: true,
                scaleSize: this.properties.autoScaleSize,
              },
              animationType: this.properties.pieStartType,
              animationEasing: this.properties.pieStartType === 'scale' ? 'elasticOut' : 'linear',
          }
        series.push(obj)
  })  
  option.series=option.series.concat(series)
 
}

  public onResize() {
    this.echarts.resize();
    this.render();
  }

  public onDestroy(): void {

  }

  public getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenOptions: Array<string> = [''];
    
    // legend
    if (!updateOptions.properties.showLegend) {
      hiddenOptions = hiddenOptions.concat(['legendPosition', 'legendIcon', 'legendVerticalPosition', 'legendHorizontalPosition', 'legendTextStyle', 'legendArea', 'legendWidth', 'legendHeight'
      , 'showLegendSeries', 'showLegendPercent', 'showLegendValue', 'openLegendPage', 'legendSeriesWidth', 'legendPercentWidth', 'legendValueWidth'])
    }
    if (updateOptions.properties.legendPosition === 'left' || updateOptions.properties.legendPosition === 'right') {
      hiddenOptions = hiddenOptions.concat(['legendVerticalPosition'])
    } else {
      hiddenOptions = hiddenOptions.concat(['legendHorizontalPosition'])
    }
    if (updateOptions.properties.legendArea === 'auto') {
      hiddenOptions = hiddenOptions.concat(['legendWidth', 'legendHeight'])
    }
    if (!updateOptions.properties.showLegendSeries) {
      hiddenOptions = hiddenOptions.concat(['legendSeriesWidth'])
    }
    if (!updateOptions.properties.showLegendPercent) {
      hiddenOptions = hiddenOptions.concat(['legendPercentWidth'])
    }
    if (!updateOptions.properties.showLegendValue) {
      hiddenOptions = hiddenOptions.concat(['legendValueWidth'])
    }

    // label
    if (!updateOptions.properties.showLabel) {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'showLabelValue', 'showLabelPercent', 'labelPosition', 'labelDataType', 'labelDataUnit', 'labelTextStyle', 'showLabelTwoLine',
       'showLabelName', 'labelTextColor', 'setLabelTextColor', 'LabelPercentDecimalPlaces', 'showLabelLine'])
    }
    if (updateOptions.properties.labelPosition === 'inside') {
      hiddenOptions = hiddenOptions.concat(['showLabelLine', 'labelDataType', 'labelDataUnit', 'outerOutside'])
    }
    if (updateOptions.properties.labelPosition === 'outside') {
      hiddenOptions = hiddenOptions.concat(['outer'])
    }
    if (!updateOptions.properties.showLabelLine || !updateOptions.properties.showLabel){
      hiddenOptions = hiddenOptions.concat(['labelLineFirst', 'labelLineSecond', 'labelLineWidth', 'labelLineSmooth'])
    }
    if (!updateOptions.properties.showLabelValue) {
      hiddenOptions = hiddenOptions.concat(['labelDataType', 'labelDataUnit'])
    }
    if (!updateOptions.properties.showLabelPercent) {
      hiddenOptions = hiddenOptions.concat(['LabelPercentDecimalPlaces'])
    }
    if (!updateOptions.properties.automaticRotation) {
      hiddenOptions = hiddenOptions.concat(['rotationInterval'])
    }

    //右边图形
    if (!updateOptions.properties.showRLabel) {
      hiddenOptions = hiddenOptions.concat(['showRLabelLine', 'showRLabelValue', 'showRLabelPercent', 'labelRPosition', 'labelRDataType', 'labelRDataUnit', 'labelRTextStyle', 'showRLabelTwoLine',
       'showRLabelName', 'labelTextColor', 'setLabelTextColor', 'LabelRPercentDecimalPlaces', 'showRLabelLine','showROrder'])
    }

    if (updateOptions.properties.labelRPosition === 'inside') {
      hiddenOptions = hiddenOptions.concat(['showRLabelLine', 'labelRDataType', 'labelRDataUnit', 'rightOuterOutside'])
    }
    if (updateOptions.properties.labelRPosition === 'outside') {
      hiddenOptions = hiddenOptions.concat(['rightOuter'])
    }
    if (!updateOptions.properties.showRLabelLine || !updateOptions.properties.showRLabel){
      hiddenOptions = hiddenOptions.concat(['labelRLineFirst', 'labelRLineSecond', 'labelRLineWidth', 'labelRLineSmooth'])
    }
    if (!updateOptions.properties.showRLabelValue) {
      hiddenOptions = hiddenOptions.concat(['labelRDataType', 'labelRDataUnit'])
    }
    if (!updateOptions.properties.showRLabelPercent) {
      hiddenOptions = hiddenOptions.concat(['LabelRPercentDecimalPlaces'])
    }
    if(updateOptions.properties.combineType=="bar"){
      hiddenOptions = hiddenOptions.concat(['rightInner','rightOuter','rightOuterOutside','labelRPosition','showRLabelLine','rightCenterY','rightCenterX','labelRLineWidth', 'labelRLineSmooth'])
    }
    if(updateOptions.properties.combineType=="pie"){
      hiddenOptions = hiddenOptions.concat(['rightBarCenterX','rightBarCenterY','barHeight','barWidth'])
    }

    return hiddenOptions;
    return null;
  
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}