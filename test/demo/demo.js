(function(global) {
  
  "use strict";
  
  function pad(str, length) {
    while (str.length < length) {
      str = '0' + str;
    }
    return str;
   };
  
  var getRandomInt = fabric.util.getRandomInt;
  function getRandomColor() {
    return (
      pad(getRandomInt(0, 255).toString(16), 2) + 
      pad(getRandomInt(0, 255).toString(16), 2) + 
      pad(getRandomInt(0, 255).toString(16), 2)
    );
  }
  
  function getRandomNum(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  var canvas = global.canvas = new fabric.Element('canvas', {
    clipTo: function(canvas) {
      canvas.arc(this.width / 2, this.height / 2, 200, 0, Math.PI * 2, true);
    }
  });
  
  var fpsEl = document.getElementById('fps').firstChild;
  
  canvas.onFpsUpdate = function(fps) {
    fpsEl.nodeValue = 'FPS: ' + fps;
  };
  
  document.getElementById('commands').onclick = function(ev) {
    ev = ev || window.event;
    
    if (ev.preventDefault) {
      ev.preventDefault()
    }
    else if (ev.returnValue) {
      ev.returnValue = false;
    }
    
    var element = ev.target || ev.srcElement;
    if (element.nodeName.toLowerCase() === 'strong') {
      element = element.parentNode;
    }
    
    var className = element.className,
        offset = 50,
        left = fabric.util.getRandomInt(0 + offset, 700 - offset),
        top = fabric.util.getRandomInt(0 + offset, 500 - offset),
        angle = fabric.util.getRandomInt(-20, 40),
        width = fabric.util.getRandomInt(30, 50),
        opacity = (function(min, max){ return Math.random() * (max - min) + min; })(0.5, 1);
    
    switch (className) {
      case 'rect':
        canvas.add(new fabric.Rect({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          width: 50, 
          height: 50, 
          opacity: 0.8 
        }));
        break;
        
      case 'circle':
        canvas.add(new fabric.Circle({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          radius: 50, 
          opacity: 0.8 
        }));
        break;
      
      case 'triangle':
        canvas.add(new fabric.Triangle({ 
          left: left, 
          top: top, 
          fill: '#' + getRandomColor(), 
          width: 50, 
          height: 50, 
          opacity: 0.8 
        }));
        break;
      
      case 'image1':
        fabric.Image.fromURL('assets/pug.jpg', function(image) {
          image.set('left', left).set('top', top).set('angle', angle).scale(getRandomNum(0.1, 0.25)).setCoords();
          canvas.add(image);
        });
        break;
      
      case 'image2':
        fabric.Image.fromURL('assets/logo.png', function(image) {
          image.set('left', left).set('top', top).set('angle', angle).scale(getRandomNum(0.1, 1)).setCoords();
          canvas.add(image);
          updateComplexity();
        });
        break;
      
      case 'shape':
        var id = element.id, match;
        if (match = /\d+$/.exec(id)) {
          canvas.loadSVGFromURL('assets/' + match[0] + '.svg', function(objects, options) {
            
            var loadedObject;
            if (objects.length > 1) {
              loadedObject = new fabric.PathGroup(objects, options);
            }
            else {
              loadedObject = objects[0];
            }
            
            loadedObject
              .set('left', left)
              .set('top', top)
              .set('angle', angle)
              //.set('fill', '#' + getRandomColor())
              .scaleToWidth(300)
              .setCoords();
              
            canvas.add(loadedObject);
            updateComplexity();
            canvas.calcOffset();
          });
        }
        break;
      
      case 'clear':
        if (confirm('Are you sure?')) {
          canvas.clear();
        }
    }
    updateComplexity();
  };
  
  function updateComplexity() {
    setTimeout(function(){
      document.getElementById('complexity').childNodes[1].innerHTML = ' ' + canvas.complexity();
    }, 100);
  }
  
  document.getElementById('execute').onclick = function() {
    var code = document.getElementById('canvas-console').value;
    if (!(/^\s+$/).test(code)) {
      eval(code);
    }
  };
  
  document.getElementById('rasterize').onclick = function() {
    if (!fabric.Element.supports('toDataURL')) {
      alert('This browser doesn\'t provide means to serialize canvas to an image');
    }
    else {
      window.open(canvas.toDataURL('png'));
    }
  };
  
  var removeSelectedEl = document.getElementById('remove-selected');
  removeSelectedEl.onclick = function() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
      canvas.remove(activeObject);
    }
    else if (activeGroup) {
      var objectsInGroup = activeGroup.getObjects();
      canvas.removeActiveGroup();
      objectsInGroup.forEach(function(object) {
        canvas.remove(object);
      });
    }
  };
  
  var supportsInputOfType = function(type) {
    return function() {
      var el = document.createElement('input');
      try {
        el.type = type;
      }
      catch(err) { }
      return el.type === type;
    };
  };
  
  var supportsSlider = supportsInputOfType('range'),
      supportsColorpicker = supportsInputOfType('color');
  
  if (supportsSlider()) {
    (function(){
      var controls = document.getElementById('controls');

      var sliderLabel = document.createElement('label');
      sliderLabel.htmlFor = 'opacity';
      sliderLabel.innerHTML = 'Opacity: ';

      var slider = document.createElement('input');
      slider.type = 'range';
      slider.id = 'opacity';
      slider.value = 100;

      controls.appendChild(sliderLabel);
      controls.appendChild(slider);

      canvas.calcOffset();

      slider.onchange = function() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();

        if (activeObject || activeGroup) {
          (activeObject || activeGroup).set('opacity', parseInt(this.value, 10) / 100);
          canvas.renderAll();
        }
      };
    })();
  }
  
  if (supportsColorpicker()) {
    (function(){
      var controls = document.getElementById('controls');

      var label = document.createElement('label');
      label.htmlFor = 'color';
      label.innerHTML = 'Color: ';
      label.style.marginLeft = '10px';

      var colorpicker = document.createElement('input');
      colorpicker.type = 'color';
      colorpicker.id = 'color';
      colorpicker.style.width = '40px';

      controls.appendChild(label);
      controls.appendChild(colorpicker);

      canvas.calcOffset();

      colorpicker.onchange = function() {
        var activeObject = canvas.getActiveObject(),
            activeGroup = canvas.getActiveGroup();

        if (activeObject || activeGroup) {
          (activeObject || activeGroup).set('fill', this.value);
          canvas.renderAll();
        }
      };
    })();
  }
  
  var lockHorizontallyEl = document.getElementById('lock-horizontally');
  lockHorizontallyEl.onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockHorizontally = !activeObject.lockHorizontally;
      lockHorizontallyEl.innerHTML = activeObject.lockHorizontally 
        ? 'Unlock horizontal movement' 
        : 'Lock horizontal movement';
    }
  };
  
  var lockVerticallyEl = document.getElementById('lock-vertically');
  lockVerticallyEl.onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockVertically = !activeObject.lockVertically;
      lockVerticallyEl.innerHTML = activeObject.lockVertically 
        ? 'Unlock vertical movement' 
        : 'Lock vertical movement';
    }
  };
  
  var lockScalingEl = document.getElementById('lock-scaling');
  lockScalingEl.onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockScaling = !activeObject.lockScaling;
      lockScalingEl.innerHTML = activeObject.lockScaling 
        ? 'Unlock scaling' 
        : 'Lock scaling';
    }
  };
  
  var lockRotationEl = document.getElementById('lock-rotation');
  lockRotationEl.onclick = function() {
    var activeObject = canvas.getActiveObject();
    if (activeObject) {
      activeObject.lockRotation = !activeObject.lockRotation;
      lockRotationEl.innerHTML = activeObject.lockRotation
        ? 'Unlock rotation' 
        : 'Lock rotation';
    }
  };
  
  var gradientifyBtn = document.getElementById('gradientify');
  
  var activeObjectButtons = [ 
    lockHorizontallyEl, 
    lockVerticallyEl, 
    lockScalingEl, 
    lockRotationEl, 
    removeSelectedEl,
    gradientifyBtn
  ];
  
  var opacityEl = document.getElementById('opacity');
  if (opacityEl) {
    activeObjectButtons.push(opacityEl);
  }
  var colorEl = document.getElementById('color');
  if (colorEl) {
    activeObjectButtons.push(colorEl);
  }
  
  for (var i = activeObjectButtons.length; i--; ) {
    activeObjectButtons[i].disabled = true;
  }
  
  fabric.util.observeEvent('object:selected', onObjectSelected);
  fabric.util.observeEvent('group:selected', onObjectSelected);
  
  function onObjectSelected(e) {
    var selectedObject = e.memo.target;
    
    for (var i = activeObjectButtons.length; i--; ) {
      activeObjectButtons[i].disabled = false;
    }
    
    lockHorizontallyEl.innerHTML = (selectedObject.lockHorizontally ? 'Unlock horizontal movement' : 'Lock horizontal movement');
    lockVerticallyEl.innerHTML = (selectedObject.lockVertically ? 'Unlock vertical movement' : 'Lock vertical movement');
    lockScalingEl.innerHTML = (selectedObject.lockScaling ? 'Unlock scaling' : 'Lock scaling');
    lockRotationEl.innerHTML = (selectedObject.lockRotation ? 'Unlock rotation' : 'Lock rotation');
  }
  
  fabric.util.observeEvent('selection:cleared', function(e) {
    for (var i = activeObjectButtons.length; i--; ) {
      activeObjectButtons[i].disabled = true;
    }
  });
  
  var drawingModeEl = document.getElementById('drawing-mode'),
      drawingOptionsEl = document.getElementById('drawing-mode-options'),
      drawingColorEl = document.getElementById('drawing-color'),
      drawingLineWidthEl = document.getElementById('drawing-line-width');
      
  drawingModeEl.onclick = function() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Cancel drawing mode';
      drawingModeEl.className = 'is-drawing';
      drawingOptionsEl.style.display = '';
    }
    else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
      drawingModeEl.className = '';
      drawingOptionsEl.style.display = 'none';
    }
  };
  
  fabric.util.observeEvent('path:created', function() {
    updateComplexity();
  });
  
  drawingColorEl.onchange = function() {
    canvas.freeDrawingColor = drawingColorEl.value;
  };
  drawingLineWidthEl.onchange = function() {
    canvas.freeDrawingLineWidth = parseInt(drawingLineWidthEl.value, 10) || 1; // disallow 0, NaN, etc.
  };
  
  canvas.freeDrawingColor = drawingColorEl.value;
  canvas.freeDrawingLineWidth = parseInt(drawingLineWidthEl.value, 10) || 1;
  
  
  var helloWorld = new fabric.Text('Hello world!', { 
    left: getRandomInt(100, 650), 
    top: getRandomInt(100, 650),
    fontfamily: 'delicious_500',
    angle: getRandomInt(-20, 20)
  });
  
  canvas.add(helloWorld);
  
  updateComplexity();
  
  document.onkeydown = function(e) {
    var obj = canvas.getActiveObject() || canvas.getActiveGroup();
    if (obj && e.keyCode === 8) {
      // this is horrible. need to fix, so that unified interface can be used
      if (obj.type === 'group') {
        // var groupObjects = obj.getObjects();
        //         canvas.removeActiveGroup();
        //         groupObjects.forEach(function(obj) {
        //           canvas.remove(obj);
        //         });
      }
      else {
        //canvas.remove(obj);
      }
      canvas.renderAll();
      // return false;
    }
  };
  
  setTimeout(function() {
    canvas.calcOffset();
  }, 100);
  
  if (document.location.search.indexOf('guidelines') > -1) {
    initCenteringGuidelines(canvas);
    initAligningGuidelines(canvas);
  }
  
  gradientifyBtn.onclick = function() {
    var obj = canvas.getActiveObject();
    if (obj) {
      obj.setGradientFill(canvas.getContext(), {
        x2: (getRandomInt(0, 1) ? 0 : obj.width),
        y2: (getRandomInt(0, 1) ? 0 : obj.height),
        colorStops: { 
          0: '#' + getRandomColor(), 
          1: '#' + getRandomColor()
        }
      });
      canvas.renderAll();
    }
  };
  
  var textEl = document.getElementById('text');
  if (textEl) {
    textEl.onfocus = function() {
      var activeObject = canvas.getActiveObject();
    
      if (activeObject && activeObject.type === 'text') {
        this.value = activeObject.text;
      }
    };
    textEl.onkeyup = function(e) {
      var activeObject = canvas.getActiveObject();
      if (activeObject) {
        if (!this.value) {
          canvas.removeActiveObject();
        }
        else {
          activeObject.text = this.value;
        }
        canvas.renderAll();
      }
    };
  }
  
  var cmdUnderlineBtn = document.getElementById('text-cmd-underline');
  if (cmdUnderlineBtn) {
    cmdUnderlineBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.textDecoration = (activeObject.textDecoration == 'underline' ? '' : 'underline');
        this.className = activeObject.textDecoration ? 'selected' : '';
        canvas.renderAll();
      }
    };
  }
  
  var cmdLinethroughBtn = document.getElementById('text-cmd-linethrough');
  if (cmdLinethroughBtn) {
    cmdLinethroughBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.textDecoration = (activeObject.textDecoration == 'line-through' ? '' : 'line-through');
        this.className = activeObject.textDecoration ? 'selected' : '';
        canvas.renderAll();
      }
    };
  }
  
  var cmdOverlineBtn = document.getElementById('text-cmd-overline');
  if (cmdOverlineBtn) {
    cmdOverlineBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.textDecoration = (activeObject.textDecoration == 'overline' ? '' : 'overline');
        this.className = activeObject.textDecoration ? 'selected' : '';
        canvas.renderAll();
      }
    };
  }
  
  var cmdItalicBtn = document.getElementById('text-cmd-italic');
  if (cmdItalicBtn) {
    cmdItalicBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.fontStyle = (activeObject.fontStyle == 'italic' ? '' : 'italic');
        this.className = activeObject.fontStyle ? 'selected' : '';
        canvas.renderAll();
      }
    };
  }
  
  var cmdShadowBtn = document.getElementById('text-cmd-shadow');
  if (cmdShadowBtn) {
    cmdShadowBtn.onclick = function() {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        activeObject.textShadow = !activeObject.textShadow ? 'rgba(0,0,0,0.2) 2px 2px 10px' : '';
        this.className = activeObject.fontStyle ? 'selected' : '';
        canvas.renderAll();
      }
    };
  }
  
})(this);