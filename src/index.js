import ReadableStream from 'readable-stream';

export default class Diffy {
  constructor(props) {
    console.log('Aw yis');
    this.stream = new ReadableStream();
  }

  createStream() {
    console.log('create stream here');
  }
}


