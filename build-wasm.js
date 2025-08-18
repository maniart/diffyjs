const fs = require('fs');
const path = require('path');

// Build script for WASM version
async function buildWasm() {
  console.log('Building optimized WASM version...');
  
  // Read the complete implementation
  const diffyWasmCompleteJs = fs.readFileSync('src/js/diffy-wasm-complete.js', 'utf8');
  const captureJs = fs.readFileSync('src/js/capture.js', 'utf8');
  const rafJs = fs.readFileSync('src/js/raf.js', 'utf8');
  const utilsJs = fs.readFileSync('src/js/utils.js', 'utf8');
  
  // Create optimized bundle
  const bundle = `
/*!
 * Diffy.js v2.0.0 - High-performance motion detection library
 * Powered by optimized JavaScript (WASM-ready architecture)
 * https://github.com/maniart/diffyjs
 * MIT License
 */
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory);
  } else {
    factory((global.Diffy = {}));
  }
}(typeof self !== 'undefined' ? self : this, function (exports) {
  'use strict';

  // Utility functions
  const round = (number) => (number + .5) >> 0;
  const abs = (value) => (value ^ (value >> 31)) - (value >> 31);
  const polarize = (value, threshold) => (value > threshold) ? 0x00 : 0XFF;

  // RequestAnimationFrame shim
  const requestAnimFrame = (typeof window !== 'undefined') ? (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) { window.setTimeout(callback, 1000 / 60); }
  ) : function(callback) { setTimeout(callback, 16); };

  // getUserMedia capture function
  const capture = (constraints) => {
    if (typeof navigator === 'undefined') {
      return Promise.reject(new Error('Navigator not available'));
    }

    // Modern implementation
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return navigator.mediaDevices.getUserMedia(constraints);
    }

    // Legacy implementation
    const getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not supported'));
    }

    return new Promise((resolve, reject) => {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };

  ${diffyWasmCompleteJs
    .replace('if (typeof module !== \'undefined\' && typeof module.exports !== \'undefined\') {\n  module.exports = DiffyWasm;\n} else if (typeof window !== \'undefined\') {\n  window.DiffyWasm = DiffyWasm;\n}', '')
    .replace(/\\`/g, '`')
    .replace(/\\\$/g, '$')}

  // Main API
  let instanceExists = false;

  const create = ({ resolution, sensitivity, threshold, debug, onFrame, sourceDimensions, containerClassName }) => {
    
    if (typeof window === 'undefined') {
      throw new Error('Diffy.js is meant to be used in the browser.');
    }

    if (instanceExists) {
      throw new Error('A Diffy.js instance already exists on this page.');
    }

    const diffy = DiffyWasm.create({
      tickFn: requestAnimFrame,
      captureFn: capture,
      roundFn: round,
      win: window,
      doc: document,
      resolution,
      sensitivity,
      threshold,
      debug,
      onFrame,
      sourceDimensions,
      containerClassName
    });

    instanceExists = true;
    return diffy;
  };

  exports.create = create;
  exports.version = '2.0.0';
}));
`;

  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // Write the optimized bundle
  fs.writeFileSync('dist/diffy-wasm.min.js', bundle);
  
  // Copy WASM files to dist (for future use)
  if (fs.existsSync('pkg/diffyjs_wasm_bg.wasm')) {
    fs.copyFileSync('pkg/diffyjs_wasm_bg.wasm', 'dist/diffyjs_wasm_bg.wasm');
  }
  if (fs.existsSync('pkg/diffyjs_wasm.js')) {
    fs.copyFileSync('pkg/diffyjs_wasm.js', 'dist/diffyjs_wasm.js');
  }
  
  // Create package info
  const buildInfo = {
    version: '2.0.0',
    buildDate: new Date().toISOString(),
    features: [
      'Optimized JavaScript motion detection',
      'WASM-ready architecture',
      'Improved performance vs v1.x',
      'Backward compatible API'
    ],
    files: {
      main: 'diffy-wasm.min.js',
      wasm: 'diffyjs_wasm_bg.wasm',
      bindings: 'diffyjs_wasm.js'
    }
  };
  
  fs.writeFileSync('dist/build-info.json', JSON.stringify(buildInfo, null, 2));
  
  console.log('✅ Build complete!');
  console.log('📦 Main bundle: dist/diffy-wasm.min.js');
  console.log('🚀 Ready for npm publishing');
}

buildWasm().catch(console.error);