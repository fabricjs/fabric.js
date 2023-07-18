// @ts-check
import { Gradient } from '../gradient/Gradient';
import { Group } from '../shapes/Group';
import { Image } from '../shapes/Image';
import { classRegistry } from '../ClassRegistry';
import {
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
} from '../util/misc/matrix';
import { removeTransformMatrixForSvgParsing } from '../util/transform_matrix_removal';
import type { FabricObject } from '../shapes/Object/FabricObject';
import { Point } from '../Point';
import { CENTER } from '../constants';
import { getGradientDefs } from './getGradientDefs';
import { getCSSRules } from './getCSSRules';
import type { LoadImageOptions } from '../util';
import type { CSSRules, TSvgReviverCallback } from './typedefs';
import type { ParsedViewboxTransform } from './applyViewboxTransform';

const findTag = (el: Element) =>
  classRegistry.getSVGClass(el.tagName.toLowerCase().replace('svg:', ''));

export class ElementsParser {
  elements: Element[];
  options: LoadImageOptions & ParsedViewboxTransform;
  reviver: TSvgReviverCallback | undefined;
  regexUrl: RegExp;
  doc: Document;
  clipPaths: Record<string, Element[]>;
  gradientDefs: Record<string, Element>;
  cssRules: CSSRules;

  constructor(
    elements: Element[],
    options: LoadImageOptions & ParsedViewboxTransform,
    reviver: TSvgReviverCallback | undefined,
    doc: Document,
    clipPaths: Record<string, Element[]>
  ) {
    this.elements = elements;
    this.options = options;
    this.reviver = reviver;
    this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
    this.doc = doc;
    this.clipPaths = clipPaths;
    this.gradientDefs = getGradientDefs(doc);
    this.cssRules = getCSSRules(doc);
  }

  parse() {
    return Promise.all(
      this.elements.map((element) => {
        return this.createObject(element);
      })
    );
  }

  async createObject(el: Element): Promise<FabricObject | null> {
    const klass = findTag(el);
    if (klass) {
      const obj = await klass.fromElement(el, this.options, this.cssRules);
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
  }

  extractPropertyDefinition(obj, property, storage) {
    const value = obj[property],
      regex = this.regexUrl;
    if (!regex.test(value)) {
      return;
    }
    regex.lastIndex = 0;
    const id = regex.exec(value)[1];
    regex.lastIndex = 0;
    // @todo fix this
    return storage[id];
  }

  resolveGradient(obj, el, property) {
    const gradientDef = this.extractPropertyDefinition(
      obj,
      property,
      this.gradientDefs
    );
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const gradient = Gradient.fromElement(gradientDef, obj, {
        ...this.options,
        opacity: opacityAttr,
      });
      obj.set(property, gradient);
    }
  }

  async resolveClipPath(obj, usingElement) {
    const clipPathElements = this.extractPropertyDefinition(
      obj,
      'clipPath',
      this.clipPaths
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
            .fromElement(clipPathElement, this.options, this.cssRules)
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
  }
}
