var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$rootScope', '$timeout', '$templateCache', '$mdMedia', 
												'optimizationService',
												function($scope, $rootScope, $timeout, $templateCache, $mdMedia, optimizationService){
	var that = this;
	//$templateCache.remove('/views/messageAdditionalOptions.ejs');

	this.pageKey = 'people';
	var sizeHandler = $scope.$watch(function() { return $mdMedia('gt-xs'); }, function(open) {
    that.isLarge = open;
  });

	this.onShowHandler = function(element) {
		if(!that.isLarge) {
			var windowWidth = $(window).width();
			var elementLeft = (windowWidth - 278)/2;
			var arrowLeft = that.$el.offset().left + that.$el.width()/2 - elementLeft;
			element.css("left", elementLeft);
			element.find('.webui-arrow').css("left", arrowLeft);
		}
	};

	this.addEmoji = function($event){
		var target = $($event.target);
		var span = target.prop("tagName") === 'SPAN' ? target : target.find('span');
		var emoticonClass = span.attr('class');
		this.animateCss(span, 'rubberBand');
		$scope.$parent.emoticonHandler(emoticonClass);
		$event.preventDefault();
	};

	this.animateCss = function (element, animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    element.addClass('animated ' + animationName).one(animationEnd, function() {
    	element.removeClass('animated ' + animationName);
    });
  };

	$scope.handlePageChange = function(selected) {
		that.pageKey = selected.pageKey;
	};

	$timeout(function(){
		that.$el = $('#message-additional-button > .material-icons');
		optimizationService.bindBodyBackDrop();
		optimizationService.bindFocusHandler();
		optimizationService.attachUIPopover(that.onShowHandler);
		that.showMenu = optimizationService.handleMenuClick;
	});

	var destroyHandler = $rootScope.$on('$routeChangeSuccess', function(){
    that.$el = null;
    sizeHandler();
    destroyHandler();
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

