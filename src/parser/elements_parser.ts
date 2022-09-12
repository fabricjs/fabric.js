//@ts-nocheck

import { fabric } from '../../HEADER';
import { registry } from '../Registry';
import {
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
} from '../util/misc/matrix';

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

function resolveSVGKey(el: SVGElement) {
  return el.tagName.replace('svg:', '').toLowerCase();
}

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

  proto.createObject = function (element, index) {
    try {
      const handler = registry.assertSVGHandler({
        key: resolveSVGKey(element),
        element,
      });
      handler(element, this.createCallback(index, element), this.options);
    } catch (err) {
      console.log(err);
      this.checkIfDone();
    }
  };

  proto.createCallback = function (index, el) {
    const _this = this;
    return function (obj) {
      let _options;
      _this.resolveGradient(obj, el, 'fill');
      _this.resolveGradient(obj, el, 'stroke');
      if (obj instanceof fabric.Image && obj._originalElement) {
        _options = obj.parsePreserveAspectRatioAttribute(el);
      }
      obj._removeTransformMatrix(_options);
      _this.resolveClipPath(obj, el);
      _this.reviver && _this.reviver(el, obj);
      _this.instances[index] = obj;
      _this.checkIfDone();
    };
  };

  proto.extractPropertyDefinition = function (obj, property, storage) {
    const value = obj[property],
      regex = this.regexUrl;
    if (!regex.test(value)) {
      return;
    }
    regex.lastIndex = 0;
    const id = regex.exec(value)[1];
    regex.lastIndex = 0;
    return fabric[storage][this.svgUid][id];
  };

  proto.resolveGradient = function (obj, el, property) {
    const gradientDef = this.extractPropertyDefinition(
      obj,
      property,
      'gradientDefs'
    );
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const handler = registry.assertSVGHandler({
        key: 'gradient',
        element: gradientDef,
      });
      const gradient = handler(gradientDef, obj, {
        ...this.options,
        opacity: opacityAttr,
      });
      obj.set(property, gradient);
    }
  };

  proto.createClipPathCallback = function (obj, container) {
    return function (_newObj) {
      _newObj._removeTransformMatrix();
      _newObj.fillRule = _newObj.clipRule;
      container.push(_newObj);
    };
  };

  proto.resolveClipPath = function (obj, usingElement) {
    var clipPath = this.extractPropertyDefinition(obj, 'clipPath', 'clipPaths'),
      element,
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
        const handler = registry.assertSVGHandler({
          key: resolveSVGKey(element),
          element,
        });
        handler(
          element,
          this.createClipPathCallback(obj, container),
          this.options
        );
      }
      if (container.length === 1) {
        clipPath = container[0];
      } else {
        clipPath = new fabric.Group(container);
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
