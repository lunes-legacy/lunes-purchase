module.exports = function (config) {

  var configuration = {
    // base path used to resolve all patterns
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'mocha', 'chai'],

    // list of files/patterns to load in the browser
    files: [
      { pattern: './node_modules/babel-polyfill/dist/polyfill.js' },
      { pattern: 'spec.bundle.js', watched: false },
      { pattern: 'src/app.js' }
    ],

    /*********************************************************/
        // Note: this was added AFTER karma init was completed.
        /*********************************************************/
    ngHtml2JsPreprocessor: {
      stripPrefix: 'src/',
      //stripSufix: '.ext',

      // setting this option will create only a single module that contains templates
      // from all the files, so you can load them all with module('foo')
      moduleName: 'myApp'
    },

    // files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/*.js': ['webpack'],
      'spec.bundle.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        loaders: [
          { test: /\.js/, exclude: [/app\/lib/, /node_modules/], loader: 'babel' },
          { test: /\.html/, loader: 'raw' },
          { test: /\.styl$/, loader: 'style!css!stylus' },
          { test: /\.css$/, loader: 'style!css' },
          { test: /\.scss/, loader: 'style!css!sass' },
        ]
      }
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    customLaunchers: {
        Chrome_travis_ci: {
            base: 'Chrome',
            flags: ['--no-sandbox']
        }
    },

    // if true, Karma runs tests once and exits
    singleRun: true
  };

  if(process.env.TRAVIS){
    configuration.browsers = ['Chrome_travis_ci'];
    // configuration.reporters = configuration.reporters.concat(['coverage', 'coveralls']);
    // configuration.coverageReporter = {
    //   type : 'lcovonly',
    //   dir : 'coverage/'
    // };
  }

  config.set(configuration);

};
