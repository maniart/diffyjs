/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import open from 'open';

const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../demo/index.html'));
});

app.get('/demo.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../demo/dist/demo.min.js'));
});

app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    open(`http://localhost:${port}`);
  }
});
