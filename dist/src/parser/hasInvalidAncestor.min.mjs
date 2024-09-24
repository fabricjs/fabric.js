import{svgInvalidAncestors as t}from"./constants.min.mjs";import{getSvgRegex as e}from"./getSvgRegex.min.mjs";import{getTagName as m}from"./getTagName.min.mjs";const n=e(t);function r(t){let e=t;for(;e&&(e=e.parentElement);)if(e&&e.nodeName&&n.test(m(e))&&!e.getAttribute("instantiated_by_use"))return!0;return!1}export{r as hasInvalidAncestor};
//# sourceMappingURL=hasInvalidAncestor.min.mjs.map
