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
    pluginSettingStub = sinon.stub(pb.PluginService.prototype, 'getSettingsKV');
    pluginSettingStub.onCall(0).yields(null, getValidSettingResponse());
    pluginSettingStub.onCall(1).yields(null, getInvalidSettingResponse());
  });

  it('should be a RSSFeederService object', function () {
    expect(rssFeederService).to.be.instanceof(RSSFeederService);
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
  
  it('should get feed', function(done) {
    rssFeederService.getFeed(function(rssfeed) {
      expect(rssfeed).to.not.equal(null);
      expect(rssfeed.rss.channel[0].item).to.have.length.above(0);
      done();
    });
  });
  
  it('should call back with error if feed invalid', function(done) {
    rssFeederService.getFeed(function(err, rssfeed) {
      expect(rssfeed).to.equal(null);
      expect(err).to.be.an.instanceOf(Error);
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

function getValidXML() {
  return '<rss version="2.0"><channel><title>Liftoff News</title><link>http://liftoff.msfc.nasa.gov/</link><description>Liftoff to Space Exploration.</description><language>en-us</language><pubDate>Tue, 10 Jun 2003 04:00:00 GMT</pubDate><lastBuildDate>Tue, 10 Jun 2003 09:41:01 GMT</lastBuildDate><docs>http://blogs.law.harvard.edu/tech/rss</docs><generator>Weblog Editor 2.0</generator><managingEditor>editor@example.com</managingEditor><webMaster>webmaster@example.com</webMaster><item><title>Star City</title><link>http://liftoff.msfc.nasa.gov/news/2003/news-starcity.asp</link><description>How do Americans get ready to work with Russians aboard the International Space Station? They take a crash course in culture, language and protocol at Russias <a href="http://howe.iki.rssi.ru/GCTC/gctc_e.htm">Star City</a>.</description><pubDate>Tue, 03 Jun 2003 09:39:21 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/06/03.html#item573</guid></item><item><description>Sky watchers in Europe, Asia, and parts of Alaska and Canada will experience a <a href="http://science.nasa.gov/headlines/y2003/30may_solareclipse.htm">partial eclipse of the Sun</a> on Saturday, May 31st.</description><pubDate>Fri, 30 May 2003 11:06:42 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/05/30.html#item572</guid></item><item><title>The Engine That Does More</title><link>http://liftoff.msfc.nasa.gov/news/2003/news-VASIMR.asp</link><description>Before man travels to Mars, NASA hopes to design new engines that will let us fly through the Solar System more quickly. The proposed VASIMR engine would do that.</description><pubDate>Tue, 27 May 2003 08:37:32 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/05/27.html#item571</guid></item><item><title>Astronauts Dirty Laundry</title><link>http://liftoff.msfc.nasa.gov/news/2003/news-laundry.asp</link><description>Compared to earlier spacecraft, the International Space Station has many luxuries, but laundry facilities are not one of them. Instead, astronauts have other options.</description><pubDate>Tue, 20 May 2003 08:56:02 GMT</pubDate><guid>http://liftoff.msfc.nasa.gov/2003/05/20.html#item570</guid></item></channel></rss>';
}