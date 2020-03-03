(function() {
  function registerEvent(name, method) {
    fabric.events[name] = method;
  }
  fabric.events = {};
  fabric.util.registerEvent = registerEvent;
})();
