var anonList = "alligator, anteater, armadillo, auroch, axolotl, badger, bat, beaver, buffalo, camel, chameleon, cheetah, chipmunk, chinchilla, chupacabra, cormorant, coyote, crow, dingo, dinosaur, dolphin, duck, elephant, ferret, fox, frog, giraffe, gopher, grizzly, hedgehog, hippo, hyena, jackal, ibex, ifrit, iguana, koala, kraken, lemur, leopard, liger, llama, manatee, mink, monkey, narwhal, nyan cat, orangutan, otter, panda, penguin, platypus, python, pumpkin, quagga, rabbit, raccoon, rhino, sheep, shrew, skunk, slow loris, squirrel, turtle, walrus, wolf, wolverine, wombat";
anonList = anonList.split(", ");

var userList = [
	"grey.png",
	"orange.png",
	"tabby.png"
];

var getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getAnonymousImg = function(index){ return '/images/anonymous/' + anonList[index]; };
var getUserImg = function(index){ return '/images/user/' + userList[index]; };

module.exports = {
	getAnonymousImg: getAnonymousImg,
	getRandomAnonymousImg: function(){ return getAnonymousImg(getRandomInt(0, anonList.length)); },
	getRandomUserImg: function(){ return getUserImg(getRandomInt(0, userList.length)); },
	getRandomInt: getRandomInt
}