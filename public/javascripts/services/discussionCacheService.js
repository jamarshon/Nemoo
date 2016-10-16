var app = angular.module('App');

app.factory('discussionCacheService', [function(){
	var ret = {};
  ret._cache = {};
  ret.getData = function(page) {
    return ret._cache[page] || [];
  };

  ret.setData = function(page, data) {
    ret._cache[page] = data;
  };

	return ret;
}]);