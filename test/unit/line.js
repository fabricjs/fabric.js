(function(){

  var LINE_OBJECT = {
    'version':                  fabric.version,
    'type':                     'line',
    'originX':                  'left',
    'originY':                  'top',
    'left':                     11,
    'top':                      12,
    'width':                    2,
    'height':                   2,
    'fill':                     'rgb(0,0,0)',
    'stroke':                   null,
    'strokeWidth':              1,
    'strokeDashArray':          null,
    'strokeLineCap':            'butt',
    'strokeDashOffset':         0,
    'strokeLineJoin':           'miter',
    'strokeMiterLimit':         4,
    'scaleX':                   1,
    'scaleY':                   1,
    'angle':                    0,
    'flipX':                    false,
    'flipY':                    false,
    'opacity':                  1,
    'x1':                       -1,
    'y1':                       -1,
    'x2':                       1,
    'y2':                       1,
    'shadow':                   null,
    'visible':                  true,
    'clipTo':                   null,
    'backgroundColor':          '',
    'fillRule':                 'nonzero',
    'paintFirst':               'fill',
    'globalCompositeOperation': 'source-over',
    'skewX':                    0,
    'skewY':                    0,
    'transformMatrix':          null
  };

  QUnit.module('fabric.Line');

  QUnit.test('constructor', function(assert) {
    assert.ok(fabric.Line);
    var line = new fabric.Line([10, 11, 20, 21]);

    assert.ok(line instanceof fabric.Line);
    assert.ok(line instanceof fabric.Object);

    assert.equal(line.type, 'line');

    assert.equal(line.get('x1'), 10);
    assert.equal(line.get('y1'), 11);
    assert.equal(line.get('x2'), 20);
    assert.equal(line.get('y2'), 21);

    var lineWithoutPoints = new fabric.Line();

    assert.equal(lineWithoutPoints.get('x1'), 0);
    assert.equal(lineWithoutPoints.get('y1'), 0);
    assert.equal(lineWithoutPoints.get('x2'), 0);
    assert.equal(lineWithoutPoints.get('y2'), 0);
  });

  QUnit.test('complexity', function(assert) {
    var line = new fabric.Line();
    assert.ok(typeof line.complexity === 'function');
  });

  QUnit.test('toSVG', function(assert) {
    var line = new fabric.Line([11, 12, 13, 14]);
    var EXPECTED_SVG = '<g transform=\"matrix(1 0 0 1 12.5 13.5)\"  >\n<line style=\"stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;\"  x1=\"-1\" y1=\"-1\" x2=\"1\" y2=\"1\" />\n</g>\n';
    assert.equal(line.toSVG(), EXPECTED_SVG);
  });

  QUnit.test('toObject', function(assert) {
    var line = new fabric.Line([11, 12, 13, 14]);
    assert.ok(typeof line.toObject === 'function');
    assert.deepEqual(LINE_OBJECT, line.toObject());
  });

  QUnit.test('fromObject', function(assert) {
    var done = assert.async();
    assert.ok(typeof fabric.Line.fromObject === 'function');
    fabric.Line.fromObject(LINE_OBJECT, function(line) {
      assert.ok(line instanceof fabric.Line);
      assert.deepEqual(LINE_OBJECT, line.toObject());
      done();
    });
  });

  QUnit.test('fromElement', function(assert) {
    assert.ok(typeof fabric.Line.fromElement === 'function');

    var lineEl           = fabric.document.createElement('line'),
        x1               = 11,
        y1               = 23,
        x2               = 34,
        y2               = 7,
        stroke           = 'ff5555',
        strokeWidth      = 2,
        strokeDashArray  = [5, 2],
        strokeLineCap    = 'round',
        strokeLineJoin   = 'bevil',
        strokeMiterLimit = 5;

    lineEl.setAttribute('x1', x1);
    lineEl.setAttribute('x2', x2);
    lineEl.setAttribute('y1', y1);
    lineEl.setAttribute('y2', y2);
    lineEl.setAttribute('stroke', stroke);
    lineEl.setAttribute('stroke-width', strokeWidth);
    lineEl.setAttribute('stroke-dasharray', '5, 2');
    lineEl.setAttribute('stroke-linecap', strokeLineCap);
    lineEl.setAttribute('stroke-linejoin', strokeLineJoin);
    lineEl.setAttribute('stroke-miterlimit', strokeMiterLimit);

    fabric.Line.fromElement(lineEl, function(oLine) {
      assert.ok(oLine instanceof fabric.Line);

      assert.equal(oLine.get('x1'), x1);
      assert.equal(oLine.get('y1'), y1);
      assert.equal(oLine.get('x2'), x2);
      assert.equal(oLine.get('y2'), y2);
      assert.equal(oLine.get('stroke'), stroke);
      assert.equal(oLine.get('strokeWidth'), strokeWidth);
      assert.deepEqual(oLine.get('strokeDashArray'), strokeDashArray);
      assert.equal(oLine.get('strokeLineCap'), strokeLineCap);
      assert.equal(oLine.get('strokeLineJoin'), strokeLineJoin);
      assert.equal(oLine.get('strokeMiterLimit'), strokeMiterLimit);

      var lineElWithMissingAttributes = fabric.document.createElement('line');
      lineElWithMissingAttributes.setAttribute('x1', 10);
      lineElWithMissingAttributes.setAttribute('y1', 20);

      fabric.Line.fromElement(lineElWithMissingAttributes, function(oLine2) {
        assert.equal(oLine2.get('x2'), 0, 'missing attributes count as 0 values');
        assert.equal(oLine2.get('y2'), 0, 'missing attributes count as 0 values');
      });
    });
  });

  QUnit.test('straight lines may have 0 width or heigth', function(assert) {
    var line1 = new fabric.Line([10,10,100,10]),
        line2 = new fabric.Line([10,10,10,100]);

    assert.equal(line1.get('height'), 0);
    assert.equal(line2.get('width'), 0);
  });

  QUnit.test('changing x/y coords should update width/height', function(assert) {
    var line = new fabric.Line([50, 50, 100, 100]);

    assert.equal(50, line.width);

    line.set({ x1: 75, y1: 75, x2: 175, y2: 175 });

    assert.equal(100, line.width);
    assert.equal(100, line.height);
  });

  QUnit.test('stroke-width in a style', function(assert) {
    var lineEl = fabric.document.createElement('line');
    lineEl.setAttribute('style', 'stroke-width:4');
    fabric.Line.fromElement(lineEl, function(oLine) {
      assert.ok(4, oLine.strokeWidth);
    });
  });

  // this isn't implemented yet, so disabling for now

  // QUnit.test('x1,y1 less than x2,y2 should work', function(assert) {
  //   var line = new fabric.Line([ 400, 200, 300, 400]);

  //   assert.equal(100, line.width);
  //   assert.equal(200, line.height);
  // });

  var lineCoordsCases = [
    { description: 'default to 0 left and 0 top',
      givenLineArgs: {},
      expectedCoords: {
        left: 0,
        top: 0,
      }
    },
    { description: 'origin defaults to left-top',
      givenLineArgs: {
        points: [0, 0, 11, 22],
      },
      expectedCoords: {
        left: 0,
        top: 0,
      }
    },
    { description: 'equal smallest points when origin is left-top and line not offset',
      givenLineArgs: {
        points: [0, 0, 12.3, 34.5],
        options: {
          originX: 'left',
          originY: 'top',
        },
      },
      expectedCoords: {
        left: 0,
        top: 0,
      }
    },
    { description: 'include offsets for left-top origin',
      givenLineArgs: {
        points: [0 + 33, 0 + 44, 11 + 33, 22 + 44],
        options: {
          originX: 'left',
          originY: 'top',
        },
      },
      expectedCoords: {
        left: 33,
        top: 44,
      }
    },
    { description: 'equal half-dimensions when origin is center and line not offset',
      givenLineArgs: {
        points: [0, 0, 12.3, 34.5],
        options: {
          originX: 'center',
          originY: 'center',
        },
      },
      expectedCoords: {
        left: 0.5 * 12.3,
        top: 0.5 * 34.5,
      }
    },
    { description: 'include offsets for center-center origin',
      givenLineArgs: {
        points: [0 + 9.87, 0 - 4.32, 12.3 + 9.87, 34.5 - 4.32],
        options: {
          originX: 'center',
          originY: 'center',
        },
      },
      expectedCoords: {
        left: (0.5 * 12.3) + 9.87,
        top: (0.5 * 34.5) - 4.32,
      }
    },
    { description: 'equal full dimensions when origin is right-bottom and line not offset',
      givenLineArgs: {
        points: [0, 0, 55, 18],
        options: {
          originX: 'right',
          originY: 'bottom',
        },
      },
      expectedCoords: {
        left: 55,
        top: 18,
      }
    },
    { description: 'include offsets for right-bottom origin',
      givenLineArgs: {
        points: [0 - 3.14, 0 - 1.41, 55 - 3.14, 18 - 1.41],
        options: {
          originX: 'right',
          originY: 'bottom',
        },
      },
      expectedCoords: {
        left: 55 - 3.14,
        top: 18 - 1.41,
      }
    },
    { description: 'arent changed by rotation for left-top origin',
      givenLineArgs: {
        points: [1, 2, 30, 40],
        options: {
          originX: 'left',
          originY: 'top',
          angle: 67,
        }
      },
      expectedCoords: {
        left: 1,
        top: 2,
      }
    },
    { description: 'arent changed by rotation for right-bottom origin',
      givenLineArgs: {
        points: [1, 2, 30, 40],
        options: {
          originX: 'right',
          originY: 'bottom',
          angle: 67,
        }
      },
      expectedCoords: {
        left: 30,
        top: 40,
      }
    },
    { description: 'arent changed by scaling for left-top origin',
      givenLineArgs: {
        points: [1, 2, 30, 40],
        options: {
          originX: 'left',
          originY: 'top',
          scale: 2.1,
        }
      },
      expectedCoords: {
        left: 1,
        top: 2,
      }
    },
    { description: 'arent changed by scaling for right-bottom origin',
      givenLineArgs: {
        points: [1, 2, 30, 40],
        options: {
          originX: 'right',
          originY: 'bottom',
          scale: 1.2,
        }
      },
      expectedCoords: {
        left: 30,
        top: 40,
      }
    },
    { description: 'arent changed by strokeWidth for left-top origin',
      givenLineArgs: {
        points: [31, 41, 59, 26],
        options: {
          originX: 'left',
          originY: 'top',
          stroke: 'black',
          strokeWidth: '53'
        }
      },
      expectedCoords: {
        left: 31,
        top: 26,
      }
    },
    { description: 'arent changed by strokeWidth for center-center origin',
      givenLineArgs: {
        points: [0 + 31, 15 + 26, 28 + 31, 0 + 26],
        options: {
          originX: 'center',
          originY: 'center',
          stroke: 'black',
          strokeWidth: '53'
        }
      },
      expectedCoords: {
        left: (0.5 * 28) + 31,
        top: (0.5 * 15) + 26,
      }
    },
    { description: 'arent changed by strokeWidth for right-bottom origin',
      givenLineArgs: {
        points: [1, 2, 30, 40],
        options: {
          originX: 'right',
          originY: 'bottom',
          stroke: 'black',
          strokeWidth: '53'
        }
      },
      expectedCoords: {
        left: 30,
        top: 40,
      }
    },
    { description: 'left and top options override points',
      givenLineArgs: {
        points: [12, 34, 56, 78],
        options: {
          left: 98,
          top: 76,
        }
      },
      expectedCoords: {
        left: 98,
        top: 76,
      }
    },
    { description: '0 left and 0 top options override points',
      givenLineArgs: {
        points: [12, 34, 56, 78],
        options: {
          left: 0,
          top: 0,
        }
      },
      expectedCoords: {
        left: 0,
        top: 0,
      }
    },
    { description: 'equal x2 and y2 for left-top origin when x1 and y1 are largest and line not offset',
      givenLineArgs: {
        points: [100, 200, 30, 40],
        options: {
          originX: 'left',
          originY: 'top',
        }
      },
      expectedCoords: {
        left: 30,
        top: 40,
      }
    },
    { description: 'equal half-dimensions for center-center origin when x1 and y1 are largest and line not offset',
      givenLineArgs: {
        points: [100, 200, 0, 0],
        options: {
          originX: 'center',
          originY: 'center',
        }
      },
      expectedCoords: {
        left: 0.5 * 100,
        top: 0.5 * 200,
      }
    },
    { description: 'equal x1 and y1 for right-bottom origin when x1 and y1 are largest and line not offset',
      givenLineArgs: {
        points: [100, 200, 0, 0],
        options: {
          originX: 'right',
          originY: 'bottom',
        }
      },
      expectedCoords: {
        left: 100,
        top: 200,
      }
    },
  ];

  lineCoordsCases.forEach(function (c_) {
    QUnit.test('stroke-less line coords ' + c_.description, function(assert) {
      var points = c_.givenLineArgs.points;
      var options = c_.givenLineArgs.options;

      var givenLine = new fabric.Line(
        points,
        options
      );

      assert.equal(givenLine.left, c_.expectedCoords.left);
      assert.equal(givenLine.top, c_.expectedCoords.top);
    });
  });

  var getLeftToOriginXCases = [
    { description: 'is x1 for left origin and x1 lesser than x2',
      givenOrigin: 'left',
      givenPoints: [0, 0, 1, 0],
      expectedLeft: 0,
    },
    { description: 'is x2 for left origin and x1 greater than x2',
      givenOrigin: 'left',
      givenPoints: [1, 0, 0, 0],
      expectedLeft: 0,
    },
    { description: 'includes positive offset for left origin',
      givenOrigin: 'left',
      givenPoints: [0 + 20, 0, 1 + 20, 0],
      expectedLeft: 0 + 20,
    },
    { description: 'includes negative offset for left origin',
      givenOrigin: 'left',
      givenPoints: [0 - 11, 0, 1 - 11, 0],
      expectedLeft: 0 - 11,
    },
    { description: 'is half of x1 for center origin and x1 > x2',
      givenOrigin: 'center',
      givenPoints: [4, 0, 0, 0],
      expectedLeft: 0.5 * 4,
    },
    { description: 'is half of x2 for center origin and x1 < x2',
      givenOrigin: 'center',
      givenPoints: [0, 0, 7, 0],
      expectedLeft: 0.5 * 7,
    },
    { description: 'includes positive offset for center origin',
      givenOrigin: 'center',
      givenPoints: [0 + 39, 0, 7 + 39, 0],
      expectedLeft: (0.5 * 7) + 39,
    },
    { description: 'includes negative offset for center origin',
      givenOrigin: 'center',
      givenPoints: [4 - 13, 0, 0 - 13, 0],
      expectedLeft: (0.5 * 4) - 13,
    },
    { description: 'is x1 for right origin and x1 > x2',
      givenOrigin: 'right',
      givenPoints: [9, 0, 0, 0],
      expectedLeft: 9,
    },
    { description: 'is x2 for right origin and x1 < x2',
      givenOrigin: 'right',
      givenPoints: [0, 0, 6, 0],
      expectedLeft: 6,
    },
    { description: 'includes positive offset for right origin',
      givenOrigin: 'right',
      givenPoints: [0 + 47, 0, 6 + 47, 0],
      expectedLeft: 6 + 47,
    },
    { description: 'includes negative offset for right origin',
      givenOrigin: 'right',
      givenPoints: [9 - 17, 0, 0 - 17, 0],
      expectedLeft: 9 - 17,
    },
  ];

  getLeftToOriginXCases.forEach(function (c_) {
    QUnit.test('Line.getLeftToOriginX() ' + c_.description, function (assert) {
      var line = new fabric.Line(
        c_.givenPoints,
        { originX: c_.givenOrigin }
      );

      assert.equal(line._getLeftToOriginX(), c_.expectedLeft);
    });
  });

  var getTopToOriginYCases = [
    { description: 'is y1 for top origin and y1 lesser than y2',
      givenOrigin: 'top',
      givenPoints: [0, 0, 0, 1],
      expectedTop: 0,
    },
    { description: 'is y2 for top origin and y1 greater than y2',
      givenOrigin: 'top',
      givenPoints: [0, 1, 0, 0],
      expectedTop: 0,
    },
    { description: 'includes positive offset for top origin',
      givenOrigin: 'top',
      givenPoints: [0, 0 + 20, 0, 1 + 20],
      expectedTop: 0 + 20,
    },
    { description: 'includes negative offset for top origin',
      givenOrigin: 'top',
      givenPoints: [0, 0 - 11, 0, 1 - 11],
      expectedTop: 0 - 11,
    },
    { description: 'is half of y1 for center origin and y1 > y2',
      givenOrigin: 'center',
      givenPoints: [0, 4, 0, 0],
      expectedTop: 0.5 * 4,
    },
    { description: 'is half of y2 for center origin and y1 < y2',
      givenOrigin: 'center',
      givenPoints: [0, 0, 0, 7],
      expectedTop: 0.5 * 7,
    },
    { description: 'includes positive offset for center origin',
      givenOrigin: 'center',
      givenPoints: [0, 0 + 39, 0, 7 + 39],
      expectedTop: (0.5 * 7) + 39,
    },
    { description: 'includes negative offset for center origin',
      givenOrigin: 'center',
      givenPoints: [0, 4 - 13, 0, 0 - 13],
      expectedTop: (0.5 * 4) - 13,
    },
    { description: 'is y1 for bottom origin and y1 > y2',
      givenOrigin: 'bottom',
      givenPoints: [0, 9, 0, 0],
      expectedTop: 9,
    },
    { description: 'is y2 for bottom origin and y1 < y2',
      givenOrigin: 'bottom',
      givenPoints: [0, 0, 0, 6],
      expectedTop: 6,
    },
    { description: 'includes positive offset for bottom origin',
      givenOrigin: 'bottom',
      givenPoints: [0, 0 + 47, 0, 6 + 47],
      expectedTop: 6 + 47,
    },
    { description: 'includes negative offset for bottom origin',
      givenOrigin: 'bottom',
      givenPoints: [0, 9 - 17, 0, 0 - 17],
      expectedTop: 9 - 17,
    },
  ];

  getTopToOriginYCases.forEach(function (c_) {
    QUnit.test('Line._getTopToOriginY() ' + c_.description, function (assert) {
      var line = new fabric.Line(
        c_.givenPoints,
        { originY: c_.givenOrigin }
      );

      assert.equal(line._getTopToOriginY(), c_.expectedTop);
    });
  });

})();
