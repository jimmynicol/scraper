var ParsePage, cheerio, fs;

cheerio = require('cheerio');

fs = require('fs');

ParsePage = (function() {

  function ParsePage(page, cacheDir, callback) {
    var $, link, links, _i, _len, _ref;
    this.page = page;
    this.cacheDir = cacheDir;
    this.callback = callback;
    links = [];
    $ = cheerio.load(this.page);
    _ref = $('td.title a');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      link = _ref[_i];
      links.push({
        link: ($(link)).attr('href'),
        title: ($(link)).text()
      });
    }
    fs.writeFile("" + this.cacheDir + "links.json", JSON.stringify(links));
    this.callback(null, links, this.cacheDir);
  }

  return ParsePage;

})();

module.exports = ParsePage;
