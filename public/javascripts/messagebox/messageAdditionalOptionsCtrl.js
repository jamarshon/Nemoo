var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$rootScope', '$timeout', '$templateCache', '$mdMedia', 
												'optimizationService', '$http', 'stateService', 'toastManager',
												function($scope, $rootScope, $timeout, $templateCache, $mdMedia, optimizationService, 
													$http, stateService, toastManager){
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

  window.fd.logging = false;
  this.beforeSend = false;
  this.uri = null;
  var zone = new FileDrop('zthumbs', {input: false});

	zone.event('upload', function (e) {
		var images = zone.eventFiles(e).images();
		var file = images[0];
		$(zone.el).find("img").remove();
		file.readDataURI(function(uri) {
	    var img = new Image();
	    img.src = uri;
	    zone.el.appendChild(img);
	    that.uri = uri;
	    that.beforeSend = true;
	    $scope.$apply();
	  });
	});

	this.submitFile = function() {
		this.beforeSend = false;
		$(zone.el).find("img").remove();
  	$http.post('/uploadTempImage', {uri: this.uri, page: stateService._state.page}).then(function(result){
  		var url = result.data.url;
  		if(url) {
  			$scope.$parent.imageHandler(url);
  		} else {
  			toastManager.showSimpleWithAction('Error image upload failed', 1000);
  		}
  	}, function(){
  		toastManager.showSimpleWithAction('Error image upload failed', 1000);
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
    that.uri = null;
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

