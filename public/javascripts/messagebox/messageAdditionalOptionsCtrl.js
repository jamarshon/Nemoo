var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$rootScope', '$timeout', '$templateCache', '$mdMedia', 
												'optimizationService', '$http', 'stateService', 'toastManager', 'animationService',
												function($scope, $rootScope, $timeout, $templateCache, $mdMedia, optimizationService, 
													$http, stateService, toastManager, animationService){
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
		animationService.animateCss(span, 'rubberBand');
		$scope.$parent.emoticonHandler(emoticonClass);
		$event.preventDefault();
	};

  window.fd.logging = false;
  this.beforeSend = false;
  this.uri = null;
  this.fileInput = $("#zthumbs-input");
  this.zone = new FileDrop('zthumbs', {input: false});

	this.zone.event('upload', function (e) {
		var images = that.zone.eventFiles(e).images();
		var file = images[0];
		$(that.zone.el).find("img").remove();
		if(typeof file === 'undefined') {
			toastManager.showSimpleWithAction('Invalid file type (requires jpeg, png, gif, etc.)', 3000);
		} else {
			that.previewImage(file);
		}
	});

	var loader = document.getElementById('zthumbs-loader');
	this.previewImage = function(file) {
		loader.style.display = 'block';
		file.readDataURI(function(uri) {
			loader.style.display = 'none';
	    var img = new Image();
	    img.src = uri;
	    that.zone.el.appendChild(img);
	    that.uri = uri;
	    that.beforeSend = true;
	    $scope.$apply();
	  });
	};

	this.chooseImage = function($event){
		$event.stopPropagation();
    $event.preventDefault();
    if(!this.beforeSend){
    	this.fileInput[0].value = null;
			this.fileInput.trigger('click');
    }
	};

  this.fileInput.on('change', function(){
  	var files = that.fileInput[0].files;
  	var file = new fd.File(files[0]);

  	if(file.mime.indexOf('image') === -1) {
			toastManager.showSimpleWithAction('Invalid file type (requires jpeg, png, gif, etc.)', 3000);
		} else {
			that.previewImage(file);
  	}
  });

	this.submitFile = function($event) {
		this.removeFile($event);
  	this.uploadImage();
	};

	this.uploadImage = function(){
		$http.post('/uploadTempImage', {uri: this.uri, page: stateService._state.page}).then(function(result){
  		var url = result.data.url;
  		if(url) {
  			$scope.$parent.imageHandler(url);
  		} else {
  			toastManager.showSimpleWithAction('Error image upload failed', 3000);
  		}
  	}, function(err){
  		toastManager.showSimpleWithAction('Error image upload failed ' + err.statusText, 3000);
  	});
	};

	this.removeFile = function($event){
		$event.stopPropagation();
    $event.preventDefault();
		this.beforeSend = false;
		$(this.zone.el).find("img").remove();
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
		// _.reduce(this.zone.events, function(memo, e, i){ if(e.length){ memo.push(i); }  return memo; }, []);
		var events = ["dragEnter", "dragLeave", "dragOver", "upload", "uploadElsewhere", "inputSetup", "send"];
		_.each(events, function(event){ that.zone.event(event, null); });
    that.$el = null;
    that.fileInput = null;
    that.zone = null;
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

