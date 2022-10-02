/**
 * Helper function
 * @param doc
 * @param nodeNames
 */
export function getMultipleNodes(doc: Document, nodeNames: string[]) {
  let nodeArray = new Array<Element>();
  for (const nodeName of nodeNames) {
    // getElementsByTagName is an ArrayLike (mostly), so we can use Array.slice on it
    nodeArray = nodeArray.concat(
      Array.prototype.slice.call(doc.getElementsByTagName(nodeName))
    );
  }
  return nodeArray;
}
