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

app.controller('DiscussionDialogCtrl', ['$mdDialog', '$location', '$http', '$scope', 'user',
													'toastManager',
													function($mdDialog, $location, $http, $scope, user, toastManager){
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

  this.data = {category: '', name: '', description: '', user: user};
  this.submit = function(url, user) {
  	var postData = that.cleanData(that.data);
    $http.post(url, postData).success(function(data){
      if(data.redirect) {
          $location.path(data.redirect);
          that.cancel();
          toastManager.showSimple('Successfully create discussion!!', 3000);
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