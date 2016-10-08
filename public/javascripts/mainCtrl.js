var app = angular.module('App');

app.controller('MainCtrl', [function() {
  var that = this;
  this.socket = io();
  emojify.setConfig({
    mode: 'sprite'
	});
}]);