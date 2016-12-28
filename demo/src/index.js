/* eslint-disable no-console */

import create from '../../dist/diffy.min.js';

const gridCanvas = document.querySelector('#grid-canvas');
const gridCtx = gridCanvas.getContext('2d');
const gridWidth = 1040;
const gridHeight = 800;
const resolutionX = 20;
const resolutionY = 15;
const cellWidth = gridWidth / resolutionX;
const cellHeight = gridHeight / resolutionY;
const PI = Math.PI;

function drawGrid(matrix) {
  matrix.forEach(function(row, rowIdx) {
    row.forEach(function(column, colIdx) {
      gridCtx.beginPath();
      gridCtx.fillStyle = 'rgb(' + column + ',' + column + ',' + column + ')';
      gridCtx.arc(rowIdx * cellWidth, colIdx * cellHeight, 1, 0, 2 * PI, false);
      gridCtx.fill();
      gridCtx.closePath();
    });
  });
}

const diffy = create({
  resolution: { x: resolutionX, y: resolutionY },
  sensitivity: 0.5,
  debug: true,
  onFrame: drawGrid
});

window.diffy = diffy;
