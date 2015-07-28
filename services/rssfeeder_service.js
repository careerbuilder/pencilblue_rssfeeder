module.exports = function RSSFeederServiceModule(pb) {
  var request = require('request'),
    parseString = require('xml2js').parseString,
    util = pb.util;

  function RSSFeederService(options)
  {
    if(options)
    {
      this.site = options.site ? options.site : "";
    }
    else
    {
      this.site = "";
    }
  }

  RSSFeederService.init = function(cb){
    pb.log.debug("RSSFeederService: Initialized");
    cb(null, true);
  };

  RSSFeederService.getName = function(){
    return "rssFeederService";
  };

  RSSFeederService.prototype.getFeed = function(cb){
    getSettings(this, function(err, settings) {
      if(err) {
        cb(null);
      }
      else {
        getRSSFeed(settings.feed_url, cb);
      }
    });
  };
  
  function getRSSFeed(url, cb) {
    getRawFeed(url, function(rawFeed) {
      if(rawFeed == null) {
        cb(null);
      }
      else {
        parseRSSFeed(rawFeed, cb);
      }
    });
  }
  
  function parseRSSFeed(rawFeed, cb) {
    parseString(rawFeed, function (err, parsedFeed) {
      if(err) {
        cb(null);
      }
      else {
        cb(parsedFeed);
      }
    });
  }
  
  function getRawFeed(url, cb) {
    request.get(url, function (err, response, body) {
      if(err || response.statusCode != 200) {
        cb(null);
      }
      else {
        cb(body);
      }
    });
  }
  
  function getSettings(self, cb) {
    var pluginService = new pb.PluginService(self.site);
    pluginService.getSettingsKV('rssfeeder', function(err, rssFeederSettings) {
      if (util.isError(err)) {
        cb(err, null);
      }
      cb(null, rssFeederSettings);
    });
  }

  return RSSFeederService;
};
