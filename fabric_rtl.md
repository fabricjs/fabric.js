# Fix: RTL cursor positioning in `getSelectionStartFromPointer`

## Problem

When a `Textbox` or `IText` object has `direction: 'rtl'` (Hebrew, Arabic), two editing behaviours are completely broken:

1. **Clicking** inside the text always places the cursor at position 0 (the rightmost visual position), regardless of where you actually clicked.
2. **Double-clicking** to select a word never selects anything useful, because it calls `selectWord(getSelectionStartFromPointer(e))` — which is always position 0.

The result is that RTL text is effectively uneditable on the canvas; users can only edit through an external textarea.

## Root cause

`getSelectionStartFromPointer` computes `mouseOffset` by subtracting `_getLeftOffset()` from the local pointer position:

```ts
const mouseOffset = this.canvas
  .getScenePoint(e)
  .transform(invertTransform(this.calcTransformMatrix()))
  .add(new Point(-this._getLeftOffset(), -this._getTopOffset()));
```

`_getLeftOffset()` returns `-width/2` for LTR and `+width/2` for RTL. This means:

| Direction | `mouseOffset.x` range | Represents               |
| --------- | --------------------- | ------------------------ |
| LTR       | `0 → width`           | left edge → right edge ✓ |
| RTL       | `-width → 0`          | left edge → right edge   |

The character bounds (`__charBounds[line][j].left`) always accumulate **left-to-right** starting at 0, where index 0 is the **rightmost** visual character for RTL text.

The loop then does:

```ts
const lineLeftOffset = Math.abs(this._getLineLeftOffset(lineIndex)); // destroys sign
let width = lineLeftOffset; // = 0 for RTL right-align

for (let j = 0; j < charLength; j++) {
  const widthAfter = width + chars[j].kernedWidth; // e.g. 0 + 18 = 18
  if (mouseOffset.x <= widthAfter) {              // -250 <= 18 → ALWAYS true!
    break;
  }
  ...
}
// charIndex is always 0 → cursor always snaps to rightmost position
```

Because `mouseOffset.x` is always negative for RTL and `widthAfter` is immediately positive, the condition fires on the very first character for every click. `Math.abs()` on `_getLineLeftOffset()` also discards the sign that distinguishes left/center/right alignment in RTL.

## Fix

For RTL, compute an `effectiveX` that maps the click into the same coordinate space as `charBounds.left`:

```
effectiveX = lineLeftOffset - mouseOffset.x
```

**Derivation:** The cursor drawn at logical position `j` sits at local-space x = `_getLeftOffset() + boundaries.left`. For RTL right-align `boundaries.left = -charBounds[j].left`, so cursor x = `width/2 - charBounds[j].left`. The click at that position gives `mouseOffset.x = -charBounds[j].left`, therefore `charBounds[j].left = -mouseOffset.x`. For other RTL alignments `lineLeftOffset` is non-zero, giving the general form `charBounds[j].left = lineLeftOffset - mouseOffset.x`, i.e. `effectiveX = lineLeftOffset - mouseOffset.x`.

The loop then becomes structurally identical to the LTR loop, just using `effectiveX` and the signed (not `Math.abs`) `lineLeftOffset`:

```ts
if (this.direction === 'rtl') {
  const lineLeftOffset = this._getLineLeftOffset(lineIndex); // signed
  const effectiveX = lineLeftOffset - mouseOffset.x;
  let w = 0;
  for (let j = 0; j < charLength; j++) {
    const kw = chars[j].kernedWidth;
    const wAfter = w + kw;
    if (effectiveX <= wAfter) {
      if (Math.abs(effectiveX - wAfter) <= Math.abs(effectiveX - w))
        charIndex++;
      break;
    }
    w = wAfter;
    charIndex++;
  }
} else {
  // original LTR logic unchanged
  const lineLeftOffset = Math.abs(this._getLineLeftOffset(lineIndex));
  let width = lineLeftOffset;
  for (let j = 0; j < charLength; j++) {
    const kw = chars[j].kernedWidth;
    const widthAfter = width + kw;
    if (mouseOffset.x <= widthAfter) {
      if (
        Math.abs(mouseOffset.x - widthAfter) <= Math.abs(mouseOffset.x - width)
      )
        charIndex++;
      break;
    }
    width = widthAfter;
    charIndex++;
  }
}
```

## What this fixes

- Single click places the cursor at the correct character position in RTL text.
- Double-click correctly selects the word under the cursor in RTL text (it calls `selectWord(getSelectionStartFromPointer(e))`, so no change needed there).
- All LTR behaviour is unchanged — the RTL branch is entirely additive.
- Works for RTL `textAlign: 'right'` (natural), `'left'`, and `'center'`.

## Known limitation

Mixed bidi lines (e.g. an English word embedded in Hebrew text) may still show slight cursor offset because the browser's bidi algorithm reorders glyphs visually in a way that does not match the logical character order stored in `__charBounds`. This is a deeper issue independent of this fix.

## How to reproduce (before fix)

```js
const canvas = new fabric.Canvas('c');
const text = new fabric.Textbox('שלום עולם', {
  direction: 'rtl',
  textAlign: 'right',
  left: 50,
  top: 50,
  width: 300,
  fontSize: 32,
});
canvas.add(text);
canvas.setActiveObject(text);
text.enterEditing();
// Click anywhere on the text → cursor always jumps to position 0 (far right)
// Double-click any word → nothing selected
```

## Files changed

- `src/shapes/IText/ITextClickBehavior.ts` — `getSelectionStartFromPointer` method
