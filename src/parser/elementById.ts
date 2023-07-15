/**
 * @private
 * TODO: verify if this is still needed
 * to support IE8 missing getElementById on SVGdocument and on node xmlDOM
 */
export function elementById(doc: Document, id: string): Element | null {
  if (doc.getElementById) {
    return doc.getElementById(id);
  }
  const nodelist = doc.getElementsByTagName('*');
  for (let i = 0, len = nodelist.length; i < len; i++) {
    const node = nodelist[i];
    if (id === node.getAttribute('id')) {
      return node;
    }
  }
  return null;
}
