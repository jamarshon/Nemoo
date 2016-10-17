var cloudinary  = require('cloudinary');
var fs          = require('fs');

cloudinary.config({ 
  cloud_name: 'nemoo', 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

module.exports = function(app) {
  app.post('/uploadTempImage', function(req, res){
    cloudinary.uploader.upload(req.body.uri, function(result) { 
      res.json({url: result.secure_url});
    },{
      folder: "temporaryImages/" + req.body.page,
      crop: 'limit',
      monkey: 'test',
      width: 200,
      height: 200
    });
  });
};
