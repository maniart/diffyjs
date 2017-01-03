import webpack from 'webpack';
import path from 'path';

/*
  conditionally set webpack env variable
  used to differntiate production / development / demo builds
  values are: `dev`, `dist` or `demo`
*/
const ENV = process.env.WEBPACK_ENV;

/*
  Define `entry` array.
  Based on `ENV`, we will conditionally extend it properly.
*/
let entry = [];
const devAndDistEntry = [
  path.resolve(__dirname, 'src/index.js')
];
const devEntry = [
  'webpack-hot-middleware/client?reload=true'
];
const demoEntry = [
  path.resolve(__dirname, 'demo/src/index')
];

/*
  Define `output` object.
  Based on `ENV`, we will conditionally extend it properly.
*/
let output = {
  publicPath: '/'
};
const devAndDistOutput = {
  path: path.resolve(__dirname, 'dist'),
  library: 'Diffy',
  libraryTarget: 'umd'
};
const devOutput = {
  filename: 'diffy.js'
};
const distOutput = {
  filename: 'diffy.min.js'
};
const demoOutput = {
  filename: 'demo.min.js',//todo minify demo output
  path: path.resolve(__dirname, 'demo/dist')
};

/*
  Define the es6 loader configuration object.
  Based on `ENV`, we will conditionally extend it properly.
*/
let es6LoaderConfig = {
  test: /\.js$/,
  loaders: ['babel']
};
const devAndDistEs6LoaderConfig = {
  include: path.resolve(__dirname, 'src')
};
const demoEs6LoaderConfig = {
  include: path.resolve(__dirname, 'demo/src')
};

/*
  Define `plugins` array.
  Based on ENV, we will conditionally extend it properly.
*/
let plugins = [];
const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];
const distPlugins = [
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  })
];

/*
  Read the `ENV` and construct webpack configurations accordingly.
*/
switch(ENV) {
  case 'dev':
    entry = [...entry, ...devEntry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput, devOutput);
    plugins = [...plugins, ...devPlugins];
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
    break;
  case 'dist':
    entry = [...entry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput, distOutput);
    plugins = [...plugins, ...distPlugins];
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
    break;
  case 'demo':
    entry = [...entry, ...demoEntry];
    output = Object.assign(output, demoOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, demoEs6LoaderConfig);
    break;
  default:
    // Use `dist` case by default
    entry = [...entry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
}

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry,
  target: 'web',
  output,
  devServer: {
    contentBase: path.resolve(__dirname, 'src')
  },
  plugins,
  module: {
    loaders: [
      es6LoaderConfig
    ]
  }
};
