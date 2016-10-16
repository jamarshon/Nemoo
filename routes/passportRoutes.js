module.exports = function(app, passport) { 
    // LOGIN ===============================
    app.post('/login', function(req, res, next){
        passport.authenticate('local-login', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) { return res.json( { message: info.message }) }
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.json({redirect: true});
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
              return res.json({redirect: true});
            });
        })(req, res, next);
    });

  // send to facebook to do the authentication
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/'
    }));
};