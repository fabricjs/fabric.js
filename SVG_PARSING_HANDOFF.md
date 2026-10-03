# Handoff: extract SVG parsing into an optional package

Status: proposed implementation plan; no runtime changes implemented.

Repository baseline inspected: 2026-09-12, workspace packages at version 7.4.0.

## Objective and scope

Move Fabric's SVG document import and element conversion into `@fabricjs/svg`.
Applications using `@fabricjs/core`, `@fabricjs/browser`, or `@fabricjs/node`
must be able to construct, render, and deserialize Fabric objects without
installing or loading the SVG parser. Imported objects must use the same core
constructors as objects created by the application.

This extraction covers parsing, not SVG export. Keep `toSVG()`, `_toSVG()`, the
SVG export mixins, canvas export, and gradient/pattern/shadow export in core for
now. A smaller parser-free core will still contain SVG export code.

Also keep path-data parsing and geometry used by `new Path(...)`, text-on-path,
brushes, and rendering. SVG-shaped data is not sufficient reason to move a
utility: ownership follows its remaining callers.

## Proposed decisions

These are concrete defaults for implementation review, not previously approved
release policy.

| Area                 | Proposed choice                                                                      |
| -------------------- | ------------------------------------------------------------------------------------ |
| Package              | `packages/svg`, published as `@fabricjs/svg`; initially import-only                  |
| Dependency           | SVG depends on core; core and environment packages never depend on SVG               |
| Runtime identity     | Externalize `@fabricjs/core`; do not bundle another copy into the SVG ESM package    |
| Public loaders       | Preserve loader names, argument order, async behavior, and result shape              |
| Element conversion   | Typed functions and SVG-owned handlers replace core `fromElement` statics            |
| Registration         | Parser-owned tag-to-handler registry; JSON registry remains in core                  |
| Default support      | Standard SVG tags work without importing/registering each shape manually             |
| Customization        | Explicit parser instances with overridable handlers and typed construction factories |
| Root `fabric` facade | Retain top-level SVG loaders by re-exporting from the SVG package                    |
| Static compatibility | No automatic class mutation in the main SVG entry point                              |
| Release              | Treat removal of statics, registry APIs, and scoped-package exports as breaking      |

Using ordinary functions for parsing avoids needing mixins or module augmentation
in this phase. The earlier method-adapter idea primarily addresses instance SVG
export methods; parsing is mostly factory statics and top-level functions.

If unchanged `Rect.fromElement()` and `classRegistry.setSVGClass()` calls are a
release requirement, resolve the compatibility branch below before removing
those APIs. Do not silently claim full compatibility because loaders still work.

## Consumer API

Proposed browser usage, with existing loader signatures:

```ts
import { Canvas, Rect } from '@fabricjs/browser';
import { loadSVGFromString } from '@fabricjs/svg';

const canvas = new Canvas('canvas');
const result = await loadSVGFromString(markup, undefined, { signal });

for (const object of result.objects) {
  if (object) {
    canvas.add(object);
    if (object instanceof Rect) {
      object.set({ rx: 4 });
    }
  }
}
```

Node consumers import their classes/environment from `@fabricjs/node` and the
same loaders from `@fabricjs/svg`. Core-only consumers supply an environment
through core's existing environment API.

Retain these contracts rather than redesigning them during extraction:

- `loadSVGFromString(string, reviver?, options?)`.
- `loadSVGFromURL(url, reviver?, options?)`.
- `parseSVGDocument(document, reviver?, options?)`.
- `Promise<SVGParsingOutput>` with `objects`, `elements`, `options`, and
  `allElements`. `objects` remains `(FabricObject | null)[]`.
- The reviver receives the source element and the constructed Fabric object.
- `LoadImageOptions`, including `crossOrigin` and `signal`, continues to flow
  through the appropriate document and image-loading paths.

Export parsing types from SVG, including `SVGParsingOutput`,
`TSvgReviverCallback`, `CSSRules`, and the moved gradient import `SVGOptions`.
Keep shared image-loading, geometry, and gradient model types in core. Distinguish
the import reviver type from the export reviver type `TSVGReviver`.

The root `fabric` and `fabric/node` entry points remain convenience distributions
that include parsing. Scoped packages provide the parser-free choice. Here,
"optional" means consumers choose whether to depend on SVG; it does not mean
declaring an npm `optionalDependencies` entry while unconditionally importing it.

## Source inventory and ownership

Paths below are relative to the repository root. Recheck references before moving
code; these are the inspected starting points, not a frozen file list.

| Current location                                                                                   | Extraction work                                                                                                                                                                            |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/core/src/parser/`                                                                        | Move document loaders, DOM traversal, CSS/style/attribute parsing, transforms, viewBox handling, use expansion, gradient references, clip-path resolution, types, and their tests into SVG |
| `packages/core/src/shapes/Rect.ts`, `Circle.ts`, `Ellipse.ts`, `Line.ts`, `Path.ts`, `Polyline.ts` | Move `fromElement`, `ATTRIBUTE_NAMES`, and parser imports into per-shape handlers                                                                                                          |
| `packages/core/src/shapes/Polygon.ts`                                                              | Preserve its inherited polyline conversion with the Polygon constructor                                                                                                                    |
| `packages/core/src/shapes/Text/Text.ts`                                                            | Move element conversion, SVG attributes, whitespace/anchor/baseline adjustments; retain text layout and SVG export                                                                         |
| `packages/core/src/shapes/Image.ts`                                                                | Move element conversion and import-specific preserve-aspect-ratio processing; retain `fromURL`, image loading, cropping, and rendering                                                     |
| `packages/core/src/gradient/Gradient.ts`, `gradient/parser/`, `gradient/typedefs.ts`               | Move `Gradient.fromElement`, color-stop/coordinate/units parsing, and `SVGOptions`; retain gradient objects, offsets used by their rendering, serialization, and export                    |
| `packages/core/src/ClassRegistry.ts` and shape registration calls                                  | Move SVG registration responsibility; preserve JSON registry behavior and constructor identity                                                                                             |
| `packages/core/src/util/transform_matrix_removal.ts`                                               | Move SVG transform normalization with its tests and helper types                                                                                                                           |
| `packages/core/src/shapes/Object/Object.ts`, `Line.ts`, `Path.ts`, `Polyline.ts`                   | Migrate `_findCenterFromElement` semantics, including every override, to the handler boundary described below                                                                              |
| `packages/core/src/util/misc/svgParsing.ts`                                                        | Split import helpers (`parseUnit`, preserve-aspect-ratio parsing, `getSvgAttributes`) from export helpers (`colorPropToSVG`, `createSVGRect`)                                              |
| `packages/core/src/util/index.ts`, `packages/core/src/index.ts`                                    | Remove moved public exports from core; add replacements to SVG and migration entries                                                                                                       |
| `packages/core/src/parser/constants.ts`                                                            | Separate the shared `reNum` expression before moving parser-specific constants                                                                                                             |

Important exceptions and hidden edges:

- `Shadow.ts`, `util/path/index.ts`, `util/path/regex.ts`, and
  `util/internals/cleanupSvgAttribute.ts` import `reNum` from parser constants.
  Move that expression to a core numeric utility first. Core must not acquire a
  reverse dependency on SVG to parse shadows or paths.
- Audit callers of `cleanupSvgAttribute` to decide its final home; do not move a
  shared utility solely because its name contains SVG.
- `_findCenterFromElement` is polymorphic. The default uses left/top and size;
  Line uses endpoints; Polyline/Polygon uses point bounds; Path uses path bounds.
  Both gradient offsets and transform normalization use these semantics.
  Replacing all implementations with a generic object-center calculation changes
  imported positions.
- `FabricImage.parsePreserveAspectRatioAttribute`, `ParsedPAROffsets`, and the
  `preserveAspectRatio` property require a caller/type audit. Preserve crop,
  scale, and offset results; retain any property proven necessary outside import.
- `util.groupSVGElements` only groups existing objects. It can remain in core
  without retaining a parser dependency, despite its name.
- Triangle currently calls `setSVGClass`, but `triangle` is not in the document
  parser's valid SVG tag list. Do not accidentally expand supported SVG syntax
  when replacing registrations.

Do not migrate files by changing relative imports to
`@fabricjs/core/src/...`: core currently exports only its root and package.json.
Use existing public classes and `util` members. For missing shared facilities,
make small, reviewed core exports or move truly parser-owned helpers into SVG.
Include internal constants, logging/errors, bounds helpers, and text-related
dependencies in this audit. Avoid exporting the whole internal tree.

## Handler design and TypeScript requirements

The default parser owns handlers for `path`, `circle`, `polygon`, `polyline`,
`ellipse`, `rect`, `line`, `image`, and `text`. Importing SVG must not register
methods or SVG classes onto core as a side effect. Building a private default
handler table inside SVG is fine.

An element handler needs to create an object and provide any shape-specific
import-coordinate behavior. Keep this behavior explicit in the handler contract
or internal conversion result so gradients and transforms use the correct center.
Do not create a second broad object model for this purpose.

Provide typed per-shape conversion functions for direct use. For custom
constructors, prefer shape-specific factories because constructor arguments differ:
Rect accepts options, Text accepts text/options, Path accepts path/options, and
Polyline accepts points/options. Image construction is asynchronous through
`fromURL`. A universal `new (...args: any[])` adapter would hide these differences.

Illustrative API direction; names and exact handler context remain to be finalized
in the initial type prototype:

```ts
class CustomRect extends Rect {
  label = 'custom';
}

const rectParser = createRectParser((options) => new CustomRect(options));
// Direct conversion must infer CustomRect, without a caller cast.
const rect = await rectParser.fromElement(element);
rect.label;

const parser = createSVGParser({
  elementParsers: { rect: rectParser },
});
const result = await parser.loadSVGFromString(markup);
// A heterogeneous document still returns FabricObject | null entries.
```

`createSVGParser` should merge overrides into a fresh table of standard handlers.
Overrides apply to nested clip-path conversions as well as top-level elements.
Document how to omit a handler if that feature is offered. Creating two parser
instances must not cause registrations to leak between them. The ordinary loader
functions use a private default parser.

Do not promise that standard handlers are independently tree-shakeable in this
first version: a default parser supporting every shape necessarily references
them. A minimal parser-builder subpath can be a later optimization.

Preserve `new this(...)`/`this.fromURL(...)` extensibility through typed construction
hooks, including Polygon using polyline conversion and custom Text/Image classes.
Test required custom constructor arguments through caller-supplied factories.
Direct conversion should preserve the appropriate concrete return type and
nullability; document parsing must not pretend an arbitrary SVG is one subtype.

Parser-only intermediate properties such as transform matrices, clip-path
references, and clip rules belong to internal parsing types. Avoid strengthening
core object types with states that only exist midway through parsing. A typing
cleanup must not change the existing output shape incidentally.

### Compatibility branch if static methods must survive

An optional `@fabricjs/svg/compat` entry point could install delegating statics
and legacy registry adapters. This is extra work, not required by the proposed
default API above. If selected, its acceptance criteria include:

- Runtime statics, `ATTRIBUTE_NAMES`, and legacy registration behavior agree with
  their declarations; an instance-interface augmentation alone cannot add statics.
- Generic classes and inherited calls produce the correct constructor at runtime.
- Existing custom `fromElement` overrides and `setSVGClass(CustomRect, 'rect')`
  registrations affect all relevant conversion paths.
- Augmentation is isolated to compat and explicitly documented as program-wide,
  not a runtime guarantee that installation has occurred.
- Installation is eager, idempotent, and preserved by bundlers; the main SVG
  entry remains free of core mutation.
- Published declarations pass consumer compilation with `skipLibCheck: false`.

Prototype/class replacement or copying core classes into SVG is not an acceptable
way to satisfy compatibility. Do not make core import the compat entry.

## Behavior to preserve

Use existing fixtures as the baseline. This extraction does not broaden SVG
support, fix unrelated parsing bugs, change defaults, or add a sanitization API.

- Attribute inheritance, CSS selectors and style precedence, units, font parsing,
  text spacing/decoration/anchors, and inherited visibility/opacity.
- Root and nested viewBox transforms, use expansion, references, and filtered
  ancestor/tag behavior. Preserve existing document mutation behavior.
- Linear/radial gradients, inherited gradient definitions, color stops, units,
  opacity, and object-relative offsets.
- Clip-path nesting, reuse across ancestors, cycle handling, coordinate transforms,
  and custom-handler dispatch inside clip paths.
- Images, href/xlink:href, cross-origin options, image smoothing, preserve-aspect-
  ratio, dimensions, and resource/abort behavior.
- Object/element ordering, nullable entries, empty results, options, allElements,
  and reviver timing after gradient/transform/clip-path processing.

Do not normalize failure behavior by assumption. Currently URL loading catches
failures and returns an empty response; a pre-aborted document parse also returns
an empty response. Image element conversion can return null, while downstream
handling needs characterization. Capture existing outcomes for malformed XML,
failed images, unknown tags, missing references, and mid-load aborts before moving
code; track any discovered bug separately instead of silently changing it.

## Package, build, and facade integration

1. Add the SVG manifest, README, source index, and workspace dependency/lockfile
   entries. Use existing package versioning and ESM publication conventions.
   Prefer a compatible core peer dependency plus a workspace development dependency
   to express shared core identity; validate packed installation behavior.
2. Add SVG to `scripts/workspace-packages.mjs`. Workspace discovery in
   `pnpm-workspace.yaml` is already `packages/*`, but build/publish metadata is
   explicit. Externalize core in the SVG package bundle.
3. Add source aliases in the applicable `tsconfig*.json` files and test resolver.
   `tsconfig.packages.build.json` stages declarations through `scripts/build.mjs`;
   verify the new package's published declarations have no source-tree references.
4. Keep environment setup in browser/node. SVG accesses the configured environment
   lazily, including `getFabricWindow().DOMParser`; it must not install an
   environment or import jsdom/canvas itself. Importing the module alone must not
   require browser globals.
5. Update `index.ts` and `index.node.ts` to re-export the SVG loaders and chosen
   parsing types. Add SVG to the root package dependencies. Update facade bundle
   externals so ESM consumers share the same core runtime.
6. Separate full legacy standalone builds from the parser-free browser package
   entry. Currently the root UMD artifacts are copied from the browser standalone
   build, and root CJS builds directly from the node package entry. Merely changing
   the root TypeScript barrel will not preserve parsing in those formats. Update
   `rolldown.config.mjs` and `scripts/build.mjs` accordingly.
7. Audit `fabric.ts`, test fixtures, E2E imports, website usage, and docs. Decide
   explicitly which are testing full-facade behavior and which use scoped APIs.
   Follow the website's own AGENTS.md if editing its files.

Root `util` compatibility also needs an explicit implementation: re-exporting
top-level loaders does not preserve `fabric.util.parseUnit`,
`parsePreserveAspectRatioAttribute`, `getSvgAttributes`, or
`removeTransformMatrixForSvgParsing`. Proposed policy: compose a root utility
facade that retains these names, while scoped core utilities omit moved parsing
helpers. Keep that composition outside core and verify its published types.

## Implementation sequence

Each step should leave a buildable checkpoint. Temporary original implementations
may remain until the coordinated cutover, but the final state has one parser
implementation and no reverse dependency.

1. **Characterize and prototype.** Record existing loader/element/registry APIs,
   failure outcomes, rendering fixtures, and bundle baselines. Resolve static
   compatibility and release policy. Compile a small handler/factory prototype
   against actual generic Fabric classes and emitted declarations.
2. **Separate shared utilities.** Relocate the shared numeric expression and split
   mixed import/export utilities. Establish only the core exports needed by SVG.
   Preserve behavior and run the affected core tests.
3. **Establish the package boundary.** Add packaging, handler contracts, default
   handlers, and a Rect/Polygon slice that demonstrates concrete inference,
   inherited construction, and ordinary core object identity.
4. **Move the complete pipeline.** Migrate the remaining shape handlers, gradients,
   text/images, import-coordinate helpers, document parser, and parser tests.
   Thread the same handler table through all recursive parsing paths.
5. **Cut over together.** Wire facades and consumers, then remove core parsing
   implementations/statics/registrations/types and moved utility exports. Update
   compatibility adapters only if selected. Keep JSON registration intact.
6. **Validate distribution and document migration.** Run parity, type, packed-
   artifact, dependency-absence, and size checks. Add README/API migration notes
   and a notable-change entry under `CHANGELOG.md` / `## [next]` using the existing
   style when the implementation lands.

## Validation and definition of done

### Runtime and visual coverage

- Move parser tests from `packages/core/src/parser/`; move import-specific cases
  from shape and gradient suites while leaving rendering/export cases in core.
- Exercise every standard tag, custom constructors, per-parser registration
  isolation, inherited Polygon behavior, and custom handlers inside clip paths.
- Retain fixture rendering parity for SVG import and import/export round trips.
  `packages/e2e/tests/visual-output/rendering/testcases/svg-import.ts` and
  `z-svg-export.ts` both exercise loading; the latter must not be skipped merely
  because export is outside the extraction scope.
- Verify JSON enlivening, canvas rendering, Path construction, shadows, gradients,
  and `toSVG()` in an installation with no SVG parser package.

### Types, environments, and package isolation

- Compile consumers of core alone, browser + SVG, node + SVG, and the root facade.
  Use packed artifacts without workspace path aliases, with library checking on.
- Assert concrete direct-factory inference, preserved class generics/subclass
  members, correct nullability, and heterogeneous document result types.
- If compat is selected, compile separate programs with and without its
  declarations. One program cannot prove augmentation is absent in another file.
- Fresh-process browser-module imports remain SSR-safe. Real parsing works under
  browser and Node environments; exported objects pass `instanceof` checks against
  application core constructors.
- Extend `scripts/package-smoke.mjs` with a scoped-package-only installation where
  `@fabricjs/svg` is physically absent, and a separate SVG-enabled installation.
  The existing all-workspace-packages fixture alone cannot prove optionality.
- Do not rely on the current Vitest `@fabricjs/core` alias for isolation: it points
  to root `fabric.ts`, which initializes the browser environment and could conceal
  facade dependencies. Use direct core resolution or packed tests for this proof.
- Verify all retained root entry formats, including ESM, UMD, and Node CJS.

### Dependency and size evidence

- Core/browser/node manifests, emitted JavaScript, and declarations must not
  reference `@fabricjs/svg` or its parser implementation. No moved parser sources
  are copied into their artifacts. Shared geometry/export code is allowed.
- Inspect the emitted dependency graph/module list, not just the presence of the
  string "svg": SVG export deliberately remains. Check both source and artifacts.
- Measure before/after using the same build settings and consumer entries: a
  rendering-only application and that application with SVG loading. Record raw,
  minified, and compressed sizes with the commands used. No reduction percentage
  is promised until measured.

Suggested implementation checks, run from the repository root:

```sh
pnpm run test:vitest packages/svg/src
pnpm run test:vitest
pnpm run typecheck
pnpm run playwright:typecheck
pnpm run build
pnpm run smoke:packages
pnpm run test:e2e
```

Use targeted browser/visual runs while iterating, then the relevant full suites
before merging. Run formatting and lint checks appropriate to touched files;
the repository's lint script uses `--fix`. Report any checks that cannot run and
their reason. Do not approve changed snapshots without comparing rendering.

The extraction is complete when parsing works through SVG and the chosen full
facades, parser-free scoped installations work without SVG, types retain useful
inference, existing parsing behavior is preserved, and every intentionally removed
public API has a documented replacement and release treatment.

## Handoff notes

This document is the deliverable for the planning task. Runtime implementation,
type prototypes, compatibility adapters, bundle measurements, and test execution
listed above remain future work. No existing source files were changed for this
handoff.

Before implementation cutover, record the final decision on static/registry
compatibility and the breaking-release target in this document. Remaining API
spelling and handler-context details can be settled by the initial prototype;
they should not trigger a redesign of Fabric's class hierarchy.
