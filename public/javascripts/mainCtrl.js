var app = angular.module('App');

app.controller('MainCtrl', ['stateService', '$http', function(stateService, $http) {
  var that = this;
  window.fd.logging = false;
  
  this.init = stateService.initialize;

  $http.post('/setTimezone', {offset: new Date().getTimezoneOffset()});
}]);