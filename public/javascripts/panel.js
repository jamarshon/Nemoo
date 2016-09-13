  var app         = angular.module('App');
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
  var trending = [
    { title: 'Cats', },
    { title: 'Some Article About Food' }
  ];

  app.controller('PanelCtrl', function($location, $mdDialog, $window) {
    var that = this;
    var createDiscussion = {
      callback : function(ev) {
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
            },
            controllerAs: 'dlgCtrl',
            templateUrl: '/views/createDiscussionDialog.ejs',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true
          });
        },
      title: 'Create Discussion',
      icon: 'message'
    };
    general.unshift(createDiscussion);
    this.general = general;
    this.trending = trending;

    this.unfocus = function($event, item) {
      // This is for the Create Discussion
      if(item.callback) {  
        item.callback($event);
      } else {
        // Just redirect when click on a trending discussion or a redirect page
        var path = item.url || "/page/" + item.title.toLowerCase().split(" ").join("");      
        that.softRedirect(path);
      }
      $($event.target).blur();
    };

    this.removeSettings = function(loggedIn) {
      return function(item) {
        if(item.title === 'Settings') {
          return loggedIn;
        }
        return true;
      }
    };

    this.softRedirect = function(path) { $location.url(path); };
  });

  app.controller('UserNavCtrl', function($window, $location) {
    this.hardRedirect = function(path) { $window.location.href = path; };
    this.softRedirect = function(path) { $location.url(path); };
    this.unfocus = function($event) { $($event.target).blur(); console.log($($event.target)); };
  });

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