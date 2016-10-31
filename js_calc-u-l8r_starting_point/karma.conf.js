module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns
    basePath: '.',

    // frameworks to use
    frameworks: ['jasmine'],

    plugins: [
          'karma-chrome-launcher',
          'karma-jasmine'
          ],

    // list of files / patterns to load in the browser
    files: [
      './js/jquery-1.11.3.min.js',
      './js/*.js',
      './tests/unit/*.js',
    ],

    // test result reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: ['Chrome'],

    // Continuous Integration mode
    singleRun: false
  });
};
