/* eslint-disable no-console */

import ReadableStream from 'readable-stream';
import requestAnimFrame from './raf';
import capture from './capture';
import { createOnceLog, $ } from './utils';


/*
  logger instances
*/
const onceLog_1 = createOnceLog();

/*

*/
const currentImageData = null;

/*

*/
const previousImageData = null;

/*

*/
const $debug = $('#diffy-debug');

/*

*/
const $toggle = $('#diffy-toggle');

/*

*/
const $video = $('#diffy-video');

/*

*/



/*
  constraints object for getUserMedia
*/
const constraints = {
  audio: false,
  video: {
    width: 260,
    height: 200
  }
};

const VERSION = '1.0.0';
const inctanceCount = 0;

const create = () => {
  console.log('Create diffy');
}

export default create;

// const diffy = {
//   VERSION: '1.0.0',
//   instanceCount: 0,
//   createDiffy() {
//     if (instanceCount !== 0) {
//       throw new Error('It seems like an instance of diffy has already been created in this page.');
//     }
//     this.instanceCount += 1;
//     console.log('Yay! Diffy Making!');

//   }
// }

// export default diffy;

// export default class Diffy {
//   constructor(props) {
//     this.foo = props;
//     this.stream = new ReadableStream();
//   }

//   createStream() {
//     console.log('create stream here');
//   }
// }

const loop = () => {
  onceLog_1('Loop is running.');
  requestAnimFrame(loop);
};

loop();

console.log(capture(constraints));


