var SearchTwitter, async, fs, twitter;

require('colors');

twitter = require('ntwitter');

async = require('async');

fs = require('fs');

SearchTwitter = (function() {

  function SearchTwitter(links, cacheDir, force, params, callback) {
    var _this = this;
    this.links = links;
    this.cacheDir = cacheDir;
    this.force = force;
    this.params = params != null ? params : {};
    this.callback = callback;
    this.tw = new twitter(this.getConfig());
    this.tweets = {};
    this.tweetsFile = "" + this.cacheDir + "tweets.json";
    if (!this.force && fs.existsSync(this.cacheDir) && fs.existsSync(this.tweetsFile)) {
      fs.readFile(this.tweetsFile, function(err, tweets) {
        if (err) {
          return _this.callback(err);
        } else {
          console.log("Tweets retrieved from:", "cache".cyan);
          return _this.callback(null, JSON.parse(tweets));
        }
      });
    } else {
      async.forEach(this.links, function(link, cb) {
        return _this.search(link, cb);
      }, function(err) {
        fs.writeFile(_this.tweetsFile, JSON.stringify(_this.tweets));
        return _this.callback(err, _this.tweets);
      });
    }
  }

  SearchTwitter.prototype.getConfig = function() {
    return require('../config/twitter');
  };

  SearchTwitter.prototype.search = function(link, cb) {
    var _this = this;
    return this.tw.search(link.link, this.params, function(err, data) {
      if (!err) {
        console.log("" + data.results.length + " Tweets retrieved for: ", link.link.cyan);
        _this.tweets[link.link] = data.results;
      }
      return cb(err);
    });
  };

  return SearchTwitter;

})();

module.exports = SearchTwitter;
