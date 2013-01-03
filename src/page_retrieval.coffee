require 'colors'
request = require 'request'
cheerio = require 'cheerio'
fs      = require 'fs'
crypto  = require 'crypto'

class PageRetrieval

  constructor: (@url, @force=false, @callback) ->
    @cacheDir  = "./cache/#{@urlHash()}/"
    @cachePage = "#{@cacheDir}page.html"
    @pageInCache()


  pageInCache: ->
    unless @force
      if fs.existsSync(@cacheDir) and fs.existsSync(@cachePage)
        console.log "Page read from cache: ", @cacheDir.cyan
        fs.readFile @cachePage, (err, body) => @callback err, body, @cacheDir
      else
        @retrievePage()
    else
      @retrievePage()


  retrievePage: ->
    request.get @url, (err, res, body) =>
      console.log "Call to:", @url.cyan
      if err
        @callback err
      else
        @savePageToCache body
        @callback null, body, @cacheDir


  savePageToCache: (body) ->
    fs.mkdirSync @cacheDir unless fs.existsSync @cacheDir
    fs.writeFile @cachePage, body
    console.log "Page cached to: ", @cacheDir.cyan


  urlHash: ->
    hash = crypto.createHash 'md5'
    hash.update(@url.toLowerCase()).digest('hex')



module.exports = PageRetrieval