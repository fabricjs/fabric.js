# Centering Guidelines

Shows guidelines and snaps objects when dragged to the canvas center.

## How to use it

```ts
import { CenteringGuidelines } from 'fabric/extensions';

const centeringGuidelines = new CenteringGuidelines(canvas);

// To disable later:
centeringGuidelines.dispose();
```

## Options

```ts
new CenteringGuidelines(canvas, {
  margin: 4,                      // Snap distance in pixels
  color: 'rgba(255,0,241,0.5)',   // Line color
  width: 1,                       // Line width
});
```

## Using with script tags

```html
<script src="https://cdn.jsdelivr.net/npm/fabric@7/dist/index.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/fabric@7/dist-extensions/fabric-extensions.min.js"></script>
<script>
  new fabricExtensions.CenteringGuidelines(canvas);
</script>
```
