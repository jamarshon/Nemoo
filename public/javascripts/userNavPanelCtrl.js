var app = angular.module('App');

app.controller('UserNavCtrl', ['$mdSidenav', '$mdMedia', 'optimizationService',
                      function($mdSidenav, $mdMedia, optimizationService) {
  var that = this;
  
  this.hardRedirect = optimizationService.hardRedirect;
  this.softRedirect = optimizationService.softRedirect;

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