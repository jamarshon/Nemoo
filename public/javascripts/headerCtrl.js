var app = angular.module('App');

app.controller('HeaderCtrl', ['$scope', '$mdSidenav', '$mdMedia', '$mdDialog', 
                    'optimizationService',
                    function($scope, $mdSidenav, $mdMedia, $mdDialog, optimizationService) {
  var that = this;

  // This controller is never removed as it is not part of ng-view so it will never need to be unbinded
  var sizeHandler = $scope.$watch(function() { return $mdMedia('gt-sm'); }, function(open) {
    that.open = open;
  });

  this.togglePanel = function() {
    var sideNav = $mdSidenav('left'),
        large = $mdMedia('gt-sm');
    if(large) {
      that.open = !that.open;
    } else {
      sideNav.toggle();
    }
  };

  this.hardRedirect = optimizationService.hardRedirect;
  this.softRedirect = optimizationService.softRedirect;

  this.showTabDialog = function(ev, tabIdx) {
    $mdDialog.show({
      controller: ['$mdDialog', 'optimizationService', function($mdDialog, optimizationService){
        this.hide = function() {
          $mdDialog.hide();
        };
        this.cancel = function() {
          $mdDialog.cancel();
        };
        this.redirect = optimizationService.hardRedirect;
        this.selected = tabIdx;
      }],
      controllerAs: 'dlgCtrl',
      templateUrl: '/views/loginDialog.ejs',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true
    });
  };
}]);

app.directive('nemooHeader', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/header.ejs',
    controller: 'HeaderCtrl',
    controllerAs: 'header'
  };
});