/* eslint-disable no-console */

import Diffy from './Diffy';
import requestAnimFrame from './raf';
import capture from './capture';

const create = ({ resolution, sensitivity, threshold, debug }) => {

  if(!window) {
    throw new Error(`
      Diffy.js is meant to be used in the browser. :^)
      For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md
    `);
  }

  if(!'Worker' in window) {
    throw new Error(
      `Diffy.js requires Web Workers.
      It looks like this environment does not support this feature. :(
      For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md`);
  }

  return Diffy.create({
    tickFn: requestAnimFrame,
    captureFn: capture,
    resolution,
    sensitivity,
    threshold,
    debug
  });

}

export default create;
