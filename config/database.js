// config/database.js
module.exports = {
	url: function() {
		var debug = process.env.NODE_ENV !== "production";
		// looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
		if(debug) {
			return 'mongodb://localhost/nemoo';
		} else {
			return process.env.MONGODB_URI;
		}
	}

};
