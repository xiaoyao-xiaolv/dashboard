(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("AMap"));
	else if(typeof define === 'function' && define.amd)
		define(["AMap"], factory);
	else if(typeof exports === 'object')
		exports["WynVisualClass"] = factory(require("AMap"));
	else
		root["WynVisualClass"] = factory(root["AMap"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_AMap__) {
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
eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nvar __importDefault = this && this.__importDefault || function (mod) {\n  return mod && mod.__esModule ? mod : {\n    \"default\": mod\n  };\n};\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n__webpack_require__(/*! ../style/visual.less */ \"./style/visual.less\"); // @ts-ignore\n\n\nvar AMap_1 = __importDefault(__webpack_require__(/*! AMap */ \"AMap\"));\n\nvar Visual =\n/** @class */\nfunction (_super) {\n  __extends(Visual, _super);\n\n  function Visual(dom, host, options) {\n    var _this = _super.call(this, dom, host, options) || this;\n\n    _this.container = dom;\n    console.log('container');\n    console.log(_this.container);\n    return _this;\n  }\n\n  Visual.prototype.update = function (options) {\n    console.log(options);\n    var map = new AMap_1.default.Map('visualDom', {\n      resizeEnable: true,\n      zoom: 11,\n      center: [116.397428, 39.90923]\n    });\n  };\n\n  Visual.prototype.onDestroy = function () {};\n\n  Visual.prototype.onResize = function () {\n    // @ts-ignore\n    this.update();\n  };\n\n  Visual.prototype.getInspectorHiddenState = function (options) {\n    return null;\n  };\n\n  Visual.prototype.getActionBarHiddenState = function (options) {\n    return null;\n  };\n\n  return Visual;\n}(WynVisual);\n\nexports.default = Visual;\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

/***/ }),

/***/ "./style/visual.less":
/*!***************************!*\
  !*** ./style/visual.less ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://WynVisualClass/./style/visual.less?");

/***/ }),

/***/ "AMap":
/*!***********************!*\
  !*** external "AMap" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_AMap__;\n\n//# sourceURL=webpack://WynVisualClass/external_%22AMap%22?");

/***/ })

/******/ })["default"];
});