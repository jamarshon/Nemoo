var anonList = "alligator, anteater, armadillo, auroch, axolotl, badger, bat, beaver, buffalo, camel, chameleon, cheetah, chipmunk, chinchilla, chupacabra, cormorant, coyote, crow, dingo, dinosaur, dolphin, duck, elephant, ferret, fox, frog, giraffe, gopher, grizzly, hedgehog, hippo, hyena, jackal, ibex, ifrit, iguana, koala, kraken, lemur, leopard, liger, llama, manatee, mink, monkey, narwhal, orangutan, otter, panda, penguin, platypus, python, pumpkin, quagga, rabbit, raccoon, rhino, sheep, shrew, skunk, squirrel, turtle, walrus, wolf, wolverine, wombat";
anonList = anonList.split(", ");

var colorList = "Aqua, Aquamarine, Black, Blue, BlueViolet, Brown, BurlyWood, CadetBlue, Chartreuse, Chocolate, Coral, " +
		"CornflowerBlue, Crimson, Cyan, DarkBlue, DarkCyan, DarkGoldenRod, DarkGrey, DarkGreen, DarkKhaki, DarkMagenta, " +
		"DarkOliveGreen, DarkOrange, DarkOrchid, DarkRed, DarkSalmon, DarkSeaGreen, DarkSlateBlue, DarkSlateGrey, DarkTurquoise, DarkViolet, " +
		"DeepPink, DeepSkyBlue, DimGray, DodgerBlue, FireBrick, ForestGreen, Fuchsia, Gold, GoldenRod, Gray, " +
		"Green, GreenYellow, HotPink, IndianRed, Indigo, LawnGreen, LightBlue, LightCoral, LightGreen, LightPink, " +
		"LightSalmon, LightSeaGreen, LightSkyBlue, LightSlateGray, Lime, LimeGreen, Magenta, Maroon, MediumAquaMarine, MediumBlue, " +
		"MediumOrchid, MediumPurple, MediumSeaGreen, MediumSlateBlue, MediumSpringGreen, MediumTurquoise, MediumVioletRed, MidnightBlue, Navy, Olive, " +
		"OliveDrab, Orange, OrangeRed, Orchid, PaleVioletRed, Peru, Plum, PowderBlue, Purple, RebeccaPurple, " +
		"Red, RosyBrown, RoyalBlue, SaddleBrown, Salmon, SandyBrown, SeaGreen, Sienna, Silver, SkyBlue, " +
		"SlateBlue, SlateGray, SpringGreen, SteelBlue, Tan, Teal, Tomato, Turquoise, Violet, Yellow, " +
		"YellowGreen";
colorList = colorList.split(", ");

var userList = [
	{fileName: "grey.jpg", displayName: "grey-cat"},
	{fileName: "orange.jpg", displayName: "orange-cat"},
	{fileName: "tabby.jpg", displayName: "tabby-cat"}
];

var Util = {};
Util.anonList = anonList;
Util.colorList = colorList;
Util.userList = userList;

Util.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

Util.getRandomUserImg = function(){ 
	return '/images/user/' + Util.userList[Util.getRandomInt(0, Util.userList.length - 1)].fileName; 
};

Util.generateAnonUser = function(){
	return Util.generateAnonUserGenericAnimal();
	var day = (new Date()).getDay();
	if(day % 2 === 0) {
		return Util.generateAnonUserCat();
	} else {
		return Util.generateAnonUserGenericAnimal();
	}
};

Util.generateAnonUserCat = function() {
	var id = Util.getRandomInt(100, 1000),
			imgNum = Util.getRandomInt(0, Util.userList.length - 1),
			cat = Util.userList[imgNum];

	var anonUser = {
		displayName: 'anonymous-' + cat.displayName + id,
		profilePic: '/images/user/' + cat.fileName
	};
	return anonUser;
};

Util.generateAnonUserGenericAnimal = function() {
	var id = Util.getRandomInt(100, 1000),
			imgNum = Util.getRandomInt(0, Util.anonList.length - 1),
			backgroundColor = Util.colorList[Util.getRandomInt(0, Util.colorList.length - 1)],
			animal = Util.anonList[imgNum];

	var anonUser = {
		displayName: 'anonymous-' + animal + id,
		profilePic: '/images/anonymous/' + animal + '_lg.png',
		backgroundColor: backgroundColor.toLowerCase()
	};
	return anonUser;
},

Util.toTitleCase = function(str) {
	str = str.split('-').join(' ');
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

module.exports = Util;