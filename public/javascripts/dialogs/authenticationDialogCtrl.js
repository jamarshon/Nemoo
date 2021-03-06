var app = angular.module('App');

app.controller('AuthenticationCtrl', ['$http', 'optimizationService', 
                            function($http, optimizationService) {
  var that = this;
  this.data = {email: '', password: '', password2: ''};
  this.submit = function(url) {
    $http.post(url, that.data).then(function(res){
      if(res.data.redirect) {
        optimizationService.refreshPage();
      } else {
        that.message = data.message;
      }
    });
  };
}]);

app.directive('nemooLogin', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/login.ejs',
    controller: 'AuthenticationCtrl',
    controllerAs: 'loginCtrl'
  };
});

app.directive('nemooSignUp', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/signup.ejs',
    controller: 'AuthenticationCtrl',
    controllerAs: 'signUpCtrl'
  };
});