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
eval("\n\nexports.__esModule = true;\n\n__webpack_require__(/*! ../style/visual.less */ \"./style/visual.less\");\n\n__webpack_require__(/*! ../style/animate.less */ \"./style/animate.less\");\n\nvar Visual =\n/** @class */\nfunction () {\n  function Visual(dom, host, options) {\n    this.host = host;\n    this.container = dom;\n    this.items = [];\n    this.properties = {\n      custom: true,\n      customText: '请输入标题',\n      textStyle: {\n        fontSize: '20pt',\n        fontFamily: '微软雅黑',\n        fontStyle: 'Normal',\n        fontWeight: 'Normal'\n      },\n      customAnimate: false,\n      customAnimateName: 'animate__bounceIn',\n      customAnimateDelay: '0s',\n      customAnimateRepeat: 'animate__repeat-1'\n    };\n    this.selectEvent(options);\n  }\n\n  Visual.prototype.selectEvent = function (options) {\n    var _this = this;\n\n    this.selection = this.host.selectionService.createSelectionId();\n    this.container.addEventListener('click', function (params) {\n      var leftMouseButton = options.properties.leftMouseButton;\n      console.log(leftMouseButton);\n      console.log(params);\n\n      _this.host.commandService.execute([{\n        name: leftMouseButton,\n        payload: {\n          selectionIds: _this.selection,\n          position: {\n            x: params.x,\n            y: params.y\n          }\n        }\n      }]);\n    });\n    this.container.addEventListener('mouseup', function (params) {\n      document.oncontextmenu = function () {\n        return false;\n      };\n\n      if (params.button === 2) {\n        _this.host.contextMenuService.show({\n          position: {\n            x: params.x,\n            y: params.y\n          },\n          menu: true\n        }, 10);\n\n        return;\n      } else {\n        _this.host.contextMenuService.hide();\n      }\n    });\n  };\n\n  Visual.prototype.update = function (options) {\n    var dataView = options.dataViews[0];\n    this.items = [];\n\n    if (dataView && dataView.plain.profile.dimensions.values.length) {\n      var plainData = dataView.plain;\n      var dimensions_1 = plainData.profile.dimensions.values;\n      this.items = plainData.data.map(function (item) {\n        return item[dimensions_1[0].display];\n      });\n    }\n\n    this.properties = options.properties;\n    ;\n    this.render();\n  };\n\n  Visual.prototype.render = function () {\n    this.container.innerHTML = \"\";\n    var options = this.properties;\n    var isMock = !this.items.length;\n    var items = isMock ? options.customText : this.items[0];\n    var dowebok = document.createElement(\"div\");\n    var p1 = document.createElement(\"h1\"); // control position\n\n    dowebok.classList.add('title-text');\n    dowebok.classList.add(options.customTextAlign);\n    dowebok.classList.add(options.customTextVerticalAlign);\n\n    if (options.customTextAlign === 'v-center' && options.customTextVerticalAlign === 'h-center') {\n      dowebok.classList.add('center');\n    }\n\n    p1.innerHTML = items;\n    p1.style.color = options.textStyle.color;\n    p1.style.fontSize = options.textStyle.fontSize;\n    p1.style.fontFamily = options.textStyle.fontFamily;\n    p1.style.fontStyle = options.textStyle.fontStyle;\n    p1.style.fontWeight = options.textStyle.fontWeight; // add  animate class name\n\n    if (options.customAnimate) {\n      var addAnimateName = 'animate__';\n\n      if (options.customAnimateName === 'flip') {\n        addAnimateName = addAnimateName + options.customAnimateName + options.customAnimateFlipDirection;\n      } else if (options.customAnimateName === 'rotateIn') {\n        addAnimateName = addAnimateName + options.customAnimateName + options.customAnimateRotateDirection;\n      } else {\n        addAnimateName = addAnimateName + options.customAnimateName + options.customAnimateDirection;\n      }\n\n      var addAnimateDelay = 'animate__' + options.customAnimateDelay;\n      var addAnimateRepeat = 'animate__' + options.customAnimateRepeat;\n      p1.classList.add('animate__animated');\n      p1.classList.add(addAnimateName);\n      p1.classList.add(addAnimateDelay);\n      p1.classList.add(addAnimateRepeat);\n      p1.style.setProperty('--animate-duration', options.customAnimateDuration + \"s\");\n    }\n\n    dowebok.appendChild(p1);\n    this.container.appendChild(dowebok);\n  };\n\n  Visual.prototype.onDestroy = function () {};\n\n  Visual.prototype.onResize = function () {};\n\n  Visual.prototype.getInspectorHiddenState = function (updateOptions) {\n    // control animate display\n    if (!updateOptions.properties.customAnimate) {\n      return ['customAnimateName', 'customAnimateDirection', 'customAnimateDuration', 'customAnimateRotateDirection', 'customAnimateFlipDirection', 'customAnimateDelay', 'customAnimateRepeat'];\n    }\n\n    if (updateOptions.properties.customAnimateName === 'flip') {\n      return ['customAnimateDirection', 'customAnimateRotateDirection'];\n    }\n\n    if (updateOptions.properties.customAnimateName === 'rotateIn') {\n      return ['customAnimateDirection', 'customAnimateFlipDirection'];\n    }\n\n    if (updateOptions.properties.customAnimateName !== 'rotateIn' || updateOptions.properties.customAnimateName !== 'flip') {\n      return ['customAnimateRotateDirection', 'customAnimateFlipDirection'];\n    }\n\n    return null;\n  };\n\n  Visual.prototype.getActionBarHiddenState = function (options) {\n    return null;\n  };\n\n  return Visual;\n}();\n\nexports[\"default\"] = Visual;\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

/***/ }),

/***/ "./style/animate.less":
/*!****************************!*\
  !*** ./style/animate.less ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack://WynVisualClass/./style/animate.less?");

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