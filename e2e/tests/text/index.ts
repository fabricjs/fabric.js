import { Canvas, Textbox } from 'fabric';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new Canvas(el));

const textbox = new Textbox('initial text', { width: 200, left: 50 });
canvas.add(textbox);

window.targets = { textbox };
