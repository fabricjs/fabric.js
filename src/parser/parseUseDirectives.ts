import { svgNS } from './constants';
import { elementById } from './elementById';
import { getMultipleNodes } from './getMultipleNodes';
import { applyViewboxTransform } from './applyViewboxTransform';

/**
 * TODO: real docs, not sure what this is actually doing
 * @param doc
 */
export function parseUseDirectives(doc: Document) {
  const nodeList = getMultipleNodes(doc, ['use', 'svg:use']);
  for (const el of nodeList) {
    const xlinkAttribute =
      el.getAttribute('xlink:href') || el.getAttribute('href');

    if (xlinkAttribute === null) {
      return;
    }

    const xlink = xlinkAttribute.slice(1),
      x = el.getAttribute('x') ?? '0',
      y = el.getAttribute('y') ?? '0',
      namespace = svgNS;
    let el2 = elementById(doc, xlink)?.cloneNode(true) as Element,
      currentTrans =
        (el2?.getAttribute('transform') ?? '') +
        ' translate(' +
        x +
        ', ' +
        y +
        ')',
      parentNode: ParentNode;

    applyViewboxTransform(el2);
    if (/^svg$/i.test(el2.nodeName)) {
      const el3 = el2.ownerDocument.createElementNS(namespace, 'g');
      Array<Attr>
        .from(el2.attributes)
        .forEach((attr: Attr) =>
          el3.setAttributeNS(namespace, attr.nodeName, attr.nodeValue ?? '')
        );
      // el2.firstChild != null
      while (el2.firstChild) {
        el3.appendChild(el2.firstChild);
      }
      el2 = el3;
    }

    for (let j = 0, attrs = el.attributes, len = attrs.length; j < len; j++) {
      const attr = attrs.item(j);
      if (
        attr?.nodeName === 'x' ||
        attr?.nodeName === 'y' ||
        attr?.nodeName === 'xlink:href' ||
        attr?.nodeName === 'href'
      ) {
        continue;
      }

      if (attr?.nodeName === 'transform') {
        currentTrans = attr.nodeValue + ' ' + currentTrans;
      } else if (attr) {
        el2.setAttribute(attr.nodeName, attr.nodeValue ?? '');
      }
    }

    el2.setAttribute('transform', currentTrans);
    el2.setAttribute('instantiated_by_use', '1');
    el2.removeAttribute('id');
    if (el.parentNode) {
      parentNode = el.parentNode;
      parentNode.replaceChild(el2, el);
    }
    // TODO: ask about this
    // please tell me if deleting/changing this will affect functionality
    // // some browsers do not shorten nodeList after replaceChild (IE8)
    // if (nodeList.length === oldLength) {
    //   nodeIdx++;
    // }
  }
}
