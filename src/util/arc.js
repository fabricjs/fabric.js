(function() {

  var arcToSegmentsCache = { },
      segmentToBezierCache = { },
      _join = Array.prototype.join,
      argsString;

  // Generous contribution by Raph Levien, from libsvg-0.1.0.tar.gz
  function arcToSegments(x, y, rx, ry, large, sweep, rotateX, ox, oy) {

    argsString = _join.call(arguments);

    if (arcToSegmentsCache[argsString]) {
      return arcToSegmentsCache[argsString];
    }

    var coords = getXYCoords(rotateX, rx, ry, ox, oy, x, y),

        d = (coords.x1 - coords.x0) * (coords.x1 - coords.x0) +
            (coords.y1 - coords.y0) * (coords.y1 - coords.y0),

        sfactorSq = 1 / d - 0.25;

    if (sfactorSq < 0) {
      sfactorSq = 0;
    }

    var sfactor = Math.sqrt(sfactorSq);
    if (sweep === large) {
      sfactor = -sfactor;
    }

    var xc = 0.5 * (coords.x0 + coords.x1) - sfactor * (coords.y1 - coords.y0),
        yc = 0.5 * (coords.y0 + coords.y1) + sfactor * (coords.x1 - coords.x0),
        th0 = Math.atan2(coords.y0 - yc, coords.x0 - xc),
        th1 = Math.atan2(coords.y1 - yc, coords.x1 - xc),
        thArc = th1 - th0;

    if (thArc < 0 && sweep === 1) {
      thArc += 2 * Math.PI;
    }
    else if (thArc > 0 && sweep === 0) {
      thArc -= 2 * Math.PI;
    }

    var segments = Math.ceil(Math.abs(thArc / (Math.PI * 0.5 + 0.001))),
        result = [];

    for (var i = 0; i < segments; i++) {
      var th2 = th0 + i * thArc / segments,
          th3 = th0 + (i + 1) * thArc / segments;

      result[i] = [xc, yc, th2, th3, rx, ry, coords.sinTh, coords.cosTh];
    }

    arcToSegmentsCache[argsString] = result;
    return result;
  }

  function getXYCoords(rotateX, rx, ry, ox, oy, x, y) {

    var th = rotateX * (Math.PI / 180),
        sinTh = Math.sin(th),
        cosTh = Math.cos(th);

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    var px = cosTh * (ox - x) * 0.5 + sinTh * (oy - y) * 0.5,
        py = cosTh * (oy - y) * 0.5 - sinTh * (ox - x) * 0.5,
        pl = (px * px) / (rx * rx) + (py * py) / (ry * ry);

    if (pl > 1) {
      pl = Math.sqrt(pl);
      rx *= pl;
      ry *= pl;
    }

    var a00 = cosTh / rx,
        a01 = sinTh / rx,
        a10 = (-sinTh) / ry,
        a11 = (cosTh) / ry;

    return {
      x0: a00 * ox + a01 * oy,
      y0: a10 * ox + a11 * oy,
      x1: a00 * x + a01 * y,
      y1: a10 * x + a11 * y,
      sinTh: sinTh,
      cosTh: cosTh
    };
  }

  function segmentToBezier(cx, cy, th0, th1, rx, ry, sinTh, cosTh) {
    argsString = _join.call(arguments);

    if (segmentToBezierCache[argsString]) {
      return segmentToBezierCache[argsString];
    }

    var a00 = cosTh * rx,
        a01 = -sinTh * ry,
        a10 = sinTh * rx,
        a11 = cosTh * ry,
        thHalf = 0.5 * (th1 - th0),
        t = (8 / 3) * Math.sin(thHalf * 0.5) *
            Math.sin(thHalf * 0.5) / Math.sin(thHalf),

        x1 = cx + Math.cos(th0) - t * Math.sin(th0),
        y1 = cy + Math.sin(th0) + t * Math.cos(th0),
        x3 = cx + Math.cos(th1),
        y3 = cy + Math.sin(th1),
        x2 = x3 + t * Math.sin(th1),
        y2 = y3 - t * Math.cos(th1);

    segmentToBezierCache[argsString] = [
      a00 * x1 + a01 * y1,      a10 * x1 + a11 * y1,
      a00 * x2 + a01 * y2,      a10 * x2 + a11 * y2,
      a00 * x3 + a01 * y3,      a10 * x3 + a11 * y3
    ];

    return segmentToBezierCache[argsString];
  }

  /**
   * Draws arc
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number} x
   * @param {Number} y
   * @param {Array} coords
   */
  fabric.util.drawArc = function(ctx, x, y, coords) {
    var rx = coords[0],
        ry = coords[1],
        rot = coords[2],
        large = coords[3],
        sweep = coords[4],
        ex = coords[5],
        ey = coords[6],
        segs = arcToSegments(ex, ey, rx, ry, large, sweep, rot, x, y);

    for (var i = 0; i < segs.length; i++) {
      var bez = segmentToBezier.apply(this, segs[i]);
      ctx.bezierCurveTo.apply(ctx, bez);
    }
  };
})();
