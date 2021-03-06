var moment = require('moment');
moment().format();
module.exports = function RSSRenderingServiceModule(pb) {
  const WORDS_PER_PREVIEW = 24;

  function RSSRenderingService(options){
    if (options) {
      this.site = options.site || pb.SiteService.GLOBAL_SITE;
    } else {
      this.site = pb.SiteService.GLOBAL_SITE;
    }
  }

  RSSRenderingService.init = function(cb){
    pb.log.debug("RSSRenderingService: Initialized");
    cb(null, true);
  };

  RSSRenderingService.getName = function(){
    return "rssRenderingService";
  };

  RSSRenderingService.prototype.render = function(cb) {
    var self = this;
    var jts = null;
    getFeed(self, function(err, feed) {
      if(err){
        pb.log.error('Rss Feeder Encountered an Error: [error] ' + err + ' [Feed] ' + feed);
        jts = getRendererForWidget(self, '', '^loc_RSS_ERROR^', '', '');
        jts.load('elements/rss', cb);
      } else if(feed && feed[0] && feed[0].item) {
        var post = feed[0].item[0];
        var posted = getTimeFromNow(post.pubDate[0]);
        jts = getRendererForWidget(self, feed[0].link[0], getPostPreview(post.description[0]), post.link[0], posted);
        jts.load('elements/rss', cb);
      } else {
        jts = getRendererForWidget(self, '', '^loc_RSS_ERROR^', '', '');
        jts.load('elements/rss', cb);
      }
    });
  };

    function getRendererForWidget(self, blogUrl, postText, postUrl, postTime){
        var jts = new pb.TemplateService({ls:self.ls, site:self.site});
        jts.reprocess = false;
        jts.registerLocal('blog_url', blogUrl);
        jts.registerLocal('post_text', postText);
        jts.registerLocal('post_url', postUrl);
        jts.registerLocal('post_posted', postTime);
        return jts;
    }
  function getPostPreview(text) {
    var text = text.replace(/(<([^>]+)>)/ig,""); // Removes all Tags like <xml>
    var words = text.split(' ');
    words.length = WORDS_PER_PREVIEW;
    return words.join(' ') + '...';
  }

  function getTimeFromNow(date) {
    var parsedDate = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', 'en');
    if(parsedDate.isValid()) {
      return parsedDate.fromNow();
    }
    return '';
  }

  function getFeed(self, cb) {
    var RssService = pb.PluginService.getService('rssFeederService', 'pencilblue_rssfeeder', self.site);
    var rssService = new RssService({site:self.site});
    rssService.getFeed(cb);
  }

  return RSSRenderingService;
};
