import * as d3 from 'd3';
import '../style/visual.less';

export default class Visual extends WynVisual {
  private visualHost: VisualNS.VisualHost;
  private container: HTMLDivElement;
  private _svg: SVGSVGElement;
  private svg: any;
  private width: number;
  private height: number;
  private items: any;
  private properties: any;
  private valueField: string;
  private colorField: string;
  private sizeField: string;
  private selectionManager: any;
  private selection: any[];


  static mockItems = [{ 'size': 'POS', 'value': 687, 'color': '2015' }, { 'size': 'POS', 'value': 691, 'color': '2016' }, { 'size': 'POS', 'value': 815, 'color': '2014' }, { 'size': 'Bank Transfer', 'value': 2427, 'color': '2015' }, { 'size': 'Bank Transfer', 'value': 2421, 'color': '2016' }, { 'size': 'Bank Transfer', 'value': 2382, 'color': '2014' }, { 'size': 'Check', 'value': 930, 'color': '2015' }, { 'size': 'Check', 'value': 987, 'color': '2016' }, { 'size': 'Check', 'value': 1075, 'color': '2014' }, { 'size': 'Online', 'value': 851, 'color': '2015' }, { 'size': 'Online', 'value': 957, 'color': '2016' }, { 'size': 'Online', 'value': 856, 'color': '2014' }, { 'size': 'Cash', 'value': 721, 'color': '2015' }, { 'size': 'Cash', 'value': 737, 'color': '2016' }, { 'size': 'Cash', 'value': 647, 'color': '2014' }, { 'size': 'Other', 'value': 743, 'color': '2015' }, { 'size': 'Other', 'value': 628, 'color': '2016' }, { 'size': 'Other', 'value': 652, 'color': '2014' }];

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, updateOpt: VisualNS.IVisualUpdateOptions) {
    super(dom, host, updateOpt)
    this.container = dom;
    this.visualHost = host;

    this.selection = [];

    // dom.style.backgroundImage = `url(${host.assetsManager.getImage('testImg')})`;

    this._svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg = d3.select(this._svg);
    this.fitSize();
    this.container.appendChild(this._svg);
    this.items = [];
    this.properties = {
      showBorder: false,
      borderWidth: 1,
      borderColor: '#ccc',
      color: '#fff'
    };
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectionManager.registerOnSelectCallback(() => {
      this.render();
    });

    this.container.addEventListener('click', () => {
      this.selectionManager.clear();
      this.visualHost.toolTipService.hide();
    });

    this.render();
    host.eventService.registerOnCustomEventCallback(this.onCustomEventHandler);
    this.selectEvent();
  }

  private selectEvent() {
    this.container.addEventListener("click", () => {
      this.selectionManager.clear();
      this.visualHost.toolTipService.hide();
      this.visualHost.contextMenuService.hide();
      return;
    })
  }

  private mouseEnterHandler = (node: any) => {
    // this.visualHost.toolTipService.show({
    //     position: {
    //         x: d3.event.x,
    //         y: d3.event.y,
    //     },
    //     title: node.data.color,
    //     fields: [{
    //         label: this.valueField,
    //         value: node.data.value,
    //     }],
    //     selectionId: node.data.selectionId,
    // });
  }
  private mouseMoveHandler = (e: any) => {
    // this.visualHost.toolTipService.move({
    //     x: d3.event.x,
    //     y: d3.event.y,
    // });
  }
  private mouseLeaveHandler = (e: any) => {
    //this.visualHost.toolTipService.hide();
  }

  private rightMouseClick = (node) => {
    document.oncontextmenu = function () { return false; };
    document.oncontextmenu = function () { return false; };
    this.visualHost.contextMenuService.show({
      position: {								//跳转的selectionsId(左键需要)
        x: d3.event.x,
        y: d3.event.y,
      },
    })
    return;
  }

  private clickHandler = (node: any) => {
    document.oncontextmenu = function () { return false; };
    this.visualHost.contextMenuService.hide();
    d3.event.stopPropagation();
    const selectionId = node.data.selectionId


    //鼠标左键功能
    let leftMouseButton = this.properties.leftMouseButton;
    switch (leftMouseButton) {
      //鼠标联动设置    
      case "none": {
        if (this.properties.onlySelect) {
          if (!this.selectionManager.contains(selectionId)) {
            this.selection = [];
            this.selectionManager.clear();
            this.selection.push(selectionId);
          } else {
            this.selection = [];
            this.selectionManager.clear();
          }
        } else {
          if (!this.selectionManager.contains(selectionId)) {
            this.selection.push(selectionId);
          } else {
            this.selection.splice(this.selection.indexOf(selectionId, 1))
            this.selectionManager.clear(selectionId)
            return
          }
        }
        this.selectionManager.select(this.selection, true);
        if (this.selection.length == this.items) {
          this.selectionManager.clear(this.selection);
          this.selection = [];
        }
        break;
      }
      case "showToolTip": {
        this.showTooltip(node);
        break;
      }
      default: {
        const selectionIds = selectionId;
        this.visualHost.commandService.execute([{
          name: leftMouseButton,
          payload: {
            selectionIds,
            position: {
              x: d3.event.x,
              y: d3.event.y,
            },
          }
        }])
      }
    }


  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.values.values.length &&
      dataView.plain.profile.series.values.length &&
      dataView.plain.profile.dimensions.values.length) {
      const plainData = dataView.plain;
      this.valueField = plainData.profile.values.values[0].display;
      this.sizeField = plainData.profile.series.values[0].display;
      this.colorField = plainData.profile.dimensions.values[0].display;

      const items = plainData.data.reduce((result: any, item: any, i: number) => {
        if (item[this.valueField]) {
          const selectionId = this.visualHost.selectionService.createSelectionId();

          selectionId
            .withDimension(plainData.profile.dimensions.values[0], item)
            .withDimension(plainData.profile.series.values[0], item);
          result.push({
            size: (item[this.sizeField] || '-') + '',
            value: item[this.valueField],
            color: (item[this.colorField] || '') + '',
            id: i,
            selectionId,
          });
        }
        return result;
      }, []);
      this.items = items;

    }
    this.properties = options.properties;
    this.render();
  };

  private render() {
    this.visualHost.eventService.renderStart();
    this.clear();
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const options = this.properties;
    if (!items.length) {
      this.svg.append('text')
        .text('No Data')
        .attr('text-anchor', 'middle')
        .attr('y', this.height / 2)
        .attr('x', this.width / 2);
      return;
    }
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pack = d3.pack()
      .size([this.width, this.height])
      .padding(1.5);

    const root = d3.hierarchy({ children: items })
      .sum(function (d: any) { return d.value; })
      .each(function (d: any) {
        const size = d.data.size;
        if (size) {
          d.size = size;
          d.package = d.data.color;
          d.id = d.data.id;
        }
      });

    const node = this.svg.selectAll('.node')
      .data(pack(root).leaves())
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', function (d: any) { return 'translate(' + d.x + ',' + d.y + ')'; });

    if (!isMock) {
      node.on('mouseenter', this.mouseEnterHandler)
        .on('mousemove', this.mouseMoveHandler)
        .on('mouseleave', this.mouseLeaveHandler)
        .on('click', this.clickHandler)
        .on('contextmenu', this.rightMouseClick)


      if (!this.selectionManager.isEmpty()) {
        const selectionManager = this.selectionManager;
        node.each(function (node: any) {
          if (selectionManager.contains(node.data.selectionId)) {
            d3.select(this).attr('opacity', 1);
          } else {
            d3.select(this).attr('opacity', 0.1);
          }
        });
      }
    }

    const circle = node.append('circle')
      .attr('r', function (d: any) { return d.r; })
      .style('fill', function (d: any) { return color(d.package); });

    if (options.showBorder) {
      circle
        .style('stroke-width', options.borderWidth)
        .style('stroke', options.borderColor);
    }

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('font-size', function (d: any) {
        return d.r / 4;
      })
      .selectAll('tspan')
      .data(function (d: any) {
        return [d.size];
      })
      .enter().append('tspan')
      .attr('x', 0)
      .attr('y', function (d: any, i: any, nodes: any) {
        return 13 + (i - nodes.length / 2 - 0.5) * 10;
      })
      .text(function (d: any) { return d || ''; })
      .style('fill', options.color);

    this.visualHost.eventService.renderFinish();
  }
  private clear() {
    this.svg.selectAll('*').remove();
  }
  private fitSize() {
    const size = getComputedStyle(this.container);
    this.width = parseInt(size.width);
    this.height = parseInt(size.height);
    this.svg.attr('width', this.width);
    this.svg.attr('height', this.height);
  }

  private showTooltip(node) {
    this.visualHost.toolTipService.show({
      position: {
        x: d3.event.x,
        y: d3.event.y,
      },
      title: node.data.color,
      fields: [{
        label: this.valueField,
        value: node.data.value,
      }],
      selected: this.selectionManager.getSelectionIds(),
      menu: true,
    });
  }

  public onDestroy() {

  }

  public onResize() {
    this.fitSize();
    this.render();
  }

  public getInspectorHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {
    if (!updateOptions.properties.showBorder) {
      return ['borderWidth', 'borderColor'];
    }
    return null;
  }

  public getActionBarHiddenState(updateOptions: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public onCustomEventHandler = (name: string) => {
    console.log(name);
  }
}
