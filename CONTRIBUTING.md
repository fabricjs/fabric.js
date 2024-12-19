# 🎉 Contributing to Fabric 🥳

This guide covers all you need to know from the start, for a first time contributor, advancing to the more advanced topics as you continue reading.

## 🧐 Questions?!?

Questions are legit but that doesn't make them bug reports...\
Please refer to available resources (read below) and refrain from opening an issue in such a case.

To find an answer, first [search the repository][search_issues]. It contains a lot of useful threads.

Questions might inspire you to [improve the docs](#-improving-docs) 🌈 Please do 🌟.

Demos and examples 🤓 can be found on [fabricjs.com][website], [`jsfiddle`][jsfiddles], [`codepen.io`][codepens] and more.

## 🏷️ Issue Tracker

- **Before You Begin** 🎬
  - 📌 Make sure you didn't fall into a known [**GOTCHA**][gotchas].
  - 🔎 [**Searching**][search_issues] for existing issues and discussions is
    🔋 **VITAL** in order to keep the community in a good state, prevent spamming 👎 and become a skilled fabric dev 🦉.
- **Fill out the [🐛 report][bug_report] with care**, it is there for a reason.
- The **Title** must be informative, short and 🧿 to the point.
- **Description**
  - Describe the issue making sure you are very clear.
  - Add (📎) logs, screenshots or videos if that makes sense.
  - Make an effort explaining yourself!
  - A good description has been read at least **3** times **before submitting**.
- **Test Case**
  - Create a minimal and immediate test case, reproducing the bug.
  - Add relevant explanations.
  - It should be extremely **easy** for someone to understand your bug and **fast** to reproduce it. **Don't leave it to us to do your part**.
  - Bug templates can be found within a bug report.
- Specify which **version** of Fabric.js you are using.
- **Upgrade** to the latest version before proceeding, your 🐛 may have turned into a 🦋.

**These are minimal requirements. Without them issues shall be ⛔.**

If it's not a bug **OR** if you're unsure, start a 🤠 [discussion][discussions].

Check out [**Helping Out**](#%EF%B8%8F-helping-out).

---

## 🔦 Fixing typos

Typos are a nasty thing.\
Though it may seem insignificant, typo fixes are appreciated!\
It's a good and simple way to start contributing.

## 🔎 Improving Docs

Improving **DOCS** is **SUPER** important for everyone.\
Even if it's a small fix it is valuable 💎... **don't hesitate**!

We plan on building a brand new website, stay tuned.

## ❤️ Helping Out

Answering questions and addressing issues, as well as fixing and adding types (see [Pull Requests](#-pull-requests)), are great ways to start contributing to fabric.

- [Issues][issues]
- [Discussions][discussions]

### 🎮 Adding a DEMO (currently not possible)

**New website is under construction. Contributions are welcome.**

Take a look at an existing [demo file][demo_file].\
Create a new file in the same directory (`posts/demos/_posts`) and follow [**developing the website**](#fabricjscom-deprecated).

### ~~`fabricjs.com`~~ (currently not possible)

To develop fabric's site you need to clone [`fabricjs.com`][website_repo] in the same parent folder of [`fabric.js`][repo], so that `fabric.js` and `fabricjs.com` are siblings.

To start the dev server run `npm start:dev` inside the `fabricjs.com` directory (after installing dependencies).

If you are working on windows, check out [`jekyll` docs][jekyll] for further instructions or use [WSL][wsl].

## 🐛 Fixing Bugs

- Open an [issue](#-issue-tracker), if there isn't any, addressing the bug.
- Fix the bug, see [Developing](#-developing-).
- Add [tests](#-testing).
- [PR](#-pull-requests)

## 🚀 Pull Requests

Fabric is an open source project 🦄 and as such depends on the **genuine effort** of individuals and the community as a whole.
**Join Us** to make Fabric better 🌺 .

### Getting Started

- Read this section through.
- Take a look at [**GOTCHAS**][gotchas]
- Follow [Developing](#-developing-) and [Testing](#-testing).

### ✅ Guidelines

- **Be patient** \
  Sometimes it takes time to get back to you. Someone eventually will. Having a small, concise and super clear change will make maintainers more prone to handle it quickly.
- **Code Style** \
  Fabric uses [`prettier`][prettier] to format files and [`eslint`][eslint] for linting (`npm run lint -- --fix`).\
  To enjoy a seamless dev experience add the [`Prettier - Code formatter`][prettier_extension] extension via the extensions toolbar in VSCode.
  If that doesn't work, once the PR is ready run `npm run prettier:write` and commit the changes.
  Do not reorder imports. Irrelevant changes in a PR that are not created by prettier aren't needed nor welcome.
- **Tests** \
  PRs must be backed with relevant tests, follow [TESTING](#-testing). If you never wrote a test or you find our tests unclear to extend, just ask for help.
  Aim to cover 100% of the changes.
- **Docs** \
  Update guides if necessary.\
  Add relevant comments to your code using [JSDoc3][jsdoc], [JSDoc reference supported by TS][tsjsdoc].\
  The generated documentation can be found at [fabricjs.com][docs], see [DOCS](#-improving-docs).
- **Changelog**\
  Add a concise listing to the [**CHANGELOG**](CHANGELOG.md) describing what has changed or let github actions add the PR title for you.
- **1️⃣ PR per feature/bug** \
  Create a new branch for every pull request.\
  If you want to do more than one thing, create multiple pull requests 💪.
  If your bug fix or feature requires a refactor, don't refactor. Commit the bugfix or the feature with the current code structure, let it sink, give some time to surface issues with the change, then when the bug or the feature seem solid, a refactor or code improvement can be tried
- **And there you go!** \
  If you still have questions we're always happy to help.

After you open a PR a maintainer will review it.
It is more than likely you will be requested to change stuff and refine your work before it is merged into the repo.

## 🧪 Testing

[![🩺](../../actions/workflows/build.yml/badge.svg)](../../actions/workflows/build.yml)
[![🧪](../../actions/workflows/tests.yml/badge.svg)](../../actions/workflows/tests.yml)
[![CodeQL](../../actions/workflows/codeql-analysis.yml/badge.svg)](../../actions/workflows/codeql-analysis.yml)

| Suite                                                                                                         | unit (node)                                    | e2e (browser)                                                                        |
| ------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :----------------------------------------------------------------------------------- |
| Framework                                                                                                     | [`jest`][jest]                                 | [`playwright`][playwright]                                                           |
| Setup                                                                                                         |                                                | <pre>npm run build -- -f -w</pre>                                                    |
| Running Tests<br><br><pre>\<test cmd\> -- [filter] [watch]</pre><br>It is advised to use filters to save time | <pre>npm run test:jest -- [filters] [-w]</pre> | <pre>npm run test:e2e -- [filters] [--ui]</pre>                                      |
| Writing Tests                                                                                                 | Add/update `src/*.(spec\|test).ts` files       | - Update tests in `e2e/tests`<br>- Create a new test based on `e2e/template`         |
| Test Gen                                                                                                      |                                                | <pre>npm start vanilla<br>npx playwright codegen http://localhost:1234</pre>         |
| Test Spec                                                                                                     |                                                | - `index.ts`: built and loaded into the web app<br> - `index.spec.ts`: test spec<br> |
| Outputs                                                                                                       | Snapshots next to the test file                | - Snapshots next to the test file <br>- `e2e/test-report`<br>- `e2e/test-results`    |

### Legacy Test Suite

We **discourage** writing new tests in the legacy suite and **encourage** migrating failing tests to the new suite.
However, it is not carved in stone.

The test suites use [`QUnit`][qunit] for assertions and [`testem`][testem] for serving the browser tests.

- `unit` tests: test logic and state
- `visual` tests: test visual outcome against image refs located at `test/visual/golden`

#### Getting Started

- Build and watch for changes
  ```bash
  npm run build -- -f -w
  ```
- Run the _legacy_ test suite on `chrome` (many tests are skipped on `node`)
  ```bash
  npm test -- -a -c chrome
  ```
- Handle failing tests
  - Fix logic
  - If needed, alter tests with **caution**
  - Rerun failing tests
    - Save time by rerunning failing tests only
      - Select failing test files
        ```bash
        npm test -- -c chrome
        ```
      - **OR** launch the browser test suite in _dev mode_ to watch for test changes
        ```bash
        npm test -- -c chrome --dev -l
        ```
    - In case of failing visual tests, there are 2 options to view visual diffs (in order to understand what is wrong)
      - Testing in _visual debug mode_ is comfortable when using with `Github Desktop` to view the diffs since refs will be overwritten (rerunning tests will use the overwritten refs so be cautious)
        ```bash
        npm test -- -d -c chrome
        ```
      - Launching the browser test suite
        ```bash
        npm test -- -c chrome --dev -l
        ```
      - Take into account that different environments produce different outputs so it is advised to run both in `chrome` and `node`.
      - Committing refs is done **ONLY** with `chrome` output.
    - When you are done, rerun the entire test suit to verify all tests pass.
    - If you are submitting a PR, visit the PR page on github to see all checks have passed (different platforms and config are covered by the checks).
- Refer to the command docs
  ```bash
  npm test -- -h
  ```

#### Adding Tests

Add tests to relevant files or add new files when necessary under `test/unit` or `test/visual`.

- [`unit` test example][unit_test]
- [`visual` test example][visual_test]

If you need to change test config ask for guidance.

---

## 🚧🎢 Developing 💡✨

### Getting Started

1. 🍴 Fork and clone 💾 the repository
1. Install dependencies 🕹️ `npm i --include=dev`

### Starting an App

```bash
npm start <template>
npm start -- --help
```

You can deploy an app to codesandbox via the cli or build an app at a path of your choosing:

```bash
npm run sandbox deploy <path/to/app>
npm run sandbox build <template> <path/to/app>
npm run sandbox -- --help
```

Refer to [`.codesandbox/README.md`](.codesandbox/README.md) for more information.

### Online

You can actively develop fabric online using [Github Codespaces][github_codespaces], [Gitpod][gitpod] or CodeSandbox:

- After the Github Codespace has started run `npm start <template>` to start a prototyping app.
- Gitpod will start the prototyping apps and expose them as endpoints available on forwarded ports.
  `A service is available on port ...` popups will show up.
- Codesandbox: _available soon_.

### 🔮 Symlinking

Establish symlinking to work with a local version on separate projects.

1. From `fabric.js` folder run `npm link` **OR** `yarn link`.
1. From the project's folder run `npm link fabric` **OR** `yarn link fabric`.
1. Consider flagging `--save` to avoid confusion regarding what version of fabric is being used by the project.

See [npm link][npm_link] **OR** [yarn link][yarn_link].\
Don't forget to unlink the package once you're done.

[repo]: ../..
[issues]: ../../issues
[discussions]: ../../discussions
[search_issues]: ../../search?type=Issues
[bug_report]: ../../issues/new?template=bug_report.md
[website_repo]: https://github.com/fabricjs/fabricjs.com
[website]: http://fabricjs.com/
[docs]: http://fabricjs.com/docs
[demos]: http://fabricjs.com/demos/
[gotchas]: https://fabricjs.com/docs/old-docs/gotchas/
[demo_file]: https://github.com/fabricjs/fabricjs.com/blob/gh-pages/posts/demos/_posts/2020-2-15-custom-control-render.md
[jsfiddles]: https://jsfiddle.net/user/fabricjs/fiddles/
[codepens]: https://codepen.io/tag/fabricjs
[jekyll]: https://jekyllrb.com/docs/installation/
[wsl]: https://learn.microsoft.com/en-us/windows/wsl/
[prettier]: https://prettier.io/
[prettier_extension]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[eslint]: https://eslint.org/
[jsdoc]: https://jsdoc.app/
[tsjsdoc]: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
[playwright]: https://playwright.dev/
[jest]: https://jestjs.io/
[qunit]: https://qunitjs.com/
[testem]: https://github.com/testem/testem
[unit_test]: https://github.com/fabricjs/fabric.js/blob/93dd2dcca705a4b481fbc9982da4952ef5b4ed1d/test/unit/point.js#L227-L237
[visual_test]: https://github.com/fabricjs/fabric.js/blob/93dd2dcca705a4b481fbc9982da4952ef5b4ed1d/test/visual/generic_rendering.js#L44-L67
[github_codespaces]: https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=712530
[gitpod]: https://gitpod.io/from-referrer/
[npm_link]: https://docs.npmjs.com/cli/v8/commands/npm-link
[yarn_link]: https://yarnpkg.com/cli/link
