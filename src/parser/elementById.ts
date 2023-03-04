/**
 * @private
 * to support IE8 missing getElementById on SVGdocument and on node xmlDOM
 */
export function elementById(doc: Document, id: string) {
  let el;
  doc.getElementById && (el = doc.getElementById(id));
  if (el) {
    return el;
  }
  let node;
  let i;
  let len;
  const nodelist = doc.getElementsByTagName('*');
  for (i = 0, len = nodelist.length; i < len; i++) {
    node = nodelist[i];
    if (id === node.getAttribute('id')) {
      return node;
    }
  }
}
