// script.js
    var app = angular.module('App');

    // For the user
    app.controller('MainCtrl', function() {});

    app.controller('DiscussionCtrl', function($routeParams) {
        console.log($routeParams.page);
        this.message = $routeParams.page + ' Page';
    });

    