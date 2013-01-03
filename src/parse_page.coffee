cheerio = require 'cheerio'
fs      = require 'fs'


class ParsePage

  constructor: (@page, @cacheDir, @callback) ->
    links = []
    $ = cheerio.load @page

    for link in ($ 'td.title a')
      links.push
        link: ($ link).attr 'href'
        title: ($ link).text()

    fs.writeFile "#{@cacheDir}links.json", JSON.stringify(links)

    @callback null, links, @cacheDir



module.exports = ParsePage