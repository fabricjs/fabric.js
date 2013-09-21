(function() {

  fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {

    /**
     * Method that defines actions when an Event.js wheel event is detected.
     *
     * @param e Event object by Event.js
     * @param self Event proxy object by Event.js
     */
    __onMouseWheel: function(e, self) {
      this.fire('mouse:wheel', {e: e, self: self});
    }
  });
})();
