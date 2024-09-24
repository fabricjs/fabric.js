const t=(t,e,r,a)=>{const n=2*(a=Math.round(a))+1,{data:o}=t.getImageData(e-a,r-a,n,n);for(let t=3;t<o.length;t+=4){if(o[t]>0)return!1}return!0};export{t as isTransparent};
//# sourceMappingURL=isTransparent.min.mjs.map
