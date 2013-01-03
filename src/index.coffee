require 'colors'
async   = require 'async'

PageRetrieval = require './page_retrieval'
ParsePage     = require './parse_page'
SearchTwitter = require './search_twitter'


exports.process = (program) ->

  start         = (new Date).getTime()
  page          = program.link or 'https://news.ycombinator.com/'
  force         = program.force or false
  search_params = {}

  console.log "\nScraping #{page.bold} for links"
  console.log "------------------\n".black

  async.waterfall [
    (cb) ->
      new PageRetrieval page, force, cb

    ,(body, cacheDir, cb) ->
      new ParsePage body, cacheDir, cb

    ,(links, cacheDir, cb) ->
      console.log "Links parsed: ", "#{links.length}".cyan
      new SearchTwitter links, cacheDir, force, search_params, cb
  ],

  # Complete function
  (err, tweets) ->

    if err
      console.log "\n\nSomething went wrong!".red, err
      console.log "\n\n"

    else
      elapsed = ((new Date).getTime() - start)/1000
      console.log "\n------------------".black
      console.log "  Done".bold
      console.log "  Elapsed Time:", "#{elapsed}".cyan, "secs"
      console.log "------------------".black
      console.log "\n\n"