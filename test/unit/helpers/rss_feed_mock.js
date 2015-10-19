/**
 * Created by alpoole on 10/15/15.
 */
module.exports.feeds = {
  validResponse: [{
    "title": ["Advice & Resources"],
    "description": ["Advice & Resources"],
    "link": ["http://advice.careerbuilder.com"],
    "item": [{
      "title": ["When colleagues become friends"],
      "description": ["<p>This needs to be 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 words</p>"],
      "pubDate": ["2015-04-17T15:06:28.203Z"],
      "link": ["http://advice.careerbuilder.com/posts/when-colleagues-become-friends"],
      "guid": ["http://advice.careerbuilder.com/posts/when-colleagues-become-friends"]
    }, {
      "title": ["Save the Date: 4/18 ‘CareerBuilder Robotics Challenge’ in Atlanta"],
      "description": ["<p>This needs to be 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 words</p>"]
    }]
  }],

  invalidDateResponse: [{
    "title": ["Advice & Resources"],
    "description": ["Advice & Resources"],
    "link": ["http://advice.careerbuilder.com"],
    "item": [{
      "title": ["When colleagues become friends"],
      "pubDate": [""],
      "description": ["<p>This needs to be 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 words</p>"],
      "link": ["http://advice.careerbuilder.com/posts/when-colleagues-become-friends"],
      "guid": ["http://advice.careerbuilder.com/posts/when-colleagues-become-friends"]
    }, {
      "title": ["Save the Date: 4/18 ‘CareerBuilder Robotics Challenge’ in Atlanta"],
      "description": ["<p>This needs to be 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 24 words</p>"]
    }]
  }],

  emptyResponse: [{}]
}