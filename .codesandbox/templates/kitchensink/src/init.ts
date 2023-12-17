import { fabric } from "fabric";
import { attach } from './viewportActions';

const el = document.getElementById("canvas");
const canvas = new fabric.Canvas(el);
attach(canvas);

window.__canvas = canvas;

export { canvas };

