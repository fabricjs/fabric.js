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
import { createTableEdgeControls } from './tableControls';

export interface TableDefaults {
  cellWidth: number;
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

export class Table extends Group {
  static type = 'Table';

  declare cellFill: string;
  declare cellStroke: string;
  declare borderWidth: number;

  static defaults: TableDefaults = {
    cellWidth: 100,
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
    this.controls = { ...this.controls, ...createTableEdgeControls() };
    this.lockScalingFlip = true;
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

  private shiftIndices(prop: '_row' | '_col', threshold: number, delta: number) {
    for (const obj of this._objects) {
      const item = obj as any;
      if ((item._isCell || item._isCellText) && item[prop] >= threshold) {
        item[prop] += delta;
      }
    }
  }

  private removeAtIndex(prop: '_row' | '_col', index: number) {
    const toRemove = this._objects.filter((o) => {
      const item = o as any;
      return (item._isCell || item._isCellText) && item[prop] === index;
    });
    for (const obj of toRemove) {
      this.remove(obj);
    }
  }

  addRow(position = this.rows) {
    if (!this.strategy) return;
    const sourceRow = position > 0 ? position - 1 : position < this.rows ? position : null;
    this.shiftIndices('_row', position, 1);
    for (let c = 0; c < this.cols; c++) {
      const sourceCell = sourceRow !== null ? this.getCell(sourceRow, c) : undefined;
      const sourceText = sourceRow !== null ? this.getCellText(sourceRow, c) : undefined;
      const config = this.cellConfigFrom(sourceCell, sourceText, this.getColumnWidth(c));
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
    const sourceCol = position > 0 ? position - 1 : position < this.cols ? position : null;
    const sourceWidth = sourceCol !== null ? this.getColumnWidth(sourceCol) : Table.defaults.cellWidth;
    this.shiftIndices('_col', position, 1);
    for (let r = 0; r < this.rows; r++) {
      const sourceCell = sourceCol !== null ? this.getCell(r, sourceCol) : undefined;
      const sourceText = sourceCol !== null ? this.getCellText(r, sourceCol) : undefined;
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

  mergeCells(
    startRow: number,
    startCol: number,
    endRow: number,
    endCol: number,
  ) {
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

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

    const masterCell = this.getCell(minRow, minCol);
    const masterText = this.getCellText(minRow, minCol);
    if (!masterCell) return;

    const textParts: string[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const text = this.getCellText(r, c);
        if (text?.text?.trim()) textParts.push(text.text.trim());
      }
    }
    if (masterText) masterText.set('text', textParts.join('\n'));

    masterCell._colspan = maxCol - minCol + 1;
    masterCell._rowspan = maxRow - minRow + 1;

    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        if (r === minRow && c === minCol) continue;
        const cell = this.getCell(r, c);
        const text = this.getCellText(r, c);
        if (cell) {
          cell._isMerged = true;
          cell._mergeParent = { row: minRow, col: minCol };
          cell.set('opacity', 0);
        }
        if (text) {
          text.set('text', '');
          text.set('opacity', 0);
        }
      }
    }

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

  toObject(propertiesToInclude: string[] = []): SerializedTableProps {
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
