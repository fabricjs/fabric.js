import { fabric } from '../../HEADER';
import { capitalize } from '../util/lang_string';
import {
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
} from '../util/misc/matrix';
import { TParsedViewBoxDims } from './applyViewboxTransform';

export interface ElementsParserOptions extends TParsedViewBoxDims {
  svgUid?: number;
}

export interface ElementsParserParsingOptions extends ElementsParserOptions {
  /**
   * see https://developer.mozilla.org/en-US/docs/Web/API/AbortController/signal
   */
  signal?: AbortSignal;
  /**
   * crossOrigin settings
   */
  crossOrigin?: string;
}

export type TElementsParserCallback = (
  obj: typeof fabric.Object,
  container?: Array<typeof fabric.Object>
) => void;
export type TReviver = (el: Element, obj: typeof fabric.Object) => void;

class ElementsParser {
  /**
   * The elements of the SVG
   */
  elements: Element[];
  callback: TElementsParserCallback;
  options: ElementsParserOptions;
  reviver: TReviver;
  svgUid: number;
  parsingOptions: ElementsParserParsingOptions;
  regexUrl: RegExp;
  doc?: Document;

  instances?: Array<typeof fabric.Object>;
  numElements?: number;

  constructor(
    elements: Element[],
    callback: TElementsParserCallback,
    options: ElementsParserOptions,
    reviver: TReviver,
    parsingOptions: ElementsParserParsingOptions,
    doc?: Document
  ) {
    this.elements = elements;
    this.callback = callback;
    this.options = options;
    this.reviver = reviver;
    this.svgUid = (options && options.svgUid) || 0;
    this.parsingOptions = parsingOptions;
    this.regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;
    this.doc = doc;
  }

  parse() {
    this.instances = new Array(this.elements.length);
    this.numElements = this.elements.length;
    this.createObjects();
  }

  createObjects() {
    this.elements.forEach((element, i) => {
      element.setAttribute('svgUid', this.svgUid.toString());
      this.createObject(element, i);
    });
  }

  findTag(el: Element): typeof fabric.Object {
    return fabric[capitalize(el.tagName.replace('svg:', ''))];
  }

  createObject(el: Element, index: number) {
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
  }

  createCallback(index: number, el: Element): TElementsParserCallback {
    return (obj: typeof fabric.Object) => {
      // TODO: type this once obj is fabric.Image is typed
      let _options;
      this.resolveGradient(obj, el, 'fill');
      this.resolveGradient(obj, el, 'stroke');
      if (obj instanceof fabric.Image && obj._originalElement) {
        _options = obj.parsePreserveAspectRatioAttribute(el);
      }
      obj._removeTransformMatrix(_options);
      this.resolveClipPath(obj, el);
      this.reviver && this.reviver(el, obj);
      this.instances && (this.instances[index] = obj);
      this.checkIfDone();
    };
  }

  extractPropertyDefinition(
    obj: typeof fabric.Object,
    property: string,
    storage: string
  ) {
    const value = obj[property],
      regex = this.regexUrl;
    if (!regex.test(value)) {
      return;
    }
    regex.lastIndex = 0;
    const res = regex.exec(value);
    if (!res) return;
    const id = res[1];
    regex.lastIndex = 0;
    return fabric[storage][this.svgUid][id];
  }

  resolveGradient(obj: typeof fabric.Object, el: Element, property: string) {
    const gradientDef = this.extractPropertyDefinition(
      obj,
      property,
      'gradientDefs'
    );
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const gradient = fabric.Gradient.fromElement(gradientDef, obj, {
        ...this.options,
        opacity: opacityAttr,
      });
      obj.set(property, gradient);
    }
  }

  createClipPathCallback(
    obj: typeof fabric.Object,
    container: Array<typeof fabric.Object>
  ) {
    return (_newObj: typeof fabric.Object) => {
      _newObj._removeTransformMatrix();
      _newObj.fillRule = _newObj.clipRule;
      container.push(_newObj);
    };
  }

  resolveClipPath(obj: typeof fabric.Object, usingElement: Element) {
    let clipPath = this.extractPropertyDefinition(obj, 'clipPath', 'clipPaths'),
      element: Element,
      klass,
      objTransformInv,
      container,
      gTransform;
    if (clipPath) {
      container = Array<typeof fabric.Object>();
      objTransformInv = invertTransform(obj.calcTransformMatrix());
      // move the clipPath tag as sibling to the real element that is using it
      const clipPathTag = clipPath[0].parentNode;
      let clipPathOwner = usingElement;
      while (
        clipPathOwner.parentNode &&
        clipPathOwner.getAttribute('clip-path') !== obj.clipPath
      ) {
        clipPathOwner = clipPathOwner.parentNode as Element;
      }
      if (clipPathOwner.parentNode) {
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
      }
    } else {
      // if clip-path does not resolve to any element, delete the property.
      delete obj.clipPath;
    }
  }

  checkIfDone() {
    // TODO: verify validity
    if (!this.numElements || !this.instances) return;
    if (--this.numElements === 0) {
      this.instances = this.instances.filter(function (el) {
        // eslint-disable-next-line no-eq-null, eqeqeq
        return el != null;
      });
      this.callback(this.instances, this.elements);
    }
  }
}

export { ElementsParser };
