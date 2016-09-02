// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// load up the user model
var User       = require('../app/models/user');
var Util       = require('../util/util');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ '_email' :  email }, function(err, user) {
                if (err) // if there are any errors, return the error
                    return done(err);
                if (!user) // if no user is found, return the message
                    return done(null, false, {message: 'This user could not be found.'});
                if (!user.validPassword(password))
                    return done(null, false, {message: 'Oops! Invalid password.'});
                else { // all is well, return user
                    user.setProperties({_lastActive: Date.now() });
                    return done(null, user);
                }
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ '_email' :  email }, function(err, user) {
                if (err) // if there are any errors, return the error
                    return done(err);
                if (user) { // check to see if theres already a user with that email
                    return done(null, false, {message: 'That email is already taken.'});
                } else {
                    // create the user
                    var newUser             = new User();

                    newUser._email          = email;
                    newUser._password       = newUser.generateHash(password);
                    newUser._lastActive     = Date.now();
                    newUser.displayName     = email.slice(0, email.indexOf('@'));
                    newUser.profilePic      = Util.getRandomUserImg();

                    newUser.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var facebookAuth = configAuth.facebookAuth();
    passport.use(new FacebookStrategy({

        clientID        : facebookAuth.clientID,
        clientSecret    : facebookAuth.clientSecret,
        callbackURL     : facebookAuth.callbackURL,
        profileFields   : ['id', 'displayName', 'email'],
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    function(req, token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            User.findOne({ '_fbId' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) { // user found, return that user
                    user.setProperties({_lastActive: Date.now() });
                    return done(null, user); 
                } else { // if there is no user, create them
                    var newUser            = new User();

                    newUser._email          = (profile.emails[0].value || '').toLowerCase();
                    newUser._fbId           = profile.id;
                    newUser._fbToken        = token;
                    newUser._lastActive     = Date.now();
                    newUser.displayName     = profile.displayName;
                    newUser.profilePic      = "https://graph.facebook.com/" + profile.id + "/picture?return_ssl_resources=1";

                    newUser.save(function(err) {
                        if (err)
                            return done(err);
                        return done(null, newUser);
                    });
                }
            });
        });

    }));
};
