import * as fabric from 'fabric';
import { Table, initTableInteraction } from 'fabric/extensions';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 800, height: 600 });

  initTableInteraction(canvas);

  const table = new Table(4, 4, {
    cellWidth: 120,
    minCellHeight: 50,
    cellPadding: 10,
    cellFill: '#ffffff',
    cellStroke: '#d0d0d0',
    borderWidth: 1,
  });

  const labels = ['Name', 'Age', 'City', 'Country'];
  labels.forEach((label, i) => {
    const text = table.getCellText(0, i);
    if (text) {
      text.set({ text: label, fontWeight: 'bold' });
    }
    const cell = table.getCell(0, i);
    if (cell) {
      cell.set('fill', '#f5f5f5');
    }
  });

  const data = [
    ['Alice', '28', 'New York', 'USA'],
    ['Bob', '34', 'London', 'UK'],
    ['Carol', '22', 'Tokyo', 'Japan'],
  ];
  data.forEach((row, r) => {
    row.forEach((value, c) => {
      const text = table.getCellText(r + 1, c);
      if (text) {
        text.set('text', value);
      }
    });
  });

  table.triggerLayout();

  canvas.add(table);
  canvas.centerObject(table);
  canvas.setActiveObject(table);
}
