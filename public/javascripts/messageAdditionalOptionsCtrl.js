var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$timeout', '$templateCache', '$mdMedia', 
												'optimizationService',
												function($scope, $timeout, $templateCache, $mdMedia, optimizationService){
		var that = this;
		$templateCache.remove('/views/messageAdditionalOptions.ejs');
		
		this.pageKey = 'people';
		this.isLarge = $mdMedia('gt-xs');

		this.onShowHandler = this.isLarge ? function(){} : function(element) {
			var windowWidth = $(window).width();
			var elementLeft = (windowWidth - 278)/2;
			var arrowLeft = that.$el.offset().left + that.$el.width()/2 - elementLeft;
			element.css("left", elementLeft);
			element.find('.webui-arrow').css("left", arrowLeft);
		};

	  this.addEmoji = function($event){
	  	var target = $($event.target);
	  	var span = target.prop("tagName") === 'SPAN' ? target : target.find('span');
	  	$scope.$parent.emoticonHandler(span);
	  	$event.preventDefault();
	  };

	  $scope.handlePageChange = function(selected) {
	  	that.pageKey = selected.pageKey;
	  };

	  $timeout(function(){
	  	that.$el = $('#message-additional-button > .material-icons');
	  	optimizationService.bindBodyBackDrop();
	  	optimizationService.bindFocusHandler();
	  	optimizationService.attachUIPopover();
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

