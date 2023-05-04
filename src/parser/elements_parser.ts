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
import { FabricObject } from '../shapes/Object/FabricObject';

const findTag = (el) =>
  classRegistry.getSVGClass(el.tagName.toLowerCase().replace('svg:', ''));

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
  proto.parse = (): Promise<any> => {
    return this.createObjects();
  };

  proto.createObjects = (): Promise<any>[] => {
    return Promise.all(
      this.elements.map((element, i) => {
        element.setAttribute('svgUid', this.svgUid);
        return this.createObject(element, i);
      })
    );
  };

  proto.createObject = function (el): Promise<FabricObject> {
    const klass = findTag(el);
    if (klass && klass.fromElement) {
      return klass
        .fromElement(el, this.options)
        .then((obj) => {
          let _options;
          this.resolveGradient(obj, el, 'fill');
          this.resolveGradient(obj, el, 'stroke');
          if (obj instanceof Image && obj._originalElement) {
            _options = obj.parsePreserveAspectRatioAttribute(el);
          }
          removeTransformMatrixForSvgParsing(obj, _options);
          this.resolveClipPath(obj, el);
          this.reviver && this.reviver(el, obj);
          return obj;
        })
        .catch((err) => console.log(err));
    }
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
})(ElementsParser.prototype);

export { ElementsParser };
