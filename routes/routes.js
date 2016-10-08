var Q                   = require('q');

var AppHandler          = require('../util/appHandler');
var DiscussionHandler   = require('../util/discussionHandler');
var PassportRoutes      = require('./passportRoutes');
var Util                = require('../util/util');
var _                   = require('underscore');

module.exports = function(app, passport, index) {
  var renderIndex = function(req, res) {
    var loggedIn = req.isAuthenticated(),
        user = loggedIn ? req.user : Util.generateAnonUser();

    console.log(user);
    AppHandler.getApp().then(function(app){
      res.render(index, {user: user, loggedIn: loggedIn, currentNumOnline: app.currentNumOnline});
    }, function(errDefaultValue) {
      res.render(index, {user: user, loggedIn: loggedIn, currentNumOnline: errDefaultValue});
    });
  };

  
  app.get('/', function(req, res) {
    console.log('Root page');
    renderIndex(req, res);
  });

  // Used by the routeProvider to include it in the html
  app.get('/partials/:discussion', function(req, res){
    var discussionName = req.params.discussion;
    DiscussionHandler.getDiscussion(discussionName).then(function(discussion){
      discussion.data.forEach(function(messageObject){
        messageObject.message = Util.decodeUTF8(messageObject.message);
      });
      res.render('components/discussion', {name: discussion.displayName, description: discussion.description, data: discussion.data});
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

  // Logout
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

  app.post('/createDiscussion', function(req, res){
    var body = req.body;
    DiscussionHandler.createDiscussion(body.category, body.name, body.description, body.user).then(function(discussion){
      res.json( {redirect: '/page/' + discussion.name });
    }, function(err){
      res.json( { message: err });
    });
  });

  app.get('/trendingDiscussions', function(req, res){
    DiscussionHandler.getTrending().then(function(discussions){
      var discussionNames = _.pluck(discussions, 'displayName');
      res.json({discussions: discussionNames});
    }, function(err){
      res.json({discussions: []});
    });
  });

  app.post('/searchDiscussion', function(req, res){
    var searchText = req.body.searchText.toLowerCase();
    DiscussionHandler.search(searchText).then(function(discussions){
      var searchResults = _.map(discussions, function(discussion){ 
        return _.pick(discussion, 'name', 'displayName', 'description', 'category');
      });
      res.json({discussions: searchResults});
    }, function(err){
      console.log('[SEARCH-DISCUSSION-ERROR] ' + err);
      res.json({discussions: []});
    })
  });

  app.io.on('connection', function(socket){
    AppHandler.getApp().then(function(app){
      app.adjustNumOnline(1);
    }, function(err){ console.log('[IO-APP-ERROR] ' + err); });

    socket.on('message sent', function(msg, user, discussionName) {
      DiscussionHandler.getDiscussion(discussionName).then(function(discussion){
        var currentTime = Date.now();
        user.created = currentTime;
        discussion.addMessage(user.displayName, user.profilePic, msg, 
                              user.backgroundColor, currentTime);
        app.io.emit(discussionName + ' message received', msg, user);
      }, function(err) {
        console.log('[IO-DISCUSSION-ERROR] ' + err);
      });
    });
  });

  PassportRoutes(app, passport);
};
