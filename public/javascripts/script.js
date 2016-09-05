// script.js
    var app = angular.module('App');

    app.controller('MainCtrl', function() {
        
    });

    app.controller('DiscussionCtrl', function($routeParams) {
        console.log($routeParams.page);
        this.message = $routeParams.page + ' Page';
    });

    app.controller('AuthenticationCtrl', function($http, $window) {
        var that = this;
        this.data = {email: '', password: '', password2: ''};
        this.submit = function(url) {
            console.log(url);
            $http.post(url, that.data).success(function(data){
                if(data.redirect) {
                    $window.location.href = data.redirect;
                } else {
                    that.message = data.message;
                }
            });
        };
    });

    app.controller('HeaderCtrl', function($window, $mdSidenav, $mdMedia, $mdDialog) {
        var that = this;
        that.open = $mdMedia('gt-sm');
        that.height = $(window).height() - $("#nemoo-toolbar").height();

        $(window).resize(function(){ 
            that.open = !$mdMedia('gt-sm');
            that.height = $(window).height() - $("#nemoo-toolbar").height();
        });
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

        this.showTabDialog = function(ev) {
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

    app.directive('nemooLogin', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/login.ejs',
            controller: 'AuthenticationCtrl',
            controllerAs: 'loginCtrl'
        };
    });

    app.directive('nemooSignUp', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/signup.ejs',
            controller: 'AuthenticationCtrl',
            controllerAs: 'signUpCtrl'
        };
    });