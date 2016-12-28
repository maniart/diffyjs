/* eslint-disable no-console */

import create from '../../dist/diffy.min.js';

const diffy = create({
  resolution: { x: 20, y: 15 },
  sensitivity: 0.5,
  debug: true,
  onFrame: (matrix) => {
    console.log('matrix: ', matrix[0][3]);
  }
});

window.diffy = diffy;
