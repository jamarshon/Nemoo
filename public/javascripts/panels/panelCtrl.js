var app = angular.module('App');
var general = [
  {
    url : '/explore',
    title: 'Explore',
    icon: 'cloud'
  },
  {
    url : '/settings',
    title: 'Settings',
    icon: 'settings'
  }
];

app.controller('PanelCtrl', ['$scope', '$mdDialog', '$mdSidenav', '$mdMedia', '$http', 
                  'optimizationService', 'stateService',
                  function($scope, $mdDialog, $mdSidenav, $mdMedia, $http, 
                    optimizationService, stateService) {
  var that = this;

  var createDiscussion = {
    callback : function(ev) {
        that.togglePanel(function(){
          $mdDialog.show({
            controller: 'DiscussionDialogCtrl',
            controllerAs: 'dlgCtrl',
            templateUrl: '/views/createDiscussionDialog.ejs',
            parent: angular.element(document.body),
            locals: {
              user: stateService._state.user,
            },
            targetEvent: ev,
            clickOutsideToClose:true
          });
        });
      },
    title: 'Create Discussion',
    icon: 'message'
  };

  if(!stateService._state.loggedIn) {
    general.pop();
  }
  general.unshift(createDiscussion);
  this.general = general;
  this.hideTrending = true;
  this.hideGeneral = false;
  this.hideFavorites = true;
  this.hideTopDiscussions = true;

  var favorites = stateService._state.user.favorites || [];
  this.favorites = favorites.map(function(x){ return {title: x};});

  $http.get('/trendingDiscussions').then(function(res){
    that.trending = res.data.trending;
  });

  that.topDiscussions = [];
  $http.get('/topDiscussions').then(function(res){
    res.data.topDiscussions.forEach(function(result){
      var topDiscussion = {
        categoryLabel: result.category,
        toggleBoolean: true,
        discussions: result.discussionNames
      };
      that.topDiscussions.push(topDiscussion);
    });
  });

  this.unfocus = function($event, item) {
    // This is for the Create Discussion
    if(item.callback) {  
      item.callback($event);
    } else {
      // Just redirect when click on a trending discussion or a redirect page
      var path = item.url || "/page/" + item.title.toLowerCase().split(' ').join('-');      
      // If it is a discussion page, the input will mess up small screens so togglePanel
      that.togglePanel(function(){
        that.softRedirect(path);
      });
    }
  };

  this.togglePanel = function(callback) {
    var sideNav = $mdSidenav('left'),
        large = $mdMedia('gt-sm');
    if(!large) {
      sideNav.close().then(callback);
    } else {
      callback();
    }
  };

  this.softRedirect = optimizationService.softRedirect;
}]);

app.directive('nemooPanel', function() {
  return {
    restrict: 'E',
    templateUrl: '/views/panel.ejs',
    controller: 'PanelCtrl',
    controllerAs: 'panelCtrl'
  };
});

app.directive('nemooTopDiscussions', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      toggleBoolean: '=',
      discussions: '=',
      fontStyling: '=',
      caretStyling: '=',
      itemStyling: '=',
      categoryLabel: '@',
      onClickHandler: '&',
    },
    templateUrl: '/views/topDiscussions.ejs',
    controller: ['$scope', function($scope){
      $scope.localClickHandler = function($event, name) {
        $scope.onClickHandler({localEvent: $event, localName: name});
      };
    }]
  };
});