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
/***/ (function(module, exports) {

eval("// import React from \"react\";\n// import ReactDOM from \"react-dom\";\n// import { DatePicker } from 'antd';\n// import 'antd/dist/antd.css';\n// // @ts-ignore\n// import ReactCircleCard from \"./component.tsx\";\n//\n// const TupleFilter = WynVisual.Models.Filter.TupleFilter;\n// const Enums = WynVisual.Enums;\n//\n// export default class Visual extends WynVisual {\n//   private dom: any;\n//   private host: any;\n//   private isMock = true;\n//   private filter: VisualNS.TupleFilter;\n//   private reactRoot: React.ComponentElement<any, any>;\n//\n//   constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {\n//     super(dom, host, options);\n//     this.dom = dom;\n//     this.host = host;\n//     this.reactRoot = React.createElement(ReactCircleCard, {});\n//     ReactDOM.render(this.reactRoot, this.dom);\n//   }\n//\n//   // private onRangeChange = () => {\n//   //   let selectedDate = $( \"#datepicker\" ).datepicker('getDate');\n//   //   let year = selectedDate.getFullYear();\n//   //   let month = selectedDate.getMonth() + 1;\n//   //   let day = selectedDate.getDate();\n//   //   let value = [[{year},{month},{day}]];\n//   //   this.filter.setValues(value);\n//   //   console.log('this.filter');\n//   //   console.log(this.filter);\n//   //   const tuple = [{value: year}, {value: month}, {value: day}];\n//   //   if (this.filter.contains(tuple)) {\n//   //     this.filter.remove(tuple);\n//   //   } else {\n//   //     this.filter.add(tuple);\n//   //   }\n//   //   this.filter.setOperator( Enums.BasicFilterOperator.In );\n//   //   this.host.filterService.applyFilter(this.filter);\n//   // }\n//\n//   private render() {\n//     // if (!this.isMock) {\n//     //   ReactDOM.render(<DatePicker /> , $('#datepicker'));\n//     // }\n//   }\n//\n//   public update(options: VisualNS.IVisualUpdateOptions) {\n//     console.log(options);\n//     const dv = options.dataViews[0];\n//     if (dv && dv.plain) {\n//       const dimensionsProfiles = dv.plain.profile.dimensions.values;\n//       const filter = new TupleFilter(dimensionsProfiles);\n//       filter.fromJSON(options.filters[0] as VisualNS.ITupleFilter);\n//       this.isMock = false;\n//       this.filter = filter;\n//     } else {\n//       this.isMock = true;\n//     }\n//     this.render();\n//   }\n//\n//   public onDestroy() {\n//\n//   }\n//\n//   public onResize() {\n//\n//   }\n//\n//   public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {\n//     return null;\n//   }\n//\n//   public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {\n//     return null;\n//   }\n// }\n\n//# sourceURL=webpack://WynVisualClass/./src/visual.ts?");

/***/ })

/******/ })["default"];
});