import {
  Group,
  Rect,
  Textbox,
  LayoutManager,
  classRegistry,
  Point,
  util,
  type TOptions,
  type Abortable,
  type FabricObject,
  type GroupProps,
  type SerializedGroupProps,
} from 'fabric';
import {
  TableLayoutStrategy,
  type TableCell,
  type TableCellText,
} from './TableLayoutStrategy';
import { createTableControls } from './tableControls';

export interface TableDefaults {
  cellWidth: number;
  minCellWidth: number;
  minCellHeight: number;
  cellPadding: number;
  cellSpacing: number;
  borderWidth: number;
  cellStroke: string;
  cellFill: string;
  textFill: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
  selectionColor: string;
  selectionWidth: number;
  borderThreshold: number;
  indicatorOffset: number;
  indicatorRadius: number;
  indicatorHitRadius: number;
}

export interface CellData {
  row: number;
  col: number;
  fill?: string;
  stroke?: string;
  hasCustomFill?: boolean;
  hasCustomStroke?: boolean;
  text?: string;
  textFill?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  verticalAlign?: string;
  colspan?: number;
  rowspan?: number;
  isMerged?: boolean;
  mergeParent?: { row: number; col: number } | null;
}

export interface SerializedTableProps extends SerializedGroupProps {
  rows: number;
  cols: number;
  columnWidths: number[];
  rowHeights: number[];
  manualRowHeights: (number | null)[];
  minCellWidth: number;
  minCellHeight: number;
  cellPadding: number;
  cellSpacing: number;
  cellFill: string;
  cellStroke: string;
  borderWidth: number;
  cellData: CellData[];
}

export interface TableBorderInfo {
  type: 'col' | 'row';
  index: number;
  position: number;
}

export interface CellPosition {
  row: number;
  col: number;
}

export class Table extends Group {
  static type = 'Table';

  declare cellFill: string;
  declare cellStroke: string;
  declare borderWidth: number;
  declare selectionColor: string;
  declare selectionWidth: number;
  declare borderThreshold: number;
  declare indicatorOffset: number;
  declare indicatorRadius: number;
  declare indicatorHitRadius: number;

  _selectedCells: CellPosition[] = [];
  _selectionAnchor: CellPosition | null = null;
  _hoveredBorder: TableBorderInfo | null = null;
  _isDraggingBorder = false;

  static defaults: TableDefaults = {
    cellWidth: 100,
    minCellWidth: 40,
    minCellHeight: 40,
    cellPadding: 8,
    cellSpacing: 0,
    borderWidth: 1,
    cellStroke: '#e0e0e0',
    cellFill: '#ffffff',
    textFill: '#333333',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
    selectionColor: '#2563eb',
    selectionWidth: 2,
    borderThreshold: 5,
    indicatorOffset: 15,
    indicatorRadius: 8,
    indicatorHitRadius: 10,
  };

  constructor(
    rows = 3,
    cols = 3,
    options: Partial<GroupProps & TableDefaults> = {},
  ) {
    const config = { ...Table.defaults, ...options };
    config.minCellHeight =
      (options as any).cellHeight ??
      options.minCellHeight ??
      Table.defaults.minCellHeight;

    const strategy = new TableLayoutStrategy({
      rows,
      cols,
      cellWidth: config.cellWidth,
      minCellHeight: config.minCellHeight,
      cellPadding: config.cellPadding,
      cellSpacing: config.cellSpacing,
      borderWidth: config.borderWidth,
    });

    const objects = Table.createCells(rows, cols, config);

    super(objects, {
      ...options,
      layoutManager: new LayoutManager(strategy),
      subTargetCheck: true,
      interactive: true,
      originX: 'center',
      originY: 'center',
      stroke: undefined,
      strokeWidth: 0,
    });

    this.cellFill = config.cellFill;
    this.cellStroke = config.cellStroke;
    this.borderWidth = config.borderWidth;
    this.selectionColor = config.selectionColor;
    this.selectionWidth = config.selectionWidth;
    this.borderThreshold = config.borderThreshold;
    this.indicatorOffset = config.indicatorOffset;
    this.indicatorRadius = config.indicatorRadius;
    this.indicatorHitRadius = config.indicatorHitRadius;

    this.cornerColor = '#ffffff';
    this.cornerStrokeColor = config.selectionColor;
    this.borderColor = config.selectionColor;
    this.borderScaleFactor = 1;
    this.transparentCorners = false;

    this.controls = createTableControls();
    this.lockScalingFlip = true;
  }

  override _onObjectAdded(object: FabricObject) {
    this.enterGroup(object, false);
    this.fire('object:added', { target: object });
    object.fire('added', { target: this });
  }

  private static createCellPair(
    row: number,
    col: number,
    config: TableDefaults,
  ): [TableCell, TableCellText] {
    const cell = new Rect({
      width: config.cellWidth,
      height: config.minCellHeight,
      fill: config.cellFill,
      stroke: config.cellStroke,
      strokeWidth: config.borderWidth,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
    }) as unknown as TableCell;

    cell._isCell = true;
    cell._row = row;
    cell._col = col;

    const text = new Textbox('', {
      width: config.cellWidth - config.cellPadding * 2,
      fontSize: config.fontSize,
      fontWeight: config.fontWeight as any,
      fontStyle: config.fontStyle as any,
      fill: config.textFill,
      textAlign: config.textAlign as any,
      originX: 'center',
      originY: 'center',
      splitByGrapheme: true,
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
    }) as unknown as TableCellText;

    text._isCellText = true;
    text._row = row;
    text._col = col;

    cell._text = text;
    text._cell = cell;

    return [cell, text];
  }

  private static createCells(
    rows: number,
    cols: number,
    config: TableDefaults,
  ): FabricObject[] {
    const objects: FabricObject[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const [cell, text] = Table.createCellPair(r, c, config);
        objects.push(cell, text);
      }
    }
    return objects;
  }

  get strategy(): TableLayoutStrategy | undefined {
    return this.layoutManager?.strategy as TableLayoutStrategy | undefined;
  }

  get rows(): number {
    return this.strategy?.rows ?? 3;
  }

  get cols(): number {
    return this.strategy?.cols ?? 3;
  }

  get columnWidths(): number[] {
    return this.strategy?.columnWidths ?? [];
  }

  get rowHeights(): number[] {
    return this.strategy?.rowHeights ?? [];
  }

  get minCellWidth(): number {
    return this.strategy?.minCellWidth ?? 40;
  }

  get minCellHeight(): number {
    return this.strategy?.minCellHeight ?? 40;
  }

  get cellPadding(): number {
    return this.strategy?.cellPadding ?? 8;
  }

  get cellSpacing(): number {
    return this.strategy?.cellSpacing ?? 0;
  }

  get cells(): TableCell[] {
    return this._objects.filter((o) => (o as TableCell)._isCell) as TableCell[];
  }

  get cellTexts(): TableCellText[] {
    return this._objects.filter(
      (o) => (o as TableCellText)._isCellText,
    ) as TableCellText[];
  }

  getCell(row: number, col: number): TableCell | undefined {
    return this._objects.find(
      (o) =>
        (o as TableCell)._isCell &&
        (o as TableCell)._row === row &&
        (o as TableCell)._col === col,
    ) as TableCell | undefined;
  }

  getCellText(row: number, col: number): TableCellText | undefined {
    return this._objects.find(
      (o) =>
        (o as TableCellText)._isCellText &&
        (o as TableCellText)._row === row &&
        (o as TableCellText)._col === col,
    ) as TableCellText | undefined;
  }

  getColumnWidth(col: number): number {
    return this.strategy?.getColumnWidth(col) ?? this.minCellWidth;
  }

  getRowHeight(row: number): number {
    return this.strategy?.getRowHeight(row) ?? this.minCellHeight;
  }

  getRowMinHeight(row: number): number {
    let maxTextHeight = 0;
    for (let c = 0; c < this.cols; c++) {
      const text = this.getCellText(row, c);
      if (text && typeof (text as any).calcTextHeight === 'function') {
        maxTextHeight = Math.max(maxTextHeight, (text as any).calcTextHeight());
      }
    }
    return Math.max(this.minCellHeight, maxTextHeight + this.cellPadding * 2);
  }

  setColumnWidth(col: number, width: number) {
    if (!this.strategy || col < 0 || col >= this.cols) return;
    this.strategy.columnWidths[col] = Math.max(this.minCellWidth, width);
    this.triggerLayout();
  }

  setRowHeight(row: number, height: number, manual = true) {
    if (!this.strategy || row < 0 || row >= this.rows) return;
    const h = Math.max(this.minCellHeight, height);
    this.strategy.rowHeights[row] = h;
    if (manual) this.strategy.manualRowHeights[row] = h;
    this.triggerLayout();
  }

  set minCellHeight(v: number) {
    if (this.strategy) {
      this.strategy.minCellHeight = v;
      this.triggerLayout();
    }
  }

  set cellPadding(v: number) {
    if (this.strategy) {
      this.strategy.cellPadding = v;
      this.triggerLayout();
    }
  }

  set cellSpacing(v: number) {
    if (this.strategy) {
      this.strategy.cellSpacing = v;
      this.triggerLayout();
    }
  }

  private cellConfigFrom(
    sourceCell: TableCell | undefined,
    sourceText: TableCellText | undefined,
    width: number,
  ): TableDefaults {
    return {
      ...Table.defaults,
      cellWidth: width,
      minCellHeight: this.minCellHeight,
      cellPadding: this.cellPadding,
      cellStroke: this.cellStroke,
      borderWidth: this.borderWidth,
      cellFill: (sourceCell?.fill as string) ?? Table.defaults.cellFill,
      fontSize: sourceText?.fontSize ?? Table.defaults.fontSize,
      fontWeight:
        (sourceText?.fontWeight as string) ?? Table.defaults.fontWeight,
      fontStyle: (sourceText?.fontStyle as string) ?? Table.defaults.fontStyle,
      textFill: (sourceText?.fill as string) ?? Table.defaults.textFill,
      textAlign: (sourceText?.textAlign as string) ?? Table.defaults.textAlign,
    };
  }

  private shiftIndices(
    prop: '_row' | '_col',
    threshold: number,
    delta: number,
  ) {
    for (const obj of this._objects) {
      const item = obj as any;
      if ((item._isCell || item._isCellText) && item[prop] >= threshold) {
        item[prop] += delta;
      }
    }
  }

  private removeAtIndex(prop: '_row' | '_col', index: number) {
    const toRemove = this._objects.filter((o) => {
      const item = o as unknown as { _isCell?: boolean; _isCellText?: boolean; _row: number; _col: number };
      return (item._isCell || item._isCellText) && item[prop] === index;
    });
    for (const obj of toRemove) {
      this.remove(obj);
    }
  }

  addRow(position = this.rows) {
    if (!this.strategy) return;
    const sourceRow =
      position > 0 ? position - 1 : position < this.rows ? position : null;
    const sourceData = Array.from({ length: this.cols }, (_, c) => ({
      cell: sourceRow !== null ? this.getCell(sourceRow, c) : undefined,
      text: sourceRow !== null ? this.getCellText(sourceRow, c) : undefined,
      width: this.getColumnWidth(c),
    }));
    this.shiftIndices('_row', position, 1);
    for (let c = 0; c < this.cols; c++) {
      const { cell: sourceCell, text: sourceText, width } = sourceData[c];
      const config = this.cellConfigFrom(sourceCell, sourceText, width);
      const [cell, text] = Table.createCellPair(position, c, config);
      this.add(cell, text);
    }
    this.strategy.rows++;
    this.strategy.rowHeights.splice(position, 0, this.minCellHeight);
    this.strategy.manualRowHeights.splice(position, 0, null);
    this.triggerLayout();
  }

  removeRow(position = this.rows - 1) {
    if (this.rows <= 1 || !this.strategy) return;
    this.removeAtIndex('_row', position);
    this.shiftIndices('_row', position, -1);
    this.strategy.rows--;
    this.strategy.rowHeights.splice(position, 1);
    this.strategy.manualRowHeights.splice(position, 1);
    this.triggerLayout();
  }

  addColumn(position = this.cols) {
    if (!this.strategy) return;
    const sourceCol =
      position > 0 ? position - 1 : position < this.cols ? position : null;
    const sourceWidth =
      sourceCol !== null
        ? this.getColumnWidth(sourceCol)
        : Table.defaults.cellWidth;
    const sourceData = Array.from({ length: this.rows }, (_, r) => ({
      cell: sourceCol !== null ? this.getCell(r, sourceCol) : undefined,
      text: sourceCol !== null ? this.getCellText(r, sourceCol) : undefined,
    }));
    this.shiftIndices('_col', position, 1);
    for (let r = 0; r < this.rows; r++) {
      const { cell: sourceCell, text: sourceText } = sourceData[r];
      const config = this.cellConfigFrom(sourceCell, sourceText, sourceWidth);
      const [cell, text] = Table.createCellPair(r, position, config);
      this.add(cell, text);
    }
    this.strategy.cols++;
    this.strategy.columnWidths.splice(position, 0, sourceWidth);
    this.triggerLayout();
  }

  removeColumn(position = this.cols - 1) {
    if (this.cols <= 1 || !this.strategy) return;
    this.removeAtIndex('_col', position);
    this.shiftIndices('_col', position, -1);
    this.strategy.cols--;
    this.strategy.columnWidths.splice(position, 1);
    this.triggerLayout();
  }

  updateCellFill(color: string) {
    this.cellFill = color;
    this.cells
      .filter((c) => !(c as any)._hasCustomFill)
      .forEach((c) => c.set('fill', color));
    this.dirty = true;
  }

  updateCellStroke(color: string) {
    this.cellStroke = color;
    this.cells
      .filter((c) => !(c as any)._hasCustomStroke)
      .forEach((c) => c.set('stroke', color));
    this.dirty = true;
  }

  updateBorderWidth(width: number) {
    this.borderWidth = width;
    if (this.strategy) this.strategy.borderWidth = width;
    this.cells
      .filter((c) => !(c as any)._hasCustomStroke)
      .forEach((c) => c.set('strokeWidth', width));
    this.triggerLayout();
  }

  private expandBoundsToIncludeMergedRegions(
    minRow: number,
    maxRow: number,
    minCol: number,
    maxCol: number,
  ): { minRow: number; maxRow: number; minCol: number; maxCol: number } {
    let expanded = true;
    while (expanded) {
      expanded = false;
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const cell = this.getCell(r, c);
          if (!cell) continue;

          if (cell._isMerged && cell._mergeParent) {
            const { row: masterRow, col: masterCol } = cell._mergeParent;
            const master = this.getCell(masterRow, masterCol);
            if (master) {
              if (masterRow < minRow) {
                minRow = masterRow;
                expanded = true;
              }
              if (masterCol < minCol) {
                minCol = masterCol;
                expanded = true;
              }
              const masterEndRow = masterRow + (master._rowspan ?? 1) - 1;
              const masterEndCol = masterCol + (master._colspan ?? 1) - 1;
              if (masterEndRow > maxRow) {
                maxRow = masterEndRow;
                expanded = true;
              }
              if (masterEndCol > maxCol) {
                maxCol = masterEndCol;
                expanded = true;
              }
            }
          }

          if (cell._colspan && cell._colspan > 1) {
            const endCol = c + cell._colspan - 1;
            if (endCol > maxCol) {
              maxCol = endCol;
              expanded = true;
            }
          }
          if (cell._rowspan && cell._rowspan > 1) {
            const endRow = r + cell._rowspan - 1;
            if (endRow > maxRow) {
              maxRow = endRow;
              expanded = true;
            }
          }
        }
      }
    }
    return { minRow, maxRow, minCol, maxCol };
  }

  private resetCellsInRange(
    minRow: number,
    maxRow: number,
    minCol: number,
    maxCol: number,
  ) {
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cell = this.getCell(r, c);
        const text = this.getCellText(r, c);
        if (cell) {
          cell._colspan = 1;
          cell._rowspan = 1;
          cell._isMerged = false;
          cell._mergeParent = null;
          cell.set('opacity', 1);
        }
        if (text) text.set('opacity', 1);
      }
    }
  }

  private collectTextInRange(
    minRow: number,
    maxRow: number,
    minCol: number,
    maxCol: number,
  ): string {
    const parts: string[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const text = this.getCellText(r, c);
        if (text?.text?.trim()) parts.push(text.text.trim());
      }
    }
    return parts.join('\n');
  }

  private markSlaveCells(
    masterRow: number,
    masterCol: number,
    rowspan: number,
    colspan: number,
  ) {
    for (let r = masterRow; r < masterRow + rowspan; r++) {
      for (let c = masterCol; c < masterCol + colspan; c++) {
        if (r === masterRow && c === masterCol) continue;
        const cell = this.getCell(r, c);
        const text = this.getCellText(r, c);
        if (cell) {
          cell._isMerged = true;
          cell._mergeParent = { row: masterRow, col: masterCol };
          cell.set('opacity', 0);
        }
        if (text) {
          text.set('text', '');
          text.set('opacity', 0);
        }
      }
    }
  }

  mergeCells(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ) {
    const bounds = this.expandBoundsToIncludeMergedRegions(
      Math.min(startRow, endRow),
      Math.max(startRow, endRow),
      Math.min(startCol, endCol),
      Math.max(startCol, endCol),
    );

    this.resetCellsInRange(
      bounds.minRow,
      bounds.maxRow,
      bounds.minCol,
      bounds.maxCol,
    );

    const masterCell = this.getCell(bounds.minRow, bounds.minCol);
    const masterText = this.getCellText(bounds.minRow, bounds.minCol);
    if (!masterCell) return;

    const combinedText = this.collectTextInRange(
      bounds.minRow,
      bounds.maxRow,
      bounds.minCol,
      bounds.maxCol,
    );
    if (masterText) masterText.set('text', combinedText);

    const colspan = bounds.maxCol - bounds.minCol + 1;
    const rowspan = bounds.maxRow - bounds.minRow + 1;
    masterCell._colspan = colspan;
    masterCell._rowspan = rowspan;

    this.markSlaveCells(bounds.minRow, bounds.minCol, rowspan, colspan);

    this.triggerLayout();
  }

  unmergeCells(row: number, col: number) {
    const cell = this.getCell(row, col);
    if (!cell || !cell._colspan || (cell._colspan === 1 && cell._rowspan === 1))
      return;

    const colspan = cell._colspan ?? 1;
    const rowspan = cell._rowspan ?? 1;
    cell._colspan = 1;
    cell._rowspan = 1;

    for (let r = row; r < row + rowspan; r++) {
      for (let c = col; c < col + colspan; c++) {
        if (r === row && c === col) continue;
        const childCell = this.getCell(r, c);
        const childText = this.getCellText(r, c);
        if (childCell) {
          childCell._isMerged = false;
          childCell._mergeParent = null;
          childCell.set('opacity', 1);
        }
        if (childText) childText.set('opacity', 1);
      }
    }

    this.triggerLayout();
  }

  toLocalPoint(canvasPoint: Point): Point {
    const invMatrix = util.invertTransform(this.calcTransformMatrix());
    return util.transformPoint(canvasPoint, invMatrix);
  }

  getCellAtPoint(canvasPoint: Point): { row: number; col: number } | null {
    const contentWidth =
      this.columnWidths.reduce((s, w) => s + w, 0) +
      (this.cols - 1) * this.cellSpacing;
    const contentHeight =
      this.rowHeights.reduce((s, h) => s + h, 0) +
      (this.rows - 1) * this.cellSpacing;

    const local = this.toLocalPoint(canvasPoint);
    const pt = new Point(
      local.x + contentWidth / 2,
      local.y + contentHeight / 2,
    );

    const col = this.findIndexAtPosition(
      pt.x,
      this.cols,
      (c) => this.getColumnWidth(c),
      this.cellSpacing,
    );
    if (col < 0) return null;

    const row = this.findIndexAtPosition(
      pt.y,
      this.rows,
      (r) => this.getRowHeight(r),
      this.cellSpacing,
    );
    if (row < 0) return null;

    const cell = this.getCell(row, col);
    if (cell?._isMerged && cell._mergeParent) {
      return cell._mergeParent;
    }
    return { row, col };
  }

  private findIndexAtPosition(
    position: number,
    count: number,
    getSizeFn: (index: number) => number,
    spacing: number,
  ): number {
    let cumulative = 0;
    for (let i = 0; i < count; i++) {
      const size = getSizeFn(i);
      if (position >= cumulative && position < cumulative + size) return i;
      cumulative += size + spacing;
    }
    return -1;
  }

  getContentDimensions(): { contentWidth: number; contentHeight: number } {
    const contentWidth =
      this.columnWidths.reduce((s, w) => s + w, 0) +
      (this.cols - 1) * this.cellSpacing;
    const contentHeight =
      this.rowHeights.reduce((s, h) => s + h, 0) +
      (this.rows - 1) * this.cellSpacing;
    return { contentWidth, contentHeight };
  }

  toContentPoint(canvasPoint: Point): Point {
    const { contentWidth, contentHeight } = this.getContentDimensions();
    const local = this.toLocalPoint(canvasPoint);
    return new Point(local.x + contentWidth / 2, local.y + contentHeight / 2);
  }

  getBorderPosition(type: 'col' | 'row', index: number): number {
    const { contentWidth, contentHeight } = this.getContentDimensions();
    const halfSpacing = this.cellSpacing / 2;
    const sizes = type === 'col' ? this.columnWidths : this.rowHeights;
    const contentSize = type === 'col' ? contentWidth : contentHeight;
    let pos = 0;
    for (let i = 0; i < index; i++) {
      pos += sizes[i] + this.cellSpacing;
    }
    return pos - halfSpacing - contentSize / 2;
  }

  private findBorderAtPosition(
    position: number,
    count: number,
    getSizeFn: (index: number) => number,
    spacing: number,
    threshold: number,
    contentSize: number,
    otherPos: number,
    otherLimit: number,
  ): { index: number; position: number } | null {
    const halfSpacing = spacing / 2;
    let cumulative = 0;
    for (let i = 0; i <= count; i++) {
      const isInternal = i > 0 && i < count;
      const borderPos = cumulative - halfSpacing;
      if (
        isInternal &&
        Math.abs(position - borderPos) < threshold &&
        otherPos >= 0 &&
        otherPos <= otherLimit
      ) {
        return { index: i, position: borderPos - contentSize / 2 };
      }
      if (i < count) cumulative += getSizeFn(i) + spacing;
    }
    return null;
  }

  private isBorderInsideMerge(
    type: 'col' | 'row',
    index: number,
    otherIndex: number,
  ): boolean {
    if (type === 'col') {
      const cell = this.getCell(otherIndex, index - 1);
      if (cell?._isMerged && cell._mergeParent) {
        const master = this.getCell(
          cell._mergeParent.row,
          cell._mergeParent.col,
        );
        if (master && master._col + (master._colspan ?? 1) > index) return true;
      } else if (cell && (cell._colspan ?? 1) > 1) {
        return true;
      }
    } else {
      const cell = this.getCell(index - 1, otherIndex);
      if (cell?._isMerged && cell._mergeParent) {
        const master = this.getCell(
          cell._mergeParent.row,
          cell._mergeParent.col,
        );
        if (master && master._row + (master._rowspan ?? 1) > index) return true;
      } else if (cell && (cell._rowspan ?? 1) > 1) {
        return true;
      }
    }
    return false;
  }

  getBorderAtPoint(
    canvasPoint: Point,
    threshold = this.borderThreshold,
  ): TableBorderInfo | null {
    const pt = this.toContentPoint(canvasPoint);
    const { contentWidth, contentHeight } = this.getContentDimensions();
    const tx = threshold / this.scaleX;
    const ty = threshold / this.scaleY;

    const row = this.findIndexAtPosition(
      pt.y,
      this.rows,
      (r) => this.getRowHeight(r),
      this.cellSpacing,
    );
    const col = this.findIndexAtPosition(
      pt.x,
      this.cols,
      (c) => this.getColumnWidth(c),
      this.cellSpacing,
    );

    const colBorder = this.findBorderAtPosition(
      pt.x,
      this.cols,
      (c) => this.getColumnWidth(c),
      this.cellSpacing,
      tx,
      contentWidth,
      pt.y,
      contentHeight,
    );
    if (
      colBorder &&
      row >= 0 &&
      !this.isBorderInsideMerge('col', colBorder.index, row)
    ) {
      return { type: 'col', ...colBorder };
    }

    const rowBorder = this.findBorderAtPosition(
      pt.y,
      this.rows,
      (r) => this.getRowHeight(r),
      this.cellSpacing,
      ty,
      contentHeight,
      pt.x,
      contentWidth,
    );
    if (
      rowBorder &&
      col >= 0 &&
      !this.isBorderInsideMerge('row', rowBorder.index, col)
    ) {
      return { type: 'row', ...rowBorder };
    }

    return null;
  }

  getBorderOrIndicatorAtPoint(
    canvasPoint: Point,
    threshold = this.borderThreshold,
  ): {
    border: TableBorderInfo;
    indicatorSide: 'before' | 'after' | null;
  } | null {
    const local = this.toLocalPoint(canvasPoint);
    const { contentWidth, contentHeight } = this.getContentDimensions();
    const halfW = contentWidth / 2;
    const halfH = contentHeight / 2;
    const indicatorOffset = this.indicatorOffset / this.scaleX;
    const indicatorHitRadius = this.indicatorHitRadius / this.scaleX;

    for (let i = 0; i <= this.cols; i++) {
      const x = this.getBorderPosition('col', i);
      const indicatorY = -halfH - indicatorOffset;
      const dx = local.x - x;
      const dy = local.y - indicatorY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const inStem =
        Math.abs(dx) < indicatorHitRadius &&
        local.y >= indicatorY - indicatorHitRadius &&
        local.y <= -halfH;
      if (dist < indicatorHitRadius || inStem) {
        return {
          border: { type: 'col', index: i, position: x },
          indicatorSide: 'before',
        };
      }
    }

    for (let i = 0; i <= this.rows; i++) {
      const y = this.getBorderPosition('row', i);
      const indicatorX = -halfW - indicatorOffset;
      const dx = local.x - indicatorX;
      const dy = local.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const inStem =
        Math.abs(dy) < indicatorHitRadius &&
        local.x >= indicatorX - indicatorHitRadius &&
        local.x <= -halfW;
      if (dist < indicatorHitRadius || inStem) {
        return {
          border: { type: 'row', index: i, position: y },
          indicatorSide: 'before',
        };
      }
    }

    const border = this.getBorderAtPoint(canvasPoint, threshold);
    if (border) {
      return { border, indicatorSide: null };
    }

    return null;
  }

  get selectedCells(): TableCell[] {
    return this._selectedCells
      .map((pos) => this.getCell(pos.row, pos.col))
      .filter((c): c is TableCell => c !== undefined);
  }

  get hasSelection(): boolean {
    return this._selectedCells.length > 0;
  }

  get selectionCount(): number {
    return this._selectedCells.length;
  }

  selectCell(row: number, col: number, extendSelection = false) {
    if (!extendSelection) {
      this._selectedCells = [{ row, col }];
      this._selectionAnchor = { row, col };
    } else if (this._selectionAnchor) {
      this._selectedCells = this.buildSelectionRange(this._selectionAnchor, {
        row,
        col,
      });
    }
    this.dirty = true;
  }

  private buildSelectionRange(
    anchor: CellPosition,
    target: CellPosition,
  ): CellPosition[] {
    const r1 = Math.min(anchor.row, target.row);
    const r2 = Math.max(anchor.row, target.row);
    const c1 = Math.min(anchor.col, target.col);
    const c2 = Math.max(anchor.col, target.col);
    const cells: CellPosition[] = [];
    const seen = new Set<string>();
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        const cell = this.getCell(r, c);
        const pos =
          cell?._isMerged && cell._mergeParent
            ? cell._mergeParent
            : { row: r, col: c };
        const key = `${pos.row},${pos.col}`;
        if (!seen.has(key)) {
          seen.add(key);
          cells.push(pos);
        }
      }
    }
    return cells;
  }

  clearCellSelection() {
    this._selectedCells = [];
    this._selectionAnchor = null;
    this.dirty = true;
  }

  selectAllCells() {
    this._selectedCells = this.buildSelectionRange(
      { row: 0, col: 0 },
      { row: this.rows - 1, col: this.cols - 1 },
    );
    this._selectionAnchor = { row: 0, col: 0 };
    this.dirty = true;
  }

  drawSelectionOverlay(ctx: CanvasRenderingContext2D) {
    if (!this._selectedCells.length && !this._hoveredBorder) return;

    const matrix = this.calcTransformMatrix();
    ctx.save();
    ctx.transform(
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4],
      matrix[5],
    );
    ctx.strokeStyle = this.selectionColor;
    ctx.lineWidth = this.selectionWidth / this.scaleX;

    const drawn = new Set<string>();
    for (const { row, col } of this._selectedCells) {
      const cell = this.getCell(row, col);
      if (!cell || cell._isMerged) continue;
      const key = `${cell._row},${cell._col}`;
      if (drawn.has(key)) continue;
      drawn.add(key);
      ctx.strokeRect(
        cell.left - cell.width / 2,
        cell.top - cell.height / 2,
        cell.width,
        cell.height,
      );
    }

    if (this._hoveredBorder) {
      const { contentWidth, contentHeight } = this.getContentDimensions();
      const { type, position } = this._hoveredBorder;
      const halfW = contentWidth / 2;
      const halfH = contentHeight / 2;
      const offset = this.indicatorOffset / this.scaleX;

      ctx.beginPath();
      if (type === 'col') {
        ctx.moveTo(position, -halfH);
        ctx.lineTo(position, halfH);
      } else {
        ctx.moveTo(-halfW, position);
        ctx.lineTo(halfW, position);
      }
      ctx.stroke();

      if (!this._isDraggingBorder) {
        const r = this.indicatorRadius / this.scaleX;
        const lineLen = r / 2;
        const lineWidth = 1.5 / this.scaleX;
        const indicatorX = type === 'col' ? position : -halfW - offset;
        const indicatorY = type === 'col' ? -halfH - offset : position;

        ctx.fillStyle = this.selectionColor;
        ctx.beginPath();
        ctx.arc(indicatorX, indicatorY, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(indicatorX - lineLen, indicatorY);
        ctx.lineTo(indicatorX + lineLen, indicatorY);
        ctx.moveTo(indicatorX, indicatorY - lineLen);
        ctx.lineTo(indicatorX, indicatorY + lineLen);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  override render(ctx: CanvasRenderingContext2D) {
    super.render(ctx);
    this.drawSelectionOverlay(ctx);
  }

  override toObject(propertiesToInclude: any[] = []) {
    const cellData: CellData[] = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.getCell(r, c);
        const text = this.getCellText(r, c);
        cellData.push({
          row: r,
          col: c,
          fill: cell?.fill as string,
          stroke: cell?.stroke as string,
          hasCustomFill: (cell as any)?._hasCustomFill ?? false,
          hasCustomStroke: (cell as any)?._hasCustomStroke ?? false,
          text: text?.text ?? '',
          textFill: text?.fill as string,
          fontSize: text?.fontSize,
          fontWeight: text?.fontWeight as string,
          fontStyle: text?.fontStyle as string,
          textAlign: text?.textAlign as string,
          verticalAlign: text?.verticalAlign ?? 'middle',
          colspan: cell?._colspan ?? 1,
          rowspan: cell?._rowspan ?? 1,
          isMerged: cell?._isMerged ?? false,
          mergeParent: cell?._mergeParent ?? null,
        });
      }
    }

    return {
      ...(super.toObject as any)(propertiesToInclude),
      rows: this.rows,
      cols: this.cols,
      columnWidths: [...this.columnWidths],
      rowHeights: [...this.rowHeights],
      manualRowHeights: [...(this.strategy?.manualRowHeights ?? [])],
      minCellWidth: this.minCellWidth,
      minCellHeight: this.minCellHeight,
      cellPadding: this.cellPadding,
      cellSpacing: this.cellSpacing,
      cellFill: this.cellFill,
      cellStroke: this.cellStroke,
      borderWidth: this.borderWidth,
      cellData,
    };
  }

  static async fromObject<T extends TOptions<SerializedTableProps>>(
    object: T,
    _abortable?: Abortable,
  ): Promise<Table> {
    const table = new Table(object.rows ?? 3, object.cols ?? 3, {
      cellWidth: object.columnWidths?.[0] ?? 100,
      minCellHeight: object.minCellHeight,
      cellPadding: object.cellPadding,
      cellSpacing: object.cellSpacing ?? 0,
      cellFill: object.cellFill,
      cellStroke: object.cellStroke,
      borderWidth: object.borderWidth ?? 1,
      left: object.left,
      top: object.top,
      scaleX: object.scaleX,
      scaleY: object.scaleY,
      angle: object.angle,
    });

    if (object.columnWidths && table.strategy) {
      table.strategy.columnWidths = [...object.columnWidths];
    }
    if (object.rowHeights && table.strategy) {
      table.strategy.rowHeights = [...object.rowHeights];
    }
    if (object.manualRowHeights && table.strategy) {
      table.strategy.manualRowHeights = [...object.manualRowHeights];
    }

    if (object.cellData) {
      for (const data of object.cellData) {
        const cell = table.getCell(data.row, data.col);
        const text = table.getCellText(data.row, data.col);
        if (cell) {
          cell.set('fill', data.fill);
          cell.set('stroke', data.stroke);
          (cell as any)._hasCustomFill = data.hasCustomFill ?? false;
          (cell as any)._hasCustomStroke = data.hasCustomStroke ?? false;
          cell._colspan = data.colspan ?? 1;
          cell._rowspan = data.rowspan ?? 1;
          cell._isMerged = data.isMerged ?? false;
          cell._mergeParent = data.mergeParent ?? null;
          if (cell._isMerged) cell.set('opacity', 0);
        }
        if (text) {
          text.set({
            text: data.text ?? '',
            fill: data.textFill,
            fontSize: data.fontSize,
            fontWeight: data.fontWeight,
            fontStyle: data.fontStyle,
            textAlign: data.textAlign ?? 'center',
          });
          text.verticalAlign =
            (data.verticalAlign as 'top' | 'middle' | 'bottom') ?? 'middle';
          if (cell?._isMerged) text.set('opacity', 0);
        }
      }
    }

    table.triggerLayout();
    return table;
  }
}

classRegistry.setClass(Table, Table.type);
