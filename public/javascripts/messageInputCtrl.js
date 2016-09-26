var app = angular.module('App');

app.controller('MessageInputCtrl', ['$timeout', '$scope', function($timeout, $scope) {
  var that = this;
  this.message = '';
  this.rows = 1;
  $timeout(function(){
      $('#message-input-box').focus();
  }, 0);
  this.send = function() {
    if(this.message) {
      var emotifiedMsg = emojify.replace(this.message);
      if(this.message !== emotifiedMsg) {
        emotifiedMsg += '\n\n';
      }
      this.message = emotifiedMsg;
      this.message = this.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
      this.main.socket.emit('message sent', this.message, this.main.user, this.main.page);
      this.message = '';
    }
  };
  this.init = function(main){
    this.main = main;
  };
  this.increaseRows = function(){  this.message += '\n'; };
}]);

app.directive('customKeyPress', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        var action = event.ctrlKey ? 'onCtrlEnterPressed' : 'onEnterPressed';
        scope.$apply(function (){
            scope.$eval(attrs[action]);
        });

        event.preventDefault();
      }
    });
  };
});

app.directive('nemooMessageInput', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/messageInput.ejs',
    controller: 'MessageInputCtrl',
    controllerAs: 'messageCtrl'
  };
});