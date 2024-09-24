function t(t,e){return e.forEach((e=>{Object.getOwnPropertyNames(e.prototype).forEach((r=>{"constructor"!==r&&Object.defineProperty(t.prototype,r,Object.getOwnPropertyDescriptor(e.prototype,r)||Object.create(null))}))})),t}export{t as applyMixins};
//# sourceMappingURL=applyMixins.min.mjs.map
