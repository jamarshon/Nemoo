var googleTrends        = require('google-trends-api');
var _                   = require('underscore');

var AppHandler          = require('../util/appHandler');
var DiscussionHandler   = require('../util/discussionHandler');
var DiscussionRenderer  = require('../util/discussionRenderer');
var DiscussionRoutes    = require('./discussionRoutes');
var ImageRoutes         = require('./imageRoutes');
var PassportRoutes      = require('./passportRoutes');
var Util                = require('../util/util');

module.exports = function(app, passport, isProduction) {
  var index = isProduction ? 'productionIndex': 'index';
  var componentsPath = isProduction ? 'components/production/': 'components/';
  var renderIndex = function(req, res) {
    var loggedIn = req.isAuthenticated(),
        user = loggedIn ? req.user : Util.generateAnonUser();

    console.log(user);
    var filteredUser = _.pick(user, 'displayName', 'profilePic', 'favorites', 'backgroundColor');
    AppHandler.getApp().then(function(app){
      res.render(index, {user: filteredUser, loggedIn: loggedIn, currentNumOnline: app.currentNumOnline});
    }, function(errDefaultValue) {
      res.render(index, {user: filteredUser, loggedIn: loggedIn, currentNumOnline: errDefaultValue});
    });
  };

  
  app.get('/', function(req, res) {
    console.log('Root page');
    renderIndex(req, res);
  });

  app.get('/explore', function(req, res){ renderIndex(req, res); });

  app.post('/setTimezone', function(req, res) {
    req.session.offset = req.body.offset;
    res.sendStatus(200);
  });

  app.post('/addToFavorite', function(req, res){
    if(req.isAuthenticated()){
      var user = req.user;
      var addedFavorite = req.body.pageName;
      user.favorites.push(addedFavorite);
      user.setProperties({favorites: user.favorites});
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

  // Used by the routeProvider to include it in the html
  app.get('/partials/:discussion', function(req, res){
    var discussionName = req.params.discussion;
    var offset = typeof req.session.offset === 'undefined' ? 240: req.session.offset;
    DiscussionHandler.getDiscussion(discussionName).then(function(discussion){
      var prerendered = DiscussionRenderer.getPrerendered(discussion, -1*offset);
      var prerenderedLen = discussion.data.length;
      res.render(componentsPath + 'discussion', {name: discussion.displayName, description: discussion.description, prerenderedLen: prerenderedLen, prerendered: prerendered.join('')});
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
    res.render(componentsPath + filename, {data: data});
  });

  // Logout
  app.get('/logout', function(req, res) {
    req.logout();
    res.json({redirect: true});
  });

  app.get('/test', function(req, res){
    DiscussionHandler.empty();
    AppHandler.empty();
    DiscussionHandler.populateDummy();
    AppHandler.populateDummyApp();
    res.render('error', {message: 'Populated Data', error: {} });
  });

  app.get('/googleTrends', function(req, res){
    googleTrends.hotTrendsDetail('US')
      .then(function(results){
        var channel = results.rss.channel;
        if(channel.length === 0){ res.sendStatus(404); return; }
        var items = channel[0].item;
        var data = items.reduce(function(memo, item){
          var e = {};
          if(item.title.length === 0 || item.title[0] === ''){ return memo; }
          e.name = item.title[0];

          var pictures = item['ht:picture'];
          if(pictures.length === 0 || pictures[0] === ''){ return memo; }
          e.picture = pictures[0];

          var news = item['ht:news_item'];
          if(news.length === 0){ return memo; }
          var newsTitle = news[0]['ht:news_item_title'];
          if(newsTitle.length === 0 || newsTitle[0] === ''){ return memo; }
          e.description = newsTitle[0];
          
          memo.push(e);
          return memo;
        }, []);
        res.json(data);
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
        socket.broadcast.emit(discussionName + ' message received', msg, user);
      }, function(err) {
        console.log('[IO-DISCUSSION-ERROR] ' + err);
      });
    });
  });

  DiscussionRoutes(app);
  ImageRoutes(app);
  PassportRoutes(app, passport);
};
