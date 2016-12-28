import { abs, polarize, createOnceLog } from './utils';

const logger_1 = createOnceLog();

let messageData;
let buffer;
let data;
let data1;
let data2;
let average1;
let average2;
let width;
let height;
let delta;
let sensitivity;
let threshold;

const createDiffBuffer = (messageEvent) => {
  let i;
  messageData = messageEvent.data;
  buffer = messageData.buffer;
  data1 = messageData.data1;
  data2 = messageData.data2;
  width = messageData.width;
  height = messageData.height;
  sensitivity = messageData.sensitivity;

  data = new Uint32Array(buffer);

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      i = y * width + x
      average1 = ((data1[i*4] + data1[i*4+1] + data1[i*4+2]) / 3) / sensitivity;
      average2 = ((data2[i*4] + data2[i*4+1] + data2[i*4+2]) / 3) / sensitivity;
      delta = polarize(
        abs(average1 - average2), 0x15
      );

      data[i] =
        (255   << 24) |     // alpha
        (delta << 16) |     // blue
        (delta <<  8) |     // green
         delta;             // red
    }
  }

  postMessage(buffer);
};

onmessage = createDiffBuffer;
