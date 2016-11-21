var app = angular.module('App');

app.controller('ExploreCtrl', ['$http', '$window', '$scope', '$timeout', 'optimizationService',
											function($http, $window, $scope, $timeout, optimizationService){
	var that = this;
	var size = 200;
	this.size = size + 30;
	this.offset = size/2 + 5;

	$window.document.title = 'Nemoo - Explore';
	
	$http.get('/googleTrends').then(function(res){
		that.items = res.data;
	}, function(){
		that.items = [];
	});

	var resizeHandler = $scope.$watch(function(){ return $('#explore-page').width(); }, function(newVal, oldVal){
		if(newVal !== oldVal) {
			that.maxTiles = Math.floor(newVal / that.size);
			that.margin = newVal / (2 * that.maxTiles) - that.offset;
			console.log(that.margin);
			$timeout(function(){
				if(!that.items) { return; }
				var start, j, max;
				var i = 0, len = that.items.length;
				that.heights = _.map($('.explore-tile'), function(n){ return $(n).height(); });
				that.roundedHeights = [];
				while(i < len) {
					max = 0;
					start = i;
					i = Math.min(i + that.maxTiles, len);
					for(j = start; j < i; j++) {
						if(max < that.heights[j]) max = that.heights[j];
					}
					that.roundedHeights.push(max);
				}
			});
		}
	});

	var destroyHandler = $scope.$on('$destroy', function(){
		resizeHandler();
		destroyHandler();
	});

	this.getHeight = function(index){
		if(that.roundedHeights && that.roundedHeights.length) {
			var row = Math.floor(index / that.maxTiles);
			var diff = that.roundedHeights[row] - that.heights[index];
			return that.roundedHeights[row] + 'px';
		}
	};

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
  		category: 'Recent',
  		name: data.name.toLowerCase().split(' ').join('-'),
  		description: description,
  		user: dummyUser
  	};
  };
}]);