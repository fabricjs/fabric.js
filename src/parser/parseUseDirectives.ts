import { svgNS } from './constants';
import { elementById } from './elementById';
import { getMultipleNodes } from './getMultipleNodes';
import { applyViewboxTransform } from './applyViewboxTransform';

/**
 * Inlines svg <use> tags by cloning the tag it references and replacing the use with the clone
 * Puts referenced <svg> tags into a group
 * @param doc
 */
export function parseUseDirectives(doc: Document | HTMLElement | SVGElement) {
  for (const node of getMultipleNodes(doc, ['use', 'svg:use'])) {
    const hrefAttribute =
      node.getAttribute('xlink:href') || node.getAttribute('href');

    // ignore this node since it doesn't link to anything
    if (!hrefAttribute) {
      return;
    }

    const xlink = hrefAttribute.slice(1),
      x = node.getAttribute('x') ?? '0',
      y = node.getAttribute('y') ?? '0',
      namespace = svgNS;
    let clonedLinkedEl = elementById(doc, xlink)?.cloneNode(true) as SVGElement,
      currentTrans = `${
        clonedLinkedEl?.getAttribute('transform') ?? ''
      } translate(${x}, ${y})`,
      parentNode: ParentNode;

    applyViewboxTransform(clonedLinkedEl);
    // if the thing we were referencing was another SVG tag (AKA the name of the tag is svg)
    // "replace" the tag with a group <g> if true
    if (/^svg$/i.test(clonedLinkedEl.nodeName)) {
      const group = clonedLinkedEl.ownerDocument.createElementNS(namespace, 'g');
      Array<Attr>
        .from(clonedLinkedEl.attributes)
        .forEach((attr: Attr) =>
          group.setAttributeNS(namespace, attr.nodeName, attr.nodeValue ?? '')
        );
      // put all the children of this element into a group
      for (const child of clonedLinkedEl.children) {
        group.appendChild(child);
      }
      clonedLinkedEl = group;
    }

    for (const attr of node.attributes) {
      if (
        attr?.nodeName === 'x' ||
        attr?.nodeName === 'y' ||
        attr?.nodeName === 'xlink:href' ||
        attr?.nodeName === 'href'
      ) {
        continue;
      }

      if (attr?.nodeName === 'transform') {
        currentTrans = `${attr.nodeValue} ${currentTrans}`;
      } else if (attr) {
        clonedLinkedEl.setAttribute(attr.nodeName, attr.nodeValue ?? '');
      }
    }

    clonedLinkedEl.setAttribute('transform', currentTrans);
    clonedLinkedEl.setAttribute('instantiated_by_use', '1');
    clonedLinkedEl.removeAttribute('id');
    if (node.parentNode) {
      parentNode = node.parentNode;
      parentNode.replaceChild(clonedLinkedEl, node);
    }
    // TODO: ask about this
    // please tell me if deleting/changing this will affect functionality
    // // some browsers do not shorten nodeList after replaceChild (IE8)
    // if (nodeList.length === oldLength) {
    //   nodeIdx++;
    // }
  }
}
