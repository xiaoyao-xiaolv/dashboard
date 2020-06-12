import '../style/visual.less';
var RADIUS = 130;
export default class Visual {
  private visualHost: any;
  private container: HTMLDivElement;
  private items: any;
  static mockItems = [{ "name": "山西省", "value": 2201 }, { "name": "江苏省", "value": 1251 }, { "name": "西藏自治区", "value": 1104 }, { "name": "陕西省", "value": 1529 }, { "name": "四川省", "value": 2771 }, { "name": "江西省", "value": 1649 }, { "name": "河南省", "value": 2566 }, { "name": "河北省", "value": 2256 }, { "name": "新疆维吾尔自治区", "value": 1332 }, { "name": "福建省", "value": 1077 }, { "name": "吉林省", "value": 814 }, { "name": "安徽省", "value": 1290 }, { "name": "重庆市", "value": 748 }, { "name": "云南省", "value": 1770 }, { "name": "甘肃省", "value": 971 }, { "name": "广西壮族自治区", "value": 1338 }, { "name": "广东省", "value": 1677 }, { "name": "黑龙江省", "value": 1884 }, { "name": "山东省", "value": 1908 }, { "name": "湖南省", "value": 1338 }, { "name": "海南省", "value": 504 }, { "name": "内蒙古自治区", "value": 1087 }, { "name": "上海市", "value": 140 }, { "name": "辽宁省", "value": 1513 }, { "name": "青海省", "value": 980 }, { "name": "宁夏回族自治区", "value": 354 }, { "name": "湖北省", "value": 1204 }, { "name": "北京市", "value": 184 }, { "name": "浙江省", "value": 1262 }, { "name": "贵州省", "value": 914 }, { "name": "澳门特别行政区", "value": 190 }, { "name": "香港特别行政区", "value": 104 }, { "name": "天津市", "value": 176 }];
  constructor(dom: HTMLDivElement, host: any) {
    this.container = dom;
    this.visualHost = host;
    this.items = [];
  }

  public update(options: any) {
    const dataView = options.dataViews[0];
    this.items = [];
    if (dataView &&
      dataView.plain.profile.values.values.length && dataView.plain.profile.dimensions.values.length) {
      const plainData = dataView.plain;
      let dimensions = plainData.profile.dimensions.values;
      let values = plainData.profile.values.values;
      this.items = plainData.data.map(function (item) {
        return {
          name: item[dimensions[0].display],
          value: item[values[0].display] || 0,
        };
      });
    }
    this.render();
  }

  private render() {
    this.container.innerHTML = "";
    const isMock = !this.items.length;
    const items = isMock ? Visual.mockItems : this.items;
    this.container.style.opacity = isMock ? '0.3' : '1';
    const size = getComputedStyle(this.container);
    const width = parseInt(size.width);
    const height = parseInt(size.height);
    RADIUS = 130;
    if (width / height < 1.5) {
      RADIUS = RADIUS * (width / 375);
    }else{
      RADIUS = 100 * (height / 300);
    }
    let tagBall = document.createElement("div");
    tagBall.className = "tagBall";
    for (let i = 0; i < items.length; i++) {
      let tag = document.createElement("a");
      tag.className = "tag";
      tag.innerHTML = items[i].name;
      tagBall.appendChild(tag);
    }
    this.container.appendChild(tagBall);
    this.Animation();
  }



  private Animation() {
    var tagEle = "querySelectorAll" in document ? document.querySelectorAll(".tag") : getClass("tag");
    var paper = "querySelectorAll" in document ? document.querySelector(".tagBall") : getClass("tagBall")[0];
    var fallLength = 500;
    var tags = [];
    var angleX = Math.PI / 500;
    var angleY = Math.PI / 500;
    var CX = paper.offsetWidth / 2;
    var CY = paper.offsetHeight / 2;
    var EX = paper.offsetLeft + document.body.scrollLeft + document.documentElement.scrollLeft;
    var EY = paper.offsetTop + document.body.scrollTop + document.documentElement.scrollTop;

    function getClass(className) {
      var ele = document.getElementsByTagName("*");
      var classEle = [];
      for (var i = 0; i < ele.length; i++) {
        var cn = ele[i].className;
        if (cn === className) {
          classEle.push(ele[i]);
        }
      }
      return classEle;
    }

    function innit() {
      for (var i = 0; i < tagEle.length; i++) {
        var k = -1 + (2 * (i + 1) - 1) / tagEle.length;
        var a = Math.acos(k);
        var b = a * Math.sqrt(tagEle.length * Math.PI);
        var x = RADIUS * Math.sin(a) * Math.cos(b);
        var y = RADIUS * Math.sin(a) * Math.sin(b);
        var z = RADIUS * Math.cos(a);
        var t = new tag(tagEle[i], x, y, z);
        tagEle[i].style.color = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";
        tags.push(t);
        t.move();
      }
    }

    Array.prototype.forEach = function (callback) {
      for (var i = 0; i < this.length; i++) {
        callback.call(this[i]);
      }
    }

    function animate() {
      rotateX();
      rotateY();
      tags.forEach(function () {
        this.move();
      });

      requestAnimationFrame(animate);
    }


    paper.onmousemove = function (ev) {

      var oEvent = window.event || ev;
      var x = oEvent.clientX - EX - CX;
      var y = oEvent.clientY - EY - CY;
      angleY = x * 0.0001;
      angleX = y * 0.0001;
    };
    paper.onmouseout = function () {
      angleX = Math.PI / 500;
      angleY = Math.PI / 500;
    };


    function rotateX() {
      var cos = Math.cos(angleX);
      var sin = Math.sin(angleX);
      tags.forEach(function () {
        var y1 = this.y * cos - this.z * sin;
        var z1 = this.z * cos + this.y * sin;
        this.y = y1;
        this.z = z1;
      })

    }

    function rotateY() {
      var cos = Math.cos(angleY);
      var sin = Math.sin(angleY);
      tags.forEach(function () {
        var x1 = this.x * cos - this.z * sin;
        var z1 = this.z * cos + this.x * sin;
        this.x = x1;
        this.z = z1;
      })
    }

    var tag = function (ele, x, y, z) {
      this.ele = ele;
      this.x = x;
      this.y = y;
      this.z = z;
    }

    tag.prototype = {
      move: function () {
        var scale = fallLength / (fallLength - this.z);
        var alpha = (this.z + RADIUS) / (2 * RADIUS);
        var left = this.x + CX - this.ele.offsetWidth / 2 + "px";
        var top = this.y + CY - this.ele.offsetHeight / 2 + "px";
        var transform = 'translate(' + left + ', ' + top + ') scale(' + scale + ')';
        this.ele.style.opacity = alpha + 0.5;
        this.ele.style.zIndex = scale * 100;
        this.ele.style.transform = transform;
        this.ele.style.webkitTransform = transform;
      }
    }
    innit();
    animate();
  }

  public onResize() {
    const size = getComputedStyle(this.container);
    const width = parseInt(size.width);
    const height = parseInt(size.height);
    RADIUS = 130;
    if (width / height < 1.5) {
      RADIUS = RADIUS * (width / 375);
    }else{
      RADIUS = 100 * (height / 300);
    }
    this.render();
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