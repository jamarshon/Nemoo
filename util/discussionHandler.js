var Q			= require('q');
var Discussion  = require('../app/models/discussion');

var discussionHandler = {};

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

discussionHandler.populateDummy = function() {
	var newDiscussion       = new Discussion();
    newDiscussion.name     	= 'cats';
    newDiscussion.data		= [];

    for(var i = 0; i < 100; i++) {
    	var message = "Testing Message: " + i;
    	newDiscussion.addMessage('jasonl96', '/images/user/grey.png', message);
    }

    newDiscussion.save(function (err) {
        if(err) 
            console.error('Populate failure');
    });
}

module.exports = discussionHandler;