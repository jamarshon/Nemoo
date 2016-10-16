var _                   = require('underscore');
var DiscussionHandler   = require('../util/discussionHandler');

module.exports = function(app) {
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
      var trending = _.map(discussions, function(discussion){
        return {title: discussion.displayName};
      });
      res.json({trending: trending});
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

  app.get('/topDiscussions', function(req, res){
    DiscussionHandler.getTopDiscussions().then(function(results){
      var topDiscussions = _.map(results, function(result){ 
        return {
          category: result._id, 
          discussionNames: _.map(result.items, function(discussion){
            return {title: discussion.displayName};
          })
        }; 
      });
      res.json({topDiscussions: topDiscussions});
    }, function(err){
      res.json({topDiscussions: []});
    });
  });
};
