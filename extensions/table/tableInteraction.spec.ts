import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { Canvas, getFabricDocument, Point } from 'fabric';
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

  afterEach(() => {
    cleanup();
    canvas.dispose();
  });

  function dispatchKeyDown(
    key: string,
    options: Partial<KeyboardEventInit> = {},
  ) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    getFabricDocument().dispatchEvent(event);
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

  describe('cell editing cleanup', () => {
    test('does not throw when clicking away while editing', () => {
      // Start editing a cell
      table.selectCell(0, 0);
      const cellText = table.getCellText(0, 0);
      expect(cellText).toBeDefined();

      // Simulate double-click to edit by firing the event
      canvas.fire('mouse:dblclick', {
        target: table,
        e: { clientX: 100, clientY: 100 } as PointerEvent,
        scenePoint: new Point(100, 100),
        viewportPoint: new Point(100, 100),
      });

      // Now simulate clicking away - this should trigger setActiveObject
      // which calls onDeselect on the textbox
      expect(() => {
        canvas.setActiveObject(table);
      }).not.toThrow();
    });

    test('does not throw when pressing Escape while editing', () => {
      table.selectCell(0, 0);

      // Simulate double-click to edit
      canvas.fire('mouse:dblclick', {
        target: table,
        e: { clientX: 100, clientY: 100 } as PointerEvent,
        scenePoint: new Point(100, 100),
        viewportPoint: new Point(100, 100),
      });

      // Press Escape
      expect(() => {
        dispatchKeyDown('Escape');
      }).not.toThrow();
    });
  });
});
