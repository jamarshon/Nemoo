var ImageHandler = require('../util/imageHandler');

module.exports = function(app) {
  app.post('/uploadTempImage', function(req, res){
    ImageHandler.uploadTempImage(req, res);
  });
};
