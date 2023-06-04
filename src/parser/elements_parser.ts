// @ts-nocheck
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
import type { FabricObject } from '../shapes/Object/FabricObject';
import { Point } from '../Point';
import { CENTER } from '../constants';

const findTag = (el: HTMLElement) =>
  classRegistry.getSVGClass(el.tagName.toLowerCase().replace('svg:', ''));

const ElementsParser = function (
  elements: HTMLElement[],
  options,
  reviver,
  parsingOptions,
  doc
) {
  this.elements = elements;
  this.options = options;
  this.reviver = reviver;
  this.svgUid = (options && options.svgUid) || 0;
  this.parsingOptions = parsingOptions;
  this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
  this.doc = doc;
};

(function (proto) {
  proto.parse = function (): Promise<FabricObject[]> {
    return Promise.all(
      this.elements.map((element: HTMLElement, i) => {
        element.setAttribute('svgUid', this.svgUid);
        return this.createObject(element);
      })
    );
  };

  proto.createObject = async function (el: HTMLElement): Promise<FabricObject> {
    const klass = findTag(el);
    if (klass) {
      const obj = await klass.fromElement(el, this.options);
      let _options;
      this.resolveGradient(obj, el, 'fill');
      this.resolveGradient(obj, el, 'stroke');
      if (obj instanceof Image && obj._originalElement) {
        _options = obj.parsePreserveAspectRatioAttribute(el);
      }
      removeTransformMatrixForSvgParsing(obj, _options);
      await this.resolveClipPath(obj, el);
      this.reviver && this.reviver(el, obj);
      return obj;
    }
    return null;
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

  proto.resolveClipPath = async function (obj, usingElement) {
    const clipPathElements = this.extractPropertyDefinition(
      obj,
      'clipPath',
      'clipPaths'
    );
    if (clipPathElements) {
      const objTransformInv = invertTransform(obj.calcTransformMatrix());
      // move the clipPath tag as sibling to the real element that is using it
      const clipPathTag = clipPathElements[0].parentNode;
      let clipPathOwner = usingElement;
      while (
        clipPathOwner.parentNode &&
        clipPathOwner.getAttribute('clip-path') !== obj.clipPath
      ) {
        clipPathOwner = clipPathOwner.parentNode;
      }
      clipPathOwner.parentNode.appendChild(clipPathTag);
      const container = await Promise.all(
        clipPathElements.map((clipPathElement) => {
          return findTag(clipPathElement)
            .fromElement(clipPathElement, this.options)
            .then((enlivedClippath) => {
              removeTransformMatrixForSvgParsing(enlivedClippath);
              enlivedClippath.fillRule = enlivedClippath.clipRule;
              return enlivedClippath;
            });
        })
      );
      const clipPath =
        container.length === 1 ? container[0] : new Group(container);
      const gTransform = multiplyTransformMatrices(
        objTransformInv,
        clipPath.calcTransformMatrix()
      );
      if (clipPath.clipPath) {
        await this.resolveClipPath(clipPath, clipPathOwner);
      }
      const { scaleX, scaleY, angle, skewX, translateX, translateY } =
        qrDecompose(gTransform);
      clipPath.set({
        flipX: false,
        flipY: false,
      });
      clipPath.set({
        scaleX,
        scaleY,
        angle,
        skewX,
        skewY: 0,
      });
      clipPath.setPositionByOrigin(
        new Point(translateX, translateY),
        CENTER,
        CENTER
      );
      obj.clipPath = clipPath;
    } else {
      // if clip-path does not resolve to any element, delete the property.
      delete obj.clipPath;
      return;
    }
  };
})(ElementsParser.prototype);

export { ElementsParser };
