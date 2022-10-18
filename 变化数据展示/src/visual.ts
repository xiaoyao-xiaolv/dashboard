

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private items: any;
  private chartValue: any;
  private properties: any;
  private ActualValue: any;
  private ContrastValue: any;
  private selectionManager: any;
  private host: any;
  private format: any;
  private currentOptions: VisualNS.IVisualUpdateOptions;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);

    this.container = dom;
    this.items = [];
    this.properties = options.properties;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.host = host;


  }

  private render() {
    
    console.log(this.currentOptions);

    var columnName = this.currentOptions.dataViews[0].plain.profile.values.values[0].name;
    var data1 = this.currentOptions.dataViews[0].plain.data[0][columnName] as number;
    this.format = this.currentOptions.dataViews[0].plain.profile.values.values[0].format;

    var columnName2 = this.currentOptions.dataViews[0].plain.profile.contrast.values[0].name;
    var data2 = this.currentOptions.dataViews[0].plain.data[0][columnName2] as number; 
    console.log("data1:"+columnName+","+data1+",data2:"+columnName2+","+data2);

    var increaseing = true;
    var result = "";
    if(data2 < data1)
    {
      increaseing = false;
    }
    result = this.formatData(increaseing?(data2-data1)/data1:(data1-data2)/data2);

    


    var divHeader = this.htmlToElement("<div id='header' class='header' style='text-align:center;vertical-align: middle;'><span id='headerSpan' >同比增长</span> <img id='headerImg' /></div> ");
    var divContent = this.htmlToElement("<div id='content'  class='content' style='height:80%;'><p>50%</p></div>");

    //this.host.assetsManager.getImage("defaultImage");
    var openImage;
    
    var upImg=this.host.assetsManager.getImage("defaultUp");
    var downImg=this.host.assetsManager.getImage("defaultDown");

    if(this.currentOptions.properties.graphImage != null)
    {
      openImage = this.currentOptions.properties.graphImage;
    }

    if(this.currentOptions.properties.upImage != null)
    {
      upImg = this.currentOptions.properties.upImage;
    }
    if(this.currentOptions.properties.downImage != null)
    {
      downImg = this.currentOptions.properties.downImage;
    }
    var imgTitle = divHeader.lastChild as HTMLImageElement;
    var txtTitle = divHeader.firstChild as HTMLSpanElement;

    
    imgTitle.src = increaseing?upImg:downImg;
    txtTitle.innerHTML = increaseing?"同比增长":"同比下降"


    txtTitle.style.color = this.currentOptions.properties.titleFont.color;
    txtTitle.style.fontFamily = this.currentOptions.properties.titleFont.fontFamily;
    txtTitle.style.fontSize = this.currentOptions.properties.titleFont.fontSize.replace("pt", "");
    txtTitle.style.fontStyle=  this.currentOptions.properties.titleFont.fontStyle;
    txtTitle.style.fontWeight = this.currentOptions.properties.titleFont.fontWeight;

    


    var img2 = divContent as HTMLDivElement;
    img2.style.backgroundImage = "url("+openImage+")";
    img2.style.backgroundSize = "cover";

    var txtBody= divContent.firstChild as HTMLParagraphElement;
    txtBody.style.color = this.currentOptions.properties.numberFont.color;
    txtBody.style.fontFamily = this.currentOptions.properties.numberFont.fontFamily;
    txtBody.style.fontSize = this.currentOptions.properties.numberFont.fontSize.replace("pt", "");
    txtBody.style.fontStyle=  this.currentOptions.properties.numberFont.fontStyle;
    txtBody.style.fontWeight = this.currentOptions.properties.numberFont.fontWeight;

    txtBody.style.transform = "translateY("+this.currentOptions.properties.bodyPosition+"px)";
    txtBody.innerHTML = result;
    /*var txtBody = divContent.lastChild as HTMLDivElement;
    img2.src = openImage;

    txtBody.style.color = this.currentOptions.properties.numberFont.color,
    txtBody.style.fontFamily = this.currentOptions.properties.numberFont.fontFamily,
    txtBody.style.fontSize = this.currentOptions.properties.numberFont.fontSize.replace("pt", ""),
    txtBody.style.fontStyle=  this.currentOptions.properties.numberFont.fontStyle,
    txtBody.style.fontWeight = this.currentOptions.properties.numberFont.fontWeight*/

    //debugger;
    this.container.append(divHeader);
    this.container.append(divContent);
    this.container.style.overflow = "hidden";
  }
  private formatData (number) {
    const formatService = this.host.formatService;
    let realDisplayUnit = formatService.getAutoDisplayUnit([number]);
    return formatService.format(this.format, number, realDisplayUnit);
  }


  public update(options: VisualNS.IVisualUpdateOptions) { 
    Array.from(this.container.childNodes).forEach(i => i.remove());
    this.currentOptions = options;
    this.render();
  }
  private htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

  public onDestroy(): void {
    Array.from(this.container.childNodes).forEach(i => i.remove());
  }

  public onResize() {
    
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