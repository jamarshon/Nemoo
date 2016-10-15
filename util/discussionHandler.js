var Q						= require('q');
var Discussion  = require('../app/models/discussionModel');
var Util				= require('../util/util');

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
				    newDiscussion.displayName     = Util.toTitleCase(name);
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

discussionHandler._abstractTopSevenSearch = function(query) {
	var deferred = Q.defer();
	Discussion.find(query).sort({ messageCount : 'desc' }).limit(7).exec(function(err, discussions) {
		if(err) {
			deferred.reject(err);
		} else{
			deferred.resolve(discussions);
		}
	});
	return deferred.promise;
};

discussionHandler.getTrending = function() {
	return discussionHandler._abstractTopSevenSearch({});
};

discussionHandler.search = function(query) {
	var deferred = Q.defer();
	var searchName = {name: {$regex : query}};
	var searchDescription = {description: {$regex : query}};
	return discussionHandler._abstractTopSevenSearch({$or: [searchName, searchDescription]});
};

discussionHandler.getTopDiscussions = function() {
	var deferred = Q.defer();
	Discussion.aggregate(
    [
      { "$sort": { "category": 1, "messageCount": -1 } },
      { "$group": {
        "_id": "$category",
        "items": { "$push": "$$ROOT" }
      }},
      { "$project": {
        "items": { "$slice": [ "$items", 2] }
      }}
    ],
    function(err, results) {
    	if(err) {
				deferred.reject(err);
			} else{
				deferred.resolve(results);
			}
    }
  );
  return deferred.promise;
};

discussionHandler.populateDummy = function() {
	console.log('Populate Dummy Script')
	var dummyUser = {
		displayName: 'jasonl96',
		profilePic: '/images/user/tabby.jpg',
	};
	var discussions = [
		{name: 'cats', category: 'animals'}, 
		{name:'dogs', category: 'animals'}, 
		{name:'rabbits', category: 'animals'}, 
		{name:'lamborghini', category: 'automotive'}, 
		{name:'ferrari', category: 'automotive'}, 
		{name:'bugatti', category: 'automotive'}, 
	];
	var description = 'A discussion about ';
	discussions.forEach(function(discussion){
		discussionHandler.createDiscussion(discussion.category, discussion.name, description + discussion.name, dummyUser);
	})
}

module.exports = discussionHandler;