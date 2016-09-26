var app = angular.module('App');

app.factory('loaderAnimation', function(){
	var ret = {};
	ret.show = function(){
		$("#loadingAnimation").css("display", "block");
	};

	ret.hide = function(){
		$("#loadingAnimation").css("display", "none");
	};

	return ret;
});