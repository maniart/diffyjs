/* eslint-disable no-console */

import Diffy from './Diffy';
import requestAnimFrame from './raf';
import capture from './capture';

export const create = ({ resolution, sensitivity, threshold, debug }) => {

  if(!window) {
    throw new Error('Diffy.js is meant to be used in the browser. :^) ');
  }

  if(!'Worker' in window) {
    throw new Error('Diffy.js requires Web Workers. It looks like this environment does not support it. :(');
  }

  return Diffy.create({
    tickFn: requestAnimFrame,
    captureFn: capture,
    resolution,
    sensitivity,
    threshold
  });

}
