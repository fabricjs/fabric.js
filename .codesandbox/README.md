# CodeSandbox CI

Configuration files, scripts and templates used by [CodeSandbox CI](https://codesandbox.io/docs/ci), [Github Codespaces](https://docs.github.com/en/codespaces) and [Gitpod](https://gitpod.io/from-referrer/)

## Contents

- `ci.json`: configuration for codesandbox ci
- `.mjs`: script files used by our cli
- `templates`: ready to start fabric templates (`next`, `node`, `vanilla`)

## Running a Template

To run a template use the cli.

```bash
npm run sandbox
```

## Developing

```bash
npm start <template>
```

### Start Flow

A sandbox app is started (locally) by our cli as follows:

- [`link`](https://docs.npmjs.com/cli/v8/commands/npm-link) fabric
- install dependencies
- run the `dev` cmd

The app will reload once fabric builds, see [Hot Reload](#hot-reload).

### Adding a Template

First make sure codesandbox supports the framework you would like to create the sandbox with, see the `template` section in [sandbox configuration](https://codesandbox.io/docs/configuration#sandbox-configuration).

- Give a meaningful name to the template's folder, it is used by our cli.
- A template **MUST** expose a `dev` script in `package.json` starting the app locally for our cli.
- Configuring the sandbox is done by adding a `sandbox.config.json` file, see [sandbox configuration](https://codesandbox.io/docs/configuration#sandbox-configuration).
- Creating a `.codesandboxignore` file tells the deploy script what to ignore. Deploying is restricted in size so be vigilant with deployed assets.
- Adding the `.codesandbox` suffix to a file tells the deploy script to deploy the suffixed file instead of it's counterpart that will be used only locally. e.g. `index.ts` will be used locally whereas `index.codesandbox.ts` will be used by the deployed codesandbox.
- See existing [templates](./templates) for reference.

Once the template is initialized run `npm start <template>` and you're ready to go.

### Hot Reload

Unfortunately, hot reload is a pain when trying to watch a linked dependency (though it is an absolute MUST for CI).
To workaround that, the cli informs the framework to perform a hot reload when fabric builds by modifying the sandbox's `package.json` file.

A better solution will be appreciated.
