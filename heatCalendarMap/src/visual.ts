import '../style/visual.less';
import _ = require('lodash');
import * as echarts from 'echarts'



const Echarts: any = echarts
let isTooltipModelShown = false;
export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private host: any;
  private chart: any;
  private properties: any;
  private items: any;
  private selectionManager: any;
  private selection: any[] = [];
  private dimension: string
  private ActualValue: string
  private Series: string
  private year: string
  private month: string
  private day: string


  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options)
    this.container = dom;
    this.chart = echarts.init(dom)
    this.items = [];
    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
    this.properties = {}
  }

  // toolTip
  private showTooltip = _.debounce((params, asModel = false) => {

    if (asModel) isTooltipModelShown = true;
    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },

      fields: [{
        label: this.ActualValue,
        value: params.data[1],
      }, {
        label: this.year,
        value: params.data[0],
      }],
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    }, 10);
  });

  private hideTooltip = () => {
    this.host.toolTipService.hide();
    isTooltipModelShown = false;
  }

  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);

  private dispatch = (type, payload) => this.chart.dispatchAction({ ...payload, type });

  public bindEvents = () => {
    // lister click 
    this.container.addEventListener('click', (e: any) => {
      if (!e.seriesClick) {
        // clear tooltip
        this.hideTooltip();
        // clear selection
        this.selection.forEach(i => this.dispatch('downplay', i));
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    })

    this.container.addEventListener('mouseleave', (e: any) => {
      if (isTooltipModelShown) return;
      this.hideTooltip();
    })

    this.chart.on('click', (params) => {

      if (params.componentType !== 'series') return;

      this.showTooltip(params, true);

      params.event.event.seriesClick = true;

      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };

      if (this.items[3][params.dataIndex]) {
        const sid = this.items[3][params.dataIndex];
        this.selectionManager.select(sid, true);
      }
      this.dispatch('highlight', selectInfo);
      this.selection.push(selectInfo)

    })

  }

  public update(options: VisualNS.IVisualUpdateOptions) {

    const dataView = options.dataViews[0];

    this.items = [];
    if (dataView &&
      dataView.plain.profile.ActualValue.values.length && dataView.plain.profile.years.values.length && dataView.plain.profile.months.values.length && dataView.plain.profile.days.values.length) {
      const plainData = dataView.plain;


      this.ActualValue = plainData.profile.ActualValue.values[0].display;
      this.year = plainData.profile.years.values[0].display;
      this.month = plainData.profile.months.values[0].display;
      this.day = plainData.profile.days.values[0].display;
      this.items[0] = plainData.data.map((item) => item);
      this.items[1] = plainData.data.map((item) => item[this.year]);
      // this.items[2] = plainData.data.map((item) => item[this.ActualValue]);

      const getSelectionId = (item) => {
        const selectionId = this.createSelectionId();

        this.year && selectionId.withDimension(plainData.profile.years.values[0], item);
        this.month && selectionId.withDimension(plainData.profile.months.values[0], item);
        this.day && selectionId.withDimension(plainData.profile.days.values[0], item);
        // this.ActualValue && selectionId.withDimension(plainData.profile.ActualValue.values[0], item);
        return selectionId
      }
      this.items[3] = plainData.data.map((item) => getSelectionId(item));
    }
    this.properties = options.properties;

    this.render()
  }

  public render() {
    this.chart.clear();
    const isMock = !this.items.length
    const options = this.properties;

    this.container.style.opacity = isMock ? '0.3' : '1';
    const textStyle = options.textStyle
    const visualMapColor = isMock ? ["#fff4d1", "#ffe9a4", "#ffde76", "#ffd348", "#bf9e36", "#806a24"] : options.pointColorMultiple
    const getVirtulData = (year) => {

      let data: any = [];
      let initData: any = [];
      year = year || '2017';
      let date = +Echarts.number.parseDate(year + '-01-01');
      let end = +Echarts.number.parseDate((+year + 1) + '-01-01');
      let dayTime = 3600 * 24 * 1000;

      if (isMock) {
        for (let time = date; time < end; time += dayTime) {
          data.push([
            Echarts.format.formatTime('yyyy-MM-dd', time),
            Math.floor(Math.random() * 1000)
          ]);
        }
      } else {

        for (let time = date; time < end; time += dayTime) {
          const current = this.items[0].find((item) => {
            const currentTime = +Echarts.number.parseDate(`${item[this.year]}-${item[this.month]}-${item[this.day]}`)
            return currentTime === time && item
          })

          data.push([
            Echarts.format.formatTime('yyyy-MM-dd', time),
            current && current[this.ActualValue] || 0
          ]);
        }
      }

      return data;
    }

    const getCalendar = () => {
      const ranges = isMock ? ['2018', '2019'] : Array.from(new Set(this.items[1]))
      return ranges.map((range: string, index: number) => {

        return {
          top: index === 0 ? '5%' : ((100 / ranges.length)) * (index) + 5 + '%',
          range: `${range}`,
          cellSize: ['auto', 20],
          height: ranges.length === 1 ? '100%' : `${(100 / (ranges.length + 1))}%`,
          right: options.dayPosition === 'end' || options.showYear === 'right' ? '5%' : 'auto',
          bottom: options.monthPosition === 'bottom' ? '5%' : 'auto',
          dayLabel: {
            show: options.showDay,
            firstDay: 1,
            position: options.dayPosition,
            nameMap: 'cn',
            ...textStyle
          },
          monthLabel: {
            show: options.showMonth,
            nameMap: 'cn',
            position: options.monthPosition,
            ...textStyle
          },
          yearLabel: {
            show: options.showYear,
            position: options.yearPosition,
            ...textStyle
          }
        }
      })
    }

    const getSeries = () => {

      const series = isMock ? ['2018', '2019'] : Array.from(new Set(this.items[1]))
      return series.map((item: number, index: number) => {
        return {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: index,
          data: getVirtulData(item)
        }
      })
    }

    const option = {
      tooltip: {
        position: 'top',
        formatter: (value) => {
          return `${this.year || '时间'}:${value.data[0]}<br />${this.ActualValue || '数量'}:${value.data[1]}`
        }
      },
      visualMap: {
        min: 0,
        max: 1000,
        calculable: true,
        orient: 'vertical',
        left: 'left',
        top: 'center',
        textStyle: textStyle,
        inRange: {
          color: visualMapColor,
        },
        outOfRange: {
          color: ['rgba(255,255,255,.2)']
        },
      },
      calendar: getCalendar(),
      series: getSeries()
    };

    this.chart.setOption(option)
  }

  public onDestroy() {

  }

  public onResize() {
    this.chart.resize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {

    let position = []
    if (!updateOptions.properties.showDay) {
      position.push('dayPosition')
    }

    if (!updateOptions.properties.showMonth) {
      position.push('monthPosition')

    }

    if (!updateOptions.properties.showYear) {
      position.push('yearPosition')
    }

    return position;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}