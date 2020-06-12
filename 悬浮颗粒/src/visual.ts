import '../style/visual.less';

export default class Visual {
  constructor(dom: HTMLDivElement, host: any) {

  }
  public update(options: any) {

  }
  public onDestroy() {

  }
  public onResize() {
  }

  public getInspectorVisibilityState(properties: any): string[] {
    return null;
  }

  public getActionBarVisibilityState(updateOptions: any): string[] {
    return null;
  }

  public onActionEventHandler = (name: string) => {
    console.log(name);
  }
}