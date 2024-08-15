import * as fabric from 'fabric';
import './styles.css';
import { testCase } from './testcases/guidelines';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el));

//  edit from here
canvas.setDimensions({
  width: 500,
  height: 500,
});

testCase(canvas);
