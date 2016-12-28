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
	
	var logger_1 = (0, _utils.createOnceLog)();
	
	var messageData = void 0;
	var buffer = void 0;
	var data = void 0;
	var data1 = void 0;
	var data2 = void 0;
	var average1 = void 0;
	var average2 = void 0;
	var width = void 0;
	var height = void 0;
	var delta = void 0;
	var sensitivity = void 0;
	var threshold = void 0;
	
	var createDiffBuffer = function createDiffBuffer(messageEvent) {
	  var i = void 0;
	  messageData = messageEvent.data;
	  buffer = messageData.buffer;
	  data1 = messageData.data1;
	  data2 = messageData.data2;
	  width = messageData.width;
	  height = messageData.height;
	  sensitivity = messageData.sensitivity;
	  threshold = messageEvent.threshold;
	  data = new Uint32Array(buffer);
	
	  for (var y = 0; y < height; ++y) {
	    for (var x = 0; x < width; ++x) {
	      i = y * width + x;
	      average1 = (data1[i * 4] + data1[i * 4 + 1] + data1[i * 4 + 2]) / 3 / sensitivity;
	      average2 = (data2[i * 4] + data2[i * 4 + 1] + data2[i * 4 + 2]) / 3 / sensitivity;
	      delta = (0, _utils.polarize)((0, _utils.abs)(average1 - average2), 0x15);
	
	      data[i] = 255 << 24 | // alpha
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
//# sourceMappingURL=7e359e2abb0a2ef76b21.worker.js.map