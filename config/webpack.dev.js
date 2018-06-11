const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
// const HardSourcePlugin   = require('hard-source-webpack-plugin');

module.exports = webpackMerge(commonConfig, {
  module: {
    loaders: [
      { 
      	test: /\.scss$/, 
      	loaders: ['style', 'css?sourceMap', 'postcss-loader', 'sass?config=sassLoader'],
      	exclude: /(node_modules)/
      },
      {
        test: /.json$/,
        loader: 'json-loader'
      }
    ]
  }
});
