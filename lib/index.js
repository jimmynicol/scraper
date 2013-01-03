var PageRetrieval, ParsePage, SearchTwitter, async;

require('colors');

async = require('async');

PageRetrieval = require('./page_retrieval');

ParsePage = require('./parse_page');

SearchTwitter = require('./search_twitter');

exports.process = function(program) {
  var force, page, search_params, start;
  start = (new Date).getTime();
  page = program.link || 'https://news.ycombinator.com/';
  force = program.force || false;
  search_params = {};
  console.log("\nScraping " + page.bold + " for links");
  console.log("------------------\n".black);
  return async.waterfall([
    function(cb) {
      return new PageRetrieval(page, force, cb);
    }, function(body, cacheDir, cb) {
      return new ParsePage(body, cacheDir, cb);
    }, function(links, cacheDir, cb) {
      console.log("Links parsed: ", ("" + links.length).cyan);
      return new SearchTwitter(links, cacheDir, force, search_params, cb);
    }
  ], function(err, tweets) {
    var elapsed;
    if (err) {
      console.log("\n\nSomething went wrong!".red, err);
      return console.log("\n\n");
    } else {
      elapsed = ((new Date).getTime() - start) / 1000;
      console.log("\n------------------".black);
      console.log("  Done".bold);
      console.log("  Elapsed Time:", ("" + elapsed).cyan, "secs");
      console.log("------------------".black);
      return console.log("\n\n");
    }
  });
};
