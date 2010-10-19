/** @ignore */
var scout = (function () {
  var tests = { };
  return {
    addTest: function (moduleName, test) {
      tests[moduleName] = test;
    },
    fetch: function () {
      var modulesToFetch = [ ];
      for (var moduleName in tests) {
        if (tests[moduleName]()) {
          modulesToFetch.push(moduleName);
        }
      }
      return modulesToFetch.join(',');
    }
  };
})();

scout.addTest('json2', function () {
  return typeof JSON === 'undefined';
});
scout.addTest('indexOf', function () {
  return typeof Array.prototype.indexOf === 'undefined';
});
scout.addTest('forEach', function () {
  return typeof Array.prototype.forEach === 'undefined';
});
scout.addTest('map', function () {
  return typeof Array.prototype.map === 'undefined';
});
scout.addTest('every', function () {
  return typeof Array.prototype.every === 'undefined';
});
scout.addTest('some', function () {
  return typeof Array.prototype.some === 'undefined';
});
scout.addTest('filter', function () {
  return typeof Array.prototype.filter === 'undefined';
});
scout.addTest('reduce', function () {
  return typeof Array.prototype.reduce === 'undefined';
});

scout.fetch();