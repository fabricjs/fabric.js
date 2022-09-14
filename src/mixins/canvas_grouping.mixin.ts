//@ts-nocheck
import { Point } from '../point.class';

(function (global) {
  var fabric = global.fabric,
    min = Math.min,
    max = Math.max;

  fabric.util.object.extend(
    fabric.Canvas.prototype,
    /** @lends fabric.Canvas.prototype */ {
      /**
       * @private
       * @param {Event} e Event object
       * @param {fabric.Object} target
       * @return {Boolean}
       */
      _shouldGroup: function (e, target) {
        var activeObject = this._activeObject;
        // check if an active object exists on canvas and if the user is pressing the `selectionKey` while canvas supports multi selection.
        return (
          !!activeObject &&
          this._isSelectionKeyPressed(e) &&
          this.selection &&
          // on top of that the user also has to hit a target that is selectable.
          !!target &&
          target.selectable &&
          // if all pre-requisite pass, the target is either something different from the current
          // activeObject or if an activeSelection already exists
          // TODO at time of writing why `activeObject.type === 'activeSelection'` matter is unclear.
          // is a very old condition uncertain if still valid.
          (activeObject !== target ||
            activeObject.type === 'activeSelection') &&
          //  make sure `activeObject` and `target` aren't ancestors of each other
          !target.isDescendantOf(activeObject) &&
          !activeObject.isDescendantOf(target) &&
          //  target accepts selection
          !target.onSelect({ e: e })
        );
      },

      /**
       * @private
       * @param {Event} e Event object
       * @param {fabric.Object} target
       */
      _handleGrouping: function (e, target) {
        var activeObject = this._activeObject;
        // avoid multi select when shift click on a corner
        if (activeObject.__corner) {
          return;
        }
        if (target === activeObject) {
          // if it's a group, find target again, using activeGroup objects
          target = this.findTarget(e, true);
          // if even object is not found or we are on activeObjectCorner, bail out
          if (!target || !target.selectable) {
            return;
          }
        }
        if (activeObject && activeObject.type === 'activeSelection') {
          this._updateActiveSelection(target, e);
        } else {
          this._createActiveSelection(target, e);
        }
      },

      /**
       * @private
       */
      _updateActiveSelection: function (target, e) {
        var activeSelection = this._activeObject,
          currentActiveObjects = activeSelection._objects.slice(0);
        if (target.group === activeSelection) {
          activeSelection.remove(target);
          this._hoveredTarget = target;
          this._hoveredTargets = this.targets.concat();
          if (activeSelection.size() === 1) {
            // activate last remaining object
            this._setActiveObject(activeSelection.item(0), e);
          }
        } else {
          activeSelection.add(target);
          this._hoveredTarget = activeSelection;
          this._hoveredTargets = this.targets.concat();
        }
        this._fireSelectionEvents(currentActiveObjects, e);
      },

      /**
       * @private
       */
      _createActiveSelection: function (target, e) {
        var currentActives = this.getActiveObjects(),
          group = this._createGroup(target);
        this._hoveredTarget = group;
        // ISSUE 4115: should we consider subTargets here?
        // this._hoveredTargets = [];
        // this._hoveredTargets = this.targets.concat();
        this._setActiveObject(group, e);
        this._fireSelectionEvents(currentActives, e);
      },

      /**
       * @private
       * @param {Object} target
       * @returns {fabric.ActiveSelection}
       */
      _createGroup: function (target) {
        var activeObject = this._activeObject;
        var groupObjects = target.isInFrontOf(activeObject)
          ? [activeObject, target]
          : [target, activeObject];
        activeObject.isEditing && activeObject.exitEditing();
        //  handle case: target is nested
        return new fabric.ActiveSelection(groupObjects, {
          canvas: this,
        });
      },

      /**
       * @private
       * @param {Event} e mouse event
       */
      _groupSelectedObjects: function (e) {
        var group = this._collectObjects(e),
          aGroup;

        // do not create group for 1 element only
        if (group.length === 1) {
          this.setActiveObject(group[0], e);
        } else if (group.length > 1) {
          aGroup = new fabric.ActiveSelection(group.reverse(), {
            canvas: this,
          });
          this.setActiveObject(aGroup, e);
        }
      },

      /**
       * @private
       */
      _collectObjects: function (e) {
        var group = [],
          currentObject,
          x1 = this._groupSelector.ex,
          y1 = this._groupSelector.ey,
          x2 = x1 + this._groupSelector.left,
          y2 = y1 + this._groupSelector.top,
          selectionX1Y1 = new Point(min(x1, x2), min(y1, y2)),
          selectionX2Y2 = new Point(max(x1, x2), max(y1, y2)),
          allowIntersect = !this.selectionFullyContained,
          isClick = x1 === x2 && y1 === y2;
        // we iterate reverse order to collect top first in case of click.
        for (var i = this._objects.length; i--; ) {
          currentObject = this._objects[i];

          if (
            !currentObject ||
            !currentObject.selectable ||
            !currentObject.visible
          ) {
            continue;
          }

          if (
            (allowIntersect &&
              currentObject.intersectsWithRect(
                selectionX1Y1,
                selectionX2Y2,
                true
              )) ||
            currentObject.isContainedWithinRect(
              selectionX1Y1,
              selectionX2Y2,
              true
            ) ||
            (allowIntersect &&
              currentObject.containsPoint(selectionX1Y1, null, true)) ||
            (allowIntersect &&
              currentObject.containsPoint(selectionX2Y2, null, true))
          ) {
            group.push(currentObject);
            // only add one object if it's a click
            if (isClick) {
              break;
            }
          }
        }

        if (group.length > 1) {
          group = group.filter(function (object) {
            return !object.onSelect({ e: e });
          });
        }

        return group;
      },

      /**
       * @private
       */
      _maybeGroupObjects: function (e) {
        if (this.selection && this._groupSelector) {
          this._groupSelectedObjects(e);
        }
        this.setCursor(this.defaultCursor);
        // clear selection and current transformation
        this._groupSelector = null;
      },
    }
  );
})(typeof exports !== 'undefined' ? exports : window);
