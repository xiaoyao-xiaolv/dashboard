!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.WynVisualClass=e():t.WynVisualClass=e()}(window,function(){return i={},o.m=n=[function(t,e,n){"use strict";e.__esModule=!0,n(1),n(2);var i=(o.prototype.update=function(t){var e,n,i=t.dataViews[0];this.items=[],i&&i.plain.profile.dimensions.values.length&&(e=i.plain,n=e.profile.dimensions.values,this.items=e.data.map(function(t){return t[n[0].display]})),this.properties=t.properties,this.render()},o.prototype.render=function(){this.container.innerHTML="";var t,e,n,i=this.properties,o=this.items.length?this.items[0]:i.customText,a=document.createElement("div"),r=document.createElement("h1");a.classList.add("title-text"),a.classList.add(i.customTextAlign),a.classList.add(i.customTextVerticalAlign),"v-center"===i.customTextAlign&&"h-center"===i.customTextVerticalAlign&&a.classList.add("center"),r.innerHTML=o,r.style.color=i.textStyle.color,r.style.fontSize=i.textStyle.fontSize,r.style.fontFamily=i.textStyle.fontFamily,r.style.fontStyle=i.textStyle.fontStyle,r.style.fontWeight=i.textStyle.fontWeight,i.customAnimate&&(t="animate__",t="flip"===i.customAnimateName?t+i.customAnimateName+i.customAnimateFlipDirection:"rotateIn"===i.customAnimateName?t+i.customAnimateName+i.customAnimateRotateDirection:t+i.customAnimateName+i.customAnimateDirection,e="animate__"+i.customAnimateDelay,n="animate__"+i.customAnimateRepeat,r.classList.add("animate__animated"),r.classList.add(t),r.classList.add(e),r.classList.add(n),r.style.setProperty("--animate-duration",i.customAnimateDuration+"s")),a.appendChild(r),this.container.appendChild(a)},o.prototype.onDestroy=function(){},o.prototype.onResize=function(){},o.prototype.getInspectorHiddenState=function(t){return t.properties.customAnimate?"flip"===t.properties.customAnimateName?["customAnimateDirection","customAnimateRotateDirection"]:"rotateIn"===t.properties.customAnimateName?["customAnimateDirection","customAnimateFlipDirection"]:"rotateIn"!==t.properties.customAnimateName||"flip"!==t.properties.customAnimateName?["customAnimateRotateDirection","customAnimateFlipDirection"]:null:["customAnimateName","customAnimateDirection","customAnimateDuration","customAnimateRotateDirection","customAnimateFlipDirection","customAnimateDelay","customAnimateRepeat"]},o.prototype.getActionBarHiddenState=function(t){return null},o);function o(t,e,n){this.container=t,this.items=[],this.properties={custom:!0,customText:"请输入标题",textStyle:{fontSize:"20pt",fontFamily:"微软雅黑",fontStyle:"Normal",fontWeight:"Normal"},customAnimate:!1,customAnimateName:"animate__bounceIn",customAnimateDelay:"0s",customAnimateRepeat:"animate__repeat-1"}}e.default=i},function(t,e,n){},function(t,e,n){}],o.c=i,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(n,i,function(t){return e[t]}.bind(null,i));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0).default;function o(t){if(i[t])return i[t].exports;var e=i[t]={i:t,l:!1,exports:{}};return n[t].call(e.exports,e,e.exports,o),e.l=!0,e.exports}var n,i});