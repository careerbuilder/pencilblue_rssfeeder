var pb = require('./helpers/pb_mock').getMockPB();
var RSSFeederService = require('../../services/rssfeeder_service')(pb);
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var request = require('request');

describe('RSS Feeder Service', function () {
  var rssFeederService,
      pluginSettingStub,
      requestStub;

  before(function () {
    rssFeederService = new RSSFeederService();
    requestStub = sinon.stub(request, 'get');
    requestStub.withArgs('valid_feed_url').yields(null, {statusCode: 200}, getValidXML());
    requestStub.withArgs('invalid_feed_url').yields(new Error(), {statusCode: 500}, null);
    requestStub.withArgs('to_break_praser').yields(null, {statusCode: 200}, 2);
    pluginSettingStub = sinon.stub(pb.PluginService.prototype, 'getSettingsKV');
    pluginSettingStub.onCall(0).yields(null, getValidSettingResponse());
    pluginSettingStub.onCall(1).yields(null, getInvalidSettingResponse());
    pluginSettingStub.onCall(2).yields(new Error(), "");
    pluginSettingStub.onCall(3).yields(null, getParseBreakingResponse());
  });

  it('should be a RSSFeederService object', function () {
    expect(rssFeederService).to.be.instanceof(RSSFeederService);
  });

  it('should store the site id if one is provided', function(done){
    var rssSiteGiven = new RSSFeederService({site:"SOMERANDOMID"});
    expect(rssSiteGiven.site).to.equal("SOMERANDOMID");
    done();
  });
  it('should store an empty string if site is not provided but an option exists', function(done){
    var rssSiteGiven = new RSSFeederService({blargh:"NOT AN ID"});
    expect(rssSiteGiven.site).to.equal("");
    done();
  });

  it('should have name', function() {
    var name = RSSFeederService.getName();
    expect(name).to.equal('rssFeederService');
  });
  
  it('should be initialized', function(done) {
    RSSFeederService.init(function(err,result) {
      expect(result).to.equal(true);
      expect(err).to.equal(null);
      done();
    });
  });

  // Call 0 to settingsKV
  it('should get feed', function(done) {
    rssFeederService.getFeed(rssFeederService, function(rssfeed) {
      expect(rssfeed).to.not.equal(null);
      expect(rssfeed.rss.channel[0].item).to.have.length.above(0);
      done();
    });
  });

  // Call 1 to settingsKV
  it('should return nothing if feed invalid', function(done) {
    rssFeederService.getFeed(rssFeederService, function(rssfeed) {
      expect(rssfeed).to.equal(null);
      done();
    });
  });

  // Call 2 to settingsKV
  it('should return nothing if error is caught in Settings KV invalid', function(done) {
    rssFeederService.getFeed(function(rssfeed) {
      expect(rssfeed).to.equal(null);
      done();
    });
  });

  it('should return nothing if an error is thrown from the parseString function', function(done){
    rssFeederService.getFeed(function(rssfeed) {
      expect(rssfeed).to.equal(null);
      done();
    });
  });
  after(function() {
    pluginSettingStub.restore();
  });
});

function getValidSettingResponse() {
  return {
    feed_url:"valid_feed_url"
  };
}

function getInvalidSettingResponse() {
  return {
    feed_url:"invalid_feed_url"
  };
}
function getParseBreakingResponse(){
  return {
    feed_url:"to_break_praser"
  }
}

function getValidXML() {
  return '<rss version="2.0"><channel><title>Liftoff News</title><link>http://liftoff.msfc.nasa.gov/</link><description>Liftoff to Space Exploration.</description><language>en-us</language><pubDate>Tue, 10 Jun 2003 04:00:00 GMT</pubDate><lastBuildDate>Tue, 10 Jun 2003 09:41:01 GMT</lastBuildDate><docs>http://blogs.law.harvard.edu/tech/rss</docs><generator>Weblog Editor 2.0</generator><managingEditor>editor@example.com</managingEditor><webMaster>webmaster@example.com</webMaster><item><title>Star City</title><link>http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp</link><description>How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russias <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.</description><pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/06/03.html#item573</guid></item><item><description>Sky watchers in Europe, Asia, and parts of Alaska and Canada will experience a <a href="http://science.nasa.gov/headlines/y2003/30may_solareclipse.htm">partial eclipse of the Sun</a> on Saturday, May 31st.</description><pubDate>Fri, 30 May 2003 11:06:42 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/05/30.html#item572</guid></item><item><title>The Engine That Does More</title><link>http://liftoff.msfc.nasa.gov/news/2003/news-VASIMR.asp</link><description>Before man travels to Mars, NASA hopes to design new engines that will let us fly through the Solar System more quickly. The proposed VASIMR engine would do that.</description><pubDate>Tue, 27 May 2003 08:37:32 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/05/27.html#item571</guid></item><item><title>Astronauts Dirty Laundry</title><link>http://liftoff.msfc.nasa.gov/news/2003/news-laundry.asp</link><description>Compared to earlier spacecraft, the International Space Station has many luxuries, but laundry facilities are not one of them. Instead, astronauts have other options.</description><pubDate>Tue, 20 May 2003 08:56:02 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/05/20.html#item570</guid></item></channel></rss>';
}
