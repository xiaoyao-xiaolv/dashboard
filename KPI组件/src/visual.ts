import '../style/visual.less';

export default class Visual extends WynVisual {

  private container: any;
  private visualHost: any;
  private options: any;
  private items: any;
  private isMock: any;
  private mockItems = {
    fontSet: Number,
    actualName: 80,
    reducedName: 100,
    actualValue: "销售数量",
    reducedValue: "销售总数",
    percent: 80
  };

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.container.classList.add('visual-KPI');
    this.visualHost = host;
  }

  public update(options: any) {
    this.options = options.properties;
    this.isMock = true
    this.items = {
      fontSet: this.container.clientHeight * this.container.clientWidth,
      actualName: String,
      reducedName: String,
      actualValue: Number,
      reducedValue: Number,
      percent: Number
    }
    this.container.clientHeight
    const dataView = options.dataViews[0] && options.dataViews[0].plain;
    if (dataView) {
      this.isMock = false
      if (dataView.profile.actualValue.values.length != 0) {
        const actualDisplay = dataView.profile.actualValue.values[0].display;
        this.items.actualName = actualDisplay
        this.items.actualValue = dataView.data[0][actualDisplay]
      }
      if (dataView.profile.reducedValue.values.length != 0) {
        const reducedDisplay = dataView.profile.reducedValue.values[0].display;
        this.items.reducedName = reducedDisplay
        this.items.reducedValue = dataView.data[0][reducedDisplay]
      }
    }

    this.render();
  };

  private render() {
    if (this.isMock && !this.options.actualValueSource && !this.options.actualValueSourcereducedValueSource && !this.options.customMain && !this.options.showVolume && !this.options.showLabel) {
      this.isMock = true
    }
    if (this.isMock) {
      this.container.style.opacity = '0.3';
      this.items = this.mockItems
    }
    console.log(this.items)

    let istrue = document.getElementsByClassName("show")
    let KPI_show;
    let minElement;
    let maxElement;
    let nameElement;
    if (istrue.length == 0) {
      KPI_show = document.createElement("div");
      minElement = document.createElement("div");
      maxElement = document.createElement("div");
      nameElement = document.createElement("div");
      KPI_show.className = "show"
      KPI_show.id = "KPI_show";
      minElement.id = "minElement";
      maxElement.id = "maxElement";
      nameElement.id = "name";
    } else {
      KPI_show = document.getElementById("KPI_show")
      minElement = document.getElementById("minElement")
      maxElement = document.getElementById("maxElement")
      nameElement = document.getElementById("name")
    }

    this.getNewMassage();

    let text = ""
    if (this.options.customMain) {
      text = this.options.customMassage
    } else {
      text = this.items.percent
    }
    let textColor = this.getTextStyle("mainText")
    if (this.options.conditionColor) {
      let per = Number(text)
      this.options.setShowColor.forEach((value) => {
        if (per > value.sectionMin && per <= value.sectionMax) {
          textColor.color = value.mainColor
          return
        }
      });
    }
    this.showMainMassage(maxElement, text + "%", this.options.mainXPosition, this.options.mainYPosition, textColor);
    
    if(this.options.showVolume){
      minElement.removeAttribute("hidden")
      if (this.options.customVolume) {
        text = this.options.volumeMassage
      } else {
        text = this.items.actualValue + "\\" + this.items.reducedValue;
      }
      this.showMainMassage(minElement, text, this.options.volumeXPosition - 50, this.options.volumeYPosition, this.getTextStyle("volumeText"));
    }else{
      minElement.setAttribute("hidden",true)
    }
    
    if(this.options.showLabel){
      nameElement.removeAttribute("hidden")
      if (this.options.customLabel) {
        text = this.options.labelMassage
      } else {
        text = this.items.actualName + "\\" + this.items.reducedName;
      }
      this.showMainMassage(nameElement, text, this.options.customXPosition - 50, this.options.customYPosition - 105, this.getTextStyle("labelText"));  
    }else{
      nameElement.setAttribute("hidden",true)
    }
    
    if (istrue.length == 0) {
      KPI_show.appendChild(minElement)
      KPI_show.appendChild(maxElement)
      this.container.appendChild(KPI_show);
      this.container.appendChild(nameElement);
    }

  }

  public getNewMassage() {
    if (this.options.actualValueSource) {
      this.items.actualName = this.options.actualName
      this.items.actualValue = this.options.actualValue
    }
    if (this.options.reducedValueSource) {
      this.items.reducedName = this.options.reducedName
      this.items.reducedValue = this.options.reducedValue
    }
    this.items.fontSet = this.container.clientHeight * this.container.clientWidth;
    this.items.percent = Number(this.items.actualValue / this.items.reducedValue * 100).toFixed(2)
  }

  public showMainMassage(element: HTMLElement, text, X, Y, textStyle) {
    element.innerText = text
    element.style.left = 50 + "%"
    element.style.top = 50 + "%"
    element.style.fontSize = textStyle.fontSize
    element.style.fontFamily = textStyle.fontFamily
    element.style.fontStyle = textStyle.fontStyle
    element.style.fontWeight = textStyle.fontWeight
    element.style.color = textStyle.color
    return element
  }

  //获取字体显示
  getTextStyle(name) {
    let textStyle = {
      color: this.options[name].color,
      fontFamily: this.options[name].fontFamily,
      fontSize: this.options[name].fontSize,
      fontStyle: this.options[name].fontStyle,
      fontWeight: this.options[name].fontWeight
    }
    let baseSize = name == "mainText" ? this.items.fontSet / 6170 : (name == "volumeText" ? this.items.fontSet / 15430 : this.items.fontSet / 13710)
    let Size = Number(textStyle.fontSize.replace("pt", ""))
    Size = ((Size - 10) * 0.1) * baseSize
    baseSize += Size
    textStyle.fontSize = baseSize + "px"
    return textStyle
  }

  public onDestroy(): void {
  }
  public onResize() {
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let option = options.properties;
    let hiddenOptions: Array<string> = ['']
    if (!option.actualValueSource) {
      hiddenOptions = hiddenOptions.concat(['actualValue', 'actualName'])
    }
    if (!option.reducedValueSource) {
      hiddenOptions = hiddenOptions.concat(['reducedValue', 'reducedName'])
    }
    if (!option.customMain) {
      hiddenOptions = hiddenOptions.concat(['customMassage'])
    }
    if (!option.customVolume) {
      hiddenOptions = hiddenOptions.concat(['volumeMassage'])
    }
    if (!option.customLabel) {
      hiddenOptions = hiddenOptions.concat(['labelMassage'])
    }
    if (!option.showVolume) {
      hiddenOptions = hiddenOptions.concat(['customVolume','volumeMassage','volumeXPosition','volumeYPosition','volumeText'])
    }
    if (!option.showLabel) {
      hiddenOptions = hiddenOptions.concat(['customLabel','labelMassage','labelXPosition','labelYPosition','labelText'])
    }

    if (option.conditionColor) {
      hiddenOptions = hiddenOptions.concat(['mainText'])
    } else {
      hiddenOptions = hiddenOptions.concat(['setShowColor'])
    }
    return hiddenOptions
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}