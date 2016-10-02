var app = angular.module('App');

app.controller('UserNavCtrl', ['$window', '$location', '$mdSidenav', '$mdMedia',
                      function($window, $location, $mdSidenav, $mdMedia) {
  var that = this;
  
  this.hardRedirect = function(path) { $window.location.href = path; };
  this.softRedirect = function(path) { $location.url(path); };

  this.unfocus = function($event, additionalCallback) { 
  	var callback = additionalCallback || function(){};
    that.togglePanel(function(){
      $($event.target).blur();
      callback($event, 0);
    }); 
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