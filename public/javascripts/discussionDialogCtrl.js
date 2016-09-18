var app = angular.module('App');
var options = [
	'Advice',
	'Animals',
	'Automotive',
	'Books',
	'Business',
	'Career',
	'Celebrity',
	'Debate',
	'Entertainment',
	'Environment',
	'Family',
	'Fashion',
	'Finance',
	'Food',
	'Gaming',
	'Health',
	'Hobbies',
	'Humor',
	'Lifestyle',
	'Movies',
	'Music',
	'News',
	'Religion',
	'Science',
	'Sports',
	'Technology',
	'Television',
	'Travel',
	'Weather',
];

app.controller('DiscussionDialogCtrl', ['$mdDialog', '$window', '$http', '$scope', 'user',
													function($mdDialog, $window, $http, $scope, user){
	var that = this;
	this.options = options.map(function(e){
		return {
			text: e,
			val: e.toLowerCase()
		}
	});

	this.hide = function() {
	  $mdDialog.hide();
	};
	this.cancel = function() {
	  $mdDialog.cancel();
	};
	this.redirect = function(path) {
	  $window.location.href = path;
	};

  this.data = {category: '', name: '', description: '', user: user};
  this.submit = function(url, user) {
  	var postData = that.cleanData(that.data);
    $http.post(url, postData).success(function(data){
      if(data.redirect) {
          $window.location.href = data.redirect;
      } else {
          that.message = data.message;
      }
    });
  };

  this.cleanData = function(data){
  	return {
  		category: data.category,
  		name: data.name.toLowerCase().split(' ').join('-'),
  		description: data.description,
  		user: data.user
  	};
  };
}]);
