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

app.controller('DiscussionDialogCtrl', ['$mdDialog', '$http', '$scope', 'user',
													'toastManager', 'optimizationService',
													function($mdDialog, $http, $scope, user, toastManager, optimizationService){
	var that = this;
	this.options = options;

	this.hide = function() {
	  $mdDialog.hide();
	};
	this.cancel = function() {
	  $mdDialog.cancel();
	};

  this.data = {category: '', name: '', description: '', user: user};
  this.submit = function(url) {
  	var postData = that.cleanData(that.data);
    $http.post(url, postData).then(function(res){
    	var redirect = res.data.redirect;
      if(redirect) {
          optimizationService.softRedirect(redirect);
          that.cancel();
          toastManager.showSimpleWithAction('Successfully create discussion!', 3000);
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
