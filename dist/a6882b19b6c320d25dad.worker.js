/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _utils = __webpack_require__(1);
	
	var buffer = void 0;
	var pixelData = void 0;
	var data1 = void 0;
	var data2 = void 0;
	var average1 = void 0;
	var average2 = void 0;
	var width = void 0;
	var height = void 0;
	var delta = void 0;
	var sensitivity = void 0;
	var actualSensitivity = void 0;
	
	var createDiffBuffer = function createDiffBuffer(_ref) {
	  var _ref$data = _ref.data,
	      buffer = _ref$data.buffer,
	      data1 = _ref$data.data1,
	      data2 = _ref$data.data2,
	      width = _ref$data.width,
	      height = _ref$data.height,
	      sensitivity = _ref$data.sensitivity;
	
	  var i = 0;
	  actualSensitivity = 1 - sensitivity;
	
	  pixelData = new Uint32Array(buffer);
	  for (var y = 0; y < height; ++y) {
	    for (var x = 0; x < width; ++x) {
	      i = y * width + x;
	      average1 = (data1[i * 4] + data1[i * 4 + 1] + data1[i * 4 + 2]) / 3 / actualSensitivity;
	      average2 = (data2[i * 4] + data2[i * 4 + 1] + data2[i * 4 + 2]) / 3 / actualSensitivity;
	      delta = (0, _utils.polarize)((0, _utils.abs)(average1 - average2), 0x15);
	      pixelData[i] = 255 << 24 | // alpha
	      delta << 16 | // blue
	      delta << 8 | // green
	      delta; // red
	    }
	  }
	
	  postMessage(buffer);
	};
	
	onmessage = createDiffBuffer;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/* eslint-disable no-console */
	
	/*
	  utility function to log only once
	  useful for logging in loops
	*/
	var createOnceLog = exports.createOnceLog = function createOnceLog() {
	  var counter = 0;
	  return function onceLog() {
	    if (counter < 1) {
	      var _console;
	
	      (_console = console).log.apply(_console, arguments);
	    }
	    counter++;
	  };
	};
	
	/*
	  utility function to access DOM references
	*/
	var $ = exports.$ = function $(selector) {
	  return document.querySelector(selector);
	};
	
	/*
	  bitwise Math.round
	*/
	var round = exports.round = function round(number) {
	  return number + .5 >> 0;
	};
	
	/*
	  butwise Math.abs
	*/
	var abs = exports.abs = function abs(value) {
	  return (value ^ value >> 31) - (value >> 31);
	};
	
	/*
	  polarize pixel values based on value and threshold
	*/
	var polarize = exports.polarize = function polarize(value, threshold) {
	  return value > threshold ? 0x00 : 0XFF;
	};

/***/ }
/******/ ]);
//# sourceMappingURL=a6882b19b6c320d25dad.worker.js.map