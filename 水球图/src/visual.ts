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
        this.items = [];
        this.properties = {
        };
    }

    public update(options: any) {
        console.log(options.dataViews[0]);
        const dataView = options.dataViews[0];
        if (dataView && dataView.plain.profile.ActualValue.values.length) {
            const plainData = dataView.plain;
            this.ActualValue = plainData.profile.ActualValue.values;
            this.ContrastValue = plainData.profile.ContrastValue.values;
            this.items = this.ContrastValue.length ? [plainData.data[0][this.ActualValue[0].display] / plainData.data[0][this.ContrastValue[0].display]] : [plainData.data[0][this.ActualValue[0].display]];
        }
        this.properties = options.properties;
        this.render();
    };

    private findInterval(options: any, items: any) {
        for (let index = 0; index < 5; index++) {
            let name = 'Interval' + (index + 1);
            let flag = false;
            let str = options[name].split(",");
            if (str.length - 1) {
                let left = str[0].length;
                let right = str[1].length;
                if (left - 1) {
                    let leftValue = str[0].substring(1);
                    flag = str[0].substring(0, 1) === "[" ? (items >= leftValue) : (items > leftValue);
                }
                if (right - 1) {
                    let rightValue = str[1].substring(0, str[1].length - 1);
                    flag = str[1].substring(right - 1, right) === "]" ? (items <= rightValue) : (items < rightValue);
                }
            }
            if (flag) {
                return index;
            }
        }
    }

    private render() {
        this.chart.clear();
        const isMock = !this.items.length;
        const items = isMock ? Visual.mockItems : this.items;
        this.container.style.opacity = isMock ? '0.3' : '1';
        const options = this.properties;
        let fontWeight: string;
        if (options.textStyle.fontWeight == "Light") {
            fontWeight = options.textStyle.fontWeight + "er"
        } else {
            fontWeight = options.textStyle.fontWeight
        }
        let color = !options.showColor ? options.piecesColor[0] : options.piecesColor[this.findInterval(options, items)];
        var option = {
            series: [{
                type: 'liquidFill',
                radius: '95%',
                name: options.subtitle,
                shape: options.shape,
                center: ['50%', '50%'],
                data: [items, items * 0.9, items * 0.8, items * 0.7],
                color: [color],
                outline: {
                    show: options.showoutline,
                    borderDistance: options.borderDistance,
                    itemStyle: {
                        borderWidth: options.outlineborderWidth,
                        borderColor: options.outlineborderColor,
                    }
                },
                backgroundStyle: {
                    borderWidth: options.borderWidth,
                    borderColor: options.borderColor,
                    color: options.backgroundColor
                },
                label: {
                    show: options.showlabel,
                    formatter: function () {
                        return (items * 100).toFixed(2) + '%';
                    },
                    color: options.textStyle.color,
                    fontSize: options.textStyle.fontSize.substr(0, 2),
                    fontWeight: fontWeight,
                    fontFamily: options.textStyle.fontFamily,
                    fontStyle: options.textStyle.fontStyle,
                    insideColor: '#fff',
                }
            }]
        };
        this.chart.setOption(option);
    }

    // public abstract onDestroy(): void;
    public onResize() {
        this.chart.resize();
        this.render();
    }

    // 自定义属性可见性
    public getInspectorHiddenState(updateOptions: any): string[] {
        if (!updateOptions.properties.showColor) {
            return ['Interval1','Interval2','Interval3','Interval4','Interval5'];
        }
        if (!updateOptions.properties.showoutline) {
            return ['borderDistance','outlineborderWidth','outlineborderColor'];
        }
        if (!updateOptions.properties.showlabel) {
            return ['textStyle'];
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