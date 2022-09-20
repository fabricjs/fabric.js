# 🎉 Contributing to Fabric 🥳

## 🧐 Questions?!?

Questions are legit but that doesn't make them bug reports...\
Please refer to available resources (read below) and refrain from opening an issue in such a case.

To find an answer first [search the repository](https://github.com/fabricjs/fabric.js/search?q=&type=Issues), it contains a lot of useful threads.\
Refer to `Fabric's google group`, `StackOverflow` and [`Fabric's IRC channel`](irc://irc.freenode.net/#fabric.js) as well.\
See [Links](#-links).

Questions might inspire you to [improve the docs](#-improving-docs) 🌈 Please do 🌟.

Demos and examples 🤓 can be found on [fabricjs.com](http://fabricjs.com/demos/), `jsfiddle`, `codepen.io` and more.

## 🏷️ Issue Tracker

- **Before You Begin** 🎬
  - 📌 Make sure you didn't fall into a known [**GOTCHA**](./GOTCHAS.md)
  - 🔎 [**Searching**](https://github.com/fabricjs/fabric.js/search?q=&ref=cmdform&type=Issues) for existing issues and discussions is
    🔋 **VITAL** in order to keep the community in a good state, prevent spamming 👎 and become a skilled fabric dev 🦉.
- The **Title** must be informative, short and 🧿 to the point.
- **Fill out the 🐛 report with care**, it is there for a reason.
- **Description**
  - Describe the issue making sure you are very clear.
  - Add (📎) logs, screenshots or videos if that makes sense.
  - Make an effort explaining yourself
  - A good description has been read at least 3 times before submitting.
- **Test Case**
  - Create a minimal and immediate test case, reproducing the bug.
  - Add relevant explanations.
  - It should be extremely **easy** for someone to understand your bug and **fast** to reproduce it. **Don't leave it to us to do your part**.
  - Bug templates can be found within a [bug report](https://github.com/fabricjs/fabric.js/issues/new?assignees=&labels=&template=bug_report.md)
- Specify which **version** of Fabric.js you are using.
- **Upgrade** to the latest version before proceeding, your 🐛 may have turned into a 🦋.

**These are minimal requirements. Without them issues shall be ⛔.**

If it's not a bug **OR** if you're unsure, start a 🤠 [discussion](https://github.com/fabricjs/fabric.js/discussions) or create a post ✉️ on [Fabric's google group](https://groups.google.com/g/fabricjs) where someone might clarify some of the things.

Check out [**Helping Out**](#%EF%B8%8F-helping-out).

## 🚧🎢 Developing 💡✨

### Getting Started

#### Setting up locally

1. 🍴 Fork the repository
1. 💾 Clone your 🍴 to your 💻
1. Install dependencies 🕹️ `npm i --include=dev`
1. Next Up [Prototyping](#-prototyping) & [Testing](#-testing)

#### Online
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

### 🧭 Prototyping

`.codesandbox/templates` contains templates for **INSTANT** out-of-the-box prototyping **👍 Try it out**

```bash

npm run sandbox build next [/path/to/sandbox]
> building next app at /path/to/sandbox

npm run sandbox start </path/to/sandbox>
> starting dev server

npm run sandbox deploy </path/to/sandbox>
> created codesandbox https://codesandbox.io/s/fgh476

npm run sandbox deploy -- --template node
> created codesandbox https://codesandbox.io/s/fgh476

npm run sandbox -- --help

> Usage: fabric.js sandbox [options] [command]

> sandbox commands

Options:
  -h, --help                      display help for command

Commands:
  deploy [options] [path]         deploy a sandbox to codesandbox
  build <template> [destination]  build and start a sandbox
  start <path>                    start a sandbox
  help [command]                  display help for command

```

### 🔮 Symlinking

Establish symlinking to work with a local version on separate projects.

1. From `fabric.js` folder run `npm link` **OR** `yarn link`.
1. From the project's folder run `npm link fabric` **OR** `yarn link fabric`.

See [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link) **OR** [yarn link](https://yarnpkg.com/cli/link).\
Don't forget to unlink the package once you're done.

---

**Developing easily becomes a [PR](#-pull-requests) 😉**

---

## 🔎 Improving Docs

Improving **DOCS** is **SUPER** important for everyone.\
Even if it's a small fix it is valuable 💎... **don't hestitate**!\
We plan on building a brand new website, stay tuned.

### ~~`fabricjs.com`~~ (_deprecated_)

To develop fabric's site you need to clone [`fabricjs.com`](https://github.com/fabricjs/fabricjs.com) in the same parent folder of [`fabric.js`](https://github.com/fabricjs/fabric.js), so that `fabric.js` and `fabricjs.com` are siblings.
To start the dev server run `npm start:dev` inside the `fabricjs.com` directory (after installing dependecies).
If you are working on windows, check out [`jekyll` docs](https://jekyllrb.com/docs/installation/) for futher instructions.

### ~~Adding a DEMO~~ (_deprecated_)

Take a look at an existing [demo file](https://github.com/fabricjs/fabricjs.com/blob/gh-pages/posts/demos/_posts/2020-2-15-custom-control-render.md).
Create a new file in the same directory (`posts/demos/_posts`) and you're good to go.

## ❤️ Helping Out

Answering questions and addressing issues is a great way to start contributing to fabric.

- [Issues](../../issues)
- [Discussions](../../discussions)
- [Google group](https://groups.google.com/g/fabricjs)
- [Stackoverflow](http://stackoverflow.com/questions/tagged/fabricjs)

## 🚀 Pull Requests

Fabric is an open source project 🦄 and as such depends on the **genuine effort** of individuals and the community as a whole.
**Join Us** to make Fabric better 🌺 .

### Getting Started

- Read this section through
- Take a look at [**GOTCHAS**](./GOTCHAS.md)
- Follow [Developing](#-developing-).

### ✅ Guidelines

- **Code Style** \
  Fabric uses [`prettier`](https://prettier.io/) to format files and [`eslint`](https://eslint.org/) for linting (`npm run lint -- --fix`).\
  To enjoy a seamless dev experience add the [`Prettier - Code formatter`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension via the extensions toolbar in VSCode.
- **⛔ `dist`** \
  Commit changes to [source files](https://github.com/fabricjs/fabric.js/tree/master/src). Don't commit the generated [distribution files](https://github.com/fabricjs/fabric.js/tree/master/dist).
- **Tests** \
  PRs must be backed with relevant tests, follow [TESTING](#-testing).
- **Docs** \
  Add relevant comments to your code if necessary using [JSDoc 3](https://jsdoc.app/) and update relevant guides.\
  The generated documentation can be found at [fabricjs.com](http://fabricjs.com/docs), see [DOCS](#🔎-improving-docs).
- **Changelog**\
  Add a concise listing to the [**CHANGELOG**](./CHANGELOG.md) describing what has changed.
- **1️⃣ PR per feature/bug** \
  Create a new branch for every pull request.\
  If you want to do more than one thing, create multiple pull requests 💪.
- **And there you go!** \
  If you still have questions we're always happy to help.

## 🧪 Testing

![Build Status](../../workflows/%F0%9F%A9%BA/badge.svg)
![Test Status](../../workflows/%F0%9F%A7%AA/badge.svg)
![CodeQL Status](../../workflows/CodeQL/badge.svg)

Test suites use [`QUnit`](https://qunitjs.com/) for assertions and [`testem`](https://github.com/testem/testem) for serving

- `unit` tests: test logic and state
- `visual` tests: test visual outcome against image refs located at `/test/visual/golden`

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
  -c, --context <context...>  context to test in (choices: "chrome", "firefox", "node", default: ["chrome","node"])
  -p, --port
  -o, --out <out>             path to report test results to
  --clear-cache               clear CLI test cache (default: false)
  -h, --help                  display help for command

```

## 🚩 Links

For news about Fabric you can follow [@fabric.js], [@AndreaBogazzi], [@kangax], or [@kienzle_s] on Twitter.

- [Fabric's google group](https://groups.google.com/forum/#!forum/fabricjs)
- [stackoverflow](http://stackoverflow.com/questions/tagged/fabricjs)
- [@fabric.js](https://twitter.com/fabricjs)
- [@AndreaBogazzi](https://twitter.com/AndreaBogazzi)
- [@kangax](https://twitter.com/kangax)
- [@kienzle_s](https://twitter.com/kienzle_s)
- [jsfiddle](http://jsfiddle.net/user/fabricjs/fiddles)
- [codepen.io](http://codepen.io/tag/fabricjs)
- [fabricjs.com](http://fabricjs.com/demos)
- [fabricjs.com/docs](http://fabricjs.com/docs)
- [JSDoc 3](http://usejsdoc.org/)
- [issue](https://github.com/fabric/fabric.js/issues)
