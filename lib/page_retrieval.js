var PageRetrieval, cheerio, crypto, fs, request;

require('colors');

request = require('request');

cheerio = require('cheerio');

fs = require('fs');

crypto = require('crypto');

PageRetrieval = (function() {

  function PageRetrieval(url, force, callback) {
    this.url = url;
    this.force = force != null ? force : false;
    this.callback = callback;
    this.cacheDir = "./cache/" + (this.urlHash()) + "/";
    this.cachePage = "" + this.cacheDir + "page.html";
    this.pageInCache();
  }

  PageRetrieval.prototype.pageInCache = function() {
    var _this = this;
    if (!this.force) {
      if (fs.existsSync(this.cacheDir) && fs.existsSync(this.cachePage)) {
        console.log("Page read from cache: ", this.cacheDir.cyan);
        return fs.readFile(this.cachePage, function(err, body) {
          return _this.callback(err, body, _this.cacheDir);
        });
      } else {
        return this.retrievePage();
      }
    } else {
      return this.retrievePage();
    }
  };

  PageRetrieval.prototype.retrievePage = function() {
    var _this = this;
    return request.get(this.url, function(err, res, body) {
      console.log("Call to:", _this.url.cyan);
      if (err) {
        return _this.callback(err);
      } else {
        _this.savePageToCache(body);
        return _this.callback(null, body, _this.cacheDir);
      }
    });
  };

  PageRetrieval.prototype.savePageToCache = function(body) {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir);
    }
    fs.writeFile(this.cachePage, body);
    return console.log("Page cached to: ", this.cacheDir.cyan);
  };

  PageRetrieval.prototype.urlHash = function() {
    var hash;
    hash = crypto.createHash('md5');
    return hash.update(this.url.toLowerCase()).digest('hex');
  };

  return PageRetrieval;

})();

module.exports = PageRetrieval;
