var app = angular.module('App');

app.controller('MessageInputCtrl', ['$timeout', '$scope', '$rootScope', '$mdMedia', 'toastManager',
                            'stateService', 'cursorService',
                            function($timeout, $scope, $rootScope, $mdMedia, toastManager, 
                              stateService, cursorService) {
  var that = this;
  this.disableSend = true;

  var scrollBottom = function() {
    var scrollContainer = document.getElementById('scrollable-container');
    $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
  };

  var sizeHandler = $scope.$watch(function() { return $mdMedia('gt-xs'); }, function(open) {
    that.isLarge = open;
    that.placeholder = that.isLarge ? 'Enter your message here! Use Ctrl + Enter for a new line' : 'Enter your message here!';
  });

  $timeout(function(){
    that.$el = document.getElementById('message-input-box');
    if(that.isLarge){
      $(that.$el).focus();
      var bottom = $('#message-input-box').offset().top + 26 + 48;
      if(bottom < $(window).height()){
        toastManager.showSimpleWithAction('Currently on ' + stateService._state.pageName, 1000);
      }
    }
    scrollBottom();
  });

  var destroyHandler = $rootScope.$on('$routeChangeSuccess', function(){
    that.$el = null;
    sizeHandler();
    destroyHandler();
  });

  this.send = function() {
    if(this.$el.innerHTML) {
      stateService._state.socket.emit('message sent', this.$el.innerHTML, stateService._state.user, stateService._state.page);
      this.$el.innerHTML = '';
      cursorService.resetCursor(this.$el);
      $('#message-additional-button').webuiPopover('hide');
      this.disableSend = true;
    }
  };

  this.increaseRows = function(){
    var br = document.createElement("br");
    var textNode = document.createTextNode("\u00a0");
    // Only insert the textNode if it is at the end of element
    cursorService.insertAtCursor(function(sel, range){
      var atEnd = cursorService.getRange(that.$el, range, false, true, false).atEnd;
      range.deleteContents();
      if(atEnd) {
        range.insertNode(textNode);
      }
      range.insertNode(br);
      range.setStartAfter(br);
      range.setEndAfter(br);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
    }, function() {
    });
  };

  this.enterHandler = function() {
    if(this.isLarge){ this.send(); }
    else{ this.increaseRows(); }
  };

  this.ctrlEnterHandler = function() {
    if(this.isLarge){ this.increaseRows(); }
    else{ this.send(); }
  };

  this.keydownHandler = function($event) {
    if($event.which === 13) { // Enter key
      if($event.ctrlKey) {
        this.ctrlEnterHandler();
      } else {
        this.enterHandler();
      }
      $event.preventDefault();
    }
  };

  this.keyUpHandler = function() {
    that.disableSend = that.$el.innerHTML.length === 0;
  };

  var emptyUri = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  $scope.emoticonHandler = function(emoticon) {
    var emoticonStr = '<img class="' + emoticon.attr('class') + ' small' + '" src="' + emptyUri + '">';
    var node = $(emoticonStr)[0];

    cursorService.insertAtCursor(function(sel, range){
      // Insert emoticon and set cursor after it
      var newRange = document.createRange();
      range.insertNode(node);
      newRange.setStartAfter(node);
      newRange.setEndAfter(node);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }, function() {
      that.$el.innerHTML += node.outerHTML;
    });

    if(that.disableSend) {
      that.disableSend = false;
    }
  };
}]);

app.directive('nemooMessageInput', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/messageInput.ejs',
    controller: 'MessageInputCtrl',
    controllerAs: 'messageCtrl'
  };
});