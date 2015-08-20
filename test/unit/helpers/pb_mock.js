var util = require('util');
module.exports.getMockPB = function () {
  var pluginService = require('./plugin_service_mock')();
  var pb = {
    log: {
      info: function () {},
      error: function () {},
      debug: function() {}
    },
    SiteService: {
      GLOBAL_SITE:'global'
    },
    PluginService: pluginService,
    util : util
  };
  return pb;
};