import '../style/visual.less';
import * as echarts from 'echarts';
//@ts-ignore
import liquidfill from 'echarts-liquidfill'
(window as any).q = liquidfill;
export default class Visual {
    private container: HTMLDivElement;
    private chart: any;
    private items: any;
    private properties: any;
    private ActualValue: any;
    private ContrastValue: any;

    static mockItems = 0.5;

    constructor(dom: HTMLDivElement, host: any) {
        this.container = dom;
        this.chart = echarts.init(dom);
        this.fitSize();
        this.items = [];
        this.properties = {
            showSubTitle: false,
            subtitle: '示例',
            //'rect'，'roundRect'，'triangle'，'diamond'，'pin'，'arrow';
            shape: 'circle',
            borderWidth: 5,
            borderColor: '#1daaeb',
            waterColor: '#e6776c',
            backgroundColor: '#fff',
            fontSize: 35
        };
    }

    public update(options: any) {
        const dataView = options.dataViews[0];
        const plainData = dataView.plain;
        if (dataView && dataView.plain.profile.ActualValue.values.length) {
            this.ActualValue = plainData.profile.ActualValue.values;
            this.ContrastValue = plainData.profile.ContrastValue.values;
            this.items = this.ContrastValue.length ? [plainData.data[0][this.ActualValue[0].display] / plainData.data[0][this.ContrastValue[0].display]] : [plainData.data[0][this.ActualValue[0].display]];
        }
        this.properties = options.properties;
        this.render();
    };

    private render() {
        this.chart.clear();
        const isMock = !this.items.length;
        const items = isMock ? Visual.mockItems : this.items;
        this.container.style.opacity = isMock ? '0.3' : '1';
        const options = this.properties;
        var option = {
            series: [{
                type: 'liquidFill',
                radius: '75%',
                name: options.subtitle,
                shape: options.shape,
                center: ['50%', '50%'],
                data: [items, items * 0.9, items * 0.8, items * 0.7],
                color: [options.waterColor],
                backgroundStyle: {
                    borderWidth: options.borderWidth,
                    borderColor: options.borderColor,
                    color: options.backgroundColor
                },
                label: {
                    formatter: function () {
                        return options.showSubTitle ? (items * 100).toFixed(2) + '%\n' + options.subtitle : (items * 100).toFixed(2) + '%';
                    },
                    fontSize: options.fontSize
                }
            }]
        };
        this.chart.setOption(option);
    }

    // 自适应大小
    private fitSize() {
        this.chart.resize();
    }

    // public abstract onDestroy(): void;
    public onResize() {
        this.fitSize();
        this.render();
    }

    // 自定义属性可见性
    public getInspectorHiddenState(updateOptions: any): string[] {
        if (!updateOptions.properties.showSubTitle) {
            return ['subtitle'];
        }
        return null;
    }

    // 功能按钮可见性
    public getActionBarHiddenState(updateOptions: any): string[] {
        return null;
    }
    public onActionEventHandler = (name: string) => {
        console.log(name);
    }
}