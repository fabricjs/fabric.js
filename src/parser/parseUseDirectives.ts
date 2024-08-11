import { svgNS } from './constants';
import { getMultipleNodes } from './getMultipleNodes';
import { applyViewboxTransform } from './applyViewboxTransform';
import { parseStyleString } from './parseStyleString';

export function parseUseDirectives(doc: Document) {
  const nodelist = getMultipleNodes(doc, ['use', 'svg:use']);
  const skipAttributes = ['x', 'y', 'xlink:href', 'href', 'transform'];

  for (const useElement of nodelist) {
    const xlink = (
      useElement.getAttribute('xlink:href') ||
      useElement.getAttribute('href') ||
      ''
    ).slice(1);

    if (xlink === '') {
      return;
    }
    const referencedElement = doc.getElementById(xlink);
    if (referencedElement === null) {
      // if we can't find the target of the xlink, consider this use tag bad, similar to no xlink
      return;
    }
    let clonedOriginal = referencedElement.cloneNode(true) as Element;

    // Transform attribute needs to be merged in a particular way
    const x = useElement.getAttribute('x') || 0;
    const y = useElement.getAttribute('y') || 0;
    const transform = useElement.getAttribute('transform') || '';

    const currentTrans = `${transform} ${
      clonedOriginal.getAttribute('transform') || ''
    } translate(${x}, ${y})`;

    applyViewboxTransform(clonedOriginal);

    if (/^svg$/i.test(clonedOriginal.nodeName)) {
      const el3 = clonedOriginal.ownerDocument.createElementNS(svgNS, 'g');
      for (const attr of clonedOriginal.attributes) {
        attr && el3.setAttributeNS(svgNS, attr.nodeName, attr.nodeValue!);
      }
      el3.append(...clonedOriginal.childNodes);
      clonedOriginal = el3;
    }

    for (const attr of useElement.attributes) {
      if (!attr) {
        continue;
      }
      const { nodeName, nodeValue } = attr;
      if (skipAttributes.includes(nodeName)) {
        continue;
      }

      if (
        nodeName === 'style' &&
        clonedOriginal.getAttribute('style') !== null
      ) {
        // when both sides have styles, merge the two styles, with the ref being priority (not use)
        // priority is by feature. an attribute for fill on the original element
        // will overwrite the fill in style or attribute for tha use
        const styleRecord: Record<string, any> = {};
        parseStyleString(nodeValue!, styleRecord);
        parseStyleString(clonedOriginal.getAttribute('style')!, styleRecord);
        const mergedStyles = Object.entries(styleRecord)
          .map((entry) => entry.join(':'))
          .join(';');
        clonedOriginal.setAttribute(nodeName, mergedStyles);
      } else {
        clonedOriginal.setAttribute(nodeName, nodeValue!);
      }
    }

    clonedOriginal.setAttribute('transform', currentTrans);
    clonedOriginal.setAttribute('instantiated_by_use', '1');
    clonedOriginal.removeAttribute('id');
    useElement.parentNode!.replaceChild(clonedOriginal, useElement);
  }
}
