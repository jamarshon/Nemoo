var app = angular.module('App');

app.factory('optimizationService', ['$window', '$location', 'loaderAnimation',
												function($window, $location, loaderAnimation){
	var ret = {};
	ret.hardRedirect = function(path) { loaderAnimation.show(); $window.location.href = path; };
  ret.softRedirect = function(path) { $location.url(path); ret.unbindAllEvents(); };
  
  ret.bindBodyBackDrop = function(){
    ret.dropdownEl = $('#dropdown-custom-angular');
  	$('body').on('click.dropdownSelect', function(e){
      // When the dropdown is open, any clicks outside should close it
  		if(ret.dropdownEl.hasClass('active')){
  			if(e.target !== ret.dropdownEl[0] && e.target !== ret.dropdownEl[0].firstChild) {
	        ret.dropdownEl.removeClass('active');
	      }
  		}
    });
  };

  ret.unbindBodyBackDrop = function(){
    if(ret.dropdownEl) {
      ret.dropdownEl.removeClass('active');
      ret.dropdownEl = null;
      $('body').off('click.dropdownSelect');
    }
  };

  ret.bindFocusHandler = function() {
    ret.isFocused = false;
    ret.isAndroid = getMobileOperatingSystem() === 'Android';
    ret.additionalButtonEl = $('#message-additional-button');
    $('#message-input-box').on({
      'focus.messageBox' : function(){ ret.isFocused = true; },
      'blur.messageBox' : function(){
        // When an android device unfocuses from the message box, the popover will be stuck in the middle so hide it
        if(ret.isAndroid) {
          ret.additionalButtonEl.webuiPopover('hide');
        }
        ret.isFocused = false;
      }
    });
  };

  // When the menu is clicked, the message box should always be focused on
  ret.handleMenuClick = function($event) {
    if(ret.isFocused) {
      // If the ui popover is already shown, then the android keyboard is probably showing as well
      ret.additionalButtonEl.webuiPopover('show');
    } else {
      $('#message-input-box').focus();
      // If the device is android, then wait until the keyboard to show up first
      if(ret.isAndroid) {
        $(window).one('resize.menuClick', function(){
          ret.additionalButtonEl.webuiPopover('show');
        });
      } else {
        ret.additionalButtonEl.webuiPopover('show');
      }
    }
    
    $event.preventDefault();
  };

  ret.unbindFocusHandlerAndMenuClick = function() {
    if(ret.additionalButtonEl) {
      $('#message-input-box').off('focus.messageBox blur.messageBox');
      $(window).off('resize.menuClick');
      ret.isFocused = false;
      ret.additionalButtonEl.webuiPopover('destroy');
      ret.additionalButtonEl = null;
    }
  };

  ret.unbindAllEvents = function() {
    ret.unbindBodyBackDrop();
    ret.unbindFocusHandlerAndMenuClick();
  };

  return ret;
}]);

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