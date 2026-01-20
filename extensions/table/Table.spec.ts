import { describe, test, expect, beforeEach } from 'vitest';
import { Canvas, Control, Group } from 'fabric';
import { Table } from './Table';
import { TableLayoutStrategy } from './TableLayoutStrategy';

describe('Table', () => {
  let canvas: Canvas;
  let table: Table;

  beforeEach(() => {
    canvas = new Canvas();
    table = new Table(3, 3);
    canvas.add(table);
  });

  describe('constructor', () => {
    test('creates a table with default 3x3 grid', () => {
      expect(table.rows).toBe(3);
      expect(table.cols).toBe(3);
    });

    test('creates correct number of cells and text objects', () => {
      expect(table.cells.length).toBe(9);
      expect(table.cellTexts.length).toBe(9);
    });

    test('extends Group', () => {
      expect(table).toBeInstanceOf(Group);
    });

    test('uses TableLayoutStrategy', () => {
      expect(table.strategy).toBeInstanceOf(TableLayoutStrategy);
    });

    test('accepts custom dimensions', () => {
      const custom = new Table(5, 4);
      expect(custom.rows).toBe(5);
      expect(custom.cols).toBe(4);
      expect(custom.cells.length).toBe(20);
    });

    test('accepts custom options', () => {
      const custom = new Table(2, 2, {
        cellWidth: 150,
        cellPadding: 12,
        cellFill: '#f0f0f0',
        cellStroke: '#cccccc',
      });
      expect(custom.cellPadding).toBe(12);
      expect(custom.cellFill).toBe('#f0f0f0');
      expect(custom.cellStroke).toBe('#cccccc');
    });
  });

  describe('controls', () => {
    test('has edge resize controls', () => {
      expect(table.controls.ml).toBeInstanceOf(Control);
      expect(table.controls.mr).toBeInstanceOf(Control);
      expect(table.controls.mt).toBeInstanceOf(Control);
      expect(table.controls.mb).toBeInstanceOf(Control);
    });
  });

  describe('cell access', () => {
    test('getCell returns correct cell', () => {
      const cell = table.getCell(1, 2);
      expect(cell).toBeDefined();
      expect(cell?._row).toBe(1);
      expect(cell?._col).toBe(2);
    });

    test('getCellText returns correct text', () => {
      const text = table.getCellText(0, 1);
      expect(text).toBeDefined();
      expect(text?._row).toBe(0);
      expect(text?._col).toBe(1);
    });

    test('getCell returns undefined for invalid indices', () => {
      expect(table.getCell(-1, 0)).toBeUndefined();
      expect(table.getCell(0, 10)).toBeUndefined();
    });
  });

  describe('column width', () => {
    test('getColumnWidth returns width for column', () => {
      const width = table.getColumnWidth(0);
      expect(width).toBe(100);
    });

    test('setColumnWidth updates column width', () => {
      table.setColumnWidth(1, 150);
      expect(table.getColumnWidth(1)).toBe(150);
    });

    test('setColumnWidth respects minimum width', () => {
      table.setColumnWidth(0, 10);
      expect(table.getColumnWidth(0)).toBe(table.minCellWidth);
    });
  });

  describe('row height', () => {
    test('getRowHeight returns height for row', () => {
      const height = table.getRowHeight(0);
      expect(height).toBeGreaterThanOrEqual(table.minCellHeight);
    });

    test('setRowHeight updates row height', () => {
      table.setRowHeight(1, 80);
      expect(table.getRowHeight(1)).toBe(80);
    });

    test('setRowHeight respects minimum height', () => {
      table.setRowHeight(0, 10);
      expect(table.getRowHeight(0)).toBe(table.minCellHeight);
    });
  });

  describe('addRow', () => {
    test('adds row at end by default', () => {
      table.addRow();
      expect(table.rows).toBe(4);
      expect(table.cells.length).toBe(12);
    });

    test('adds row at specific position', () => {
      table.addRow(1);
      expect(table.rows).toBe(4);
      const cell = table.getCell(1, 0);
      expect(cell?._row).toBe(1);
    });

    test('shifts existing rows down', () => {
      table.addRow(0);
      const originalFirstRow = table.getCell(1, 0);
      expect(originalFirstRow?._row).toBe(1);
    });
  });

  describe('removeRow', () => {
    test('removes last row by default', () => {
      table.removeRow();
      expect(table.rows).toBe(2);
      expect(table.cells.length).toBe(6);
    });

    test('removes row at specific position', () => {
      table.removeRow(1);
      expect(table.rows).toBe(2);
    });

    test('does not remove if only one row', () => {
      const singleRow = new Table(1, 3);
      singleRow.removeRow();
      expect(singleRow.rows).toBe(1);
    });
  });

  describe('addColumn', () => {
    test('adds column at end by default', () => {
      table.addColumn();
      expect(table.cols).toBe(4);
      expect(table.cells.length).toBe(12);
    });

    test('adds column at specific position', () => {
      table.addColumn(1);
      expect(table.cols).toBe(4);
    });
  });

  describe('removeColumn', () => {
    test('removes last column by default', () => {
      table.removeColumn();
      expect(table.cols).toBe(2);
      expect(table.cells.length).toBe(6);
    });

    test('does not remove if only one column', () => {
      const singleCol = new Table(3, 1);
      singleCol.removeColumn();
      expect(singleCol.cols).toBe(1);
    });
  });

  describe('cell styling', () => {
    test('updateCellFill updates all non-custom cells', () => {
      table.updateCellFill('#ff0000');
      expect(table.cellFill).toBe('#ff0000');
      table.cells.forEach((cell) => {
        expect(cell.fill).toBe('#ff0000');
      });
    });

    test('updateCellStroke updates all non-custom cells', () => {
      table.updateCellStroke('#0000ff');
      expect(table.cellStroke).toBe('#0000ff');
    });

    test('updateBorderWidth updates stroke width', () => {
      table.updateBorderWidth(2);
      expect(table.borderWidth).toBe(2);
    });
  });

  describe('merge cells', () => {
    test('mergeCells creates merged region', () => {
      table.mergeCells(0, 0, 1, 1);
      const master = table.getCell(0, 0);
      expect(master?._colspan).toBe(2);
      expect(master?._rowspan).toBe(2);
    });

    test('merged cells are marked as merged', () => {
      table.mergeCells(0, 0, 0, 1);
      const slave = table.getCell(0, 1);
      expect(slave?._isMerged).toBe(true);
      expect(slave?._mergeParent).toEqual({ row: 0, col: 0 });
    });

    test('unmergeCells restores individual cells', () => {
      table.mergeCells(0, 0, 0, 1);
      table.unmergeCells(0, 0);
      const former = table.getCell(0, 1);
      expect(former?._isMerged).toBe(false);
    });
  });

  describe('serialization', () => {
    test('toObject returns serializable object', () => {
      const obj = table.toObject();
      expect(obj.type).toBe('Table');
      expect(obj.rows).toBe(3);
      expect(obj.cols).toBe(3);
      expect(obj.cellData).toHaveLength(9);
    });

    test('toObject includes column widths and row heights', () => {
      table.setColumnWidth(0, 120);
      const obj = table.toObject();
      expect(obj.columnWidths[0]).toBe(120);
    });

    test('fromObject restores table', async () => {
      table.setColumnWidth(1, 150);
      const cell = table.getCell(0, 0);
      cell?.set('fill', '#ff0000');
      (cell as any)._hasCustomFill = true;

      const obj = table.toObject();
      const restored = await Table.fromObject(obj);

      expect(restored.rows).toBe(3);
      expect(restored.cols).toBe(3);
      expect(restored.getColumnWidth(1)).toBe(150);
      expect(restored.getCell(0, 0)?.fill).toBe('#ff0000');
    });

    test('fromObject restores merged cells', async () => {
      table.mergeCells(0, 0, 1, 1);
      const obj = table.toObject();
      const restored = await Table.fromObject(obj);

      const master = restored.getCell(0, 0);
      expect(master?._colspan).toBe(2);
      expect(master?._rowspan).toBe(2);
    });
  });

  describe('getCellAtPoint', () => {
    test('returns cell position for point inside table', () => {
      table.set({ left: 200, top: 200 });
      table.setCoords();
      const result = table.getCellAtPoint({ x: 200, y: 200 } as any);
      expect(result).toBeDefined();
      expect(result?.row).toBeGreaterThanOrEqual(0);
      expect(result?.col).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('TableLayoutStrategy', () => {
  test('type is table-layout', () => {
    expect(TableLayoutStrategy.type).toBe('table-layout');
  });

  test('initializes with default values', () => {
    const strategy = new TableLayoutStrategy();
    expect(strategy.rows).toBe(3);
    expect(strategy.cols).toBe(3);
    expect(strategy.cellPadding).toBe(8);
  });

  test('initializes with custom values', () => {
    const strategy = new TableLayoutStrategy({
      rows: 5,
      cols: 4,
      cellPadding: 16,
    });
    expect(strategy.rows).toBe(5);
    expect(strategy.cols).toBe(4);
    expect(strategy.cellPadding).toBe(16);
  });

  test('getColumnWidth returns correct width', () => {
    const strategy = new TableLayoutStrategy({ cellWidth: 120 });
    expect(strategy.getColumnWidth(0)).toBe(120);
  });

  test('getRowHeight returns correct height', () => {
    const strategy = new TableLayoutStrategy({ minCellHeight: 50 });
    expect(strategy.getRowHeight(0)).toBe(50);
  });
});
