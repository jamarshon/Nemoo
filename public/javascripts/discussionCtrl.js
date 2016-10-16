var app = angular.module('App');

var MAX_QUEUE_LENGTH = 25;

app.controller('DiscussionCtrl', ['$mdMedia', '$routeParams', '$rootScope', '$timeout', '$scope', '$templateCache',
                    'stateService', '$mdDialog', '$http', 'discussionCacheService', 'optimizationService',
                    function($mdMedia, $routeParams, $rootScope, $timeout, $scope, $templateCache, 
                      stateService, $mdDialog, $http, discussionCacheService, optimizationService) {
  var that = this;
  var page = $routeParams.page;
  console.log(page);
  //$templateCache.remove('/partials/' + page);

  this.init = function(pageName, prerenderedLen){
    stateService._state.page = page;
    stateService._state.pageName = pageName;

    this.addableToFavorites = stateService._state.loggedIn && stateService._state.user.favorites.indexOf(pageName) === -1;
    this.prerenderedLen = prerenderedLen;
    this.data = discussionCacheService.getData(page);
    
    stateService._state.socket.on(stateService._state.page + ' message received', function(msg, user){
      var dataLen = that.data.length;
      var message = {
        displayName: user.displayName,
        profilePic: user.profilePic,
        backgroundColor: user.backgroundColor,
        created: user.created,
        message: msg
      };
      if(that.prerenderedLen === 0) {
        that.data.shift();
      } else {
        if(dataLen === 0){
          that.lastPrerenderedEl.append($('<md-divider md-inset></md-divider>'));
        } else if(that.prerenderedLen + dataLen >= MAX_QUEUE_LENGTH) {
          that.$el.find('md-list-item').first().remove();
          that.prerenderedLen--;
        }
      }
      that.data.push(message);
      $scope.$apply();
    });
  };

  this.addToFavorite = function($event) {
    // Appending dialog to document.body to cover sidenav in docs app
    var pageName = stateService._state.pageName;
    var confirm = $mdDialog.confirm()
          .title('Add ' + pageName + ' to Favorites')
          .htmlContent('Confirm to display it under the Favorites tab on the sidebar. <br>To remove it, simply visit your settings under the General tab.')
          .targetEvent($event)
          .ok('Confirm')
          .cancel('Cancel');

    $mdDialog.show(confirm).then(function() {
      $http.post('/addToFavorite', {pageName: pageName}).then(function(){
        optimizationService.refreshPage();
      });
    }, function() {
    });
  };

  $timeout(function(){
    that.$el = $('#scrollable-container-list');
    that.lastPrerenderedEl = that.$el.find('md-list-item').last();
    that.lastPrerenderedEl.find('md-divider').remove();
  });

  var destroyHandler = $rootScope.$on('$routeChangeSuccess', function(){
    discussionCacheService.setData(page, that.data);
    that.$el = null;
    that.lastPrerenderedEl = null;
    that.data = null;
    stateService._state.socket.removeAllListeners(stateService._state.page + ' message received');
    destroyHandler();
  });
}]);

app.animation('.animate-message', [function() {
  var scrollBottom = function() {
    var scrollContainer = document.getElementById('scrollable-container');
    $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
  };
  return {
    enter: function(element) {
      $(element).addClass('animated bounce');
      scrollBottom();
    }
  };
}]);



