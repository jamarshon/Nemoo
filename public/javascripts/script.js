// script.js
    var app = angular.module('App');

    app.controller('MainController', function() {
        
    });

    app.controller('DiscussionCtrl', function($routeParams) {
        console.log($routeParams.page);
        this.message = $routeParams.page + ' Page';
    });

    app.controller('HeaderController', function($window, $mdSidenav, $mdMedia, $mdDialog) {
        var that = this;
        that.open = $mdMedia('gt-md');
        $(window).resize(function(){ 
            that.open = !$mdMedia('gt-md'); });
        this.test = function() {
            var sideNav = $mdSidenav('left'),
                large = $mdMedia('gt-md');
            if(large) {
                that.open = !that.open;
            } else {
                sideNav.toggle();
            }
        };
        this.redirect = function(path) {
            $window.location.href = path;
            //$http.get('/logout').success(function(data){ window.location = data.redirect; });
        };

        this.showTabDialog = function(ev) {
            console.log('hi');
            $mdDialog.show({
              controller: function($mdDialog, $window){
                this.hide = function() {
                  $mdDialog.hide();
                };
                this.cancel = function() {
                    $mdDialog.cancel();
                };
                this.answer = function(answer) {
                  $mdDialog.hide(answer);
                };
                this.redirect = function(path) {
                    $window.location.href = path;
                };
              },
              controllerAs: 'dlg',
              templateUrl: '/views/login.ejs',
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
            controller: 'HeaderController',
            controllerAs: 'header'
        };
    });