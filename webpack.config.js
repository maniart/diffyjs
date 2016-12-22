import webpack from 'webpack';
import path from 'path';

/*
  conditionally set webpack env variable
  used to differntiate production / development builds
  values are: `dev` & `build`
*/
const env = process.env.WEBPACK_ENV;


let libraryName = 'diffy';
let outputFile = `${libraryName}.js`;

let entry  = [
  path.resolve(__dirname, 'src/index.js')
];

let plugins = [];
let devPlugins = [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
];

if(env === 'dev') {
  plugins = [...plugins, ...devPlugins];
}


// if building for development, include hot reloading middleware
// if (env === 'dev') {
//   entry.push('webpack-hot-middleware/client?reload=true');
// }

console.log('___________________ env: ', env, entry);

export default {
  debug: true,
  devtool: 'source-map',
  noInfo: false,
  entry: entry,
  target: 'web',
  output: {
    path: `${__dirname}/dist`, // Note: Physical files are only output by the production build task `npm run build`.
    publicPath: '/',
    filename: 'lib.bundle.js',
    library: 'diffy',
    libraryTarget: 'umd'
  },
  target: 'web',
  devServer: {
    contentBase: path.resolve(__dirname, 'src')
  },
  plugins: plugins,
  module: {
    loaders: [
      {test: /\.js$/, include: path.resolve(__dirname, 'src'), loaders: ['babel']},
      {test: /(\.css)$/, loaders: ['style', 'css']}
    ]
  }
};
