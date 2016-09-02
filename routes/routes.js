var Util = require('../util/util');

module.exports = function(app, passport) {

// normal routes ===============================================================

    app.get('/', function(req, res) {
        res.redirect('/page/home');
    });

    // Used by the routeProvider to include it in the html
    app.get('/partials/:filename', function(req, res){
        var filename = req.params.filename;
        res.render(filename);
    });

    // Always render the index to allow the routeProvider to match with the correct route
    app.get('/page/:filename', function(req, res){
        var loggedIn = req.isAuthenticated(),
            user = loggedIn ? req.user : Util.generateAnonUser();
        console.log(user);
        res.render('index', {user: user, loggedIn: loggedIn});
    });

    // Files to be imported in using ng-include
    app.get('/views/:filename', function(req, res){
        var filename = req.params.filename,
            data = req.params.data;
        res.render(filename, {data: data});
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
        //res.json({redirect: '/'});
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        app.post('/login', function(req, res, next){
            passport.authenticate('local-login', function(err, user, info) {
                if (err) { return next(err) }
                if (!user) { return res.json( { message: info.message }) }
                req.logIn(user, function(err) {
                  if (err) { return next(err); }
                  return res.json({redirect: '/'});
                });
            })(req, res, next);
        });

        // SIGNUP =================================
        app.post('/signup', function(req, res, next){
            passport.authenticate('local-signup', function(err, user, info) {
                if (err) { return next(err) }
                if (!user) { return res.json( { message: info.message }) }
                req.logIn(user, function(err) {
                  if (err) { return next(err); }
                  req.url = '/';
                  return res.json({redirect: '/'});
                });
            })(req, res, next);
        });

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/',
                failureRedirect : '/'
            }));
};
