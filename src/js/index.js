import DiffyWrapper from './diffy-wasm.js';
import requestAnimFrame from './raf.js';
import capture from './capture.js';
import { round } from './utils.js';

let instanceExists = false;

export const create = ({ resolution, sensitivity, threshold, debug, onFrame, sourceDimensions, containerClassName }) => {

  if(!window) {
    throw new Error(`
      Diffy.js (WASM) is meant to be used in the browser. :^)
      For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md
    `);
  }

  if(!('WebAssembly' in window)) {
    throw new Error(`
      Diffy.js (WASM) requires WebAssembly support.
      It looks like this environment does not support this feature. :(
      For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md
    `);
  }

  if(instanceExists) {
    throw new Error(`
      Yikes! It seems like a Diffy.js instance already exists on this page. :|
      For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md
    `);
  }

  const diffy = DiffyWrapper.create({
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