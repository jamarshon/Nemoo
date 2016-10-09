var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$timeout', '$templateCache', '$mdMedia', 
												'optimizationService',
												function($scope, $timeout, $templateCache, $mdMedia, optimizationService){
		var that = this;
		$templateCache.remove('/views/messageAdditionalOptions.ejs');
		
		this.pageKey = 'people';
		this.isLarge = $mdMedia('gt-xs');

		var emoticon = $('#message-additional-button > .material-icons');
		var additionalButtonEl = $('#message-additional-button');

		var onShowHandler = this.isLarge ? function(){} : function(element) {
			var windowWidth = $(window).width();
			var elementLeft = (windowWidth - 278)/2;
			var arrowLeft = emoticon.offset().left + emoticon.width()/2 - elementLeft;
			element.css("left", elementLeft);
			element.find('.webui-arrow').css("left", arrowLeft);
		};

		additionalButtonEl.webuiPopover({
	    animation: 'pop', 
	    url: '#myContent',
	    onShow: onShowHandler,
	    trigger: 'manual',
	    closeable: true
	  });

	  this.addEmoji = function($event){
	  	var target = $($event.target);
	  	var span = target.prop("tagName") === 'SPAN' ? target : target.find('span');
	  	$scope.$parent.emoticonHandler(span.attr('title'));
	  	$event.preventDefault();
	  };

	  $scope.handlePageChange = function(selected) {
	  	that.pageKey = selected.pageKey;
	  };

	  $timeout(function(){
	  	optimizationService.bindBodyBackDrop();
	  	optimizationService.bindFocusHandler();
	  	that.showMenu = optimizationService.handleMenuClick;
	  });
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

