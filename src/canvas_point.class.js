(function() {
  
  /*! Adaptation of work of Kevin Lindsey (kevin@kevlindev.com) */
  
  var fabric = this.fabric || (this.fabric = { });

  if (fabric.Point) {    
    console.warn('fabric.Point is already defined');
    return;
  }
  
  function Point(x, y) {
    if (arguments.length > 0) {
      this.init(x, y);
    }
  }
  
  Point.prototype = {
    constructor: Point,
    init: function (x, y) {
      this.x = x;
      this.y = y;
    },
    add: function (that) {
      return new Point(this.x + that.x, this.y + that.y);
    },
    addEquals: function (that) {
      this.x += that.x;
      this.y += that.y;
      return this;
    },
    scalarAdd: function (scalar) {
      return new Point(this.x + scalar, this.y + scalar);
    },
    scalarAddEquals: function (scalar) {
      this.x += scalar;
      this.y += scalar;
      return this;
    },
    subtract: function (that) {
      return new Point(this.x - that.x, this.y - that.y);
    },
    subtractEquals: function (that) {
      this.x -= that.x;
      this.y -= that.y;
      return this;
    },
    scalarSubtract: function (scalar) {
      return new Point(this.x - scalar, this.y - scalar);
    },
    scalarSubtractEquals: function (scalar) {
      this.x -= scalar;
      this.y -= scalar;
      return this;
    },
    multiply: function (scalar) {
      return new Point(this.x * scalar, this.y * scalar);
    },
    multiplyEquals: function (scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    divide: function (scalar) {
      return new Point(this.x / scalar, this.y / scalar);
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
      return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
    },
    distanceFrom: function (that) {
      var dx = this.x - that.x,
          dy = this.y - that.y;
      return Math.sqrt(dx * dx + dy * dy);
    },
    min: function (that) {
      return new Point(Math.min(this.x, that.x), Math.min(this.y, that.y));
    },
    max: function (that) {
      return new Point(Math.max(this.x, that.x), Math.max(this.y, that.y));
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
      var x = this.x,
          y = this.y;
      this.x = that.x;
      this.y = that.y;
      that.x = x;
      that.y = y;
    }
  };
  
  fabric.Point = Point;
  
})();