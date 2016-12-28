import { abs, polarize } from './utils';

var messageData;
var buffer;
var data;
var data1;
var data2;
var average1;
var average2;
var width;
var height;
var delta;
var sensitivity;

const createDiffBuffer = (messageEvent) => {
  var i;
  messageData = messageEvent.data;
  buffer = messageData.buffer;
  data1 = messageData.data1;
  data2 = messageData.data2;
  width = messageData.width;
  height = messageData.height;
  sensitivity = messageData.sensitivity;
  data = new Uint32Array(buffer);
  for (var y = 0; y < height; ++y) {
    for (var x = 0; x < width; ++x) {
      i = y * width + x
      average1 = ((data1[i*4] + data1[i*4+1] + data1[i*4+2]) / 3) / 1;
      average2 = ((data2[i*4] + data2[i*4+1] + data2[i*4+2]) / 3) / 1;
      delta = polarize(
        abs(average1 - average2), 0x15
      );

      data[i] =
        (255   << 24) |    // alpha
        (delta << 16) |    // blue
        (delta <<  8) |    // green
         delta;           // red
    }
  }

  postMessage(buffer);
};

onmessage = createDiffBuffer;
