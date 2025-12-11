import * as fabric from 'fabric';
import './styles.css';
import { testCase } from './testcases/simpleTextbox';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el, {
  width: 500,
  height: 500,
  preserveObjectStacking: true,
  allowTouchScrolling: true,
  enablePointerEvents: true,
}));

testCase(canvas);
