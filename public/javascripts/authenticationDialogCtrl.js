var app = angular.module('App');

app.controller('AuthenticationCtrl', ['$http', '$window', 'loaderAnimation', 
                            function($http, $window, loaderAnimation) {
  var that = this;
  this.data = {email: '', password: '', password2: ''};
  this.submit = function(url) {
    $http.post(url, that.data).success(function(data){
      if(data.redirect) {
          loaderAnimation.show();
          $window.location.href = data.redirect;
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