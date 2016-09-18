  var app = angular.module('App');
  var general = [
    {
      url : '/contact',
      title: 'Contact Us',
      icon: 'email'
    },
    {
      url : '/settings',
      title: 'Settings',
      icon: 'settings'
    }
  ];

  app.controller('PanelCtrl', ['$location', '$mdDialog', '$mdSidenav', '$mdMedia', '$http',
                    function($location, $mdDialog, $mdSidenav, $mdMedia, $http) {
    var that = this;
    var createDiscussion = {
      callback : function(ev) {
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
        },
      title: 'Create Discussion',
      icon: 'message'
    };
    general.unshift(createDiscussion);
    this.general = general;
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
        that.softRedirect(path);
        // If it is a discussion page, the input will mess up small screens so togglePanel
        if(!item.url) {
          that.togglePanel();
        }
      }
      $($event.target).blur();
    };

    this.togglePanel = function() {
      var sideNav = $mdSidenav('left'),
          large = $mdMedia('gt-sm');
      if(!large) {
        sideNav.close();
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

    this.softRedirect = function(path) { $location.url(path); };
  }]);

  app.controller('UserNavCtrl', ['$window', '$location', function($window, $location) {
    this.hardRedirect = function(path) { $window.location.href = path; };
    this.softRedirect = function(path) { $location.url(path); };
    this.unfocus = function($event) { $($event.target).blur(); };
  }]);

  app.directive('nemooPanel', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/panel.ejs',
      controller: 'PanelCtrl',
      controllerAs: 'panelCtrl'
    };
  });

  app.directive('nemooUserNavPanel', function() {
    return {
      restrict: 'E',
      templateUrl: '/views/userNavPanel.ejs',
      controller: 'UserNavCtrl',
      controllerAs: 'userNavCtrl'
    };
  });