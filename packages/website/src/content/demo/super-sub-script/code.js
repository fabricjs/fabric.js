const $ = (id) => document.getElementById(id);

const getRange = () => {
	var active = canvas.getActiveObject();
	if (!active) return [];
	if (active.selectionStart === active.selectionEnd) {
		return [active.selectionStart, active.selectionEnd + 1];
	}
	return [active.selectionStart, active.selectionEnd];
}

$('super').onclick = () => {
	var active = canvas.getActiveObject();
	if (!active) return;
	active.setSuperscript(...getRange());
	canvas.requestRenderAll();
}

$('sub').onclick = () => {
	var active = canvas.getActiveObject();
	if (!active) return;
	active.setSubscript(...getRange());
	canvas.requestRenderAll();
}

$('remove').onclick = () => {
	var active = canvas.getActiveObject();
	if (!active) return;
	active.setSelectionStyles && active.setSelectionStyles({
		fontSize: undefined,
		deltaY: undefined,
	}, ...getRanges());
	canvas.requestRenderAll();
}

const canvas = new fabric.Canvas(canvasEl);

var itext = new fabric.IText('This is a IText object', {
	left: 100,
	top: 300,
	fill: '#D81B60',
	strokeWidth: 2,
	stroke: "#880E4F",
});

var textbox = new fabric.Textbox('This is a Textbox object', {
	left: 20,
	top: 50,
	fill: '#880E4F',
	strokeWidth: 2,
	stroke: "#D81B60",
});

canvas.add(itext, textbox);
