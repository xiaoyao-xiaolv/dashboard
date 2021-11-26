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
eval("\n\nexports.__esModule = true;\n\n__webpack_require__(/*! ../style/visual.less */ \"./style/visual.less\");\n\nvar Visual =\n/** @class */\nfunction () {\n  function Visual(dom, host) {\n    this.onActionEventHandler = function (name) {\n      console.log(name);\n    };\n\n    this.container = dom;\n    this.items = '';\n    this.properties = {\n      videoUrl: 'http://video1.grapecity.com.cn/WynEnterprise/online/wyn3.0.mp4'\n    };\n  }\n\n  Visual.prototype.update = function (options) {\n    var dataView = options.dataViews[0];\n    this.items = '';\n\n    if (dataView && dataView.plain.profile.dimensions.values.length) {\n      var plainData = dataView.plain;\n      var dimensions = plainData.profile.dimensions.values;\n      this.items = plainData.data[0][dimensions[0].display];\n    }\n\n    this.properties = options.properties;\n    this.render();\n  };\n\n  Visual.prototype.render = function () {\n    this.container.innerHTML = \"\";\n    var options = this.properties;\n    var items = options.custom ? options.videoUrl : this.items;\n    var video = document.createElement(\"video\");\n    video.muted = false;\n    video.setAttribute(\"controls\", \"controls\");\n    video.setAttribute(\"autoplay\", \"autoplay\");\n    video.setAttribute(\"loop\", \"loop\");\n    video.setAttribute(\"preload\", \"auto\");\n    video.setAttribute(\"height\", \"100%\");\n    video.setAttribute(\"width\", \"100%\");\n    video.setAttribute(\"src\", items);\n    this.container.appendChild(video);\n  }; // 自定义属性可见性\n\n\n  Visual.prototype.getInspectorHiddenState = function (updateOptions) {\n    if (!updateOptions.properties.custom) {\n      return ['videoUrl'];\n    }\n\n    return null;\n  }; // 功能按钮可见性\n\n\n  Visual.prototype.getActionBarHiddenState = function (updateOptions) {\n    return null;\n  };\n\n  return Visual;\n}();\n\nexports[\"default\"] = Visual;\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

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