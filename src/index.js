/* eslint-disable no-console */

import ReadableStream from 'readable-stream';
import requestAnimFrame from './raf';
import capture from './capture';
import { createOnceLog, $ } from './utils';

/* allow only one instance per webpage */
let instanceExists = false;

/* version */
const VERSION = '1.0.0';

/* logger instances */
const onceLog_1 = createOnceLog();

/* */
const currentImageData = null;

/**/
const previousImageData = null;

/**/
const $debug = $('#diffy-debug');

/**/
const $toggle = $('#diffy-toggle');

/**/
const $video = $('#diffy-video');

/* constraints object for getUserMedia */
const constraints = {
  audio: false,
  video: {
    width: 260,
    height: 200
  }
};

const create = ({ resolution: { x: resolutionX, y: resolutionY } }) => {
  console.log('Create is called', resolutionY, resolutionX);
  if (instanceExists) {
    throw new Error('It seems like an instance of diffy has already been created in this page.');
  }
  instanceExists true;
};

const diffy = {
  VERSION,
  create
};

export default diffy;

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


