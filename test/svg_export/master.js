(function() {
  
  for (var __all = document.getElementsByClassName('test-source'), __len = __all.length, __i = 0; __i < __len; __i++) {
    (function(__testSourceEl) {

      var __isAsync = __testSourceEl.className.indexOf('async') > -1;
      var __testMarkup = document.getElementById('test-template')
        .innerHTML.replace('#{code}', __testSourceEl.innerHTML);

      var __dummyEl = document.createElement('div');
      __dummyEl.innerHTML = __testMarkup;

      var __testEl = __dummyEl.getElementsByClassName('test')[0]
      document.getElementById('bd-wrapper').appendChild(__testEl);

      var __sourceEl = __testEl.getElementsByClassName('source')[0];
      var __canvasEl = __testEl.getElementsByClassName('canvas')[0];
      var __svgEl = __testEl.getElementsByClassName('svg')[0];
      var __code = __sourceEl.firstChild.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/, '>').replace('&amp;', '&');
      var canvas = new fabric.StaticCanvas(__canvasEl);
      
      function proceed() {
        __svgEl.innerHTML = canvas.toSVG();
      }
      
      function onShapeLoaded(objects, options) {
        var obj = objects.length === 1 ? objects[0] : new fabric.PathGroup(objects, options);
        var methodName = 'scaleTo' + (obj.width > obj.height ? 'Width' : 'Height');
        var canvasDimension = 300;
        
        obj.set({ left: canvasDimension / 2, top: canvasDimension / 2 });
        obj[methodName](canvasDimension - 20);
        canvas.add(obj);
        canvas.renderAll();
        
        proceed();
      }

      eval(__code);
      
      __svgEl.innerHTML = canvas.toSVG();
      
      __svgEl.onclick = function() {
        console.log(canvas.toSVG());
      };

    })(__all[__i]);
  }
})();