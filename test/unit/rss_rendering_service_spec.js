var pb = require('./../../../careerbuilder_careers/test/unit/helpers/pb_mock').getMockPB();
var rssFeedMock = require('./../../../careerbuilder_careers/test/unit/helpers/rss_feed_mock').feeds;
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

describe('RSS Rendering Service', function () {
  var RSSRenderingService,
    rssRenderingService,
    getFeedStub,
    registerLocalFunction,
    registerLocalStub,
    isActivePluginStub,
    sandbox = sinon.sandbox.create();

  beforeEach(function () {
    RSSRenderingService = require('../../services/rss_rendering_service')(pb);

    var RSSFeederService = require('../../services/rssfeeder_service')(pb);
    getFeedStub = sandbox.stub(RSSFeederService.prototype, 'getFeed');

    var pluginServiceStub = sandbox.stub(pb.PluginService, 'getService');
    pluginServiceStub.withArgs("rssFeederService", "pencilblue_rssfeeder").returns(RSSFeederService);

    isActivePluginStub = sandbox.stub(pb.PluginService, 'isActivePlugin');
    isActivePluginStub.returns(true);

    registerLocalStub = sandbox.stub(pb.TemplateService.prototype, "registerLocal");
    registerLocalFunction = pb.TemplateService.prototype.registerLocal;

    rssRenderingService = new RSSRenderingService();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should be a RssRenderingService object', function () {
    expect(rssRenderingService).to.be.instanceof(RSSRenderingService);
  })

  it('should hold site if given in constructor', function () {
    rssRenderSiteGiven = new RSSRenderingService({site: 'not a real site'});
    expect(rssRenderSiteGiven.site).to.equal('not a real site');
  })

  it ('should default to global site if one is not given', function() {
    rssRenderSiteNotGiven = new RSSRenderingService();
    expect(rssRenderSiteNotGiven.site).to.equal(pb.SiteService.GLOBAL_SITE);
  });

  it('should have name rssRenderingService', function () {
    var name = RSSRenderingService.getName();
    expect(name).to.not.equal(null);
    expect(name).to.equal('rssRenderingService');
  });

  it('should be initialized', function (done) {
    RSSRenderingService.init(function (err, result) {
      expect(err).to.equal(null);
      expect(result).to.not.equal(null);
      expect(result).to.equal(true);
      done();
    });
  });

  it('should render html', function (done) {
    getFeedStub.yields(null, rssFeedMock.validResponse);
    rssRenderingService.render(function (err, templateValue) {
      expect(registerLocalFunction.calledWith('blog_url', 'http://advice.careerbuilder.com')).to.equal(true);
      expect(registerLocalFunction.calledWith('post_text', 'This needs to be 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 words...')).to.equal(true);
      expect(registerLocalFunction.calledWith('post_url', 'http://advice.careerbuilder.com/posts/when-colleagues-become-friends')).to.equal(true);
      expect(registerLocalFunction.calledWith('post_posted', '6 months ago')).to.equal(true);
      done();
    });
  });

  it('should render html even if date is invalid', function (done) {
    getFeedStub.yields(null, rssFeedMock.invalidDateResponse);
    rssRenderingService.render(function (err, templateValue) {
      expect(err).to.equal(null);
      expect(registerLocalFunction.calledWith('blog_url', 'http://advice.careerbuilder.com')).to.equal(true);
      expect(registerLocalFunction.calledWith('post_text', 'This needs to be 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 words...')).to.equal(true);
      expect(registerLocalFunction.calledWith('post_url', 'http://advice.careerbuilder.com/posts/when-colleagues-become-friends')).to.equal(true);
      expect(registerLocalFunction.calledWith('post_posted', '')).to.equal(true);
      done();
    });
  });

  it('should render nothing if response is empty', function (done) {
    getFeedStub.yields(null, rssFeedMock.emptyResponse);
    rssRenderingService.render(function (err, templateValue) {
      expect(err).to.equal(null);
      expect(templateValue).to.not.equal(null);
      expect(templateValue).to.equal('');
      done();
    });
  });

  it('should render nothing if response is empty', function (done) {
    getFeedStub.yields(null, rssFeedMock.emptyResponse);
    rssRenderingService.render(function (err, templateValue) {
      expect(err).to.equal(null);
      expect(templateValue).to.not.equal(null);
      expect(templateValue).to.equal('');
      done();
    });
  });

  it('should render nothing if plugin is not active', function(done) {
    isActivePluginStub.returns(false);
    getFeedStub.yields(null, rssFeedMock.validResponse);
    rssRenderingService.render(function (err, templateValue) {
      expect(err).to.equal(null);
      expect(templateValue).to.not.equal(null);
      expect(templateValue).to.equal('');
      done();
    });
  });
});