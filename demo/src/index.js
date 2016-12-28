/* eslint-disable no-console */

import create from '../../dist/diffy.min.js';

const diffy = create({
  resolution: { x: 20, y: 15 },
  sensitivity: 0.5,
  threshold: 0X15,
  debug: true
});

const diffy2 = create({
  resolution: { x: 20, y: 15 },
  sensitivity: 0.5,
  threshold: 0X15,
  debug: true
});

window.diffy = diffy;
