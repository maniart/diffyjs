/* eslint-disable no-console */

import Diffy from './Diffy';
import requestAnimFrame from './raf';
import capture from './capture';
import DiffWorker from 'worker-loader?inline!./worker';
import { round } from './utils';

let instanceExists = false;

export const create = ({ resolution, sensitivity, threshold, debug, onFrame, sourceDimensions, containerClassName }) => {

  if(!window) {
    throw new Error(`
      Diffy.js is meant to be used in the browser. :^)
      For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md
    `);
  }

  if(!('Worker' in window)) {
    throw new Error(`
      Diffy.js requires Web Workers.
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

  const diffy = Diffy.create({
    tickFn: requestAnimFrame,
    captureFn: capture,
    DiffWorker,
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
}
