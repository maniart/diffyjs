/* eslint-disable no-console */

import ReadableStream from 'readable-stream';
import requestAnimFrame from './raf';


export default class Diffy {
  constructor(props) {
    this.foo = props;
    this.stream = new ReadableStream();
  }

  createStream() {
    console.log('create stream here');
  }
}

const loop = () => {
  console.log(new Date().getSeconds());
  requestAnimFrame(loop);
};

loop();


