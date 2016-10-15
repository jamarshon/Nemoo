var app = angular.module('App');

app.factory('stateService', [
												function(){
	var ret = {};
	ret.initialize = function(user, loggedIn, currentNumOnline){
		ret._state = {
			user: user,
			loggedIn: loggedIn,
			currentNumOnline: currentNumOnline,
			page: '',
			pageName: '',
			socket: io()
		}
	};

  return ret;
}]);
