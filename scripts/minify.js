// npm run minify
// npm run minify --i

var minifier = require('minifier');
var htmlmin = require('htmlmin');
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
    console.log('[ERROR]: ' + err); // handle any potential error
	});

	fs.readdir(rootDir + jsPath, function(err, files){
		var allFiles = files.reduce((memo, file) => {
			if(file.indexOf(".js") === -1) {
				var internalFiles = fs.readdirSync(rootDir + jsPath + file + '/').map(x => file + '/' + x);
				memo = memo.concat(internalFiles);
			} else {
				memo.push(file);
			}
			return memo;
		}, []);

		console.log('Minifying JS');
		allFiles.splice(allFiles.indexOf('initApp.js'), 1);
		allFiles.splice(allFiles.indexOf('templates.js'), 1);
		allFiles.unshift('initApp.js');
		console.log(allFiles);
		var jsFiles = allFiles.map(file => rootDir + jsPath + file);
		minifier.minify(jsFiles, {template: outputDir + jsPath + 'bundle.min.js'});
	});

	console.log('Minifying CSS');
	minifier.minify(rootDir + cssPath, {template: outputDir + cssPath + '{{filename}}.{{ext}}'});

	
	fs.readdir('./views/components/', function(err, files){
		console.log('Minifying HTML');
		files.forEach(function(file){
			fs.readFile('./views/components/' + file, 'utf8', function(err, data){
				var min = htmlmin(data);
				fs.writeFile('./views/components/production/' + file, min);
			});
		});
	});
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