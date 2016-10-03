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

	ret.showSimpleWithAction = function(text, time, callback){
		$mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .position("bottom right")
        .hideDelay(time)
        .action('CLOSE')
      	.highlightAction(true)
      	.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
    ).then(function(response){
    	if(response === 'ok' && callback) {
    		callback();
    	}
    });
	};

	return ret;
}]);