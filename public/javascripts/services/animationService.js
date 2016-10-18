var app = angular.module('App');

app.factory('animationService', function(){
	var ret = {};
	ret.show = function(){
		$("#loadingAnimation").css("display", "block");
	};

	ret.hide = function(){
		$("#loadingAnimation").css("display", "none");
	};

	ret.animateCss = function (element, animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    element.addClass('animated ' + animationName).one(animationEnd, function() {
    	element.removeClass('animated ' + animationName);
    });
  };

	return ret;
});