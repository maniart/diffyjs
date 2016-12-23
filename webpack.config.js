import webpack from 'webpack';
import path from 'path';

/*
  conditionally set webpack env variable
  used to differntiate production / development builds
  values are: `dev` & `dist`
*/
const ENV = process.env.WEBPACK_ENV;

/*
  Define `entry` array.
  Based on `ENV`, we will conditionally extend it properly.
*/
let entry = [];
let devAndDistEntry = [
  path.resolve(__dirname, 'src/index.js')
];
let devEntry = [
  'webpack-hot-middleware/client?reload=true'
];
let demoEntry = [
  path.resolve(__dirname, 'demo/src/index')
];

/*
  Define `output` object.
  Based on `ENV`, we will conditionally extend it properly.
*/
let output = {
  publicPath: '/'
};
let devAndDistOutput = {
  path: path.resolve(__dirname, '/dist'),
  library: 'diffy',
  libraryTarget: 'umd'
};
let devOutput = {
  filename: 'diffy.js'
};
let distOutput = {
  filename: 'diffy.min.js'; //todo minify dist output
};
let demoOutput = {
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
let devAndDistEs6LoaderConfig = {
  include: path.resolve(__dirname, 'src')
};
let demoEs6LoaderConfig = {
  exclude: /node_modules/
};

/*
  Define `plugins` array.
  Based on ENV, we will conditionally extend it properly.
*/
let plugins = [];
let devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

/*
  Read the `ENV` and construct webpack configurations accordingly.
*/
switch(ENV) {
  case 'dev':
  case 'dist':
    entry = [...entry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
  case 'dev':
    entry = [...entry, ...devEntry];
    output = Object.assign(output, devOutput);
    plugins = [plugins, ...devPlugins];
  case 'dist':
    output = Object.assign(output, distOutput);
  case 'demo':
    entry = [...entry, ...demoEntry];
    output Object.assign(output, demoOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, demoEs6LoaderConfig);
  default:
    // Use `dist` case by default
    entry = [...entry, ...devAndDistEntry];
    output = Object.assign(output, devAndDistOutput);
    es6LoaderConfig = Object.assign(es6LoaderConfig, devAndDistEs6LoaderConfig);
}

console.log('___ env: ', ENV);
console.log('___ entry: ', entry);
console.log('___ output: ', output);
console.log('___ plugins: ', plugins);
console.log('___ es6LoaderConfig: ', es6LoaderConfig);


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
    loaders: [es6LoaderConfig]
  }
};
