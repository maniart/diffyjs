/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import webpack from 'webpack';
import open from 'open';
import config from '../webpack.config.demo';

const app = express();
const port = 4000;
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../demo/index.html'));
});

app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    open(`http://localhost:${port}`);
  }
})
