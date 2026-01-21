# Table Extension

A Table class extending Group with spreadsheet-like layout and interaction.

## Usage

```typescript
import { Table, initTableInteraction } from 'fabric/extensions';

const table = new Table(3, 4, {
  cellWidth: 100,
  minCellHeight: 40,
});
canvas.add(table);

// Enable all table interactions
const cleanup = initTableInteraction(canvas);
```

## Reflow Origin

When rows/columns are added, the table expands. The `reflowOriginX` and `reflowOriginY` properties control which point stays fixed during expansion.

```typescript
// Default: top-left stays fixed, table grows down and right
const table = new Table(3, 3);
table.addRow();  // top-left corner doesn't move

// Center stays fixed, table expands equally in all directions
const centeredTable = new Table(3, 3, {
  reflowOriginX: 'center',
  reflowOriginY: 'center',
});

// Bottom-right stays fixed, table grows up and left
const bottomRightTable = new Table(3, 3, {
  reflowOriginX: 'right',
  reflowOriginY: 'bottom',
});
```

This is independent of the table's visual `originX`/`originY` (which defaults to center/center like all Fabric objects). This separation allows tables to be centered on canvas while still growing predictably from a corner when content is added.

## Feature Checklist

### Core

- [x] Table class extending Group
- [x] TableLayoutStrategy for auto-sizing rows to text content
- [x] Full serialization (toObject/fromObject)
- [x] Unit tests (71 passing)

### Controls

- [x] Custom circle corners with 2px stroke
- [x] Custom segment edge handles with 2px stroke
- [x] Rotation handle matching corner style
- [x] Edge resize controls (ml, mr, mt, mb)

### Movement & Transform

- [x] Drag table to move
- [x] Works at any scale (zoom, transform)
- [x] Configurable reflow origin (reflowOriginX/reflowOriginY)

### Cell Selection

- [x] Click cell to select
- [x] Shift+click for range selection
- [x] Selection overlay renders behind controls

### Cell Editing

- [x] Double-click cell to edit text
- [x] Enter to start editing selected cell
- [x] Text changes reflow row heights automatically

### Keyboard

- [x] Arrow keys to navigate cells
- [x] Tab/Shift+Tab to move between cells
- [x] Delete/Backspace to clear cell content
- [x] Escape to back out: Text → Cell → Table
- [x] Ctrl/Cmd+C/X/V to copy/cut/paste cells
- [x] Ctrl/Cmd+A to select all cells
- [x] Ctrl/Cmd+M to merge, Ctrl/Cmd+Shift+M to unmerge

### Resize

- [x] Drag internal column/row borders to resize
- [x] Row resize respects text content minimum
- [x] Edge handles resize outer row/column (single mode)
- [x] Edge resize mode: `'single'` (default) or `'proportional'` (scales all cells)
- [x] Angle-aware cursors for border drag
- [x] Proportional resize: drag border touching selected cells to resize all equally
- [x] Visual feedback when dragging borders at minimum size limit

### Structure

- [x] Add/remove rows and columns
- [x] Cell merging (colspan/rowspan)
- [x] Cell unmerging
- [x] Insert indicators: hover outside table edges to show "+" buttons for adding rows/columns

## TODO (extension)

- [ ] Zoom-aware indicator sizing

## TODO (for UI layer)

The extension is headless. A complete table editor UI would include:

- [ ] Toolbar with row/column insert/delete buttons
- [ ] Cell fill and stroke color pickers
- [ ] Text color, font size, and alignment controls
- [ ] Table-wide defaults (padding, spacing, border width)
- [ ] Multi-cell style edits (apply styles to all selected cells)
- [ ] Merge/unmerge buttons (keyboard shortcuts exist: Ctrl+M)
- [ ] Context menu for right-click actions

See `fabric-table.html` demo for a reference implementation.
