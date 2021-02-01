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
eval("\n\nvar __extends = this && this.__extends || function () {\n  var extendStatics = function (d, b) {\n    extendStatics = Object.setPrototypeOf || {\n      __proto__: []\n    } instanceof Array && function (d, b) {\n      d.__proto__ = b;\n    } || function (d, b) {\n      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];\n    };\n\n    return extendStatics(d, b);\n  };\n\n  return function (d, b) {\n    extendStatics(d, b);\n\n    function __() {\n      this.constructor = d;\n    }\n\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n  };\n}();\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\n__webpack_require__(/*! ../style/visual.less */ \"./style/visual.less\");\n\nvar Visual =\n/** @class */\nfunction (_super) {\n  __extends(Visual, _super);\n\n  function Visual(dom, host, options) {\n    var _this = _super.call(this, dom, host, options) || this;\n\n    _this.container = dom;\n    _this.visualHost = host;\n    return _this;\n  }\n\n  Visual.prototype.render = function () {\n    if (this.container.childNodes[1]) {\n      this.container.removeChild(this.container.childNodes[1]);\n    }\n\n    this.container.innerHTML = \"\";\n    var isMock = !this.value;\n    this.container.style.opacity = isMock ? '0.3' : '1';\n    var value = isMock ? Visual.mockValue : this.value;\n    var options = this.properties; // create audio element\n\n    var audio = document.createElement('audio');\n    audio.setAttribute(\"autoplay\", \"autoplay\");\n\n    if (options.loop) {\n      audio.setAttribute(\"loop\", \"loop\");\n    }\n\n    this.container.appendChild(audio);\n\n    var controlAudio = function () {\n      audio.pause();\n    };\n\n    function compare(operator, comparedValue, value) {\n      switch (operator) {\n        case '[':\n          return value >= comparedValue;\n\n        case '(':\n          return value > comparedValue;\n\n        case ']':\n          return value <= comparedValue;\n\n        case ')':\n          return value < comparedValue;\n      }\n    }\n\n    for (var index = 0; index < 5; index++) {\n      var satisfied = false;\n      var name_1 = \"Interval\" + (index + 1);\n      var intervalArr = options[name_1].split(\",\"); // get value & operator\n\n      var leftValue = void 0,\n          rightValue = void 0,\n          leftOperator = void 0,\n          rightOperator = void 0;\n      var leftStrArr = /^(\\[|\\()(\\d+)/.exec(intervalArr[0]);\n      var rightStrArr = /^(\\d+)(\\]|\\))$/.exec(intervalArr[1]);\n\n      if (leftStrArr) {\n        leftValue = parseFloat(leftStrArr[2]);\n        leftOperator = leftStrArr[1];\n      }\n\n      if (rightStrArr) {\n        rightValue = parseFloat(rightStrArr[1]);\n        rightOperator = rightStrArr[2];\n      }\n\n      if (leftValue || rightValue) {\n        if (leftValue && rightValue) {\n          if (leftOperator === '[' && rightOperator === ']' && leftValue > rightValue || leftOperator === '(' || rightOperator === ')' && leftValue >= rightValue) {\n            return;\n          }\n\n          if (compare(leftOperator, leftValue, value) && compare(rightOperator, rightValue, value)) {\n            satisfied = true;\n          }\n        } else {\n          if (leftValue) {\n            if (compare(leftOperator, leftValue, value)) {\n              satisfied = true;\n            }\n          } else {\n            if (compare(rightOperator, rightValue, value)) {\n              satisfied = true;\n            }\n          }\n        }\n      }\n\n      if (satisfied) {\n        var audioIndex = 'Audio' + (index + 1);\n        var audioSrc = options[audioIndex];\n\n        if (/(http|https):\\/\\//.test(audioSrc)) {\n          audio.setAttribute(\"src\", audioSrc);\n        } else {\n          var protocol = window.location.protocol;\n          var host = window.location.host;\n          audioSrc = protocol + \"//\" + host + \"/api/dashboards/WebContents/\" + audioSrc;\n          audio.setAttribute(\"src\", audioSrc);\n        } // create button\n\n\n        var button = document.createElement('button');\n        button.innerHTML = options.buttonText;\n        button.style.cssText = \"\\n                                  border-radius:3px; \\n                                  padding: 5px; \\n                                  border: 1px solid transparent; \\n                                  background: \" + options.buttonColor + \";\\n                                  fontSize: \" + parseFloat(options.buttonTextStyle.fontSize) + \";\\n                                  color: \" + options.buttonTextStyle.color + \";\\n                                  fontFamily: \" + options.buttonTextStyle.fontFamily + \";\\n                                  fontStyle: \" + options.buttonTextStyle.fontStyle + \";\\n                                  fontWeight: \" + options.buttonTextStyle.fontWeight + \";\\n                                \";\n        button.addEventListener('click', controlAudio, false);\n        this.container.appendChild(button);\n        break;\n      }\n    }\n  };\n\n  Visual.prototype.update = function (options) {\n    if (options.isFocus || options.isViewer) {\n      var plainData = options.dataViews[0] && options.dataViews[0].plain;\n\n      if (plainData) {\n        var valueName = plainData.profile.values.values[0].display;\n        this.value = plainData.data[0][valueName];\n      }\n\n      this.properties = options.properties;\n      this.render();\n    }\n  };\n\n  Visual.prototype.onDestroy = function () {};\n\n  Visual.prototype.onResize = function () {\n    this.render();\n  };\n\n  Visual.prototype.getInspectorHiddenState = function (options) {\n    return null;\n  };\n\n  Visual.prototype.getActionBarHiddenState = function (options) {\n    return null;\n  };\n\n  Visual.mockValue = 30000;\n  return Visual;\n}(WynVisual);\n\nexports.default = Visual;\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

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