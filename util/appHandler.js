var Q			= require('q');
var App  		= require('../app/models/appModel');

var APP_ID = 'Iamlightningtheraintransformed';
var DEFAULT_NUM_ONLINE = 12;
var appHandler = {};

appHandler.empty = function() {
	App.remove({}, function(){});
};

appHandler.getApp = function() {
	var deferred = Q.defer();
	App.findOne({ 'id' :  APP_ID }, function(err, app) {
	    if (err){ // if there are any errors, return the error
	    	deferred.reject(err);
	    } else if (!app) { // if no app is found, return the message
	    	deferred.reject(DEFAULT_NUM_ONLINE);
	    } else{
	    	deferred.resolve(app);
	    }
	});
	return deferred.promise;
}
appHandler.populateDummyApp = function() {
	console.log('Populate App Dummy Script')
	var newApp			      		= new App();
    newApp.id     					= APP_ID;
    newApp.currentNumOnline = 0;
    newApp.save(function (err) {
        if(err) 
            console.error('Populate App Dummy Failure: ' + err);
    });
}

module.exports = appHandler;