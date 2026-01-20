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

### Resize
- [x] Drag internal column/row borders to resize
- [x] Row resize respects text content minimum
- [x] Edge handles resize outer row/column
- [x] Angle-aware cursors for border drag

### Structure
- [x] Add/remove rows and columns
- [x] Cell merging (colspan/rowspan)
- [x] Cell unmerging

## TODO (for UI layer)
- [ ] Multi-cell style edits (apply fill/stroke to all selected)
