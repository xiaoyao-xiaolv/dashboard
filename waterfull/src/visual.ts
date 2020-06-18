import '../style/visual.less';
import _ = require('lodash') ;
import * as echarts from 'echarts'

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private items: any;
  public listData: any

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.properties = {
      barWidth: 14,
      fontSize: 14,
      textColor: '#ffffff',
      barBackgroundColor: '#444a58',
      barStartColor: '#57eabf',
      barEndcolor: '#2563f9',
    };

  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options.dataViews, '=====dataViews options');
    const dataView = options.dataViews[0];
    this.items = [];
    this.listData = []
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.dimension.values.length) {
      const plainData = dataView.plain;
      let dimension = plainData.profile.dimension.values[0].display;
      let ActualValue = plainData.profile.ActualValue.values[0].display;
  
      this.items[0] = plainData.sort[dimension].order;
      this.items[0].push('结束')
      this.listData = plainData.data.map(function (item) {
        return item[ActualValue]
      });
     
    }

    this.properties = options.properties;
    this.render();
  }

  //get start and end value
  

  public basicData : Array<number>
  public startAndEndData : Array<number | string>
  public assistData : Array<number | string>
  public upData : Array<number | string>
  public downData : Array<number | string>

  public getBasicData = () => {
    //  this.basicData = this.listData.map((item: {label: string; value: number}, index: number) => {
    //   return item.value
    // })
    this.basicData = []
    this.basicData = this.listData
    
    this.basicData.push(_.sum(this.basicData))
    console.log(this.basicData, '=====this.basicData')
    this.getStartAndEndData()
    this.getUpAndDownData()
    // console.log(this.assistData, '====staer, and end', this.startAndEndData)
  }

  public getStartAndEndData = () => {
    this.startAndEndData = []
    this.assistData = [0]
    this.assistData[1] = this.basicData[0]

    let assistInitData: Array<number  | string> = []
    this.basicData.map((value: number, index: number) => {
      // get start and end data
      if(index === 0 || index === this.basicData.length - 1) {
        this.startAndEndData[index] = this.basicData[index]
      } else {
        this.startAndEndData[index] = 0
      }

      // if(index < this.basicData.length - 2) {
      //   assistInitData[index] = this.basicData[index]
      // } else {
      //   assistInitData[index] = 0
      // }
      // get assist data
      if (index  === 0) {
        assistInitData[0] = 0
      } else {
        if(index < this.basicData.length - 1) {
          assistInitData[index] = this.basicData[index - 1]
          this.assistData[index] =  _.sum(assistInitData)
        }
        
      }
      // assistInitData[0] = 0
      // console.log(assistInitData, '=====assistInitData')
      // if(index < this.basicData.length - 2 || index > 0) {
      //   assistInitData[index] = this.basicData[index]
      //   console.log(_.sum(assistInitData) ,'======test')
      //   this.assistData[index + 1] =  _.sum(assistInitData)
      // }
      this.assistData[this.basicData.length - 1] = 0
      
    })
    console.log(this.assistData, '====start, and', this.startAndEndData)
  }

  public getUpAndDownData = () => {
    let nullData: Array<number | string > = [0]
   this.upData = []
   this.downData = []
    for(let i: number = 0; i < this.basicData.length - 2; i ++) {
      let value = this.basicData[i + 1]
      this.upData[i] = value > 0 ? value :  0;
      this.downData[i] = value < 0 ? value :  0;    
    }
    this.upData = nullData.concat(this.upData, nullData)
    this.downData = nullData.concat(this.downData, nullData)

    console.log(this.upData, '=====this.upData', this.downData)
  }

  public formatData = (data: Array<number>) => {
     data.map((value: number) => {
       value === 0 ? '- ': value
     })
  }
  
  public render () {
    this.chart.clear();
    // get data
    this.getBasicData()
    const option = {
      tooltip : {
          trigger:'axis',
          axisPointer:{
              type:'shadow'
          },
          formatter: function (params) {
              var tar;
              if (params[1].value != '-') {
                  if (params[2] != '-') {
                      tar = params[1];
                      tar.value = params[1].value+params[2].value;
                  }else{
                      tar = params[1];
                  }
              }
              else {

                  tar = params[0];
              }
              return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
      },
      grid:{
          backgroundColor:['#ECFFFB','#B4F1F1']
      },
      xAxis:{
          data: this.items[0] || ['Before', 'Factor A', 'Factor B', 'Factor C','After'],
          splitLine:{
              show:false
          }
      },
      yAxis:{
          type:'value',
          splitArea: {
             show: true
          }
      },
      legend: {
          left: 'left',
          data: ['start&end','up','down']
      },
      series : [
          {
              name:'start&end',
              type:'bar',
              barWidth: 15,
              stack:'total',
              barCategoryGap:'10',
              itemStyle: {
                  normal: {
                      barBorderColor: '#303841',
                      color: '#303841'
                  },
                  emphasis: {
                      barBorderColor: '#303841',
                      color: '#303841'
                  }
              },
              data: this.startAndEndData

          },
          {//辅助柱形[1]
              name:'Left',
              type:'bar',
              barWidth: 15,
              stack:'total',
              barCategoryGap:'10',
              itemStyle: {
                  normal: {
                      barBorderColor: 'rgba(0,0,0,0)',
                      color: 'rgba(0,0,0,0)'
                  },
                  emphasis: {
                      barBorderColor: 'rgba(0,0,0,0)',
                      color: 'rgba(0,0,0,0)'
                  }
              },
              data: this.assistData
          },
          {//上升的红色柱形[2]
              name:'up',
              type:'bar',
              barWidth: 15,
              stack:'total',
              barCategoryGap:'10',
              label: {
                  normal: {
                      show: false,
                      position: 'top'
                  }
              },
              itemStyle: {
                  normal: {
                      barBorderColor: '#FF5722',
                      color: '#FF5722'
                  },
                  emphasis: {
                      barBorderColor: '#FF5722',
                      color: '#FF5722'
                  }
              },
              data: this.upData
          },
          {//下降的绿色柱形[3]
              name:'down',
              type:'bar',
              barWidth: 15,
              stack:'total',
              barCategoryGap:'10',
              label: {
                  normal: {
                      show: false,
                      position: 'bottom'
                  }
              },
              itemStyle: {
                  normal: {
                      barBorderColor: '#00ADB5',
                      color: '#00ADB5'
                  },
                  emphasis: {
                      barBorderColor: '#00ADB5',
                      color: '#00ADB5'
                  }
              },
              data:this.downData
          }
      ],
  };
    
  this.chart.setOption(option)

  }
  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}