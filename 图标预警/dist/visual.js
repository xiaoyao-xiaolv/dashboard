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
eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n__webpack_require__(/*! ../style/visual.less */ \"./style/visual.less\");\n\nvar Visual =\n/** @class */\nfunction (_super) {\n  __extends(Visual, _super);\n\n  function Visual(dom, host, options) {\n    var _this = _super.call(this, dom, host, options) || this;\n\n    _this.container = dom;\n    _this.visualHost = host;\n    _this.items = [];\n    return _this;\n  }\n\n  Visual.prototype.update = function (options) {\n    var dataView = options.dataViews[0];\n\n    if (dataView) {\n      var plainData = dataView.plain;\n      var values = plainData.profile.values.values[0].display;\n      this.items = [plainData.data[0][values]];\n    }\n\n    this.properties = options.properties;\n    this.render();\n  };\n\n  Visual.prototype.render = function () {\n    var _this = this;\n\n    this.container.innerHTML = \"\";\n    var isMock = !this.items.length;\n    this.container.style.opacity = isMock ? '0.3' : '1';\n    var items = isMock ? Visual.mockItems : this.items;\n    var maskImage = new Image();\n    var options = this.properties;\n    maskImage.className = \"maskimage\";\n\n    maskImage.onload = function () {\n      _this.container.appendChild(maskImage);\n    };\n\n    for (var index = 0; index < 5; index++) {\n      var name_1 = 'Interval' + (index + 1);\n      var flag = false;\n      var str = options[name_1].split(\",\");\n\n      if (str.length - 1) {\n        var left = str[0].length;\n        var right = str[1].length;\n\n        if (left - 1) {\n          var leftValue = str[0].substring(1);\n          flag = str[0].substring(0, 1) === \"[\" ? items[0] >= leftValue : items[0] > leftValue;\n        }\n\n        if (right - 1) {\n          var rightValue = str[1].substring(0, str[1].length - 1);\n          flag = str[1].substring(right - 1, right) === \"]\" ? items[0] <= rightValue : items[0] < rightValue;\n        }\n      }\n\n      if (flag) {\n        var name_2 = 'Image' + (index + 1);\n        maskImage.src = options[name_2] || this.visualHost.assetsManager.getImage(name_2);\n        break;\n      }\n    }\n  };\n\n  Visual.prototype.onDestroy = function () {};\n\n  Visual.prototype.onResize = function () {\n    this.render();\n  };\n\n  Visual.prototype.getInspectorHiddenState = function (options) {\n    return null;\n  };\n\n  Visual.prototype.getActionBarHiddenState = function (options) {\n    return null;\n  };\n\n  Visual.mockItems = [10000];\n  return Visual;\n}(WynVisual);\n\nexports.default = Visual;\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

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