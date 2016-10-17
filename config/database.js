module.exports = {
	url: function() {
		var debug = process.env.NODE_ENV !== "production";
		if(debug) {
			return 'mongodb://localhost/nemoo';
		} else {
			return process.env.MONGODB_URI;
		}
	}

};
