import { Point, Textbox, util, type Canvas, type TPointerEvent } from 'fabric';
import { Table, type TableBorderInfo } from './Table';

interface BorderDragState {
  table: Table;
  border: TableBorderInfo;
  startPoint: { x: number; y: number };
  startWidths: number[];
  startHeights: number[];
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

let borderDrag: BorderDragState | null = null;
let clickStart: ClickState | null = null;
let editor: EditorState | null = null;
let finishingEdit = false;
const CLICK_THRESHOLD = 5;

const CURSOR_MAP = ['ew', 'nwse', 'ns', 'nesw'];

export function getBorderCursor(angle: number, borderType: 'col' | 'row'): string {
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
  return !!(canvas as unknown as { _currentTransform?: unknown })._currentTransform;
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

  const point = canvas.getViewportPoint(e.e);
  const border = table.getBorderAtPoint(point);
  table._hoveredBorder = border;
  table.hoverCursor = border
    ? getBorderCursor(table.getTotalAngle(), border.type)
    : 'move';
  canvas.requestRenderAll();
}

function handleBorderDrag(canvas: Canvas, e: { e: TPointerEvent }) {
  if (!borderDrag) return;

  const { table, border, startPoint, startWidths, startHeights } = borderDrag;
  const currentPoint = canvas.getViewportPoint(e.e);
  const startLocal = table.toLocalPoint(new Point(startPoint.x, startPoint.y));
  const currentLocal = table.toLocalPoint(currentPoint);
  const { index, type } = border;

  if (type === 'col') {
    const delta = currentLocal.x - startLocal.x;
    const totalWidth = startWidths[index - 1] + startWidths[index];
    const leftWidth = Math.max(
      table.minCellWidth,
      Math.min(startWidths[index - 1] + delta, totalWidth - table.minCellWidth),
    );
    if (table.strategy) {
      table.strategy.columnWidths[index - 1] = leftWidth;
      table.strategy.columnWidths[index] = totalWidth - leftWidth;
    }
  } else {
    const delta = currentLocal.y - startLocal.y;
    const totalHeight = startHeights[index - 1] + startHeights[index];
    const topHeight = Math.max(
      table.minCellHeight,
      Math.min(startHeights[index - 1] + delta, totalHeight - table.minCellHeight),
    );
    const bottomHeight = totalHeight - topHeight;
    if (table.strategy) {
      table.strategy.rowHeights[index - 1] = topHeight;
      table.strategy.rowHeights[index] = bottomHeight;
      table.strategy.manualRowHeights[index - 1] = topHeight;
      table.strategy.manualRowHeights[index] = bottomHeight;
    }
  }

  table.triggerLayout();
  table._hoveredBorder = {
    type,
    index,
    position: table.getBorderPosition(type, index),
  };
  canvas.requestRenderAll();
}

function handleMouseDown(
  canvas: Canvas,
  e: { target?: unknown; e: TPointerEvent; transform?: { corner?: string } },
) {
  clickStart = null;

  if (e.transform?.corner) {
    return;
  }

  const table = getTableFromTarget(e.target);
  if (!table) return;

  const point = canvas.getViewportPoint(e.e);
  const border = table.getBorderAtPoint(point);

  if (border) {
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

function startBorderDrag(
  canvas: Canvas,
  table: Table,
  border: TableBorderInfo,
  point: { x: number; y: number },
) {
  table.lockMovementX = true;
  table.lockMovementY = true;
  table.clearCellSelection();

  borderDrag = {
    table,
    border,
    startPoint: { x: point.x, y: point.y },
    startWidths: [...table.columnWidths],
    startHeights: [...table.rowHeights],
  };

  canvas.requestRenderAll();
}

function handleMouseUp(canvas: Canvas, e: { e: TPointerEvent }) {
  if (borderDrag) {
    borderDrag.table.lockMovementX = false;
    borderDrag.table.lockMovementY = false;
    borderDrag.table._hoveredBorder = null;
    borderDrag = null;
    canvas.requestRenderAll();
    return;
  }

  if (!clickStart) return;

  const { table, point, shiftKey } = clickStart;
  clickStart = null;

  const upPoint = canvas.getViewportPoint(e.e);
  const distance = Math.hypot(upPoint.x - point.x, upPoint.y - point.y);
  if (distance > CLICK_THRESHOLD) return;

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

  const point = canvas.getViewportPoint(e.e);
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
  canvas.remove(textbox);

  table.triggerLayout();
  table.setCoords();
  table.selectCell(row, col);

  editor = null;

  canvas.setActiveObject(table);
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

  table.triggerLayout();
  table.setCoords();

  const center = getCellCanvasCenter(table, row, col);
  editor.textbox.set({ left: center.x, top: center.y });
  editor.textbox.setCoords();

  canvas.requestRenderAll();
}

function handleEditingExited(canvas: Canvas, e: { target: unknown }) {
  if (!editor || e.target !== editor.textbox) return;
  finishEditing(canvas, false);
}

function handleKeyDown(canvas: Canvas, e: KeyboardEvent) {
  if (editor?.textbox.isEditing) {
    if (e.key === 'Escape') {
      finishEditing(canvas);
      e.preventDefault();
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
    table.triggerLayout();
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

function drawTableOverlays(canvas: Canvas) {
  const ctx = canvas.getContext();
  for (const obj of canvas.getObjects()) {
    if (obj instanceof Table) {
      obj.drawSelectionOverlay(ctx);
    }
  }
}

export function initTableInteraction(canvas: Canvas): () => void {
  const onMouseMove = (e: { e: TPointerEvent }) => handleMouseMove(canvas, e);
  const onMouseDown = (e: { target?: unknown; e: TPointerEvent }) =>
    handleMouseDown(canvas, e);
  const onMouseUp = (e: { e: TPointerEvent }) => handleMouseUp(canvas, e);
  const onDoubleClick = (e: { target?: unknown; e: TPointerEvent }) =>
    handleDoubleClick(canvas, e);
  const onTextChanged = (e: { target: unknown }) =>
    handleTextChanged(canvas, e);
  const onEditingExited = (e: { target: unknown }) =>
    handleEditingExited(canvas, e);
  const onAfterRender = () => drawTableOverlays(canvas);
  const onKeyDown = (e: KeyboardEvent) => handleKeyDown(canvas, e);

  canvas.on('mouse:move', onMouseMove);
  canvas.on('mouse:down', onMouseDown);
  canvas.on('mouse:up', onMouseUp);
  canvas.on('mouse:dblclick', onDoubleClick);
  canvas.on('text:changed', onTextChanged);
  canvas.on('text:editing:exited', onEditingExited);
  canvas.on('after:render', onAfterRender);
  document.addEventListener('keydown', onKeyDown);

  return () => {
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:up', onMouseUp);
    canvas.off('mouse:dblclick', onDoubleClick);
    canvas.off('text:changed', onTextChanged);
    canvas.off('text:editing:exited', onEditingExited);
    canvas.off('after:render', onAfterRender);
    document.removeEventListener('keydown', onKeyDown);
  };
}
