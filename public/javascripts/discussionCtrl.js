var app = angular.module('App');

var MAX_QUEUE_LENGTH = 25;

app.controller('DiscussionCtrl', ['$mdMedia', '$routeParams', '$rootScope', '$timeout', '$scope', '$templateCache',
                    function($mdMedia, $routeParams, $rootScope, $timeout, $scope, $templateCache) {
  var that = this;
  var page = $routeParams.page;
  console.log(page);
  //$templateCache.remove('/partials/' + page);

  this.init = function(main, name, prerenderedLen){
    main.page = page;
    this.main = main;
    this.pageName = name;
    this.prerenderedLen = prerenderedLen;
    this.data = [];
    this.main.socket.on(this.main.page + ' message received', function(msg, user){
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

  $timeout(function(){
    that.$el = $('#scrollable-container-list');
    that.lastPrerenderedEl = that.$el.find('md-list-item').last();
    that.lastPrerenderedEl.find('md-divider').remove();
  });

  var destroyHandler = $rootScope.$on('$routeChangeSuccess', function(){
    that.$el = null;
    that.lastPrerenderedEl = null;
    that.data = null;
    destroyHandler();
  });
}]);

app.animation('.animate-message', [function() {
  return {
    enter: function(element) {
      $(element).addClass('animated bounce');
      scrollBottom();
    }
  };
}]);



