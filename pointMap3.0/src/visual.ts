import '../style/visual.less';
import * as echarts from 'echarts';
import 'echarts-gl';
import xianJson from './xian.json'
let myChart;
export default class Visual extends WynVisual {

  private container: HTMLDivElement;
  private host: any;
  private isMock: boolean;
  private bindCoords: boolean;
  private preview: boolean;
  private selectionManager: any;
  private selection: any[] = [];
  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    this.container = dom;
    this.host = host;
    this.isMock = true;
    this.bindCoords = false;
    this.preview = false;
    this.selectionManager = host.selectionService.createSelectionManager();
    myChart = echarts.init(dom, null, { renderer: 'canvas' });
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    console.log(options);
    // registerMap
    console.log(xianJson, '====xianJson')
    echarts.registerMap('xian', JSON.parse(JSON.stringify(xianJson)))
    this.render();
  }

  private render() {
    let mapData = [{
      name: "新城区",
      value: [108.959903,  34.26927, 2],
  },
  {
      name: "碑林区",
      value: [108.946994,
        34.251061, 2]
  },
  {
      name: "莲湖区",
      value: [108.933194,
        34.2656, 2]
  },
  {
      name: "未央区",
      value: [108.946022,
        34.30823,2]
  },
  {
      name: "雁塔区",
      value: [108.926593,
        34.213389, 2]
  },
  {
      name: "阎良区",
      value: [109.22802,
        34.662141, 2]
  },
  {
      name: "临潼区",
      value: [109.213986,
        34.372065, 2]
  },
  {
      name: "长安区",
      value: [108.941579,
        34.157097, 2]
  },{
      name: "高陵区",
      value: [109.088896,
        34.535065, 2]
  },
  {
      name: "鄠邑区",
      value: [108.607385,
        34.108668, 2]
  },{
    name: "蓝田县",
    value: [109.317634,
      34.156189, 2]
},
{
    name: "周至县",
    value: [108.216465,
      34.161532, 2]
},

    ];
    let mapData2 = [{
      name: "新城区",
      value: [108.950903, 34.26927, 2],
    },
    {
      name: "碑林区",
      value: [108.940994, 34.251061, 2]
    },
    {
      name: "莲湖区",
      value: [108.930194, 34.2656, 2]
    },
    {
      name: "未央区",
      value: [108.940022, 34.30823,2]
    },
    {
      name: "雁塔区",
      value: [108.920593, 34.213389, 2]
    },
    {
      name: "阎良区",
      value: [109.22002, 34.662141, 2]
    },
    {
      name: "临潼区",
      value: [109.210986, 34.372065, 2]
    },
    {
      name: "长安区",
      value: [108.940579, 34.157097, 2]
    },
    {
      name: "高陵区",
      value: [109.080896, 34.535065, 2]
    },
    {
      name: "鄠邑区",
      value: [108.600385, 34.108668, 2]
    },
    {
    name: "蓝田县",
    value: [109.310634, 34.156189, 2]
    },
    {
    name: "周至县",
    value: [108.210465, 34.161532, 2]
    },
  ];
    myChart.setOption({
      // grid3D: {},
      // xAxis3D:{},
      // yAxis3D:{},
      // zAxis3D:{},
      geo3D: {
        map: 'xian',
        show: false,
        zlevel: -10,
        boxWidth: 200,
        boxHeight: 4, //4:没有bar. 30:有bar,bar最高度30，按比例分配高度
        regionHeight: 3,
        shading: 'lambert',
        viewControl: {
            projection: 'perspective',
            autoRotate: false,
            damping: 0,
            rotateSensitivity: 2, //旋转操作的灵敏度
            rotateMouseButton: 'left', //旋转操作使用的鼠标按键
            zoomSensitivity: 2, //缩放操作的灵敏度
            panSensitivity: 2, //平移操作的灵敏度
            panMouseButton: 'right', //平移操作使用的鼠标按键

            distance: 200, //默认视角距离主体的距离
            center: [0, 0, 0],

            animation: true,
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut'
        },
      },
      series: [{
          type: 'map3D',
          map: 'xian',
          name: '西安',
          // viewControl: {
          //   distance: 110, //地图视角 控制初始大小
          //   rotateSensitivity: [1, 1],
          // },
          viewControl: {
            projection: 'perspective',
            autoRotate: false,
            damping: 0,
            rotateSensitivity: 2, //旋转操作的灵敏度
            rotateMouseButton: 'left', //旋转操作使用的鼠标按键
            zoomSensitivity: 2, //缩放操作的灵敏度
            panSensitivity: 2, //平移操作的灵敏度
            panMouseButton: 'right', //平移操作使用的鼠标按键

            distance: 110, //默认视角距离主体的距离
            center: [0, 0, 0],

            animation: true,
            animationDurationUpdate: 1000,
            animationEasingUpdate: 'cubicInOut'
          },
          label: {
              show: true, //是否显示市
              textStyle: {
                  color: 'white', //文字颜色
                  fontSize: 20, //文字大小
              },
          },
          itemStyle: {
              color: '#2B5890', //地图颜色
              borderWidth: 3, //分界线wdith
              borderColor: '#5578A5', //分界线颜色
          },
          emphasis: {
              label: {
                  show: true, //是否显示高亮
                  textStyle: {
                      color: '#fff', //高亮文字颜色
                  },
              },
              itemStyle: {
                  color: '#0489d6', //地图高亮颜色
              },
          },
        data: [],
      },
      {
        type: 'scatter3D',
        // type: 'bar3D',
        coordinateSystem: 'geo3D',
        zlevel: 4,
        symbol: 'path://m232.99844,160.209511l15.863519,0l0,-14.211071l16.27296,0l0,14.211071l15.863521,0l0,14.577861l-15.863521,0l0,14.211069l-16.27296,0l0,-14.211069l-15.863519,0l0,-14.577861z',
        // symbol: 'circle',
        // symbol: 'path://M658.059636 187.826424a31.030303 31.030303 0 0 1 0 43.876849l-288.364606 288.364606 288.364606 288.364606a31.030303 31.030303 0 0 1-43.876848 43.876848l-310.30303-310.30303a31.030303 31.030303 0 0 1 0-43.876848l310.30303-310.303031a31.030303 31.030303 0 0 1 43.876848 0z'
        symbolSize: 16,

        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: '{b}',

                textStyle: {
                    color: '#fff',
                    fontSize: 14,
                    backgroundColor: 'transparent' // 字体背景色
                },

            }
        },

        data: mapData,
        itemStyle: { //坐标点颜色
            color: '#2681cf',
            shadowBlur: 20,
            shadowColor: '#fff'
        },
        emphasis: {
            itemStyle: { //坐标点颜色
                color: '#1ca1d2',
            },
        }
    }, {
      type: 'scatter3D',
      // type: 'bar3D',
      coordinateSystem: 'geo3D',
      zlevel: 3,
      // symbol: 'path://m232.99844,160.209511l15.863519,0l0,-14.211071l16.27296,0l0,14.211071l15.863521,0l0,14.577861l-15.863521,0l0,14.211069l-16.27296,0l0,-14.211069l-15.863519,0l0,-14.577861z',
      symbol: 'circle',
      // symbol: 'path://M658.059636 187.826424a31.030303 31.030303 0 0 1 0 43.876849l-288.364606 288.364606 288.364606 288.364606a31.030303 31.030303 0 0 1-43.876848 43.876848l-310.30303-310.30303a31.030303 31.030303 0 0 1 0-43.876848l310.30303-310.303031a31.030303 31.030303 0 0 1 43.876848 0z'
      symbolSize: 5,
        label: {
          show: false,
          normal: {
              show: true,
              position: 'right',
              formatter: '{b}',

              textStyle: {
                  color: '#fff',
                  fontSize: 14,
                  backgroundColor: 'transparent' // 字体背景色
              },

          }
      },
      data: mapData2,
      itemStyle: { //坐标点颜色
          color: '#fff',
          shadowBlur: 20,
          shadowColor: '#fff'
      },
      emphasis: {
          itemStyle: { //坐标点颜色
              color: '#1ca1d2',
          },
      }
  }]
  });
  }

  public onDestroy(): void {

  }

  public onResize() {
    myChart.resize();
    this.render();
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