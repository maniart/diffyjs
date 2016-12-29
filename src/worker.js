import { abs, polarize } from './utils';

let buffer;
let pixelData;
let data1;
let data2;
let average1;
let average2;
let width;
let height;
let delta;
let sensitivity;
let actualSensitivity;

const createDiffBuffer = ({ data: { buffer, data1, data2, width, height, sensitivity } }) => {
  let i = 0;
  actualSensitivity = 1 - sensitivity;

  pixelData = new Uint32Array(buffer);
  for (let y = 0; y < height; ++ y) {
    for (let x = 0; x < width; ++ x) {
      i = y * width + x;
      average1 = ((data1[i * 4] + data1[i * 4 + 1] + data1[i * 4 + 2]) / 3) / actualSensitivity;
      average2 = ((data2[i * 4] + data2[i * 4 + 1] + data2[i * 4 + 2]) / 3) / actualSensitivity;
      delta = polarize(
        abs(average1 - average2), 0x15
      );
      pixelData[i] =
        (255   << 24) |     // alpha
        (delta << 16) |     // blue
        (delta <<  8) |     // green
         delta;             // red
    }
  }

  postMessage(buffer);
};

onmessage = createDiffBuffer;
