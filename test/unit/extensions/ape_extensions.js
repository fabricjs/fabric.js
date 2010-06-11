function init() {
  new Test.Unit.Runner({
    testGetElement: function() {
      this.assertRespondsTo('getElement', APE);
      
      var el = document.createElement('div');
      el.id = 'foo';
      document.body.appendChild(el);
      
      this.assertIdentical(el, APE.getElement('foo'));
      this.assertIdentical(el, APE.getElement(el));
    },
    testEventPublisherRemove: function() {
      
      this.assertRespondsTo('remove', APE.EventPublisher);
      
      
      var docEl = document.documentElement;
      var numInvocations = 0;
      
      function onclick() {
        numInvocations++;
      }
      
      APE.EventPublisher.add(docEl, 'onclick', onclick);
      Event.simulate(docEl, 'click');
      this.assertIdentical(1, numInvocations);
      
      APE.EventPublisher.remove(docEl, 'onclick', onclick);
      Event.simulate(docEl, 'click');
      this.assertIdentical(1, numInvocations, 'listener should be removed');
    }
  });
}