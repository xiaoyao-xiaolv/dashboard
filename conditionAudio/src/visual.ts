import '../style/visual.less';

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private visualHost: any;
  private properties: any;
  private value: any;
  static mockValue = 30000;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.visualHost = host;
  }

  private render() {
    if(this.container.childNodes[1]) {
      this.container.removeChild(this.container.childNodes[1]);
    }
    this.container.innerHTML = "";
    const isMock = !this.value;
    this.container.style.opacity = isMock ? '0.3' : '1';
    let value = isMock ? Visual.mockValue : this.value;
    const options = this.properties;

    // create audio element
    let audio = document.createElement('audio');
    audio.setAttribute("autoplay", "autoplay");
    if (options.loop) {
      audio.setAttribute("loop", "loop");
    }
    this.container.appendChild(audio);

    let controlAudio = () => {
      audio.pause();
    }
    
    function compare(operator, comparedValue , value) {
        switch (operator) {
          case '[':
            return value >= comparedValue;
          case '(':
            return value > comparedValue;
          case ']':
            return value <= comparedValue;
          case ')':
            return value < comparedValue;
        }
    }
    
    for (let index = 0; index < 5; index++) {
      let satisfied = false;
      let name = `Interval${index + 1}`;
      let intervalArr = options[name].split(",");

      // get value & operator
      let leftValue, rightValue, leftOperator, rightOperator;
      let leftStrArr = /^(\[|\()(\d+)/.exec(intervalArr[0]);
      let rightStrArr = /^(\d+)(\]|\))$/.exec(intervalArr[1]);
      if (leftStrArr) {
        leftValue = parseFloat(leftStrArr[2]);
        leftOperator = leftStrArr[1];
      }
      if (rightStrArr) {
        rightValue = parseFloat(rightStrArr[1]);
        rightOperator = rightStrArr[2];
      }

      if (leftValue || rightValue) {
        if (leftValue && rightValue) {
          if ((leftOperator === '[' && rightOperator === ']' && leftValue > rightValue)  || (leftOperator === '(' || rightOperator === ')' && leftValue >= rightValue)) {
            return ;
          }
          if (compare(leftOperator,leftValue, value) && compare(rightOperator,rightValue, value)) {
            satisfied = true;
          }
        } else {
          if (leftValue) {
            if (compare(leftOperator,leftValue, value)){
              satisfied = true;
            }
          } else {
            if (compare(rightOperator,rightValue, value)){
              satisfied = true;
            }
          }
        }
      }

      if (satisfied) {
        let audioIndex = 'Audio' + (index + 1);
        let audioSrc = options[audioIndex];
        audio.setAttribute("src", audioSrc);

        // create button
        let button = document.createElement('button');
        button.innerHTML = options.buttonText;
        button.style.cssText = `
                                  border-radius:3px; 
                                  padding: 5px; 
                                  border: 1px solid transparent; 
                                  background: ${options.buttonColor};
                                  fontSize: ${parseFloat(options.buttonTextStyle.fontSize)};
                                  color: ${options.buttonTextStyle.color};
                                  fontFamily: ${options.buttonTextStyle.fontFamily};
                                  fontStyle: ${options.buttonTextStyle.fontStyle};
                                  fontWeight: ${options.buttonTextStyle.fontWeight};
                                `;
        button.addEventListener('click', controlAudio, false);
        this.container.appendChild(button);
        break;
      }
    }
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    if(options.isFocus || options.isViewer) {
      const plainData = options.dataViews[0] && options.dataViews[0].plain;
      if (plainData) {
        let valueName = plainData.profile.values.values[0].display;
        this.value = plainData.data[0][valueName];
      }
      this.properties = options.properties;
      this.render();
    }
  }

  public onDestroy() {

  }

  public onResize() {
    this.render();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }
}