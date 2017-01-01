import { abs, polarize } from './utils';

let pixelData;
let average1;
let average2;
let delta;
let actualSensitivity;

const createDiffBuffer = ({ data: { buffer, data1, data2, width, height, sensitivity, threshold }}) => {
  let i = 0;
  actualSensitivity = 1 - sensitivity;

  pixelData = new Uint32Array(buffer);
  for (let y = 0; y < height; ++ y) {
    for (let x = 0; x < width; ++ x) {
      i = y * width + x;
      average1 = ((data1[i * 4] + data1[i * 4 + 1] + data1[i * 4 + 2]) / 3) / actualSensitivity;
      average2 = ((data2[i * 4] + data2[i * 4 + 1] + data2[i * 4 + 2]) / 3) / actualSensitivity;
      delta = polarize(
        abs(average1 - average2), threshold
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
