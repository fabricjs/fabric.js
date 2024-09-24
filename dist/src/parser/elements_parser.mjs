import { objectSpread2 as _objectSpread2 } from '../../_virtual/_rollupPluginBabelHelpers.mjs';
import { Gradient } from '../gradient/Gradient.mjs';
import { Group } from '../shapes/Group.mjs';
import { FabricImage } from '../shapes/Image.mjs';
import { classRegistry } from '../ClassRegistry.mjs';
import { invertTransform, multiplyTransformMatrices, qrDecompose } from '../util/misc/matrix.mjs';
import { removeTransformMatrixForSvgParsing } from '../util/transform_matrix_removal.mjs';
import { Point } from '../Point.mjs';
import { FILL, STROKE, CENTER } from '../constants.mjs';
import { getGradientDefs } from './getGradientDefs.mjs';
import { getCSSRules } from './getCSSRules.mjs';
import { getTagName } from './getTagName.mjs';
import { parseTransformAttribute } from './parseTransformAttribute.mjs';

const findTag = el => classRegistry.getSVGClass(getTagName(el).toLowerCase());
class ElementsParser {
  constructor(elements, options, reviver, doc, clipPaths) {
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
    return Promise.all(this.elements.map(element => this.createObject(element)));
  }
  async createObject(el) {
    const klass = findTag(el);
    if (klass) {
      const obj = await klass.fromElement(el, this.options, this.cssRules);
      this.resolveGradient(obj, el, FILL);
      this.resolveGradient(obj, el, STROKE);
      if (obj instanceof FabricImage && obj._originalElement) {
        removeTransformMatrixForSvgParsing(obj, obj.parsePreserveAspectRatioAttribute());
      } else {
        removeTransformMatrixForSvgParsing(obj);
      }
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
      return undefined;
    }
    // verify: can we remove the 'g' flag? and remove lastIndex changes?
    regex.lastIndex = 0;
    // we passed the regex test, so we know is not null;
    const id = regex.exec(value)[1];
    regex.lastIndex = 0;
    // @todo fix this
    return storage[id];
  }
  resolveGradient(obj, el, property) {
    const gradientDef = this.extractPropertyDefinition(obj, property, this.gradientDefs);
    if (gradientDef) {
      const opacityAttr = el.getAttribute(property + '-opacity');
      const gradient = Gradient.fromElement(gradientDef, obj, _objectSpread2(_objectSpread2({}, this.options), {}, {
        opacity: opacityAttr
      }));
      obj.set(property, gradient);
    }
  }

  // TODO: resolveClipPath could be run once per clippath with minor work per object.
  // is a refactor that i m not sure is worth on this code
  async resolveClipPath(obj, usingElement) {
    const clipPathElements = this.extractPropertyDefinition(obj, 'clipPath', this.clipPaths);
    if (clipPathElements) {
      const objTransformInv = invertTransform(obj.calcTransformMatrix());
      const clipPathTag = clipPathElements[0].parentElement;
      let clipPathOwner = usingElement;
      while (clipPathOwner.parentElement && clipPathOwner.getAttribute('clip-path') !== obj.clipPath) {
        clipPathOwner = clipPathOwner.parentElement;
      }
      // move the clipPath tag as sibling to the real element that is using it
      clipPathOwner.parentElement.appendChild(clipPathTag);

      // this multiplication order could be opposite.
      // but i don't have an svg to test it
      // at the first SVG that has a transform on both places and is misplaced
      // try to invert this multiplication order
      const finalTransform = parseTransformAttribute("".concat(clipPathOwner.getAttribute('transform') || '', " ").concat(clipPathTag.getAttribute('originalTransform') || ''));
      clipPathTag.setAttribute('transform', "matrix(".concat(finalTransform.join(','), ")"));
      const container = await Promise.all(clipPathElements.map(clipPathElement => {
        return findTag(clipPathElement).fromElement(clipPathElement, this.options, this.cssRules).then(enlivedClippath => {
          removeTransformMatrixForSvgParsing(enlivedClippath);
          enlivedClippath.fillRule = enlivedClippath.clipRule;
          delete enlivedClippath.clipRule;
          return enlivedClippath;
        });
      }));
      const clipPath = container.length === 1 ? container[0] : new Group(container);
      const gTransform = multiplyTransformMatrices(objTransformInv, clipPath.calcTransformMatrix());
      if (clipPath.clipPath) {
        await this.resolveClipPath(clipPath, clipPathOwner);
      }
      const {
        scaleX,
        scaleY,
        angle,
        skewX,
        translateX,
        translateY
      } = qrDecompose(gTransform);
      clipPath.set({
        flipX: false,
        flipY: false
      });
      clipPath.set({
        scaleX,
        scaleY,
        angle,
        skewX,
        skewY: 0
      });
      clipPath.setPositionByOrigin(new Point(translateX, translateY), CENTER, CENTER);
      obj.clipPath = clipPath;
    } else {
      // if clip-path does not resolve to any element, delete the property.
      delete obj.clipPath;
      return;
    }
  }
}

export { ElementsParser };
//# sourceMappingURL=elements_parser.mjs.map
