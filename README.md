**Fabric.js** is a framework that makes it easy to work with HTML5 canvas element. It is an **interactive object model** on top of canvas element. It is also an **SVG-to-canvas parser**.

<img src="http://kangax.github.com/fabric.js/lib/screenshot.png" style="width:300px;box-shadow:rgba(0,0,0,0.3) 0 0 5px">

Using Fabric.js, you can create and populate objects on canvas; objects like simple geometrical shapes — rectangles, circles, ellipses, polygons, or more complex shapes consisting of hundreds or thousands of simple paths. You can then scale, move, and rotate these objects with the mouse; modify their properties — color, transparency, z-index, etc. You can also manipulate these objects altogether — grouping them with a simple mouse selection.

Contributions are very much welcome!

### Goals

- Unit tested (1050 tests at the moment)
- Modular (~20 small "classes")
- Cross-browser
- Fast
- Encapsulated in one object
- No browser sniffing for critical functionality
- Runs under ES5 strict mode

### Supported browsers

- Firefox 2+
- Safari 3+
- Opera 9.64+
- Chrome (all versions should work)
- IE9+

#### With help of [Explorer Canvas](http://code.google.com/p/explorercanvas/)

- IE8 (incomplete — about 17 failing tests at the moment)
- IE7,6 (incomplete - about 27 failing tests at the moment)

You can [run automated unit tests](http://kangax.github.com/fabric.js/test/unit/suite_runner.html) right in the browser.

### History

Fabric.js started as a foundation for design editor on [printio.ru](http://printio.ru) — interactive online store with ability to create your own designs. The idea was to create [Javascript-based editor](http://printio.ru/ringer_man_tees/new), which would make it easy to manipulate vector shapes and images on T-Shirts. Since performance was one of the most critical requirements, we chose canvas over SVG. While SVG is excellent with static shapes, it's not as performant as canvas when it comes to dynamic manipulation of objects (movement, scaling, rotation, etc.). Fabric.js was heavily inspired by [Ernest Delgado's canvas experiment](http://www.ernestdelgado.com/public-tests/canvasphoto/demo/canvas.html). In fact, code from Ernest's experiment was the foundation of an entire framework. Later, Fabric.js grew into a collection of distinct object types and got an SVG-to-canvas parser.

### Building

1. Install [Sprockets](http://github.com/sstephenson/sprockets)

        $ gem install --remote sprockets

2. Build distribution file  **[~80K minified, ~24K gzipped]**

        $ sprocketize fabric.js > dist/all.js

    - Build distribution with support for text (`fabric.Text`) **[~99K minified, 30K gzipped]**
        
            $ sprocketize fabric+text.js > dist/all.js
        
    - Build distribution with support for serialization (`loadFromJSON`, `clone`, etc.) **[~86K minified, 26K gzipped]**
        
            $ sprocketize fabric+serialization.js > dist/all.js
    
    - Build distribution with support for text AND serialization **[~105K minified, 32K gzipped]**

            $ sprocketize fabric+text+serialization.js > dist/all.js

3. Create a minified distribution file

        # Using YUICompressor
        $ java -jar lib/yuicompressor-2.4.2.jar dist/all.js -o dist/all.min.js
        
        # or Google Closure Compiler
        $ java -jar lib/google_closure_compiler.jar --js dist/all.js --js_output_file dist/all.min.js

4. Optionally, you can build documentation

        $ java -jar lib/jsdoc-toolkit/jsrun.jar lib/jsdoc-toolkit/app/run.js -a -t=lib/jsdoc-toolkit/templates/jsdoc -d=docs fabric.js src/ src/util/

### Demos

- [Demos](http://kangax.github.com/fabric.js/demos/)
- [Kitchensink demo](http://kangax.github.com/fabric.js/demos/kitchensink)
- [Benchmarks](http://kangax.github.com/fabric.js/benchmarks)

### Documentation

Documentation is always available at [http://kangax.github.com/fabric.js/docs/](http://kangax.github.com/fabric.js/docs/). You can also build it locally, following step 4 from the "Building" section of this README.

Also see [presentation from BK.js](http://www.slideshare.net/kangax/fabricjs-building-acanvaslibrarybk) and [presentation from Falsy Values](http://www.slideshare.net/kangax/fabric-falsy-values-8067834) for an overview of fabric.js, how it works, and its features.

### Examples of use

#### Adding red rectangle to canvas
  
    <canvas id="canvas" width="300" height="300"></canvas>
    ...
    var canvas = new fabric.Canvas('canvas');
    
    var rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red'
    });
    
    canvas.add(rect);

### Staying in touch

Follow [@fabric.js](http://twitter.com/fabricjs) or [@kangax](http://twitter.com/kangax) on twitter. Questions, suggestions — [fabric.js on Google Groups](http://groups.google.com/group/fabricjs).

### Credits

- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/).
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library.
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic.

### MIT License

Copyright (c) 2008-2011 Bitsonnet

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.