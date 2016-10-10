var moment = require('moment');
var Util = require('./util');

var DiscussionRenderer = {};

DiscussionRenderer.getPrerendered = function(discussion) {
	var message;
	return discussion.data.map(function(item, i){
    message = Util.decodeUTF8(item.message);
    return DiscussionRenderer._template(item, message);
  });
};

DiscussionRenderer._template = function(item, message){ return '<md-list-item class="md-3-line animate-message"><img ng-src="' + item.profilePic + '" class="md-avatar" ng-style="{&#39;background-color&#39;: &#39;' + item.backgroundColor + '&#39; } "/><div class="md-list-item-text"><h3 style="display:inline;">' + item.displayName + '</h3><h4 hide show-gt-sm style="float: right;">' + moment(item.created).format("h:mm a MMM D, YYYY") + '</h4><h4 hide-gt-sm style="float: right;">' + moment(item.created).format("hh:mm") + '</h4><p style="color: rgba(0,0,0,0.70); word-break: break-word; font-size: 18px;">' + message + '</p></div><md-divider md-inset></md-divider></md-list-item>';}

DiscussionRenderer._templateFull = function(item, message) {
	return '<md-list-item class="md-3-line animate-message">' + 
        '<img ng-src="' + item.profilePic + '" class="md-avatar" ng-style="{&#39;background-color&#39;: &#39;' + item.backgroundColor + '&#39; } "/>' +
        '<div class="md-list-item-text">' +
          '<h3 style="display:inline;">' + item.displayName + '</h3>' +
          '<h4 hide show-gt-sm style="float: right;">' + moment(item.created).format("h:mm a MMM D, YYYY") + '</h4>' + 
          '<h4 hide-gt-sm style="float: right;">' + moment(item.created).format("hh:mm") + '</h4>' +
          '<p style="color: rgba(0,0,0,0.70); word-break: break-word; font-size: 18px;"></p>' + message +
        '</div>' +
        '<md-divider md-inset></md-divider>' + 
      '</md-list-item>';
};

module.exports = DiscussionRenderer;