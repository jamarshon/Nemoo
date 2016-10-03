var app = angular.module('App');

app.controller('MessageInputCtrl', ['$timeout', '$scope', '$mdMedia', '$compile',
                            function($timeout, $scope, $mdMedia, $compile) {
  var that = this;
  this.message = '';
  this.rows = 1;
  this.doneLoading = false;

  $timeout(function(){
      if($mdMedia('gt-xs')){
        $('#message-input-box').focus();
      }
      that.doneLoading = true;
  });

  this.send = function() {
    if(this.message) {
      var emotifiedMsg = emojify.replace(this.message);
      this.message = emotifiedMsg;
      this.message = this.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
      this.main.socket.emit('message sent', this.message, this.main.user, this.main.page);
      this.message = '';
      this.rows = 1;
    }
  };

  this.init = function(main){
    this.main = main;
  };

  this.increaseRows = function(){  
    this.rows++;
    this.message += '\n'; 
  };

  this.enterHandler = $mdMedia('xs') ? this.increaseRows : this.send;
  this.ctrlEnterHandler = $mdMedia('xs') ? this.send : this.increaseRows;

  this.emoticonHandler = function(parameter) {
    var b = that.message;
    //debugger;
  };

  $scope.$watch(function(){ return $('#message-input-box').height(); }, 
                function(newVal, oldVal){
    if(newVal) {
      var newHeight = Math.min(that.rows * 30, newVal);
      $('#message-input-box').attr("rows", that.rows).height(newHeight);
    }
  });
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