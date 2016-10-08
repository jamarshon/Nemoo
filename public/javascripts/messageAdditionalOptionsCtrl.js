var app = angular.module('App');

app.controller('MessageAdditionalOptionsCtrl', ['$scope', '$templateCache', '$mdMedia',
												function($scope, $templateCache, $mdMedia){
		var that = this;
		$templateCache.remove('/views/messageAdditionalOptions.ejs');
		
		this.pageKey = 'people';

		this.isLarge = $mdMedia('gt-xs');
		this.isAndroid = getMobileOperatingSystem() === 'Android';
		this.isFocused = false;

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

		// When the menu is clicked, the message box should always be focused on
	  this.showMenu = function($event) {
	  	if(that.isFocused) {
	  		additionalButtonEl.webuiPopover('show');
	  	} else {
	  		$('#message-input-box').focus();
			  	if(that.isAndroid) {
			  		$(window).one('resize', function(){
			  			additionalButtonEl.webuiPopover('show');
			  		});
			  	} else {
			  		additionalButtonEl.webuiPopover('show');
			  	}
	  	}
	  	
	  	$event.preventDefault();
	  };

	  $('#message-input-box').on({
	  	focus : function(){ that.isFocused = true; },
	  	blur : function(){
	  		if(that.isAndroid) {
		  		additionalButtonEl.webuiPopover('hide');
	  		}
	  		that.isFocused = false;
	  	}
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

	  $('body').click(function(){console.log('m6onkey');})

	  $scope.$on('destroy', function(){
	  	//$('#message-input-box').off();
	  }) 
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

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
}