	
	var app = angular.module('App');
	
	app.controller('HeaderCtrl', ['$scope', '$window', '$mdSidenav', '$mdMedia', '$mdDialog', '$location', 
                        function($scope, $window, $mdSidenav, $mdMedia, $mdDialog, $location) {
        var that = this;
        var isAndroid = getMobileOperatingSystem() === 'Android';

        var windowsResizeHandler = function(event){
            var newHeight = $(window).height() - $("#nemoo-toolbar").height();
            if(isAndroid) {
                if(!that.height) {
                    that.height = newHeight;
                }
            } else {
                that.height = newHeight;
            }
        };

        $scope.$watch(function() { return $mdMedia('gt-sm'); }, function(open) {
            that.open = open;
        });

        $(window).resize(windowsResizeHandler);
        windowsResizeHandler();

        this.togglePanel = function() {
            var sideNav = $mdSidenav('left'),
                large = $mdMedia('gt-sm');
            if(large) {
                that.open = !that.open;
            } else {
                sideNav.toggle();
            }
        };

        this.hardRedirect = function(path) { $window.location.href = path; };
        this.softRedirect = function(path) { $location.url(path); };

        this.showTabDialog = function(ev, tabIdx) {
            $mdDialog.show({
              controller: function($mdDialog, $window){
                this.hide = function() {
                    $mdDialog.hide();
                };
                this.cancel = function() {
                    $mdDialog.cancel();
                };
                this.redirect = function(path) {
                    $window.location.href = path;
                };
                this.selected = tabIdx;
              },
              controllerAs: 'dlgCtrl',
              templateUrl: '/views/loginDialog.ejs',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true
            });
        };
    }]);

    app.directive('nemooHeader', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/header.ejs',
            controller: 'HeaderCtrl',
            controllerAs: 'header'
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