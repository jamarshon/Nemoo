  // initApp.js  
    var app = angular.module('App', ['ngRoute', 'ngMaterial', 'ngMessages']);

    // configure our routes
    app.config(function($routeProvider, $locationProvider, $mdThemingProvider) {
        $routeProvider
            .when('/page/:page', {
                templateUrl : function(params){ return '/partials/' + params.page + '.ejs'; } ,
                controller  : 'DiscussionCtrl',
                controllerAs: 'ctrl'
            });
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        
        var customMap = $mdThemingProvider.extendPalette('deep-purple', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('custom', customMap);
        $mdThemingProvider.theme('default')
            .primaryPalette('custom', {
                'default': '500',
                'hue-1': '50'
            })
            .accentPalette('amber');
        $mdThemingProvider.theme('input', 'default')
            .primaryPalette('grey');
    });

    // Fix for facebook issue where after authentication it adds #_=_ to the url
    $(window).on('load', function(e){
      if (window.location.hash == '#_=_') {
        window.location.hash = ''; // for older browsers, leaves a # behind
        history.pushState('', document.title, window.location.pathname); // nice and clean
        e.preventDefault(); // no page reload
      }
    });
