import '../style/visual.less';
import Swiper from 'swiper';
import SwiperCore, { Autoplay, Navigation, Pagination, EffectCoverflow, EffectFade, EffectCube, EffectFlip} from 'swiper/core';
import 'swiper/swiper.less';
import 'swiper/swiper-bundle.css';

const EFFECT = {
  fadeEffect: {
    crossFade: true
  },
  coverflowEffect: {
    rotate: 50,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: true,
  },
  cubeEffect: {
    shadow: true,
    slideShadows: true,
    shadowOffset: 20,
    shadowScale: 0.94,
  },
  flipEffect: {
    slideShadows: false,
  }
}
const STYLENAME = {
  fontFamily: 'font-family',
  fontSize: 'font-size',
  fontStyle: "font-style",
  fontWeight: "font-weight",
}

export default class Visual extends WynVisual {
  private container: HTMLDivElement;
  private swiperContainer: Element;
  private visualHost: VisualNS.VisualHost;
  private isMock: boolean;
  private properties: any;
  private swiper: any;
  private swiperOptions: any;
  private nextBtn: any;
  private prevBtn: any;
  private prevEffect: any;
  private firstRender: any;
  private MockData: any;
  private selectionIds: any;
  private selectionManager: any;

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.visualHost = host;
    this.selectionManager = host.selectionService.createSelectionManager();
    SwiperCore.use([Autoplay, Navigation, Pagination, EffectCoverflow, EffectFade, EffectCube, EffectFlip]);
    this.container.innerHTML = `
    <div class="swiper-container mySwiper">
      <div class="swiper-wrapper">
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-pagination"></div>
    </div>`;
    this.nextBtn = document.getElementsByClassName('swiper-button-next')[0];
    this.prevBtn = document.getElementsByClassName('swiper-button-prev')[0];
    this.swiperOptions = {
      initialSlide: 1,
      speed: 1000,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      grabCursor: true,
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    }
    this.prevEffect = 'fadeEffect';
    this.firstRender = true;
    this.MockData = Visual.prepareMockData(host);
    this.swiperContainer = document.getElementsByClassName('swiper-container')[0];
  }

  private static prepareMockData(host) {
    return [
      {
        imageUrl: host.assetsManager.getImage("image1"),
        imageDescription : '图片1'
      },
      {
        imageUrl: host.assetsManager.getImage("image2"),
        imageDescription : '图片2'
      },
      {
        imageUrl: host.assetsManager.getImage("image3"),
        imageDescription : '图片3'
      },
      {
        imageUrl: host.assetsManager.getImage("image4"),
        imageDescription : '图片4'
      }
    ]
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const dataViews = options.dataViews;
    this.properties = options.properties;
    this.isMock = !dataViews.length;
    this.selectionIds = [];
    const bindData = [];
    if (dataViews.length) {
      const plainData = dataViews[0].plain.data || [];
      const profileItems = dataViews[0].plain.profile;
      const imageProfileName = profileItems.image.values[0].name;
      const imageDescProfileName = profileItems.imageDescription.values[0] && profileItems.imageDescription.values[0].name;
      plainData.forEach((data) => {
        const selectionId = this.visualHost.selectionService.createSelectionId();
        selectionId.withDimension(profileItems.image.values[0], data);
        this.selectionIds.push(selectionId);
        bindData.push({
          imageUrl: data[imageProfileName],
          imageDescription : data[imageDescProfileName] || '',
        })
      })
    }
    const swiperData = this.isMock ? this.MockData : bindData;
    this.render(swiperData);
  }

  private prepareStyle() {
    let styleString = '';
    for (const [key, value] of Object.entries(this.properties.imageDescSetting)) {
      styleString += `${STYLENAME[key]}:${value};`
    }
    return styleString;
  }

  private prepareSlides(swiperData) {
    let slides = [];
    let styleString = this.prepareStyle();
    slides = swiperData.map((data,index) => {
      return `<div class="swiper-slide">
                <img src="${data.imageUrl}" id="selection-${index}"/>      
                <div class="swiper-desc" style="${styleString}">${data.imageDescription}</div>
            </div>`
    })
    return slides;
  }

  private configSwiper() {
    this.swiperOptions.initialSlide = this.firstRender ? 1 : 2;
    this.firstRender = false;
    this.swiperOptions.speed = this.properties.speed;
    this.swiperOptions.autoplay.delay = this.properties.delay;
    this.swiperOptions.effect = this.properties.effect;
    delete this.swiperOptions[this.prevEffect];
    const effectName = `${this.properties.effect}Effect`;
    this.swiperOptions[effectName] = EFFECT[effectName];
  }

  private configButton() {
    let buttonOpacity = this.properties.useButton ? 1 : 0;
    this.nextBtn.style.opacity = buttonOpacity;
    this.prevBtn.style.opacity = buttonOpacity;
  }

  private configAutoPlay() {
    if (this.properties.autoPlay) {
      this.swiper.autoplay.start();
    } else {
      this.swiper.autoplay.stop();
    }
  }

  public render(swiperData): void {
    this.container.style.opacity = this.isMock ? '0.5' : '1';
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
    this.configSwiper();
    this.swiper = new Swiper(".swiper-container", this.swiperOptions);
    this.swiper.removeAllSlides();
    const slides = this.prepareSlides(swiperData);
    this.swiper.appendSlide(slides);
    this.swiperContainer.addEventListener('click', (event) => {
      this.selectionManager.clear();
      // @ts-ignore
      if(event.target.nodeName.toLowerCase() === "img" && /^selection-\d/.test(event.target.id)) {
        // @ts-ignore
        const sidIndex = parseInt(event.target.id.match(/\d+/g)[0]);
        const sid = this.selectionIds[sidIndex];
        this.selectionManager.select(sid);
        if(this.properties.clickLeftMouse === "showToolTip") {
          this.visualHost.toolTipService.show({
            position: {
              // @ts-ignore
              x: event.x,
              // @ts-ignore
              y: event.y,
            },
            selected: this.selectionManager.getSelectionIds(),
            menu: true
          });
        } else {
          this.visualHost.commandService.execute([{
            name: this.properties.clickLeftMouse,
            payload: {
              selectionIds: sid,
              position: {
                // @ts-ignore
                x: event.x,
                // @ts-ignore
                y: event.y,
              }
            }
          }])
        }
      }
    });
    this.configButton()
    this.configAutoPlay()
    this.swiper.update();
  }

  public onResize() {
    if (this.swiper) {
      this.swiper.updateSize();
      this.swiper.update();
    }
  }

  public onDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    let hiddenStates = [];
    if (!options.properties.autoPlay) {
      hiddenStates.push('delay');
    }
    return hiddenStates;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}
