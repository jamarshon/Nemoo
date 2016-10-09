// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var _        = require('underscore');

// define the schema for our user model
var userSchema = mongoose.Schema({
    _localEmail: String,
    _password: String,
    _fbEmail: String,
    _fbId: String,
    _fbToken: String,
    _lastActive: Number,
    displayName: String,
    profilePic: String,
    favorites: [String]
});

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this._password);
};

userSchema.methods.setProperties = function(props) {
    var newUser = _.extend(this, props);
    console.log(newUser);
    newUser.save(function (err) {
        if(err) 
            console.error('Update user failure');
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
