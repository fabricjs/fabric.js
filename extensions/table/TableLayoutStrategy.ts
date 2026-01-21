import { Point, classRegistry } from 'fabric';
import type { FabricObject } from 'fabric';
import type { LayoutStrategyResult, StrictLayoutContext } from 'fabric';
import { LayoutStrategy } from 'fabric';

export interface TableCell extends FabricObject {
  _isCell: true;
  _row: number;
  _col: number;
  _colspan?: number;
  _rowspan?: number;
  _isMerged?: boolean;
  _mergeParent?: { row: number; col: number } | null;
  _text?: TableCellText;
  _hasCustomFill?: boolean;
  _hasCustomStroke?: boolean;
}

export interface TableCellText extends FabricObject {
  _isCellText: true;
  _row: number;
  _col: number;
  _cell?: TableCell;
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: string;
  verticalAlign?: 'top' | 'middle' | 'bottom';
}

export class TableLayoutStrategy extends LayoutStrategy {
  static type = 'table-layout';

  declare rows: number;
  declare cols: number;
  declare minCellWidth: number;
  declare minCellHeight: number;
  declare cellPadding: number;
  declare cellSpacing: number;
  declare borderWidth: number;
  declare columnWidths: number[];
  declare rowHeights: number[];
  declare manualRowHeights: (number | null)[];

  constructor(
    options: Partial<{
      rows: number;
      cols: number;
      cellWidth: number;
      minCellWidth: number;
      minCellHeight: number;
      cellPadding: number;
      cellSpacing: number;
      borderWidth: number;
    }> = {},
  ) {
    super();
    const defaultWidth = options.cellWidth ?? 100;
    this.rows = options.rows ?? 3;
    this.cols = options.cols ?? 3;
    this.minCellWidth = options.minCellWidth ?? 40;
    this.minCellHeight = options.minCellHeight ?? 40;
    this.cellPadding = options.cellPadding ?? 8;
    this.cellSpacing = options.cellSpacing ?? 0;
    this.borderWidth = options.borderWidth ?? 1;
    this.columnWidths = new Array(this.cols).fill(defaultWidth);
    this.rowHeights = new Array(this.rows).fill(this.minCellHeight);
    this.manualRowHeights = new Array(this.rows).fill(null);
  }

  shouldPerformLayout() {
    return true;
  }

  calcBoundingBox(
    objects: FabricObject[],
    context: StrictLayoutContext,
  ): LayoutStrategyResult | undefined {
    const textsByCell = this.indexTextsByCell(objects);
    this.rowHeights = this.calculateRowHeights(textsByCell);

    const contentWidth =
      this.columnWidths.reduce((sum, w) => sum + w, 0) +
      (this.cols - 1) * this.cellSpacing;
    const contentHeight =
      this.rowHeights.reduce((sum, h) => sum + h, 0) +
      (this.rows - 1) * this.cellSpacing;

    const columnXPositions = this.buildPositions(
      this.cols,
      this.columnWidths,
      this.cellSpacing,
    );
    const rowYPositions = this.buildPositions(
      this.rows,
      this.rowHeights,
      this.cellSpacing,
    );

    this.positionCells(
      objects,
      contentWidth,
      contentHeight,
      columnXPositions,
      rowYPositions,
    );

    const size = new Point(
      contentWidth + this.borderWidth,
      contentHeight + this.borderWidth,
    );

    if (context.type === 'initialization' || !context.target) {
      return { center: new Point(0, 0), size };
    }

    return { center: context.target.getRelativeCenterPoint(), size };
  }

  private indexTextsByCell(objects: FabricObject[]): Map<string, TableCellText> {
    const textsByCell = new Map<string, TableCellText>();
    for (const obj of objects) {
      const text = obj as TableCellText;
      if (text._isCellText) {
        textsByCell.set(`${text._row},${text._col}`, text);
      }
    }
    return textsByCell;
  }

  private calculateRowHeights(
    textsByCell: Map<string, TableCellText>,
  ): number[] {
    const heights: number[] = [];
    for (let r = 0; r < this.rows; r++) {
      let maxTextHeight = 0;
      for (let c = 0; c < this.cols; c++) {
        const text = textsByCell.get(`${r},${c}`);
        if (text) {
          const textWidth = this.columnWidths[c] - this.cellPadding * 2;
          text.set('width', textWidth);
          if (typeof (text as any)._splitText === 'function') {
            (text as any)._splitText();
          }
          if (typeof (text as any).calcTextHeight === 'function') {
            maxTextHeight = Math.max(
              maxTextHeight,
              (text as any).calcTextHeight(),
            );
          }
        }
      }
      const manualHeight = this.manualRowHeights[r];
      const textNeeds = maxTextHeight + this.cellPadding * 2;
      const baseHeight =
        manualHeight !== null ? manualHeight : this.minCellHeight;
      heights.push(Math.max(baseHeight, textNeeds));
    }
    return heights;
  }

  private buildPositions(
    count: number,
    sizes: number[],
    spacing: number,
  ): number[] {
    const positions = [0];
    for (let i = 0; i < count - 1; i++) {
      positions.push(positions[i] + sizes[i] + spacing);
    }
    return positions;
  }

  private positionCells(
    objects: FabricObject[],
    contentWidth: number,
    contentHeight: number,
    columnXPositions: number[],
    rowYPositions: number[],
  ) {
    for (const obj of objects) {
      const cell = obj as TableCell;
      if (!cell._isCell || cell._isMerged) continue;

      const colspan = cell._colspan ?? 1;
      const rowspan = cell._rowspan ?? 1;

      let cellWidth = 0;
      for (let c = 0; c < colspan; c++) {
        cellWidth += this.columnWidths[cell._col + c] ?? 0;
        if (c > 0) cellWidth += this.cellSpacing;
      }

      let cellHeight = 0;
      for (let r = 0; r < rowspan; r++) {
        cellHeight += this.rowHeights[cell._row + r] ?? 0;
        if (r > 0) cellHeight += this.cellSpacing;
      }

      const x =
        columnXPositions[cell._col] - contentWidth / 2 + cellWidth / 2;
      const y = rowYPositions[cell._row] - contentHeight / 2 + cellHeight / 2;

      cell.set({
        left: x,
        top: y,
        width: cellWidth,
        height: cellHeight,
        originX: 'center',
        originY: 'center',
      });
      cell.setCoords();

      if (cell._text) {
        const textY = this.calculateTextY(y, cellHeight, cell._text);
        cell._text.set({
          left: x,
          top: textY,
          width: cellWidth - this.cellPadding * 2,
          originX: 'center',
          originY: 'center',
        });
        cell._text.setCoords();
      }
    }
  }

  private calculateTextY(
    cellY: number,
    rowHeight: number,
    text: TableCellText,
  ): number {
    let textHeight = 0;
    if (typeof (text as any).calcTextHeight === 'function') {
      textHeight = (text as any).calcTextHeight();
    }
    const vAlign = text.verticalAlign ?? 'middle';
    if (vAlign === 'top') {
      return cellY - rowHeight / 2 + textHeight / 2 + this.cellPadding;
    }
    if (vAlign === 'bottom') {
      return cellY + rowHeight / 2 - textHeight / 2 - this.cellPadding;
    }
    return cellY;
  }

  getColumnWidth(col: number): number {
    return this.columnWidths[col] ?? this.minCellWidth;
  }

  getRowHeight(row: number): number {
    return this.rowHeights[row] ?? this.minCellHeight;
  }
}

classRegistry.setClass(TableLayoutStrategy, TableLayoutStrategy.type);
