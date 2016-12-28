/* eslint-disable no-console */

import Diffy from './Diffy';
import requestAnimFrame from './raf';
import capture from './capture';

export const create = ({ resolution }) => {
  return Diffy.create({
    tickFn: requestAnimFrame,
    captureFn: capture,
    debug: true,
    resolution
  });

}
