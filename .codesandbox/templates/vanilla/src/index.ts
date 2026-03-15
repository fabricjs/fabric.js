import * as fabric from 'fabric';
import './styles.css';
import { testCase } from './testcases/table';

const el = document.getElementById('canvas');
const canvas = (window.canvas = new fabric.Canvas(el, {
  width: 800,
  height: 600,
  backgroundColor: '#f5f5f5',
  preserveObjectStacking: true,
  allowTouchScrolling: true,
  enablePointerEvents: true,
}));

testCase(canvas);
