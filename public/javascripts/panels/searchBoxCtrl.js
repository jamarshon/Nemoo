var app = angular.module('App');

app.controller('SearchBoxCtrl', ['$http', '$q', '$mdSidenav', '$mdMedia', 'optimizationService',
                      function($http, $q, $mdSidenav, $mdMedia, optimizationService) {
  var that = this;

  this.querySearch = function(query) {
    var deferred = $q.defer();
    $http.post('/searchDiscussion', {searchText: that.searchText}).then(function(results){
      deferred.resolve( results.data.discussions );
    });
    return deferred.promise;
  };

  this.searchTextChange = function(text) { };

  this.selectedItemChange = function(item) {
    if(item) {
      this.togglePanel(function(){
        that.softRedirect('/page/' + item.name);
      });
    }
  };

  this.togglePanel = function(callback) {
    var sideNav = $mdSidenav('left'),
        large = $mdMedia('gt-sm');
    if(!large) {
      sideNav.close().then(callback);
    } else {
      callback();
    }
  };

  this.softRedirect = optimizationService.softRedirect;
}]);

app.directive('nemooSearchBox', function() {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/views/searchBox.ejs',
        controller: 'SearchBoxCtrl',
        controllerAs: 'searchBoxCtrl'
    };
});

