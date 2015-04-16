module.exports = function PluginServiceModule() {
  function PluginService(){};

  PluginService.prototype.getSettingsKV = function(pluginName, cb) {
	cb('settings');
  };

  return PluginService;
}