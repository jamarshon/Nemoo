var app = angular.module('App');

var scrollBottom = function() {
  var scrollContainer = document.getElementById('scrollable-container');
  $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
};

app.controller('MessageInputCtrl', ['$timeout', '$scope', '$rootScope', '$mdMedia', 'toastManager',
                            function($timeout, $scope, $rootScope, $mdMedia, toastManager) {
  var that = this;
  this.disableSend = true;

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
        toastManager.showSimpleWithAction('Currently on ' + that.main.page, 1000);
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
      this.main.socket.emit('message sent', this.$el.innerHTML, this.main.user, this.main.page);
      this.$el.innerHTML = '';
      this.resetCursor();
      $('#message-additional-button').webuiPopover('hide');
      this.disableSend = true;
    }
  };

  this.init = function(main){
    this.main = main;
  };

  this.resetCursor = function() {
    var range = document.createRange();
    range.setStart(this.$el, 0);
    range.setEnd(this.$el, 0);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  this.increaseRows = function(){
    var br = document.createElement("br");
    var textNode = document.createTextNode("\u00a0");
    // Only insert the textNode if it is at the end of element
    insertAtCursor(function(sel, range){
      var atEnd = that.getRange(range, false, true, false).atEnd;
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

  this.checkForDisableSend = function(isDelete, isSpace){
      var text = $(that.$el).text().trim();
      if(isDelete) {
        insertAtCursor(function(sel, range){
          var selectedRange = that.getRange(range, true, true, true);
          if(selectedRange.atStart && selectedRange.atEnd || text.length === 1) {
            that.disableSend = true;
          }
        }, function() {});
      } else {
        if(text.length === 0 && isSpace) {
          that.disableSend = true;
        } else if(that.disableSend) {
          that.disableSend = false;
        }
      }
  };

  this.throttledKeyPressHandler = _.throttle(this.checkForDisableSend, 500);

  var printableRegex = /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;
  this.keydownHandler = function($event) {
    var keyCode = $event.which;
    var keyValue = String.fromCharCode(keyCode);
    if(keyCode === 13) { // Enter key
      if($event.ctrlKey) {
        this.ctrlEnterHandler();
      } else {
        this.enterHandler();
      }
      $event.preventDefault();
    } else if(keyCode == 8 || keyCode === 46){ // Delete key, do not throttle
      this.checkForDisableSend(true, false); 
    } else if(printableRegex.test(keyValue)) {
      var isSpace = keyCode === 0 || keyCode === 32;
      this.throttledKeyPressHandler(false, isSpace);
    }
  };

  var emptyUri = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
  $scope.emoticonHandler = function(emoticon) {
    var emoticonStr = '<img class="' + emoticon.attr('class') + ' small' + '" src="' + emptyUri + '">';
    var node = $(emoticonStr)[0];

    insertAtCursor(function(sel, range){
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

  this.getRange = function(range, getStart, getEnd, trim) {
    var atStart, atEnd;
    var testRange = range.cloneRange();

    if(getStart) {
      testRange.selectNodeContents(that.$el);
      testRange.setEnd(range.startContainer, range.startOffset);
      atStart = trim ? testRange.toString().trim() === '' : testRange.toString() === '';
    }
    
    if(getEnd) {
      testRange.selectNodeContents(that.$el);
      testRange.setStart(range.endContainer, range.endOffset);

      atEnd = trim ? testRange.toString().trim() === '' : testRange.toString() === '';
    }
    
    return {atStart: atStart, atEnd: atEnd};
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


function insertAtCursor(hasSelectionCallback, noSelectionCallback) {
  var sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      range = window.getSelection().getRangeAt(0);
      cursorElement = range.commonAncestorContainer;

      if(cursorElement.id === 'message-input-box' || cursorElement.parentElement.id === 'message-input-box') {
        hasSelectionCallback(sel, range);
        return;
      }
    }
  }
  noSelectionCallback();
}