fabric.util.object.extend(fabric.Textbox.prototype, /** @lends fabric.Textbox.prototype */ {
  /**
    * Overrides superclass function and adjusts cursor offset value because
    * lines do not necessarily end with a newline in Textbox.
    * @param {Event} e
    * @param {Boolean} isRight
    * @returns {Number}
    */
   getDownCursorOffset: function(e, isRight) {
     return this.callSuper('getDownCursorOffset', e, isRight) - 1;
   },
   /**
    * Overrides superclass function and adjusts cursor offset value because
    * lines do not necessarily end with a newline in Textbox.
    * @param {Event} e
    * @param {Boolean} isRight
    * @returns {Number}
    */
   getUpCursorOffset: function(e, isRight) {
     return this.callSuper('getUpCursorOffset', e, isRight) - 1;
   }
});
