import _ from 'lodash';
import echarts from 'echarts';
import { dcast, FieldInfo } from './utils';
import mockData from './mock.json';
import '../style/visual.less';

const makeFieldInfo = (name: FieldInfo['name'], lookUps: FieldInfo['lookUps']): FieldInfo => ({ name, lookUps });
const getFirstItem = role => role?.values?.[0];
const getFirstItemDisplay = role => getFirstItem(role)?.display;

// @TODO: should not maintain in plugin
let isTooltipModelShown = false;

debugger; // be used for debugging
export default class Visual extends WynVisual {
  private chart: echarts.ECharts;
  private selectionManager: any;
  private host: any;
  private dom: HTMLDivElement;
  private selection: any[] = [];
  private properties: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);

    this.chart = echarts.init(dom);

    this.dom = dom;
    this.host = host;
    this.bindEvents();
    this.selectionManager = host.selectionService.createSelectionManager();
  }

  // #region data processor
  private getLabel = (): echarts.EChartOption.SeriesBar['label'] => {
    const { dataLabel, dataLabelTextStyle, dataLabelFormatter } = this.properties;
    return {
      ...dataLabel,
      ...dataLabelTextStyle,
      formatter: ({ encode: { y }, dimensionNames, data }) => this.host.formatService.format(dataLabelFormatter, data[dimensionNames[y[0]]]),
      fontSize: parseFloat(dataLabelTextStyle.fontSize),
    }
  }
  private getFieldLookUps = ({ data, sort, profile }, roleName) => {
    const name = getFirstItemDisplay(profile[roleName]);
    if (name == null) return [];

    const fullLookUps = sort[name]?.order ?? [];

    const existMapping = {};
    data.forEach(item => existMapping[item[name]] = true);

    return fullLookUps.filter(i => existMapping[i]);
  }
  private getFieldInfo = (dataView, roleName) => {
    const name = getFirstItemDisplay(dataView.profile[roleName]);
    if (name == null) return;

    const lookUps = this.getFieldLookUps(dataView, roleName);
    return makeFieldInfo(name, lookUps);
  }
  private getData = (dataView) => {
    const { data, profile: { series, dimensions } } = dataView;

    const hasSeries = getFirstItemDisplay(series) != null;
    const hasDimensions = getFirstItemDisplay(dimensions) != null;

    const getSelectionId = (item) => {
      const selectionId = this.createSelectionId();
      if (hasSeries) selectionId.withDimension(getFirstItem(series), item);
      if (hasDimensions) selectionId.withDimension(getFirstItem(dimensions), item);
      return selectionId;
    }

    if (!hasSeries) {
      data.forEach(item => item.selectionId = getSelectionId(item));
      return data;
    };
    const castData = dcast({
      row: this.getFieldInfo(dataView, 'dimensions'),
      column: this.getFieldInfo(dataView, 'series'),
      value: this.getFieldInfo(dataView, 'values'),
     }, data);

     if (hasDimensions) return castData;

     return [{
       ...castData[0],
       '': '', // unable to show series without "xAxis"
     }]
  }
  private getSeries = (dataView) => {
    const { profile: { values, dimensions } } = dataView;

    const emphasis = {
      itemStyle: {
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowColor: 'rgba(255, 255, 255, 0.5)',
        borderWidth: 1,
      }
    };

    const legend = {
      type: 'bar',
      encode: {
        x: getFirstItemDisplay(dimensions),
        y: getFirstItemDisplay(values),
      },
      emphasis,
      label: this.getLabel(),
    }

    const seriesInfo = this.getFieldInfo(dataView, 'series');
    if (!seriesInfo) return [legend];

    return seriesInfo.lookUps.map(name => ({
      name,
      type: 'bar',
      encode: {
        x: getFirstItemDisplay(dimensions) ?? '', // unable to show series without "xAxis"
        y: `${name}`,
      },
      emphasis,
      label: this.getLabel(),
    }))
  }
  // #endregion

  // #region host api wrapper
  private showTooltip = _.debounce((params, asModel = false) => {
    if (asModel) isTooltipModelShown = true;

    const visibleDimIdxs: any[] = _.flatten(Object.values(params.encode));
    let visibleDimensions: any[] =  visibleDimIdxs.map(idx => params.dimensionNames[idx]);
    if (params.data[''] === '') visibleDimensions = visibleDimensions.filter(d => d !== '');

    this.host.toolTipService.show({
      position: {
        x: params.event.event.x,
        y: params.event.event.y,
      },
      fields: visibleDimensions.map(label => ({
        label,
        value: params.data[label],
      })),
      selected: this.selectionManager.getSelectionIds(),
      menu: asModel,
    }, 10);
  });
  private hideTooltip = () => {
    this.host.toolTipService.hide();
    isTooltipModelShown = false;
  }
  createSelectionId = (sid?) => this.host.selectionService.createSelectionId(sid);
  // #endregion
  // #region echarts related
  private dispatch = (type, payload) => this.chart.dispatchAction({ ...payload, type });

  private bindEvents = () => {
    this.dom.addEventListener('click', (e: any) => {
      // click blank area
      if (!e.seriesClick) {
        // clear tooltip
        this.hideTooltip();
        // clear selection
        this.selection.forEach(i => this.dispatch('downplay', i));
        this.selection = [];
        this.selectionManager.clear();
        return;
      }
    });
    this.dom.addEventListener('mouseleave', (e) => {
      if (isTooltipModelShown) return;
      this.hideTooltip();
    });

    this.chart.on('mousemove', (params) => {
      if (params.componentType !== 'series') return;

      if (!isTooltipModelShown) this.showTooltip(params);
    });

    this.chart.on('click', (params) => {
      if (params.componentType !== 'series') return;

      this.showTooltip(params, true);
      
      params.event.event.seriesClick = true;
      
      const selectInfo = {
        seriesIndex: params.seriesIndex,
        dataIndex: params.dataIndex,
      };

      if (params.data.selectionId) {
        const sid = this.createSelectionId(params.data.selectionId);
        this.selectionManager.select(sid, true);
      }
      this.dispatch('highlight', selectInfo);
      this.selection.push(selectInfo)
    });
  }
  // #endregion

  // #region fixed life cycle
  public update(options: VisualNS.IVisualUpdateOptions) {
    this.properties = options.properties;
    const dataView = options.dataViews?.[0]?.plain ?? mockData;
    if (!dataView) return;

    this.hideTooltip();

    const option: echarts.EChartOption = {
      dataset: {
        source: this.getData(dataView),
      },
      grid: { show: true },
      xAxis: { type: 'category' },
      yAxis: { type: 'value' },
      legend: { type: 'plain' },
      series: this.getSeries(dataView),
    };
    this.chart.setOption(option, true);
  }

  public onDestroy() {
    this.chart.dispose();
  }

  public onResize() {
    this.chart.resize()
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    if (!options.properties.dataLabel.show) {
      return ['dataLabel.position', 'dataLabel.color', 'dataLabelFormatter', 'dataLabelTextStyle'];
    }
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
  // #endregion
}