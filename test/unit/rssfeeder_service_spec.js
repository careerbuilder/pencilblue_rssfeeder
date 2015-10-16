var pb = require('./helpers/pb_mock').getMockPB();
var RSSFeederService = require('../../services/rssfeeder_service')(pb);
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var request = require('request');
var xml2js = require('xml2js');

describe('RSS Feeder Service', function () {
  var RSSFeederService,
    rssFeederService,
    pluginSettingStub,
    requestStub,
    parseStringStub,
    sandbox = sinon.sandbox.create();

  beforeEach(function () {
    RSSFeederService = require('../../services/rssfeeder_service')(pb);
    rssFeederService = new RSSFeederService({site: 'notarealsite'});

    pluginSettingStub = sandbox.stub(pb.PluginService.prototype, 'getSettingsKV');
    requestStub = sandbox.stub(request, 'get');
    parseStringStub = sandbox.stub(xml2js, 'parseString');
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should be a RSSFeederService object', function () {
    expect(rssFeederService).to.be.instanceof(RSSFeederService);
  });

  it('should store the site id if one is provided', function (done) {
    var rssSiteGiven = new RSSFeederService({site: "SOMERANDOMID"});
    expect(rssSiteGiven.site).to.equal("SOMERANDOMID");
    done();
  });
  it('should default site to global if there are options but not a site', function (done) {
    var rssSiteGiven = new RSSFeederService({blargh: "NOT AN ID"});
    expect(rssSiteGiven.site).to.equal(pb.SiteService.GLOBAL_SITE);
    done();
  });
  it('should default site to global if there are no options', function (done) {
    var rssNoOptions = new RSSFeederService();
    expect(rssNoOptions.site).to.equal(pb.SiteService.GLOBAL_SITE);
    done();
  });

  it('should have name', function () {
    var name = RSSFeederService.getName();
    expect(name).to.equal('rssFeederService');
  });

  it('should be initialized', function (done) {
    RSSFeederService.init(function (err, result) {
      expect(result).to.equal(true);
      expect(err).to.equal(null);
      done();
    });
  });

  it('should get feed with valid XML and parsed object', function (done) {
    pluginSettingStub.yields(null, 'www.goodfeedurl.com');
    requestStub.yields(null, {statusCode: 200}, 'Very nice xml');
    parseStringStub.yields(null, getValidParsedString());

    rssFeederService.getFeed(function (err, rssfeed) {
      expect(rssfeed).to.not.equal(null);
      expect(rssfeed[0].item).to.have.length.above(0);
      done();
    });
  });

  it('should return nothing if feed invalid', function (done) {
    pluginSettingStub.yields(null, 'www.badfeedurl.com');
    requestStub.yields(new Error(), {statusCode: 500}, null);
    rssFeederService.getFeed(function (err, rssfeed) {
      expect(rssfeed).to.equal(null);
      done();
    });
  });

  it('should return nothing if error is caught in Settings KV invalid', function (done) {
    pluginSettingStub.yields(new Error(), "");
    rssFeederService.getFeed(function (err, rssfeed) {
      expect(rssfeed).to.equal(null);
      done();
    });
  });

  it('should return nothing if an error is thrown from the parseString function', function (done) {
    pluginSettingStub.yields(null, 'www.goodfeedurl.com');
    requestStub.yields(null, {statusCode: 200}, 'Bad xml!');
    parseStringStub.yields(new Error(), null);
    rssFeederService.getFeed(function (err, rssfeed) {
      expect(rssfeed).to.equal(null);
      done();
    });
  });


  it('should callback with empty string if feed is empty or null', function (done) {
    pluginSettingStub.yields(null, 'www.goodfeedurl.com');
    requestStub.yields(null, {statusCode: 200}, '');
    rssFeederService.getFeed(function (err, rssfeed) {
      expect(rssfeed).to.equal('');
      expect(err).to.equal(null)
      done();
    });
  });

  it('should callback with error if rssfeed object is not filled out properly', function(done) {
    pluginSettingStub.yields(null, 'wwww.goodfeedurl.com');
    requestStub.yields(null, {statusCode: 200}, 'Awesome content.');
    parseStringStub.yields(null, {NotA: 'realobject'});
    rssFeederService.getFeed(function(err, rssfeed) {
      expect(rssfeed).to.equal(null);
      expect(err).to.not.equal(null);
      done();
    });
  });
});

function getValidParsedString() {
  return {
    rss: {
      channel: [{
        item: 'An item!',
        link: 'A link!'
      }]
    }
  }
}
