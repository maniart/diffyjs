import webpack from 'webpack';
import path from 'path';

/*
  conditionally set webpack env variable
  used to differntiate production / development / demo builds
  values are: `dev`, `dist` or `demo`
*/
const ENV = process.env.WEBPACK_ENV;

/*
  Define `mode`
  See: https://webpack.js.org/concepts/mode/
*/
let mode;

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
  Define the es6 loader configuration object.
  Based on `ENV`, we will conditionally extend it properly.
*/
let es6LoaderConfig = {
  test: /\.js$/,
  use: [{
    loader: 'babel-loader'
  }]
};
const devAndDistEs6LoaderConfig = {
  include: path.resolve(__dirname, 'src')
};
const demoEs6LoaderConfig = {
  include: path.resolve(__dirname, 'demo/src')
};

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
  Define `plugins` array.
  Based on ENV, we will conditionally extend it properly.
*/
let plugins = [];
const devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
];

/* 
  Define `Optimization` config
*/
let optimization = {};

/*
  Read the `ENV` and construct webpack configurations accordingly.
*/
switch(ENV) {
  case 'dev':
    mode = 'development';
    optimization = Object.assign(optimization, { minimize: false });
    entry = [...entry, ...devEntry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput, devOutput);
    plugins = [...plugins, ...devPlugins];
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
    break;
  case 'dist':
    // mode = 'production';
    mode = 'development';
    optimization = Object.assign(optimization, { minimize: true });
    entry = [...entry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput, distOutput);
    plugins = [...plugins];
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
    break;
  case 'demo':
    mode = 'development';
    optimization = Object.assign(optimization, { minimize: false });
    entry = [...entry, ...demoEntry];
    output = Object.assign(output, demoOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, demoEs6LoaderConfig);
    break;
  default:
    // Use `dist` case by default
    mode = 'production';
    optimization = Object.assign(optimization, { minimize: true });
    entry = [...entry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
}

const config = {
  context: path.resolve(__dirname, 'src'),
  mode,
  optimization,
  entry,
  output,
  plugins,
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    open: true
  },
  module: {
  rules: [es6LoaderConfig]
}
};

module.exports = config;