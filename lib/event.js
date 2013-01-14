if (typeof document == 'undefined' && typeof navigator == 'undefined') {
  var document = fabric.document;
  var navigator = fabric.window.navigator;
}

/*
 ----------------------------------------------------
 Event.js : 1.1.1 : 2012/11/19 : MIT License
 ----------------------------------------------------
 https://github.com/mudcube/Event.js
 ----------------------------------------------------
 1	: click, dblclick, dbltap
 1+	: tap, longpress, drag, swipe
 2+	: pinch, rotate
 : mousewheel, devicemotion, shake
 ----------------------------------------------------
 TODO
 ----------------------------------------------------
 * switch configuration to 4th argument on addEventListener
 * bbox calculation for elements scaled with transform.
 ----------------------------------------------------
 NOTES
 ----------------------------------------------------
 * When using other libraries that may have built in "Event" namespace,
 i.e. Typescript, you can use "eventjs" instead of "Event" for all example calls.
 ----------------------------------------------------
 REQUIREMENTS: querySelector, querySelectorAll
 ----------------------------------------------------
 *	There are two ways to add/remove events with this library.
 ----------------------------------------------------
 // Retains "this" attribute as target, and overrides native addEventListener.
 target.addEventListener(type, listener, useCapture);
 target.removeEventListener(type, listener, useCapture);

 // Attempts to perform as fast as possible.
 Event.add(type, listener, configure);
 Event.remove(type, listener, configure);

 *	You can turn prototyping on/off for individual features.
 ----------------------------------------------------
 Event.modifyEventListener = true; // add custom *EventListener commands to HTMLElements.
 Event.modifySelectors = true; // add bulk *EventListener commands on NodeLists from querySelectorAll and others.

 *	Example of setting up a single listener with a custom configuration.
 ----------------------------------------------------
 // optional configuration.
 var configure = {
 fingers: 2, // listen for specifically two fingers.
 snap: 90 // snap to 90 degree intervals.
 };
 // adding with addEventListener()
 target.addEventListener("swipe", function(event) {
 // additional variables can be found on the event object.
 console.log(event.velocity, event.angle, event.fingers);
 }, configure);

 // adding with Event.add()
 Event.add("swipe", function(event, self) {
 // additional variables can be found on the self object.
 console.log(self.velocity, self.angle, self.fingers);
 }, configure);

 *	Multiple listeners glued together.
 ----------------------------------------------------
 // adding with addEventListener()
 target.addEventListener("click swipe", function(event) { });

 // adding with Event.add()
 Event.add(target, "click swipe", function(event, self) { });

 *	Use query selectors to create an event (querySelectorAll)
 ----------------------------------------------------
 // adding events to NodeList from querySelectorAll()
 document.querySelectorAll("#element a.link").addEventListener("click", callback);

 // adding with Event.add()
 Event.add("#element a.link", "click", callback);

 *	Listen for selector to become available (querySelector)
 ----------------------------------------------------
 Event.add("body", "ready", callback);
 // or...
 Event.add({
 target: "body",
 type: "ready",
 timeout: 10000, // set a timeout to stop checking.
 interval: 30, // set how often to check for element.
 listener: callback
 });

 *	Multiple listeners bound to one callback w/ single configuration.
 ----------------------------------------------------
 var bindings = Event.add({
 target: target,
 type: "click swipe",
 snap: 90, // snap to 90 degree intervals.
 minFingers: 2, // minimum required fingers to start event.
 maxFingers: 4, // maximum fingers in one event.
 listener: function(event, self) {
 console.log(self.gesture); // will be click or swipe.
 console.log(self.x);
 console.log(self.y);
 console.log(self.identifier);
 console.log(self.start);
 console.log(self.fingers); // somewhere between "2" and "4".
 self.pause(); // disable event.
 self.resume(); // enable event.
 self.remove(); // remove event.
 }
 });

 *	Multiple listeners bound to multiple callbacks w/ single configuration.
 ----------------------------------------------------
 var bindings = Event.add({
 target: target,
 minFingers: 1,
 maxFingers: 12,
 listeners: {
 click: function(event, self) {
 self.remove(); // removes this click listener.
 },
 swipe: function(event, self) {
 binding.remove(); // removes both the click + swipe listeners.
 }
 }
 });

 *	Multiple listeners bound to multiple callbacks w/ multiple configurations.
 ----------------------------------------------------
 var binding = Event.add({
 target: target,
 listeners: {
 longpress: {
 fingers: 1,
 wait: 500, // milliseconds
 listener: function(event, self) {
 console.log(self.fingers); // "1" finger.
 }
 },
 drag: {
 fingers: 3,
 position: "relative", // "relative", "absolute", "difference", "move"
 listener: function(event, self) {
 console.log(self.fingers); // "3" fingers.
 console.log(self.x); // coordinate is relative to edge of target.
 }
 }
 }
 });

 *	Capturing an event and manually forwarding it to a proxy (tiered events).
 ----------------------------------------------------
 Event.add(target, "down", function(event, self) {
 var x = event.pageX; // local variables that wont change.
 var y = event.pageY;
 Event.proxy.drag({
 event: event,
 target: target,
 listener: function(event, self) {
 console.log(x - event.pageX); // measure movement.
 console.log(y - event.pageY);
 }
 });
 });
 ----------------------------------------------------

 *	Event proxies.
 *	type, fingers, state, start, x, y, position, bbox
 *	rotation, scale, velocity, angle, delay, timeout
 ----------------------------------------------------
 // "Click" :: fingers, minFingers, maxFingers.
 Event.add(window, "click", function(event, self) {
 console.log(self.gesture, self.x, self.y);
 });
 // "Double-Click" :: fingers, minFingers, maxFingers.
 Event.add(window, "dblclick", function(event, self) {
 console.log(self.gesture, self.x, self.y);
 });
 // "Drag" :: fingers, maxFingers, position
 Event.add(window, "drag", function(event, self) {
 console.log(self.gesture, self.fingers, self.state, self.start, self.x, self.y, self.bbox);
 });
 // "Gesture" :: fingers, minFingers, maxFingers.
 Event.add(window, "gesture", function(event, self) {
 console.log(self.gesture, self.fingers, self.state, self.rotation, self.scale);
 });
 // "Swipe" :: fingers, minFingers, maxFingers, snap, threshold.
 Event.add(window, "swipe", function(event, self) {
 console.log(self.gesture, self.fingers, self.velocity, self.angle, self.start, self.x, self.y);
 });
 // "Tap" :: fingers, minFingers, maxFingers, timeout.
 Event.add(window, "tap", function(event, self) {
 console.log(self.gesture, self.fingers);
 });
 // "Longpress" :: fingers, minFingers, maxFingers, delay.
 Event.add(window, "longpress", function(event, self) {
 console.log(self.gesture, self.fingers);
 });
 //
 Event.add(window, "shake", function(event, self) {
 console.log(self.gesture, self.acceleration, self.accelerationIncludingGravity);
 });
 //
 Event.add(window, "devicemotion", function(event, self) {
 console.log(self.gesture, self.acceleration, self.accelerationIncludingGravity);
 });
 //
 Event.add(window, "wheel", function(event, self) {
 console.log(self.gesture, self.state, self.wheelDelta);
 });

 *	Stop, prevent and cancel.
 ----------------------------------------------------
 Event.stop(event); // stop bubble.
 Event.prevent(event); // prevent default.
 Event.cancel(event); // stop and prevent.

 *	Track for proper command/control-key for Mac/PC.
 ----------------------------------------------------
 Event.add(window, "keyup keydown", Event.proxy.metaTracker);
 console.log(Event.proxy.metaKey);

 *	Test for event features, in this example Drag & Drop file support.
 ----------------------------------------------------
 console.log(Event.supports('dragstart') && Event.supports('drop') && !!window.FileReader);

 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(eventjs) === "undefined")
    var eventjs = Event;

Event = (function(root) {
    "use strict";

// Add custom *EventListener commands to HTMLElements.
    root.modifyEventListener = false;

// Add bulk *EventListener commands on NodeLists from querySelectorAll and others.
    root.modifySelectors = false;

// Event maintenance.
    root.add = function(target, type, listener, configure) {
        return eventManager(target, type, listener, configure, "add");
    };

    root.remove = function(target, type, listener, configure) {
        return eventManager(target, type, listener, configure, "remove");
    };

    root.stop = function(event) {
        if (event.stopPropagation)
            event.stopPropagation();
        event.cancelBubble = true; // <= IE8
        event.bubble = 0;
    };

    root.prevent = function(event) {
        if (event.preventDefault)
            event.preventDefault();
        event.returnValue = false; // <= IE8
    };

    root.cancel = function(event) {
        root.stop(event);
        root.prevent(event);
    };

// Check whether event is natively supported (via @kangax)
    root.supports = function(target, type) {
        if (typeof(target) === "string") {
            type = target;
            target = window;
        }
        type = "on" + type;
        if (type in target)
            return true;
        if (!target.setAttribute)
            target = document.createElement("div");
        if (target.setAttribute && target.removeAttribute) {
            target.setAttribute(type, "");
            var isSupported = typeof target[type] === "function";
            if (typeof target[type] !== "undefined")
                target[type] = null;
            target.removeAttribute(type);
            return isSupported;
        }
    };

    var clone = function(obj) {
        if (!obj || typeof (obj) !== 'object')
            return obj;
        var temp = new obj.constructor();
        for (var key in obj) {
            if (!obj[key] || typeof (obj[key]) !== 'object') {
                temp[key] = obj[key];
            } else { // clone sub-object
                temp[key] = clone(obj[key]);
            }
        }
        return temp;
    };

/// Handle custom *EventListener commands.
    var eventManager = function(target, type, listener, configure, trigger, fromOverwrite) {
        configure = configure || {};
        // Check for element to load on interval (before onload).
        if (typeof(target) === "string" && type === "ready") {
            var time = (new Date()).getTime();
            var timeout = configure.timeout;
            var ms = configure.interval || 1000 / 60;
            var interval = window.setInterval(function() {
                if ((new Date()).getTime() - time > timeout) {
                    window.clearInterval(interval);
                }
                if (document.querySelector(target)) {
                    window.clearInterval(interval);
                    listener();
                }
            }, ms);
            return;
        }
        // Get DOM element from Query Selector.
        if (typeof(target) === "string") {
            target = document.querySelectorAll(target);
            if (target.length === 0)
                return createError("Missing target on listener!"); // No results.
            if (target.length === 1) { // Single target.
                target = target[0];
            }
        }
        /// Handle multiple targets.
        var event;
        var events = {};
        if (target.length > 0) {
            for (var n0 = 0, length0 = target.length; n0 < length0; n0++) {
                event = eventManager(target[n0], type, listener, clone(configure), trigger);
                if (event)
                    events[n0] = event;
            }
            return createBatchCommands(events);
        }
        // Check for multiple events in one string.
        if (type.indexOf && type.indexOf(" ") !== -1)
            type = type.split(" ");
        if (type.indexOf && type.indexOf(",") !== -1)
            type = type.split(",");
        // Attach or remove multiple events associated with a target.
        if (typeof(type) !== "string") { // Has multiple events.
            if (typeof(type.length) === "number") { // Handle multiple listeners glued together.
                for (var n1 = 0, length1 = type.length; n1 < length1; n1++) { // Array [type]
                    event = eventManager(target, type[n1], listener, clone(configure), trigger);
                    if (event)
                        events[type[n1]] = event;
                }
            } else { // Handle multiple listeners.
                for (var key in type) { // Object {type}
                    if (typeof(type[key]) === "function") { // without configuration.
                        event = eventManager(target, key, type[key], clone(configure), trigger);
                    } else { // with configuration.
                        event = eventManager(target, key, type[key].listener, clone(type[key]), trigger);
                    }
                    if (event)
                        events[key] = event;
                }
            }
            return createBatchCommands(events);
        }
        // Ensure listener is a function.
        if (typeof(listener) !== "function")
            return createError("Listener is not a function!");
        // Generate a unique wrapper identifier.
        var useCapture = configure.useCapture || false;
        var id = normalize(type) + getID(target) + "." + getID(listener) + "." + (useCapture ? 1 : 0);
        // Handle the event.
        if (root.Gesture && root.Gesture._gestureHandlers[type]) { // Fire custom event.
            if (trigger === "remove") { // Remove event listener.
                if (!wrappers[id])
                    return; // Already removed.
                wrappers[id].remove();
                delete wrappers[id];
            } else if (trigger === "add") { // Attach event listener.
                if (wrappers[id])
                    return wrappers[id]; // Already attached.
                // Retains "this" orientation.
                if (configure.useCall && !root.modifyEventListener) {
                    var tmp = listener;
                    listener = function(event, self) {
                        for (var key in self)
                            event[key] = self[key];
                        return tmp.call(target, event);
                    };
                }
                // Create listener proxy.
                configure.gesture = type;
                configure.target = target;
                configure.listener = listener;
                configure.fromOverwrite = fromOverwrite;
                // Record wrapper.
                wrappers[id] = root.proxy[type](configure);
            }
        } else { // Fire native event.
            type = normalize(type);
            if (trigger === "remove") { // Remove event listener.
                if (!wrappers[id])
                    return; // Already removed.
                target[remove](type, listener, useCapture);
                delete wrappers[id];
            } else if (trigger === "add") { // Attach event listener.
                if (wrappers[id])
                    return wrappers[id]; // Already attached.
                target[add](type, listener, useCapture);
                // Record wrapper.
                wrappers[id] = {
                    type: type,
                    target: target,
                    listener: listener,
                    remove: function() {
                        root.remove(target, type, listener, configure);
                    }
                };
            }
        }
        return wrappers[id];
    };

/// Perform batch actions on multiple events.
    var createBatchCommands = function(events) {
        return {
            remove: function() { // Remove multiple events.
                for (var key in events) {
                    events[key].remove();
                }
            },
            add: function() { // Add multiple events.
                for (var key in events) {
                    events[key].add();
                }
            }
        };
    };

/// Display error message in console.
    var createError = function(message) {
        if (typeof(console) === "undefined")
            return;
        if (typeof(console.error) === "undefined")
            return;
        console.error(message);
    };

/// Handle naming discrepancies between platforms.
    var normalize = (function() {
        var translate = {};
        return function(type) {
            if (!root.pointerType) {
                if (window.navigator.msPointerEnabled) {
                    root.pointerType = "mspointer";
                    translate = {
                        "mousedown": "MSPointerDown",
                        "mousemove": "MSPointerMove",
                        "mouseup": "MSPointerUp"
                    };
                } else if (root.supports("touchstart")) {
                    root.pointerType = "touch";
                    translate = {
                        "mousedown": "touchstart",
                        "mouseup": "touchend",
                        "mousemove": "touchmove"
                    };
                } else {
                    root.pointerType = "mouse";
                }
            }
            if (translate[type])
                type = translate[type];
            if (!document.addEventListener) { // IE
                return "on" + type;
            } else {
                return type;
            }
        };
    })();

/// Event wrappers to keep track of all events placed in the window.
    var wrappers = {};
    var counter = 0;
    var getID = function(object) {
        if (object === window)
            return "#window";
        if (object === document)
            return "#document";
        if (!object)
            return createError("Missing target on listener!");
        if (!object.uniqueID)
            object.uniqueID = "id" + counter++;
        return object.uniqueID;
    };

/// Detect platforms native *EventListener command.
    var add = document.addEventListener ? "addEventListener" : "attachEvent";
    var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";

    /*
     Pointer.js
     ------------------------
     Modified from; https://github.com/borismus/pointer.js
     */

    root.createPointerEvent = function(event, self, preventRecord) {
        var eventName = self.gesture;
        var target = self.target;
        var pts = event.changedTouches || root.proxy.getCoords(event);
        if (pts.length) {
            var pt = pts[0];
            self.pointers = preventRecord ? [] : pts;
            self.pageX = pt.pageX;
            self.pageY = pt.pageY;
            self.x = self.pageX;
            self.y = self.pageY;
        }
        ///
        var newEvent = document.createEvent("Event");
        newEvent.initEvent(eventName, true, true);
        newEvent.originalEvent = event;
        for (var k in self) {
            if (k === "target")
                continue;
            newEvent[k] = self[k];
        }
        target.dispatchEvent(newEvent);
    };

/// Allows *EventListener to use custom event proxies.
    if (root.modifyEventListener && window.HTMLElement)
        (function() {
            var augmentEventListener = function(proto) {
                var recall = function(trigger) { // overwrite native *EventListener's
                    var handle = trigger + "EventListener";
                    var handler = proto[handle];
                    proto[handle] = function(type, listener, useCapture) {
                        if (root.Gesture && root.Gesture._gestureHandlers[type]) { // capture custom events.
                            var configure = useCapture;
                            if (typeof(useCapture) === "object") {
                                configure.useCall = true;
                            } else { // convert to configuration object.
                                configure = {
                                    useCall: true,
                                    useCapture: useCapture
                                };
                            }
                            eventManager(this, type, listener, configure, trigger, true);
                            handler.call(this, type, listener, useCapture);
                        } else { // use native function.
                            handler.call(this, normalize(type), listener, useCapture);
                        }
                    };
                };
                recall("add");
                recall("remove");
            };
            // NOTE: overwriting HTMLElement doesn't do anything in Firefox.
            if (navigator.userAgent.match(/Firefox/)) {
                // TODO: fix Firefox for the general case.
                augmentEventListener(HTMLDivElement.prototype);
                augmentEventListener(HTMLCanvasElement.prototype);
            } else {
                augmentEventListener(HTMLElement.prototype);
            }
            augmentEventListener(document);
            augmentEventListener(window);
        })();

/// Allows querySelectorAll and other NodeLists to perform *EventListener commands in bulk.
    if (root.modifySelectors)
        (function() {
            var proto = NodeList.prototype;
            proto.removeEventListener = function(type, listener, useCapture) {
                for (var n = 0, length = this.length; n < length; n++) {
                    this[n].removeEventListener(type, listener, useCapture);
                }
            };
            proto.addEventListener = function(type, listener, useCapture) {
                for (var n = 0, length = this.length; n < length; n++) {
                    this[n].addEventListener(type, listener, useCapture);
                }
            };
        })();

    return root;

})(Event);
/*
 ----------------------------------------------------
 Event.proxy : 0.4.2 : 2012/07/29 : MIT License
 ----------------------------------------------------
 https://github.com/mudcube/Event.js
 ----------------------------------------------------
 Pointer Gestures
 ----------------------------------------------------
 1  : click, dblclick, dbltap
 1+ : tap, taphold, drag, swipe
 2+ : pinch, rotate
 ----------------------------------------------------
 Gyroscope Gestures
 ----------------------------------------------------
 * shake
 ----------------------------------------------------
 Fixes issues with
 ----------------------------------------------------
 * mousewheel-Firefox uses DOMMouseScroll and does not return wheelDelta.
 * devicemotion-Fixes issue where event.acceleration is not returned.
 ----------------------------------------------------
 Ideas for the future
 ----------------------------------------------------
 * Keyboard, GamePad, and other input abstractions.
 * Event batching - i.e. for every x fingers down a new gesture is created.
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    /*
     Create a new pointer gesture instance.
     */

    root.pointerSetup = function(conf, self) {
        /// Configure.
        conf.doc = conf.target.ownerDocument || conf.target; // Associated document.
        conf.minFingers = conf.minFingers || conf.fingers || 1; // Minimum required fingers.
        conf.maxFingers = conf.maxFingers || conf.fingers || Infinity; // Maximum allowed fingers.
        conf.position = conf.position || "relative"; // Determines what coordinate system points are returned.
        delete conf.fingers; //-
        /// Convenience data.
        self = self || {};
        self.gesture = conf.gesture;
        self.target = conf.target;
        self.pointerType = Event.pointerType;
        ///
        if (Event.modifyEventListener && conf.fromOverwrite)
            conf.listener = Event.createPointerEvent;
        /// Convenience commands.
        var fingers = 0;
        var type = self.gesture.indexOf("pointer") === 0 && Event.modifyEventListener ? "pointer" : "mouse";
        self.listener = conf.listener;
        self.proxy = function(listener) {
            self.defaultListener = conf.listener;
            conf.listener = listener;
            listener(conf.event, self);
        };
        self.remove = function() {
            if (conf.onPointerDown)
                Event.remove(conf.target, type + "down", conf.onPointerDown);
            if (conf.onPointerMove)
                Event.remove(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp)
                Event.remove(conf.doc, type + "up", conf.onPointerUp);
        };
        self.resume = function(opt) {
            if (conf.onPointerMove && (!opt || opt.move))
                Event.add(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp && (!opt || opt.move))
                Event.add(conf.doc, type + "up", conf.onPointerUp);
            conf.fingers = fingers;
        };
        self.pause = function(opt) {
            fingers = conf.fingers;
            if (conf.onPointerMove && (!opt || opt.move))
                Event.remove(conf.doc, type + "move", conf.onPointerMove);
            if (conf.onPointerUp && (!opt || opt.up))
                Event.remove(conf.doc, type + "up", conf.onPointerUp);
            conf.fingers = 0;
        };
        ///
        return self;
    };

    /*
     Begin proxied pointer command.
     */

    root.pointerStart = function(event, self, conf) {
        var addTouchStart = function(touch, sid) {
            var bbox = conf.bbox;
            var pt = track[sid] = {};
            ///
            switch (conf.position) {
                case "absolute": // Absolute from within window.
                    pt.offsetX = 0;
                    pt.offsetY = 0;
                    break;
                case "difference": // Relative from origin.
                    pt.offsetX = touch.pageX;
                    pt.offsetY = touch.pageY;
                    break;
                case "move": // Move target element.
                    pt.offsetX = touch.pageX - bbox.x1;
                    pt.offsetY = touch.pageY - bbox.y1;
                    break;
                default: // Relative from within target.
                    pt.offsetX = bbox.x1;
                    pt.offsetY = bbox.y1;
                    break;
            }
            ///
            if (conf.position === "relative") {
                var x = (touch.pageX + bbox.scrollLeft - pt.offsetX) * bbox.scaleX;
                var y = (touch.pageY + bbox.scrollTop - pt.offsetY) * bbox.scaleY;
            } else {
                var x = (touch.pageX - pt.offsetX);
                var y = (touch.pageY - pt.offsetY);
            }
            ///
            pt.rotation = 0;
            pt.scale = 1;
            pt.startTime = pt.moveTime = (new Date).getTime();
            pt.move = {x: x, y: y};
            pt.start = {x: x, y: y};
            ///
            conf.fingers++;
        };
        ///
        conf.event = event;
        if (self.defaultListener) {
            conf.listener = self.defaultListener;
            delete self.defaultListener;
        }
        ///
        var isTouchStart = !conf.fingers;
        var track = conf.tracker;
        var touches = event.changedTouches || root.getCoords(event);
        var length = touches.length;
        // Adding touch events to tracking.
        for (var i = 0; i < length; i++) {
            var touch = touches[i];
            var sid = touch.identifier || Infinity; // Touch ID.
            // Track the current state of the touches.
            if (conf.fingers) {
                if (conf.fingers >= conf.maxFingers) {
                    var ids = [];
                    for (var sid in conf.tracker)
                        ids.push(sid);
                    self.identifier = ids.join(",");
                    return isTouchStart;
                }
                var fingers = 0; // Finger ID.
                for (var rid in track) {
                    // Replace removed finger.
                    if (track[rid].up) {
                        delete track[rid];
                        addTouchStart(touch, sid);
                        conf.cancel = true;
                        break;
                    }
                    fingers++;
                }
                // Add additional finger.
                if (track[sid])
                    continue;
                addTouchStart(touch, sid);
            } else { // Start tracking fingers.
                track = conf.tracker = {};
                self.bbox = conf.bbox = root.getBoundingBox(conf.target);
                conf.fingers = 0;
                conf.cancel = false;
                addTouchStart(touch, sid);
            }
        }
        ///
        var ids = [];
        for (var sid in conf.tracker)
            ids.push(sid);
        self.identifier = ids.join(",");
        ///
        return isTouchStart;
    };

    /*
     End proxied pointer command.
     */

    root.pointerEnd = function(event, self, conf, onPointerUp) {
        // Record changed touches have ended (iOS changedTouches is not reliable).
        var touches = event.touches || [];
        var length = touches.length;
        var exists = {};
        for (var i = 0; i < length; i++) {
            var touch = touches[i];
            var sid = touch.identifier;
            exists[sid || Infinity] = true;
        }
        for (var sid in conf.tracker) {
            var track = conf.tracker[sid];
            if (exists[sid] || track.up)
                continue;
            if (onPointerUp) { // add changedTouches to mouse.
                onPointerUp({
                    pageX: track.pageX,
                    pageY: track.pageY,
                    changedTouches: [{
                            pageX: track.pageX,
                            pageY: track.pageY,
                            identifier: sid === "Infinity" ? Infinity : sid
                        }]
                }, "up");
            }
            track.up = true;
            conf.fingers--;
        }
        /*	// This should work but fails in Safari on iOS4 so not using it.
         var touches = event.changedTouches || root.getCoords(event);
         var length = touches.length;
         // Record changed touches have ended (this should work).
         for (var i = 0; i < length; i ++) {
         var touch = touches[i];
         var sid = touch.identifier || Infinity;
         var track = conf.tracker[sid];
         if (track && !track.up) {
         if (onPointerUp) { // add changedTouches to mouse.
         onPointerUp({
         changedTouches: [{
         pageX: track.pageX,
         pageY: track.pageY,
         identifier: sid === "Infinity" ? Infinity : sid
         }]
         }, "up");
         }
         track.up = true;
         conf.fingers --;
         }
         } */
        // Wait for all fingers to be released.
        if (conf.fingers !== 0)
            return false;
        // Record total number of fingers gesture used.
        var ids = [];
        conf.gestureFingers = 0;
        for (var sid in conf.tracker) {
            conf.gestureFingers++;
            ids.push(sid);
        }
        self.identifier = ids.join(",");
        // Our pointer gesture has ended.
        return true;
    };

    /*
     Returns mouse coords in an array to match event.*Touches
     ------------------------------------------------------------
     var touch = event.changedTouches || root.getCoords(event);
     */

    root.getCoords = function(event) {
        if (typeof(event.pageX) !== "undefined") { // Desktop browsers.
            root.getCoords = function(event) {
                return Array({
                    type: "mouse",
                    x: event.pageX,
                    y: event.pageY,
                    pageX: event.pageX,
                    pageY: event.pageY,
                    identifier: Infinity
                });
            };
        } else { // Internet Explorer <= 8.0
            root.getCoords = function(event) {
                event = event || window.event;
                return Array({
                    type: "mouse",
                    x: event.clientX + document.documentElement.scrollLeft,
                    y: event.clientY + document.documentElement.scrollTop,
                    pageX: event.clientX + document.documentElement.scrollLeft,
                    pageY: event.clientY + document.documentElement.scrollTop,
                    identifier: Infinity
                });
            };
        }
        return root.getCoords(event);
    };

    /*
     Returns single coords in an object.
     ------------------------------------------------------------
     var mouse = root.getCoord(event);
     */

    root.getCoord = function(event) {
        if ("ontouchstart" in window) { // Mobile browsers.
            var pX = 0;
            var pY = 0;
            root.getCoord = function(event) {
                var touches = event.changedTouches;
                if (touches.length) { // ontouchstart + ontouchmove
                    return {
                        x: pX = touches[0].pageX,
                        y: pY = touches[0].pageY
                    };
                } else { // ontouchend
                    return {
                        x: pX,
                        y: pY
                    };
                }
            };
        } else if (typeof(event.pageX) !== "undefined" && typeof(event.pageY) !== "undefined") { // Desktop browsers.
            root.getCoord = function(event) {
                return {
                    x: event.pageX,
                    y: event.pageY
                };
            };
        } else { // Internet Explorer <=8.0
            root.getCoord = function(event) {
                event = event || window.event;
                return {
                    x: event.clientX + document.documentElement.scrollLeft,
                    y: event.clientY + document.documentElement.scrollTop
                };
            };
        }
        return root.getCoord(event);
    };

    /*
     Get target scale and position in space.
     */

    root.getBoundingBox = function(o) {
        if (o === window || o === document)
            o = document.body;
        ///
        var bbox = {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
            scrollLeft: 0,
            scrollTop: 0
        };
        ///
        if (o === document.body) {
            bbox.height = window.innerHeight;
            bbox.width = window.innerWidth;
        } else {
            bbox.height = o.offsetHeight;
            bbox.width = o.offsetWidth;
        }
        /// Get the scale of the element.
        bbox.scaleX = o.width / bbox.width || 1;
        bbox.scaleY = o.height / bbox.height || 1;
        /// Get the offset of element.
        var tmp = o;
        while (tmp !== null) {
            bbox.x1 += tmp.offsetLeft;
            bbox.y1 += tmp.offsetTop;
            tmp = tmp.offsetParent;
        }
        ;
        /// Get the scroll of container element.
        var tmp = o.parentNode;
        while (tmp !== null) {
            if (tmp === document.body)
                break;
            if (tmp.scrollTop === undefined)
                break;
            bbox.scrollLeft += tmp.scrollLeft;
            bbox.scrollTop += tmp.scrollTop;
            tmp = tmp.parentNode;
        }
        ;
        /// Record the extent of box.
        bbox.x2 = bbox.x1 + bbox.width;
        bbox.y2 = bbox.y1 + bbox.height;
        ///
        return bbox;
    };

    /*
     Keep track of metaKey, the proper ctrlKey for users platform.
     */

    (function() {
        var agent = navigator.userAgent.toLowerCase();
        var mac = agent.indexOf("macintosh") !== -1;
        if (mac && agent.indexOf("khtml") !== -1) { // chrome, safari.
            var watch = {91: true, 93: true};
        } else if (mac && agent.indexOf("firefox") !== -1) {  // mac firefox.
            var watch = {224: true};
        } else { // windows, linux, or mac opera.
            var watch = {17: true};
        }
        root.isMetaKey = function(event) {
            return !!watch[event.keyCode];
        };
        root.metaTracker = function(event) {
            if (watch[event.keyCode]) {
                root.metaKey = event.type === "keydown";
            }
        };
    })();

    return root;

})(Event.proxy);
/*
 "Click" event proxy.
 ----------------------------------------------------
 Event.add(window, "click", function(event, self) {});
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.click = function(conf) {
        conf.maxFingers = conf.maxFingers || conf.fingers || 1;
        // Setting up local variables.
        var EVENT;
        // Tracking the events.
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                Event.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            EVENT = event;
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                if (EVENT.cancelBubble && ++EVENT.bubble > 1)
                    return;
                var pointers = EVENT.changedTouches || root.getCoords(EVENT);
                var pointer = pointers[0];
                var bbox = conf.bbox;
                var newbbox = root.getBoundingBox(conf.target);
                if (conf.position === "relative") {
                    var ax = (pointer.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                    var ay = (pointer.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                } else {
                    var ax = (pointer.pageX - bbox.x1);
                    var ay = (pointer.pageY - bbox.y1);
                }
                if (ax > 0 && ax < bbox.width && // Within target coordinates.
                        ay > 0 && ay < bbox.height &&
                        bbox.scrollTop === newbbox.scrollTop) {
                    conf.listener(EVENT, self);
                }
            }
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        self.state = "click";
        // Attach events.
        Event.add(conf.target, "mousedown", conf.onPointerDown);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.click = root.click;

    return root;

})(Event.proxy);
/*
 "Double-Click" aka "Double-Tap" event proxy.
 ----------------------------------------------------
 Event.add(window, "dblclick", function(event, self) {});
 ----------------------------------------------------
 Touch an target twice for <= 700ms, with less than 25 pixel drift.
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.dbltap =
            root.dblclick = function(conf) {
        conf.maxFingers = conf.maxFingers || conf.fingers || 1;
        // Setting up local variables.
        var delay = 700; // in milliseconds
        var time0, time1, timeout;
        var pointer0, pointer1;
        // Tracking the events.
        conf.onPointerDown = function(event) {
            var pointers = event.changedTouches || root.getCoords(event);
            if (time0 && !time1) { // Click #2
                pointer1 = pointers[0];
                time1 = (new Date).getTime() - time0;
            } else { // Click #1
                pointer0 = pointers[0];
                time0 = (new Date).getTime();
                time1 = 0;
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                    time0 = 0;
                }, delay);
            }
            if (root.pointerStart(event, self, conf)) {
                Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                Event.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            if (time0 && !time1) {
                var pointers = event.changedTouches || root.getCoords(event);
                pointer1 = pointers[0];
            }
            var bbox = conf.bbox;
            if (conf.position === "relative") {
                var ax = (pointer1.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                var ay = (pointer1.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
            } else {
                var ax = (pointer1.pageX - bbox.x1);
                var ay = (pointer1.pageY - bbox.y1);
            }
            if (!(ax > 0 && ax < bbox.width && // Within target coordinates..
                    ay > 0 && ay < bbox.height &&
                    Math.abs(pointer1.pageX - pointer0.pageX) <= 25 && // Within drift deviance.
                    Math.abs(pointer1.pageY - pointer0.pageY) <= 25)) {
                // Cancel out this listener.
                Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                clearTimeout(timeout);
                time0 = time1 = 0;
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                Event.remove(conf.doc, "mouseup", conf.onPointerUp);
            }
            if (time0 && time1) {
                if (time1 <= delay && !(event.cancelBubble && ++event.bubble > 1)) {
                    self.state = conf.gesture;
                    conf.listener(event, self);
                }
                clearTimeout(timeout);
                time0 = time1 = 0;
            }
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        self.state = "dblclick";
        // Attach events.
        Event.add(conf.target, "mousedown", conf.onPointerDown);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.dbltap = root.dbltap;
    Event.Gesture._gestureHandlers.dblclick = root.dblclick;

    return root;

})(Event.proxy);
/*
 "Drag" event proxy (1+ fingers).
 ----------------------------------------------------
 CONFIGURE: maxFingers, position.
 ----------------------------------------------------
 Event.add(window, "drag", function(event, self) {
 console.log(self.gesture, self.state, self.start, self.x, self.y, self.bbox);
 });
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.dragElement = function(that, event) {
        root.drag({
            event: event,
            target: that,
            position: "move",
            listener: function(event, self) {
                that.style.left = self.x + "px";
                that.style.top = self.y + "px";
                Event.prevent(event);
            }
        });
    };

    root.drag = function(conf) {
        conf.gesture = "drag";
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                if (!conf.monitor) {
                    Event.add(conf.doc, "mousemove", conf.onPointerMove);
                    Event.add(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
            // Process event listener.
            conf.onPointerMove(event, "down");
        };
        conf.onPointerMove = function(event, state) {
            if (!conf.tracker)
                return conf.onPointerDown(event);
            var bbox = conf.bbox;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var identifier = touch.identifier || Infinity;
                var pt = conf.tracker[identifier];
                // Identifier defined outside of listener.
                if (!pt)
                    continue;
                pt.pageX = touch.pageX;
                pt.pageY = touch.pageY;
                // Record data.
                self.state = state || "move";
                self.identifier = identifier;
                self.start = pt.start;
                self.fingers = conf.fingers;
                if (conf.position === "relative") {
                    self.x = (pt.pageX + bbox.scrollLeft - pt.offsetX) * bbox.scaleX;
                    self.y = (pt.pageY + bbox.scrollTop - pt.offsetY) * bbox.scaleY;
                } else {
                    self.x = (pt.pageX - pt.offsetX);
                    self.y = (pt.pageY - pt.offsetY);
                }
                ///
                conf.listener(event, self);
            }
        };
        conf.onPointerUp = function(event) {
            // Remove tracking for touch.
            if (root.pointerEnd(event, self, conf, conf.onPointerMove)) {
                if (!conf.monitor) {
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                }
            }
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        // Attach events.
        if (conf.event) {
            conf.onPointerDown(conf.event);
        } else { //
            Event.add(conf.target, "mousedown", conf.onPointerDown);
            if (conf.monitor) {
                Event.add(conf.doc, "mousemove", conf.onPointerMove);
                Event.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        }
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.drag = root.drag;

    return root;

})(Event.proxy);
/*
 "Gesture" event proxy (2+ fingers).
 ----------------------------------------------------
 CONFIGURE: minFingers, maxFingers.
 ----------------------------------------------------
 Event.add(window, "gesture", function(event, self) {
 console.log(self.rotation, self.scale, self.fingers, self.state);
 });
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    var RAD_DEG = Math.PI / 180;

    root.gesture = function(conf) {
        conf.minFingers = conf.minFingers || conf.fingers || 2;
        // Tracking the events.
        conf.onPointerDown = function(event) {
            var fingers = conf.fingers;
            if (root.pointerStart(event, self, conf)) {
                Event.add(conf.doc, "mousemove", conf.onPointerMove);
                Event.add(conf.doc, "mouseup", conf.onPointerUp);
            }
            // Record gesture start.
            if (conf.fingers === conf.minFingers && fingers !== conf.fingers) {
                self.fingers = conf.minFingers;
                self.scale = 1;
                self.rotation = 0;
                self.state = "start";
                var sids = ""; //- FIXME(mud): can generate duplicate IDs.
                for (var key in conf.tracker)
                    sids += key;
                self.identifier = parseInt(sids);
                conf.listener(event, self);
            }
        };
        ///
        conf.onPointerMove = function(event, state) {
            var bbox = conf.bbox;
            var points = conf.tracker;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            // Update tracker coordinates.
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                var pt = points[sid];
                // Check whether "pt" is used by another gesture.
                if (!pt)
                    continue;
                // Find the actual coordinates.
                if (conf.position === "relative") {
                    pt.move.x = (touch.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                    pt.move.y = (touch.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                } else {
                    pt.move.x = (touch.pageX - bbox.x1);
                    pt.move.y = (touch.pageY - bbox.y1);
                }
            }
            ///
            if (conf.fingers < conf.minFingers)
                return;
            ///
            var touches = [];
            var scale = 0;
            var rotation = 0;
            /// Calculate centroid of gesture.
            var centroidx = 0;
            var centroidy = 0;
            var length = 0;
            for (var sid in points) {
                var touch = points[sid];
                if (touch.up)
                    continue;
                centroidx += touch.move.x;
                centroidy += touch.move.y;
                length++;
            }
            centroidx /= length;
            centroidy /= length;
            ///
            for (var sid in points) {
                var touch = points[sid];
                if (touch.up)
                    continue;
                var start = touch.start;
                if (!start.distance) {
                    var dx = start.x - centroidx;
                    var dy = start.y - centroidy;
                    start.distance = Math.sqrt(dx * dx + dy * dy);
                    start.angle = Math.atan2(dx, dy) / RAD_DEG;
                }
                // Calculate scale.
                var dx = touch.move.x - centroidx;
                var dy = touch.move.y - centroidy;
                var distance = Math.sqrt(dx * dx + dy * dy);
                scale += distance / start.distance;
                // Calculate rotation.
                var angle = Math.atan2(dx, dy) / RAD_DEG;
                var rotate = (start.angle - angle + 360) % 360 - 180;
                touch.DEG2 = touch.DEG1; // Previous degree.
                touch.DEG1 = rotate > 0 ? rotate : -rotate; // Current degree.
                if (typeof(touch.DEG2) !== "undefined") {
                    if (rotate > 0) {
                        touch.rotation += touch.DEG1 - touch.DEG2;
                    } else {
                        touch.rotation -= touch.DEG1 - touch.DEG2;
                    }
                    rotation += touch.rotation;
                }
                // Attach current points to self.
                touches.push(touch.move);
            }
            ///
            self.touches = touches;
            self.fingers = conf.fingers;
            self.scale = scale / conf.fingers;
            self.rotation = rotation / conf.fingers;
            self.state = "change";
            conf.listener(event, self);
        };
        conf.onPointerUp = function(event) {
            // Remove tracking for touch.
            var fingers = conf.fingers;
            if (root.pointerEnd(event, self, conf)) {
                Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                Event.remove(conf.doc, "mouseup", conf.onPointerUp);
            }
            // Check whether fingers has dropped below minFingers.
            if (fingers === conf.minFingers && conf.fingers < conf.minFingers) {
                self.fingers = conf.fingers;
                self.state = "end";
                conf.listener(event, self);
            }
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        // Attach events.
        Event.add(conf.target, "mousedown", conf.onPointerDown);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.gesture = root.gesture;

    return root;

})(Event.proxy);
/*
 "Pointer" event proxy (1+ fingers).
 ----------------------------------------------------
 CONFIGURE: minFingers, maxFingers.
 ----------------------------------------------------
 Event.add(window, "gesture", function(event, self) {
 console.log(self.rotation, self.scale, self.fingers, self.state);
 });
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.pointerdown =
            root.pointermove =
            root.pointerup = function(conf) {
        if (conf.target.isPointerEmitter)
            return;
        // Tracking the events.
        var isDown = true;
        conf.onPointerDown = function(event) {
            isDown = false;
            self.gesture = "pointerdown";
            conf.listener(event, self);
        };
        conf.onPointerMove = function(event) {
            self.gesture = "pointermove";
            conf.listener(event, self, isDown);
        };
        conf.onPointerUp = function(event) {
            isDown = true;
            self.gesture = "pointerup";
            conf.listener(event, self, true);
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        // Attach events.
        Event.add(conf.target, "mousedown", conf.onPointerDown);
        Event.add(conf.target, "mousemove", conf.onPointerMove);
        Event.add(conf.doc, "mouseup", conf.onPointerUp);
        // Return this object.
        conf.target.isPointerEmitter = true;
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.pointerdown = root.pointerdown;
    Event.Gesture._gestureHandlers.pointermove = root.pointermove;
    Event.Gesture._gestureHandlers.pointerup = root.pointerup;

    return root;

})(Event.proxy);
/*
 "Device Motion" and "Shake" event proxy.
 ----------------------------------------------------
 http://developer.android.com/reference/android/hardware/SensorEvent.html#values
 ----------------------------------------------------
 Event.add(window, "shake", function(event, self) {});
 Event.add(window, "devicemotion", function(event, self) {
 console.log(self.acceleration, self.accelerationIncludingGravity);
 });
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.shake = function(conf) {
        // Externally accessible data.
        var self = {
            gesture: "devicemotion",
            acceleration: {},
            accelerationIncludingGravity: {},
            target: conf.target,
            listener: conf.listener,
            remove: function() {
                window.removeEventListener('devicemotion', onDeviceMotion, false);
            }
        };
        // Setting up local variables.
        var threshold = 4; // Gravitational threshold.
        var timeout = 1000; // Timeout between shake events.
        var timeframe = 200; // Time between shakes.
        var shakes = 3; // Minimum shakes to trigger event.
        var lastShake = (new Date).getTime();
        var gravity = {x: 0, y: 0, z: 0};
        var delta = {
            x: {count: 0, value: 0},
            y: {count: 0, value: 0},
            z: {count: 0, value: 0}
        };
        // Tracking the events.
        var onDeviceMotion = function(e) {
            var alpha = 0.8; // Low pass filter.
            var o = e.accelerationIncludingGravity;
            gravity.x = alpha * gravity.x + (1 - alpha) * o.x;
            gravity.y = alpha * gravity.y + (1 - alpha) * o.y;
            gravity.z = alpha * gravity.z + (1 - alpha) * o.z;
            self.accelerationIncludingGravity = gravity;
            self.acceleration.x = o.x - gravity.x;
            self.acceleration.y = o.y - gravity.y;
            self.acceleration.z = o.z - gravity.z;
            ///
            if (conf.gesture === "devicemotion") {
                conf.listener(e, self);
                return;
            }
            var data = "xyz";
            var now = (new Date).getTime();
            for (var n = 0, length = data.length; n < length; n++) {
                var letter = data[n];
                var ACCELERATION = self.acceleration[letter];
                var DELTA = delta[letter];
                var abs = Math.abs(ACCELERATION);
                /// Check whether another shake event was recently registered.
                if (now - lastShake < timeout)
                    continue;
                /// Check whether delta surpasses threshold.
                if (abs > threshold) {
                    var idx = now * ACCELERATION / abs;
                    var span = Math.abs(idx + DELTA.value);
                    // Check whether last delta was registered within timeframe.
                    if (DELTA.value && span < timeframe) {
                        DELTA.value = idx;
                        DELTA.count++;
                        // Check whether delta count has enough shakes.
                        if (DELTA.count === shakes) {
                            conf.listener(e, self);
                            // Reset tracking.
                            lastShake = now;
                            DELTA.value = 0;
                            DELTA.count = 0;
                        }
                    } else {
                        // Track first shake.
                        DELTA.value = idx;
                        DELTA.count = 1;
                    }
                }
            }
        };
        // Attach events.
        if (!window.addEventListener)
            return;
        window.addEventListener('devicemotion', onDeviceMotion, false);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.shake = root.shake;

    return root;

})(Event.proxy);
/*
 "Swipe" event proxy (1+ fingers).
 ----------------------------------------------------
 CONFIGURE: snap, threshold, maxFingers.
 ----------------------------------------------------
 Event.add(window, "swipe", function(event, self) {
 console.log(self.velocity, self.angle);
 });
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    var RAD_DEG = Math.PI / 180;

    root.swipe = function(conf) {
        conf.snap = conf.snap || 90; // angle snap.
        conf.threshold = conf.threshold || 1; // velocity threshold.
        // Tracking the events.
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                Event.add(conf.doc, "mouseup", conf.onPointerUp);
            }
        };
        conf.onPointerMove = function(event) {
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var sid = touch.identifier || Infinity;
                var o = conf.tracker[sid];
                // Identifier defined outside of listener.
                if (!o)
                    continue;
                o.move.x = touch.pageX;
                o.move.y = touch.pageY;
                o.moveTime = (new Date).getTime();
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                ///
                var velocity1;
                var velocity2
                var degree1;
                var degree2;
                /// Calculate centroid of gesture.
                var start = {x: 0, y: 0};
                var endx = 0;
                var endy = 0;
                var length = 0;
                ///
                for (var sid in conf.tracker) {
                    var touch = conf.tracker[sid];
                    var xdist = touch.move.x - touch.start.x;
                    var ydist = touch.move.y - touch.start.y;

                    endx += touch.move.x;
                    endy += touch.move.y;
                    start.x += touch.start.x;
                    start.y += touch.start.y;
                    length++;


                    var distance = Math.sqrt(xdist * xdist + ydist * ydist);
                    var ms = touch.moveTime - touch.startTime;
                    var degree2 = Math.atan2(xdist, ydist) / RAD_DEG + 180;
                    var velocity2 = ms ? distance / ms : 0;
                    if (typeof(degree1) === "undefined") {
                        degree1 = degree2;
                        velocity1 = velocity2;
                    } else if (Math.abs(degree2 - degree1) <= 20) {
                        degree1 = (degree1 + degree2) / 2;
                        velocity1 = (velocity1 + velocity2) / 2;
                    } else {
                        return;
                    }
                }
                ///
                if (velocity1 > conf.threshold) {
                    start.x /= length;
                    start.y /= length;
                    self.start = start;
                    self.x = endx / length;
                    self.y = endy / length;
                    self.angle = -((((degree1 / conf.snap + 0.5) >> 0) * conf.snap || 360) - 360);
                    self.velocity = velocity1;
                    self.fingers = conf.gestureFingers;
                    self.state = "swipe";
                    conf.listener(event, self);
                }
            }
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        // Attach events.
        Event.add(conf.target, "mousedown", conf.onPointerDown);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.swipe = root.swipe;

    return root;

})(Event.proxy);
/*
 "Tap" and "Longpress" event proxy.
 ----------------------------------------------------
 CONFIGURE: delay (longpress), timeout (tap).
 ----------------------------------------------------
 Event.add(window, "tap", function(event, self) {
 console.log(self.fingers);
 });
 ----------------------------------------------------
 multi-finger tap // touch an target for <= 250ms.
 multi-finger longpress // touch an target for >= 500ms
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.tap =
            root.longpress = function(conf) {
        conf.delay = conf.delay || 500;
        conf.timeout = conf.timeout || 250;
        // Setting up local variables.
        var timestamp, timeout;
        // Tracking the events.
        conf.onPointerDown = function(event) {
            if (root.pointerStart(event, self, conf)) {
                timestamp = (new Date).getTime();
                // Initialize event listeners.
                Event.add(conf.doc, "mousemove", conf.onPointerMove).listener(event);
                Event.add(conf.doc, "mouseup", conf.onPointerUp);
                // Make sure this is a "longpress" event.
                if (conf.gesture !== "longpress")
                    return;
                timeout = setTimeout(function() {
                    if (event.cancelBubble && ++event.bubble > 1)
                        return;
                    // Make sure no fingers have been changed.
                    var fingers = 0;
                    for (var key in conf.tracker) {
                        if (conf.tracker[key].end === true)
                            return;
                        if (conf.cancel)
                            return;
                        fingers++;
                    }
                    // Send callback.
                    self.state = "start";
                    self.fingers = fingers;
                    conf.listener(event, self);
                }, conf.delay);
            }
        };
        conf.onPointerMove = function(event) {
            var bbox = conf.bbox;
            var touches = event.changedTouches || root.getCoords(event);
            var length = touches.length;
            for (var i = 0; i < length; i++) {
                var touch = touches[i];
                var identifier = touch.identifier || Infinity;
                var pt = conf.tracker[identifier];
                if (!pt)
                    continue;
                if (conf.position === "relative") {
                    var x = (touch.pageX + bbox.scrollLeft - bbox.x1) * bbox.scaleX;
                    var y = (touch.pageY + bbox.scrollTop - bbox.y1) * bbox.scaleY;
                } else {
                    var x = (touch.pageX - bbox.x1);
                    var y = (touch.pageY - bbox.y1);
                }
                if (!(x > 0 && x < bbox.width && // Within target coordinates..
                        y > 0 && y < bbox.height &&
                        Math.abs(x - pt.start.x) <= 25 && // Within drift deviance.
                        Math.abs(y - pt.start.y) <= 25)) {
                    // Cancel out this listener.
                    Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                    conf.cancel = true;
                    return;
                }
            }
        };
        conf.onPointerUp = function(event) {
            if (root.pointerEnd(event, self, conf)) {
                clearTimeout(timeout);
                Event.remove(conf.doc, "mousemove", conf.onPointerMove);
                Event.remove(conf.doc, "mouseup", conf.onPointerUp);
                if (event.cancelBubble && ++event.bubble > 1)
                    return;
                // Callback release on longpress.
                if (conf.gesture === "longpress") {
                    if (self.state === "start") {
                        self.state = "end";
                        conf.listener(event, self);
                    }
                    return;
                }
                // Cancel event due to movement.
                if (conf.cancel)
                    return;
                // Ensure delay is within margins.
                if ((new Date).getTime() - timestamp > conf.timeout)
                    return;
                // Send callback.
                self.state = "tap";
                self.fingers = conf.gestureFingers;
                conf.listener(event, self);
            }
        };
        // Generate maintenance commands, and other configurations.
        var self = root.pointerSetup(conf);
        // Attach events.
        Event.add(conf.target, "mousedown", conf.onPointerDown);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.tap = root.tap;
    Event.Gesture._gestureHandlers.longpress = root.longpress;

    return root;

})(Event.proxy);
/*
 "Mouse Wheel" event proxy.
 ----------------------------------------------------
 Event.add(window, "wheel", function(event, self) {
 console.log(self.state, self.wheelDelta);
 });
 */

if (typeof(Event) === "undefined")
    var Event = {};
if (typeof(Event.proxy) === "undefined")
    Event.proxy = {};

Event.proxy = (function(root) {
    "use strict";

    root.wheel = function(conf) {
        // Configure event listener.
        var interval;
        var timeout = conf.timeout || 150;
        var count = 0;
        // Externally accessible data.
        var self = {
            gesture: "wheel",
            state: "start",
            wheelDelta: 0,
            target: conf.target,
            listener: conf.listener,
            remove: function() {
                conf.target[remove](type, onMouseWheel, false);
            }
        };
        // Tracking the events.
        var onMouseWheel = function(event) {
            event = event || window.event;
            self.state = count++ ? "change" : "start";
            self.wheelDelta = event.detail ? event.detail * -20 : event.wheelDelta;
            conf.listener(event, self);
            clearTimeout(interval);
            interval = setTimeout(function() {
                count = 0;
                self.state = "end";
                self.wheelDelta = 0;
                conf.listener(event, self);
            }, timeout);
        };
        // Attach events.
        var add = document.addEventListener ? "addEventListener" : "attachEvent";
        var remove = document.removeEventListener ? "removeEventListener" : "detachEvent";
        var type = Event.supports("mousewheel") ? "mousewheel" : "DOMMouseScroll";
        conf.target[add](type, onMouseWheel, false);
        // Return this object.
        return self;
    };

    Event.Gesture = Event.Gesture || {};
    Event.Gesture._gestureHandlers = Event.Gesture._gestureHandlers || {};
    Event.Gesture._gestureHandlers.wheel = root.wheel;

    return root;

})(Event.proxy);