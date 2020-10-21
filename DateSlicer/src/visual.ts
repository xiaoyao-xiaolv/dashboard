import * as _ from 'lodash';
import '../style/visual.less';
import '../style/jquery-ui.theme.css';
import '../style/jquery-ui.css';
const $ = require( 'jquery' );
import 'jquery-ui/ui/widgets/datepicker.js';
import './datepicker-cn.js';

const template = `
  <div class="dateDiv"><input class="datepicker" autocomplete="off" id="datepicker"></div>
`;
const compiled = _.template(template);
const TupleFilter = WynVisual.Models.Filter.TupleFilter;
const Enums = WynVisual.Enums;

export default class Visual extends WynVisual {
  private dom: HTMLDivElement;
  private filter: VisualNS.TupleFilter;
  private isMock = true;
  private host: VisualNS.VisualHost;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom = dom;
    this.host = host;
    this.dom.innerHTML = compiled();
  }

  private onRangeChange = () => {
    let selectedDate = $( "#datepicker" ).datepicker('getDate');
    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let value = [[{year},{month},{day}]];
    this.filter.setValues(value);
    console.log('this.filter');
    console.log(this.filter);
    const tuple = [{value: year}, {value: month}, {value: day}];
    if (this.filter.contains(tuple)) {
      this.filter.remove(tuple);
    } else {
      this.filter.add(tuple);
    }
    this.filter.setOperator( Enums.BasicFilterOperator.In );
    this.host.filterService.applyFilter(this.filter);
  }

  private render() {
    if (!this.isMock) {
      $( "#datepicker" ).datepicker({
        onSelect: this.onRangeChange,
        dateFormat: 'yy-mm-dd',
        changeYear: true,
        changeMonth: true
      });
    }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    let dv = options.dataViews[0];
    if (dv && dv.plain) {
      const dimensionsProfiles = dv.plain.profile.dimensions.values;
      const filter = new TupleFilter(dimensionsProfiles);
      filter.fromJSON(options.filters[0] as VisualNS.ITupleFilter);
      this.isMock = false;
      this.filter = filter;
    } else {
      this.isMock = true;
    }
    this.render();
  }

  public onDestroy() {

  }

  public onResize() {
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}