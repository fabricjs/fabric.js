### What is it?

**Fabric.js** is a framework that makes it easy to work with HTML5 canvas element. It is an **interactive object model** on top of canvas element. It is also an **SVG-to-canvas parser**.

### What are the features?

- Unit tested
- Modular
- Cross-browser
- Fast

### How do I use it?

#### Adding red rectangle to canvas
  
    <canvas id="canvas" width="300" height="300"></canvas>  
    ...
    
    var canvas = new Canvas.Element('canvas');
    
    var rect = new Canvas.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red'
    });
    
    canvas.add(rect);

### Credits

- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/).
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library.
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic.