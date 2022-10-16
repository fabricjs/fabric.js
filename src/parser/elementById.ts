/**
 * to support IE8 missing getElementById on SVGdocument and on node xmlDOM
 * @param doc
 * @param id
 */
export function elementById(
  doc: Document | HTMLElement,
  id: string
): Element | undefined {
  const el = (doc as Document).getElementById?.(id);
  if (el) return el;
  for (const node of doc.getElementsByTagName('*')) {
    if (id === node.getAttribute('id')) {
      return node;
    }
  }
}
