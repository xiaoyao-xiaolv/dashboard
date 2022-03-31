import '../style/visual.less';
import { build } from './bot';
interface IActions {
  type: string;
  color: string;
}
interface IPropSetting{
  color: string
  section: number
  sectionMax: number
}

const UPDATE_ALL = 'update-all';
const UPDATE_EYE = 'update-eye';
const UPDATE_BELLY = 'update-belly';
const RESTORE_ALL = 'restore-all';
const RESTORE_EYE = 'restore-eye';
const RESTORE_BELLY = 'restore-belly';

export default class Visual extends WynVisual {
  private eyeList = new Array<string>();
  private bellyList = new Array<string>();
  private defaultColor: string = "#5af3ff";
  private content:HTMLDivElement;
  private actions:IActions = {type:'default',color:this.defaultColor}; 
  
  private reducer = (action:IActions)=>{
    switch (action.type) {
      case UPDATE_ALL:
        return { ids:this.bellyList.concat(this.eyeList) , color :action.color}
      case UPDATE_EYE:
        return { ids:this.eyeList , color :action.color}
      case UPDATE_BELLY:
        return { ids:this.bellyList , color :action.color}
      case RESTORE_ALL:
        return { ids:this.bellyList.concat(this.eyeList) , color :this.defaultColor}
      case RESTORE_EYE:
        return { ids:this.eyeList , color :this.defaultColor}
      case RESTORE_BELLY:
        return { ids:this.bellyList, color :this.defaultColor}
      default:
        return null
    }
  }

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.content = dom;
    this.eyeList = ["ept8g70ozks82","ept8g70ozks81"]
    this.bellyList = ["ept8g70ozks67","ept8g70ozks68","ept8g70ozks69"];
    dom.innerHTML = `<svg id="ept8g70ozks1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 200 130" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" preserveAspectRatio="xMinYMin meet" >
    <defs>
        <clipPath id="ept8g70ozks2">
            <rect id="ept8g70ozks3" width="280" height="106.110000" rx="0" ry="0" stroke="none" stroke-width="1"/>
        </clipPath>
        <radialGradient id="ept8g70ozks15-fill" cx="-29.165202" cy="98.615406" r="35.600000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks15-fill-0" offset="0%" stop-color="rgba(0,0,0,0.3)"/>
            <stop id="ept8g70ozks15-fill-1" offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks16-fill" cx="-29.165202" cy="98.615406" r="35.600000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks16-fill-0" offset="0%" stop-color="rgba(0,0,0,0.3)"/>
            <stop id="ept8g70ozks16-fill-1" offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks18-fill" cx="51.119487" cy="82.350999" r="35.600000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks18-fill-0" offset="0%" stop-color="rgba(0,0,0,0.6)"/>
            <stop id="ept8g70ozks18-fill-1" offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks19-fill" cx="79.436175" cy="84.195395" r="35.600000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks19-fill-0" offset="0%" stop-color="rgba(0,0,0,0.6)"/>
            <stop id="ept8g70ozks19-fill-1" offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks22-fill" cx="0" cy="0" r="18.990000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks22-fill-0" offset="0%" stop-color="rgb(62,76,104)"/>
            <stop id="ept8g70ozks22-fill-1" offset="100%" stop-color="rgba(230,250,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks24-fill" cx="0" cy="0" r="18.990000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks24-fill-0" offset="0%" stop-color="rgb(0,0,0)"/>
            <stop id="ept8g70ozks24-fill-1" offset="100%" stop-color="rgba(230,250,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks26-fill" cx="0" cy="0" r="18.990000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks26-fill-0" offset="0%" stop-color="rgb(62,76,104)"/>
            <stop id="ept8g70ozks26-fill-1" offset="100%" stop-color="rgba(230,250,255,0)"/>
        </radialGradient>
        <linearGradient id="ept8g70ozks30-fill" x1="128.019976" y1="90.100000" x2="111.029976" y2="97.140000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks30-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks30-fill-1" offset="67%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks30-fill-2" offset="100%" stop-color="rgb(99,144,184)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks30-stroke" x1="116.990000" y1="112.060000" x2="116.990000" y2="75.020000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks30-stroke-0" offset="18%" stop-color="rgb(98,143,183)"/>
            <stop id="ept8g70ozks30-stroke-1" offset="100%" stop-color="rgb(207,222,239)"/>
        </linearGradient>
        <radialGradient id="ept8g70ozks31-fill" cx="117.869976" cy="93.540000" r="13.100000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks31-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks31-fill-1" offset="100%" stop-color="rgba(255,255,255,0.3)"/>
        </radialGradient>
        <linearGradient id="ept8g70ozks32-fill" x1="120.419976" y1="111.700000" x2="120.419976" y2="75.370000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks32-fill-0" offset="0%" stop-color="rgb(154,183,209)"/>
            <stop id="ept8g70ozks32-fill-1" offset="29%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks32-fill-2" offset="87%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks32-fill-3" offset="100%" stop-color="rgb(223,232,241)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks32-stroke" x1="120.420000" y1="112.060000" x2="120.420000" y2="75.020000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks32-stroke-0" offset="0%" stop-color="rgb(98,143,183)"/>
            <stop id="ept8g70ozks32-stroke-1" offset="67%" stop-color="rgb(203,218,233)"/>
            <stop id="ept8g70ozks32-stroke-2" offset="100%" stop-color="rgb(209,222,240)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks44-fill" x1="128.019976" y1="90.100000" x2="111.029976" y2="97.140000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks44-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks44-fill-1" offset="67%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks44-fill-2" offset="100%" stop-color="rgb(99,144,184)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks44-stroke" x1="116.990000" y1="112.060000" x2="116.990000" y2="75.020000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks44-stroke-0" offset="18%" stop-color="rgb(98,143,183)"/>
            <stop id="ept8g70ozks44-stroke-1" offset="100%" stop-color="rgb(207,222,239)"/>
        </linearGradient>
        <radialGradient id="ept8g70ozks45-fill" cx="117.869976" cy="93.540000" r="13.100000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks45-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks45-fill-1" offset="100%" stop-color="rgba(255,255,255,0.3)"/>
        </radialGradient>
        <linearGradient id="ept8g70ozks46-fill" x1="120.419976" y1="111.700000" x2="120.419976" y2="75.370000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks46-fill-0" offset="0%" stop-color="rgb(154,183,209)"/>
            <stop id="ept8g70ozks46-fill-1" offset="29%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks46-fill-2" offset="87%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks46-fill-3" offset="100%" stop-color="rgb(223,232,241)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks46-stroke" x1="120.420000" y1="112.060000" x2="120.420000" y2="75.020000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks46-stroke-0" offset="0%" stop-color="rgb(98,143,183)"/>
            <stop id="ept8g70ozks46-stroke-1" offset="67%" stop-color="rgb(203,218,233)"/>
            <stop id="ept8g70ozks46-stroke-2" offset="100%" stop-color="rgb(209,222,240)"/>
        </linearGradient>
        <radialGradient id="ept8g70ozks56-fill" cx="140.110000" cy="91.450000" r="32.460000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks56-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks56-fill-1" offset="36%" stop-color="rgb(245,248,251)"/>
            <stop id="ept8g70ozks56-fill-2" offset="67%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks56-fill-3" offset="100%" stop-color="rgb(99,144,184)"/>
        </radialGradient>
        <linearGradient id="ept8g70ozks56-stroke" x1="140" y1="122" x2="140" y2="65.080000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks56-stroke-0" offset="0%" stop-color="rgb(99,144,184)"/>
            <stop id="ept8g70ozks56-stroke-1" offset="100%" stop-color="rgb(207,222,239)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks60-fill" x1="140" y1="109.120000" x2="140" y2="96.320000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks60-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks60-fill-1" offset="36%" stop-color="rgb(245,248,251)"/>
            <stop id="ept8g70ozks60-fill-2" offset="67%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks60-fill-3" offset="100%" stop-color="rgb(154,183,209)"/>
        </linearGradient>
        <radialGradient id="ept8g70ozks65-fill" cx="140.240000" cy="96.080000" r="18.500000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks65-fill-0" offset="0%" stop-color="rgb(29,88,150)"/>
            <stop id="ept8g70ozks65-fill-1" offset="16%" stop-color="rgb(24,78,137)"/>
            <stop id="ept8g70ozks65-fill-2" offset="47%" stop-color="rgb(12,53,101)"/>
            <stop id="ept8g70ozks65-fill-3" offset="88%" stop-color="rgb(0,13,45)"/>
            <stop id="ept8g70ozks65-fill-4" offset="100%" stop-color="rgb(0,0,27)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks71-fill" cx="0" cy="0" r="18.990000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks71-fill-0" offset="28%" stop-color="rgb(62,76,104)"/>
            <stop id="ept8g70ozks71-fill-1" offset="43%" stop-color="rgba(37,71,112,0.5)"/>
            <stop id="ept8g70ozks71-fill-2" offset="69%" stop-color="rgba(76,107,151,0.2)"/>
            <stop id="ept8g70ozks71-fill-3" offset="100%" stop-color="rgba(230,250,255,0)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks72-fill" cx="142.389976" cy="61.640000" r="55.740000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks72-fill-0" offset="0%" stop-color="rgb(25,66,114)"/>
            <stop id="ept8g70ozks72-fill-1" offset="100%" stop-color="rgb(0,13,40)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks73-fill" cx="140.099976" cy="54.390000" r="33.350000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks73-fill-0" offset="0%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks73-fill-1" offset="26%" stop-color="rgb(247,249,252)"/>
            <stop id="ept8g70ozks73-fill-2" offset="67%" stop-color="rgb(208,221,235)"/>
            <stop id="ept8g70ozks73-fill-3" offset="100%" stop-color="rgb(143,175,204)"/>
        </radialGradient>
        <linearGradient id="ept8g70ozks74-stroke" x1="110.520000" y1="47.400000" x2="169.480000" y2="47.400000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks74-stroke-0" offset="0%" stop-color="rgb(232,238,245)"/>
            <stop id="ept8g70ozks74-stroke-1" offset="40%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks74-stroke-2" offset="60%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks74-stroke-3" offset="100%" stop-color="rgb(232,238,245)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks75-stroke" x1="170.660215" y1="48.570000" x2="109.350215" y2="48.570000"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks75-stroke-0" offset="1%" stop-color="rgb(180,199,220)"/>
            <stop id="ept8g70ozks75-stroke-1" offset="10%" stop-color="rgb(37,91,150)"/>
            <stop id="ept8g70ozks75-stroke-2" offset="50%" stop-color="rgb(215,225,236)"/>
            <stop id="ept8g70ozks75-stroke-3" offset="90%" stop-color="rgb(37,91,150)"/>
            <stop id="ept8g70ozks75-stroke-4" offset="99%" stop-color="rgb(180,199,220)"/>
        </linearGradient>
        <linearGradient id="ept8g70ozks77-fill" x1="140.010013" y1="75.307799" x2="140.010013" y2="55.142399"
                        spreadMethod="pad" gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks77-fill-0" offset="18%" stop-color="rgb(255,255,255)"/>
            <stop id="ept8g70ozks77-fill-1" offset="57%" stop-color="rgb(214,225,238)"/>
        </linearGradient>
        <radialGradient id="ept8g70ozks78-fill" cx="140" cy="58.700000" r="40.760000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks78-fill-0" offset="0%" stop-color="rgb(29,88,150)"/>
            <stop id="ept8g70ozks78-fill-1" offset="16%" stop-color="rgb(24,78,137)"/>
            <stop id="ept8g70ozks78-fill-2" offset="47%" stop-color="rgb(12,53,101)"/>
            <stop id="ept8g70ozks78-fill-3" offset="88%" stop-color="rgb(0,13,45)"/>
            <stop id="ept8g70ozks78-fill-4" offset="100%" stop-color="rgb(0,0,27)"/>
        </radialGradient>
        <radialGradient id="ept8g70ozks79-fill" cx="139.279210" cy="60.207006" r="40.880000" spreadMethod="pad"
                        gradientUnits="userSpaceOnUse">
            <stop id="ept8g70ozks79-fill-0" offset="0%" stop-color="rgb(42,101,163)"/>
            <stop id="ept8g70ozks79-fill-1" offset="51%" stop-color="rgb(25,66,114)"/>
            <stop id="ept8g70ozks79-fill-2" offset="100%" stop-color="rgb(0,13,40)"/>
        </radialGradient>
    </defs>
    <g id="ept8g70ozks4" transform="matrix(1 0 0 1 -39.81276703000000 0)" opacity="0">
        <polygon id="ept8g70ozks5"
                 points="60.960000,70.610000 69.440000,75.510000 60.960000,80.400000 60.960000,70.610000"
                 transform="matrix(1 0 0 1 0.01999999999991 37.76932570000011)" fill="none" stroke="rgb(154,177,235)"
                 stroke-width="1.248880" stroke-miterlimit="10"/>
        <circle id="ept8g70ozks6" r="3.750000" transform="matrix(1 0 0 1 82.08999999999990 113.27432570000011)"
                fill="none" stroke="rgb(0,85,198)" stroke-width="1.248880" stroke-miterlimit="10"/>
        <rect id="ept8g70ozks7" width="8.790000" height="8.790000" rx="0" ry="0"
              transform="matrix(1 0 0 1 78.59296622499991 108.87932570000011)" fill="none" stroke="rgb(0,85,198)"
              stroke-width="1.248880" stroke-miterlimit="10"/>
        <path id="ept8g70ozks8" d="M45.790000,88.410000L55,97.570000M45.840000,97.570000L55,88.410000"
              transform="matrix(1 0 0 1 0.01999999999991 20.28432570000011)" fill="none" stroke="rgb(91,120,175)"
              stroke-width="1.248880" stroke-miterlimit="10"/>
        <polygon id="ept8g70ozks9"
                 points="198.800000,87.420000 195.380000,96.600000 205.040000,94.960000 198.800000,87.420000"
                 transform="matrix(1 0 0 1 0.01999999999990 21.26432570000011)" fill="none" stroke="rgb(0,85,198)"
                 stroke-width="1.248880" stroke-miterlimit="10"/>
        <circle id="ept8g70ozks10" r="4.880000" transform="matrix(1 0 0 1 229.34999999999991 113.27432570000012)"
                fill="none" stroke="rgb(91,120,175)" stroke-width="1.248880" stroke-miterlimit="10"/>
        <path id="ept8g70ozks11"
              d="M198.410000,53.560000L200.200000,61.240000M203.200000,56.510000L195.510000,58.300000"
              transform="matrix(1 0 0 1 5.64500000000001 55.87432570000010)" fill="none" stroke="rgb(0,85,198)"
              stroke-width="1.248880" stroke-miterlimit="10"/>
        <polygon id="ept8g70ozks12"
                 points="215.530000,79 209.370000,77.240000 209.130000,70.830000 215.150000,68.630000 219.110000,73.680000 215.530000,79"
                 transform="matrix(1 0 0 1 0.01999999999990 39.45932570000011)" fill="none" stroke="rgb(154,177,235)"
                 stroke-width="1.248880" stroke-miterlimit="10"/>
    </g>
    
    <g id="ept8g70ozks14" transform="matrix(1 0 0 1 -39.99999999500000 -1.88000488000001)">
        <ellipse id="ept8g70ozks15" rx="49.050000" ry="9.020000" transform="matrix(1 0 0 1 140 121.81000000000000)"
                 fill="url(#ept8g70ozks15-fill)" stroke="none" stroke-width="1"/>
        <ellipse id="ept8g70ozks16" rx="49.050000" ry="9.020000" transform="matrix(1 0 0 1 140 121.81000000000000)"
                 fill="url(#ept8g70ozks16-fill)" stroke="none" stroke-width="1"/>
        <g id="ept8g70ozks17">
            <ellipse id="ept8g70ozks18" rx="21.680000" ry="12.130000"
                     transform="matrix(1 0 0 1 109.79000000000001 119.75000000000000)" opacity="0.8"
                     fill="url(#ept8g70ozks18-fill)" stroke="none" stroke-width="1"/>
            <ellipse id="ept8g70ozks19" rx="21.680000" ry="12.130000"
                     transform="matrix(1 0 0 1 170.21000000000001 119.75000000000000)" opacity="0.8"
                     fill="url(#ept8g70ozks19-fill)" stroke="none" stroke-width="1"/>
        </g>
    </g>
    <g id="ept8g70ozks20" transform="matrix(1 0 0 1 -39.99881963999999 -6.88000487999997)">
        <g id="ept8g70ozks21" transform="matrix(1 0 0 1 0.02004623500002 5.26162099999999)">
            <circle id="ept8g70ozks22" r="18.990000"
                    transform="matrix(1.56948565625453 0 0 0.58053321209110 139.99999999999986 114.27432569999989)"
                    fill="url(#ept8g70ozks22-fill)" stroke="none" stroke-width="1"/>
            <g id="ept8g70ozks23">
                <circle id="ept8g70ozks24" r="18.990000"
                        transform="matrix(0.92439651255655 0 0 0.34192276593399 139.99999999999986 113.27432569999989)"
                        opacity="0.2" fill="url(#ept8g70ozks24-fill)" stroke="none" stroke-width="1"/>
            </g>
            <g id="ept8g70ozks25" transform="matrix(-1 0 0 1 279.95990992000003 0)">
                <circle id="ept8g70ozks26" r="18.990000"
                        transform="matrix(0.92439651255655 0 0 0.34192276593399 139.99999999999986 113.27432569999989)"
                        opacity="0.2" fill="url(#ept8g70ozks26-fill)" stroke="none" stroke-width="1"/>
            </g>
        </g>
        <g id="ept8g70ozks27" transform="matrix(-1 0 0 1 279.95990992000003 0)">
            <g id="ept8g70ozks28">
                <rect id="ept8g70ozks29" width="18.330000" height="8.530000" rx="0" ry="0"
                      transform="matrix(-1 0 -0 -1 132.47000000000000 97.81000000000003)" fill="rgb(62,76,104)"
                      stroke="none" stroke-width="1"/>
                <path id="ept8g70ozks30"
                      d="M118.530000,111.730000C109.624923,101.238168,109.624923,85.841832,118.530000,75.350000L122.120000,75.850000L122.120000,111.230000Z"
                      fill="url(#ept8g70ozks30-fill)" stroke="url(#ept8g70ozks44-stroke)" stroke-width="0.623000"
                      stroke-miterlimit="10"/>
                <path id="ept8g70ozks31"
                      d="M117.350000,110.750000L117.350000,76.330000C117.690000,75.880000,118.030000,75.440000,118.400000,75.020000L118.400000,112.020000C118,111.640000,117.690000,111.190000,117.350000,110.750000Z"
                      opacity="0.5" fill="url(#ept8g70ozks31-fill)" stroke="none" stroke-width="1"/>
                <polygon id="ept8g70ozks32"
                         points="118.710000,75.370000 122.120000,75.850000 122.120000,111.230000 118.710000,111.700000 118.710000,75.370000"
                         fill="url(#ept8g70ozks32-fill)" stroke="url(#ept8g70ozks32-stroke)" stroke-width="0.623000"
                         stroke-miterlimit="10"/>
                <g id="ept8g70ozks33" transform="matrix(0.75000000000000 0 0 1 28.58164458874991 0)">
                    <line id="ept8g70ozks34" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.53492528984002 0.73435501653487 -0.80829138936624 0.58878266777852 128.92349859343065 -38.60673756427549)"
                          opacity="0.9025641025641026" fill="none" stroke="rgb(106,138,174)" stroke-width="1"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <line id="ept8g70ozks35" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.59984959896268 -0.01343348891048 0.02238914818413 0.99974933160447 43.84847741392080 1.57246432526348)"
                          opacity="0.8" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks36" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.49548395817173 -0.74845698716346 0.83383911452192 0.55200754622858 -20.22044678304937 120.63427048538088)"
                          opacity="0.6974358974358974" fill="none" stroke="rgb(106,138,174)" stroke-width="1"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <line id="ept8g70ozks37" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks38" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks39" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks40" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </g>
            </g>
        </g>
        <g id="ept8g70ozks41">
            <g id="ept8g70ozks42">
                <rect id="ept8g70ozks43" width="18.330000" height="8.530000" rx="0" ry="0"
                      transform="matrix(-1 0 -0 -1 132.47000000000000 97.81000000000003)" fill="rgb(62,76,104)"
                      stroke="none" stroke-width="1"/>
                <path id="ept8g70ozks44"
                      d="M118.530000,111.730000C109.624923,101.238168,109.624923,85.841832,118.530000,75.350000L122.120000,75.850000L122.120000,111.230000Z"
                      fill="url(#ept8g70ozks44-fill)" stroke="url(#ept8g70ozks44-stroke)" stroke-width="0.623000"
                      stroke-miterlimit="10"/>
                <path id="ept8g70ozks45"
                      d="M117.350000,110.750000L117.350000,76.330000C117.690000,75.880000,118.030000,75.440000,118.400000,75.020000L118.400000,112.020000C118,111.640000,117.690000,111.190000,117.350000,110.750000Z"
                      opacity="0.5" fill="url(#ept8g70ozks45-fill)" stroke="none" stroke-width="1"/>
                <polygon id="ept8g70ozks46"
                         points="118.710000,75.370000 122.120000,75.850000 122.120000,111.230000 118.710000,111.700000 118.710000,75.370000"
                         fill="url(#ept8g70ozks46-fill)" stroke="url(#ept8g70ozks46-stroke)" stroke-width="0.623000"
                         stroke-miterlimit="10"/>
                <g id="ept8g70ozks47" transform="matrix(0.75000000000000 0 0 1 28.58164458874991 0)">
                    <line id="ept8g70ozks48" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.53492528984002 0.73435501653487 -0.80829138936624 0.58878266777852 128.92349859343065 -38.60673756427549)"
                          opacity="0.9025641025641026" fill="none" stroke="rgb(106,138,174)" stroke-width="1"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <line id="ept8g70ozks49" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.59984959896268 -0.01343348891048 0.02238914818413 0.99974933160447 43.84847741392080 1.57246432526348)"
                          opacity="0.8" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks50" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.49548395817173 -0.74845698716346 0.83383911452192 0.55200754622858 -20.22044678304937 120.63427048538088)"
                          opacity="0.6974358974358974" fill="none" stroke="rgb(106,138,174)" stroke-width="1"
                          stroke-linecap="round" stroke-linejoin="round"/>
                    <line id="ept8g70ozks51" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks52" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks53" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                    <line id="ept8g70ozks54" x1="113.820000" y1="93.540000" x2="116.450000" y2="93.540000"
                          transform="matrix(0.34202014332567 -0.93969262078591 0.93969262078591 0.34202014332567 -13.71601718944154 160.30427681593821)"
                          opacity="0" fill="none" stroke="rgb(106,138,174)" stroke-width="1" stroke-linecap="round"
                          stroke-linejoin="round"/>
                </g>
            </g>
        </g>
        <g id="ept8g70ozks55">
            <path id="ept8g70ozks56"
                  d="M140,121.690000C131.833466,121.702320,124.064387,118.166276,118.710000,112L118.710000,75.130000C124.055276,68.945491,131.825642,65.390965,140,65.390965C148.174358,65.390965,155.944724,68.945491,161.290000,75.130000L161.290000,112C155.935613,118.166276,148.166534,121.702320,140,121.690000Z"
                  fill="url(#ept8g70ozks56-fill)" stroke="url(#ept8g70ozks56-stroke)" stroke-width="0.623000"
                  stroke-miterlimit="10"/>
            <g id="ept8g70ozks57">
                <g id="ept8g70ozks58">
                    <g id="ept8g70ozks59">
                        <path id="ept8g70ozks60"
                              d="M147.670000,96.330000C142.611556,97.356552,137.398444,97.356552,132.340000,96.330000C130.710000,96.140000,126.960000,99.150000,126.070000,100.830000L126.070000,102.920000C127.011709,104.715066,128.303853,106.303043,129.870000,107.590000C131.080000,108.590000,135.220000,109.120000,140,109.120000C144.780000,109.120000,148.930000,108.560000,150.140000,107.590000C151.706147,106.303043,152.998291,104.715066,153.940000,102.920000L153.940000,100.830000C153.050000,99.150000,149.300000,96.140000,147.670000,96.330000Z"
                              fill="url(#ept8g70ozks60-fill)" fill-rule="evenodd" stroke="none" stroke-width="1"/>
                    </g>
                    <path id="ept8g70ozks61" style="mix-blend-mode:multiply"
                          d="M161.600000,100.100000C160.720000,100.790000,156.600000,101.750000,153.940000,101.900000L153.270000,101.250000L153.270000,100.170000L153.940000,100.830000C156.630000,100.680000,160.720000,99.720000,161.600000,99.030000Z"
                          opacity="0.5" fill="rgb(37,91,150)" fill-rule="evenodd" stroke="none" stroke-width="1"/>
                    <path id="ept8g70ozks62"
                          d="M161.600000,101.120000C160.720000,101.810000,156.600000,102.770000,153.940000,102.920000L153.270000,102.270000L153.270000,101.270000L153.940000,101.920000C156.620000,101.770000,160.720000,100.810000,161.600000,100.120000Z"
                          opacity="0.5" fill="rgb(255,255,255)" fill-rule="evenodd" stroke="none" stroke-width="1"/>
                    <path id="ept8g70ozks63" style="mix-blend-mode:multiply"
                          d="M118.410000,100.100000C119.290000,100.790000,123.410000,101.750000,126.070000,101.900000L126.740000,101.250000L126.740000,100.170000L126.070000,100.830000C123.380000,100.680000,119.290000,99.720000,118.410000,99.030000Z"
                          opacity="0.5" fill="rgb(37,91,150)" fill-rule="evenodd" stroke="none" stroke-width="1"/>
                    <path id="ept8g70ozks64"
                          d="M118.410000,101.120000C119.290000,101.810000,123.410000,102.770000,126.070000,102.920000L126.740000,102.270000L126.740000,101.270000L126.070000,101.920000C123.390000,101.770000,119.290000,100.810000,118.410000,100.120000Z"
                          opacity="0.5" fill="rgb(255,255,255)" fill-rule="evenodd" stroke="none" stroke-width="1"/>
                </g>
                <path id="ept8g70ozks65"
                      d="M147.610000,96.330000C142.580528,97.236591,137.429472,97.236591,132.400000,96.330000C130.850000,96.170000,127.400000,98.980000,126.740000,100.180000L126.740000,102.270000C127.653165,103.839073,128.882498,105.201215,130.350000,106.270000C131.510000,107.130000,135.450000,107.630000,140,107.630000C144.550000,107.630000,148.500000,107.130000,149.660000,106.270000C151.127502,105.201215,152.356835,103.839073,153.270000,102.270000L153.270000,100.180000C152.610000,99,149.160000,96.170000,147.610000,96.330000Z"
                      fill="url(#ept8g70ozks65-fill)" fill-rule="evenodd" stroke="none" stroke-width="1"/>
                <g id="ept8g70ozks66">
                    <circle id="ept8g70ozks67" r="1.380000"
                            transform="matrix(0.50000000000000 0 0 0.50000000000000 146.63999999999999 101.97000000000000)"
                            opacity="0.2" fill="rgb(90,243,255)" stroke="none" stroke-width="1"/>
                    <circle id="ept8g70ozks68" r="1.380000"
                            transform="matrix(0.50000000000000 0 0 0.50000000000000 133.37000000000000 101.97000000000000)"
                            opacity="0.2" fill="rgb(90,243,255)" stroke="none" stroke-width="1"/>
                    <circle id="ept8g70ozks69" r="1.380000"
                            transform="matrix(0.50000000000000 0 0 0.50000000000000 140 102.22999999999999)"
                            opacity="0.2" fill="rgb(90,243,255)" stroke="none" stroke-width="1"/>
                </g>
                <foreignObject xmlns="http://www.w3.org/2000/svg" height="30" width="170" x="120" y="96">
                    <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 8px;color: red;">温度：100°</div>
                </foreignObject>
            </g>
            <g id="ept8g70ozks70" transform="matrix(1 0 0 1 0 3.00000000000001)">
                <circle id="ept8g70ozks71" r="18.990000"
                        transform="matrix(1.56948565625453 0 0 0.58053321209110 140 80.08852819499988)"
                        fill="url(#ept8g70ozks71-fill)" stroke="none" stroke-width="1"/>
                <path id="ept8g70ozks72"
                      d="M168.890000,60.100000C168.890000,60.100000,173.970000,61.250000,173.310000,64.770000C172.650000,68.290000,167.440000,67.060000,167.440000,67.060000L112.560000,67.060000C112.560000,67.060000,107.350000,68.290000,106.690000,64.770000C106.030000,61.250000,111.110000,60.100000,111.110000,60.100000Z"
                      fill="url(#ept8g70ozks72-fill)" stroke="none" stroke-width="1"/>
                <path id="ept8g70ozks73"
                      d="M140,84.850000C126.110000,84.850000,115.450000,77.210000,112.110000,69.670000C108.680000,61.920000,109.110000,56.080000,109.190000,55.440000C111.340000,42.910000,123.430000,34.810000,140,34.810000C156.570000,34.810000,168.660000,42.910000,170.810000,55.450000C170.870000,56.080000,171.320000,61.920000,167.890000,69.670000C164.550000,77.210000,153.890000,84.850000,140,84.850000Z"
                      fill="url(#ept8g70ozks73-fill)" stroke="rgb(180,199,220)" stroke-width="0.622674"
                      stroke-miterlimit="10"/>
                <path id="ept8g70ozks74"
                      d="M169.170000,51.520000C169.170000,51.520000,165.070000,43.280000,140,43.280000C114.930000,43.280000,110.830000,51.520000,110.830000,51.520000"
                      transform="matrix(1 0 0 0.84047997367567 0 8.53550290902640)" fill="none"
                      stroke="url(#ept8g70ozks74-stroke)" stroke-width="0.622674" stroke-linecap="round"
                      stroke-linejoin="round"/>
                <path id="ept8g70ozks75"
                      d="M170.370000,53.460000C170.370000,53.460000,166.370000,43.880000,140,43.880000C113.630000,43.880000,109.630000,53.460000,109.630000,53.460000"
                      transform="matrix(1 0 0 0.84047997367567 0 8.53134508370064)" fill="none"
                      stroke="url(#ept8g70ozks75-stroke)" stroke-width="0.622674" stroke-miterlimit="10"/>
                <g id="ept8g70ozks76" transform="matrix(1 0 0 1 0 2)">
                    <path id="ept8g70ozks77"
                          d="M140,70.770000C136.380000,70.770000,135,74.370000,128.800000,75.060000C120.950000,75.920000,114.430000,70.370000,114.430000,63.860000C114.291421,59.254399,117.831403,55.369268,122.430000,55.080000C127.780000,54.730000,133.990000,56.080000,139.950000,56.080000C145.910000,56.080000,152.130000,54.720000,157.480000,55.080000C162.098426,55.343378,165.667507,59.236114,165.530000,63.860000C165.530000,70.370000,159.010000,75.920000,151.160000,75.060000C145,74.370000,143.630000,70.770000,140,70.770000Z"
                          fill="url(#ept8g70ozks77-fill)" stroke="none" stroke-width="1"/>
                    <path id="ept8g70ozks78"
                          d="M140,56.750000C133.150000,56.750000,131.620000,55.950000,123.240000,55.950000C121.010862,56.016528,118.903344,56.981601,117.396645,58.625786C115.889947,60.269971,115.112111,62.453539,115.240000,64.680000C115.730000,69.390000,120.860000,74.020000,126.900000,74.200000C132.940000,74.380000,135,69.480000,140,69.480000C145,69.480000,147.100000,74.380000,153.140000,74.200000C159.180000,74.020000,164.310000,69.390000,164.800000,64.680000C164.927889,62.453539,164.150053,60.269971,162.643355,58.625786C161.136656,56.981601,159.029138,56.016528,156.800000,55.950000C148.390000,56,146.860000,56.750000,140,56.750000Z"
                          fill="url(#ept8g70ozks78-fill)" stroke="none" stroke-width="1"/>
                    <path id="ept8g70ozks79"
                          d="M140,58.280000C133.330000,58.280000,131.850000,57.380000,123.690000,57.380000C119.380000,57.380000,115.330000,61.300000,115.770000,65.380000C116.210000,69.460000,120.770000,73.580000,126.630000,73.740000C132.490000,73.900000,134.440000,69.090000,140,69.090000C145.560000,69.090000,147.500000,73.900000,153.380000,73.740000C159.260000,73.580000,163.780000,69.600000,164.240000,65.380000C164.700000,61.160000,160.630000,57.380000,156.320000,57.380000C148.160000,57.380000,146.680000,58.280000,140,58.280000Z"
                          fill="url(#ept8g70ozks79-fill)" stroke="none" stroke-width="1"/>
                    <g id="ept8g70ozks80">
                        <path id="ept8g70ozks81"
                              d="M-2.300000,0C-2.300000,-1.270255,-1.270255,-2.300000,0,-2.300000C1.270255,-2.300000,2.300000,-1.270255,2.300000,0C2.300000,1.270255,1.270255,2.300000,0,2.300000C-1.270255,2.300000,-2.300000,1.270255,-2.300000,0Z"
                              transform="matrix(1 0 0 1 153.78999999999999 65.21056699999995)" fill="rgb(90,243,255)"
                              stroke="none" stroke-width="1"/>
                        <path id="ept8g70ozks82"
                              d="M-2.300000,0C-2.300000,-1.270255,-1.270255,-2.300000,0,-2.300000C1.270255,-2.300000,2.300000,-1.270255,2.300000,0C2.300000,1.270255,1.270255,2.300000,0,2.300000C-1.270255,2.300000,-2.300000,1.270255,-2.300000,0Z"
                              transform="matrix(1 0 0 1 127.12000000000000 65.21056699999995)" fill="rgb(90,243,255)"
                              stroke="none" stroke-width="1"/>
                    </g>
                </g>
            </g>
        </g>
    </g>
   </svg>
`;
    build({
      "root": "ept8g70ozks1",
      "animations": [{
        "duration": 10000, "direction": 1, "iterations": 0, "fill": 1, "alternate": false, "elements": {
          "ept8g70ozks4": {
            "opacity": [{"t": 400, "v": 0, "e": [0.705, 0, 1, 1]}, {"t": 2200, "v": 1}, {
              "t": 6900,
              "v": 1
            }, {"t": 8600, "v": 0}]
          },
          "ept8g70ozks5": {
            "transform": {
              "data": {"t": {"x": -65.2, "y": -75.505}}, "keys": {
                "o": [{
                  "t": 1000,
                  "v": {"x": 65.21999999999991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 2800,
                  "v": {"x": 65.24870496000015, "y": 26.527499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 3000,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 4800,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 5000,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 6800,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 7000,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 8800, "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"}, "e": [1, 0]}],
                "r": [{"t": 1000, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2800, "v": 180, "e": [1, 0]}, {
                  "t": 3000,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4800, "v": 180, "e": [1, 0]}, {"t": 5000, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6800,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 7000, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8800, "v": 180, "e": [1, 0]}],
                "s": [{"t": 1000, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 2800,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 3000, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 4800,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 5000, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6800,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 7000, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 8800,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }]
              }
            },
            "opacity": [{"t": 1000, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2800, "v": 0, "e": [1, 0]}, {
              "t": 3000,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 4800, "v": 0, "e": [1, 0]}, {"t": 5000, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {
              "t": 6800,
              "v": 0,
              "e": [1, 0]
            }, {"t": 7000, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8800, "v": 0, "e": [1, 0]}]
          },
          "ept8g70ozks6": {
            "transform": {
              "keys": {
                "o": [{
                  "t": 400,
                  "v": {"x": 82.0899999999999, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 2200, "v": {"x": 82.11870496000014, "y": 25.955, "type": "corner"}, "e": [1, 0]}, {
                  "t": 2400,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 4200,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 4400,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 6200,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 6400,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 8200, "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"}, "e": [1, 0]}],
                "r": [{"t": 400, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2200, "v": 180, "e": [1, 0]}, {
                  "t": 2400,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4200, "v": 180, "e": [1, 0]}, {"t": 4400, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6200,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 6400, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8200, "v": 180, "e": [1, 0]}],
                "s": [{"t": 400, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 2200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 2400, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 4200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 4400, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 6400, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 8200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }]
              }
            },
            "opacity": [{"t": 400, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2200, "v": 0, "e": [1, 0]}, {
              "t": 2400,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 4200, "v": 0, "e": [1, 0]}, {"t": 4400, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {
              "t": 6200,
              "v": 0,
              "e": [1, 0]
            }, {"t": 6400, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8200, "v": 0, "e": [1, 0]}]
          },
          "ept8g70ozks7": {
            "transform": {
              "data": {"t": {"x": -4.394999999999996, "y": -4.394999999999996}}, "keys": {
                "o": [{
                  "t": 1700,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 3500,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 3700,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 5500,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 5700,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 7500,
                  "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 7700,
                  "v": {"x": 82.98796622499991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 9500, "v": {"x": 83.01667118500015, "y": 26.277499999999996, "type": "corner"}, "e": [1, 0]}],
                "r": [{"t": 1700, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 3500, "v": 180, "e": [1, 0]}, {
                  "t": 3700,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 5500, "v": 180, "e": [1, 0]}, {"t": 5700, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 7500,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 7700, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 9500, "v": 180, "e": [1, 0]}],
                "s": [{"t": 1700, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 3500,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 3700, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 5500,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 5700, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 7500,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 7700, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 9500,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }]
              }
            },
            "opacity": [{"t": 1700, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 3500, "v": 0, "e": [1, 0]}, {
              "t": 3700,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 5500, "v": 0, "e": [1, 0]}, {"t": 5700, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {
              "t": 7500,
              "v": 0,
              "e": [1, 0]
            }, {"t": 7700, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 9500, "v": 0, "e": [1, 0]}]
          },
          "ept8g70ozks8": {
            "transform": {
              "data": {"t": {"x": -50.394999999999996, "y": -92.99}}, "keys": {
                "o": [{
                  "t": 600,
                  "v": {"x": 50.41499999999991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 2400,
                  "v": {"x": 50.44370496000015, "y": 26.369999999999997, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 2600,
                  "v": {"x": 50.41499999999991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 4400,
                  "v": {"x": 50.44370496000015, "y": 26.369999999999997, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 4600,
                  "v": {"x": 50.41499999999991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {
                  "t": 6400,
                  "v": {"x": 50.44370496000015, "y": 26.369999999999997, "type": "corner"},
                  "e": [1, 0]
                }, {
                  "t": 6600,
                  "v": {"x": 50.41499999999991, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 8400, "v": {"x": 50.44370496000015, "y": 26.369999999999997, "type": "corner"}, "e": [1, 0]}],
                "r": [{"t": 600, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2400, "v": 180, "e": [1, 0]}, {
                  "t": 2600,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4400, "v": 180, "e": [1, 0]}, {"t": 4600, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6400,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 6600, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8400, "v": 180, "e": [1, 0]}],
                "s": [{"t": 600, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 2400,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 2600, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 4400,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 4600, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6400,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 6600, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 8400,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }]
              }
            },
            "opacity": [{"t": 600, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2400, "v": 0, "e": [1, 0]}, {
              "t": 2600,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 4400, "v": 0, "e": [1, 0]}, {"t": 4600, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {
              "t": 6400,
              "v": 0,
              "e": [1, 0]
            }, {"t": 6600, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8400, "v": 0, "e": [1, 0]}]
          },
          "ept8g70ozks9": {
            "transform": {
              "data": {"t": {"x": -200.20999999999998, "y": -92.00999999999999}}, "keys": {
                "o": [{
                  "t": 1100,
                  "v": {"x": 200.22999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 2900, "v": {"x": 200.25870496000016, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 3100,
                  "v": {"x": 200.22999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4900, "v": {"x": 200.25870496000016, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 5100,
                  "v": {"x": 200.22999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 6900, "v": {"x": 200.25870496000016, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 7100,
                  "v": {"x": 200.22999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 8900, "v": {"x": 200.25870496000016, "y": 24.08, "type": "corner"}}],
                "r": [{"t": 1100, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2900, "v": 180, "e": [1, 0]}, {
                  "t": 3100,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4900, "v": 180, "e": [1, 0]}, {"t": 5100, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6900,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 7100, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8900, "v": 180}],
                "s": [{"t": 1100, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 2900,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 3100, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 4900,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 5100, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6900,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 7100, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8900, "v": {"x": 0.5, "y": 0.5}}]
              }
            },
            "opacity": [{"t": 1100, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2900, "v": 0, "e": [1, 0]}, {
              "t": 3100,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 4900, "v": 0, "e": [1, 0]}, {"t": 5100, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {
              "t": 6900,
              "v": 0,
              "e": [1, 0]
            }, {"t": 7100, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8900, "v": 0}]
          },
          "ept8g70ozks10": {
            "transform": {
              "data": {"t": {"x": 2.842170943040401e-14, "y": 1.4210854715202004e-14}}, "keys": {
                "o": [{
                  "t": 800,
                  "v": {"x": 229.34999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 2600, "v": {"x": 229.37870496000016, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 2800,
                  "v": {"x": 229.34999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4600, "v": {"x": 229.37870496000016, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 4800,
                  "v": {"x": 229.34999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 6600, "v": {"x": 229.37870496000016, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 6800,
                  "v": {"x": 229.34999999999988, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 8600, "v": {"x": 229.37870496000016, "y": 24.08, "type": "corner"}}],
                "r": [{"t": 800, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2600, "v": 180, "e": [1, 0]}, {
                  "t": 2800,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 4600, "v": 180, "e": [1, 0]}, {"t": 4800, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6600,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 6800, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8600, "v": 180}],
                "s": [{"t": 800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 2600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 2800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 4600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 4800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 6600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 6800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8600, "v": {"x": 0.5, "y": 0.5}}]
              }
            },
            "opacity": [{"t": 800, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 2600, "v": 0, "e": [1, 0]}, {
              "t": 2800,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 4600, "v": 0, "e": [1, 0]}, {"t": 4800, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {
              "t": 6600,
              "v": 0,
              "e": [1, 0]
            }, {"t": 6800, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 8600, "v": 0}]
          },
          "ept8g70ozks11": {
            "transform": {
              "data": {"t": {"x": -199.355, "y": -57.400000000000006}},
              "keys": {
                "o": [{
                  "t": 1800,
                  "v": {"x": 205, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 3600, "v": {"x": 205, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 3800,
                  "v": {"x": 205, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 5600, "v": {"x": 205, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 5800,
                  "v": {"x": 205, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 7600, "v": {"x": 205, "y": 24.08, "type": "corner"}}],
                "r": [{"t": 1800, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {"t": 3600, "v": 180, "e": [1, 0]}, {
                  "t": 3800,
                  "v": 0,
                  "e": [0.47, 0, 0.745, 0.715]
                }, {"t": 5600, "v": 180, "e": [1, 0]}, {"t": 5800, "v": 0, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 7600,
                  "v": 180
                }],
                "s": [{"t": 1800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 3600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 3800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {
                  "t": 5600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 5800, "v": {"x": 1, "y": 1}, "e": [0.47, 0, 0.745, 0.715]}, {"t": 7600, "v": {"x": 0.5, "y": 0.5}}]
              }
            },
            "opacity": [{"t": 1800, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 3600, "v": 0, "e": [1, 0]}, {
              "t": 3800,
              "v": 1,
              "e": [0.47, 0, 0.745, 0.715]
            }, {"t": 5600, "v": 0, "e": [1, 0]}, {"t": 5800, "v": 1, "e": [0.47, 0, 0.745, 0.715]}, {"t": 7600, "v": 0}]
          },
          "ept8g70ozks12": {
            "transform": {
              "data": {"t": {"x": -214.12, "y": -73.815}}, "keys": {
                "o": [{
                  "t": 400,
                  "v": {"x": 214.1399999999999, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 2200, "v": {"x": 214.16870496000018, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 2400,
                  "v": {"x": 214.1399999999999, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 4200, "v": {"x": 214.16870496000018, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 4400,
                  "v": {"x": 214.1399999999999, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 6200, "v": {"x": 214.16870496000018, "y": 24.08, "type": "corner"}, "e": [1, 0]}, {
                  "t": 6400,
                  "v": {"x": 214.1399999999999, "y": 113.2743257000001, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 8200, "v": {"x": 214.16870496000018, "y": 24.08, "type": "corner"}}],
                "r": [{"t": 400, "v": 0, "e": [0.42, 0, 1, 1]}, {"t": 2200, "v": 180, "e": [1, 0]}, {
                  "t": 2400,
                  "v": 0,
                  "e": [0.42, 0, 1, 1]
                }, {"t": 4200, "v": 180, "e": [1, 0]}, {"t": 4400, "v": 0, "e": [0.42, 0, 1, 1]}, {
                  "t": 6200,
                  "v": 180,
                  "e": [1, 0]
                }, {"t": 6400, "v": 0, "e": [0.42, 0, 1, 1]}, {"t": 8200, "v": 180}],
                "s": [{"t": 400, "v": {"x": 1, "y": 1}, "e": [0.42, 0, 1, 1]}, {
                  "t": 2200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 2400, "v": {"x": 1, "y": 1}, "e": [0.42, 0, 1, 1]}, {
                  "t": 4200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 4400, "v": {"x": 1, "y": 1}, "e": [0.42, 0, 1, 1]}, {
                  "t": 6200,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [1, 0]
                }, {"t": 6400, "v": {"x": 1, "y": 1}, "e": [0.42, 0, 1, 1]}, {"t": 8200, "v": {"x": 0.5, "y": 0.5}}]
              }
            },
            "opacity": [{"t": 400, "v": 1, "e": [0.42, 0, 1, 1]}, {"t": 2200, "v": 0, "e": [1, 0]}, {
              "t": 2400,
              "v": 1,
              "e": [0.42, 0, 1, 1]
            }, {"t": 4200, "v": 0, "e": [1, 0]}, {"t": 4400, "v": 1, "e": [0.42, 0, 1, 1]}, {
              "t": 6200,
              "v": 0,
              "e": [1, 0]
            }, {"t": 6400, "v": 1, "e": [0.42, 0, 1, 1]}, {"t": 8200, "v": 0}]
          },
          "ept8g70ozks20": {
            "transform": {
              "data": {
                "o": {
                  "x": 100.02118035999999,
                  "y": 111.39432082000002,
                  "type": "corner"
                }, "t": {"x": -140.01999999999998, "y": -118.27432569999999}
              },
              "keys": {
                "s": [{"t": 390, "v": {"x": 1, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.9694276309635461, "y": 0.9694276309635461},
                  "e": [0.84, 0.005, 0.35, 0.995]
                }, {
                  "t": 2210,
                  "v": {"x": 1.0613887798204598, "y": 1.0613887798204598},
                  "e": [0.33, 0.005, 0.465, 1]
                }, {"t": 3600, "v": {"x": 1, "y": 1}, "e": [0.4, 0.005, 0.515, 0.98]}, {
                  "t": 4500,
                  "v": {"x": 1.028361543005744, "y": 1.028361543005744},
                  "e": [0.4, 0.005, 0.515, 0.98]
                }, {"t": 5400, "v": {"x": 1, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 6700,
                  "v": {"x": 1.0261103069325905, "y": 1.0261103069325905},
                  "e": [0.42, 0, 0.58, 1]
                }, {
                  "t": 7000,
                  "v": {"x": 1.0346577995987276, "y": 1.0346577995987276},
                  "e": [0.42, 0, 0.58, 1]
                }, {"t": 7400, "v": {"x": 1, "y": 1}}]
              }
            }
          },
          "ept8g70ozks22": {
            "opacity": [{"t": 200, "v": 1, "e": [0.23, 1, 0.345, 1.5]}, {"t": 400, "v": 0.33}, {
              "t": 8500,
              "v": 0.33
            }, {"t": 9000, "v": 1, "e": [0.23, 1, 0.345, 1.5]}]
          },
          "ept8g70ozks24": {
            "transform": {
              "data": {"s": {"x": 0.9243965125565495, "y": 0.34192276593398707}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 139.99999999999986, "y": 113.27432569999989, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 200, "v": {"x": 111.57546738999936, "y": 112.78999999999989, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 111.57546738999936, "y": 112.78999999999989, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 139.99999999999986, "y": 113.27432569999989, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            },
            "opacity": [{"t": 0, "v": 0.2, "e": [0.755, 0.05, 0.855, 0.06]}, {"t": 200, "v": 0.5}, {
              "t": 8500,
              "v": 0.5
            }, {"t": 9000, "v": 0.2, "e": [0.755, 0.05, 0.855, 0.06]}]
          },
          "ept8g70ozks26": {
            "transform": {
              "data": {"s": {"x": 0.9243965125565495, "y": 0.34192276593398707}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 139.99999999999986, "y": 113.27432569999989, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 200, "v": {"x": 111.57546738999936, "y": 112.78999999999989, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 111.57546738999936, "y": 112.78999999999989, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 139.99999999999986, "y": 113.27432569999989, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            },
            "opacity": [{"t": 0, "v": 0.2, "e": [0.755, 0.05, 0.855, 0.06]}, {"t": 200, "v": 0.5}, {
              "t": 8500,
              "v": 0.5
            }, {"t": 9000, "v": 0.2, "e": [0.755, 0.05, 0.855, 0.06]}]
          },
          "ept8g70ozks28": {
            "transform": {
              "data": {"t": {"x": -132.47, "y": -93.72362462000001}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 132.47, "y": 93.72362462000001, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 200, "v": {"x": 124.30999878499989, "y": 100.16362798499995, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 124.30999878499989, "y": 100.16362798499995, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 132.47, "y": 93.72362462000001, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            }
          },
          "ept8g70ozks34": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}},
              "keys": {
                "o": [{
                  "t": 390,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0.42, 0, 0.215, 1]
                }, {
                  "t": 890,
                  "v": {"x": 114, "y": 97.61458047353968, "type": "corner"},
                  "e": [0.84, 0.005, 1, 1]
                }, {
                  "t": 1400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1590, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 390, "v": 53.92932987783821, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": 34.60504560744748,
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": 53.92932987783821}, {"t": 1590, "v": 70}],
                "s": [{"t": 390, "v": {"x": 0.9085275758172443, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.8771985165514304, "y": 1},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 0.9085275758172443, "y": 1}}, {"t": 1590, "v": {"x": 1, "y": 1}}]
              }
            }, "opacity": [{"t": 1400, "v": 0.9025641025641026}, {"t": 1580, "v": 1}, {"t": 1590, "v": 0}]
          },
          "ept8g70ozks35": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}},
              "keys": {
                "o": [{
                  "t": 390,
                  "v": {"x": 114, "y": 93.57338684937795, "type": "corner"},
                  "e": [0.42, 0, 0.215, 1]
                }, {
                  "t": 890,
                  "v": {"x": 114, "y": 91.39735951329087, "type": "corner"},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 114, "y": 93.57338684937795, "type": "corner"}}, {
                  "t": 1600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1690, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 390, "v": -1.282910894706717, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": -20.607195165097444,
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": -1.282910894706717}, {"t": 1600, "v": 53.92932987783821}, {"t": 1690, "v": 70}],
                "s": [{"t": 390, "v": {"x": 0.6, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.7111395322525715, "y": 1},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {"t": 1690, "v": {"x": 1, "y": 1}}]
              }
            }, "opacity": [{"t": 1400, "v": 0.8}, {"t": 1680, "v": 1}, {"t": 1690, "v": 0}]
          },
          "ept8g70ozks36": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}},
              "keys": {
                "o": [{
                  "t": 390,
                  "v": {"x": 114, "y": 87.35616588912913, "type": "corner"},
                  "e": [0.42, 0, 0.215, 1]
                }, {
                  "t": 890,
                  "v": {"x": 113.39184992121703, "y": 86.34466156813409, "type": "corner"},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 1700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1790, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 390, "v": -56.49515166725165, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": -58.732873274048146,
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": -56.49515166725165}, {"t": 1700, "v": 53.92932987783821}, {"t": 1790, "v": 70}],
                "s": [{"t": 390, "v": {"x": 0.8976035953801256, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.9546658673649906, "y": 1},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 0.8976035953801256, "y": 1}}, {
                  "t": 1600,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 1790, "v": {"x": 1, "y": 1}}]
              }
            }, "opacity": [{"t": 1400, "v": 0.6974358974358974}, {"t": 1780, "v": 1}, {"t": 1790, "v": 0}]
          },
          "ept8g70ozks37": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 1800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 1900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6390, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 1400, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1600,
                  "v": -56.49515166725165
                }, {"t": 1800, "v": 53.92932987783821}, {"t": 1890, "v": 70}, {
                  "t": 1900,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2000, "v": -56.49515166725165}, {"t": 2200, "v": 53.92932987783821}, {
                  "t": 2290,
                  "v": 70
                }, {"t": 2300, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2400, "v": -56.49515166725165}, {
                  "t": 2600,
                  "v": 53.92932987783821
                }, {"t": 2690, "v": 70}, {"t": 2700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 2800,
                  "v": -56.49515166725165
                }, {"t": 3000, "v": 53.92932987783821}, {"t": 3090, "v": 70}, {
                  "t": 3100,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3200, "v": -56.49515166725165}, {"t": 3400, "v": 53.92932987783821}, {
                  "t": 3490,
                  "v": 70
                }, {"t": 3500, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3600, "v": -56.49515166725165}, {
                  "t": 3800,
                  "v": 53.92932987783821
                }, {"t": 3890, "v": 70}, {"t": 3900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4000,
                  "v": -56.49515166725165
                }, {"t": 4200, "v": 53.92932987783821}, {"t": 4290, "v": 70}, {
                  "t": 4300,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4400, "v": -56.49515166725165}, {"t": 4600, "v": 53.92932987783821}, {
                  "t": 4690,
                  "v": 70
                }, {"t": 4700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 4800, "v": -56.49515166725165}, {
                  "t": 5000,
                  "v": 53.92932987783821
                }, {"t": 5090, "v": 70}, {"t": 5100, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5200,
                  "v": -56.49515166725165
                }, {"t": 5400, "v": 53.92932987783821}, {"t": 5490, "v": 70}, {
                  "t": 5500,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5600, "v": -56.49515166725165}, {"t": 5800, "v": 53.92932987783821}, {
                  "t": 5890,
                  "v": 70
                }, {"t": 5900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6000, "v": -56.49515166725165}, {
                  "t": 6200,
                  "v": 53.92932987783821
                }, {"t": 6390, "v": 70}],
                "s": [{"t": 1400, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 1700,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 1890, "v": {"x": 1, "y": 1}}, {
                  "t": 1900,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2100, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2290,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2300, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2500,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2690, "v": {"x": 1, "y": 1}}, {
                  "t": 2700,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2900, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3090,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3100, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3300,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3490, "v": {"x": 1, "y": 1}}, {
                  "t": 3500,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3700, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3890,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3900, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4100,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4290, "v": {"x": 1, "y": 1}}, {
                  "t": 4300,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4500, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4690,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4700, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4900,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5090, "v": {"x": 1, "y": 1}}, {
                  "t": 5100,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5300, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5490,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5500, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5700,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5890, "v": {"x": 1, "y": 1}}, {
                  "t": 5900,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6100, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {"t": 6390, "v": {"x": 1, "y": 1}}]
              }
            },
            "opacity": [{"t": 1400, "v": 0}, {"t": 1410, "v": 0.6}, {"t": 1880, "v": 1}, {"t": 1890, "v": 0}, {
              "t": 1900,
              "v": 0
            }, {"t": 1910, "v": 0.6}, {"t": 2280, "v": 1}, {"t": 2290, "v": 0}, {"t": 2300, "v": 0}, {
              "t": 2310,
              "v": 0.6
            }, {"t": 2680, "v": 1}, {"t": 2690, "v": 0}, {"t": 2700, "v": 0}, {"t": 2710, "v": 0.6}, {
              "t": 3080,
              "v": 1
            }, {"t": 3090, "v": 0}, {"t": 3100, "v": 0}, {"t": 3110, "v": 0.6}, {"t": 3480, "v": 1}, {
              "t": 3490,
              "v": 0
            }, {"t": 3500, "v": 0}, {"t": 3510, "v": 0.6}, {"t": 3880, "v": 1}, {"t": 3890, "v": 0}, {
              "t": 3900,
              "v": 0
            }, {"t": 3910, "v": 0.6}, {"t": 4280, "v": 1}, {"t": 4290, "v": 0}, {"t": 4300, "v": 0}, {
              "t": 4310,
              "v": 0.6
            }, {"t": 4680, "v": 1}, {"t": 4690, "v": 0}, {"t": 4700, "v": 0}, {"t": 4710, "v": 0.6}, {
              "t": 5080,
              "v": 1
            }, {"t": 5090, "v": 0}, {"t": 5100, "v": 0}, {"t": 5110, "v": 0.6}, {"t": 5480, "v": 1}, {
              "t": 5490,
              "v": 0
            }, {"t": 5500, "v": 0}, {"t": 5510, "v": 0.6}, {"t": 5880, "v": 1}, {"t": 5890, "v": 0}, {
              "t": 5900,
              "v": 0
            }, {"t": 5910, "v": 0.6}, {"t": 6380, "v": 1}, {"t": 6390, "v": 0}]
          },
          "ept8g70ozks38": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 1900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 6000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6600, "v": {"x": 113.39167382291348, "y": 100.83047582593808, "type": "corner"}}, {
                  "t": 6900,
                  "v": {"x": 113.39167382291348, "y": 100.83047582593808, "type": "corner"}
                }, {"t": 7400, "v": {"x": 114, "y": 99.79060780962676, "type": "corner"}, "e": [0, 0, 0.265, 0.95]}],
                "r": [{"t": 1600, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1700,
                  "v": -56.49515166725165
                }, {"t": 1900, "v": 53.92932987783821}, {"t": 1990, "v": 70}, {
                  "t": 2000,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2100, "v": -56.49515166725165}, {"t": 2300, "v": 53.92932987783821}, {
                  "t": 2390,
                  "v": 70
                }, {"t": 2400, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2500, "v": -56.49515166725165}, {
                  "t": 2700,
                  "v": 53.92932987783821
                }, {"t": 2790, "v": 70}, {"t": 2800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 2900,
                  "v": -56.49515166725165
                }, {"t": 3100, "v": 53.92932987783821}, {"t": 3190, "v": 70}, {
                  "t": 3200,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3300, "v": -56.49515166725165}, {"t": 3500, "v": 53.92932987783821}, {
                  "t": 3590,
                  "v": 70
                }, {"t": 3600, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3700, "v": -56.49515166725165}, {
                  "t": 3900,
                  "v": 53.92932987783821
                }, {"t": 3990, "v": 70}, {"t": 4000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4100,
                  "v": -56.49515166725165
                }, {"t": 4300, "v": 53.92932987783821}, {"t": 4390, "v": 70}, {
                  "t": 4400,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4500, "v": -56.49515166725165}, {"t": 4700, "v": 53.92932987783821}, {
                  "t": 4790,
                  "v": 70
                }, {"t": 4800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 4900, "v": -56.49515166725165}, {
                  "t": 5100,
                  "v": 53.92932987783821
                }, {"t": 5190, "v": 70}, {"t": 5200, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5300,
                  "v": -56.49515166725165
                }, {"t": 5500, "v": 53.92932987783821}, {"t": 5590, "v": 70}, {
                  "t": 5600,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5700, "v": -56.49515166725165}, {"t": 5900, "v": 53.92932987783821}, {
                  "t": 5990,
                  "v": 70
                }, {"t": 6000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6100, "v": -56.49515166725165}, {
                  "t": 6400,
                  "v": 53.92932987783821
                }, {"t": 6600, "v": 59.00427833746825}, {"t": 6900, "v": 59.00427833746825}, {
                  "t": 7400,
                  "v": 53.92932987783821
                }],
                "s": [{"t": 1600, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 1800,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 1990, "v": {"x": 1, "y": 1}}, {
                  "t": 2000,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2200, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2390,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2400, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2600,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2790, "v": {"x": 1, "y": 1}}, {
                  "t": 2800,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3000, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3190,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3200, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3400,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3590, "v": {"x": 1, "y": 1}}, {
                  "t": 3600,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3800, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3990,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4000, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4200,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4390, "v": {"x": 1, "y": 1}}, {
                  "t": 4400,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4600, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4790,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4800, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5000,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5190, "v": {"x": 1, "y": 1}}, {
                  "t": 5200,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5590,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5600, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5800,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5990, "v": {"x": 1, "y": 1}}, {
                  "t": 6000,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6200, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 6400,
                  "v": {"x": 0.9132165869516016, "y": 1}
                }, {"t": 6600, "v": {"x": 0.9579011999353766, "y": 1}}, {
                  "t": 6900,
                  "v": {"x": 0.9579011999353766, "y": 1}
                }, {"t": 7400, "v": {"x": 0.9132165869516016, "y": 1}}]
              }
            },
            "opacity": [{"t": 1600, "v": 0}, {"t": 1610, "v": 0.6}, {"t": 1980, "v": 1}, {"t": 1990, "v": 0}, {
              "t": 2000,
              "v": 0
            }, {"t": 2010, "v": 0.6}, {"t": 2380, "v": 1}, {"t": 2390, "v": 0}, {"t": 2400, "v": 0}, {
              "t": 2410,
              "v": 0.6
            }, {"t": 2780, "v": 1}, {"t": 2790, "v": 0}, {"t": 2800, "v": 0}, {"t": 2810, "v": 0.6}, {
              "t": 3180,
              "v": 1
            }, {"t": 3190, "v": 0}, {"t": 3200, "v": 0}, {"t": 3210, "v": 0.6}, {"t": 3580, "v": 1}, {
              "t": 3590,
              "v": 0
            }, {"t": 3600, "v": 0}, {"t": 3610, "v": 0.6}, {"t": 3980, "v": 1}, {"t": 3990, "v": 0}, {
              "t": 4000,
              "v": 0
            }, {"t": 4010, "v": 0.6}, {"t": 4380, "v": 1}, {"t": 4390, "v": 0}, {"t": 4400, "v": 0}, {
              "t": 4410,
              "v": 0.6
            }, {"t": 4780, "v": 1}, {"t": 4790, "v": 0}, {"t": 4800, "v": 0}, {"t": 4810, "v": 0.6}, {
              "t": 5180,
              "v": 1
            }, {"t": 5190, "v": 0}, {"t": 5200, "v": 0}, {"t": 5210, "v": 0.6}, {"t": 5580, "v": 1}, {
              "t": 5590,
              "v": 0
            }, {"t": 5600, "v": 0}, {"t": 5610, "v": 0.6}, {"t": 5980, "v": 1}, {"t": 5990, "v": 0}, {
              "t": 6000,
              "v": 0
            }, {"t": 6010, "v": 0.6}, {"t": 6400, "v": 0.9064935064935065}]
          },
          "ept8g70ozks39": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 6100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6400,
                  "v": {"x": 114, "y": 93.57338684937795, "type": "corner"}
                }, {"t": 6600, "v": {"x": 114, "y": 95.43855313745259, "type": "corner"}}, {
                  "t": 6900,
                  "v": {"x": 114, "y": 95.43855313745259, "type": "corner"}
                }, {"t": 7400, "v": {"x": 114, "y": 93.57338684937795, "type": "corner"}}],
                "r": [{"t": 1700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1800,
                  "v": -56.49515166725165
                }, {"t": 2000, "v": 53.92932987783821}, {"t": 2090, "v": 70}, {
                  "t": 2100,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2200, "v": -56.49515166725165}, {"t": 2400, "v": 53.92932987783821}, {
                  "t": 2490,
                  "v": 70
                }, {"t": 2500, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2600, "v": -56.49515166725165}, {
                  "t": 2800,
                  "v": 53.92932987783821
                }, {"t": 2890, "v": 70}, {"t": 2900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 3000,
                  "v": -56.49515166725165
                }, {"t": 3200, "v": 53.92932987783821}, {"t": 3290, "v": 70}, {
                  "t": 3300,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3400, "v": -56.49515166725165}, {"t": 3600, "v": 53.92932987783821}, {
                  "t": 3690,
                  "v": 70
                }, {"t": 3700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3800, "v": -56.49515166725165}, {
                  "t": 4000,
                  "v": 53.92932987783821
                }, {"t": 4090, "v": 70}, {"t": 4100, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4200,
                  "v": -56.49515166725165
                }, {"t": 4400, "v": 53.92932987783821}, {"t": 4490, "v": 70}, {
                  "t": 4500,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4600, "v": -56.49515166725165}, {"t": 4800, "v": 53.92932987783821}, {
                  "t": 4890,
                  "v": 70
                }, {"t": 4900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 5000, "v": -56.49515166725165}, {
                  "t": 5200,
                  "v": 53.92932987783821
                }, {"t": 5290, "v": 70}, {"t": 5300, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5400,
                  "v": -56.49515166725165
                }, {"t": 5600, "v": 53.92932987783821}, {"t": 5690, "v": 70}, {
                  "t": 5700,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5800, "v": -56.49515166725165}, {"t": 6000, "v": 53.92932987783821}, {
                  "t": 6090,
                  "v": 70
                }, {"t": 6100, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6200, "v": -56.49515166725165}, {
                  "t": 6400,
                  "v": -1.282910894706717
                }, {"t": 6600, "v": 15.28076133705676}, {"t": 6900, "v": 15.28076133705676}, {
                  "t": 7400,
                  "v": -1.282910894706717
                }],
                "s": [{"t": 1700, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 1900,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2090, "v": {"x": 1, "y": 1}}, {
                  "t": 2100,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2300, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2490,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2500, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2700,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2890, "v": {"x": 1, "y": 1}}, {
                  "t": 2900,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3100, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3290,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3300, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3500,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3690, "v": {"x": 1, "y": 1}}, {
                  "t": 3700,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3900, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4090,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4100, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4300,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4490, "v": {"x": 1, "y": 1}}, {
                  "t": 4500,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4700, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4890,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4900, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5100,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5290, "v": {"x": 1, "y": 1}}, {
                  "t": 5300,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5500, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5690,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5700, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5900,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 6090, "v": {"x": 1, "y": 1}}, {
                  "t": 6100,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 6600,
                  "v": {"x": 0.7148011606931686, "y": 1}
                }, {"t": 6900, "v": {"x": 0.7148011606931686, "y": 1}}, {
                  "t": 7400,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }]
              }
            },
            "opacity": [{"t": 1700, "v": 0}, {"t": 1710, "v": 0.6}, {"t": 2080, "v": 1}, {"t": 2090, "v": 0}, {
              "t": 2100,
              "v": 0
            }, {"t": 2110, "v": 0.6}, {"t": 2480, "v": 1}, {"t": 2490, "v": 0}, {"t": 2500, "v": 0}, {
              "t": 2510,
              "v": 0.6
            }, {"t": 2880, "v": 1}, {"t": 2890, "v": 0}, {"t": 2900, "v": 0}, {"t": 2910, "v": 0.6}, {
              "t": 3280,
              "v": 1
            }, {"t": 3290, "v": 0}, {"t": 3300, "v": 0}, {"t": 3310, "v": 0.6}, {"t": 3680, "v": 1}, {
              "t": 3690,
              "v": 0
            }, {"t": 3700, "v": 0}, {"t": 3710, "v": 0.6}, {"t": 4080, "v": 1}, {"t": 4090, "v": 0}, {
              "t": 4100,
              "v": 0
            }, {"t": 4110, "v": 0.6}, {"t": 4480, "v": 1}, {"t": 4490, "v": 0}, {"t": 4500, "v": 0}, {
              "t": 4510,
              "v": 0.6
            }, {"t": 4880, "v": 1}, {"t": 4890, "v": 0}, {"t": 4900, "v": 0}, {"t": 4910, "v": 0.6}, {
              "t": 5280,
              "v": 1
            }, {"t": 5290, "v": 0}, {"t": 5300, "v": 0}, {"t": 5310, "v": 0.6}, {"t": 5680, "v": 1}, {
              "t": 5690,
              "v": 0
            }, {"t": 5700, "v": 0}, {"t": 5710, "v": 0.6}, {"t": 6080, "v": 1}, {"t": 6090, "v": 0}, {
              "t": 6100,
              "v": 0
            }, {"t": 6110, "v": 0.6}, {"t": 6400, "v": 0.8025974025974025}]
          },
          "ept8g70ozks40": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 6200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6600,
                  "v": {"x": 114, "y": 89.22133217720378, "type": "corner"}
                }, {"t": 6900, "v": {"x": 114, "y": 89.22133217720378, "type": "corner"}}, {
                  "t": 7400,
                  "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}
                }],
                "r": [{"t": 1800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1900,
                  "v": -56.49515166725165
                }, {"t": 2100, "v": 53.92932987783821}, {"t": 2190, "v": 70}, {
                  "t": 2200,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2300, "v": -56.49515166725165}, {"t": 2500, "v": 53.92932987783821}, {
                  "t": 2590,
                  "v": 70
                }, {"t": 2600, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2700, "v": -56.49515166725165}, {
                  "t": 2900,
                  "v": 53.92932987783821
                }, {"t": 2990, "v": 70}, {"t": 3000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 3100,
                  "v": -56.49515166725165
                }, {"t": 3300, "v": 53.92932987783821}, {"t": 3390, "v": 70}, {
                  "t": 3400,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3500, "v": -56.49515166725165}, {"t": 3700, "v": 53.92932987783821}, {
                  "t": 3790,
                  "v": 70
                }, {"t": 3800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3900, "v": -56.49515166725165}, {
                  "t": 4100,
                  "v": 53.92932987783821
                }, {"t": 4190, "v": 70}, {"t": 4200, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4300,
                  "v": -56.49515166725165
                }, {"t": 4500, "v": 53.92932987783821}, {"t": 4590, "v": 70}, {
                  "t": 4600,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4700, "v": -56.49515166725165}, {"t": 4900, "v": 53.92932987783821}, {
                  "t": 4990,
                  "v": 70
                }, {"t": 5000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 5100, "v": -56.49515166725165}, {
                  "t": 5300,
                  "v": 53.92932987783821
                }, {"t": 5390, "v": 70}, {"t": 5400, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5500,
                  "v": -56.49515166725165
                }, {"t": 5700, "v": 53.92932987783821}, {"t": 5790, "v": 70}, {
                  "t": 5800,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5900, "v": -56.49515166725165}, {"t": 6100, "v": 53.92932987783821}, {
                  "t": 6190,
                  "v": 70
                }, {"t": 6200, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6400, "v": -56.49515166725165}, {
                  "t": 6600,
                  "v": -39.93147943548817
                }, {"t": 6900, "v": -39.93147943548817}, {"t": 7400, "v": -56.49515166725165}],
                "s": [{"t": 1800, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2000,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2190, "v": {"x": 1, "y": 1}}, {
                  "t": 2200,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2590,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2600, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2800,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2990, "v": {"x": 1, "y": 1}}, {
                  "t": 3000,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3200, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3390,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3400, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3600,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3790, "v": {"x": 1, "y": 1}}, {
                  "t": 3800,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4000, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4190,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4200, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4400,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4590, "v": {"x": 1, "y": 1}}, {
                  "t": 4600,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4800, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4990,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5000, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5200,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5390, "v": {"x": 1, "y": 1}}, {
                  "t": 5400,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5600, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5790,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5800, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 6000,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 6190, "v": {"x": 1, "y": 1}}, {
                  "t": 6200,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6400, "v": {"x": 0.8976035953801256, "y": 1}}, {
                  "t": 6600,
                  "v": {"x": 0.8229073264698968, "y": 1}
                }, {"t": 6900, "v": {"x": 0.8229073264698968, "y": 1}}, {"t": 7400, "v": {"x": 0.8976035953801256, "y": 1}}]
              }
            },
            "opacity": [{"t": 1800, "v": 0}, {"t": 1810, "v": 0.6}, {"t": 2180, "v": 1}, {"t": 2190, "v": 0}, {
              "t": 2200,
              "v": 0
            }, {"t": 2210, "v": 0.6}, {"t": 2580, "v": 1}, {"t": 2590, "v": 0}, {"t": 2600, "v": 0}, {
              "t": 2610,
              "v": 0.6
            }, {"t": 2980, "v": 1}, {"t": 2990, "v": 0}, {"t": 3000, "v": 0}, {"t": 3010, "v": 0.6}, {
              "t": 3380,
              "v": 1
            }, {"t": 3390, "v": 0}, {"t": 3400, "v": 0}, {"t": 3410, "v": 0.6}, {"t": 3780, "v": 1}, {
              "t": 3790,
              "v": 0
            }, {"t": 3800, "v": 0}, {"t": 3810, "v": 0.6}, {"t": 4180, "v": 1}, {"t": 4190, "v": 0}, {
              "t": 4200,
              "v": 0
            }, {"t": 4210, "v": 0.6}, {"t": 4580, "v": 1}, {"t": 4590, "v": 0}, {"t": 4600, "v": 0}, {
              "t": 4610,
              "v": 0.6
            }, {"t": 4980, "v": 1}, {"t": 4990, "v": 0}, {"t": 5000, "v": 0}, {"t": 5010, "v": 0.6}, {
              "t": 5380,
              "v": 1
            }, {"t": 5390, "v": 0}, {"t": 5400, "v": 0}, {"t": 5410, "v": 0.6}, {"t": 5780, "v": 1}, {
              "t": 5790,
              "v": 0
            }, {"t": 5800, "v": 0}, {"t": 5810, "v": 0.6}, {"t": 6180, "v": 1}, {"t": 6190, "v": 0}, {
              "t": 6200,
              "v": 0
            }, {"t": 6210, "v": 0.6}, {"t": 6400, "v": 0.6987012987012987}]
          },
          "ept8g70ozks42": {
            "transform": {
              "data": {"t": {"x": -132.47, "y": -93.72362462000001}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 132.47, "y": 93.72362462000001, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 200, "v": {"x": 124.30999878499989, "y": 100.16362798499995, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 124.30999878499989, "y": 100.16362798499995, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 132.47, "y": 93.72362462000001, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            }
          },
          "ept8g70ozks48": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}},
              "keys": {
                "o": [{
                  "t": 390,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0.42, 0, 0.215, 1]
                }, {
                  "t": 890,
                  "v": {"x": 114, "y": 97.61458047353968, "type": "corner"},
                  "e": [0.84, 0.005, 1, 1]
                }, {
                  "t": 1400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1590, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 390, "v": 53.92932987783821, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": 34.60504560744748,
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": 53.92932987783821}, {"t": 1590, "v": 70}],
                "s": [{"t": 390, "v": {"x": 0.9085275758172443, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.8771985165514304, "y": 1},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 0.9085275758172443, "y": 1}}, {"t": 1590, "v": {"x": 1, "y": 1}}]
              }
            }, "opacity": [{"t": 1400, "v": 0.9025641025641026}, {"t": 1580, "v": 1}, {"t": 1590, "v": 0}]
          },
          "ept8g70ozks49": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}},
              "keys": {
                "o": [{
                  "t": 390,
                  "v": {"x": 114, "y": 93.57338684937795, "type": "corner"},
                  "e": [0.42, 0, 0.215, 1]
                }, {
                  "t": 890,
                  "v": {"x": 114, "y": 91.39735951329087, "type": "corner"},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 114, "y": 93.57338684937795, "type": "corner"}}, {
                  "t": 1600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1690, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 390, "v": -1.282910894706717, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": -20.607195165097444,
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": -1.282910894706717}, {"t": 1600, "v": 53.92932987783821}, {"t": 1690, "v": 70}],
                "s": [{"t": 390, "v": {"x": 0.6, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.7111395322525715, "y": 1},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {"t": 1690, "v": {"x": 1, "y": 1}}]
              }
            }, "opacity": [{"t": 1400, "v": 0.8}, {"t": 1680, "v": 1}, {"t": 1690, "v": 0}]
          },
          "ept8g70ozks50": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}},
              "keys": {
                "o": [{
                  "t": 390,
                  "v": {"x": 114, "y": 87.35616588912913, "type": "corner"},
                  "e": [0.42, 0, 0.215, 1]
                }, {
                  "t": 890,
                  "v": {"x": 113.39184992121703, "y": 86.34466156813409, "type": "corner"},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 1700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1790, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 390, "v": -56.49515166725165, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": -58.732873274048146,
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": -56.49515166725165}, {"t": 1700, "v": 53.92932987783821}, {"t": 1790, "v": 70}],
                "s": [{"t": 390, "v": {"x": 0.8976035953801256, "y": 1}, "e": [0.42, 0, 0.215, 1]}, {
                  "t": 890,
                  "v": {"x": 0.9546658673649906, "y": 1},
                  "e": [0.84, 0.005, 1, 1]
                }, {"t": 1400, "v": {"x": 0.8976035953801256, "y": 1}}, {
                  "t": 1600,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 1790, "v": {"x": 1, "y": 1}}]
              }
            }, "opacity": [{"t": 1400, "v": 0.6974358974358974}, {"t": 1780, "v": 1}, {"t": 1790, "v": 0}]
          },
          "ept8g70ozks51": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 1800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 1900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6390, "v": {"x": 113, "y": 101.5, "type": "corner"}}],
                "r": [{"t": 1400, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1600,
                  "v": -56.49515166725165
                }, {"t": 1800, "v": 53.92932987783821}, {"t": 1890, "v": 70}, {
                  "t": 1900,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2000, "v": -56.49515166725165}, {"t": 2200, "v": 53.92932987783821}, {
                  "t": 2290,
                  "v": 70
                }, {"t": 2300, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2400, "v": -56.49515166725165}, {
                  "t": 2600,
                  "v": 53.92932987783821
                }, {"t": 2690, "v": 70}, {"t": 2700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 2800,
                  "v": -56.49515166725165
                }, {"t": 3000, "v": 53.92932987783821}, {"t": 3090, "v": 70}, {
                  "t": 3100,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3200, "v": -56.49515166725165}, {"t": 3400, "v": 53.92932987783821}, {
                  "t": 3490,
                  "v": 70
                }, {"t": 3500, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3600, "v": -56.49515166725165}, {
                  "t": 3800,
                  "v": 53.92932987783821
                }, {"t": 3890, "v": 70}, {"t": 3900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4000,
                  "v": -56.49515166725165
                }, {"t": 4200, "v": 53.92932987783821}, {"t": 4290, "v": 70}, {
                  "t": 4300,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4400, "v": -56.49515166725165}, {"t": 4600, "v": 53.92932987783821}, {
                  "t": 4690,
                  "v": 70
                }, {"t": 4700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 4800, "v": -56.49515166725165}, {
                  "t": 5000,
                  "v": 53.92932987783821
                }, {"t": 5090, "v": 70}, {"t": 5100, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5200,
                  "v": -56.49515166725165
                }, {"t": 5400, "v": 53.92932987783821}, {"t": 5490, "v": 70}, {
                  "t": 5500,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5600, "v": -56.49515166725165}, {"t": 5800, "v": 53.92932987783821}, {
                  "t": 5890,
                  "v": 70
                }, {"t": 5900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6000, "v": -56.49515166725165}, {
                  "t": 6200,
                  "v": 53.92932987783821
                }, {"t": 6390, "v": 70}],
                "s": [{"t": 1400, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 1700,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 1890, "v": {"x": 1, "y": 1}}, {
                  "t": 1900,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2100, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2290,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2300, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2500,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2690, "v": {"x": 1, "y": 1}}, {
                  "t": 2700,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2900, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3090,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3100, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3300,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3490, "v": {"x": 1, "y": 1}}, {
                  "t": 3500,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3700, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3890,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3900, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4100,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4290, "v": {"x": 1, "y": 1}}, {
                  "t": 4300,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4500, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4690,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4700, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4900,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5090, "v": {"x": 1, "y": 1}}, {
                  "t": 5100,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5300, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5490,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5500, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5700,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5890, "v": {"x": 1, "y": 1}}, {
                  "t": 5900,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6100, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {"t": 6390, "v": {"x": 1, "y": 1}}]
              }
            },
            "opacity": [{"t": 1400, "v": 0}, {"t": 1410, "v": 0.6}, {"t": 1880, "v": 1}, {"t": 1890, "v": 0}, {
              "t": 1900,
              "v": 0
            }, {"t": 1910, "v": 0.6}, {"t": 2280, "v": 1}, {"t": 2290, "v": 0}, {"t": 2300, "v": 0}, {
              "t": 2310,
              "v": 0.6
            }, {"t": 2680, "v": 1}, {"t": 2690, "v": 0}, {"t": 2700, "v": 0}, {"t": 2710, "v": 0.6}, {
              "t": 3080,
              "v": 1
            }, {"t": 3090, "v": 0}, {"t": 3100, "v": 0}, {"t": 3110, "v": 0.6}, {"t": 3480, "v": 1}, {
              "t": 3490,
              "v": 0
            }, {"t": 3500, "v": 0}, {"t": 3510, "v": 0.6}, {"t": 3880, "v": 1}, {"t": 3890, "v": 0}, {
              "t": 3900,
              "v": 0
            }, {"t": 3910, "v": 0.6}, {"t": 4280, "v": 1}, {"t": 4290, "v": 0}, {"t": 4300, "v": 0}, {
              "t": 4310,
              "v": 0.6
            }, {"t": 4680, "v": 1}, {"t": 4690, "v": 0}, {"t": 4700, "v": 0}, {"t": 4710, "v": 0.6}, {
              "t": 5080,
              "v": 1
            }, {"t": 5090, "v": 0}, {"t": 5100, "v": 0}, {"t": 5110, "v": 0.6}, {"t": 5480, "v": 1}, {
              "t": 5490,
              "v": 0
            }, {"t": 5500, "v": 0}, {"t": 5510, "v": 0.6}, {"t": 5880, "v": 1}, {"t": 5890, "v": 0}, {
              "t": 5900,
              "v": 0
            }, {"t": 5910, "v": 0.6}, {"t": 6380, "v": 1}, {"t": 6390, "v": 0}]
          },
          "ept8g70ozks52": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 1900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 1990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 6000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6600, "v": {"x": 113.39167382291348, "y": 100.83047582593808, "type": "corner"}}, {
                  "t": 6900,
                  "v": {"x": 113.39167382291348, "y": 100.83047582593808, "type": "corner"}
                }, {"t": 7400, "v": {"x": 114, "y": 99.79060780962676, "type": "corner"}, "e": [0, 0, 0.265, 0.95]}],
                "r": [{"t": 1600, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1700,
                  "v": -56.49515166725165
                }, {"t": 1900, "v": 53.92932987783821}, {"t": 1990, "v": 70}, {
                  "t": 2000,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2100, "v": -56.49515166725165}, {"t": 2300, "v": 53.92932987783821}, {
                  "t": 2390,
                  "v": 70
                }, {"t": 2400, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2500, "v": -56.49515166725165}, {
                  "t": 2700,
                  "v": 53.92932987783821
                }, {"t": 2790, "v": 70}, {"t": 2800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 2900,
                  "v": -56.49515166725165
                }, {"t": 3100, "v": 53.92932987783821}, {"t": 3190, "v": 70}, {
                  "t": 3200,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3300, "v": -56.49515166725165}, {"t": 3500, "v": 53.92932987783821}, {
                  "t": 3590,
                  "v": 70
                }, {"t": 3600, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3700, "v": -56.49515166725165}, {
                  "t": 3900,
                  "v": 53.92932987783821
                }, {"t": 3990, "v": 70}, {"t": 4000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4100,
                  "v": -56.49515166725165
                }, {"t": 4300, "v": 53.92932987783821}, {"t": 4390, "v": 70}, {
                  "t": 4400,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4500, "v": -56.49515166725165}, {"t": 4700, "v": 53.92932987783821}, {
                  "t": 4790,
                  "v": 70
                }, {"t": 4800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 4900, "v": -56.49515166725165}, {
                  "t": 5100,
                  "v": 53.92932987783821
                }, {"t": 5190, "v": 70}, {"t": 5200, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5300,
                  "v": -56.49515166725165
                }, {"t": 5500, "v": 53.92932987783821}, {"t": 5590, "v": 70}, {
                  "t": 5600,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5700, "v": -56.49515166725165}, {"t": 5900, "v": 53.92932987783821}, {
                  "t": 5990,
                  "v": 70
                }, {"t": 6000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6100, "v": -56.49515166725165}, {
                  "t": 6400,
                  "v": 53.92932987783821
                }, {"t": 6600, "v": 59.00427833746825}, {"t": 6900, "v": 59.00427833746825}, {
                  "t": 7400,
                  "v": 53.92932987783821
                }],
                "s": [{"t": 1600, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 1800,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 1990, "v": {"x": 1, "y": 1}}, {
                  "t": 2000,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2200, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2390,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2400, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2600,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2790, "v": {"x": 1, "y": 1}}, {
                  "t": 2800,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3000, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3190,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3200, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3400,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3590, "v": {"x": 1, "y": 1}}, {
                  "t": 3600,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3800, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3990,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4000, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4200,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4390, "v": {"x": 1, "y": 1}}, {
                  "t": 4400,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4600, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4790,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4800, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5000,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5190, "v": {"x": 1, "y": 1}}, {
                  "t": 5200,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5590,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5600, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5800,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5990, "v": {"x": 1, "y": 1}}, {
                  "t": 6000,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6200, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 6400,
                  "v": {"x": 0.9132165869516016, "y": 1}
                }, {"t": 6600, "v": {"x": 0.9579011999353766, "y": 1}}, {
                  "t": 6900,
                  "v": {"x": 0.9579011999353766, "y": 1}
                }, {"t": 7400, "v": {"x": 0.9132165869516016, "y": 1}}]
              }
            },
            "opacity": [{"t": 1600, "v": 0}, {"t": 1610, "v": 0.6}, {"t": 1980, "v": 1}, {"t": 1990, "v": 0}, {
              "t": 2000,
              "v": 0
            }, {"t": 2010, "v": 0.6}, {"t": 2380, "v": 1}, {"t": 2390, "v": 0}, {"t": 2400, "v": 0}, {
              "t": 2410,
              "v": 0.6
            }, {"t": 2780, "v": 1}, {"t": 2790, "v": 0}, {"t": 2800, "v": 0}, {"t": 2810, "v": 0.6}, {
              "t": 3180,
              "v": 1
            }, {"t": 3190, "v": 0}, {"t": 3200, "v": 0}, {"t": 3210, "v": 0.6}, {"t": 3580, "v": 1}, {
              "t": 3590,
              "v": 0
            }, {"t": 3600, "v": 0}, {"t": 3610, "v": 0.6}, {"t": 3980, "v": 1}, {"t": 3990, "v": 0}, {
              "t": 4000,
              "v": 0
            }, {"t": 4010, "v": 0.6}, {"t": 4380, "v": 1}, {"t": 4390, "v": 0}, {"t": 4400, "v": 0}, {
              "t": 4410,
              "v": 0.6
            }, {"t": 4780, "v": 1}, {"t": 4790, "v": 0}, {"t": 4800, "v": 0}, {"t": 4810, "v": 0.6}, {
              "t": 5180,
              "v": 1
            }, {"t": 5190, "v": 0}, {"t": 5200, "v": 0}, {"t": 5210, "v": 0.6}, {"t": 5580, "v": 1}, {
              "t": 5590,
              "v": 0
            }, {"t": 5600, "v": 0}, {"t": 5610, "v": 0.6}, {"t": 5980, "v": 1}, {"t": 5990, "v": 0}, {
              "t": 6000,
              "v": 0
            }, {"t": 6010, "v": 0.6}, {"t": 6400, "v": 0.9064935064935065}]
          },
          "ept8g70ozks53": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4400,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4490, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4500,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4600, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4800,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4890, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4900,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5000, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5200,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5290, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5300,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5600,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5690, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5700,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5800, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6000,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6090, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 6100,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6200, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6400,
                  "v": {"x": 114, "y": 93.57338684937795, "type": "corner"}
                }, {"t": 6600, "v": {"x": 114, "y": 95.43855313745259, "type": "corner"}}, {
                  "t": 6900,
                  "v": {"x": 114, "y": 95.43855313745259, "type": "corner"}
                }, {"t": 7400, "v": {"x": 114, "y": 93.57338684937795, "type": "corner"}}],
                "r": [{"t": 1700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1800,
                  "v": -56.49515166725165
                }, {"t": 2000, "v": 53.92932987783821}, {"t": 2090, "v": 70}, {
                  "t": 2100,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2200, "v": -56.49515166725165}, {"t": 2400, "v": 53.92932987783821}, {
                  "t": 2490,
                  "v": 70
                }, {"t": 2500, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2600, "v": -56.49515166725165}, {
                  "t": 2800,
                  "v": 53.92932987783821
                }, {"t": 2890, "v": 70}, {"t": 2900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 3000,
                  "v": -56.49515166725165
                }, {"t": 3200, "v": 53.92932987783821}, {"t": 3290, "v": 70}, {
                  "t": 3300,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3400, "v": -56.49515166725165}, {"t": 3600, "v": 53.92932987783821}, {
                  "t": 3690,
                  "v": 70
                }, {"t": 3700, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3800, "v": -56.49515166725165}, {
                  "t": 4000,
                  "v": 53.92932987783821
                }, {"t": 4090, "v": 70}, {"t": 4100, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4200,
                  "v": -56.49515166725165
                }, {"t": 4400, "v": 53.92932987783821}, {"t": 4490, "v": 70}, {
                  "t": 4500,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4600, "v": -56.49515166725165}, {"t": 4800, "v": 53.92932987783821}, {
                  "t": 4890,
                  "v": 70
                }, {"t": 4900, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 5000, "v": -56.49515166725165}, {
                  "t": 5200,
                  "v": 53.92932987783821
                }, {"t": 5290, "v": 70}, {"t": 5300, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5400,
                  "v": -56.49515166725165
                }, {"t": 5600, "v": 53.92932987783821}, {"t": 5690, "v": 70}, {
                  "t": 5700,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5800, "v": -56.49515166725165}, {"t": 6000, "v": 53.92932987783821}, {
                  "t": 6090,
                  "v": 70
                }, {"t": 6100, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6200, "v": -56.49515166725165}, {
                  "t": 6400,
                  "v": -1.282910894706717
                }, {"t": 6600, "v": 15.28076133705676}, {"t": 6900, "v": 15.28076133705676}, {
                  "t": 7400,
                  "v": -1.282910894706717
                }],
                "s": [{"t": 1700, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 1900,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2090, "v": {"x": 1, "y": 1}}, {
                  "t": 2100,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2300, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2490,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2500, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2700,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2890, "v": {"x": 1, "y": 1}}, {
                  "t": 2900,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3100, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3290,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3300, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3500,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3690, "v": {"x": 1, "y": 1}}, {
                  "t": 3700,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3900, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4090,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4100, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4300,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4490, "v": {"x": 1, "y": 1}}, {
                  "t": 4500,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4700, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4890,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4900, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5100,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5290, "v": {"x": 1, "y": 1}}, {
                  "t": 5300,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5500, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5690,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5700, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5900,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 6090, "v": {"x": 1, "y": 1}}, {
                  "t": 6100,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 6600,
                  "v": {"x": 0.7148011606931686, "y": 1}
                }, {"t": 6900, "v": {"x": 0.7148011606931686, "y": 1}}, {
                  "t": 7400,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }]
              }
            },
            "opacity": [{"t": 1700, "v": 0}, {"t": 1710, "v": 0.6}, {"t": 2080, "v": 1}, {"t": 2090, "v": 0}, {
              "t": 2100,
              "v": 0
            }, {"t": 2110, "v": 0.6}, {"t": 2480, "v": 1}, {"t": 2490, "v": 0}, {"t": 2500, "v": 0}, {
              "t": 2510,
              "v": 0.6
            }, {"t": 2880, "v": 1}, {"t": 2890, "v": 0}, {"t": 2900, "v": 0}, {"t": 2910, "v": 0.6}, {
              "t": 3280,
              "v": 1
            }, {"t": 3290, "v": 0}, {"t": 3300, "v": 0}, {"t": 3310, "v": 0.6}, {"t": 3680, "v": 1}, {
              "t": 3690,
              "v": 0
            }, {"t": 3700, "v": 0}, {"t": 3710, "v": 0.6}, {"t": 4080, "v": 1}, {"t": 4090, "v": 0}, {
              "t": 4100,
              "v": 0
            }, {"t": 4110, "v": 0.6}, {"t": 4480, "v": 1}, {"t": 4490, "v": 0}, {"t": 4500, "v": 0}, {
              "t": 4510,
              "v": 0.6
            }, {"t": 4880, "v": 1}, {"t": 4890, "v": 0}, {"t": 4900, "v": 0}, {"t": 4910, "v": 0.6}, {
              "t": 5280,
              "v": 1
            }, {"t": 5290, "v": 0}, {"t": 5300, "v": 0}, {"t": 5310, "v": 0.6}, {"t": 5680, "v": 1}, {
              "t": 5690,
              "v": 0
            }, {"t": 5700, "v": 0}, {"t": 5710, "v": 0.6}, {"t": 6080, "v": 1}, {"t": 6090, "v": 0}, {
              "t": 6100,
              "v": 0
            }, {"t": 6110, "v": 0.6}, {"t": 6400, "v": 0.8025974025974025}]
          },
          "ept8g70ozks54": {
            "transform": {
              "data": {"t": {"x": -113.45685921500011, "y": -93.54849363500006}}, "keys": {
                "o": [{
                  "t": 1800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 1900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 2600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 2700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 2900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 2990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 3700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 3790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 3800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 3900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4300, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4500,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4590, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 4600,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 4700, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 4900,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 4990, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5000,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5100, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5300,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5390, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5400,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5500, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 5700,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 5790, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 5800,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 5900, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6100,
                  "v": {"x": 114, "y": 99.79060780962676, "type": "corner"},
                  "e": [0, 0, 0.265, 0.95]
                }, {"t": 6190, "v": {"x": 113, "y": 101.5, "type": "corner"}}, {
                  "t": 6200,
                  "v": {"x": 112.99534321500009, "y": 85.68517263500006, "type": "corner"},
                  "e": [0.645, 0.045, 1, 1]
                }, {"t": 6400, "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}}, {
                  "t": 6600,
                  "v": {"x": 114, "y": 89.22133217720378, "type": "corner"}
                }, {"t": 6900, "v": {"x": 114, "y": 89.22133217720378, "type": "corner"}}, {
                  "t": 7400,
                  "v": {"x": 114, "y": 87.35616588912913, "type": "corner"}
                }],
                "r": [{"t": 1800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 1900,
                  "v": -56.49515166725165
                }, {"t": 2100, "v": 53.92932987783821}, {"t": 2190, "v": 70}, {
                  "t": 2200,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 2300, "v": -56.49515166725165}, {"t": 2500, "v": 53.92932987783821}, {
                  "t": 2590,
                  "v": 70
                }, {"t": 2600, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 2700, "v": -56.49515166725165}, {
                  "t": 2900,
                  "v": 53.92932987783821
                }, {"t": 2990, "v": 70}, {"t": 3000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 3100,
                  "v": -56.49515166725165
                }, {"t": 3300, "v": 53.92932987783821}, {"t": 3390, "v": 70}, {
                  "t": 3400,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 3500, "v": -56.49515166725165}, {"t": 3700, "v": 53.92932987783821}, {
                  "t": 3790,
                  "v": 70
                }, {"t": 3800, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 3900, "v": -56.49515166725165}, {
                  "t": 4100,
                  "v": 53.92932987783821
                }, {"t": 4190, "v": 70}, {"t": 4200, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 4300,
                  "v": -56.49515166725165
                }, {"t": 4500, "v": 53.92932987783821}, {"t": 4590, "v": 70}, {
                  "t": 4600,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 4700, "v": -56.49515166725165}, {"t": 4900, "v": 53.92932987783821}, {
                  "t": 4990,
                  "v": 70
                }, {"t": 5000, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 5100, "v": -56.49515166725165}, {
                  "t": 5300,
                  "v": 53.92932987783821
                }, {"t": 5390, "v": 70}, {"t": 5400, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {
                  "t": 5500,
                  "v": -56.49515166725165
                }, {"t": 5700, "v": 53.92932987783821}, {"t": 5790, "v": 70}, {
                  "t": 5800,
                  "v": -70,
                  "e": [0.645, 0.045, 0.355, 1]
                }, {"t": 5900, "v": -56.49515166725165}, {"t": 6100, "v": 53.92932987783821}, {
                  "t": 6190,
                  "v": 70
                }, {"t": 6200, "v": -70, "e": [0.645, 0.045, 0.355, 1]}, {"t": 6400, "v": -56.49515166725165}, {
                  "t": 6600,
                  "v": -39.93147943548817
                }, {"t": 6900, "v": -39.93147943548817}, {"t": 7400, "v": -56.49515166725165}],
                "s": [{"t": 1800, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2000,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2190, "v": {"x": 1, "y": 1}}, {
                  "t": 2200,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 2400, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 2590,
                  "v": {"x": 1, "y": 1}
                }, {"t": 2600, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 2800,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 2990, "v": {"x": 1, "y": 1}}, {
                  "t": 3000,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 3200, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 3390,
                  "v": {"x": 1, "y": 1}
                }, {"t": 3400, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 3600,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 3790, "v": {"x": 1, "y": 1}}, {
                  "t": 3800,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4000, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4190,
                  "v": {"x": 1, "y": 1}
                }, {"t": 4200, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 4400,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 4590, "v": {"x": 1, "y": 1}}, {
                  "t": 4600,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 4800, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 4990,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5000, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 5200,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 5390, "v": {"x": 1, "y": 1}}, {
                  "t": 5400,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 5600, "v": {"x": 0.6, "y": 1}, "e": [0.25, 0.46, 0.45, 0.94]}, {
                  "t": 5790,
                  "v": {"x": 1, "y": 1}
                }, {"t": 5800, "v": {"x": 1, "y": 1}, "e": [0.55, 0.085, 0.68, 0.53]}, {
                  "t": 6000,
                  "v": {"x": 0.6, "y": 1},
                  "e": [0.25, 0.46, 0.45, 0.94]
                }, {"t": 6190, "v": {"x": 1, "y": 1}}, {
                  "t": 6200,
                  "v": {"x": 1, "y": 1},
                  "e": [0.55, 0.085, 0.68, 0.53]
                }, {"t": 6400, "v": {"x": 0.8976035953801256, "y": 1}}, {
                  "t": 6600,
                  "v": {"x": 0.8229073264698968, "y": 1}
                }, {"t": 6900, "v": {"x": 0.8229073264698968, "y": 1}}, {"t": 7400, "v": {"x": 0.8976035953801256, "y": 1}}]
              }
            },
            "opacity": [{"t": 1800, "v": 0}, {"t": 1810, "v": 0.6}, {"t": 2180, "v": 1}, {"t": 2190, "v": 0}, {
              "t": 2200,
              "v": 0
            }, {"t": 2210, "v": 0.6}, {"t": 2580, "v": 1}, {"t": 2590, "v": 0}, {"t": 2600, "v": 0}, {
              "t": 2610,
              "v": 0.6
            }, {"t": 2980, "v": 1}, {"t": 2990, "v": 0}, {"t": 3000, "v": 0}, {"t": 3010, "v": 0.6}, {
              "t": 3380,
              "v": 1
            }, {"t": 3390, "v": 0}, {"t": 3400, "v": 0}, {"t": 3410, "v": 0.6}, {"t": 3780, "v": 1}, {
              "t": 3790,
              "v": 0
            }, {"t": 3800, "v": 0}, {"t": 3810, "v": 0.6}, {"t": 4180, "v": 1}, {"t": 4190, "v": 0}, {
              "t": 4200,
              "v": 0
            }, {"t": 4210, "v": 0.6}, {"t": 4580, "v": 1}, {"t": 4590, "v": 0}, {"t": 4600, "v": 0}, {
              "t": 4610,
              "v": 0.6
            }, {"t": 4980, "v": 1}, {"t": 4990, "v": 0}, {"t": 5000, "v": 0}, {"t": 5010, "v": 0.6}, {
              "t": 5380,
              "v": 1
            }, {"t": 5390, "v": 0}, {"t": 5400, "v": 0}, {"t": 5410, "v": 0.6}, {"t": 5780, "v": 1}, {
              "t": 5790,
              "v": 0
            }, {"t": 5800, "v": 0}, {"t": 5810, "v": 0.6}, {"t": 6180, "v": 1}, {"t": 6190, "v": 0}, {
              "t": 6200,
              "v": 0
            }, {"t": 6210, "v": 0.6}, {"t": 6400, "v": 0.6987012987012987}]
          },
          "ept8g70ozks55": {
            "transform": {
              "data": {"t": {"x": -140, "y": -78.25001907000001}},
              "keys": {
                "o": [{
                  "t": 200,
                  "v": {"x": 140, "y": 78.25001907000001, "type": "corner"},
                  "e": [0.23, 1, 0.345, 1.8]
                }, {"t": 400, "v": {"x": 140, "y": 73.25001907000001, "type": "corner"}}, {
                  "t": 6100,
                  "v": {"x": 140, "y": 73.25001907000001, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 6700, "v": {"x": 140, "y": 75.19071043151206, "type": "corner"}, "e": [0, 0, 0.58, 1]}, {
                  "t": 7400,
                  "v": {"x": 140, "y": 73.25001907000001, "type": "corner"}
                }, {"t": 8000, "v": {"x": 140, "y": 73.25001907000001, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 140, "y": 78.25001907000001, "type": "corner"},
                  "e": [0.23, 1, 0.345, 1.8]
                }]
              }
            }
          },
          "ept8g70ozks67": {
            "transform": {
              "data": {"o": {"x": 146.64, "y": 101.97, "type": "corner"}},
              "keys": {
                "s": [{"t": 0, "v": {"x": 0.5, "y": 0.5}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 300,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}
                }, {"t": 2200, "v": {"x": 0.5, "y": 0.5}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 2800,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 3400, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}, "e": [0, 0, 0.58, 1]}, {
                  "t": 4000,
                  "v": {"x": 0.5, "y": 0.5}
                }, {"t": 4800, "v": {"x": 0.5, "y": 0.5}, "e": [0.42, 0, 1, 1]}, {
                  "t": 5400,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001},
                  "e": [0, 0, 0.58, 1]
                }, {"t": 6000, "v": {"x": 0.5, "y": 0.5}}, {
                  "t": 6800,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 7400, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}, "e": [0, 0, 0.58, 1]}, {
                  "t": 8000,
                  "v": {"x": 0.5, "y": 0.5}
                }, {"t": 8500, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}}, {
                  "t": 9000,
                  "v": {"x": 0.5, "y": 0.5}
                }]
              }
            },
            "opacity": [{"t": 0, "v": 0.2, "e": [0.645, 0.045, 0.345, 1.34]}, {"t": 300, "v": 1}, {
              "t": 8500,
              "v": 1
            }, {"t": 9000, "v": 0.2, "e": [0.645, 0.045, 0.345, 1.34]}]
          },
          "ept8g70ozks68": {
            "transform": {
              "data": {"o": {"x": 133.37, "y": 101.97, "type": "corner"}},
              "keys": {
                "s": [{"t": 0, "v": {"x": 0.5, "y": 0.5}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 300,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}
                }, {"t": 2200, "v": {"x": 0.5, "y": 0.5}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 2400,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 3000, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}, "e": [0, 0, 0.58, 1]}, {
                  "t": 3600,
                  "v": {"x": 0.5, "y": 0.5}
                }, {"t": 4400, "v": {"x": 0.5, "y": 0.5}, "e": [0.42, 0, 1, 1]}, {
                  "t": 5000,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001},
                  "e": [0, 0, 0.58, 1]
                }, {"t": 5600, "v": {"x": 0.5, "y": 0.5}}, {
                  "t": 6400,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 7000, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}, "e": [0, 0, 0.58, 1]}, {
                  "t": 7600,
                  "v": {"x": 0.5, "y": 0.5}
                }, {"t": 8000, "v": {"x": 0.5, "y": 0.5}}, {
                  "t": 8500,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}
                }, {"t": 9000, "v": {"x": 0.5, "y": 0.5}}]
              }
            },
            "opacity": [{"t": 0, "v": 0.2, "e": [0.645, 0.045, 0.345, 1.34]}, {"t": 300, "v": 1}, {
              "t": 8500,
              "v": 1
            }, {"t": 9000, "v": 0.2, "e": [0.645, 0.045, 0.345, 1.34]}]
          },
          "ept8g70ozks69": {
            "transform": {
              "data": {
                "o": {"x": 140, "y": 102.22999999999999, "type": "corner"},
                "t": {"x": 0, "y": 1.4210854715202004e-14}
              },
              "keys": {
                "s": [{"t": 0, "v": {"x": 0.5, "y": 0.5}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 300,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}
                }, {"t": 2200, "v": {"x": 0.5, "y": 0.5}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 2600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 3200, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}, "e": [0, 0, 0.58, 1]}, {
                  "t": 3800,
                  "v": {"x": 0.5, "y": 0.5}
                }, {"t": 4600, "v": {"x": 0.5, "y": 0.5}, "e": [0.42, 0, 1, 1]}, {
                  "t": 5200,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001},
                  "e": [0, 0, 0.58, 1]
                }, {"t": 5800, "v": {"x": 0.5, "y": 0.5}}, {
                  "t": 6600,
                  "v": {"x": 0.5, "y": 0.5},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 7200, "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}, "e": [0, 0, 0.58, 1]}, {
                  "t": 7800,
                  "v": {"x": 0.5, "y": 0.5}
                }, {"t": 8000, "v": {"x": 0.5, "y": 0.5}}, {
                  "t": 8500,
                  "v": {"x": 1.4000000000000001, "y": 1.4000000000000001}
                }, {"t": 9000, "v": {"x": 0.5, "y": 0.5}}]
              }
            },
            "opacity": [{"t": 0, "v": 0.2, "e": [0.645, 0.045, 0.345, 1.34]}, {"t": 300, "v": 1}, {
              "t": 8500,
              "v": 1
            }, {"t": 9000, "v": 0.2, "e": [0.645, 0.045, 0.345, 1.34]}]
          },
          "ept8g70ozks70": {
            "transform": {
              "data": {"t": {"x": -140, "y": -63.961431499999996}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 140, "y": 66.9614315, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 400, "v": {"x": 140, "y": 61.961431499999996, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 140, "y": 61.961431499999996, "type": "corner"}
                }, {"t": 9000, "v": {"x": 140, "y": 66.9614315, "type": "corner"}, "e": [0.645, 0.045, 0.345, 1.34]}]
              }
            }
          },
          "ept8g70ozks71": {
            "transform": {
              "data": {"s": {"x": 1.5694856562545307, "y": 0.580533212091104}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 140, "y": 80.08852819499988, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 200, "v": {"x": 140, "y": 82.08852819499988, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 140, "y": 82.08852819499988, "type": "corner"}
                }, {"t": 9000, "v": {"x": 140, "y": 80.08852819499988, "type": "corner"}, "e": [0.645, 0.045, 0.345, 1.34]}]
              }
            }
          },
          "ept8g70ozks74": {
            "transform": {
              "data": {"t": {"x": -139.93231531005426, "y": -53.507406597791025}},
              "keys": {
                "o": [{
                  "t": 1500,
                  "v": {"x": 139.93231531005426, "y": 53.507406597791025, "type": "corner"},
                  "e": [0, 0, 0.58, 1]
                }, {"t": 1700, "v": {"x": 139.94465854254193, "y": 48.50879989464771, "type": "corner"}}, {
                  "t": 7400,
                  "v": {"x": 139.94465854254193, "y": 48.50879989464771, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 7700, "v": {"x": 140.03989, "y": 53.481342, "type": "corner"}, "e": [0, 0, 0.58, 1]}],
                "s": [{"t": 200, "v": {"x": 1, "y": 0.8404799736756673}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 400,
                  "v": {"x": 1, "y": 1.3121027648594183}
                }, {"t": 1500, "v": {"x": 1, "y": 1.3121027648594183}, "e": [0, 0, 0.58, 1]}, {
                  "t": 1700,
                  "v": {"x": 0.9245785621808568, "y": 1.0640549376754531}
                }, {"t": 6800, "v": {"x": 0.9245785621808568, "y": 1.0640549376754531}}, {
                  "t": 7000,
                  "v": {"x": 0.9245785621808568, "y": 0.9742492499503377}
                }, {"t": 7400, "v": {"x": 0.9245785621808568, "y": 1.0640549376754531}, "e": [0.42, 0, 1, 1]}, {
                  "t": 7700,
                  "v": {"x": 1, "y": 1.3121027648594183},
                  "e": [0, 0, 0.58, 1]
                }]
              }
            }
          },
          "ept8g70ozks75": {
            "transform": {
              "data": {"t": {"x": -140.03989, "y": -53.481342}},
              "keys": {
                "o": [{
                  "t": 1500,
                  "v": {"x": 140.03989, "y": 53.481342, "type": "corner"},
                  "e": [0, 0, 0.58, 1]
                }, {"t": 1700, "v": {"x": 139.94465854254193, "y": 48.48273529685668, "type": "corner"}}, {
                  "t": 7400,
                  "v": {"x": 139.94465854254193, "y": 48.48273529685668, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 7700, "v": {"x": 140.03989, "y": 53.481342, "type": "corner"}, "e": [0, 0, 0.58, 1]}],
                "s": [{"t": 200, "v": {"x": 1, "y": 0.8404799736756673}, "e": [0.645, 0.045, 0.345, 1.34]}, {
                  "t": 400,
                  "v": {"x": 1, "y": 1.3121027648594183}
                }, {"t": 1500, "v": {"x": 1, "y": 1.3121027648594183}, "e": [0, 0, 0.58, 1]}, {
                  "t": 1700,
                  "v": {"x": 0.9245785621808568, "y": 1.0640549376754531}
                }, {"t": 6800, "v": {"x": 0.9245785621808568, "y": 1.0640549376754531}}, {
                  "t": 7000,
                  "v": {"x": 0.9245785621808568, "y": 0.9742492499503377}
                }, {"t": 7400, "v": {"x": 0.9245785621808568, "y": 1.0640549376754531}, "e": [0.42, 0, 1, 1]}, {
                  "t": 7700,
                  "v": {"x": 1, "y": 1.3121027648594183},
                  "e": [0, 0, 0.58, 1]
                }]
              }
            }
          },
          "ept8g70ozks76": {
            "transform": {
              "data": {"t": {"x": -139.979953765, "y": -65.08379936}},
              "keys": {
                "o": [{
                  "t": 200,
                  "v": {"x": 139.979953765, "y": 67.08379936, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 400, "v": {"x": 139.979953765, "y": 64.08379936, "type": "corner"}}, {
                  "t": 1500,
                  "v": {"x": 139.979953765, "y": 64.08379936, "type": "corner"},
                  "e": [0, 0, 0.58, 1]
                }, {"t": 1700, "v": {"x": 136.87807409567358, "y": 61.18204121323079, "type": "corner"}}, {
                  "t": 4400,
                  "v": {"x": 136.87807409567358, "y": 61.18204121323079, "type": "corner"},
                  "e": [0.42, 0, 0.58, 1]
                }, {
                  "t": 4900,
                  "v": {"x": 143.1912083690444, "y": 61.18204121323079, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 6800, "v": {"x": 143.1912083690444, "y": 61.18204121323079, "type": "corner"}}, {
                  "t": 7000,
                  "v": {"x": 143.1912083690444, "y": 61.58797252710375, "type": "corner"}
                }, {
                  "t": 7400,
                  "v": {"x": 143.1912083690444, "y": 61.18204121323079, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {"t": 7700, "v": {"x": 139.979953765, "y": 64.08379936, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 139.979953765, "y": 64.08379936, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 139.979953765, "y": 67.08379936, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            }
          },
          "ept8g70ozks80": {
            "transform": {
              "data": {"t": {"x": -140.45499801480642, "y": -64.05000495559366}}, "keys": {
                "o": [{
                  "t": 1500,
                  "v": {"x": 140.45499801480642, "y": 64.05000495559366, "type": "corner"},
                  "e": [0, 0, 0.58, 1]
                }, {
                  "t": 1700,
                  "v": {"x": 136.86225634541094, "y": 62.029088313724806, "type": "corner"},
                  "e": [0.42, 0, 0.58, 1]
                }, {
                  "t": 2500,
                  "v": {"x": 136.86225634541094, "y": 62.029088313724806, "type": "corner"},
                  "e": [0.42, 0, 0.58, 1]
                }, {
                  "t": 2600,
                  "v": {"x": 139.2209371475565, "y": 61.46479216839355, "type": "corner"},
                  "e": [0.42, 0, 0.58, 1]
                }, {
                  "t": 2800,
                  "v": {"x": 139.2209371475565, "y": 61.46479216839355, "type": "corner"},
                  "e": [0.42, 0, 0.58, 1]
                }, {"t": 2900, "v": {"x": 137.01525786622994, "y": 62.245550835373436, "type": "corner"}}, {
                  "t": 4400,
                  "v": {"x": 137.01525786622994, "y": 62.245550835373436, "type": "corner"},
                  "e": [0.42, 0, 0.58, 1]
                }, {"t": 4900, "v": {"x": 140.0160487448599, "y": 61.860834850902684, "type": "corner"}}, {
                  "t": 5700,
                  "v": {"x": 140.0160487448599, "y": 61.860834850902684, "type": "corner"}
                }, {"t": 5800, "v": {"x": 143.3878160486657, "y": 61.71450448658434, "type": "corner"}}, {
                  "t": 6000,
                  "v": {"x": 143.3878160486657, "y": 61.71450448658434, "type": "corner"}
                }, {"t": 6100, "v": {"x": 144.47400126383678, "y": 63.277799534359474, "type": "corner"}}, {
                  "t": 6800,
                  "v": {"x": 144.47400126383678, "y": 63.277799534359474, "type": "corner"}
                }, {
                  "t": 7400,
                  "v": {"x": 144.47400126383678, "y": 63.277799534359474, "type": "corner"},
                  "e": [0.42, 0, 1, 1]
                }, {
                  "t": 7700,
                  "v": {"x": 140.45499801480642, "y": 64.05000495559366, "type": "corner"},
                  "e": [0, 0, 0.58, 1]
                }]
              }
            }
          },
          "ept8g70ozks81": {
            "transform": {
              "data": {"t": {"x": -2.842170943040401e-14, "y": 4.457788804757001e-9}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 153.79000000000002, "y": 65.21056699554217, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 300, "v": {"x": 153.79000000000002, "y": 64.04999999554221, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 153.79000000000002, "y": 64.04999999554221, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 153.79000000000002, "y": 65.21056699554217, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            }, "opacity": [{"t": 0, "v": 1}, {"t": 9000, "v": 1}]
          },
          "ept8g70ozks82": {
            "transform": {
              "data": {"t": {"x": 1.4210854715202004e-14, "y": 4.457788804757001e-9}},
              "keys": {
                "o": [{
                  "t": 0,
                  "v": {"x": 127.11999999999999, "y": 65.21056699554217, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }, {"t": 300, "v": {"x": 127.11999999999999, "y": 64.04999999554221, "type": "corner"}}, {
                  "t": 8500,
                  "v": {"x": 127.11999999999999, "y": 64.04999999554221, "type": "corner"}
                }, {
                  "t": 9000,
                  "v": {"x": 127.11999999999999, "y": 65.21056699554217, "type": "corner"},
                  "e": [0.645, 0.045, 0.345, 1.34]
                }]
              }
            }, "opacity": [{"t": 0, "v": 1}, {"t": 9000, "v": 1}]
          }
        }
      }],
      "options": {"start": "load"},
      "animationSettings": {"duration": 10000, "direction": 1, "iterations": 0, "fill": 1, "alternate": false}
    })

  }


  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(this.content);
    var a = document.getElementById('ept8g70ozks1')
    a.setAttribute('height','100%')
    a.setAttribute('width','100%')
    const prop = options.properties;
    if(options.dataViews.length == 0){
      return;
    }
    const dataView = options.dataViews[0] && options.dataViews[0].plain.data[0];
    //拿到绑定值
    const value = Object.values(dataView)[0];
    //计算当前数据对应的颜色
    const currentColor =  this.getColor(prop.dialSectionColor,Number(value));
    //初始化action
    const currentAction = {type: "",color: currentColor};
    //计算当前action方式
    //1.两个按钮都打开
    if(prop.dialColorUseToBelly && prop.dialColorUseToEye){
      currentAction.type = UPDATE_ALL;
    }
    //2.肚子按钮打开
    if(prop.dialColorUseToBelly && !prop.dialColorUseToEye){
      //上次是all，则判断是关闭眼睛
      if(this.actions.type == UPDATE_ALL){
        currentAction.type = RESTORE_EYE;
      }else{
        currentAction.type = UPDATE_BELLY;
      }
      
    }
    //3.眼睛按钮打开
    if(!prop.dialColorUseToBelly && prop.dialColorUseToEye){
      //上次是all，则判断是关闭肚子
      if(this.actions.type == UPDATE_ALL){
        currentAction.type = RESTORE_BELLY;
      }else{
        currentAction.type = UPDATE_EYE;
      }
    }
    //4.按钮都关闭
    if(!prop.dialColorUseToBelly && !prop.dialColorUseToEye){
      currentAction.type = RESTORE_ALL;
    }


    //跟上次action一样则不进行dispatch
    if(this.actions.type != currentAction.type || this.actions.color != currentAction.color){
      this.actions.type = currentAction.type;
      this.actions.color = currentAction.color;
      this.dispatch(currentAction);
    }
  }

  private getColor(setting:Array<IPropSetting>,value:number): string{
    let color =  this.defaultColor
    //排序
    setting.sort((a,b)=> a.section - b.section);
    for(let i = 0;i<setting.length;i++){
      color = setting[i].color;
      if(setting[i].sectionMax > value){
        break;
      }
    }
    return color;
  }

  private dispatch(action:IActions):void {
    const currentReducer = this.reducer(action);
    if(currentReducer){
      this.render(currentReducer.ids,currentReducer.color);
    }
  }

  private render(ids:Array<string>,color:string) {
    ids.map(item=>{
      document.getElementById(item).setAttribute('fill',color);
    })
  }

  public onDestroy(): void {

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