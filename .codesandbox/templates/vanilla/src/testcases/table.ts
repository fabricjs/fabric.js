import * as fabric from 'fabric';
import { Table, initTableInteraction } from 'fabric/extensions';
import type { TOriginX, TOriginY } from 'fabric';

export async function testCase(canvas: fabric.Canvas) {
  canvas.setDimensions({ width: 800, height: 500 });

  initTableInteraction(canvas);

  const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
  const $$ = (selector: string) => document.querySelectorAll(selector);

  const tablePanel = $<HTMLElement>('tablePanel');
  const cellPanel = $<HTMLElement>('cellPanel');
  const emptyState = $<HTMLElement>('emptyState');
  const cellInfo = $<HTMLElement>('cellInfo');
  const mergeControls = $<HTMLElement>('mergeControls');
  const mergeBtn = $<HTMLButtonElement>('mergeBtn');
  const unmergeBtn = $<HTMLButtonElement>('unmergeBtn');
  const zoomLevel = $<HTMLElement>('zoomLevel');

  let currentTable: Table | null = null;

  function getSelectedTable(): Table | null {
    const active = canvas.getActiveObject();
    return active instanceof Table ? active : null;
  }

  function updateUI() {
    const table = getSelectedTable();
    currentTable = table;

    if (table) {
      tablePanel.classList.remove('hidden');
      emptyState.classList.add('hidden');

      $<HTMLInputElement>('cellPadding').value = String(table.cellPadding);
      $<HTMLElement>('cellPaddingVal').textContent = String(table.cellPadding);
      $<HTMLInputElement>('cellSpacing').value = String(table.cellSpacing);
      $<HTMLElement>('cellSpacingVal').textContent = String(table.cellSpacing);
      $<HTMLInputElement>('borderWidth').value = String(table.cellStrokeWidth);
      $<HTMLElement>('borderWidthVal').textContent = String(table.cellStrokeWidth);
      $<HTMLInputElement>('tableCellFill').value = table.cellFill;
      $<HTMLInputElement>('tableCellStroke').value = table.cellStroke;

      $('resizeSingle').classList.toggle('active', table.edgeResizeMode === 'single');
      $('resizeProportional').classList.toggle('active', table.edgeResizeMode === 'proportional');

      $('insertRedistribute').classList.toggle('active', table.columnInsertMode === 'redistribute');
      $('insertExpand').classList.toggle('active', table.columnInsertMode === 'expand');

      $<HTMLInputElement>('showInsert').checked = table.showInsertIndicators;
      $<HTMLInputElement>('showDelete').checked = table.showDeleteIndicators;

      $$('.origin-btn').forEach((btn) => {
        const el = btn as HTMLElement;
        const isActive = el.dataset.ox === table.reflowOriginX && el.dataset.oy === table.reflowOriginY;
        el.classList.toggle('active', isActive);
      });

      if (table.hasSelection) {
        cellPanel.classList.remove('hidden');
        const count = table.selectionCount;
        const pos = table._selectedCells[0];
        cellInfo.textContent = count > 1 ? `${count} cells` : pos ? `${pos.row + 1},${pos.col + 1}` : '—';

        const firstCell = table.selectedCells[0];
        const canMerge = count >= 2;
        const canUnmerge = count === 1 && firstCell && ((firstCell._colspan ?? 1) > 1 || (firstCell._rowspan ?? 1) > 1);

        mergeControls.classList.toggle('hidden', !canMerge && !canUnmerge);
        mergeBtn.classList.toggle('hidden', !canMerge);
        unmergeBtn.classList.toggle('hidden', !canUnmerge);

        if (count === 1 && firstCell) {
          const text = table.getCellText(firstCell._row, firstCell._col);
          $<HTMLInputElement>('cellFill').value = (firstCell.fill as string) || '#ffffff';
          if (text) {
            $<HTMLInputElement>('textColor').value = (text.fill as string) || '#333333';
            $<HTMLInputElement>('fontSize').value = String(text.fontSize || 14);
            $<HTMLElement>('fontSizeVal').textContent = String(text.fontSize || 14);
          }
        }
      } else {
        cellPanel.classList.add('hidden');
      }
    } else {
      tablePanel.classList.add('hidden');
      cellPanel.classList.add('hidden');
      emptyState.classList.toggle('hidden', canvas.getObjects().some((o) => o instanceof Table));
    }
  }

  function createTable() {
    const table = new Table(4, 4, {
      cellWidth: 100,
      minCellHeight: 40,
      cellPadding: 8,
      cellFill: '#ffffff',
      cellStroke: '#e0e0e0',
      cellStrokeWidth: 1,
      edgeResizeMode: 'proportional',
      borderColor: '#2563eb',
    });

    canvas.add(table);
    canvas.centerObject(table);
    canvas.setActiveObject(table);
    updateUI();
  }

  function updateZoomDisplay() {
    zoomLevel.textContent = `${Math.round(canvas.getZoom() * 100)}%`;
  }

  function zoom(factor: number) {
    const newZoom = Math.max(0.1, Math.min(5, canvas.getZoom() * factor));
    canvas.zoomToPoint(new fabric.Point(canvas.width! / 2, canvas.height! / 2), newZoom);
    updateZoomDisplay();
    canvas.requestRenderAll();
  }

  // Header
  $('addTable').onclick = createTable;
  $('zoomIn').onclick = () => zoom(1.2);
  $('zoomOut').onclick = () => zoom(1 / 1.2);
  $('zoomReset').onclick = () => {
    canvas.setZoom(1);
    updateZoomDisplay();
    canvas.requestRenderAll();
  };

  // Table panel
  $('deleteTable').onclick = () => {
    if (currentTable) {
      canvas.remove(currentTable);
      canvas.discardActiveObject();
      updateUI();
    }
  };

  $('removeRow').onclick = () => {
    if (!currentTable || currentTable.rows <= 1) return;
    const sel = currentTable._selectedCells[0];
    currentTable.removeRow(sel?.row ?? currentTable.rows - 1);
    currentTable.clearCellSelection();
    canvas.requestRenderAll();
    updateUI();
  };

  $('removeCol').onclick = () => {
    if (!currentTable || currentTable.cols <= 1) return;
    const sel = currentTable._selectedCells[0];
    currentTable.removeColumn(sel?.col ?? currentTable.cols - 1);
    currentTable.clearCellSelection();
    canvas.requestRenderAll();
    updateUI();
  };

  $('resizeSingle').onclick = () => {
    if (!currentTable) return;
    currentTable.edgeResizeMode = 'single';
    updateUI();
  };

  $('resizeProportional').onclick = () => {
    if (!currentTable) return;
    currentTable.edgeResizeMode = 'proportional';
    updateUI();
  };

  $('insertRedistribute').onclick = () => {
    if (!currentTable) return;
    currentTable.columnInsertMode = 'redistribute';
    updateUI();
  };

  $('insertExpand').onclick = () => {
    if (!currentTable) return;
    currentTable.columnInsertMode = 'expand';
    updateUI();
  };

  $<HTMLInputElement>('showInsert').onchange = function () {
    if (!currentTable) return;
    currentTable.showInsertIndicators = (this as HTMLInputElement).checked;
    canvas.requestRenderAll();
  };

  $<HTMLInputElement>('showDelete').onchange = function () {
    if (!currentTable) return;
    currentTable.showDeleteIndicators = (this as HTMLInputElement).checked;
    canvas.requestRenderAll();
  };

  $$('.origin-btn').forEach((btn) => {
    (btn as HTMLElement).onclick = () => {
      if (!currentTable) return;
      const el = btn as HTMLElement;
      currentTable.reflowOriginX = el.dataset.ox as TOriginX;
      currentTable.reflowOriginY = el.dataset.oy as TOriginY;
      updateUI();
    };
  });

  const bindRange = (id: string, valId: string, setter: (v: number) => void) => {
    $<HTMLInputElement>(id).oninput = function () {
      const val = parseInt((this as HTMLInputElement).value);
      $(valId).textContent = String(val);
      setter(val);
      canvas.requestRenderAll();
    };
  };

  bindRange('cellPadding', 'cellPaddingVal', (v) => currentTable && (currentTable.cellPadding = v));
  bindRange('cellSpacing', 'cellSpacingVal', (v) => currentTable && (currentTable.cellSpacing = v));
  bindRange('borderWidth', 'borderWidthVal', (v) => currentTable?.updateBorderWidth(v));

  $<HTMLInputElement>('tableCellFill').oninput = function () {
    currentTable?.updateCellFill((this as HTMLInputElement).value);
    canvas.requestRenderAll();
  };

  $<HTMLInputElement>('tableCellStroke').oninput = function () {
    currentTable?.updateCellStroke((this as HTMLInputElement).value);
    canvas.requestRenderAll();
  };

  // Cell panel
  $('mergeBtn').onclick = () => {
    if (!currentTable || currentTable.selectionCount < 2) return;
    const cells = currentTable._selectedCells;
    const rows = cells.map((c) => c.row);
    const cols = cells.map((c) => c.col);
    currentTable.mergeCells(Math.min(...rows), Math.min(...cols), Math.max(...rows), Math.max(...cols));
    currentTable.clearCellSelection();
    canvas.requestRenderAll();
    updateUI();
  };

  $('unmergeBtn').onclick = () => {
    if (!currentTable) return;
    const sel = currentTable._selectedCells[0];
    if (sel) {
      currentTable.unmergeCells(sel.row, sel.col);
      canvas.requestRenderAll();
      updateUI();
    }
  };

  $<HTMLInputElement>('cellFill').oninput = function () {
    if (!currentTable) return;
    const color = (this as HTMLInputElement).value;
    for (const pos of currentTable._selectedCells) {
      const cell = currentTable.getCell(pos.row, pos.col);
      if (cell) {
        cell.set('fill', color);
        (cell as any)._hasCustomFill = true;
      }
    }
    canvas.requestRenderAll();
  };

  $<HTMLInputElement>('textColor').oninput = function () {
    if (!currentTable) return;
    const color = (this as HTMLInputElement).value;
    for (const pos of currentTable._selectedCells) {
      const text = currentTable.getCellText(pos.row, pos.col);
      if (text) text.set('fill', color);
    }
    canvas.requestRenderAll();
  };

  bindRange('fontSize', 'fontSizeVal', (v) => {
    if (!currentTable) return;
    for (const pos of currentTable._selectedCells) {
      const text = currentTable.getCellText(pos.row, pos.col);
      if (text) text.set('fontSize', v);
    }
    currentTable.relayout();
  });

  const setAlign = (align: string) => {
    if (!currentTable) return;
    for (const pos of currentTable._selectedCells) {
      const text = currentTable.getCellText(pos.row, pos.col);
      if (text) text.set('textAlign', align);
    }
    canvas.requestRenderAll();
  };

  $('alignLeft').onclick = () => setAlign('left');
  $('alignCenter').onclick = () => setAlign('center');
  $('alignRight').onclick = () => setAlign('right');

  $('toggleBold').onclick = () => {
    if (!currentTable) return;
    for (const pos of currentTable._selectedCells) {
      const text = currentTable.getCellText(pos.row, pos.col);
      if (text) text.set('fontWeight', text.fontWeight === 'bold' ? 'normal' : 'bold');
    }
    currentTable.relayout();
    canvas.requestRenderAll();
  };

  $('toggleItalic').onclick = () => {
    if (!currentTable) return;
    for (const pos of currentTable._selectedCells) {
      const text = currentTable.getCellText(pos.row, pos.col);
      if (text) text.set('fontStyle', text.fontStyle === 'italic' ? 'normal' : 'italic');
    }
    canvas.requestRenderAll();
  };

  // Events
  canvas.on('selection:created', updateUI);
  canvas.on('selection:updated', updateUI);
  canvas.on('selection:cleared', updateUI);
  canvas.on('object:removed', updateUI);
  canvas.on('mouse:up', () => setTimeout(updateUI, 0));

  updateZoomDisplay();
  createTable();
}
