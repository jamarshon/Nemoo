var app = angular.module('App');

app.factory('cursorService', [function(){
	var ret = {};

	ret.resetCursor = function(el) {
    var range = document.createRange();
    range.setStart(el, 0);
    range.setEnd(el, 0);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  ret.getRange = function(el, range, getStart, getEnd, trim) {
    var atStart, atEnd;
    var testRange = range.cloneRange();

    if(getStart) {
      testRange.selectNodeContents(el);
      testRange.setEnd(range.startContainer, range.startOffset);
      atStart = trim ? testRange.toString().trim() === '' : testRange.toString() === '';
    }
    
    if(getEnd) {
      testRange.selectNodeContents(el);
      testRange.setStart(range.endContainer, range.endOffset);

      atEnd = trim ? testRange.toString().trim() === '' : testRange.toString() === '';
    }
    
    return {atStart: atStart, atEnd: atEnd};
  };

  ret.insertAtCursor = function(hasSelectionCallback, noSelectionCallback) {
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
	};

	return ret;
}]);