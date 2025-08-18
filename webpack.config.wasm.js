const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/js/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'diffy-wasm.min.js',
    library: 'Diffy',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.wasm'],
  },
  experiments: {
    asyncWebAssembly: true,
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  performance: {
    maxAssetSize: 1024000,
    maxEntrypointSize: 1024000,
  },
};