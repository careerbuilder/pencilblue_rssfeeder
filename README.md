# PencilBlue RSS Plugin
[![Code Climate](https://codeclimate.com/github/silverelizard/pencilblue_rssfeeder/badges/gpa.svg)](https://codeclimate.com/github/silverelizard/pencilblue_rssfeeder) [![Test Coverage](https://codeclimate.com/github/silverelizard/pencilblue_rssfeeder/badges/coverage.svg)](https://codeclimate.com/github/silverelizard/pencilblue_rssfeeder)

[ ![Codeship Status for silverelizard/pencilblue_rssfeeder](https://codeship.com/projects/8896e280-ca7a-0132-be6f-62dc20cced87/status?branch=master)](https://codeship.com/projects/75511)

An RSS service for PencilBlue. In order to use the plugin, please fill in the `feed_url` setting in the plugin's settings to use.

The main use case for the plugin is setting up the parameters and then calling the RSSService in a template in order to gain access to the tweet data for display. For example, the following code snippet checks if the plugin is installed and then accesses the service:

```JavaScript
if(pb.PluginService.isActivePlugin('rssfeeder')) { //checks if the rssfeeder plugin is installed
  var RSSService = pb.PluginService.getService('rssFeederService', 'rssfeeder'); //gets the rssfeeder service from the plugin
  var rssService = new RSSService(); //creates a new instance of the rss service
  rssService.getFeed(function(feed) { //calls the getFeed method from the rss service with a callback
    pb.log.info(feed); //logs feed object from service to console
  });
}
```

###Running Tests

The plugin uses the Mocha, Sinon, Chai stack for testing. Included in the repo is a `Makefile` setting up both testing and code coverage. To run tests,  simply type `make test` into the console while in the root directory of the plugin. Code coverage is similar, simply run `make coverage` to generate an lcov report. Be sure you have lcov installed first. More information on lcov can be found [here](http://ltp.sourceforge.net/coverage/lcov.php). You can cleanup the report folders by running the `make clean` command.