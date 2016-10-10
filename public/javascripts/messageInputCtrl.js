var app = angular.module('App');

var scrollBottom = function() {
  var scrollContainer = document.getElementById('scrollable-container');
  $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
};

app.controller('MessageInputCtrl', ['$timeout', '$scope', '$mdMedia', 'toastManager',
                            function($timeout, $scope, $mdMedia, toastManager) {
  var that = this;
  this.rows = 1;
  this.isLarge = $mdMedia('gt-xs');
  this.el = document.getElementById('message-input-box');

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
    if(this.el.innerHTML) {
      this.main.socket.emit('message sent', this.el.innerHTML, this.main.user, this.main.page);
      this.el.innerHTML = '';
      this.rows = 1;
      $('#message-additional-button').webuiPopover('hide');
    }
  };

  this.init = function(main){
    this.main = main;
  };

  this.increaseRows = function(){
    var br = document.createElement("br");
    var textNode = document.createTextNode("\u00a0");
    insertAtCursor(function(sel, range){
        var testRange = range.cloneRange();
        testRange.selectNodeContents(that.el);
        testRange.setStart(range.endContainer, range.endOffset);

        var atEnd = (testRange.toString() == "");

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

    this.rows++;
  };

  this.enterHandler = this.isLarge ? this.send : this.increaseRows;
  this.ctrlEnterHandler = this.isLarge ? this.increaseRows: this.send;

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
      that.el.innerHTML += node.outerHTML;
    });
  };

  // $scope.$watch(function(){ return $('#message-input-box').height(); }, 
  //               function(newVal, oldVal){
  //   if(newVal) {
  //     var newHeight = Math.min(that.rows * 30, newVal);
  //     $('#message-input-box').attr("rows", that.rows).height(newHeight);
  //   }
  // });
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