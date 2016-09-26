var app = angular.module('App');

app.factory('toastManager', ['$mdToast', function($mdToast){
	var ret = {};
	ret.showSimple = function(text, time){
		$mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .position("bottom right")
        .hideDelay(time)
    );
	};

	return ret;
}]);