var app = angular.module('App');

app.controller('ExploreCtrl', ['$http', '$window', '$scope', '$timeout', 'optimizationService',
											function($http, $window, $scope, $timeout, optimizationService){
	var that = this;
	$window.document.title = 'Nemoo - Explore';
	that.loaded = -1;

	$http.get('/googleTrends').then(function(res){
		that.items = res.data;
		that.loaded = 1;
	}, function(){
		that.items = [];
		that.loaded = 1;
	});

	var resizeHandler = $scope.$watch(function(){ return $('#explore-page').width() * that.loaded; }, function(newVal, oldVal){
		$timeout(function(){
			if(!that.items || that.items.length === 0) { return; }
			var dummyItemEl;
			var explorePageEl = $('#explore-page');

			// Remove previous dummy elements
			explorePageEl.find('.dummy-explore').remove();

			var offSetTopMap = _.groupBy(explorePageEl.children(), function(n){ return n.offsetTop; }),
					numRows = Object.keys(offSetTopMap).length;

			if(numRows < 2){ return; } // Since there is less than two rows we don't need to worry about uneven spacings

			var dummyItemLen = 0;
					prevHeight = explorePageEl[0].clientHeight,
					currHeight = prevHeight;

			// Keep adding dummy items until the height increases
			while(currHeight === prevHeight) {
				dummyItemEl = $('<div>', {class: 'explore-tile dummy-explore', style: 'visibility: hidden'});
				explorePageEl.append(dummyItemEl);
				currHeight = explorePageEl[0].clientHeight;
				dummyItemLen++;
			}

			explorePageEl.children().last().remove();
		});
	});

	var destroyHandler = $scope.$on('$destroy', function(){
		resizeHandler();
		destroyHandler();
	});

	// Creates discussion if it doesn't exist already
	this.handleClick = function(item, event) {
		var description = $(event.target).parent().find('.explore-description').text().trim();
		var postData = that.cleanData(item, description);
    $http.post('/createDiscussion', postData).then(function(res){
      optimizationService.softRedirect('/page/' + postData.name);
    });
	};

	this.cleanData = function(data, description){
		var dummyUser = {
			displayName: 'Admin',
			profilePic: '/images/user/tabby.jpg',
		};
  	return {
  		category: window.nemooCategory || 'Recent',
  		name: data.name.toLowerCase().split(' ').join('-'),
  		description: description,
  		user: dummyUser
  	};
  };
}]);