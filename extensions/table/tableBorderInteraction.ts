import type { Canvas, TPointerEvent } from 'fabric';
import { Table, type TableBorderInfo } from './Table';

interface BorderDragState {
  table: Table;
  border: TableBorderInfo;
  startPoint: { x: number; y: number };
  startWidths: number[];
  startHeights: number[];
}

let borderDrag: BorderDragState | null = null;

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

function handleMouseMove(canvas: Canvas, e: { e: TPointerEvent }) {
  if (borderDrag) {
    handleBorderDrag(canvas, e);
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
  canvas.defaultCursor = border
    ? border.type === 'col'
      ? 'col-resize'
      : 'row-resize'
    : 'default';
  canvas.requestRenderAll();
}

function handleBorderDrag(canvas: Canvas, e: { e: TPointerEvent }) {
  if (!borderDrag) return;

  const { table, border, startPoint, startWidths, startHeights } = borderDrag;
  const currentPoint = canvas.getViewportPoint(e.e);
  const startLocal = table.toLocalPoint({ x: startPoint.x, y: startPoint.y });
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
  e: { target: unknown; e: TPointerEvent },
) {
  const table = getTableFromTarget(e.target);
  if (!table) return;

  const point = canvas.getViewportPoint(e.e);
  const border = table.getBorderAtPoint(point);

  if (border) {
    startBorderDrag(canvas, table, border, point);
    e.e.stopPropagation?.();
  }
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

function handleMouseUp(canvas: Canvas) {
  if (!borderDrag) return;

  borderDrag.table.lockMovementX = false;
  borderDrag.table.lockMovementY = false;
  borderDrag.table._hoveredBorder = null;
  borderDrag = null;
  canvas.requestRenderAll();
}

function drawTableOverlays(canvas: Canvas) {
  const ctx = canvas.getContext();
  for (const obj of canvas.getObjects()) {
    if (obj instanceof Table) {
      obj.drawSelectionOverlay(ctx);
    }
  }
}

export function initTableBorderInteraction(canvas: Canvas): () => void {
  const onMouseMove = (e: { e: TPointerEvent }) => handleMouseMove(canvas, e);
  const onMouseDown = (e: { target: unknown; e: TPointerEvent }) =>
    handleMouseDown(canvas, e);
  const onMouseUp = () => handleMouseUp(canvas);
  const onAfterRender = () => drawTableOverlays(canvas);

  canvas.on('mouse:move', onMouseMove);
  canvas.on('mouse:down', onMouseDown);
  canvas.on('mouse:up', onMouseUp);
  canvas.on('after:render', onAfterRender);

  return () => {
    canvas.off('mouse:move', onMouseMove);
    canvas.off('mouse:down', onMouseDown);
    canvas.off('mouse:up', onMouseUp);
    canvas.off('after:render', onAfterRender);
  };
}
