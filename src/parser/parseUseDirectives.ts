import { svgNS } from './constants';
import { getMultipleNodes } from './getMultipleNodes';
import { applyViewboxTransform } from './applyViewboxTransform';

export function parseUseDirectives(doc: Document) {
  const nodelist = getMultipleNodes(doc, ['use', 'svg:use']);
  let i = 0;
  while (nodelist.length && i < nodelist.length) {
    const el = nodelist[i],
      xlinkAttribute = el.getAttribute('xlink:href') || el.getAttribute('href');

    if (xlinkAttribute === null) {
      return;
    }

    const xlink = xlinkAttribute.slice(1);
    const x = el.getAttribute('x') || 0;
    const y = el.getAttribute('y') || 0;
    const el2Orig = doc.getElementById(xlink);
    if (el2Orig === null) {
      // if we can't find the target of the xlink, consider this use tag bad, similar to no xlink
      return;
    }
    let el2 = el2Orig.cloneNode(true) as Element;
    let currentTrans =
      (el2.getAttribute('transform') || '') +
      ' translate(' +
      x +
      ', ' +
      y +
      ')';
    const oldLength = nodelist.length;
    const namespace = svgNS;

    applyViewboxTransform(el2);
    if (/^svg$/i.test(el2.nodeName)) {
      const el3 = el2.ownerDocument.createElementNS(namespace, 'g');
      for (
        let j = 0, attrs = el2.attributes, len = attrs.length;
        j < len;
        j++
      ) {
        const attr: Attr | null = attrs.item(j);
        attr && el3.setAttributeNS(namespace, attr.nodeName, attr.nodeValue!);
      }
      // el2.firstChild != null
      while (el2.firstChild) {
        el3.appendChild(el2.firstChild);
      }
      el2 = el3;
    }

    for (let j = 0, attrs = el.attributes, len = attrs.length; j < len; j++) {
      const attr = attrs.item(j);
      if (!attr) {
        continue;
      }
      const { nodeName, nodeValue } = attr;
      if (
        nodeName === 'x' ||
        nodeName === 'y' ||
        nodeName === 'xlink:href' ||
        nodeName === 'href'
      ) {
        continue;
      }

      if (nodeName === 'transform') {
        currentTrans = nodeValue + ' ' + currentTrans;
      } else {
        el2.setAttribute(nodeName, nodeValue!);
      }
    }

    el2.setAttribute('transform', currentTrans);
    el2.setAttribute('instantiated_by_use', '1');
    el2.removeAttribute('id');
    const parentNode = el.parentNode;
    parentNode!.replaceChild(el2, el);
    // some browsers do not shorten nodelist after replaceChild (IE8)
    if (nodelist.length === oldLength) {
      i++;
    }
  }
}
