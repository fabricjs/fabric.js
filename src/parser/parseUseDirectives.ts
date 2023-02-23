//@ts-nocheck
import { svgNS } from './constants';
import { elementById } from './elementById';
import { getMultipleNodes } from './getMultipleNodes';
import { applyViewboxTransform } from './applyViewboxTransform';

export function parseUseDirectives(doc) {
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
    let el2 = elementById(doc, xlink).cloneNode(true);
    let currentTrans =
      (el2.getAttribute('transform') || '') +
      ' translate(' +
      x +
      ', ' +
      y +
      ')';
    const oldLength = nodelist.length;
    let attr;
    let j;
    let attrs;
    let len;
    const namespace = svgNS;

    applyViewboxTransform(el2);
    if (/^svg$/i.test(el2.nodeName)) {
      const el3 = el2.ownerDocument.createElementNS(namespace, 'g');
      for (j = 0, attrs = el2.attributes, len = attrs.length; j < len; j++) {
        attr = attrs.item(j);
        el3.setAttributeNS(namespace, attr.nodeName, attr.nodeValue);
      }
      // el2.firstChild != null
      while (el2.firstChild) {
        el3.appendChild(el2.firstChild);
      }
      el2 = el3;
    }

    for (j = 0, attrs = el.attributes, len = attrs.length; j < len; j++) {
      attr = attrs.item(j);
      if (
        attr.nodeName === 'x' ||
        attr.nodeName === 'y' ||
        attr.nodeName === 'xlink:href' ||
        attr.nodeName === 'href'
      ) {
        continue;
      }

      if (attr.nodeName === 'transform') {
        currentTrans = attr.nodeValue + ' ' + currentTrans;
      } else {
        el2.setAttribute(attr.nodeName, attr.nodeValue);
      }
    }

    el2.setAttribute('transform', currentTrans);
    el2.setAttribute('instantiated_by_use', '1');
    el2.removeAttribute('id');
    const parentNode = el.parentNode;
    parentNode.replaceChild(el2, el);
    // some browsers do not shorten nodelist after replaceChild (IE8)
    if (nodelist.length === oldLength) {
      i++;
    }
  }
}
