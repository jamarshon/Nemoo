var app = angular.module('App', ['ngRoute', 'ngMaterial', 'ngMessages', 'ngAnimate', 'ngSanitize', 'templates']);

// configure our routes
app.config(['$routeProvider', '$locationProvider', '$mdThemingProvider', '$compileProvider',
    function($routeProvider, $locationProvider, $mdThemingProvider, $compileProvider) {
  // Routing
  $routeProvider
    .when('/page/:page', {
      templateUrl : function(params){ return '/partials/' + params.page; } ,
      controller  : 'DiscussionCtrl',
      controllerAs: 'discussionCtrl'
    })
    .when('/', {
        templateUrl : '/views/home.ejs',
        controller: ['$window', function($window){
          $window.document.title = 'Nemoo';
        }]
    });
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });

  // Optimization for production (comment out during development)
  //$compileProvider.debugInfoEnabled(false);
  checkAndUpdateFBURL();
  
  // Theme
  var customMap = $mdThemingProvider.extendPalette('indigo', {
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
  // var customPrimary = {
  //       '50': '#ffe6d3',
  //       '100': '#ffd7ba',
  //       '200': '#ffc9a0',
  //       '300': '#ffba87',
  //       '400': '#ffac6d',
  //       '500': '#ff9d54',
  //       '600': '#ff8e3a',
  //       '700': '#ff8021',
  //       '800': '#ff7107',
  //       '900': '#ed6500',
  //       'A100': '#fff5ed',
  //       'A200': '#ffffff',
  //       'A400': '#ffffff',
  //       'A700': '#d35a00',
  //       'contrastDefaultColor': 'light',
  //       'contrastDarkColors': ['50'],
  //   };

  //   $mdThemingProvider
  //       .definePalette('customPrimary', 
  //                       customPrimary);
  //   $mdThemingProvider.theme('default')
  //      .primaryPalette('customPrimary')
  //      .accentPalette('amber');
}]);

// Fix for facebook issue where after authentication it adds #_=_ to the url
function checkAndUpdateFBURL() {
  if (window.location.hash == '#_=_') {
    window.location.hash = ''; // for older browsers, leaves a # behind
    history.pushState('', document.title, window.location.pathname); // nice and clean
    //e.preventDefault(); // no page reload
  }
}