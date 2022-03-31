import '../style/visual.less';

export default class Visual extends WynVisual {
    private container: HTMLDivElement;
    private host: VisualNS.VisualHost = null;
    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.container = dom;
        this.host = host;
    }

    public update(options: VisualNS.IVisualUpdateOptions) {
        // SwitchTab
        this.container.innerHTML = "";
        let button = document.createElement('button');
        button.innerText = '点击';
        button.className = "sol-button"
        console.log(this.container)

        let wrapper = window.parent.document.getElementById('dashboard-designer-app-wrapper');
        
        let div = document.createElement('div');
        div.innerText = '这是一个模态框';
        div.style.cssText = 'width: 200px; height: 100px; position: absolute; transform:translate(-50%,0); background: white; border: 1px solid red; padding: 10px;';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.display = 'none';
        wrapper.appendChild(div);

        // let modalButton = document.createElement('button');
        // modalButton.innerText = '确定';
        // modalButton.style.cssText = 'width: 60px; height: 30px;  border: 1px solid black; position: absolute; transform: translate(-50%,0)';
        // modalButton.style.left = '50%';
        // modalButton.style.bottom = '5px';
        // div.appendChild(modalButton);

        let that = this;
        button.onclick = function () {
            //切换选项卡
            that.host.commandService.execute([{
                name: 'SwitchTab',
                payload: {
                    target: 'tabContainer',
                    // @ts-ignore
                    index: 1,
                    // name: pageName,
                }
            }])
        }

        this.container.appendChild(button);

    }

    public onDestroy(): void {

    }

    public onResize(): void {

    }

    public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        return null;
    }

    public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
        return null;
    }

    public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
        return null;
    }
}