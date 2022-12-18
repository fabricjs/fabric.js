import { fabric } from '../../HEADER';
import { Gradient } from '../gradient';
import { Group } from '../shapes/group.class';
import { Image } from '../shapes/image.class';
import { capitalize } from '../util/lang_string';
import {
  invertTransform,
  multiplyTransformMatrices,
  qrDecompose,
} from '../util/misc/matrix';
import { TParsedViewBoxDims } from './applyViewboxTransform';
import { FabricObject } from '../shapes/fabricObject.class';
import { Point } from '../point.class';

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
  obj: FabricObject[],
  container?: Element[]
) => void;

export type TReviver = (el: Element, obj: FabricObject) => void;

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
  doc?: Document;

  instances?: Array<FabricObject>;
  numElements?: number;

  regexUrl = /^url\(['"]?#([^'"]+)['"]?\)/g;

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

  findTag(el: Element): FabricObject {
    return fabric[capitalize(el.tagName.replace('svg:', ''))];
  }

  createObject(el: Element, index: number) {
    const klass = this.findTag(el);
    // TODO: firgure out a better way. maybe modify sig of FabricObject?
    if (klass && (klass as any).fromElement) {
      try {
        (klass as any).fromElement(
          el,
          this.createCallback(index, el),
          this.options
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      this.checkIfDone();
    }
  }

  createCallback(index: number, el: Element): (obj: FabricObject) => void {
    return (obj: FabricObject) => {
      // TODO: type this once obj is fabric.Image is typed
      let _options;
      this.resolveGradient(obj, el, 'fill');
      this.resolveGradient(obj, el, 'stroke');
      if (obj instanceof Image && (obj as any)._originalElement) {
        _options = obj.parsePreserveAspectRatioAttribute();
      }
      obj._removeTransformMatrix(_options);
      this.resolveClipPath(obj, el);
      this.reviver && this.reviver(el, obj);
      this.instances && (this.instances[index] = obj);
      this.checkIfDone();
    };
  }

  extractPropertyDefinition(
    obj: FabricObject,
    property: string,
    storage: string
  ) {
    const value = (obj as any)[property],
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

  resolveGradient(obj: FabricObject, el: Element, property: string) {
    const gradientDef = this.extractPropertyDefinition(
      obj,
      property,
      'gradientDefs'
    );
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const gradient = Gradient.fromElement(gradientDef, obj, {
        ...this.options,
        width: this.options.viewBoxWidth ?? Infinity,
        height: this.options.viewBoxHeight ?? Infinity,
        opacity: opacityAttr,
      });
      obj.set(property, gradient);
    }
  }

  createClipPathCallback(obj: FabricObject, container: Array<FabricObject>) {
    return (_newObj: FabricObject) => {
      (_newObj as any)._removeTransformMatrix();
      _newObj.fillRule = (_newObj as any).clipRule;
      container.push(_newObj);
    };
  }

  resolveClipPath(obj: FabricObject, usingElement: Element) {
    const clipPathSubtree: Element[] = this.extractPropertyDefinition(
      obj,
      'clipPath',
      'clipPaths'
    );
    if (clipPathSubtree) {
      const container = Array<FabricObject>();
      const objTransformInv = invertTransform(obj.calcTransformMatrix());
      // move the clipPath tag as sibling to the real element that is using it
      const clipPathTag = clipPathSubtree[0].parentNode;
      if (!clipPathTag) return; // Temporary
      let clipPathOwner = usingElement;
      while (
        clipPathOwner.parentNode &&
        clipPathOwner.getAttribute('clip-path') !== (obj.clipPath as any)
      ) {
        clipPathOwner = clipPathOwner.parentNode as Element;
      }
      if (clipPathOwner.parentNode) {
        clipPathOwner.parentNode.appendChild(clipPathTag);
        for (const element of clipPathSubtree) {
          const klass = this.findTag(element);
          (klass as any).fromElement(
            element,
            this.createClipPathCallback(obj, container),
            this.options
          );
        }
        let clipPath: FabricObject;
        if (container.length === 1) {
          clipPath = container[0];
        } else {
          clipPath = new Group(container);
        }
        const gTransform = multiplyTransformMatrices(
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
          new Point({ x: options.translateX, y: options.translateY }),
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
