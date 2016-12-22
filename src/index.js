/* eslint-disable no-console */

import ReadableStream from 'readable-stream';

export default class Diffy {
  constructor(props) {
    this.foo = props;
    this.stream = new ReadableStream();
  }

  createStream() {
    console.log('create stream here');
  }
}
console.log('hsssssssss')


