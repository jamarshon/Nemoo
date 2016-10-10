var fs = require('fs');

var FACTOR = 0.70;
console.log('Reducing');
fs.readFile('./public/stylesheets/emojify-small.css', 'utf8', function(err, data){
	var arr = data.split('\n');
	var len = arr.length;
	for(var i = 0; i < len; i++) {
		arr[i] = arr[i].replace(/([0-9]+)px/g, function(match, group) {
	    return parseInt(group) * FACTOR +  "px";
		});
		arr[i] = arr[i].replace('.emoji', '.small.emoji');
		if(i % 1000 === 0){
			console.log(i + '/' + len);
		}
	}
	fs.writeFile('./public/stylesheets/emojify-small.min.css', arr.join(''));
});