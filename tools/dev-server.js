/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import webpack from 'webpack';
import config from '../webpack.config';

const hotMiddleware = require('webpack-hot-middleware');
const devMiddleware = require('webpack-dev-middleware');
const app = express();
const port = 3000;
const compiler = webpack(config);

app.use(devMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(hotMiddleware(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  }
  console.log(`> Diffy.js Dev server is running on: http://localhost:${port}`);
})
