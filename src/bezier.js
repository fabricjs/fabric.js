(function(){
  var global = this;
  
  if (!global.Canvas) global.Canvas = { };  
  if (global.Canvas.Bezier) return;
  
  /*
    Author: Oliver Steele
    Copyright: Copyright 2006 Oliver Steele.  All rights reserved.
    License: MIT License (Open Source)
    Homepage: http://osteele.com/sources/javascript/
    Docs: http://osteele.com/sources/javascript/docs/bezier
    Download: http://osteele.com/sources/javascript/bezier.js
    Example: http://osteele.com/sources/javascript/bezier-demo.html
    Created: 2006-02-20
    Modified: 2006-03-21

    +bezier.js+ is a library for measuring and subdividing arbitrary-order
    Bezier curves.

    Points are represented as <tt>{x: x, y: y}</tt>.

    == Usage
      var bezier = new Bezier[({x:0,y:0}, {x:50,y:50}, {x:100,y:25}]);
      bezier.draw(context);
      var order = bezier.order;
      var left = bezier.split()[0];
      var right = bezier.split()[1];
      var length = bezier.measureLength(bezier);
      var midpoint = bezier.atT(0.5);

    == Notes
    +Bezier+ aliases its argument and caches its metrics.  It won't work
    to modify a point within a +Bezier+; create a new +Bezier+ instead.

    == Related
    Also see {<tt>path.js</tt>}[http://osteele.com/sources/javascript/docs/path].
   */

  // Construct an nth-order bezier, where n == points.length.
  // This aliases its argument.
  function Bezier(points) {
      this.points = points;
      this.order = points.length;
  };

  // Return the Schneider triangle of successive midpoints.
  // The left and right edges are the points of the two
  // Beziers that split this one at the midpoint.
  Bezier.prototype._triangle = function () {
      var upper = this.points;
      var m = [upper];
      // fill the triangle
      for (var i = 1; i < this.order; i++) {
          var lower = [];
          for (var j = 0; j < this.order - i; j++) {
              var c0 = upper[j];
              var c1 = upper[j+1];
              lower[j] = {x: (c0.x + c1.x)/2,
                          y: (c0.y + c1.y)/2};
          }
          m.push(lower);
          upper = lower;
      }
      return (this._triangle = function () {return m})();
  };

  // Return two shorter-length beziers of the same order whose union is
  // this curve and whose intersection is this curve's parametric
  // midpoint.
  Bezier.prototype.split = function () {
      var m = this._triangle();
      var left = new Array(this.order), right = new Array(this.order);
      for (var i = 0; i < this.order; i++) {
          left[i]  = m[i][0];
          right[i] = m[this.order-1-i][i];
      }
      return [new Bezier(left), new Bezier(right)];
  };

  // Return the parametric midpoint on t.  This isn't generally the
  // length midpoint.
  Bezier.prototype.midpointT = function () {
      return this.atT(.5);
  };

  // Return the coefficients of the polynomials for x and y in t.
  Bezier.prototype.getCoefficients = function() {
  	// This function deals with polynomials, represented as
  	// arrays of coefficients.  p[i] is the coefficient of n^i.

  	// p0, p1 => p0 + (p1 - p0) * n
  	// side-effects (denormalizes) p0, for convienence
  	function interpolate(p0, p1) {
  		p0.push(0);
  		var p = new Array(p0.length);
  		p[0] = p0[0];
  		for (var i = 0; i < p1.length; i++)
  			p[i+1] = p0[i+1] + p1[i] - p0[i];
  		return p;
  	}
  	// folds +interpolate+ across a graph whose fringe is
  	// the polynomial elements of +ns+, and returns its TOP
  	function collapse(ns) {
  		while (ns.length > 1) {
  			var ps = new Array(ns.length-1);
  			for (var i = 0; i < ns.length-1; i++)
  				ps[i] = interpolate(ns[i], ns[i+1]);
  			ns = ps;
  		}
  		return ns[0];
  	}
  	// xps and yps are arrays of polynomials --- concretely realized
  	// as arrays of arrays
  	var xps = [];
  	var yps = [];
  	for (var i = 0, pt; pt = this.points[i++]; ) {
  		xps.push([pt.x]);
  		yps.push([pt.y]);
  	}
  	var result = {xs: collapse(xps), ys: collapse(yps)};
  	return (this.getCoefficients = function() {return result})();
  };

  // Return the point at t along the path.  t is the parametric
  // parameter; it's not a proportion of distance.  This method caches
  // the coefficients for this particular curve as an optimization for
  // repeated calls to atT.  This is good for a fourfold performance
  // improvement in Firefox 1.5.
  Bezier.prototype.atT = function(t) {
      var c = this.getCoefficients();
  	var cx = c.xs, cy = c.ys;
  	// evaluate cx[0] + cx[1]t +cx[2]t^2 ....

  	// optimization: start from the end, to save one
  	// muliplicate per order (we never need an explicit t^n)

  	// optimization: special-case the last element
  	// to save a multiply-add
  	var x = cx[cx.length-1], y = cy[cy.length-1];

  	for (var i = cx.length-1; --i >= 0; ) {
  		x = x*t + cx[i];
  		y = y*t + cy[i];
  	}
  	return {x: x, y: y}
  };

  // Return the length of the path.  This is an approximation to
  // within +tolerance+, which defaults to 1.  (It actually stops
  // subdividing when the length of the polyline is within +tolerance+
  // of the length of the chord.)
  Bezier.prototype.measureLength = function (tolerance) {

    // Return the linear distance between two points.
    function distance(p0, p1) {
        var dx = p1.x - p0.x;
        var dy = p1.y - p0.y;
        return Math.sqrt(dx*dx + dy*dy);
    };

    if (arguments.length < 1) tolerance = 1;
    var sum = 0;
    var queue = [this];
    do {
        var b = queue.pop();
        var points = b.points;
        var chordlen = distance(points[0], points[this.order-1]);
        var polylen = 0;
        for (var i = 0; i < this.order-1; i++)
            polylen += distance(points[i], points[i+1]);
        if (polylen - chordlen <= tolerance)
            sum += polylen;
        else
            queue = queue.concat(b.split());
    } while (queue.length);
    return (this.measureLength = function () { return sum })();
  };

  // Render the Bezier to a WHATWG 2D canvas context.
  Bezier.prototype.draw = function (ctx) {
  	var pts = this.points;
  	ctx.moveTo(pts[0].x, pts[0].y);
  	var fn = Bezier.drawCommands[this.order];
  	if (fn) {
  		var coordinates = [];
  		for (var i = pts.length ? 1 : 0; i < pts.length; i++) {
  			coordinates.push(pts[i].x);
  			coordinates.push(pts[i].y);
  		}
  		fn.apply(ctx, coordinates);
  	} else
  		error("don't know how to draw an order *" + this.order + " bezier");
  };

  // These use wrapper functions as a workaround for Safari.  As of
  // Safari 2.0.3, fn.apply isn't defined on the context primitives.
  Bezier.drawCommands = [
      // 0: will have errored aready on the moveTo
      null,
      // 1:
      // this will have an effect if there's a line thickness or end cap
      function(x,y) {this.lineTo(x,y)},
      // 2:
      function(x,y) {this.lineTo(x,y)},
      // 3:
      function(x1,y1,x2,y2) {this.quadraticCurveTo(x1,y1,x2,y2)},
      // 4:
      function(x1,y1,x2,y2,x3,y3) {this.bezierCurveTo(x1,y1,x2,y2,x3,y3)}
                         ];
  // export
  global.Canvas.Bezier = Bezier;
})();