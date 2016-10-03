// npm run emoji
var fs = require('fs');
fs.readdir('./public/images/emoji/', function(err, files){
	if(err){
		console.log('[ERROR] ' + err);
	}
	console.log(files.length);
	var emoji = files.map(file => ':' + file.slice(0, file.indexOf('.png')) + ':');

	writeFile('./scripts/emoji-cheatsheet.txt', JSON.stringify(emoji));
});

function writeFile(path, message){
	fs.writeFile(path, message, function(err) {
	    if(err) {
	        return console.log(err);
	    }
	}); 
}

// http://www.webpagefx.com/tools/emoji-cheat-sheet/
var items = $(".emojis > li > div > span.name");
var arr = {};
for(var i = 0; i < items.length; i++) {
	var item = $(items[i]);
	var key = item.parent().parent().parent().attr("id");
	var value = ':' + item.text() + ':';
	if(arr[key]) {
		arr[key].push(value);
	} else {
		arr[key] = [value];
	}
}
console.log(JSON.stringify(arr));
JSON.stringify(arr['emoji-nature'])
JSON.stringify(arr['emoji-objects'])
JSON.stringify(arr['emoji-people'])
JSON.stringify(arr['emoji-places'])
JSON.stringify(arr['emoji-symbols'])