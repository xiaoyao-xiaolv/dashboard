(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["WynVisualClass"] = factory();
	else
		root["WynVisualClass"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/visual.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/visual.ts":
/*!***********************!*\
  !*** ./src/visual.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\n\n__webpack_require__(/*! ../style/visual.less */ \"./style/visual.less\");\n\nvar Visual =\n/** @class */\nfunction () {\n  function Visual(dom, host) {\n    this.onActionEventHandler = function (name) {\n      console.log(name);\n    };\n\n    this.container = dom;\n    this.container.classList.add('visual-date-time');\n    this.properties = {\n      shape: 'detailed',\n      textStyle: {\n        color: '#fff',\n        fontSize: '10pt',\n        fontFamily: '微软雅黑',\n        fontStyle: 'Normal',\n        fontWeight: 'Normal'\n      }\n    };\n  }\n\n  Visual.prototype.update = function (options) {\n    this.properties = options.properties;\n    this.render();\n  };\n\n  ;\n\n  Visual.prototype.render = function () {\n    var _this = this;\n\n    this.container.innerHTML = \"\";\n    var options = this.properties;\n    var p1 = document.createElement(\"p\");\n    p1.className = 'p1';\n    p1.style.whiteSpace = 'pre';\n    p1.style.fontSize = '20px';\n    p1.style.margin = '0 auto';\n    this.container.appendChild(p1); //显示时间\n\n    var nowtime = new Date();\n    var hour = nowtime.getHours(); //时\n\n    var minutes = nowtime.getMinutes(); //分\n\n    var seconds = nowtime.getSeconds(); //秒\n    //文字增加空格\n\n    var today = new Date();\n    var weekday;\n    if (today.getDay() == 0) weekday = \"星期日  \";\n    if (today.getDay() == 1) weekday = \"星期一  \";\n    if (today.getDay() == 2) weekday = \"星期二  \";\n    if (today.getDay() == 3) weekday = \"星期三  \";\n    if (today.getDay() == 4) weekday = \"星期四  \";\n    if (today.getDay() == 5) weekday = \"星期五  \";\n    if (today.getDay() == 6) weekday = \"星期六  \";\n    var date = today.getFullYear() + \"年\" + (today.getMonth() + 1) + \"月\" + today.getDate() + \"日\";\n    p1.style.color = options.textStyle.color;\n    p1.style.fontSize = options.textStyle.fontSize;\n    p1.style.fontFamily = options.textStyle.fontFamily;\n    p1.style.fontStyle = options.textStyle.fontStyle;\n    p1.style.fontWeight = options.textStyle.fontWeight;\n\n    switch (options.shape) {\n      case \"Short\":\n        {\n          p1.innerHTML = date;\n          break;\n        }\n\n      case \"Long\":\n        {\n          p1.innerHTML = date + \" \" + this.p(hour) + \":\" + this.p(minutes) + \":\" + this.p(seconds);\n          break;\n        }\n\n      default:\n        {\n          p1.innerHTML = date + \" \" + weekday + \" \" + this.p(hour) + \":\" + this.p(minutes) + \":\" + this.p(seconds);\n          break;\n        }\n    }\n\n    clearTimeout(timeID);\n    var timeID = setTimeout(function () {\n      _this.render();\n    }, 1000);\n  };\n\n  Visual.prototype.p = function (s) {\n    return s < 10 ? '0' + s : s;\n  }; // 自定义属性可见性\n\n\n  Visual.prototype.getInspectorVisibilityState = function (properties) {\n    return null;\n  }; // 功能按钮可见性\n\n\n  Visual.prototype.getActionBarVisibilityState = function (updateOptions) {\n    return null;\n  };\n\n  return Visual;\n}();\n\nexports[\"default\"] = Visual;\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

/***/ }),

/***/ "./style/visual.less":
/*!***************************!*\
  !*** ./style/visual.less ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://WynVisualClass/./style/visual.less?");

/***/ })

/******/ })["default"];
});