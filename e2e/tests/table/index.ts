/**
 * Runs in the **BROWSER**
 * Imports are defined in 'e2e/imports.ts'
 */

import { Table } from 'fabric/extensions';
import { beforeAll } from '../test';

beforeAll(async (canvas) => {
  canvas.setDimensions({ width: 600, height: 400 });

  const table = new Table(3, 3, {
    cellWidth: 100,
    minCellHeight: 40,
    cellPadding: 8,
    cellFill: '#ffffff',
    cellStroke: '#e0e0e0',
    borderWidth: 1,
  });

  canvas.add(table);
  canvas.centerObject(table);
  canvas.setActiveObject(table);

  const cell = table.getCell(0, 0);
  const text = table.getCellText(0, 0);
  if (text) {
    text.set('text', 'A1');
  }
  const text12 = table.getCellText(1, 2);
  if (text12) {
    text12.set('text', 'Cell');
  }

  table.triggerLayout();

  return { table };
});
