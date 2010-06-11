/**
 * Event.simulate(@element, eventName[, options]) -> Element
 * 
 * - @element: element to fire event on
 * - eventName: name of event to fire (only MouseEvents and HTMLEvents interfaces are supported)
 * - options: optional object to fine-tune event properties - pointerX, pointerY, ctrlKey, etc.
 *
 *    $('foo').simulate('click'); // => fires "click" event on an element with id=foo
 *
 **/
(function(){
  
  var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|mouse(?:down|up|over|move|out))$/,
    'KeyboardEvent': /^(?:key(?:up|down|press))$/
  }
  var defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  }
  
  Event.simulate = function(element, eventName) {
    
    var options = Object.extend(Object.clone(defaultOptions), arguments[2] || { }),
        oEvent, 
        eventType;
        
    element = $(element);
    
    for (var name in eventMatchers) {
      if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }
    
    if (!eventType) {
      throw new SyntaxError('This event is not supported');
    }
    
    if (document.createEvent) {
      try {
        // Opera doesn't support event types like "KeyboardEvent", 
        // but allows to create event of type "HTMLEvents", then fire key event on it
        oEvent = document.createEvent(eventType);
      }
      catch(err) {
        oEvent = document.createEvent('HTMLEvents');
      }
      
      if (eventType == 'HTMLEvents') {
        oEvent.initEvent(eventName, options.bubbles, options.cancelable);
      }
      else if (eventType === 'KeyboardEvent') {
        // TODO (kangax): this needs to be tested
        if (oEvent.initKeyEvent) {
          oEvent.initKeyEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.keyCode, 
            options.charCode);
        }
        else if (oEvent.initEvent) {
          oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
      }
      else {
        oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView, 
          options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
          options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
      }
      element.dispatchEvent(oEvent);
    }
    else {
      options.clientX = options.pointerX;
      options.clientY = options.pointerY;
      oEvent = Object.extend(document.createEventObject(), options);
      element.fireEvent('on' + eventName, oEvent);
    }
    return element;
  }
  
  Element.addMethods({ simulate: Event.simulate });
})()