
import React from "react";
import ReactDOM from "react-dom";
import { DatePicker } from 'antd';
import 'antd/dist/antd.css';
// @ts-ignore
import ReactCircleCard from "./component.tsx";

const TupleFilter = WynVisual.Models.Filter.TupleFilter;
const Enums = WynVisual.Enums;

export default class Visual extends WynVisual {
  private dom: any;
  private host: any;
  private isMock = true;
  private filter: VisualNS.TupleFilter;
  private reactRoot: React.ComponentElement<any, any>;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom = dom;
    this.host = host;
    this.reactRoot = React.createElement(ReactCircleCard, {});
    ReactDOM.render(this.reactRoot, this.dom);
  }

  // private onRangeChange = () => {
  //   let selectedDate = $( "#datepicker" ).datepicker('getDate');
  //   let year = selectedDate.getFullYear();
  //   let month = selectedDate.getMonth() + 1;
  //   let day = selectedDate.getDate();
  //   let value = [[{year},{month},{day}]];
  //   this.filter.setValues(value);
  //   console.log('this.filter');
  //   console.log(this.filter);
  //   const tuple = [{value: year}, {value: month}, {value: day}];
  //   if (this.filter.contains(tuple)) {
  //     this.filter.remove(tuple);
  //   } else {
  //     this.filter.add(tuple);
  //   }
  //   this.filter.setOperator( Enums.BasicFilterOperator.In );
  //   this.host.filterService.applyFilter(this.filter);
  // }

  private render() {
    // if (!this.isMock) {
    //   ReactDOM.render(<DatePicker /> , $('#datepicker'));
    // }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    const dv = options.dataViews[0];
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

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}