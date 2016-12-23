import webpack from 'webpack';
import path from 'path';

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: [
    // 'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
    path.resolve(__dirname, 'demo/src/index')
  ],
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'demo/dist'), // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'demo.bundle.js'
    // library: 'diffy'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'demo/src')
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /(\.css)$/, loaders: ['style', 'css']}
    ]
  }
};
