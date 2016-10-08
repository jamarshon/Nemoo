var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$templateCache', '$mdMedia', 'emoticons',
												function($scope, $templateCache, $mdMedia, emoticons){
		var that = this;
		$templateCache.remove('/views/messageAdditionalOptions.ejs');
		this.emoticons = emoticons;
		this.emoticonIndex = 0;

		this.isLarge = $mdMedia('gt-xs');
		var emoticon = $('#message-additional-button > .material-icons');

		var onShowHandler = this.isLarge ? function(){}: function(element) {
			var windowWidth = $(window).width();
			var elementLeft = (windowWidth - 278)/2;
			var arrowLeft = emoticon.offset().left + emoticon.width()/2 - elementLeft;
			element.css("left", elementLeft);
			element.find('.webui-arrow').css("left", arrowLeft);
		};

		$('#message-additional-button').webuiPopover({title:'Emoticons', 
	    animation: 'pop', 
	    url: '#myContent',
	    onShow: onShowHandler
	  });

	  this.showMenu = function(){
    	$('#message-additional-button').webuiPopover('show');
    	$('#message-input-box').focus();
	  };

	  this.addEmoji = function($event){
	  	var target = $($event.target);
	  	var span = target.prop("tagName") === 'SPAN' ? target : target.find('span');
	  	$scope.$parent.emoticonHandler(span.attr('title'));
	  	$event.preventDefault();
	  }
	}]);

app.directive('nemooMessageAdditionalOptions', function(){
	return {
		restrict: 'E',
		scope: {},
		templateUrl: '/views/messageAdditionalOptions.ejs',
		controller: 'MessageAdditionalOptionsCtrl',
		controllerAs: 'messageAddCtrl'
	};
});