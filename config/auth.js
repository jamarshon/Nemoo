// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    facebookAuth : function() {
    	var debug = process.env.NODE_ENV !== "production";
    	return {
    		clientID		: process.env.FACEBOOK_ID, // your App ID
	        clientSecret    : process.env.FACEBOOK_SECRET, // your App Secret
	        callbackURL     : debug ? 'http://localhost:8080/auth/facebook/callback' : 'https://nemoo.herokuapp.com/auth/facebook/callback'
    	}
    }

};
