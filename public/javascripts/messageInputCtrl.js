var app = angular.module('App');

var scrollBottom = function() {
  var scrollContainer = document.getElementById('scrollable-container');
  $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
};

app.controller('MessageInputCtrl', ['$timeout', '$scope', '$mdMedia', 'toastManager',
                            function($timeout, $scope, $mdMedia, toastManager) {
  var that = this;
  this.message = '';
  this.rows = 1;
  this.isLarge = $mdMedia('gt-xs');

  $timeout(function(){
      if(that.isLarge){
        $('#message-input-box').focus();
        var bottom = $('#message-input-box').offset().top + 26 + 48;
        if(bottom < $(window).height()){
          toastManager.showSimpleWithAction('Currently on ' + that.main.page, 1000);
        }
      }
      scrollBottom();
  });

  this.send = function() {
    if(this.message) {
      var emotifiedMsg = emojify.replace(this.message);
      this.message = emotifiedMsg;
      this.message = this.message.replace(/(?:\r\n|\r|\n)/g, '<br />');
      this.main.socket.emit('message sent', this.message, this.main.user, this.main.page);
      this.message = '';
      this.rows = 1;
      $('#message-additional-button').webuiPopover('hide');
    }
  };

  this.init = function(main){
    this.main = main;
  };

  this.increaseRows = function(){  
    this.rows++;
    this.message += '\n'; 
  };

  this.enterHandler = this.isLarge ? this.send : this.increaseRows;
  this.ctrlEnterHandler = this.isLarge ? this.increaseRows: this.send;

  $scope.emoticonHandler = function(emoticon) {
    that.message += ' ' + emoticon + ' ';
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