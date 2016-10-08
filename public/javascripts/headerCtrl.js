var app = angular.module('App');

app.controller('HeaderCtrl', ['$scope', '$window', '$mdSidenav', '$mdMedia', '$mdDialog', '$location',
                    'loaderAnimation',
                    function($scope, $window, $mdSidenav, $mdMedia, $mdDialog, $location, loaderAnimation) {
  var that = this;

  $scope.$watch(function() { return $mdMedia('gt-sm'); }, function(open) {
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

  this.hardRedirect = function(path) { loaderAnimation.show(); $window.location.href = path; };
  this.softRedirect = function(path) { $location.url(path); };

  this.showTabDialog = function(ev, tabIdx) {
    $mdDialog.show({
      controller: ['$mdDialog', '$window', function($mdDialog, $window){
        this.hide = function() {
          $mdDialog.hide();
        };
        this.cancel = function() {
          $mdDialog.cancel();
        };
        this.redirect = function(path) {
          $window.location.href = path;
        };
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