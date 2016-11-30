const LiveReloadPlugin = require('webpack-livereload-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/src/index.js`,
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  plugins: [
    new LiveReloadPlugin({ port: 35729 })
  ],
  module: {
    eslint: {
      configFile: './.eslintrc'
    },
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        presets: ['es2015'],
        plugins: ['transform-object-rest-spread']
      }
    ]
  }

};
