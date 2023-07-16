import { Textbox } from 'fabric';
import { canvas } from 'init';

const textbox = new Textbox('initial text', { width: 200, left: 50 });
canvas.add(textbox);

window.targets = { textbox };
