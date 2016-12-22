/* eslint-disable no-console */

import express from 'express';
import path from 'path';
import open from 'open';

const app = express();
const port = 4000;
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../demo/index.html'));
});

app.get('/bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../demo/dist/demo.bundle.js'));
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../demo/index.html'));
// });


app.listen(port, (err) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    open(`http://localhost:${port}`);
  }
})
