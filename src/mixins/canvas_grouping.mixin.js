(function() {

  var min = Math.min,
      max = Math.max;

  fabric.util.object.extend(fabric.Canvas.prototype, /** @lends fabric.Canvas.prototype */ {

    /**
     * @private
     * @param {Event} e Event object
     * @param {fabric.Object} target
     * @returns {boolean} true if grouping occured
     */
    _handleGrouping: function (e, target) {
      var activeObject = this._activeObject;
      if (!(activeObject && this._isSelectionKeyPressed(e)
        && this.selection && target && target.selectable && !target.onSelect({ e: e }))) {
        return false;
      }
      // avoid multi select when shift click on a corner
      if (activeObject.__corner) {
        return false;
      }
      if (target === activeObject) {
        target = this.targets.pop();
        if (!target || !target.selectable) {
          return false;
        }
      }
      return activeObject && activeObject.type === 'activeSelection' ?
        this._updateActiveSelection(target, e) :
        this._createActiveSelection(target, e);
    },

    /**
     * @private
     * @returns {boolean} true if target was added to active selection
     */
    _updateActiveSelection: function(target, e) {
      var activeSelection = this._activeObject,
          currentActiveObjects = activeSelection._objects.slice(0),
          modified = false;
      // target is about to be removed from active selection
      // we make sure it is a direct child of active selection
      if (target.group === activeSelection) {
        activeSelection.removeWithUpdate(target);
        modified = true;
        this._hoveredTarget = target;
        this._hoveredTargets = this.targets.concat();
        if (activeSelection.size() === 1) {
          // activate last remaining object
          this._setActiveObject(activeSelection.item(0), e);
        }
      }
      //  target is about to be added to active selection
      //  we make sure it is not a already a descendant of active selection
      else if (!target.isDescendantOf(activeSelection)) {
        activeSelection.addWithUpdate(target);
        modified = true;
        this._hoveredTarget = activeSelection;
        this._hoveredTargets = this.targets.concat();
      }
      modified && this._fireSelectionEvents(currentActiveObjects, e);
      return modified;
    },

    /**
     * @private
     * @returns {boolean} true if active selection was created
     */
    _createActiveSelection: function (target, e) {
      var activeObject = this._activeObject;
      //  target is about be join active selection
      //  we make sure objects aren't ancestors of each other in order to avoid recursive selection
      if (target === activeObject || target.isDescendantOf(activeObject) || activeObject.isDescendantOf(target)) {
        return false;
      }
      var currentActives = this.getActiveObjects(), group = this._createGroup(target);
      this._hoveredTarget = group;
      // ISSUE 4115: should we consider subTargets here?
      // this._hoveredTargets = [];
      // this._hoveredTargets = this.targets.concat();
      this._setActiveObject(group, e);
      this._fireSelectionEvents(currentActives, e);
      return true;
    },

    /**
     * @private
     * @param {Object} target
     */
    _createGroup: function (target) {
      var activeObject = this._activeObject;
      var groupObjects = activeObject.isInFrontOf(target) ?
        [activeObject, target] :
        [target, activeObject];
      activeObject.isEditing && activeObject.exitEditing();
      //  handle case: target is nested
      return new fabric.ActiveSelection(groupObjects, {
        canvas: this
      });
    },

    /**
     * @private
     */
    _collectObjects: function(e) {
      var group = [],
          currentObject,
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          selectionX1Y1 = new fabric.Point(min(x1, x2), min(y1, y2)),
          selectionX2Y2 = new fabric.Point(max(x1, x2), max(y1, y2)),
          allowIntersect = !this.selectionFullyContained,
          isClick = x1 === x2 && y1 === y2;
      // we iterate reverse order to collect top first in case of click.
      for (var i = this._objects.length; i--; ) {
        currentObject = this._objects[i];

        if (!currentObject || !currentObject.selectable || !currentObject.visible) {
          continue;
        }

        if ((allowIntersect && currentObject.intersectsWithRect(selectionX1Y1, selectionX2Y2, true)) ||
            currentObject.isContainedWithinRect(selectionX1Y1, selectionX2Y2, true) ||
            (allowIntersect && currentObject.containsPoint(selectionX1Y1, null, true)) ||
            (allowIntersect && currentObject.containsPoint(selectionX2Y2, null, true))
        ) {
          group.push(currentObject);
          // only add one object if it's a click
          if (isClick) {
            break;
          }
        }
      }

      if (group.length > 1) {
        group = group.filter(function(object) {
          return !object.onSelect({ e: e });
        });
      }

      return group;
    },

    /**
     * @private
     * @param {Event} e mouse event
     */
    _groupSelectedObjects: function (e) {

      var objects = this._collectObjects(e),
          aGroup;

      // do not create group for 1 element only
      if (objects.length === 1) {
        this.setActiveObject(objects[0], e);
      }
      else if (objects.length > 1) {
        aGroup = new fabric.ActiveSelection(objects.reverse(), {
          canvas: this
        });
        this.setActiveObject(aGroup, e);
      }
    },

    /**
     * @private
     */
    _maybeGroupObjects: function(e) {
      if (this.selection && this._groupSelector) {
        this._groupSelectedObjects(e);
      }
      this.setCursor(this.defaultCursor);
      // clear selection and current transformation
      this._groupSelector = null;
    }
  });

})();
