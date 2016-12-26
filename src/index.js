/* eslint-disable no-console */

import Diffy from './Diffy';
import requestAnimFrame from './raf';
import capture from './capture';
import {
  createOnceLog,
  $,
  round
} from './utils';


export const create = ({ resolution }) => {
  console.log('Create called');
  return Diffy.create({
    tickFn: requestAnimFrame,
    captureFn: capture,
    debug: true,
    resolution
  });

}


// /**/
// const $debug = $('#diffy-debug');

// /**/
// const $toggle = $('#diffy-toggle');

// /**/
// const $video = $('#diffy-video');

// /**/
// const $rawCanvas = $('#diffy-raw-canvas');

// /* */
// const rawCtx = $rawCanvas.getContext('2d');

// /* */
// const rawWidth = $rawCanvas.width;

// /* */
// const rawHeight = $rawHeight.height;

// /* */
// const $blendCanvas = $('#diffy-blend-canvas');

// /* */
// const blendCtx = $blendCanvas.getContext('2d');

// /* */
// const blendWidth = $blendCanvas.width;

// /* */
// const blendHeight = $blendCanvas.height;

// /* */
// const blendImageData = blendCtx.getImageData(0, 0, blendWidth, blendHeight);
