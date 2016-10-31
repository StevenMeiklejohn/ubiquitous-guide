module.exports = {
  loadModels: function (complete) {

    //console.log('load modules');
    //console.log(global.hasOwnProperty('db'));

    if (global.hasOwnProperty('db')) {
      // sync database models
      var _path = require('path').join(__dirname, '../models');

      var files = require('fs').readdirSync(_path),
        loaded = 0;

      files.forEach(function (file) {
        //console.log("Loading " + file);
        require('../models/' + file).then(function () {
          loaded++;
          if (loaded === files.length) {
            complete && complete();
          }
        });
      });
    }
  }
};
