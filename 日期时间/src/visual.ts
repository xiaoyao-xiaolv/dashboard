import '../style/visual.less';
export default class Visual {
    private container: HTMLDivElement;
    private properties: any;
    constructor(dom: HTMLDivElement, host: any) {
        this.container = dom;
        this.properties = {
            shape: 'detailed',
            textStyle: {
                color: '#fff',
                fontSize: '10pt',
                fontFamily: '微软雅黑',
                fontStyle: 'Normal',
                fontWeight: 'Normal'
            }
        };
    }
    public update(options: any) {
        this.properties = options.properties;
        this.render();
    };
    private render() {
        this.container.innerHTML = "";
        const options = this.properties;
        let p1: any = document.createElement("p");
        p1.className = 'p1';
        p1.style.whiteSpace = 'pre';
        p1.style.fontSize = '20px';
        p1.style.margin = '0 auto';
        this.container.appendChild(p1);
        //显示时间
        let nowtime: any = new Date();
        let hour: any = nowtime.getHours();//时
        let minutes: any = nowtime.getMinutes(); //分
        let seconds: any = nowtime.getSeconds(); //秒
        //文字增加空格
        let today: any = new Date();
        let weekday: any
        if (today.getDay() == 0) weekday = "星期日  ";
        if (today.getDay() == 1) weekday = "星期一  ";
        if (today.getDay() == 2) weekday = "星期二  ";
        if (today.getDay() == 3) weekday = "星期三  ";
        if (today.getDay() == 4) weekday = "星期四  ";
        if (today.getDay() == 5) weekday = "星期五  ";
        if (today.getDay() == 6) weekday = "星期六  ";
        let date: any = (today.getFullYear()) + "年" + (today.getMonth() + 1) + "月" + today.getDate() + "日";
        p1.style.color = options.textStyle.color;
        p1.style.fontSize = options.textStyle.fontSize;
        p1.style.fontFamily = options.textStyle.fontFamily;
        p1.style.fontStyle = options.textStyle.fontStyle;
        p1.style.fontWeight = options.textStyle.fontWeight;
        switch (options.shape) {
            case "Short": {
                p1.innerHTML = date;
                break;
            }
            case "Long": {
                p1.innerHTML = date + " " + this.p(hour) + ":" + this.p(minutes) + ":" + this.p(seconds);
                break;
            }
            default: {
                p1.innerHTML = date + " " + weekday + " " + this.p(hour) + ":" + this.p(minutes) + ":" + this.p(seconds);
                break;
            }
        }
        clearTimeout(timeID);
        var timeID = setTimeout(() => { this.render() }, 1000);
    }
    private p(s: any) {
        return s < 10 ? '0' + s : s;
    }
    // 自定义属性可见性
    public getInspectorVisibilityState(properties: any): string[] {
        return null;
    }
    // 功能按钮可见性
    public getActionBarVisibilityState(updateOptions: any): string[] {
        return null;
    }
    public onActionEventHandler = (name: string) => {
        console.log(name);
    }
}