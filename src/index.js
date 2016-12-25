/* eslint-disable no-console */

// import ReadableStream from 'readable-stream';
import requestAnimFrame from './raf';
import capture from './capture';
import {
  createOnceLog,
  $,
  round
} from './utils';

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

/**/
const $rawCanvas = $('#diffy-raw-canvas');

/* */
const rawCtx = $rawCanvas.getContext('2d');

/* */
const rawWidth = $rawCanvas.width;

/* */
const rawHeight = $rawHeight.height;

/* */
const $blendCanvas = $('#diffy-blend-canvas');

/* */
const blendCtx = $blendCanvas.getContext('2d');

/* */
const blendWidth = $blendCanvas.width;

/* */
const blendHeight = $blendCanvas.height;

/* */
const blendImageData = blendCtx.getImageData(0, 0, blendWidth, blendHeight);

/* */
const createDebugView = (className) => {
  const container = document.createElement('div');
  container.className = className;
  const video = document.createElement('video');
  video.className = 'debug--video';
  const rawCanvas = document.createElement('canvas');
  rawCanvas.className = 'debug--raw-canvas';
  const blendCanvas = document.createElement('div');
  blendCanvas.className = 'debug--blend-canvas';

  const header = document.createElement('div');
  header.className = 'debug--header';
  const title = document.createElement('h6');
  title.className = 'debug--title';
  title.innerText = 'diffy debug view';
  const toggle = document.createElement('span');
  toggle.innerText = '-';
  header.appendChild(toggle);
  header.appendChild(title);

  container.appendChild(header);
  container.appendChild(video);
  container.appendChild(rawCanvas);
  container.appendChild(blendCanvas);

  document.body.appendChild('container');
};

/* */
const toVideo = () => {

}

/* */
const toCanvas = () => {

};


/* constraints object for getUserMedia */
const constraints = {
  audio: false,
  video: {
    width: 260,
    height: 200
  }
};

export const create = ({
  debug = false,
  debugViewClassName = 'diffy--debug-view',
  resolution: {
    x: resolutionX,
    y: resolutionY
  }
}) => {

  if (instanceExists) {
    throw new Error('It seems like an instance of diffy has already been created in this page.');
  }


  if(!window) {
    throw new Error('Diffy is meant for use in the browser environment.');
  }

  if (debug) {
    createDebugView();
  }

  instanceExists = true;
};

export default {
  VERSION,
  create
}

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


