require 'colors'
twitter = require 'ntwitter'
async   = require 'async'
fs      = require 'fs'

class SearchTwitter

  constructor: (@links, @cacheDir, @force, @params={}, @callback) ->
    @tw = new twitter @getConfig()
    @tweets = {}

    @tweetsFile = "#{@cacheDir}tweets.json"

    if !@force and fs.existsSync(@cacheDir) and fs.existsSync(@tweetsFile)
      fs.readFile @tweetsFile, (err, tweets) =>
        if err
          @callback err
        else
          console.log "Tweets retrieved from:", "cache".cyan
          @callback null, JSON.parse(tweets)
    else
      async.forEach @links ,(link, cb) =>
          @search link, cb
        ,(err) =>
          fs.writeFile @tweetsFile, JSON.stringify(@tweets)
          @callback err, @tweets


  getConfig: -> require '../config/twitter'


  search: (link, cb) ->
    @tw.search link.link, @params, (err, data) =>
      unless err
        console.log "#{data.results.length} Tweets retrieved for: ", link.link.cyan
        @tweets[link.link] = data.results
      cb err



module.exports = SearchTwitter