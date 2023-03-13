//@ts-nocheck
import { Gradient } from '../gradient/Gradient';
import { Group } from '../shapes/Group';
import { Image } from '../shapes/Image';
import { classRegistry } from '../ClassRegistry';
import {
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
} from '../util/misc/matrix';
import { storage } from './constants';
import { removeTransformMatrixForSvgParsing } from '../util/transform_matrix_removal';

const ElementsParser = function (
  elements,
  callback,
  options,
  reviver,
  parsingOptions,
  doc
) {
  this.elements = elements;
  this.callback = callback;
  this.options = options;
  this.reviver = reviver;
  this.svgUid = (options && options.svgUid) || 0;
  this.parsingOptions = parsingOptions;
  this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
  this.doc = doc;
};

(function (proto) {
  proto.parse = function () {
    this.instances = new Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects();
  };

  proto.createObjects = function () {
    this.elements.forEach((element, i) => {
      element.setAttribute('svgUid', this.svgUid);
      this.createObject(element, i);
    });
  };

  proto.findTag = function (el) {
    return classRegistry.getSVGClass(
      el.tagName.toLowerCase().replace('svg:', '')
    );
  };

  proto.createObject = function (el, index) {
    const klass = this.findTag(el);
    if (klass && klass.fromElement) {
      try {
        klass.fromElement(el, this.createCallback(index, el), this.options);
      } catch (err) {
        console.log(err);
      }
    } else {
      this.checkIfDone();
    }
  };

  proto.createCallback = function (index, el) {
    return (obj) => {
      let _options;
      this.resolveGradient(obj, el, 'fill');
      this.resolveGradient(obj, el, 'stroke');
      if (obj instanceof Image && obj._originalElement) {
        _options = obj.parsePreserveAspectRatioAttribute(el);
      }
      removeTransformMatrixForSvgParsing(obj, _options);
      this.resolveClipPath(obj, el);
      this.reviver && this.reviver(el, obj);
      this.instances[index] = obj;
      this.checkIfDone();
    };
  };

  proto.extractPropertyDefinition = function (obj, property, storageType) {
    const value = obj[property],
      regex = this.regexUrl;
    if (!regex.test(value)) {
      return;
    }
    regex.lastIndex = 0;
    const id = regex.exec(value)[1];
    regex.lastIndex = 0;
    // @todo fix this
    return storage[storageType][this.svgUid][id];
  };

  proto.resolveGradient = function (obj, el, property) {
    const gradientDef = this.extractPropertyDefinition(
      obj,
      property,
      'gradientDefs'
    );
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const gradient = Gradient.fromElement(gradientDef, obj, {
        ...this.options,
        opacity: opacityAttr,
      });
      obj.set(property, gradient);
    }
  };

  proto.createClipPathCallback = function (obj, container) {
    return function (_newObj) {
      removeTransformMatrixForSvgParsing(_newObj);
      _newObj.fillRule = _newObj.clipRule;
      container.push(_newObj);
    };
  };

  proto.resolveClipPath = function (obj, usingElement) {
    let clipPath = this.extractPropertyDefinition(obj, 'clipPath', 'clipPaths'),
      element,
      klass,
      objTransformInv,
      container,
      gTransform,
      options;
    if (clipPath) {
      container = [];
      objTransformInv = invertTransform(obj.calcTransformMatrix());
      // move the clipPath tag as sibling to the real element that is using it
      const clipPathTag = clipPath[0].parentNode;
      let clipPathOwner = usingElement;
      while (
        clipPathOwner.parentNode &&
        clipPathOwner.getAttribute('clip-path') !== obj.clipPath
      ) {
        clipPathOwner = clipPathOwner.parentNode;
      }
      clipPathOwner.parentNode.appendChild(clipPathTag);
      for (let i = 0; i < clipPath.length; i++) {
        element = clipPath[i];
        klass = this.findTag(element);
        klass.fromElement(
          element,
          this.createClipPathCallback(obj, container),
          this.options
        );
      }
      if (container.length === 1) {
        clipPath = container[0];
      } else {
        clipPath = new Group(container);
      }
      gTransform = multiplyTransformMatrices(
        objTransformInv,
        clipPath.calcTransformMatrix()
      );
      if (clipPath.clipPath) {
        this.resolveClipPath(clipPath, clipPathOwner);
      }
      const options = qrDecompose(gTransform);
      clipPath.flipX = false;
      clipPath.flipY = false;
      clipPath.set('scaleX', options.scaleX);
      clipPath.set('scaleY', options.scaleY);
      clipPath.angle = options.angle;
      clipPath.skewX = options.skewX;
      clipPath.skewY = 0;
      clipPath.setPositionByOrigin(
        { x: options.translateX, y: options.translateY },
        'center',
        'center'
      );
      obj.clipPath = clipPath;
    } else {
      // if clip-path does not resolve to any element, delete the property.
      delete obj.clipPath;
    }
  };

  proto.checkIfDone = function () {
    if (--this.numElements === 0) {
      this.instances = this.instances.filter(function (el) {
        // eslint-disable-next-line no-eq-null, eqeqeq
        return el != null;
      });
      this.callback(this.instances, this.elements);
    }
  };
})(ElementsParser.prototype);

export { ElementsParser };
