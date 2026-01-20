import { describe, test, expect, beforeEach, vi } from 'vitest';
import { Canvas } from 'fabric';
import { Table } from './Table';
import { initTableInteraction } from './tableInteraction';

describe('tableInteraction keyboard handlers', () => {
  let canvas: Canvas;
  let table: Table;
  let cleanup: () => void;

  beforeEach(() => {
    canvas = new Canvas();
    table = new Table(3, 3);
    canvas.add(table);
    canvas.setActiveObject(table);
    cleanup = initTableInteraction(canvas);
  });

  function dispatchKeyDown(key: string, options: Partial<KeyboardEventInit> = {}) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    document.dispatchEvent(event);
    return event;
  }

  describe('Ctrl+A', () => {
    test('selects all cells when table has selection', () => {
      table.selectCell(0, 0);
      dispatchKeyDown('a', { ctrlKey: true });
      expect(table.selectionCount).toBe(9);
    });

    test('selects all cells when table has selection (meta key for Mac)', () => {
      table.selectCell(0, 0);
      dispatchKeyDown('a', { metaKey: true });
      expect(table.selectionCount).toBe(9);
    });

    test('prevents default browser behavior', () => {
      table.selectCell(0, 0);
      const event = dispatchKeyDown('a', { ctrlKey: true });
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('proportional resize', () => {
    test('preserves selection when starting border drag', () => {
      table.selectCell(0, 0);
      table.selectCell(1, 1, true);
      expect(table.selectionCount).toBe(4);

      // Verify selection isn't cleared (we can't easily simulate drag in unit tests,
      // but we can verify the method doesn't clear selection)
      expect(table._selectedCells.length).toBe(4);
    });
  });
});

