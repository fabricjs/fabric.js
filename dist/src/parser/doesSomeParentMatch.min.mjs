import{selectorMatches as e}from"./selectorMatches.min.mjs";function t(t,n){let r,o=!0;for(;t.parentElement&&1===t.parentElement.nodeType&&n.length;)o&&(r=n.pop()),t=t.parentElement,o=e(t,r);return 0===n.length}export{t as doesSomeParentMatch};
//# sourceMappingURL=doesSomeParentMatch.min.mjs.map
