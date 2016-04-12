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

var util = require('util');
module.exports.getMockPB = function () {
  var templateService = require('./template_service_mock')(),
    pluginService = require('./plugin_service_mock')();

  var pb = {
    log: {
      info: function () {},
      error: function () {},
      debug: function() {},
      silly: function() {}
    },
    PluginService: pluginService,
    SiteService: {
      GLOBAL_SITE:'global'
    },
    TemplateService: templateService,
    util : util
  };
  return pb;
};
