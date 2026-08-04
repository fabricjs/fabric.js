const canvas = new fabric.Canvas(canvasEl);

fabric.FabricObject.ownDefaults.originX = 'center';
fabric.FabricObject.ownDefaults.originY = 'center';
fabric.FabricObject.ownDefaults.transparentCorners = false;
delete fabric.FabricObject.ownDefaults.objectCaching;
delete fabric.BaseFabricObject.ownDefaults.objectCaching;
fabric.BaseFabricObject.prototype.objectCaching = true;

function animate(obj) {
    obj.animate({ angle: 360 }, {
        duration: 3000,
        onComplete: function(){
            obj.angle = 0;
            animate(obj)
        },
        easing: function(t, b, c, d) { return c*t/d + b }
    });
}

fabric.loadSVGFromURL('/site_assets/tiger2.svg').then(({ objects }) => {
    var obj = fabric.util.groupSVGElements(objects);
    obj.scale(0.5);
  
    // load shapes
    for (var i = 1; i < 4; i++) {
      for (var j = 1; j < 6; j++) {
        (function(i, j) {
            obj.clone().then(clone => {
                clone.set({
                    left: i * 200 - 100,
                    top: j * 200 - 100
                });
                canvas.add(clone);
                animate(clone);
            })
        })(i, j);
      }
    }
});





(function render(){
  canvas.requestRenderAll();
  fabric.util.requestAnimFrame(render);
})();

document.getElementById('cache').onclick = () => {
    fabric.BaseFabricObject.prototype.objectCaching = !fabric.BaseFabricObject.prototype.objectCaching;
    canvas.forEachObject(function(obj, i) {
        obj.forEachObject((obj2) => {
            obj2.set('dirty', true);
        })
        obj.set('dirty', true);
    });
};