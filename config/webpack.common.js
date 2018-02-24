const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CommonsChunkPlugin = require('webpack-vendor-chunk-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/app.js']
  },
  output: {
    path: path.join(__dirname, '..', 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body'
    }),
  ],
  module: {
    loaders: [
      { test: /\.js$/, loaders: ['ng-annotate','babel-loader'], exclude: /node_modules\/(?!(lunes-lib)\/).*/ },
      { test: /\.html$/, loader: 'raw' },
      // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
      // helps to load bootstrap's css.
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.woff2$/,
        loader: 'url?limit=10000&minetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&minetype=image/svg+xml' }
    ]
  },
  devtool: 'source-map',
  resolve: {
    // add alias for application code directory
    // alias: {
    //   '~': path.resolve(__dirname, '..', 'src')
    // },
  },

  sassLoader: {
    includePaths: [path.resolve(__dirname, '..', 'src/scss')],
    sourceMap: true
  },

  postcss: function() {
    return [autoprefixer];
  }
};
