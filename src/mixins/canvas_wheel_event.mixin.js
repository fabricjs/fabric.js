(function() {

  var degreesToRadians = fabric.util.degreesToRadians,
      radiansToDegrees = fabric.util.radiansToDegrees;

  fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {

    /**
     * Method that defines actions when an Event.js wheel event is detected.
     *
     * @param e Event object by Event.js
     * @param self Event proxy object by Event.js
     */
    __onMousewheel: function(e, self) {
      this.fire('mouse:wheel', {target: target, e: e, self: self});
    }
  });
})();
