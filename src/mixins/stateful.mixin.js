(function() {

  var clone = fabric.util.clone;
  /*
    Depends on `stateProperties`
  */

  function saveProps(origin, destination, props) {
    props.forEach(function(prop) {
      var value = origin[prop];
      if (value instanceof Array) {
        destination[prop] = value.concat();
      }
      else if (value instanceof Object) {
        destination[prop] = clone(value);
      }
      else {
        destination[prop] = value;
      }
    });
  }

  function _isEqual(origValue, currentValue) {
    if (currentValue instanceof Array) {
      if (origValue.length !== currentValue.length) {
        return false
      }
      var _currentValue = currentValue.concat().sort(),
          _origValue = origValue.concat().sort();
      return !_currentValue.some(function(v, i) {
        return v !== _origValue[i];
      });
    }
    else if (currentValue instanceof Object) {
      for (var key in currentValue) {
        if (currentValue.hasOwnProperty(key)) {
          if (!_isEqual(origValue[key], currentValue[key])) {
            return false;
          }
        }
      }
      return true;
    }
    else {
      return origValue === currentValue;
    }
  }


  fabric.util.object.extend(fabric.Object.prototype, /** @lends fabric.Object.prototype */ {

    /**
     * Returns true if object state (one of its state properties) was changed
     * @return {Boolean} true if instance' state has changed since `{@link fabric.Object#saveState}` was called
     */
    hasStateChanged: function() {
      return this.stateProperties.some(function(prop) {
        return !_isEqual(this.originalState[prop], this[prop]);
      }, this);
    },

    /**
     * Saves state of an object
     * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
     * @return {fabric.Object} thisArg
     */
    saveState: function(options) {
      saveProps(this, this.originalState, this.stateProperties);
      if (options && options.stateProperties) {
        saveProps(this, this.originalState, options.stateProperties);
      }

      return this;
    },

    /**
     * Setups state of an object
     * @return {fabric.Object} thisArg
     */
    setupState: function() {
      this.originalState = { };
      this.saveState();
      return this;
    }
  });
})();
