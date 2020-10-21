import * as _ from 'lodash';

import '../style/visual.less';

const template = `
  <p data-role="toggle"><%- op %></p>
  <ul>
    <% _.forEach(items, function(item) { %>
      <li data-tuple="<%- item.tuple %>" class="<%- item.className %>">
        <%- item.label %>
      </li>
    <% }); %>
  </ul>
`;

const compiled = _.template(template);

const TupleFilter = WynVisual.Models.Filter.TupleFilter;
const Enums = WynVisual.Enums;

export default class Visual extends WynVisual {
  private dom: HTMLDivElement;
  private items: any[];
  private filter: VisualNS.TupleFilter;
  private isMock = true;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);

    this.dom = dom;
    dom.classList.add('slicer-demo');
    dom.addEventListener('click', (e) => {
      const it = e.target as HTMLLIElement;
      if (it.hasAttribute('data-tuple')) {
        const tuple = JSON.parse(it.dataset.tuple);

        if (this.filter.contains(tuple)) {
          this.filter.remove(tuple);
        } else {
          this.filter.add(tuple);
        }

        host.filterService.applyFilter(this.filter);
      } else if (it.getAttribute('data-role') === 'toggle') {
        this.filter.setOperator(this.filter.getOperator() === Enums.BasicFilterOperator.In ?
          Enums.BasicFilterOperator.NotIn :
          Enums.BasicFilterOperator.In
        );
        host.filterService.applyFilter(this.filter);
      }
    })
  }

  private render() {
    if (this.isMock) {
      this.dom.innerHTML = 'No Data';
    } else {
      this.dom.innerHTML = compiled({
        items: this.items,
        op: this.filter ? this.filter.getOperator() : ''
      });
    }
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
      this.items = dv.plain.data.reduce((res, dp) => {
        const label = Object.keys(dp).map(key => dp[key]).join('-');
        const tuple = filter.createTuple(dp);
        res.push({
          label,
          className: filter.contains(tuple) ? 'selected' : '',
          tuple: JSON.stringify(tuple),
        });

        return res;
      }, []);
    } else {
      this.isMock = true;
      this.items = [];
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