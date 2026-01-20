# Table Extension

A Table class extending Group with spreadsheet-like layout and interaction.

## Features

- **Layout**: Auto-sizing rows to text content via TableLayoutStrategy
- **Controls**: Custom circle corners, segment edges, rotation handle
- **Resize**: Edge controls resize outer row/column, internal border drag resizes adjacent
- **Selection**: Cell selection with range selection (shift+click), selection overlay
- **Editing**: Add/remove rows/columns, cell merging/unmerging
- **Serialization**: Full toObject/fromObject support

## Usage

```typescript
import { Table, initTableBorderInteraction } from 'fabric/extensions';

const table = new Table(3, 4, {
  cellWidth: 100,
  minCellHeight: 40,
});
canvas.add(table);

// Enable internal border drag interaction
const cleanup = initTableBorderInteraction(canvas);
```

## Done
- [x] Table class extending Group
- [x] TableLayoutStrategy for auto-sizing rows to text content
- [x] Custom controls (circle corners, segment edges, rotation)
- [x] Edge resize controls (ml, mr, mt, mb)
- [x] Internal column/row border drag
- [x] Cell selection with range selection
- [x] Selection overlay rendering
- [x] Add/remove rows and columns
- [x] Cell merging and unmerging
- [x] Full serialization
- [x] Unit tests (50 passing)

## TODO
- [ ] Custom cursor for border drag
- [ ] Cell text editing (double-click)
- [ ] Keyboard navigation
