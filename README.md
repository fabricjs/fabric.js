**Fabric.js** is a framework that makes it easy to work with HTML5 canvas element. It is an **interactive object model** on top of canvas element. It is also an **SVG-to-canvas parser**.

### Goals

- Unit tested
- Modular
- Cross-browser
- Fast
- Encapsulated in one object
- No browser sniffing for critical functionality

### Supported browsers

- Firefox 2+
- Safari 3+
- Opera 9.64+
- Chrome 1+

### Building

1. Install [Sprockets](http://github.com/sstephenson/sprockets)

        $ gem install --remote sprockets

2. Build distribution file

        $ sprocketize fabric.js > dist/all.js

3. Create a minified distribution file

        $ java -jar lib/yuicompressor-2.4.2.jar dist/all.js -o dist/all.min.js

### Examples of use

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

### Object Model hierarchy
    
      Canvas.Object
        |
        -- Canvas.Line
        |
        -- Canvas.Circle
        |
        -- Canvas.Ellipse
        |
        -- Canvas.Rect
        |
        -- Canvas.Polyline
        |
        -- Canvas.Polygon
        |
        -- Canvas.Group
        |
        -- Canvas.Text
        |
        -- Canvas.Image
        |
        -- Canvas.Path
             |
             -- Canvas.PathGroup
      
      
      Canvas.util
        |
        -- removeFromArray
        |
        -- degreesToRadians
        |
        -- toFixed
        |
        -- getRandomInt
    
      
      Canvas
        |
        -- parseAttributes
        |
        -- parseElements
        |
        -- parseStyleAttribute
        |
        -- parsePointsAttribute
      
      
      Canvas.Element

      Canvas.Point

      Canvas.Intersection

      Canvas.Color

### Credits

- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/).
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library.
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic.