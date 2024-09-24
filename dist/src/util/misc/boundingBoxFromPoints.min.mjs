const t=t=>{let e=0,o=0,h=0,l=0;for(let n=0,r=t.length;n<r;n++){const{x:r,y:c}=t[n];(r>h||!n)&&(h=r),(r<e||!n)&&(e=r),(c>l||!n)&&(l=c),(c<o||!n)&&(o=c)}return{left:e,top:o,width:h-e,height:l-o}};export{t as makeBoundingBoxFromPoints};
//# sourceMappingURL=boundingBoxFromPoints.min.mjs.map
