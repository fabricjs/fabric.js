function getMultipleNodes(doc, nodeNames) {
  let nodeName,
    nodeArray = [],
    nodeList,
    i,
    len;
  for (i = 0, len = nodeNames.length; i < len; i++) {
    nodeName = nodeNames[i];
    nodeList = doc.getElementsByTagNameNS('http://www.w3.org/2000/svg', nodeName);
    nodeArray = nodeArray.concat(Array.from(nodeList));
  }
  return nodeArray;
}

export { getMultipleNodes };
//# sourceMappingURL=getMultipleNodes.mjs.map
