(function(){
  
  var doc = this.document;
  
  APE.EventPublisher.remove = function(src, sEvent, fp, thisArg) {
    return APE.EventPublisher.get(src, sEvent).remove(fp, thisArg);
  };
  
  APE.getElement = function(id) {
    return typeof id === 'string' ? doc.getElementById(id) : id;
  };
  
})();