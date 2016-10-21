var cloudinary  = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'nemoo', 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET
});

var imageHandler = {};

imageHandler.uploadTempImage = function(req, res){
	cloudinary.uploader.upload(req.body.uri, function(result) {
    res.json({url: result.secure_url});
  },{
    folder: "temporaryImages/" + req.body.page,
    crop: 'limit',
    monkey: 'test',
    width: 200,
    height: 200
  });
};

// <img src="https://res.cloudinary.com/nemoo/image/upload/v1477017023/temporaryImages/dogs/wn75gi1wormplzc50jhc.png">
imageHandler.process = function(message) {
	var exp = '<img src="https://res.cloudinary.com/nemoo/image/upload/(.*)/temporaryImages/(.*)\.png">';
	var possibleMatch = message.match(new RegExp(exp));
	if(possibleMatch) {
		var url = 'temporaryImages/' + possibleMatch.slice(2);
		console.log('Remove ' + url);
		cloudinary.uploader.destroy(url, function(result) { 
      console.log(result) 
    });
	}
};

module.exports = imageHandler;