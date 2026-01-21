import { Control, controlsUtils, type TransformActionHandler } from 'fabric';
import type { Table } from './Table';
import { renderTableSegmentControl, renderTableCircleControl } from './controlRendering';

const { wrapWithFixedAnchor, scalingEqually, rotationWithSnapping } = controlsUtils;

function createEdgeResizeHandler(edge: 'left' | 'right' | 'top' | 'bottom'): TransformActionHandler {
  const isHorizontal = edge === 'left' || edge === 'right';

  return (_eventData, transform, x, y) => {
    const table = transform.target as Table;
    const localPoint = controlsUtils.getLocalPoint(
      transform,
      transform.originX,
      transform.originY,
      x,
      y,
    );

    if (isHorizontal) {
      const spacing = table.cellSpacing * (table.cols - 1);
      const totalWidth = Math.abs(localPoint.x) / table.scaleX;
      const contentWidth = totalWidth - spacing - table.cellStrokeWidth;

      if (table.edgeResizeMode === 'proportional') {
        const oldTotal = table.columnWidths.reduce((s, w) => s + w, 0);
        const scale = contentWidth / oldTotal;
        const newWidths = table.columnWidths.map((w) =>
          Math.max(table.minCellWidth, w * scale),
        );
        const changed = newWidths.some((w, i) => w !== table.columnWidths[i]);
        if (table.strategy) {
          table.strategy.columnWidths = [...newWidths];
          table.triggerLayout();
        }
        return changed;
      }

      const col = edge === 'left' ? 0 : table.cols - 1;
      const otherColsWidth = table.columnWidths.reduce(
        (s, w, i) => (i === col ? s : s + w),
        0,
      );
      const newWidth = Math.max(table.minCellWidth, contentWidth - otherColsWidth);
      const changed = table.columnWidths[col] !== newWidth;
      table.setColumnWidth(col, newWidth);
      return changed;
    }

    const spacing = table.cellSpacing * (table.rows - 1);
    const totalHeight = Math.abs(localPoint.y) / table.scaleY;
    const contentHeight = totalHeight - spacing - table.cellStrokeWidth;

    if (table.edgeResizeMode === 'proportional') {
      const oldTotal = table.rowHeights.reduce((s, h) => s + h, 0);
      const scale = contentHeight / oldTotal;
      const newHeights = table.rowHeights.map((h) =>
        Math.max(table.minCellHeight, h * scale),
      );
      const changed = newHeights.some((h, i) => h !== table.rowHeights[i]);
      if (table.strategy) {
        table.strategy.rowHeights = [...newHeights];
        table.strategy.manualRowHeights = [...newHeights];
        table.triggerLayout();
      }
      return changed;
    }

    const row = edge === 'top' ? 0 : table.rows - 1;
    const otherRowsHeight = table.rowHeights.reduce(
      (s, h, i) => (i === row ? s : s + h),
      0,
    );
    const newHeight = Math.max(table.minCellHeight, contentHeight - otherRowsHeight);
    const changed = table.rowHeights[row] !== newHeight;
    table.setRowHeight(row, newHeight);
    return changed;
  };
}

function createEdgeControl(
  x: number,
  y: number,
  edge: 'left' | 'right' | 'top' | 'bottom',
): Control {
  const isVertical = edge === 'left' || edge === 'right';
  return new Control({
    x,
    y,
    angle: isVertical ? 90 : 0,
    sizeX: isVertical ? 8 : 16,
    sizeY: isVertical ? 16 : 8,
    render: renderTableSegmentControl,
    cursorStyleHandler: controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: wrapWithFixedAnchor(createEdgeResizeHandler(edge)),
    actionName: 'resizing',
  });
}

function createCornerControl(x: number, y: number): Control {
  return new Control({
    x,
    y,
    render: renderTableCircleControl,
    cursorStyleHandler: controlsUtils.scaleCursorStyleHandler,
    actionHandler: scalingEqually,
  });
}

export function createTableControls() {
  return {
    tl: createCornerControl(-0.5, -0.5),
    tr: createCornerControl(0.5, -0.5),
    bl: createCornerControl(-0.5, 0.5),
    br: createCornerControl(0.5, 0.5),
    mtr: new Control({
      x: 0,
      y: -0.5,
      offsetY: -40,
      render: renderTableCircleControl,
      cursorStyleHandler: controlsUtils.rotationStyleHandler,
      actionHandler: rotationWithSnapping,
      actionName: 'rotate',
      withConnection: true,
    }),
    ml: createEdgeControl(-0.5, 0, 'left'),
    mr: createEdgeControl(0.5, 0, 'right'),
    mt: createEdgeControl(0, -0.5, 'top'),
    mb: createEdgeControl(0, 0.5, 'bottom'),
  };
}
