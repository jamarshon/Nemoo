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
	Discussion.find({}).sort({ _id : -1 }).limit(10).exec(function(err, discussions) {
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
	var newDiscussion       		= new Discussion();
    newDiscussion.name     			= 'cats';
    newDiscussion.description     	= 'Lorem ipsum dolor sit amet, augue vel blandit est varius aliquam, pharetra augue a. Eu sit eu, convallis porttitor, dui in, sed laoreet, tincidunt id nullam. Torquent vitae volutpat nonummy fusce nulla, augue wisi wisi felis, suscipit vehicula congue vestibulum et sed amet, integer arcu sit. Fames sit eu dis felis donec, praesent mauris morbi. Dui vivamus hymenaeos tortor cras vitae. Eleifend vitae, lorem imperdiet, vel condimentum, pharetra augue sed in, sit a in numquam convallis id. Arcu praesent id amet donec sodales, per libero cum at facilisis suspendisse. Ac donec vitae vestibulum diam sit purus';
    newDiscussion.data				= [];

    for(var i = 0; i < 1; i++) {
    	var message = i + 'Lorem ipsum dolor sit amet, augue vel blandit est varius aliquam, pharetra augue a. Eu sit eu, convallis porttitor, dui in, sed laoreet, tincidunt id nullam. Torquent vitae volutpat nonummy fusce nulla, augue wisi wisi felis, suscipit vehicula congue vestibulum et sed amet, integer arcu sit. Fames sit eu dis felis donec, praesent mauris morbi. Dui vivamus hymenaeos tortor cras vitae. Eleifend vitae, lorem imperdiet, vel condimentum, pharetra augue sed in, sit a in numquam convallis id. Arcu praesent id amet donec sodales, per libero cum at facilisis suspendisse. Ac donec vitae vestibulum diam sit purus';
    	
    	newDiscussion.addMessage('jasonl96', '/images/user/tabby.png', message, 'blue', Date.now());
    }
}

module.exports = discussionHandler;