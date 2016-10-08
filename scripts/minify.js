// npm run minify
// npm run minify --i

var minifier = require('minifier');
var fs = require('fs');

var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

var rootDir = './public';
var outputDir = '../production';

var jsPath = '/javascripts/';
var cssPath = '/stylesheets/';
//var imgDir = ['', 'anonymous/', 'user/', 'emoji/'];
var imgDir = ['emoji/'];
var minfiyImg = process.env.npm_config_i;

if(minfiyImg) {
	minifyImages();
} else {
	minifyAssets();
}

function minifyAssets() {
	// Minify the Javascript and CSS files
	minifier.on('error', function(err) {
	    // handle any potential error
	    console.log('[ERROR]: ' + err);
	});

	fs.readdir(rootDir + jsPath, function(err, files){
		console.log('Minifying JS');
		files.splice(files.indexOf('initApp.js'), 1);
		files.unshift('initApp.js');
		var jsFiles = files.map(file => rootDir + jsPath + file);
		minifier.minify(jsFiles, {template: outputDir + jsPath + 'bundle.min.js'});
	});
	// console.log('Minifying JS');
	// minifier.minify(rootDir + jsPath, {template: outputDir + jsPath + '{{filename}}.{{ext}}'});

	console.log('Minifying CSS');
	minifier.minify(rootDir + cssPath, {template: outputDir + cssPath + '{{filename}}.{{ext}}'});
}

function minifyImages() {
	// Compress the images
	console.log('Minifying Images');
	var imgPath = rootDir + '/images/';
	var outputImgPath = rootDir + '/production/images/';
	var test = [];
	for(var i = 0; i < imgDir.length; i++) {
		var input = imgDir[i];
		imagemin([imgPath + input + '*.{jpg,PNG,png}'], outputImgPath + input, {
		    plugins: [
		        imageminMozjpeg(),
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

}