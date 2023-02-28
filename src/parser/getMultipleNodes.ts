//@ts-nocheck

export function getMultipleNodes(doc, nodeNames) {
  let nodeName,
    nodeArray = [],
    nodeList,
    i,
    len;
  for (i = 0, len = nodeNames.length; i < len; i++) {
    nodeName = nodeNames[i];
    nodeList = doc.getElementsByTagName(nodeName);
    nodeArray = nodeArray.concat(Array.prototype.slice.call(nodeList));
  }
  return nodeArray;
}
