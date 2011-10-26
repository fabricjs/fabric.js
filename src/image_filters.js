fabric.Image.GrayscaleFilter = fabric.util.createClass({
  
  initialize: function() {
    
  },
  
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data, 
        iLen = imageData.width,
        jLen = imageData.height,
        index, average, i, j;

     for (i = 0; i < iLen; i++) {
       for (j = 0; j < jLen; j++) {

         index = (i * 4) * jLen + (j * 4);
         average = (data[index] + data[index + 1] + data[index + 2]) / 3;

         data[index]     = average;
         data[index + 1] = average;
         data[index + 2] = average;
       }
     }

     context.putImageData(imageData, 0, 0);
  }
});

fabric.Image.RemoveWhiteFilter = fabric.util.createClass({
  
  initialize: function(options) {
    options || (options = { });
    this.threshold = options.threshold || 30;
    this.distance = options.distance || 20;
  },
  
  applyTo: function(canvasEl) {
    var context = canvasEl.getContext('2d'),
        imageData = context.getImageData(0, 0, canvasEl.width, canvasEl.height),
        data = imageData.data,
        threshold = this.threshold,
        distance = this.distance,
        limit = 255 - threshold,
        abs = Math.abs,
        r, g, b;
     
    for (var i = 0, len = data.length; i < len; i += 4) {
      
      r = data[i];
      g = data[i+1];
      b = data[i+2];
          
      if (r > limit && 
          g > limit && 
          b > limit && 
          abs(r-g) < distance && 
          abs(r-b) < distance &&
          abs(g-b) < distance) {

        data[i+3] = 1;
      }
    }
    
    context.putImageData(imageData, 0, 0);
  }
});