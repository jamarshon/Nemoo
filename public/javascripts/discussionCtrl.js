var app = angular.module('App');

var MAX_QUEUE_LENGTH = 25;

app.controller('DiscussionCtrl', ['$mdMedia', '$routeParams', '$timeout', '$scope', '$templateCache',
                    'stateService', '$mdDialog', '$http', 'toastManager', '$window',
                    function($mdMedia, $routeParams, $timeout, $scope, $templateCache, 
                      stateService, $mdDialog, $http, toastManager, $window) {
  var that = this;
  var page = $routeParams.page;
  $templateCache.remove('/partials/' + page);

  this.init = function(pageName, prerenderedLen){
    $window.document.title = 'Nemoo - ' + pageName;
    stateService._state.page = page;
    stateService._state.pageName = pageName;

    this.addableToFavorites = stateService._state.loggedIn && stateService._state.user.favorites.indexOf(pageName) === -1;
    this.prerenderedLen = prerenderedLen;
    this.data = [];
    
    stateService._state.socket.on(stateService._state.page + ' message received', this.receiveMessage);
  };

  this.receiveMessage = function(msg, user, silent){
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
    if(!silent) {
      $scope.$apply();
    }
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
        stateService._state.user.favorites.push(pageName);
        toastManager.showSimpleWithAction('Successfully favorited ' + pageName, 3000);
        that.addableToFavorites = false;
      });
    }, function() {
      toastManager.showSimpleWithAction('Error could not favorite', 3000);
    });
  };

  this.quickMessageHandler = function(msg, user){
    var clonedUser = {displayName: user.displayName, profilePic: user.profilePic, backgroundColor: user.backgroundColor, created: Date.now()};
    this.receiveMessage(msg, clonedUser, true);
  };

  $timeout(function(){
    that.$el = $('#scrollable-container-list');
    that.lastPrerenderedEl = that.$el.find('md-list-item').last();
    that.lastPrerenderedEl.find('md-divider').remove();
  });

  var destroyHandler = $scope.$on('$destroy', function(){
    that.$el = null;
    that.lastPrerenderedEl = null;
    that.data = null;
    stateService._state.socket.removeListener(stateService._state.page + ' message received', that.receiveMessage);
    destroyHandler();
  });
}]);

app.animation('.animate-message', ['animationService', function(animationService) {
  var scrollBottom = function() {
    var scrollContainer = document.getElementById('scrollable-container');
    $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
  };
  return {
    enter: function(element) {
      animationService.animateCss(element, 'bounce');
      scrollBottom();
    }
  };
}]);



