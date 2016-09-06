// script.js
    var app = angular.module('App');

    app.controller('MainCtrl', function() {
        
    });

    app.controller('DiscussionCtrl', function($routeParams) {
        console.log($routeParams.page);
        this.message = $routeParams.page + ' Page';
    });

    app.controller('HeaderCtrl', function($scope, $window, $mdSidenav, $mdMedia, $mdDialog) {
        var that = this;
        var windowsResizeHandler = function(){ that.height = $(window).height() - $("#nemoo-toolbar").height(); };

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

        this.redirect = function(path) { $window.location.href = path; };

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
    });

    app.directive('nemooHeader', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/header.ejs',
            controller: 'HeaderCtrl',
            controllerAs: 'header'
        };
    });