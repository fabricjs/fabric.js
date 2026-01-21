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

    test('preserves reflow anchor position (default left/top)', () => {
      table.set({ left: 100, top: 100 });
      table.setCoords();
      const topLeftBefore = table.getPositionByOrigin('left', 'top');

      table.addRow();

      const topLeftAfter = table.getPositionByOrigin('left', 'top');
      expect(topLeftAfter.x).toBeCloseTo(topLeftBefore.x, 1);
      expect(topLeftAfter.y).toBeCloseTo(topLeftBefore.y, 1);
    });

    test('respects custom reflowOriginX/reflowOriginY', () => {
      const centeredReflow = new Table(3, 3, {
        reflowOriginX: 'center',
        reflowOriginY: 'center',
      });
      canvas.add(centeredReflow);
      centeredReflow.set({ left: 200, top: 200 });
      centeredReflow.setCoords();
      const centerBefore = centeredReflow.getCenterPoint();

      centeredReflow.addRow();

      const centerAfter = centeredReflow.getCenterPoint();
      expect(centerAfter.x).toBeCloseTo(centerBefore.x, 1);
      expect(centerAfter.y).toBeCloseTo(centerBefore.y, 1);
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

    test('preserves reflow anchor position', () => {
      table.set({ left: 100, top: 100 });
      table.setCoords();
      const topLeftBefore = table.getPositionByOrigin('left', 'top');

      table.removeRow();

      const topLeftAfter = table.getPositionByOrigin('left', 'top');
      expect(topLeftAfter.x).toBeCloseTo(topLeftBefore.x, 1);
      expect(topLeftAfter.y).toBeCloseTo(topLeftBefore.y, 1);
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

    test('preserves reflow anchor position (default left/top)', () => {
      table.set({ left: 100, top: 100 });
      table.setCoords();
      const topLeftBefore = table.getPositionByOrigin('left', 'top');

      table.addColumn();

      const topLeftAfter = table.getPositionByOrigin('left', 'top');
      expect(topLeftAfter.x).toBeCloseTo(topLeftBefore.x, 1);
      expect(topLeftAfter.y).toBeCloseTo(topLeftBefore.y, 1);
    });
  });

  describe('removeColumn', () => {
    test('removes last column by default', () => {
      table.removeColumn();
      expect(table.cols).toBe(2);
      expect(table.cells.length).toBe(6);
    });

    test('preserves reflow anchor position', () => {
      table.set({ left: 100, top: 100 });
      table.setCoords();
      const topLeftBefore = table.getPositionByOrigin('left', 'top');

      table.removeColumn();

      const topLeftAfter = table.getPositionByOrigin('left', 'top');
      expect(topLeftAfter.x).toBeCloseTo(topLeftBefore.x, 1);
      expect(topLeftAfter.y).toBeCloseTo(topLeftBefore.y, 1);
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

    test('merging already-merged cells with additional cells works correctly', () => {
      // First merge: 2x2 block at top-left
      table.mergeCells(0, 0, 1, 1);
      expect(table.getCell(0, 0)?._colspan).toBe(2);
      expect(table.getCell(0, 0)?._rowspan).toBe(2);

      // Second merge: extend the block to include row 2
      table.mergeCells(0, 0, 2, 1);

      // Master should now span 3 rows x 2 cols
      const master = table.getCell(0, 0);
      expect(master?._colspan).toBe(2);
      expect(master?._rowspan).toBe(3);

      // All slave cells should be properly marked
      expect(table.getCell(0, 1)?._isMerged).toBe(true);
      expect(table.getCell(1, 0)?._isMerged).toBe(true);
      expect(table.getCell(1, 1)?._isMerged).toBe(true);
      expect(table.getCell(2, 0)?._isMerged).toBe(true);
      expect(table.getCell(2, 1)?._isMerged).toBe(true);

      // All slaves should point to master
      expect(table.getCell(2, 0)?._mergeParent).toEqual({ row: 0, col: 0 });
      expect(table.getCell(2, 1)?._mergeParent).toEqual({ row: 0, col: 0 });

      // No orphaned cells - all slaves should have opacity 0
      expect(table.getCell(0, 1)?.opacity).toBe(0);
      expect(table.getCell(1, 0)?.opacity).toBe(0);
      expect(table.getCell(1, 1)?.opacity).toBe(0);
      expect(table.getCell(2, 0)?.opacity).toBe(0);
      expect(table.getCell(2, 1)?.opacity).toBe(0);
    });

    test('mergeCells expands range to include existing merged regions', () => {
      // First merge: 2x2 block at top-left
      table.mergeCells(0, 0, 1, 1);

      // User selects merged block (0,0) and cell (2,0) only - doesn't include col 1
      // mergeCells should expand to include the full merged region
      table.mergeCells(0, 0, 2, 0);

      // Should expand to include col 1 because (0,0) had colspan=2
      const master = table.getCell(0, 0);
      expect(master?._colspan).toBe(2);
      expect(master?._rowspan).toBe(3);

      // (1,1) was part of original merge - should still be merged
      expect(table.getCell(1, 1)?._isMerged).toBe(true);
      expect(table.getCell(1, 1)?._mergeParent).toEqual({ row: 0, col: 0 });
    });

    test('merge range that includes slave cells expands to include master', () => {
      // Merge (0,0)-(1,1) - creates master at (0,0), slaves at (0,1), (1,0), (1,1)
      table.mergeCells(0, 0, 1, 1);

      // Now merge (1,0)-(2,0) - (1,0) is a slave cell
      // Should expand to include the master's full region
      table.mergeCells(1, 0, 2, 0);

      // Result should include full original merge plus new row
      const master = table.getCell(0, 0);
      expect(master?._colspan).toBe(2);
      expect(master?._rowspan).toBe(3);
    });

    test('merge two separate merged regions into one', () => {
      // Create two separate 1x2 horizontal merges
      table.mergeCells(0, 0, 0, 1); // top merge
      table.mergeCells(2, 0, 2, 1); // bottom merge

      // Now merge them together (selecting both)
      table.mergeCells(0, 0, 2, 1);

      const master = table.getCell(0, 0);
      expect(master?._colspan).toBe(2);
      expect(master?._rowspan).toBe(3);

      // All non-master cells should be slaves
      expect(table.getCell(2, 0)?._isMerged).toBe(true);
      expect(table.getCell(2, 1)?._isMerged).toBe(true);
    });

    test('unmerge then merge different cells works correctly', () => {
      table.mergeCells(0, 0, 1, 1);
      table.unmergeCells(0, 0);

      // All cells should be independent again
      expect(table.getCell(0, 0)?._colspan).toBe(1);
      expect(table.getCell(0, 1)?._isMerged).toBe(false);

      // Now merge different cells
      table.mergeCells(1, 1, 2, 2);
      expect(table.getCell(1, 1)?._colspan).toBe(2);
      expect(table.getCell(1, 1)?._rowspan).toBe(2);
      expect(table.getCell(0, 0)?._colspan).toBe(1); // unchanged
    });

    test('merge preserves text from all cells', () => {
      const text00 = table.getCellText(0, 0);
      const text01 = table.getCellText(0, 1);
      text00?.set('text', 'A');
      text01?.set('text', 'B');

      table.mergeCells(0, 0, 0, 1);

      const masterText = table.getCellText(0, 0);
      expect(masterText?.text).toContain('A');
      expect(masterText?.text).toContain('B');
    });

    test('merge preserves reflow anchor position', () => {
      table.set({ left: 100, top: 100 });
      table.setCoords();
      const topLeftBefore = table.getPositionByOrigin('left', 'top');

      table.mergeCells(0, 0, 1, 1);

      const topLeftAfter = table.getPositionByOrigin('left', 'top');
      expect(topLeftAfter.x).toBeCloseTo(topLeftBefore.x, 1);
      expect(topLeftAfter.y).toBeCloseTo(topLeftBefore.y, 1);
    });
  });

  describe('serialization', () => {
    test('toObject returns serializable object', () => {
      const obj = table.toObject();
      expect((obj).type).toBe('Table');
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

    test('fromObject restores reflow origins', async () => {
      const custom = new Table(3, 3, {
        reflowOriginX: 'center',
        reflowOriginY: 'bottom',
      });
      const obj = custom.toObject();
      const restored = await Table.fromObject(obj);

      expect(restored.reflowOriginX).toBe('center');
      expect(restored.reflowOriginY).toBe('bottom');
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

  describe('getContentDimensions', () => {
    test('returns correct content dimensions', () => {
      const dims = table.getContentDimensions();
      expect(dims.contentWidth).toBe(300);
      expect(dims.contentHeight).toBeGreaterThan(0);
    });
  });

  describe('getBorderAtPoint', () => {
    test('returns null when not near a border', () => {
      table.set({ left: 200, top: 200 });
      table.setCoords();
      const result = table.getBorderAtPoint({ x: 200, y: 200 } as any);
      expect(result).toBeNull();
    });

    test('getBorderPosition returns position for internal border', () => {
      const pos = table.getBorderPosition('col', 1);
      expect(typeof pos).toBe('number');
    });
  });

  describe('getBorderOrIndicatorAtPoint', () => {
    test('returns border with null indicatorSide when over internal border', () => {
      table.set({ left: 200, top: 200 });
      table.setCoords();
      const borderPos = table.getBorderPosition('col', 1);
      const tableCenter = table.getCenterPoint();
      const result = table.getBorderOrIndicatorAtPoint({
        x: tableCenter.x + borderPos,
        y: tableCenter.y,
      } as any);
      expect(result).not.toBeNull();
      expect(result?.border.type).toBe('col');
      expect(result?.indicatorSide).toBeNull();
    });

    test('returns null when point is outside indicator zones', () => {
      table.set({ left: 200, top: 200 });
      table.setCoords();
      const result = table.getBorderOrIndicatorAtPoint({ x: 0, y: 0 } as any);
      expect(result).toBeNull();
    });

    test('detects column indicator above table', () => {
      table.set({ left: 150, top: 100 });
      table.setCoords();
      const borderLocalX = table.getBorderPosition('col', 1);
      const { contentHeight } = table.getContentDimensions();
      const halfH = contentHeight / 2;
      const result = table.getBorderOrIndicatorAtPoint({
        x: 150 + borderLocalX,
        y: 100 - halfH - table.indicatorOffset,
      } as any);
      expect(result).not.toBeNull();
      expect(result?.border.type).toBe('col');
      expect(result?.border.index).toBe(1);
      expect(result?.indicatorSide).toBe('before');
    });

    test('detects row indicator left of table', () => {
      table.set({ left: 150, top: 100 });
      table.setCoords();
      const borderLocalY = table.getBorderPosition('row', 1);
      const { contentWidth } = table.getContentDimensions();
      const halfW = contentWidth / 2;
      const result = table.getBorderOrIndicatorAtPoint({
        x: 150 - halfW - table.indicatorOffset,
        y: 100 + borderLocalY,
      } as any);
      expect(result).not.toBeNull();
      expect(result?.border.type).toBe('row');
      expect(result?.border.index).toBe(1);
      expect(result?.indicatorSide).toBe('before');
    });
  });

  describe('cell selection', () => {
    test('selectCell sets selection state', () => {
      table.selectCell(1, 1);
      expect(table.hasSelection).toBe(true);
      expect(table.selectionCount).toBe(1);
    });

    test('selectedCells returns selected cell objects', () => {
      table.selectCell(0, 0);
      const cells = table.selectedCells;
      expect(cells.length).toBe(1);
      expect(cells[0]._row).toBe(0);
      expect(cells[0]._col).toBe(0);
    });

    test('selectCell with extend creates range', () => {
      table.selectCell(0, 0);
      table.selectCell(1, 1, true);
      expect(table.selectionCount).toBe(4);
    });

    test('clearCellSelection clears selection', () => {
      table.selectCell(0, 0);
      table.clearCellSelection();
      expect(table.hasSelection).toBe(false);
      expect(table.selectionCount).toBe(0);
    });

    test('_hoveredBorder is initially null', () => {
      expect(table._hoveredBorder).toBeNull();
    });

    test('selectAllCells selects every cell', () => {
      table.selectAllCells();
      expect(table.selectionCount).toBe(9);
    });

    test('selectAllCells sets anchor to top-left', () => {
      table.selectAllCells();
      expect(table._selectionAnchor).toEqual({ row: 0, col: 0 });
    });

    test('selectAllCells works on larger tables', () => {
      const large = new Table(5, 4);
      large.selectAllCells();
      expect(large.selectionCount).toBe(20);
    });

    test('selectAllCells includes merged cell masters only', () => {
      table.mergeCells(0, 0, 1, 1);
      table.selectAllCells();
      // 9 cells minus 3 slaves + master = 6 unique positions
      // Actually: buildSelectionRange dedupes by mergeParent
      // (0,0) master covers 4 cells, so we have 1 master + 5 other cells = 6
      expect(table.selectionCount).toBe(6);
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
