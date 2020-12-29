import '../style/visual.less';

export default class Visual extends WynVisual {
    private container: HTMLDivElement;
    constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
        super(dom, host, options);
        this.container = dom;
    }

    public update(options: VisualNS.IVisualUpdateOptions) {
        let button = document.createElement('button');
        button.style.cssText = 'width: 200px; height: 200px; background: red';
        button.innerText = '点击';
        this.container.appendChild(button);


        let wrapper = window.parent.document.getElementById('dashboard-designer-app-wrapper');

        let div = document.createElement('div');
        div.innerText = '这是一个模态框';
        div.style.cssText = 'width: 200px; height: 100px; position: absolute; transform:translate(-50%,0); background: white; border: 1px solid red; padding: 10px;';
        div.style.left = '50%';
        div.style.top = '50%';
        div.style.display = 'none';
        wrapper.appendChild(div);

        let modalButton = document.createElement('button');
        modalButton.innerText = '确定';
        modalButton.style.cssText = 'width: 60px; height: 30px;  border: 1px solid black; position: absolute; transform: translate(-50%,0)';
        modalButton.style.left = '50%';
        modalButton.style.bottom = '5px';
        div.appendChild(modalButton);

        button.onclick = function () {
            div.style.display = 'block';
        }

        modalButton.onclick = function () {
            div.style.display = 'none';
        }
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