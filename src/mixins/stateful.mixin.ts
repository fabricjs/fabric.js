// @ts-nocheck
import type { FabricObject } from '../shapes/Object/Object';
import { extend } from '../util/lang_object';

const originalSet = 'stateProperties';

function _isEqual(origValue: any, currentValue: any, firstPass = false) {
  if (origValue === currentValue) {
    // if the objects are identical, return
    return true;
  } else if (Array.isArray(origValue)) {
    if (
      !Array.isArray(currentValue) ||
      origValue.length !== currentValue.length
    ) {
      return false;
    }
    for (let i = 0, len = origValue.length; i < len; i++) {
      if (!_isEqual(origValue[i], currentValue[i])) {
        return false;
      }
    }
    return true;
  } else if (origValue && typeof origValue === 'object') {
    const keys = Object.keys(origValue);
    if (
      !currentValue ||
      typeof currentValue !== 'object' ||
      (!firstPass && keys.length !== Object.keys(currentValue).length)
    ) {
      return false;
    }
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      // since clipPath is in the statefull cache list and the clipPath objects
      // would be iterated as an object, this would lead to possible infinite recursion
      // we do not want to compare those.
      if (key === 'canvas' || key === 'group') {
        continue;
      }
      if (!_isEqual(origValue[key], currentValue[key])) {
        return false;
      }
    }
    return true;
  }
}

type TSaveStateOptions = {
  propertySet: string;
  stateProperties: string[];
};

export class StatefulMixin {
  /**
   * Returns true if object state (one of its state properties) was changed
   * @param {String} [propertySet] optional name for the set of property we want to save
   * @return {Boolean} true if instance' state has changed since `{@link fabric.Object#saveState}` was called
   */
  hasStateChanged(propertySet: string = originalSet): boolean {
    const dashedPropertySet = `_${propertySet}`;
    if (
      Object.keys(this[dashedPropertySet] || {}).length <
      this[propertySet].length
    ) {
      return true;
    }
    return !_isEqual(this[dashedPropertySet], this, true);
  }

  private saveProps(destination: string, props: (keyof FabricObject)[]) {
    const savedProps = props.reduce((o, key) => {
      o[key] = this[key];
      return o;
    }, {});
    extend(this[destination], savedProps, true);
  }

  /**
   * Saves state of an object
   * @param {Object} [options] Object with additional `stateProperties` array to include when saving state
   * @param {string[]} [options.stateProperties] Object with additional `stateProperties` array to include when saving state
   * @param {string} [options.propertySet] name for the property set to save
   * @return {fabric.Object} thisArg
   */
  saveState(
    this: FabricObject,
    { propertySet = originalSet }: TSaveStateOptions = {}
  ): FabricObject {
    const destination = `_${propertySet}`;
    if (!this[destination]) {
      this[destination] = {};
    }
    this.saveProps(destination, this[propertySet]);
    return this;
  }
}
