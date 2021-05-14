(function() {
	var visualTestLoop;
	if (fabric.isLikelyNode) {
		visualTestLoop = global.visualTestLoop;
	} else {
		visualTestLoop = window.visualTestLoop;
	}

	var tests = [];

	function gradientStroke(canvas, callback) {
		var line = new fabric.Line([10, 10, 200, 200], {
			stroke: {
				toLive(ctx) {
					var gradient = ctx.createLinearGradient(20, 0, 80, 0);
					gradient.addColorStop(0, 'green');
					gradient.addColorStop(0.4, 'cyan');
					gradient.addColorStop(1, 'red');
					return gradient;
				},
				gradientTransform: [1, 0, 0, 1, -50, 0],
			},
			strokeWidth: 20,
		});
		canvas.add(
			line
		);
		canvas.renderAll();
		callback(canvas.lowerCanvasEl);

	}

	tests.push({
		test: 'Use the gradient strokeStyle for line(other shape is ok)',
		code: gradientStroke,
		golden: 'gradientStroke.png',
		newModule: 'Gradient stroke',
		percentage: 0.09,
		width: 300,
		height: 300,
	});

	function textGradientFill(canvas, callback) {
		var text = new fabric.Text('Some Text', {
			fontSize: 40,
			left: 50,
			top: 30,
			fontWeight: 'bold',
			fill: {
				toLive(ctx) {
					var gradient = ctx.createRadialGradient(100, 100, 100, 50, 100, 10);
					gradient.addColorStop(0, "white");
					gradient.addColorStop(0.4, "indianred");
					gradient.addColorStop(1, "green");
					return gradient;
				},
				patternTransform: [1, 0, 0, 1, -100, -100],
			},
		});
		canvas.add(
			text
		);
		canvas.renderAll();
		callback(canvas.lowerCanvasEl);

	}

	tests.push({
		test: 'Use the gradient fillStyle for text',
		code: textGradientFill,
		golden: 'textGradientFill.png',
		newModule: 'Text gradient fill',
		percentage: 0.09,
		width: 300,
		height: 100,
	});

	tests.forEach(visualTestLoop(QUnit));
})();