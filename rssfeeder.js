module.exports = function RSSFeederModule(pb){
  
  function RSSFeeder(){}

  RSSFeeder.onInstall = function(cb) {
    cb(null, true);
  };

  RSSFeeder.onUninstall = function(cb) {
    cb(null, true);
  };

  RSSFeeder.onStartup = function(cb) {
    cb(null, true);
  };

  RSSFeeder.onShutdown = function(cb) {
    cb(null, true);
  };

  return RSSFeeder;
};
