var canvas1 = document.getElementById('c');
var canvas2 = document.getElementById('b');
var ctx = canvas1.getContext('2d');
var ctx2 = canvas2.getContext('2d');
ctx.imageSmoothingEnabled = false;
ctx2.imageSmoothingEnabled = false;

const canvas = new fabric.Canvas(canvasEl);
// create a rectangle object

var lanczosFilter = new fabric.filters.Resize({
  scaleX: 1,
  scaleY: 1,
  resizeType: 'lanczos',
  lanczosLobes: 3,
});

var oImg;
var p = {
	x: 0,
	y: 0,
};

fabric.FabricImage.fromURL('/assets/dragon.jpg').then((img) => {
	var r = canvas.getRetinaScaling();
    oImg = img;
    oImg.set({ left: 20, top: 20 })
    oImg.scale(0.2);
	lanczosFilter.scaleX = lanczosFilter.scaleY = oImg.scaleX * r;
	oImg.lockScalingFlip = true;
	oImg.minScaleLimit = 0.025;
	oImg.filters = [lanczosFilter];
	oImg.hoverCursor = 'crossHair';
    oImg.on('scaling', function(opt) {
		var filters = [];
		var sX = Math.abs(oImg.scaleX) * r, sY = Math.abs(oImg.scaleY) * r;
		if (sX > 0.01 && sY > 0.01 && sX < 1 && sY < 1) {
			if (sX <= 0.2 || sY <= 0.2) {
				lanczosFilter.lanczosLobes = 2;
			} else if (sX <= 0.05 || sY <= 0.05) {
				lanczosFilter.lanczosLobes = 1;
			} else {
				lanczosFilter.lanczosLobes = 3;
			}
			lanczosFilter.scaleX = sX;
			lanczosFilter.scaleY = sY;
			filters.push(lanczosFilter);
		}
		this.filters = filters;
    });
	oImg.on('mousedown', function({ e, scenePoint }) {
		if (e.buttons === 2) {
            p = fabric.util.sendPointToPlane(scenePoint, undefined, oImg.calcTransformMatrix())
                .add({ x: oImg.width / 2, y: oImg.height / 2 });
			updateFor()
		}
	})
    canvas.add(oImg);
	canvas.setActiveObject(oImg);
	canvas.on('before:render', function() {
		oImg.applyFilters();
		updateFor();
		document.getElementById('log').innerHTML = 'scale: ' + lanczosFilter.scaleX.toFixed(4) + ' lobes: ' + lanczosFilter.lanczosLobes +
			', taps: ' + lanczosFilter.taps.length + '\nweights:\n' + lanczosFilter.taps.map(
				function(tap, i) { return i + ': ' + tap.toFixed(7); }
			).join('\n');
	});
});


function updateFor() {
	var w = oImg._element.width, h = oImg._element.height,
	    fW = Math.floor(550 * oImg.scaleX),
		fH = Math.floor(400 * oImg.scaleY),
        sx = p.x * oImg.scaleX - fW / 2, sy = p.y * oImg.scaleY - fH / 2;

    if (sx < 0) {
        sx = 0
    }
    if (sy < 0) {
        sy = 0
    }
	if (sx + fW > w) {
		sx = w - fW;
	}
	if (sy + fH > h) {
		sy = h - fH;
	}
    ctx.drawImage(oImg._originalElement, sx / oImg.scaleX, sy / oImg.scaleY, 550, 400, 0, 0, 550 * oImg.scaleX , 400 * oImg.scaleY);
    ctx.drawImage(canvas1, 0, 0, fW, fH, 0, 0, 550, 400);
    ctx2.drawImage(oImg._element, sx, sy, fW, fH, 0, 0, 550, 400);
}