import { svgNS } from './constants';
import { getMultipleNodes } from './getMultipleNodes';
import { applyViewboxTransform } from './applyViewboxTransform';
import { parseStyleString } from './parseStyleString';

export function parseUseDirectives(doc: Document) {
  const nodelist = getMultipleNodes(doc, ['use', 'svg:use']);
  const skipAttributes = ['x', 'y', 'xlink:href', 'href', 'transform'];

  for (const useElement of nodelist) {
    const useAttributes: NamedNodeMap = useElement.attributes;

    const useAttrMap: Record<string, string> = {};
    for (const attr of useAttributes) {
      attr.value && (useAttrMap[attr.name] = attr.value);
    }

    const xlink = (useAttrMap['xlink:href'] || useAttrMap.href || '').slice(1);

    if (xlink === '') {
      return;
    }
    const referencedElement = doc.getElementById(xlink);
    if (referencedElement === null) {
      // if we can't find the target of the xlink, consider this use tag bad, similar to no xlink
      return;
    }
    let clonedOriginal = referencedElement.cloneNode(true) as Element;

    const originalAttributes: NamedNodeMap = clonedOriginal.attributes;

    const originalAttrMap: Record<string, string> = {};
    for (const attr of originalAttributes) {
      attr.value && (originalAttrMap[attr.name] = attr.value);
    }

    // Transform attribute needs to be merged in a particular way
    const { x = 0, y = 0, transform = '' } = useAttrMap;
    const currentTrans = `${transform} ${
      originalAttrMap.transform || ''
    } translate(${x}, ${y})`;

    applyViewboxTransform(clonedOriginal);

    if (/^svg$/i.test(clonedOriginal.nodeName)) {
      // if is an SVG, create a group and apply all the attributes on top of it
      const el3 = clonedOriginal.ownerDocument.createElementNS(svgNS, 'g');
      Object.entries(originalAttrMap).forEach(([name, value]) =>
        el3.setAttributeNS(svgNS, name, value),
      );
      el3.append(...clonedOriginal.childNodes);
      clonedOriginal = el3;
    }

    for (const attr of useAttributes) {
      if (!attr) {
        continue;
      }
      const { name, value } = attr;
      if (skipAttributes.includes(name)) {
        continue;
      }

      if (name === 'style') {
        // when use has a style, merge the two styles, with the ref being priority (not use)
        // priority is by feature. an attribute for fill on the original element
        // will overwrite the fill in style or attribute for tha use
        const styleRecord: Record<string, any> = {};
        parseStyleString(value!, styleRecord);
        // cleanup styleRecord from attributes of original
        Object.entries(originalAttrMap).forEach(([name, value]) => {
          styleRecord[name] = value;
        });
        // now we can put in the style of the original that will overwrite the original attributes
        parseStyleString(originalAttrMap.style || '', styleRecord);
        const mergedStyles = Object.entries(styleRecord)
          .map((entry) => entry.join(':'))
          .join(';');
        clonedOriginal.setAttribute(name, mergedStyles);
      } else {
        // set the attribute from use element only if the original does not have it already
        !originalAttrMap[name] && clonedOriginal.setAttribute(name, value!);
      }
    }

    clonedOriginal.setAttribute('transform', currentTrans);
    clonedOriginal.setAttribute('instantiated_by_use', '1');
    clonedOriginal.removeAttribute('id');
    useElement.parentNode!.replaceChild(clonedOriginal, useElement);
  }
}
