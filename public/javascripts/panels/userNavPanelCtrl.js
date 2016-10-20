var app = angular.module('App');

app.controller('UserNavCtrl', ['$mdSidenav', '$mdMedia', 'optimizationService', 'stateService', '$http',
                      function($mdSidenav, $mdMedia, optimizationService, stateService, $http) {
  var that = this;
  
  this.softRedirect = optimizationService.softRedirect;
  this.isLoggedIn = stateService._state.loggedIn;

  this.unfocus = function($event, additionalCallback) { 
  	var callback = additionalCallback || function(){};
    that.togglePanel(function(){
      callback($event, 0);
    }); 
  };

  this.logout = function(){
      }
    })
  };

  this.togglePanel = function(callback) {
    $mdSidenav('left').close().then(callback);
  };
}]);

app.directive('nemooUserNavPanel', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/userNavPanel.ejs',
    controller: 'UserNavCtrl',
    controllerAs: 'userNavCtrl'
  };
});