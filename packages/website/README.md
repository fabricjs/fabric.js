# Fabric.js Website

Source for [fabricjs.com](https://fabricjs.com), built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/).

This package lives inside the `fabric.js` monorepo and depends on the local `fabric` workspace build.

## Prerequisites

From the **repository root**:

```bash
pnpm install
pnpm run build        # builds fabric.js (required before the website)
```

## Development

```bash
pnpm --dir packages/website run dev
```

## Production build

```bash
pnpm --dir packages/website run build
```

Output goes to `packages/website/dist`.

## Preview

```bash
pnpm --dir packages/website run preview
```
