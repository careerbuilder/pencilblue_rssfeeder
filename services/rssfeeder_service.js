/*
 Copyright (C) 2015  Careerbuilder, LLC

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

module.exports = function RSSFeederServiceModule(pb) {
  var request = require('request'),
    xml2js = require('xml2js'),
    util = pb.util;

  function RSSFeederService(options){
    if (options) {
      this.site = options.site || pb.SiteService.GLOBAL_SITE;
    } else {
      this.site = pb.SiteService.GLOBAL_SITE;
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
        cb(err, null);
      }
      else {
        getRSSFeed(settings.feed_url, cb);
      }
    });
  };

  function getRSSFeed(url, cb) {
    getRawFeed(url, function(err, rawFeed) {
      if(err) {
        cb(err, null);
      }
      else {
        if (rawFeed) {
          parseRSSFeed(rawFeed, cb);
        } else {
          cb(null, '');
        }
      }
    });
  }

  function parseRSSFeed(rawFeed, cb) {
    xml2js.parseString(rawFeed, function (err, parsedFeed) {
      if(err) {
        cb(err, null);
      }
      else {
        if (parsedFeed && parsedFeed.rss && parsedFeed.rss.channel) {
          cb(null, parsedFeed.rss.channel);
        } else {
          cb(new Error('No RSS Feed retrieved.'), null);
        }
      }
    });
  }

  function getRawFeed(url, cb) {
    request.get(url, {timeout: 5000}, function (err, response, body) {
      if(err || response.statusCode != 200) {
        cb(err, null);
      }
      else {
        cb(null, body);
      }
    });
  }

  function getSettings(self, cb) {
    var pluginService = new pb.PluginService({site:self.site});
    pluginService.getSettingsKV('pencilblue_rssfeeder', function(err, rssFeederSettings) {
      if (util.isError(err)) {
        cb(err, null);
      }
      cb(null, rssFeederSettings);
    });
  }

  return RSSFeederService;
};
