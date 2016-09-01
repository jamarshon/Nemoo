// script.js

    // create the module and name it scotchApp
        // also include ngRoute for all our routing needs
    var scotchApp = angular.module('scotchApp', ['ngRoute']);

    // configure our routes
    scotchApp.config(function($routeProvider, $locationProvider) {
        $routeProvider
            // route for the home page
            .when('/page/:filename', {
                templateUrl : function(params){ return '/partials/' + params.filename + '.ejs'; },
                controller  : 'test',
                controllerAs: 'ctrl'
            });
        $locationProvider.html5Mode(true);
    });

    // create the controller and inject Angular's $scope
    scotchApp.controller('test', function($http) {
        // create a message to display in our view
        var self = this;
        this.secondMessage = 'Everyone come and see how good I look!';
        this.formData = {email: '', password: ''};
        this.processForm = function(url) {
            $http.post(url, this.formData).success(function(data){
                self.secondMessage = data.message;
                if(data.redirect){ window.location = data.redirect; }
            });
        };
    });

    scotchApp.controller('mainController', function($http) {
        // create a message to display in our view
        this.message="main";
        this.logout = function() {
            $http.get('/logout').success(function(data){
                window.location = data.redirect;
            });
        };
        this.facebook = function() {
            window.location = "/auth/facebook";
        };
    });