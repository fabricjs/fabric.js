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

### 🎮 Adding a DEMO

Take a look at an existing [demo file][demo_file].\
Create a new file in the same directory (`posts/demos/_posts`) and follow [**developing the website**](#fabricjscom-deprecated).

### ~~`fabricjs.com`~~ (_deprecated_)

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
- Follow [Developing](#-developing-) and read [Testing](#-testing).

### ✅ Guidelines

- **Code Style** \
  Fabric uses [`prettier`][prettier] to format files and [`eslint`][eslint] for linting (`npm run lint -- --fix`).\
  To enjoy a seamless dev experience add the [`Prettier - Code formatter`][prettier_extension] extension via the extensions toolbar in VSCode.
- **⛔ `dist`** \
  Commit changes to [source files](src). Don't commit the generated [distribution files](dist).
- **Tests** \
  PRs must be backed with relevant tests, follow [TESTING](#-testing).
- **Docs** \
  Add relevant comments to your code if necessary using [JSDoc 3][jsdoc] and update relevant guides.\
  The generated documentation can be found at [fabricjs.com][docs], see [DOCS](#-improving-docs).
- **Changelog**\
  Add a concise listing to the [**CHANGELOG**](CHANGELOG.md) describing what has changed.
- **1️⃣ PR per feature/bug** \
  Create a new branch for every pull request.\
  If you want to do more than one thing, create multiple pull requests 💪.
- **And there you go!** \
  If you still have questions we're always happy to help.

After you open a PR a maintainer will review it.
It is more than likely you will be requested to change stuff and refine your work before it is merged into the repo.

## 🧪 Testing

[![🩺](../../actions/workflows/build.yml/badge.svg)](../../actions/workflows/build.yml)
[![🧪](../../actions/workflows/tests.yml/badge.svg)](../../actions/workflows/tests.yml)
[![CodeQL](../../actions/workflows/codeql-analysis.yml/badge.svg)](../../actions/workflows/codeql-analysis.yml)

Test suites use [`QUnit`][qunit] for assertions and [`testem`][testem] for serving

- `unit` tests: test logic and state
- `visual` tests: test visual outcome against image refs located at `/test/visual/golden`

### Getting Started

- build and watch for changes:

```bash

npm run build -- -f -w

```

- run tests:

```bash

npm test -- -a -d
> Running all tests in debug mode (read more in the help section)

npm test -- -s visual --dev -l -c chrome
> Running live visual tests on chrome (navigate to see)

npm test -- --help

> Usage: fabric.js test [options]

> run test suite

Options:
  -s, --suite <suite...>      test suite to run (choices: "unit", "visual")
  -f, --file <file>           run a specific test file
  --filter <filter>           filter tests by name
  -a, --all                   run all tests (default: false)
  -d, --debug                 debug visual tests by overriding refs (golden images) in case of visual changes (default:
                              false)
  -r, --recreate              recreate visual refs (golden images) (default: false)
  -v, --verbose               log passing tests (default: false)
  -l, --launch                launch tests in the browser (default: false)
  --dev                       runs testem in `dev` mode, without a `ci` flag (default: false)
  -c, --context <context...>  context to test in (choices: "chrome", "firefox", "node", default: "node")
  -p, --port
  -o, --out <out>             path to report test results to
  --clear-cache               clear CLI test cache (default: false)
  -h, --help                  display help for command

```

---

## 🚧🎢 Developing 💡✨

### Setting Up Locally

1. 🍴 Fork the repository
1. 💾 Clone your 🍴 to your 💻
1. Install dependencies 🕹️ `npm i --include=dev`
1. Next Up [Prototyping](#-prototyping) & [Testing](#-testing)

#### Online

You can actively develop fabric online using [Github Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=712530), [Gitpod](https://gitpod.io/from-referrer/) or CodeSandbox:

- After the Github Codespace has started run `npm start <template>` to start a [prototyping](#-prototyping) app.
- Gitpod will start the [prototyping](#-prototyping) apps and expose them as endpoints available on forwarded ports.
  `A service is available on port ...` popups will show up.

### 🧭 Prototyping

[`.codesandbox/templates`](.codesandbox/templates) contains templates for **INSTANT** out-of-the-box prototyping [**👍 Try it out**](.codesandbox/README.md)

### 🔮 Symlinking

Establish symlinking to work with a local version on separate projects.

1. From `fabric.js` folder run `npm link` **OR** `yarn link`.
1. From the project's folder run `npm link fabric` **OR** `yarn link fabric`.

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
[gotchas]: http://fabricjs.com/fabric-gotchas
[demo_file]: https://github.com/fabricjs/fabricjs.com/blob/gh-pages/posts/demos/_posts/2020-2-15-custom-control-render.md
[jsfiddles]: https://jsfiddle.net/user/fabricjs/fiddles/
[codepens]: https://codepen.io/tag/fabricjs
[jekyll]: https://jekyllrb.com/docs/installation/
[wsl]: https://learn.microsoft.com/en-us/windows/wsl/
[prettier]: https://prettier.io/
[prettier_extension]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
[eslint]: https://eslint.org/
[jsdoc]: https://jsdoc.app/
[qunit]: https://qunitjs.com/
[testem]: https://github.com/testem/testem
[npm_link]: https://docs.npmjs.com/cli/v8/commands/npm-link
[yarn_link]: https://yarnpkg.com/cli/link
