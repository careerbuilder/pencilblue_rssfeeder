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
    parseString = require('xml2js').parseString,
    util = pb.util;
  function RSSFeederService(){}

  RSSFeederService.init = function(cb){
    pb.log.debug("RSSFeederService: Initialized");
    cb(null, true);
  };

  RSSFeederService.getName = function(){
    return "rssFeederService";
  };

  RSSFeederService.prototype.getFeed = function(cb){
    getSettings(function(err, settings) {
      if(err) {
        cb(new Error('RSS Feeder Plugin Error', 'rssfeederPluginError'), null);
      }
      else {
        getRSSFeed(settings.feed_url, cb);
      }
    });
  };
  
  function getRSSFeed(url, cb) {
    getRawFeed(url, function(rawFeed) {
      if(rawFeed == null) {
        cb(new Error('RSS Feeder Plugin Error', 'rssfeederPluginError'), null);
      }
      else {
        parseRSSFeed(rawFeed, cb);
      }
    });
  }
  
  function parseRSSFeed(rawFeed, cb) {
    parseString(rawFeed, function (err, parsedFeed) {
      if(err) {
        cb(new Error('RSS Feeder Plugin Error', 'rssfeederPluginError'), null);
      }
      else {
        cb(parsedFeed);
      }
    });
  }
  
  function getRawFeed(url, cb) {
    request.get(url, function (err, response, body) {
      if(err || response.statusCode != 200) {
        cb(new Error('RSS Feeder Plugin Status Code: ' + response.statusCode, 'rssfeederPluginError'), null);
      }
      else {
        cb(body);
      }
    });
  }
  
  function getSettings(cb) {
    var pluginService = new pb.PluginService();
    pluginService.getSettingsKV('rssfeeder', function(err, rssFeederSettings) {
      if (util.isError(err)) {
        cb(err, null);
      }
      cb(null, rssFeederSettings);
    });
  }

  return RSSFeederService;
};
