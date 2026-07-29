# @fabricjs/core

Environment-neutral Fabric.js core runtime.

`@fabricjs/core` is the shared runtime used by `@fabricjs/browser` and
`@fabricjs/node`. Most applications should import one of those environment
entrypoints instead of importing core directly.

This package has no Node-specific runtime dependencies, but it is not a
DOM-free API. If an advanced integration imports core directly and uses APIs
that touch DOM or canvas, it must provide a suitable environment
implementation.

Keep this package on the same version as every other `@fabricjs/*` package and
the legacy `fabric` facade in the application.
