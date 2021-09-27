import '../style/visual.less';
import * as eCharts from 'echarts';
import PerfectScrollbar from 'perfect-scrollbar';
import Hsl from './palette';

interface cardsRenderConfig {
  category: string[];
  kpiS: any[] | number[];
  measuresDisplay: {
    left: string[],
    right: string[]
  };
  measuresValue: {
    left: number[][],
    right: number[][]
  };
  xAxis: string[][];
  values: number[][];
  isMock: boolean;
  actualValues: number[];
  contrastValues: number[];
}

enum CardLayout {
  Customized = 'customizedLayout',
  Vertical = 'verticalLayout',
  Horizontal = 'horizontalLayout'
}

export default class Visual extends WynVisual {
  private static defaultConfig: cardsRenderConfig = {
    category: ['DD1', 'DD2', 'DD3', 'DD4'],
    kpiS: [123456, 123456, 123456, 123456],
    measuresDisplay: {
      left: ['Selling'],
      right: ['Price']
    },
    measuresValue: {
      left: [[89], [89], [89], [89]],
      right: [[43], [43], [43], [43]]
    },
    xAxis: [["XXS", "XS", 'S', 'M', 'L', 'XL', 'XXL', "XXL"], ["XXS", "XS", 'S', 'M', 'L', 'XL', 'XXL', "XXL"], ["XXS", "XS", 'S', 'M', 'L', 'XL', 'XXL', "XXL"], ["XXS", "XS", 'S', 'M', 'L', 'XL', 'XXL', "XXL"]],
    values: [[10, 11, 8, 9, 5, 7, 9, 6], [10, 11, 8, 9, 5, 7, 9, 6], [10, 11, 8, 9, 5, 7, 9, 6], [10, 11, 8, 9, 5, 7, 9, 6]],
    isMock: true,
    actualValues: [80, 80, 80, 80],
    contrastValues: [100, 100, 100, 100]
  }

  private renderConfig: cardsRenderConfig;
  private selectionManager: VisualNS.SelectionManager;
  private styleConfig: any;
  private plainDataView: any;
  private dom: HTMLDivElement;
  private host: VisualNS.VisualHost;
  private category: string[];
  private chartBoxes: HTMLDivElement[];
  private progressBoxes: HTMLDivElement[];
  private cardBoxes: HTMLDivElement[];
  private chartValueFormat: string;
  private chartValueDisplay: string;
  private chartAxisDisplay: string;
  private categoryDisplay: string;
  private palettes: string[];
  private kpiDisplay: string;
  private cardWidth: number;
  private ps: PerfectScrollbar;
  private progressDataView: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.dom = dom;
    this.host = host;
    this.styleConfig = options.properties;
    this.selectionManager = host.selectionService.createSelectionManager();
    this.selectionManager.registerOnSelectCallback(this.resetCards);
    this.dom.addEventListener('click', this.domClickHandler);
    this.dom.classList.add('mainDom');
    this.chartAxisDisplay = 'size';
    this.chartValueDisplay = 'price';
    this.ps = new PerfectScrollbar(this.dom);
  }

  private reset() {
    this.host.toolTipService.hide();
    this.cardBoxes.forEach(cardBox => cardBox.style.setProperty('opacity', '1'));
  }

  private resetCards = (ids: VisualNS.SelectionId[]) => {
    this.reset();
  }

  private domClickHandler = (e: any) => {
    this.selectionManager.clear();
  }

  private setAttribute(attribute: HTMLParagraphElement, target: any) {
    attribute.setAttribute("style", `margin:0;color: ${target.color};font-family: ${target.fontFamily};font-size: ${target.fontSize}; font-style: ${target.fontStyle};font-weight: ${target.fontWeight};`);
  }

  private setCommonCardStyle(tagCategory: HTMLParagraphElement, tagKpi: HTMLParagraphElement, tagMeasures: { rightTag: any[]; leftTag: any[] },
                             categoryStyle: any, kpiStyle: any, measureStyle: any) {
    this.setAttribute(tagCategory, categoryStyle);
    this.setAttribute(tagKpi, kpiStyle);
    tagMeasures.leftTag.forEach(tagMeasure => this.setAttribute(tagMeasure, measureStyle));
    tagMeasures.rightTag.forEach(tagMeasure => this.setAttribute(tagMeasure, measureStyle));
  }

  private setDifferentCardStyle(tagCategory: HTMLParagraphElement, tagKpi: HTMLParagraphElement, tagMeasures: { rightTag: any[]; leftTag: any[] },
                                mainBox: HTMLDivElement, measuresBox: HTMLDivElement, leftMeasuresBox: HTMLDivElement, rightMeasuresBox: HTMLDivElement) {
    measuresBox.style.marginTop = `${this.styleConfig.measureTopPosition}px`;
    measuresBox.style.marginLeft = `${this.styleConfig.measureLeftPosition}px`;
    measuresBox.style.display = 'flex';
    measuresBox.style.width = '100%';
    leftMeasuresBox.style.flex = `0 0 ${this.styleConfig.measureLeftWidth}%`;
    leftMeasuresBox.style.textAlign = this.styleConfig.measureLeftAlign;
    rightMeasuresBox.style.width = '100%';
    rightMeasuresBox.style.textAlign = this.styleConfig.measureRightAlign;
    tagMeasures.leftTag.forEach(tagMeasure => {
      tagMeasure.style.display = 'block';
    });
    tagMeasures.rightTag.forEach(tagMeasure => {
      tagMeasure.style.display = 'block';
    });
    switch (this.styleConfig.layout) {
      case CardLayout.Customized: {
        tagCategory.style.display = 'inline-block';
        tagCategory.style.marginTop = `${this.styleConfig.categoryTopPosition}px`;
        tagCategory.style.marginLeft = `${this.styleConfig.categoryLeftPosition}px`;
        tagKpi.style.cssFloat = 'right';
        tagKpi.style.marginTop = `${this.styleConfig.kpiTopPosition}px`;
        tagKpi.style.marginRight = `${this.styleConfig.kpiRightPosition}px`;
        break;
      }
      case CardLayout.Vertical: {
        tagCategory.style.display = 'block';
        mainBox.style.marginTop = `${this.styleConfig.categoryTopPosition}px`;
        mainBox.style.marginLeft = `${this.styleConfig.categoryLeftPosition}px`;
        break;
      }
      case CardLayout.Horizontal: {
        tagCategory.style.display = 'inline-block';
        tagKpi.style.display = 'inline-block';
        tagKpi.style.marginLeft = '24px';
        mainBox.style.marginTop = `${this.styleConfig.categoryTopPosition}px`;
        mainBox.style.marginLeft = `${this.styleConfig.categoryLeftPosition}px`;
        break;
      }
      default:
        break;
    }
  }

  private colorRgba(color: string, a: number) {
    let sColor = color.toLowerCase();
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (sColor && reg.test(sColor)) {
      if (sColor.length === 4) {
        let sColorNew = "#";
        for (let i = 1; i < 4; i += 1) {
          sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
        }
        sColor = sColorNew;
      }
      const sColorChange = [];
      for (let i = 1; i < 7; i += 2) {
        sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
      }
      return `rgba(${sColorChange.join(",")},${a})`;
    }
    return sColor;
  }

  private changeRgba(color: string, a: number) {
    const sColor = color.substring(3, color.length - 1);
    return `rgba${sColor},${a})`;
  }

  private getPalette = (category: string[], a: number) => {
    const {cardsColor} = this.styleConfig;
    const hsl = [];
    this.palettes = [];
    for (let i = 0; i < category.length; i++) {
      i < 6 ? hsl.push(new Hsl(category[i], cardsColor[i])) : hsl.push(new Hsl(category[i], hsl[i - 6]));
      this.palettes.push(hsl[i].ToRgba(a));
    }
  }

  private getBackgroundColor = (index: number) => {
    const {cardsColor, maintainColorAssignment, cardTransparency} = this.styleConfig;
    if (JSON.stringify(this.renderConfig) === JSON.stringify(Visual.defaultConfig) || this.palettes === undefined) {
      return this.colorRgba(cardsColor[index], cardTransparency * (0.01));
    } else if (maintainColorAssignment) {
      const color = maintainColorAssignment[this.category[index]];
      return color.includes('#') ? this.colorRgba(color, cardTransparency * (0.01)) : this.changeRgba(color, cardTransparency * (0.01));
    } else {
      return this.palettes[index];
    }
  }

  private synthesisMeasure(tagMeasures: { rightTag: any[]; leftTag: any[] }, titleMeasures: { rightTitle: any[]; leftTitle: any[] }, textMeasures: { rightText: any[]; leftText: any[] }, measuresBox: HTMLDivElement, leftMeasuresBox: HTMLDivElement, rightMeasuresBox: HTMLDivElement) {
    for (let i = 0; i < tagMeasures.leftTag.length; i++) {
      tagMeasures.leftTag[i].appendChild(titleMeasures.leftTitle[i]);
      tagMeasures.leftTag[i].appendChild(textMeasures.leftText[i]);
    }
    for (let i = 0; i < tagMeasures.rightTag.length; i++) {
      tagMeasures.rightTag[i].appendChild(titleMeasures.rightTitle[i]);
      tagMeasures.rightTag[i].appendChild(textMeasures.rightText[i]);
    }
    tagMeasures.leftTag.forEach(tagMeasure => leftMeasuresBox.appendChild(tagMeasure));
    tagMeasures.rightTag.forEach(tagMeasure => rightMeasuresBox.appendChild(tagMeasure));
    measuresBox.appendChild(leftMeasuresBox);
    measuresBox.appendChild(rightMeasuresBox);
  }

  private synthesisCard(tagCategory: HTMLParagraphElement, textCategory: Text, tagMeasures: { rightTag: any[]; leftTag: any[] },
    tagKpi: HTMLParagraphElement, textKpi: Text, titleMeasures: { rightTitle: any[]; leftTitle: any[] }, textMeasures: { rightText: any[]; leftText: any[] },
    mainBox: HTMLDivElement, measuresBox: HTMLDivElement, leftMeasuresBox: HTMLDivElement, rightMeasuresBox: HTMLDivElement,
    chartBox: HTMLDivElement, progressBox: HTMLDivElement, cardBox: HTMLDivElement, paletteNumber: number) {
    tagCategory.appendChild(textCategory);
    tagKpi.appendChild(textKpi);
    mainBox.appendChild(tagCategory);
    mainBox.appendChild(tagKpi);
    this.synthesisMeasure(tagMeasures, titleMeasures, textMeasures, measuresBox, leftMeasuresBox, rightMeasuresBox);
    cardBox.appendChild(mainBox);
    cardBox.appendChild(measuresBox);
    cardBox.appendChild(chartBox);
    this.dom.appendChild(cardBox);
    cardBox.setAttribute("style",
      `background: ${this.getBackgroundColor(paletteNumber)};
     margin: ${this.styleConfig.cardMargin.top}px ${this.styleConfig.cardMargin.bottom}px ${this.styleConfig.cardMargin.left}px ${this.styleConfig.cardMargin.right}px; 
     padding: ${this.styleConfig.cardPadding.top}px ${this.styleConfig.cardPadding.bottom}px ${this.styleConfig.cardPadding.left}px ${this.styleConfig.cardPadding.right}px;
     border-radius:${this.styleConfig.borderRadius}px;
     overflow: hidden;
     box-sizing: border-box;
     position:relative;`);
    cardBox.style.width = `${this.cardWidth}px`;
    cardBox.style.height = `${this.cardWidth / this.styleConfig.aspectRatio}px`;
    chartBox.style.position = 'absolute';
    chartBox.style.height = `calc((100% - (${this.styleConfig.cardPadding.top + this.styleConfig.cardPadding.bottom + 24}px)) * ${this.styleConfig.chartHeight / 100})`;
    chartBox.style.width = `calc(100% - (${this.styleConfig.cardPadding.left + this.styleConfig.cardPadding.right}px)`;
    chartBox.style.bottom = `${this.styleConfig.cardPadding.bottom + 24}px`;
    if(this.renderConfig.actualValues.length && this.renderConfig.contrastValues.length) {
      cardBox.appendChild(progressBox);
      progressBox.style.position = 'absolute';
      progressBox.style.bottom = `${this.styleConfig.cardPadding.bottom}px`;
      progressBox.style.left = '0';
      progressBox.style.width = '100%';
      progressBox.style.height = '100%';
    }
  }

  private fillMeasures(measuresDisplay: { left: string[]; right: string[] }, measuresValue: { left: number[][], right: number[][] }, tagMeasures: { rightTag: any[]; leftTag: any[] },
    titleMeasures: { rightTitle: any[]; leftTitle: any[] }, textMeasures: { rightText: any[]; leftText: any[] }, index: number) {
    function fillMeasure(display, side) {
      for (let i = 0; i < display.length; i++) {
        const tag = document.createElement('p');
        tag.classList.add('tag');

        tagMeasures[`${side}Tag`].push(tag);
        titleMeasures[`${side}Title`].push(document.createTextNode(`${display[i]}: `));
        textMeasures[`${side}Text`].push(document.createTextNode(`${measuresValue[side][index][i]}`));
      }
    }
    fillMeasure(measuresDisplay.left, 'left');
    fillMeasure(measuresDisplay.right, 'right');
  }

  private mouseoverHandler = (e: any) => {
    if (e.componentType === 'series') {
      this.host.toolTipService.show({
        position: {
          x: e.event.event.pageX,
          y: e.event.event.pageY,
        },
        title: e.name,
        fields: [{
          label: this.chartAxisDisplay,
          value: e.name,
        }, {
          label: this.chartValueDisplay,
          value: this.host.formatService.format(this.chartValueFormat, e.value),
        }],
        menu: false,
      });
    }
  }

  private mouseoutHandler = (e: any) => {
    if (e.seriesType === 'bar') {
      const boundingRect = e.event.target._rect;
      const { x, y, height, width } = boundingRect;
      const offsetX = e.event.offsetX;
      const offsetY = e.event.offsetY;
      if (offsetX >= x && offsetX <= x + width && offsetY >= y && offsetY <= y + height) {
        return;
      }
    }
    if (this.selectionManager.isEmpty()) {
      this.host.toolTipService.hide();
    }
  }

  private renderProgress() {
    let that = this;
    for (let i = 0; i < this.progressBoxes.length; i++) {
      const progressInstance = eCharts.init(that.progressBoxes[i]);
      progressInstance.resize({
        width: getComputedStyle(that.progressBoxes[i]).width,
        height: getComputedStyle(that.progressBoxes[i]).height
      });
      const options = {
        grid:{
          bottom: 10,
          left:10,
          right:10,
          height: `${that.styleConfig.progressBarWidth}px`
        },
        xAxis: {
          show: false,
          max: that.renderConfig.contrastValues[i],
        },
        yAxis: {
          type: 'category',
          axisLine: {
            show: false,
          }
        },
        series: [
          {
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: that.styleConfig.progressBarBackground,
              barBorderRadius: 30
            },
            label:{
              show: that.styleConfig.showProgressLabel,
              position:'insideRight',
              formatter: function () {
                return `${((that.renderConfig.actualValues[i]/that.renderConfig.contrastValues[i]) * 100).toFixed(2)}%`;
              },
              textStyle: {
                ...that.styleConfig.progressTextStyle,
                fontSize: parseFloat(that.styleConfig.progressTextStyle.fontSize),
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: that.styleConfig.progressBarColor,
              }
            },
            barWidth: that.styleConfig.progressBarWidth,
            data: [that.renderConfig.actualValues[i]],
          }
        ]
      };

      // @ts-ignore
      progressInstance.setOption(options);
    }
  }

  private renderChart() {
    for (let i = 0; i < this.chartBoxes.length; i++) {
      const eChartsInstance = eCharts.init(this.chartBoxes[i]);
      eChartsInstance.on('mouseover', this.mouseoverHandler);
      eChartsInstance.on('mouseout', this.mouseoutHandler);
      eChartsInstance.resize({
        width: getComputedStyle(this.chartBoxes[i]).width,
        height: getComputedStyle(this.chartBoxes[i]).height
      });
      const type = this.plainDataView === undefined ? 'line' : this.plainDataView.options.chartType;
      const options = {
        grid: {
          left: 0,
          top: 0,
          right: 0,
          bottom: 0
        },
        xAxis: {
          data: this.renderConfig.xAxis[i],
          boundaryGap: type !== 'area',
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          splitLine: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [{
          type: type === 'area' ? 'line' : type,
          cursor: 'default',
          data: this.renderConfig.xAxis[i] === undefined ? undefined : this.renderConfig.values[i],
          areaStyle: type === 'area' ? {} : undefined,
          itemStyle: {
            color: this.styleConfig.chartColor,
          }
        }]
      };
      eChartsInstance.setOption(options);
    }
  }

  private setMeasures(display: any[], format: any[]) {
    const measures = [];
    if (this.category.length === 0) {
      const formatMeasures = [];
      for(let i = 0; i < display.length; i++) {
        formatMeasures.push(this.host.formatService.format(format[i], this.plainDataView.data[0][display[i]]));
      }
      measures.push(formatMeasures);
    } else {
      for (let i = 0; i < this.category.length; i++) {
        let sumMeasures = new Array(format.length).fill(0);
        const formatMeasures = [];
        for (let j = 0; j < display.length; j++) {
          this.plainDataView.data.forEach((dataPoint: any) => {
            if (dataPoint[this.categoryDisplay] === this.category[i]) {
              sumMeasures[j] += Number(dataPoint[display[j]]);
            }
          });
        }
        for (let j = 0; j < display.length; j++) {
          formatMeasures.push(this.host.formatService.format(format[j], sumMeasures[j]))
        }
        measures.push(formatMeasures);
      }
    }
    return measures;
  }

  private setRenderConfig(options: VisualNS.IVisualUpdateOptions) {
    if (this.plainDataView) {
      this.category = [];
      const kpiS = [];
      const xAxis = [];
      const values = [];
      const measuresDisplay = {
        left: [],
        right: []
      };
      const measuresFormat = {
        left: [],
        right: []
      };
      const measuresValue = {
        left: [],
        right: []
      };
      const actualValues = [];
      const contrastValues = [];

      if (this.plainDataView.profile.category.values[0] !== undefined) {
        this.categoryDisplay = this.plainDataView.profile.category.values[0].display;
        this.category.push(...this.plainDataView.sort[this.categoryDisplay].order);
        this.getPalette(this.category, this.styleConfig.cardTransparency * 0.01);
      }

      if (this.plainDataView.profile.kpi.values[0] !== undefined) {
        this.kpiDisplay = this.plainDataView.profile.kpi.values[0].display;
        const kpiFormat = this.plainDataView.profile.kpi.values[0].format;
        if (this.category.length === 0) {
          kpiS.push({ kpi: this.host.formatService.format(kpiFormat, this.plainDataView.data[0][this.kpiDisplay]) });
        } else {
          for (let i = 0; i < this.category.length; i++) {
            let sum = 0;
            const selectionId = this.host.selectionService.createSelectionId();
            this.plainDataView.data.forEach((dataPoint: any) => {
              if (dataPoint[this.categoryDisplay] === this.category[i]) {
                sum += Number(dataPoint[this.kpiDisplay]);
              }
            });
            selectionId.withMeasure(this.plainDataView.profile.kpi.values[0]).
              withDimension(this.plainDataView.profile.category.values[0], { [this.categoryDisplay]: this.category[i] });
            kpiS.push({
              kpi: this.host.formatService.format(kpiFormat, sum),
              category: this.dealNullText(this.category[i]),
              selectionId
            })
          }
        }
      }

      if (this.plainDataView.profile.leftMeasures.values[0] !== undefined) {
        this.plainDataView.profile.leftMeasures.values.forEach((value: any) => {
          measuresDisplay.left.push(value.display);
          measuresFormat.left.push(value.options.dataFormat);
        });
        measuresValue.left = this.setMeasures(measuresDisplay.left, measuresFormat.left);
      }

      if (this.plainDataView.profile.rightMeasures.values[0] !== undefined) {
        this.plainDataView.profile.rightMeasures.values.forEach((value: any) => {
          measuresDisplay.right.push(value.display);
          measuresFormat.right.push(value.options.dataFormat);
        });
        measuresValue.right = this.setMeasures(measuresDisplay.right, measuresFormat.right);
      }

      if (this.plainDataView.profile.axis.values[0] !== undefined) {
        this.chartAxisDisplay = this.plainDataView.profile.axis.values[0].display;
        for (let i = 0; i < this.category.length; i++) {
          const categoryAxis = [];
          categoryAxis.push(...this.plainDataView.sort[this.chartAxisDisplay].order);
          xAxis.push(categoryAxis);
        }
      }

      if (this.plainDataView.profile.value.values[0] !== undefined && xAxis.length !== 0) {
        this.chartValueDisplay = this.plainDataView.profile.value.values[0].display;
        this.chartValueFormat = this.plainDataView.profile.value.values[0].format
        for (let i = 0; i < this.category.length; i++) {
          const categoryValue = [];
          this.plainDataView.data.forEach((dataPoint: any) => {
            if (dataPoint[this.categoryDisplay] === this.category[i]) {
              const index = xAxis[i].findIndex(axis => axis === dataPoint[this.chartAxisDisplay]);
              categoryValue[index] = dataPoint[this.chartValueDisplay];
            }
          });
          values.push(categoryValue);
        }
      }

      const category = this.category;
      this.dealNullArray(category);

      if (this.progressDataView) {
        let actualValueDisplay = this.progressDataView.profile.actualValue.values[0].display;
        let contrastValueDisplay = this.progressDataView.profile.contrastValue.values[0].display;
        for (let i = 0; i < this.category.length; i++) {
          let index = this.progressDataView.data.findIndex(dataPoint => dataPoint[this.categoryDisplay] === this.category[i]);
          actualValues[i] = this.progressDataView.data[index][actualValueDisplay];
          contrastValues[i] = this.progressDataView.data[index][contrastValueDisplay];
        }
      }

      this.renderConfig = {
        category,
        kpiS,
        measuresDisplay,
        measuresValue,
        xAxis,
        values,
        isMock: false,
        actualValues,
        contrastValues
      };
    } else if (!this.plainDataView) {
      this.renderConfig = Visual.defaultConfig;
    }
  }

  private cardClickHandler = (e: any) => {
    e.stopPropagation();
    const textContent = e.currentTarget.textContent;
    const selectedKpi = this.renderConfig.kpiS.filter(kpi => textContent.includes(kpi.category));
    const selectionId = selectedKpi[0].selectionId;
    if (!this.selectionManager.contains(selectionId)) {
      this.selectionManager.select(selectionId, true);
    } else {
      this.selectionManager.clear(selectionId);
    }
    if (this.selectionManager.isEmpty()) {
      this.reset();
    } else {
      this.host.toolTipService.show({
        position: {
          x: e.pageX,
          y: e.pageY,
        },
        fields: [{
          label: this.categoryDisplay,
          value: selectedKpi[0].category,
        }, {
          label: this.kpiDisplay,
          value: selectedKpi[0].kpi,
        }],
        selected: this.selectionManager.getSelectionIds(),
        menu: true,
      });
      const selectedKpiS = this.renderConfig.kpiS.filter(kpi => this.selectionManager.contains(kpi.selectionId));
      this.cardBoxes.forEach(cardBox => {
        selectedKpiS.some(selectedKpi => cardBox.textContent.includes(selectedKpi.category))
          ? cardBox.style.setProperty('opacity', '1')
          : cardBox.style.setProperty('opacity', '0.2');
      });
    }
  }

  private dealNullArray = (array: string[]) => {
    for (let i = 0; i < array.length; i++) {
      array[i] = this.dealNullText(array[i]);
    }
  }

  private dealNullText = (text: string) => {
    if (text === null) {
      return this.host.localizationManager.getDisplay('visual.null');
    } else if (text === '') {
      return this.host.localizationManager.getDisplay('visual.emptyDisplay');
    } else {
      return text;
    }
  }

  private createCards() {
    this.chartBoxes = [];
    this.progressBoxes = [];
    this.cardBoxes = [];
    this.cardWidth = parseFloat(getComputedStyle(this.dom).width) / this.styleConfig.cardsInALine - this.styleConfig.cardMargin.left - this.styleConfig.cardMargin.right;
    const length = this.renderConfig.category.length === 0 ? 1 : this.renderConfig.category.length;
    for (let i = 0; i < length; i++) {
      const cardBox = document.createElement('div');
      const mainBox = document.createElement('div');
      const measuresBox = document.createElement('div');
      const leftMeasuresBox = document.createElement('div');
      const rightMeasuresBox = document.createElement('div');
      const chartBox = document.createElement('div');
      const progressBox = document.createElement('div');
      const tagCategory = document.createElement('p');
      const tagKpi = document.createElement('p');
      const tagMeasures = {
        leftTag : [],
        rightTag : []
      };
      const textCategory = document.createTextNode(this.renderConfig.category.length === 0 ? '' : this.renderConfig.category[i]);
      const textKpi = document.createTextNode(this.renderConfig === Visual.defaultConfig ? `${Visual.defaultConfig.kpiS[i]}` : `${this.renderConfig.kpiS[i].kpi}`);
      const titleMeasures = {
        leftTitle : [],
        rightTitle : []
      };
      const textMeasures = {
        leftText : [],
        rightText : []
      };
      this.fillMeasures(this.renderConfig.measuresDisplay, this.renderConfig.measuresValue, tagMeasures, titleMeasures, textMeasures, i);
      this.setCommonCardStyle(tagCategory, tagKpi, tagMeasures, this.styleConfig.categoryStyle, this.styleConfig.kpiStyle, this.styleConfig.measureStyle);
      this.synthesisCard(tagCategory, textCategory, tagMeasures, tagKpi, textKpi, titleMeasures, textMeasures,
        mainBox, measuresBox, leftMeasuresBox, rightMeasuresBox, chartBox, progressBox, cardBox, i);
      this.setDifferentCardStyle(tagCategory, tagKpi, tagMeasures, mainBox, measuresBox, leftMeasuresBox, rightMeasuresBox);
      this.chartBoxes.push(chartBox);
      this.progressBoxes.push(progressBox);
      cardBox.addEventListener('click', this.cardClickHandler);
      this.cardBoxes.push(cardBox);
    }
  }

  private clearCardBoxes() {
    if (this.dom.children.length !== 0) {
      Array.from(this.dom.children).forEach(cardBox => {
        cardBox.removeEventListener('click', this.cardClickHandler);
        cardBox = null;
      });
    }
  }

  private renderCards() {
    this.clearCardBoxes();
    this.dom.innerHTML = "";
    this.ps.update();
    this.createCards();
    this.ps.update();
    this.renderChart();
    this.renderProgress();
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    this.styleConfig = options.properties;
    this.plainDataView = options.dataViews[0] && options.dataViews[0].plain;
    this.progressDataView = options.dataViews[1] && options.dataViews[1].plain;
    this.setRenderConfig(options);
    this.renderCards();
  }

  public onDestroy() {
    this.dom.removeEventListener('click', this.domClickHandler);
  }

  public onResize() {
    this.renderCards();
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    const hiddenInspectors = [];
    if (options.properties.maintainColorAssignment) {
      hiddenInspectors.push('cardsColor');
    }
    if (options.properties.layout == CardLayout.Vertical || options.properties.layout == CardLayout.Horizontal) {
      hiddenInspectors.push("kpiRightPosition", "kpiTopPosition");
    }
    return hiddenInspectors;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;

  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    if (!dataViews.length) {
      return null;
    }
    const plain = dataViews[0].plain;
    const colorProfile = plain.profile.category.values[0];
    if (!colorProfile) {
      return null;
    }
    const colorValues = plain.data.map(d => this.dealNullText(d[colorProfile.display] as string));
    return {
      maintainColorAssignment: {
        values: Array.from(new Set(colorValues)),
        type: 'dimension',
        columns: [colorProfile],
      },
    };
  }
}
