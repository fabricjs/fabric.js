export function getMultipleNodes(
  doc: Document,
  nodeNames: string[],
): Element[] {
  let nodeName,
    nodeArray: Element[] = [],
    nodeList,
    i,
    len;
  for (i = 0, len = nodeNames.length; i < len; i++) {
    nodeName = nodeNames[i];
    nodeList = doc.getElementsByTagNameNS(
      'http://www.w3.org/2000/svg',
      nodeName,
    );
    nodeArray = nodeArray.concat(Array.from(nodeList));
  }
  return nodeArray;
}
