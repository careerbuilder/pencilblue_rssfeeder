module.exports = function TemplateServiceModule() {
  var localCallbacks = [];

  function TemplateService(ls) {
  }

  TemplateService.prototype.registerLocal = function (flag, callbackOrValue) {
    var injectionObj = {};
    injectionObj[flag] = callbackOrValue;
    localCallbacks.push(injectionObj);
    return true;
  };

  TemplateService.prototype.load = function (template, cb) {
    var stringArr = [];
    localCallbacks.forEach(function (c) {
      stringArr.push(JSON.stringify(c));
    });
    localCallbacks = [];
    cb(null, stringArr.join(""));
  };

  return TemplateService;
};