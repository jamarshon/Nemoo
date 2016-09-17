var Q                   = require('q');

var AppHandler          = require('../util/appHandler');
var DiscussionHandler   = require('../util/discussionHandler');
var PassportRoutes      = require('./passportRoutes');
var Util                = require('../util/util');

module.exports = function(app, passport) {
  var io = app.io;
  var globalDiscussion;
  var globalApp;
  var globalDiscussionName;
  var renderIndex = function(req, res) {
    var loggedIn = req.isAuthenticated(),
        user = loggedIn ? req.user : Util.generateAnonUser();

    console.log(user);
    AppHandler.getApp().then(function(app){
      globalApp = app;
      res.render('index', {user: user, loggedIn: loggedIn, currentNumOnline: app.currentNumOnline});
    }, function(errDefaultValue) {
      res.render('index', {user: user, loggedIn: loggedIn, currentNumOnline: errDefaultValue});
    });
  };

  
  app.get('/', function(req, res) {
    console.log('Root page');
    renderIndex(req, res);
  });

  // Used by the routeProvider to include it in the html
  app.get('/partials/:discussion', function(req, res){
    globalDiscussionName = req.params.discussion;
    var discussion = globalDiscussionName;
    DiscussionHandler.getDiscussion(discussion).then(function(discussion){
      globalDiscussion = discussion;
      res.render('components/discussion', {name: Util.toTitleCase(discussion.name), description: discussion.description, data: discussion.data});
    }, function(err) {
      res.render('error', {message: err, error: {} });
    });
  });

  // Always render the index to allow the routeProvider to match with the correct route
  app.get('/page/:filename', function(req, res){
    renderIndex(req, res);
  });

  // Files to be imported in using ng-include
  app.get('/views/:filename', function(req, res){
    var filename = req.params.filename,
        data = req.params.data;
    res.render('components/' + filename, {data: data});
  });

  // LOGOUT ==============================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  app.get('/test', function(req, res){
    DiscussionHandler.empty();
    AppHandler.empty();
    DiscussionHandler.populateDummy();
    AppHandler.populateDummyApp();
    res.render('error', {message: 'Populated Data', error: {} });
  });

  io.on('connection', function(socket){
    if(globalApp) {
      globalApp.adjustNumOnline(1);
    }
    socket.on('message sent', function(msg, user) {
      if(globalDiscussion) {
          var currentTime = Date.now();
          user.created = currentTime;
          globalDiscussion.addMessage(user.displayName, user.profilePic, msg, 
                                      user.backgroundColor, currentTime);
          io.emit('message received', msg, user);
      }
    });
  });

  PassportRoutes(app, passport);
};
