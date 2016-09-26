// npm run minify

var minifier = require('minifier');

var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

var rootDir = './public';
var outputDir = '../production';

var inputs = ['/javascripts/', '/stylesheets/'];
var imgDir = ['', 'anonymous/', 'user/', 'emoji/'];

// Minify the Javascript and CSS files
minifier.on('error', function(err) {
    // handle any potential error
    console.log('[ERROR]: ' + err);
});

for(var i = 0; i < inputs.length; i++) {
	var input = inputs[i];
	console.log('Minifying ' + input);
	minifier.minify(rootDir + input, {template: outputDir + input + '{{filename}}.{{ext}}'});
}

// Compress the images
var imgPath = rootDir + '/images/';
var outputImgPath = rootDir + '/production/images/';

for(var i = 0; i < imgDir.length; i++) {
	var input = imgDir[i];
	imagemin([imgPath + input + '*.{jpg,PNG,png}'], outputImgPath + input, {
	    plugins: [
	        imageminMozjpeg({targa: true}),
	        imageminPngquant({quality: '65-80'})
	    ]
	}).then(function(files) {
		var len = files.length;
		console.log('Compressing Images: ' + files[0].path + ' - ' + len);
		for(var i = 0; i < len; i++) {
			var file = files[i],
				path = file.path;
			file.mv(file.path, function(err) {
		        if (err) { console.log('[ERROR]: ' + err); }
		    });
		}
	});
}