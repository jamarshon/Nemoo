var app = angular.module('App');

var MAX_QUEUE_LENGTH = 25;

var scrollBottom = function() {
  var scrollContainer = document.getElementById('scrollable-container');
  $(scrollContainer).scrollTop(scrollContainer.scrollHeight);
};

app.controller('DiscussionCtrl', ['$mdMedia', 'toastManager', '$routeParams', '$timeout', '$scope', '$templateCache',
                    function($mdMedia, toastManager, $routeParams, $timeout, $scope, $templateCache) {
  var that = this;
  var page = $routeParams.page;
  console.log(page);
  $templateCache.remove('/partials/' + page);
  // Scroll the container to the bottom
  var scrollContainer = document.getElementById('scrollable-container');
  $timeout(function(){
    scrollBottom();
    if($mdMedia('gt-xs')) {
      var bottom = $('#message-input-box').offset().top + 26 + 48;
      if(bottom < $(window).height()){
        toastManager.showSimpleWithAction('Currently on ' + that.main.page, 1000);
      }
    }
  });

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



