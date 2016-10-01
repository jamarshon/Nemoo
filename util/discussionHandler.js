var Q			= require('q');
var Discussion  = require('../app/models/discussionModel');

var discussionHandler = {};

discussionHandler.empty = function() {
	Discussion.remove({}, function(){});
};

discussionHandler.getDiscussion = function(discussionName) {
	var deferred = Q.defer();
	Discussion.findOne({ 'name' :  discussionName }, function(err, discussion) {
	    if (err){ // if there are any errors, return the error
	    	deferred.reject(err);
	    } else if (!discussion) { // if no discussion is found, return the message
	    	deferred.reject(discussionName + ' does not exist. Be the first to create it!');
	    } else{
	    	deferred.resolve(discussion);
	    }
	});
	return deferred.promise;
};

discussionHandler.createDiscussion = function(category, name, description, user) {
	var deferred = Q.defer();
	Discussion.findOne({ 'name' :  name }, function(err, discussion) {
	    if (err){ // if there are any errors, return the error
	    	deferred.reject(err);
	    } else if (!discussion) { // if no discussion is found, create a new discussion
	    	console.log('New discussion created: ' + name);
	    	var newDiscussion       					= new Discussion();
				    newDiscussion.name     				= name;
				    newDiscussion.description     = description;
				    newDiscussion.category				= category;
				    newDiscussion.messageCount		= 0;
				    newDiscussion.data						= [];
				newDiscussion.addMessage(user.displayName, user.profilePic, description, user.backgroundColor, Date.now());
	    	deferred.resolve(newDiscussion);
	    } else{
	    	deferred.reject('The discussion "' + name + '" already exists. Please select an unique one');
	    }
	});
	return deferred.promise;
};

discussionHandler.getTrending = function() {
	var deferred = Q.defer();
	Discussion.find({}).sort({ messageCount : 'desc' }).limit(7).exec(function(err, discussions) {
		if(err) {
			deferred.reject(err);
		} else{
			deferred.resolve(discussions);
		}
	});
	return deferred.promise;
};

discussionHandler.populateDummy = function() {
	console.log('Populate Dummy Script')
	var dummyUser = {
		displayName: 'jasonl96',
		profilePic: '/images/user/tabby.jpg',
	};
	var discussions = ['cats', 'dogs', 'finance', 'memes'];
	var description = 'A discussion about ';
	discussions.forEach(function(discussion){
		discussionHandler.createDiscussion('animals', discussion, description + discussion, dummyUser);
	})
}

module.exports = discussionHandler;