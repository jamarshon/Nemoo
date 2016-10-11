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

app.controller('PanelCtrl', ['$mdDialog', '$mdSidenav', '$mdMedia', '$http', 'optimizationService',
                  function($mdDialog, $mdSidenav, $mdMedia, $http, optimizationService) {
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
              user: that.main.user,
            },
            targetEvent: ev,
            clickOutsideToClose:true
          });
        });
      },
    title: 'Create Discussion',
    icon: 'message'
  };
  general.unshift(createDiscussion);
  this.general = general;
  this.hideTrending = false;

  $http.get('/trendingDiscussions').then(function(res){
    that.trending = res.data.discussions.map(function(e){
      return {title: e};
    });
  });

  this.init = function(main){
    that.main = main;
  };

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
    $($event.target).blur();
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

  // Removes the setting option from the panel if the user is not logged in
  this.removeSettings = function(loggedIn) {
    return function(item) {
      if(item.title === 'Settings') {
        return loggedIn;
      }
      return true;
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