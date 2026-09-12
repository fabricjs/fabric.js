const canvas = new fabric.Canvas(canvasEl);
fabric.FabricObject.ownDefaults.transparentCorners = false;
fabric.FabricObject.ownDefaults.objectCaching = false;
const minScale = 1, maxScale = 2;

fabric.loadSVGFromURL('../assets/112.svg').then(({ objects }) => {

    const obj = fabric.util.groupSVGElements(objects);
    canvas.add(obj);
    obj.set({
        left: 80,
        top: 90,
        angle: -30,
        direction: 1,
        shadow: { color: 'rgba(0,0,0,0.3)' },
        objectCaching: false,
    });
    // animate angle back and forth (every 2 second)
    obj.animate({ angle: 30 }, {
      duration: 2000,
      easing: fabric.util.ease.easeOutCubic,
      onChange: () => canvas.renderAndReset(),
      onComplete: function onComplete() {
        obj.animate({
          angle: Math.round(obj.angle) === 30 ? -30 : 30
        }, {
          duration: 2000,
          onComplete: onComplete
        });
      }
    });

    // animate scale and shadow (every second)
    (function animate(dir) {
      obj.animate({
        scaleX: dir ? maxScale : minScale,
        scaleY: dir ? maxScale : minScale,
        'shadow.offsetX': dir ? 20 : 0.00001,
        'shadow.offsetY': dir ? 20 : 0.00001,
      }, {
        easing: fabric.util.ease.easeOutCubic,
        duration: 1000
      });

      obj.animate({
        'shadow.blur': dir ? 20 : 0,
      }, {
        onChange: () => canvas.renderAndReset(),
        onComplete: function() {
          obj.direction = !obj.direction;
          animate(obj.direction);
        },
        easing: fabric.util.ease.easeOutCubic,
        duration: 1000
      });
    })(obj.direction);
});