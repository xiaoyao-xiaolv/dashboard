import '../style/visual.less';
import * as echarts from  'echarts';
import _ = require('lodash');

interface IRenderConfig {
  imageUrl: string;
  series: string[];
  values: number[];
  maxValue: number;
  isMock: boolean;
}

export default class Visual extends WynVisual {
  public static defaultConfig: IRenderConfig = {
    imageUrl: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAADYElEQVR4nO2dz0sUYRjHP7tIdAmxQ1LdlhCKMohAIsgiyEuHjkUEFQTlpejS/xCCBB06RBGBBKIG4cGyH0qHBKE9eKyFqBQPRQeNCt06vGNY7bq7szPfeZLnAwuzM+/zgw/DDvMu70wOIVveLscJOwycA44A24CfwAfgKXAbeFVvovlC/o/vuVwuTj+x0FWiYdGbgXvA8RrjHgAXgIVaCbMU3SKr1BhtwEtgZx1jTwI7gG7ga5pNNUO+9pBMuEN9klfYD9xMqZdEsCj6AHAiRtxZYFeyrSSHRdGnYsblCD8jJrEoek8TsbsT6yJhLIrelFFsqlgUPZtRbKpYFP2kidjxxLpIGIuiB4AvMeLmgJGEe0kMi6I/AVdjxPVSx91hVlgUDXAXuEaY16jFMnAJeJhqR01iVTTAdeAYUFxjzBRwCLgl6agJrM51rDAO7AP2EmbxthPO8vfAc2Ams84axLpoCGKLrH1mm8eC6KPAGaAL2Fpj7AZgY7T9DfhRY/wc4eflPmH+OjOynI8uEGbpukXlJ4Dz84V8aWWHcj46q4thFzCNTjJRren2UrlLWPM3WYjuAMYIk/tq2oCx9lK5Q11YLboFGARaxXVX0woMtpfK0uuTWvRFoFNcsxKdhF5kqEX3iuuthbQXtehG/gdMG2kvlm/B1xUuWoSLFmFF9CRwg2TnM4pRzskEc8bGiugR4ArhNjkpJqKcJv51sSJ63eOiRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEWvTHKvs/p1izWu5qvaSCWvTlCvtmgeEUaw5TeUVtpV5SQy16COgBRoHXhMWb3aS7PnAhqjEQ1RwFeuYL+aEUa/5DFmtYHkefOEwQVmcBvKD+FQNvgNN/P+pHiV8MRbhoES5ahIsW4aJFuGgRLlqEixbhokW4aBEuWoSLFuGiRbhoES5ahIsW4aJFuGgRLlqEixbhokVYEx3nudGKXE1jTfS6xUWLcNEiXLQIFy3CRYtw0SJctAgXLcJFi3DRIv430eUq2+axJvp7jePPqmzHySXFmuhHwFKVYzNA/6rv/VR/s9BSlMsM1kTPEN4DPkU4I8vAO6APOAgsrhq7GO3ri8aUo5ipKIep1zv9AtipgOACGIrLAAAAAElFTkSuQmCC',
    series: ['按时到校人数', '迟到人数', '早退人数', '请假人数'],
    values: [80, 50, 31, 5],
    maxValue: 100,
    isMock: true
  }

  private container: HTMLDivElement;
  private chart: any;
  private properties: any;
  private renderData: IRenderConfig;
  private host: any;
  private selectionManager: any;
  private selectionItems: any;
  private selection: any[] = [];
  private isTooltipModelShown: boolean;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.chart = echarts.init(dom);
    this.properties = options.properties;
    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.isTooltipModelShown = false;
  }

  private showTooltip = _.debounce((params, showedModal = false) => {
    if (showedModal) this.isTooltipModelShown = true;
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
  });

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private dispatch = (type, payload) => this.chart.dispatchAction({ ...payload, type });

  private hideTooltip = () => {
    this.host.toolTipService.hide();
    this.isTooltipModelShown = false;
  }

  public bindEvents = () => {
    this.container.addEventListener('click', (e: any) => {
      if (!e.seriesClicked) {
        this.hideTooltip();
        this.selection.forEach(i => this.dispatch('downplay', i));
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })

    this.chart.on('click', (params) => {
      this.host.contextMenuService.hide();
      params.event.event.stopPropagation();
      if (params.event.event.button == 0) {
        //鼠标左键功能
        let leftMouseButton = this.properties.leftMouseButton;
        console.log(leftMouseButton)
        switch (leftMouseButton) {
          //鼠标联动设置    
          case "none": {
            if (this.properties.onlySelect) {
              if (!this.selectionManager.contains(this.selectionItems[params.dataIndex])) {
                this.selection = [];
                this.selectionManager.clear();
                this.selection.push(this.selectionItems[params.dataIndex]);
              } else {
                this.selection = [];
                this.selectionManager.clear();
              }
            } else {
              if (!this.selectionManager.contains(this.selectionItems[params.dataIndex])) {
                this.selection.push(this.selectionItems[params.dataIndex]);
              } else {
                this.selection.splice(this.selection.indexOf(this.selectionItems[params.dataIndex]), 1);
                this.selectionManager.clear(this.selectionItems[params.dataIndex])
                return
              }
            }
            this.selectionManager.select(this.selection, true);
            if (this.selection.length == this.selectionItems.length) {
              this.selectionManager.clear(this.selection);
              this.selection = [];
            }
            break;
          }
          case "showToolTip": {
            this.showTooltip(params, true);
            break;
          }
          default: {
            const selectionIds = this.selectionItems[params.dataIndex];
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

    //tooltip	跳转保留等	鼠标起来
    this.chart.on('mouseup', (params) => {
      if (params.event.event.button === 2) {
        document.oncontextmenu = function () { return false; };
        params.event.event.preventDefault();
        this.host.contextMenuService.show({
          position: {								//跳转的selectionsId(左键需要)
            x: params.event.event.x,
            y: params.event.event.y,
          },
          menu: true
        }, 10)
        return;
      }else{
        this.host.contextMenuService.hide();	
      }
    })


  }

  private render() {
    console.log(this.selection)
    console.log(this.selectionItems)
    const renderData = this.renderData;
    const options = {
      "grid": {
        "top": 10,
        "bottom": 10
      },
      "tooltip": {
        "trigger": "item",
        "textStyle": {
          "fontSize": 12
        },
        "formatter": "{b0}:{c0}"
      },
      "xAxis": {
        "max": renderData.maxValue,
        "splitLine": {
          "show": false
        },
        "axisLine": {
          "show": false
        },
        "axisLabel": {
          "show": false
        },
        "axisTick": {
          "show": false
        }
      },
      "yAxis": [
        {
          "type": "category",
          "inverse": false,
          "data": renderData.series,
          "axisLine": {
            "show": false
          },
          "axisTick": {
            "show": false
          },
          "axisLabel": {
            "margin": -4,
            "textStyle": {
              "color": "#fff",
              "fontSize": 16.25
            }
          }
        },

      ],
      "series": [
        {
          "type": "pictorialBar",
          "symbol": renderData.imageUrl,
          "symbolRepeat": "fixed",
          "symbolMargin": "5%",
          "symbolClip": true,
          "symbolSize": 35,
          "symbolPosition": "start",
          "symbolOffset": [
            20,
            0
          ],
          "symbolBoundingData": renderData.maxValue,
          "data": renderData.values,
          "z": 99
        },
        {
          "type": "pictorialBar",
          "itemStyle": {
            "normal": {
              "opacity": 0.3
            }
          },
          "label": {
            "normal": {
              "show": false
            }
          },
          "animationDuration": 0,
          "symbolRepeat": "fixed",
          "symbolMargin": "5%",
          "symbol": renderData.imageUrl,
          "symbolSize":35,
          "symbolBoundingData": renderData.maxValue,
          "symbolPosition": "start",
          "symbolOffset": [
            20,
            0
          ],
          "data": renderData.values,
          "z": 1
        }
      ]
    };
    if (renderData.isMock) {
      this.container.style.opacity = '0.3';
    } else {
      this.container.style.opacity = '1';
    }

    this.chart.setOption(options);
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.properties = options.properties;
    let plainDataView = options.dataViews[0] && options.dataViews[0].plain;
      if (plainDataView) {
        let valueLabel = plainDataView.profile.values.values[0].display;
        let dimensionLabel = plainDataView.profile.dimension.values[0].display;
        let dataItems = plainDataView.data;
        let labelOrder = plainDataView.sort[dimensionLabel].order.reverse();
        dataItems = labelOrder.map((orderItem) => {
          return dataItems.find((dataItem) => dataItem && dataItem[dimensionLabel] === orderItem);
        })
        let values = [];
        let series = [];
        dataItems.forEach((dataPoint) => {
          values.push(dataPoint[valueLabel]);
          series.push(dataPoint[dimensionLabel]);
        });

        let maxValue = Math.max.apply(null, values);
        let imageUrl = Visual.defaultConfig.imageUrl;

        let getSelectionId = (item) => {
          let selectionId = this.createSelectionId();
          selectionId.withDimension(plainDataView.profile.dimension.values[0], item);
          return selectionId
        }
        this.selectionItems = dataItems.map((item) => getSelectionId(item));
        if (this.properties.imageUrl) {
          let reg = /\/api\/dashboardResources/;
          if (reg.test(this.properties.imageUrl)) {
            let host = window.location.host;
            let protocol = window.location.protocol;
            imageUrl = `image://${protocol}//${host}${this.properties.imageUrl}`;
          } else {
            imageUrl = `image://${this.properties.imageUrl}`;
          }
        }

        this.renderData = {
          imageUrl,
          series,
          values,
          maxValue,
          isMock: false
        }
      } else {
        this.renderData = Visual.defaultConfig;
      }
    this.render();
  }

  public onDestroy() {
    this.chart.dispose();
  }

  public onResize() {
    this.chart.resize();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}