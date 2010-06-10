(function(){
  
  var global = this;
  var Canvas = global.Canvas || (global.Canvas = { });
  
  /*****
  *
  *   The contents of this file were written by Kevin Lindsey
  *   copyright 2002 Kevin Lindsey
  *
  *   This file was compacted by jscompact
  *   A Perl utility written by Kevin Lindsey (kevin@kevlindev.com)
  *
  *****/
  
  function Point2D(x, y) {
    if (arguments.length > 0) {
      this.init(x,y);
    }
  }
  Point2D.prototype = {
    constructor: Point2D,
    init: function (x, y) {
      this.x = x;
      this.y = y;
    },
    add: function (that) {
      return new Point2D(this.x + that.x, this.y + that.y);
    },
    addEquals: function (that) {
      this.x += that.x;
      this.y += that.y;
      return this;
    },
    scalarAdd: function (scalar) {
      return new Point2D(this.x + scalar, this.y + scalar);
    },
    scalarAddEquals: function (scalar) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },
    subtract: function (that) {
      return new Point2D(this.x - that.x, this.y - that.y);
    },
    subtractEquals: function (that) {
      this.x -= that.x;
      this.y -= that.y;
      return this;
    },
    scalarSubtract: function (scalar) {
      return new Point2D(this.x - scalar, this.y - scalar);
    },
    scalarSubtractEquals: function (scalar) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },
    multiply: function (scalar) {
      return new Point2D(this.x * scalar, this.y * scalar);
    },
    multiplyEquals: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    divide: function (scalar) {
      return new Point2D(this.x / scalar, this.y / scalar);
    },
    divideEquals: function (scalar) {
      this.x /= scalar;
      this.y /= scalar;
      return this;
    },
    eq: function (that) {
      return (this.x == that.x && this.y == that.y);
    },
    lt: function (that) {
      return (this.x < that.x && this.y < that.y);
    },
    lte: function (that) {
      return (this.x <= that.x && this.y <= that.y);
    },
    gt: function (that) {
      return (this.x > that.x && this.y > that.y);
    },
    gte: function (that) {
      return (this.x >= that.x && this.y >= that.y);
    },
    lerp: function (that, t) {
      return new Point2D(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    },
    distanceFrom: function (that) {
      var dx = this.x - that.x;
      var dy = this.y - that.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    min: function (that) {
      return new Point2D(Math.min(this.x, that.x), Math.min(this.y, that.y));
    },
    max: function (that) {
      return new Point2D(Math.max(this.x, that.x), Math.max(this.y, that.y));
    },
    toString: function () {
      return this.x + "," + this.y;
    },
    setXY: function (x, y) {
      this.x = x;
      this.y = y;
    },
    setFromPoint: function (that) {
      this.x = that.x;
      this.y = that.y;
    },
    swap: function (that) {
      var x = this.x;
      var y = this.y;
      this.x = that.x;
      this.y = that.y;
      that.x = x;
      that.y = y;
    }
  };
  
  Canvas.Point2D = Point2D;

  function Intersection(status) {
    if (arguments.length > 0) {
      this.init(status);
    }
  }
  Intersection.prototype.init = function (status) {
    this.status = status;
    this.points = [];
  };
  Intersection.prototype.appendPoint = function (point) {
    this.points.push(point);
  };
  Intersection.prototype.appendPoints = function (points) {
    this.points = this.points.concat(points);
  };
  
  Intersection.intersectLineLine = function (a1,a2,b1,b2) {
    var result;
    var ua_t = (b2.x-b1.x) * (a1.y-b1.y) - (b2.y-b1.y) * (a1.x-b1.x);
    var ub_t = (a2.x-a1.x) * (a1.y-b1.y) - (a2.y-a1.y) * (a1.x-b1.x);
    var u_b = (b2.y-b1.y) * (a2.x-a1.x) - (b2.x-b1.x) * (a2.y-a1.y);
    if (u_b != 0) {
      var ua = ua_t/u_b;
      var ub = ub_t/u_b;
      if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
        result = new Intersection("Intersection");
        result.points.push(new Point2D(a1.x + ua * (a2.x - a1.x), a1.y + ua * (a2.y - a1.y)));
      }
      else {
        result = new Intersection("No Intersection");
      }
    }
    else {
      if (ua_t == 0 || ub_t == 0) {
        result = new Intersection("Coincident");
      }
      else {
        result = new Intersection("Parallel");
      }
    }
    return result;
  };
  
  Intersection.intersectLinePolygon = function(a1,a2,points){
    var result = new Intersection("No Intersection");
    var length = points.length;
    for(var i = 0; i < length; i++) {
      var b1 = points[i];
      var b2 = points[(i+1) % length];
      var inter = Intersection.intersectLineLine(a1, a2, b1, b2);
      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = "Intersection";
    }
    return result;
  };
  
  Intersection.intersectPolygonPolygon = function (points1, points2) {
    var result = new Intersection("No Intersection");
    var length = points1.length;
    for(var i = 0; i < length; i++) {
      var a1 = points1[i];
      var a2 = points1[(i+1) % length];
      var inter = Intersection.intersectLinePolygon(a1, a2, points2);
      result.appendPoints(inter.points);
    }
    if (result.points.length > 0) {
      result.status = "Intersection";
    }
    return result;
  };
  
  Intersection.intersectPolygonRectangle = function (points, r1, r2) {
    var min = r1.min(r2);
    var max = r1.max(r2);
    var topRight = new Point2D(max.x, min.y);
    var bottomLeft = new Point2D(min.x, max.y);
    var inter1 = Intersection.intersectLinePolygon(min, topRight, points);
    var inter2 = Intersection.intersectLinePolygon(topRight, max, points);
    var inter3 = Intersection.intersectLinePolygon(max, bottomLeft, points);
    var inter4 = Intersection.intersectLinePolygon(bottomLeft, min, points);
    var result = new Intersection("No Intersection");
    result.appendPoints(inter1.points);
    result.appendPoints(inter2.points);
    result.appendPoints(inter3.points);
    result.appendPoints(inter4.points);
    if (result.points.length > 0) {
      result.status="Intersection";
    }
    return result;
  };
  
  Canvas.Intersection = Intersection;
  
})();