import{getFabricWindow as r}from"../env/index.min.mjs";import{parseSVGDocument as m}from"./parseSVGDocument.min.mjs";function n(n,t,e){const o=(new(r().DOMParser)).parseFromString(n.trim(),"text/xml");return m(o,t,e)}export{n as loadSVGFromString};
//# sourceMappingURL=loadSVGFromString.min.mjs.map
