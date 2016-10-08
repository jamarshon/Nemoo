var app = angular.module('App');

var MAX_QUEUE_LENGTH = 25;

app.controller('DiscussionCtrl', ['$mdMedia', '$routeParams', '$timeout', '$scope', '$templateCache',
                    function($mdMedia, $routeParams, $timeout, $scope, $templateCache) {
  var that = this;
  var page = $routeParams.page;
  console.log(page);
  $templateCache.remove('/partials/' + page);

  this.init = function(main, name){
    main.page = page;
    this.main = main;
    this.pageName = name;
    this.main.socket.on(this.main.page + ' message received', function(msg, user){
      var message = {
        displayName: user.displayName,
        profilePic: user.profilePic,
        backgroundColor: user.backgroundColor,
        created: user.created,
        message: msg
      };
      if(that.data.length > MAX_QUEUE_LENGTH) {
        that.data.shift();
      }
      that.data.push(message);
      $scope.$apply();
    });
  };
}]);

app.animation('.animate-message', [function() {
  return {
    enter: function(element) {
      $(element).addClass('animated bounce');
      scrollBottom();
    }
  };
}]);



