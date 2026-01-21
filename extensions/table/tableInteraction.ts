import {
  getFabricDocument,
  Point,
  Textbox,
  util,
  type Canvas,
  type TPointerEvent,
} from 'fabric';
import { Table, type TableBorderInfo } from './Table';

const getDocument = (el: HTMLElement) =>
  el.ownerDocument || getFabricDocument();

const calcDistance = (dx: number, dy: number) => Math.sqrt(dx * dx + dy * dy);

function getResizeLimitFeedback(
  startPosition: number,
  newPosition: number,
  dragDelta: number,
  scale: number,
): number {
  const positionMoved = Math.abs(newPosition - startPosition) >= 0.5;
  if (positionMoved || Math.abs(dragDelta) <= 1) return 0;
  return (
    (Math.sign(dragDelta) * Math.min(1.5, Math.abs(dragDelta) * 0.1)) / scale
  );
}

interface BorderDragState {
  table: Table;
  border: TableBorderInfo;
  startPoint: { x: number; y: number };
  startWidths: number[];
  startHeights: number[];
  selectedCols: number[];
  selectedRows: number[];
  savedSelection: { row: number; col: number }[];
  savedAnchor: { row: number; col: number } | null;
}

interface ClickState {
  table: Table;
  point: { x: number; y: number };
  shiftKey: boolean;
}

interface EditorState {
  textbox: Textbox;
  table: Table;
  row: number;
  col: number;
}

interface ClipboardCell {
  row: number;
  col: number;
  fill: string;
  text: string;
  textFill: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  textAlign: string;
}

let borderDrag: BorderDragState | null = null;
let clickStart: ClickState | null = null;
let editor: EditorState | null = null;
let finishingEdit = false;
let clipboard: ClipboardCell[] | null = null;
let pendingIndicatorClick: { table: Table; border: TableBorderInfo } | null =
  null;
const CLICK_THRESHOLD = 5;

const CURSOR_MAP = ['ew', 'nwse', 'ns', 'nesw'];

export function getBorderCursor(
  angle: number,
  borderType: 'col' | 'row',
): string {
  const baseIndex = borderType === 'col' ? 0 : 2;
  const normalizedAngle = ((angle % 180) + 180) % 180;
  const rotationIndex = Math.round(normalizedAngle / 45) % 4;
  const index = (baseIndex + rotationIndex) % 4;
  return `${CURSOR_MAP[index]}-resize`;
}

function getTableFromTarget(target: unknown): Table | null {
  if (target instanceof Table) return target;
  if (
    target &&
    typeof target === 'object' &&
    'group' in target &&
    target.group instanceof Table
  ) {
    return target.group;
  }
  return null;
}

function getActiveTable(canvas: Canvas): Table | null {
  const active = canvas.getActiveObject();
  return getTableFromTarget(active);
}

function isControlActive(canvas: Canvas): boolean {
  return !!(canvas as unknown as { _currentTransform?: unknown })
    ._currentTransform;
}

function handleMouseMove(canvas: Canvas, e: { e: TPointerEvent }) {
  if (borderDrag) {
    handleBorderDrag(canvas, e);
    return;
  }

  if (isControlActive(canvas)) {
    return;
  }

  const table = getActiveTable(canvas);
  if (!table) {
    canvas.defaultCursor = 'default';
    return;
  }

  const viewportPoint = canvas.getViewportPoint(e.e);
  const scenePoint = canvas.getScenePoint(e.e);

  if (table.findControl(viewportPoint)) {
    if (table._hoveredBorder) {
      table._hoveredBorder = null;
      canvas.requestRenderAll();
    }
    return;
  }

  const result = table.getBorderOrIndicatorAtPoint(scenePoint);

  if (result?.indicatorSide && result.inCircle) {
    table._hoveredBorder = result.border;
    canvas.defaultCursor = 'pointer';
    table.hoverCursor = 'pointer';
  } else if (result?.indicatorSide) {
    table._hoveredBorder = result.border;
    canvas.defaultCursor = 'default';
    table.hoverCursor = 'default';
  } else if (result?.border) {
    table._hoveredBorder = result.border;
    canvas.defaultCursor = 'default';
    table.hoverCursor = getBorderCursor(
      table.getTotalAngle(),
      result.border.type,
    );
  } else {
    table._hoveredBorder = null;
    canvas.defaultCursor = 'default';
    table.hoverCursor = 'move';
  }

  canvas.requestRenderAll();
}

function borderTouchesSelection(
  borderIndex: number,
  selectedIndices: number[],
): boolean {
  if (selectedIndices.length < 2) return false;
  return (
    selectedIndices.includes(borderIndex - 1) ||
    selectedIndices.includes(borderIndex)
  );
}

function handleBorderDrag(canvas: Canvas, e: { e: TPointerEvent }) {
  if (!borderDrag) return;

  const {
    table,
    border,
    startPoint,
    startWidths,
    startHeights,
    selectedCols,
    selectedRows,
  } = borderDrag;
  const currentPoint = canvas.getScenePoint(e.e);
  const startLocal = table.toLocalPoint(new Point(startPoint.x, startPoint.y));
  const currentLocal = table.toLocalPoint(currentPoint);
  const { index, type } = border;

  if (type === 'col') {
    const delta = currentLocal.x - startLocal.x;

    if (borderTouchesSelection(index, selectedCols)) {
      for (const col of selectedCols) {
        const newWidth = Math.max(table.minCellWidth, startWidths[col] + delta);
        if (table.strategy) {
          table.strategy.columnWidths[col] = newWidth;
        }
      }
    } else {
      const totalWidth = startWidths[index - 1] + startWidths[index];
      const leftWidth = util.capValue(
        table.minCellWidth,
        startWidths[index - 1] + delta,
        totalWidth - table.minCellWidth,
      );
      if (table.strategy) {
        table.strategy.columnWidths[index - 1] = leftWidth;
        table.strategy.columnWidths[index] = totalWidth - leftWidth;
      }
    }
  } else {
    const delta = currentLocal.y - startLocal.y;

    if (borderTouchesSelection(index, selectedRows)) {
      for (const row of selectedRows) {
        const minHeight = table.getRowMinHeight(row);
        const newHeight = Math.max(minHeight, startHeights[row] + delta);
        if (table.strategy) {
          table.strategy.rowHeights[row] = newHeight;
          table.strategy.manualRowHeights[row] = newHeight;
        }
      }
    } else {
      const totalHeight = startHeights[index - 1] + startHeights[index];
      const topMin = table.getRowMinHeight(index - 1);
      const bottomMin = table.getRowMinHeight(index);
      const topHeight = util.capValue(
        topMin,
        startHeights[index - 1] + delta,
        totalHeight - bottomMin,
      );
      const bottomHeight = totalHeight - topHeight;
      if (table.strategy) {
        table.strategy.rowHeights[index - 1] = topHeight;
        table.strategy.rowHeights[index] = bottomHeight;
        table.strategy.manualRowHeights[index - 1] = topHeight;
        table.strategy.manualRowHeights[index] = bottomHeight;
      }
    }
  }

  const startPosition = border.position;
  table.relayout();
  const newPosition = table.getBorderPosition(type, index);
  const dragDelta =
    type === 'col'
      ? currentLocal.x - startLocal.x
      : currentLocal.y - startLocal.y;

  table._hoveredBorder = {
    type,
    index,
    position:
      newPosition +
      getResizeLimitFeedback(
        startPosition,
        newPosition,
        dragDelta,
        table.scaleX,
      ),
  };
  canvas.requestRenderAll();
}

function handleMouseDownBefore(
  canvas: Canvas,
  e: { target?: unknown; e: TPointerEvent },
) {
  pendingIndicatorClick = null;

  const activeTable = getActiveTable(canvas);
  if (!activeTable || !activeTable._hoveredBorder) return;

  const point = canvas.getScenePoint(e.e);
  const result = activeTable.getBorderOrIndicatorAtPoint(point);

  if (result?.indicatorSide && result.inCircle) {
    pendingIndicatorClick = { table: activeTable, border: result.border };
    e.e.stopPropagation?.();
    e.e.preventDefault?.();
  }
}

function handleMouseDown(
  canvas: Canvas,
  e: {
    target?: unknown;
    e: TPointerEvent;
    transform?: { corner?: string };
    alreadySelected?: boolean;
  },
) {
  clickStart = null;

  if (e.transform?.corner) {
    return;
  }

  const table = getTableFromTarget(e.target);
  if (!table) return;

  const point = canvas.getScenePoint(e.e);
  const border = table.getBorderAtPoint(point);

  if (border && e.alreadySelected) {
    startBorderDrag(canvas, table, border, point);
    e.e.stopPropagation?.();
    return;
  }

  clickStart = {
    table,
    point: { x: point.x, y: point.y },
    shiftKey: e.e.shiftKey,
  };
}

function getSelectedColsAndRows(table: Table): {
  cols: number[];
  rows: number[];
} {
  const cols = new Set<number>();
  const rows = new Set<number>();
  for (const { row, col } of table._selectedCells) {
    cols.add(col);
    rows.add(row);
  }
  return {
    cols: [...cols].sort((a, b) => a - b),
    rows: [...rows].sort((a, b) => a - b),
  };
}

function startBorderDrag(
  canvas: Canvas,
  table: Table,
  border: TableBorderInfo,
  point: { x: number; y: number },
) {
  table.lockMovementX = true;
  table.lockMovementY = true;
  table._isDraggingBorder = true;

  const { cols, rows } = getSelectedColsAndRows(table);

  borderDrag = {
    table,
    border,
    startPoint: { x: point.x, y: point.y },
    startWidths: [...table.columnWidths],
    startHeights: [...table.rowHeights],
    selectedCols: cols,
    selectedRows: rows,
    savedSelection: [...table._selectedCells],
    savedAnchor: table._selectionAnchor,
  };

  table.clearCellSelection();
  canvas.requestRenderAll();
}

function handleMouseUp(canvas: Canvas, e: { e: TPointerEvent }) {
  if (borderDrag) {
    const { table, savedSelection, savedAnchor } = borderDrag;
    table.lockMovementX = false;
    table.lockMovementY = false;
    table._isDraggingBorder = false;

    table._selectedCells = savedSelection;
    table._selectionAnchor = savedAnchor;

    borderDrag = null;

    const point = canvas.getScenePoint(e.e);
    const result = table.getBorderOrIndicatorAtPoint(point);
    table._hoveredBorder = result?.border ?? null;
    canvas.requestRenderAll();
    return;
  }

  if (pendingIndicatorClick) {
    const { table, border } = pendingIndicatorClick;
    pendingIndicatorClick = null;

    if (border.type === 'col') {
      table.addColumn(border.index);
    } else {
      table.addRow(border.index);
    }
    table._hoveredBorder = null;
    canvas.setActiveObject(table);
    canvas.requestRenderAll();
    return;
  }

  if (!clickStart) {
    return;
  }

  const { table, point, shiftKey } = clickStart;
  clickStart = null;

  const upPoint = canvas.getScenePoint(e.e);
  const moved = calcDistance(upPoint.x - point.x, upPoint.y - point.y);
  if (moved > CLICK_THRESHOLD) return;

  const cellPos = table.getCellAtPoint(upPoint);
  if (!cellPos) return;

  table.selectCell(cellPos.row, cellPos.col, shiftKey);
  canvas.requestRenderAll();
}

function handleDoubleClick(
  canvas: Canvas,
  e: { target?: unknown; e: TPointerEvent },
) {
  const table = getTableFromTarget(e.target);
  if (!table) return;

  const point = canvas.getScenePoint(e.e);
  const cellPos = table.getCellAtPoint(point);
  if (!cellPos) return;

  startCellEditing(canvas, table, cellPos.row, cellPos.col);
}

function getCellCanvasCenter(table: Table, row: number, col: number): Point {
  const cell = table.getCell(row, col);
  if (!cell) return new Point(0, 0);
  const matrix = table.calcTransformMatrix();
  return util.transformPoint(new Point(cell.left, cell.top), matrix);
}

function startCellEditing(
  canvas: Canvas,
  table: Table,
  row: number,
  col: number,
) {
  if (editor) finishEditing(canvas);

  const cellText = table.getCellText(row, col);
  const cell = table.getCell(row, col);
  if (!cellText || !cell) return;

  table._hoveredBorder = null;
  table._isDraggingBorder = false;
  table.clearCellSelection();

  const center = getCellCanvasCenter(table, row, col);

  const textbox = new Textbox(cellText.text || '', {
    left: center.x,
    top: center.y,
    width: cell.width - table.cellPadding * 2,
    fontSize: cellText.fontSize,
    fontWeight: cellText.fontWeight as string,
    fill: cellText.fill as string,
    textAlign: cellText.textAlign as 'left' | 'center' | 'right' | 'justify',
    originX: 'center',
    originY: 'center',
    splitByGrapheme: true,
    hasControls: false,
    hasBorders: false,
    editingBorderColor: 'transparent',
    scaleX: table.scaleX,
    scaleY: table.scaleY,
    angle: table.angle,
  });

  cellText.set('opacity', 0);
  canvas.add(textbox);
  textbox.setCoords();

  editor = { textbox, table, row, col };

  canvas.setActiveObject(textbox);
  textbox.enterEditing();
  textbox.selectAll();
  canvas.requestRenderAll();
}

function finishEditing(canvas: Canvas, shouldExitEditing = true) {
  if (!editor || finishingEdit) return;
  finishingEdit = true;

  const { textbox, table, row, col } = editor;
  const cellText = table.getCellText(row, col);

  if (cellText) {
    cellText.set({ text: textbox.text, opacity: 1 });
  }

  if (shouldExitEditing && textbox.isEditing) {
    textbox.exitEditing();
  }

  editor = null;

  // Set active object BEFORE removing textbox - this triggers onDeselect
  // while textbox still has canvas reference
  canvas.setActiveObject(table);
  canvas.remove(textbox);

  table.relayout();
  table.setCoords();
  table.selectCell(row, col);

  canvas.requestRenderAll();

  requestAnimationFrame(() => {
    finishingEdit = false;
  });
}

function handleTextChanged(canvas: Canvas, e: { target: unknown }) {
  if (!editor || e.target !== editor.textbox) return;

  const { table, row, col } = editor;
  const cellText = table.getCellText(row, col);

  if (cellText) {
    cellText.set('text', editor.textbox.text);
  }

  table.relayout();
  table.setCoords();

  const center = getCellCanvasCenter(table, row, col);
  editor.textbox.set({ left: center.x, top: center.y });
  editor.textbox.setCoords();

  canvas.requestRenderAll();
}

function handleEditingExited(canvas: Canvas, e: { target: unknown }) {
  if (!editor || e.target !== editor.textbox) return;
  // Defer cleanup until after fabric's exitEditing completes
  // (we're called mid-exitEditing, and fabric still needs this.canvas)
  queueMicrotask(() => finishEditing(canvas, false));
}

function copySelectedCells(table: Table) {
  if (!table.hasSelection) return;

  const cells: ClipboardCell[] = [];
  for (const { row, col } of table._selectedCells) {
    const cell = table.getCell(row, col);
    const text = table.getCellText(row, col);
    if (!cell || cell._isMerged) continue;

    cells.push({
      row,
      col,
      fill: cell.fill as string,
      text: text?.text || '',
      textFill: (text?.fill as string) || '#333333',
      fontSize: (text?.fontSize as number) || 14,
      fontWeight: (text?.fontWeight as string) || 'normal',
      fontStyle: (text?.fontStyle as string) || 'normal',
      textAlign: (text?.textAlign as string) || 'center',
    });
  }

  if (!cells.length) return;

  const minRow = Math.min(...cells.map((c) => c.row));
  const minCol = Math.min(...cells.map((c) => c.col));
  for (const c of cells) {
    c.row -= minRow;
    c.col -= minCol;
  }

  clipboard = cells;
}

function pasteClipboard(canvas: Canvas, table: Table) {
  if (!clipboard || !table.hasSelection) return;

  const anchor = table._selectedCells[0];
  if (!anchor) return;

  for (const data of clipboard) {
    const targetRow = anchor.row + data.row;
    const targetCol = anchor.col + data.col;
    if (targetRow >= table.rows || targetCol >= table.cols) continue;

    const cell = table.getCell(targetRow, targetCol);
    const text = table.getCellText(targetRow, targetCol);

    if (cell && !cell._isMerged) {
      cell.set('fill', data.fill);
    }
    if (text && !cell?._isMerged) {
      text.set({
        text: data.text,
        fill: data.textFill,
        fontSize: data.fontSize,
        fontWeight: data.fontWeight,
        fontStyle: data.fontStyle,
        textAlign: data.textAlign,
      });
    }
  }

  table.relayout();
  table.dirty = true;
  canvas.requestRenderAll();
}

function handleKeyDown(canvas: Canvas, e: KeyboardEvent) {
  if (editor?.textbox.isEditing) {
    if (e.key === 'Escape') {
      finishEditing(canvas);
      e.preventDefault();
      e.stopPropagation();
    }
    return;
  }

  const table = getActiveTable(canvas);
  if (!table) return;

  if (e.key === 'Escape') {
    if (table.hasSelection) {
      table.clearCellSelection();
      canvas.requestRenderAll();
    } else {
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
    e.preventDefault();
    return;
  }

  if (!table.hasSelection) return;

  const isModifier = e.metaKey || e.ctrlKey;

  if (isModifier && e.key === 'a') {
    e.preventDefault();
    table.selectAllCells();
    canvas.requestRenderAll();
    return;
  }

  if (isModifier && e.key === 'c') {
    copySelectedCells(table);
    return;
  }

  if (isModifier && e.key === 'x') {
    copySelectedCells(table);
    for (const { row, col } of table._selectedCells) {
      const text = table.getCellText(row, col);
      if (text) text.set('text', '');
    }
    table.relayout();
    canvas.requestRenderAll();
    return;
  }

  if (isModifier && e.key === 'v') {
    pasteClipboard(canvas, table);
    return;
  }

  if (isModifier && e.key === 'm') {
    e.preventDefault();
    if (e.shiftKey) {
      const selected = table._selectedCells[0];
      if (selected) {
        table.unmergeCells(selected.row, selected.col);
        canvas.requestRenderAll();
      }
    } else if (table._selectedCells.length > 1) {
      const rows = table._selectedCells.map((c) => c.row);
      const cols = table._selectedCells.map((c) => c.col);
      table.mergeCells(
        Math.min(...rows),
        Math.min(...cols),
        Math.max(...rows),
        Math.max(...cols),
      );
      canvas.requestRenderAll();
    }
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    const selected = table._selectedCells[0];
    if (selected) {
      startCellEditing(canvas, table, selected.row, selected.col);
    }
    return;
  }

  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    for (const { row, col } of table._selectedCells) {
      const text = table.getCellText(row, col);
      if (text) text.set('text', '');
    }
    table.relayout();
    canvas.requestRenderAll();
    return;
  }

  if (isNavigationKey(e.key)) {
    e.preventDefault();
    navigateCell(canvas, table, e.key, e.shiftKey);
  }
}

function isNavigationKey(key: string): boolean {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(
    key,
  );
}

function navigateCell(
  canvas: Canvas,
  table: Table,
  key: string,
  shiftKey: boolean,
) {
  const current = table._selectedCells[0];
  if (!current) return;

  const { row, col } = current;
  const { rows, cols } = table;
  let newRow = row;
  let newCol = col;

  switch (key) {
    case 'ArrowUp':
      newRow = Math.max(0, row - 1);
      break;
    case 'ArrowDown':
      newRow = Math.min(rows - 1, row + 1);
      break;
    case 'ArrowLeft':
      newCol = Math.max(0, col - 1);
      break;
    case 'ArrowRight':
      newCol = Math.min(cols - 1, col + 1);
      break;
    case 'Tab':
      if (shiftKey) {
        newCol = col - 1;
        if (newCol < 0) {
          newCol = cols - 1;
          newRow = Math.max(0, row - 1);
        }
      } else {
        newCol = col + 1;
        if (newCol >= cols) {
          newCol = 0;
          newRow = Math.min(rows - 1, row + 1);
        }
      }
      break;
  }

  if (newRow !== row || newCol !== col) {
    table.selectCell(newRow, newCol);
    canvas.requestRenderAll();
  }
}

function handleDeselected(canvas: Canvas, e: { deselected?: unknown[] }) {
  if (!e.deselected) return;

  for (const obj of e.deselected) {
    const table = getTableFromTarget(obj);
    if (!table) continue;

    table._hoveredBorder = null;
    table._selectedCells = [];
    table._selectionAnchor = null;
  }
  canvas.requestRenderAll();
}

export function initTableInteraction(canvas: Canvas): () => void {
  const onMouseMove = (e: { e: TPointerEvent }) => handleMouseMove(canvas, e);
  const onMouseDownBefore = (e: { target?: unknown; e: TPointerEvent }) =>
    handleMouseDownBefore(canvas, e);
  const onMouseDown = (e: { target?: unknown; e: TPointerEvent }) =>
    handleMouseDown(canvas, e);
  const onMouseUp = (e: { e: TPointerEvent }) => handleMouseUp(canvas, e);
  const onDoubleClick = (e: { target?: unknown; e: TPointerEvent }) =>
    handleDoubleClick(canvas, e);
  const onTextChanged = (e: { target: unknown }) =>
    handleTextChanged(canvas, e);
  const onEditingExited = (e: { target: unknown }) =>
    handleEditingExited(canvas, e);
  const onDeselected = (e: { deselected?: unknown[] }) =>
    handleDeselected(canvas, e);
  const onKeyDown = (e: KeyboardEvent) => handleKeyDown(canvas, e);

  const doc = getDocument(canvas.upperCanvasEl);

  canvas.on('mouse:move', onMouseMove);
  canvas.on('mouse:down:before', onMouseDownBefore);
  canvas.on('mouse:down', onMouseDown);
  canvas.on('mouse:up', onMouseUp);
  canvas.on('mouse:dblclick', onDoubleClick);
  canvas.on('text:changed', onTextChanged);
  canvas.on('text:editing:exited', onEditingExited);
  canvas.on('selection:cleared', onDeselected);
  doc.addEventListener('keydown', onKeyDown);

  return () => {
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:down:before', onMouseDownBefore);
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:up', onMouseUp);
    canvas.off('mouse:dblclick', onDoubleClick);
    canvas.off('text:changed', onTextChanged);
    canvas.off('text:editing:exited', onEditingExited);
    canvas.off('selection:cleared', onDeselected);
    doc.removeEventListener('keydown', onKeyDown);
  };
}
