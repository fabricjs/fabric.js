(function() {

  // -------------------------------
  // Raphael code starts
  // -------------------------------

  // Parts of Raphaël 2.1.0 (MIT licence: http://raphaeljs.com/license.html)
  // Contains eg. bugfixed path2curve() function

  var R = {};
  var has = "hasOwnProperty";
  var Str = String;
  var array = "array";
  var isnan = {
    "NaN": 1,
    "Infinity": 1,
    "-Infinity": 1
  };
  var lowerCase = Str.prototype.toLowerCase;
  var upperCase = Str.prototype.toUpperCase;
  var objectToString = Object.prototype.toString;
  var concat = "concat";
  var split = "split";
  var apply = "apply";
  var math = Math,
    mmax = math.max,
    mmin = math.min,
    abs = math.abs,
    pow = math.pow,
    PI = math.PI,
    round = math.round,
    toFloat = parseFloat,
    toInt = parseInt;
  var p2s = /,?([achlmqrstvxz]),?/gi;
  var pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig;
  var pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig;
  R.is = function (o, type)
  {
    type = lowerCase.call(type);
    if (type == "finite")
    {
      return !isnan[has](+o);
    }
    if (type == "array")
    {
      return o instanceof Array;
    }
    return type == "null" && o === null || type == typeof o && o !== null || type == "object" && o === Object(o) || type == "array" && Array.isArray && Array.isArray(o) || objectToString.call(o).slice(8, -1).toLowerCase() == type
  };

  function clone(obj)
  {
    if (Object(obj) !== obj)
    {
      return obj;
    }
    var res = new obj.constructor;
    for (var key in obj)
    {
      if (obj[has](key))
      {
        res[key] = clone(obj[key]);
      }
    }
    return res;
  }
  R._path2string = function ()
  {
    return this.join(",").replace(p2s, "$1");
  };

  function repush(array, item)
  {
    for (var i = 0, ii = array.length; i < ii; i++)
      if (array[i] === item)
      {
        return array.push(array.splice(i, 1)[0]);
      }
  }
  var pathClone = function (pathArray)
  {
    var res = clone(pathArray);
    res.toString = R._path2string;
    return res;
  };
  var paths = function (ps)
  {
    var p = paths.ps = paths.ps || {};
    if (p[ps]) p[ps].sleep = 100;
    else p[ps] = {sleep: 100};
    setTimeout(function ()
    {
      for (var key in p)
      {
        if (p[has](key) && key != ps)
        {
          p[key].sleep--;
          !p[key].sleep && delete p[key];
        }
      }
    });
    return p[ps];
  };

  function catmullRom2bezier(crp, z)
  {
    var d = [];
    for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2)
    {
      var p = [{x: +crp[i - 2], y: +crp[i - 1]},
        {x: +crp[i], y: +crp[i + 1]},
        {x: +crp[i + 2],y: +crp[i + 3]},
        {x: +crp[i + 4], y: +crp[i + 5]}];
      if (z)
      {
        if (!i)
        {
          p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
        }
        else
        {
          if (iLen - 4 == i)
          {
            p[3] = {x: +crp[0], y: +crp[1]};
          }
          else
          {
            if (iLen - 2 == i)
            {
              p[2] = {x: +crp[0], y: +crp[1]};
              p[3] = {x: +crp[2], y: +crp[3]};
            }
          }
        }
      }
      else
      {
        if (iLen - 4 == i)
        {
          p[3] = p[2];
        }
        else
        {
          if (!i)
          {
            p[0] = {x: +crp[i], y: +crp[i + 1]};
          }
        }
      }
      d.push(["C", (-p[0].x + 6 * p[1].x + p[2].x) / 6, (-p[0].y + 6 * p[1].y + p[2].y) / 6, (p[1].x + 6 * p[2].x - p[3].x) / 6, (p[1].y + 6 * p[2].y - p[3].y) / 6, p[2].x, p[2].y])
    }
    return d
  };
  var parsePathString = R.parsePathString = function (pathString)
  {
    if (!pathString) return null;
    var pth = paths(pathString);
    if (pth.arr) return pathClone(pth.arr)
    var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0}, data = [];
    if (R.is(pathString, array) && R.is(pathString[0], array)) data = pathClone(pathString);
    if (!data.length)
    {
      Str(pathString).replace(pathCommand, function (a, b, c)
      {
        var params = [], name = b.toLowerCase();
        c.replace(pathValues, function (a, b)
        {
          b && params.push(+b);
        });
        if (name == "m" && params.length > 2)
        {
          data.push([b][concat](params.splice(0, 2)));
          name = "l";
          b = b == "m" ? "l" : "L"
        }
        if (name == "r") data.push([b][concat](params))
        else
        {
          while (params.length >= paramCounts[name])
          {
            data.push([b][concat](params.splice(0, paramCounts[name])));
            if (!paramCounts[name]) break;
          }
        }
      })
    }
    data.toString = R._path2string;
    pth.arr = pathClone(data);
    return data;
  };

  function repush(array, item)
  {
    for (var i = 0, ii = array.length; i < ii; i++)
      if (array[i] === item)
      {
        return array.push(array.splice(i, 1)[0]);
      }
  }
  
  var pathToAbsolute = function (pathArray)
  {
    var pth = paths(pathArray);
    if (pth.abs) return pathClone(pth.abs)
    if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) 
      pathArray = R.parsePathString(pathArray)
    if (!pathArray || !pathArray.length) return [["M", 0, 0]];
    var res = [], x = 0, y = 0, mx = 0, my = 0, start = 0;
    if (pathArray[0][0] == "M")
    {
      x = +pathArray[0][1];
      y = +pathArray[0][2];
      mx = x;
      my = y;
      start++;
      res[0] = ["M", x, y];
    }
    var crz = pathArray.length == 3 && pathArray[0][0] == "M" && pathArray[1][0].toUpperCase() == "R" && pathArray[2][0].toUpperCase() == "Z";
    for (var r, pa, i = start, ii = pathArray.length; i < ii; i++)
    {
      res.push(r = []);
      pa = pathArray[i];
      if (pa[0] != upperCase.call(pa[0]))
      {
        r[0] = upperCase.call(pa[0]);
        switch (r[0])
        {
        case "A":
          r[1] = pa[1];
          r[2] = pa[2];
          r[3] = pa[3];
          r[4] = pa[4];
          r[5] = pa[5];
          r[6] = +(pa[6] + x);
          r[7] = +(pa[7] + y);
          break;
        case "V":
          r[1] = +pa[1] + y;
          break;
        case "H":
          r[1] = +pa[1] + x;
          break;
        case "R":
          var dots = [x, y][concat](pa.slice(1));
          for (var j = 2, jj = dots.length; j < jj; j++)
          {
            dots[j] = +dots[j] + x;
            dots[++j] = +dots[j] + y
          }
          res.pop();
          res = res[concat](catmullRom2bezier(dots, crz));
          break;
        case "M":
          mx = +pa[1] + x;
          my = +pa[2] + y;
        default:
          for (j = 1, jj = pa.length; j < jj; j++)
            r[j] = +pa[j] + (j % 2 ? x : y)
        }
      }
      else
      {
        if (pa[0] == "R")
        {
          dots = [x, y][concat](pa.slice(1));
          res.pop();
          res = res[concat](catmullRom2bezier(dots, crz));
          r = ["R"][concat](pa.slice(-2));
        }
        else
        {
          for (var k = 0, kk = pa.length; k < kk; k++)
            r[k] = pa[k]
        }
      }
      switch (r[0])
      {
      case "Z":
        x = mx;
        y = my;
        break;
      case "H":
        x = r[1];
        break;
      case "V":
        y = r[1];
        break;
      case "M":
        mx = r[r.length - 2];
        my = r[r.length - 1];
      default:
        x = r[r.length - 2];
        y = r[r.length - 1];
      }
    }
    res.toString = R._path2string;
    pth.abs = pathClone(res);
    return res;
  };

  function cacher(f, scope, postprocessor)
  {
    function newf()
    {
      var arg = Array.prototype.slice.call(arguments, 0),
        args = arg.join("\u2400"),
        cache = newf.cache = newf.cache || {}, count = newf.count = newf.count || [];
      if (cache.hasOwnProperty(args))
      {
        for (var i = 0, ii = count.length; i < ii; i++)
          if (count[i] === args)
          {
            count.push(count.splice(i, 1)[0]);
          }
        return postprocessor ? postprocessor(cache[args]) : cache[args];
      }
      count.length >= 1E3 && delete cache[count.shift()];
      count.push(args);
      cache[args] = f.apply(scope, arg);
      return postprocessor ? postprocessor(cache[args]) : cache[args];
    }
    return newf;
  }

  var l2c = function (x1, y1, x2, y2)
  {
    return [x1, y1, x2, y2, x2, y2];
  },
  q2c = function (x1, y1, ax, ay, x2, y2)
  {
    var _13 = 1 / 3, _23 = 2 / 3;
    return [_13 * x1 + _23 * ax, _13 * y1 + _23 * ay, _13 * x2 + _23 * ax, _13 * y2 + _23 * ay, x2, y2]
  },
  a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive)
  {
    var _120 = PI * 120 / 180, rad = PI / 180 * (+angle || 0), res = [], xy,
    rotate = cacher(function (x, y, rad)
    {
      var X = x * Math.cos(rad) - y * Math.sin(rad),
          Y = x * Math.sin(rad) + y * Math.cos(rad);
      return {x: X, y: Y};
    });
    if (!recursive)
    {
      xy = rotate(x1, y1, -rad);
      x1 = xy.x;
      y1 = xy.y;
      xy = rotate(x2, y2, -rad);
      x2 = xy.x;
      y2 = xy.y;
      var cos = Math.cos(PI / 180 * angle), sin = Math.sin(PI / 180 * angle),
          x = (x1 - x2) / 2, y = (y1 - y2) / 2;
      var h = x * x / (rx * rx) + y * y / (ry * ry);
      if (h > 1)
      {
        h = Math.sqrt(h);
        rx = h * rx;
        ry = h * ry;
      }
      var rx2 = rx * rx,
          ry2 = ry * ry,
          k = (large_arc_flag == sweep_flag ? -1 : 1) * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
          cx = k * rx * y / ry + (x1 + x2) / 2,
          cy = k * -ry * x / rx + (y1 + y2) / 2,
          f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
          f2 = Math.asin(((y2 - cy) / ry).toFixed(9));
      f1 = x1 < cx ? PI - f1 : f1;
      f2 = x2 < cx ? PI - f2 : f2;
      f1 < 0 && (f1 = PI * 2 + f1);
      f2 < 0 && (f2 = PI * 2 + f2);
      if (sweep_flag && f1 > f2)
      {
        f1 = f1 - PI * 2;
      }
      if (!sweep_flag && f2 > f1)
      {
        f2 = f2 - PI * 2;
      }
    }
    else
    {
      f1 = recursive[0];
      f2 = recursive[1];
      cx = recursive[2];
      cy = recursive[3];
    }
    var df = f2 - f1;
    if (Math.abs(df) > _120)
    {
      var f2old = f2, x2old = x2, y2old = y2;
      f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
      x2 = cx + rx * Math.cos(f2);
      y2 = cy + ry * Math.sin(f2);
      res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy])
    }
    df = f2 - f1;
    var c1 = Math.cos(f1),
        s1 = Math.sin(f1),
        c2 = Math.cos(f2),
        s2 = Math.sin(f2),
        t = Math.tan(df / 4),
        hx = 4 / 3 * rx * t,
        hy = 4 / 3 * ry * t,
        m1 = [x1, y1],
        m2 = [x1 + hx * s1, y1 - hy * c1],
        m3 = [x2 + hx * s2, y2 - hy * c2],
        m4 = [x2, y2];
    m2[0] = 2 * m1[0] - m2[0];
    m2[1] = 2 * m1[1] - m2[1];
    if (recursive) return [m2, m3, m4].concat(res);
    else
    {
      res = [m2, m3, m4].concat(res).join().split(",");
      var newres = [];
      for (var i = 0, ii = res.length; i < ii; i++)
        newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x
      return newres
    }
  };

  var path2curve = cacher(function (path, path2)
  {
    var pth = !path2 && paths(path);
    if (!path2 && pth.curve) return pathClone(pth.curve)
    var p = pathToAbsolute(path),
      p2 = path2 && pathToAbsolute(path2),
      attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
      processPath = function (path, d, pcom)
      {
        var nx, ny;
        if (!path)
        {
          return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
        }!(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
        switch (path[0])
        {
        case "M":
          d.X = path[1];
          d.Y = path[2];
          break;
        case "A":
          path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
          break;
        case "S":
          if (pcom == "C" || pcom == "S")
          {
            nx = d.x * 2 - d.bx;
            ny = d.y * 2 - d.by;
          }
          else
          {
            nx = d.x;
            ny = d.y;
          }
          path = ["C", nx, ny][concat](path.slice(1));
          break;
        case "T":
          if (pcom == "Q" || pcom == "T")
          {
            d.qx = d.x * 2 - d.qx;
            d.qy = d.y * 2 - d.qy;
          }
          else
          {
            d.qx = d.x;
            d.qy = d.y;
          }
          path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
          break;
        case "Q":
          d.qx = path[1];
          d.qy = path[2];
          path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
          break;
        case "L":
          path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
          break;
        case "H":
          path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
          break;
        case "V":
          path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
          break;
        case "Z":
          path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
          break
        }
        return path
      },
      fixArc = function (pp, i)
      {
        if (pp[i].length > 7)
        {
          pp[i].shift();
          var pi = pp[i];
          while (pi.length)
          {
            pcoms1[i] = "A";
            p2 && (pcoms2[i] = "A");
            pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
          }
          pp.splice(i, 1);
          ii = mmax(p.length, p2 && p2.length || 0);
        }
      },
      fixM = function (path1, path2, a1, a2, i)
      {
        if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M")
        {
          path2.splice(i, 0, ["M", a2.x, a2.y]);
          a1.bx = 0;
          a1.by = 0;
          a1.x = path1[i][1];
          a1.y = path1[i][2];
          ii = mmax(p.length, p2 && p2.length || 0);
        }
      },
      pcoms1 = [], pcoms2 = [], pfirst = "", pcom = "";
    for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++)
    {
      p[i] && (pfirst = p[i][0]);
      if (pfirst != "C")
      {
        pcoms1[i] = pfirst;
        i && (pcom = pcoms1[i - 1]);
      }
      p[i] = processPath(p[i], attrs, pcom);
      if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C";
      fixArc(p, i);
      if (p2)
      {
        p2[i] && (pfirst = p2[i][0]);
        if (pfirst != "C")
        {
          pcoms2[i] = pfirst;
          i && (pcom = pcoms2[i - 1]);
        }
        p2[i] = processPath(p2[i], attrs2, pcom);
        if (pcoms2[i] != "A" && pfirst == "C") pcoms2[i] = "C"
        fixArc(p2, i);
      }
      fixM(p, p2, attrs, attrs2, i);
      fixM(p2, p, attrs2, attrs, i);
      var seg = p[i], seg2 = p2 && p2[i], seglen = seg.length, seg2len = p2 && seg2.length;
      attrs.x = seg[seglen - 2];
      attrs.y = seg[seglen - 1];
      attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
      attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
      attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
      attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
      attrs2.x = p2 && seg2[seg2len - 2];
      attrs2.y = p2 && seg2[seg2len - 1];
    }
    if (!p2) pth.curve = pathClone(p);
    return p2 ? [p, p2] : p
  }, null, pathClone);

  // -----------------------------
  // Raphael code ends
  // -----------------------------

  var pow = Math.pow,
  sqrt = Math.sqrt,
  min = Math.min,
  max = Math.max;
  abs = Math.abs;
  
  // Returns bounding box of cubic bezier curve.
  // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
  // Original version: NISHIO Hirokazu
  // Modifications: Timo
  function getBoundsOfCurve (x0, y0, x1, y1, x2, y2, x3, y3)
  {
    var tvalues = [], bounds = [new Array(6), new Array(6)],
        a,b,c,t,t1,t2,b2ac,sqrtb2ac;
    for (var i = 0; i < 2; ++i)
    {
      if (i==0)
      {
        b = 6 * x0 - 12 * x1 + 6 * x2;
        a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
        c = 3 * x1 - 3 * x0;
      }
      else
      {
        b = 6 * y0 - 12 * y1 + 6 * y2;
        a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
        c = 3 * y1 - 3 * y0;
      }
      if (abs(a) < 1e-12)
      {
        if (abs(b) < 1e-12) continue;
        t = -c / b;
        if (0 < t && t < 1) tvalues.push(t);
        continue;
      }
      b2ac = b*b - 4 * c * a;
      sqrtb2ac = sqrt(b2ac);
      if (b2ac < 0) continue;
      t1 = (-b + sqrtb2ac) / (2 * a);
      if (0 < t1 && t1 < 1) tvalues.push(t1);
      t2 = (-b - sqrtb2ac) / (2 * a);
      if (0 < t2 && t2 < 1) tvalues.push(t2);
    }
    
    var x, y, j = tvalues.length, jlen = j, mt;
    while(j--)
    {
      t = tvalues[j]; 
      mt = 1-t;
      bounds[0][j] = (mt*mt*mt*x0) + (3*mt*mt*t*x1) + (3*mt*t*t*x2) + (t*t*t*x3);
      bounds[1][j] = (mt*mt*mt*y0) + (3*mt*mt*t*y1) + (3*mt*t*t*y2) + (t*t*t*y3);
    }

    bounds[0][jlen] = x0;
    bounds[1][jlen] = y0;
    bounds[0][jlen+1] = x3;
    bounds[1][jlen+1] = y3;
    bounds[0].length = bounds[1].length = jlen+2;
    
    return {
      left: min.apply(null, bounds[0]),
      top: min.apply(null, bounds[1]),
      right: max.apply(null, bounds[0]),
      bottom: max.apply(null, bounds[1])
    };
  };

  // Returns bounding box of path.
  // path can be array or string
  var getBoundsOfPath = function(path)
  {
    var curve = path2curve(path);
    
    // Calculate the Initial Bounding Box of all curves using start 
    // and end points that are surely on curve.
    // This box is needed to exclude paths that are already inside Initial
    // Bounding Box from bounding box calculations.
    var xbounds = [], ybounds = [], curr, prev, prevlen;
    for (var i = 0; i < curve.length; i++)
    {
      curr = curve[i];
      if (curr[0] == "C")
      {
        if(i==0)
        {
          xbounds.push(0);
          ybounds.push(0);
        }
        else
        {
          prev = curve[i-1];
          prevlen = prev.length;
          xbounds.push(prev[prevlen-2]);
          ybounds.push(prev[prevlen-1]);
        }
        xbounds.push(curr[5]);
        ybounds.push(curr[6]);
      }
    }
    var minx = min.apply(Number.MAX_VALUE, xbounds),
        miny = min.apply(Number.MAX_VALUE, ybounds),
        maxx = max.apply(Number.MIN_VALUE, xbounds),
        maxy = max.apply(Number.MIN_VALUE, ybounds);

    var bounds, s, startX, startY, isC = false;
    for (i = 0, ilen = curve.length; i < ilen; i++)
    {
      var s = curve[i];
      if (s[0] == 'M')
      {
        if (typeof(curve[i+1]) != "undefined" && curve[i+1][0] == "C")
        {
          startX = s[1];
          startY = s[2];
          if (startX < minx) minx = startX;
          if (startX > maxx) maxx = startX;
          if (startY < miny) miny = startY;
          if (startY > maxy) maxy = startY;
        }
      }
      else if (s[0] == 'C')
      {
        isC = true;
        // Exclude curves that are outside Initial Bounding Box
        if (startX < minx || startX > maxx ||
            startY < miny || startY > maxy ||
            s[1] < minx || s[1] > maxx ||
            s[2] < miny || s[2] > maxy ||
            s[3] < minx || s[3] > maxx ||
            s[4] < miny || s[4] > maxy ||
            s[5] < minx || s[5] > maxx ||
            s[6] < miny || s[6] > maxy)
        {
          bounds = getBoundsOfCurve(startX, startY, s[1], s[2], s[3], s[4], s[5], s[6]);
          if (bounds.left < minx) minx = bounds.left;
          if (bounds.right > maxx) maxx = bounds.right;
          if (bounds.top < miny) miny = bounds.top;
          if (bounds.bottom > maxy) maxy = bounds.bottom;
        }
        startX = s[5];
        startY = s[6];
      }
    }
    if (!isC) minx = maxx = miny = maxy = 0;
    return {
      left: minx,
      top: miny,
      right: maxx,
      bottom: maxy,
      width: maxx - minx,
      height: maxy - miny
    };
  };

// Modifies path coordinates by subracting x, y of them.
function normalizePathCoords (obj, x, y)
{
  var path = obj.path;
  var path = pathToAbsolute(path);
  for (var i = 0; i < path.length; i++)
  {
    curr = path[i];
    switch (curr[0])
    {
      case 'M':
      case 'L':
      case 'T':
        curr[1] -= x;
        curr[2] -= y;
        break;
      case 'H':
        curr[1] -= x;
        break;
      case 'V':
        curr[1] -= y;
        break;
      case 'C':
        curr[1] -= x;
        curr[3] -= x;
        curr[5] -= x;
        curr[2] -= y;
        curr[4] -= y;
        curr[6] -= y;
        break;
      case 'S':
      case 'Q':
        curr[1] -= x;
        curr[3] -= x;
        curr[2] -= y;
        curr[4] -= y;
        break;
      case 'A':
        curr[6] -= x;
        curr[7] -= y;
        break;
    }
  }
  obj.path = path;
}

// Export functions
fabric.util.getBoundsOfPath = getBoundsOfPath;
fabric.util.normalizePathCoords = normalizePathCoords;
fabric.util.arc2cubics = a2c;
fabric.util.path2curve = path2curve;
fabric.util.parsePathString = parsePathString;
})();
