# Contributing to Fabric

## Questions?!?

To get your questions answered, please ask/search on [Fabric's google group], [StackOverflow] or on Fabric's [IRC channel](irc://irc.freenode.net/#fabric.js).
Please do not open an issue if you're not sure it's a bug or if it's not a feature/suggestion.

For news about Fabric you can follow [@fabric.js], [@AndreaBogazzi], [@kangax], or [@kienzle_s] on Twitter.
Demos and examples can be found on [jsfiddle], [codepen.io] and [fabricjs.com].

## Issue Tracker 🏷️

- **Before you begin** 🎬
  - 📌 Make sure you didn't fall into a known [**gotcha**](http://fabricjs.com/fabric-gotchas)
  - 🔎 [**Search**](https://github.com/fabricjs/fabric.js/search?q=&ref=cmdform&type=Issues) for existing issues and discussions. This is **VITAL** in order to keep the community in a good state and prevent spamming 👎.

- **Title:** Choose an informative short title.

- Fill out the 🐛 report with care, it is there for a reason.

- **Description:** Use the questions above to describe the issue. Add logs, screenshots or videos if that makes sense.

- **Test case:** Make sure you create a minimal and immediate test case, demonstrating the bug, with relevant explanations. It should be extremely **easy** and **fast** for someone to understand your bug and reproduce it. Bug templates can be found within a [bug report](https://github.com/fabricjs/fabric.js/issues/new?assignees=&labels=&template=bug_report.md)

- **version:** Make sure to specify which version of Fabric.js you are using. The version can be found in [fabric.js file](https://github.com/fabricjs/fabric.js/blob/master/dist/fabric.js#L5) or just by executing `fabric.version` in the browser console. It is advised you **upgrade** to the latest version before proceeding, your bug may have been resolved 🦋.

**These are minimal requirements. Without them issues shall be closed.**

If you're unsure about something that is not a bug, it's best to start a [discussion](https://github.com/fabricjs/fabric.js/discussions) or create a post on [Fabric's google group](groups.google.com/forum/?fromgroups#!forum/fabricjs) where someone might clarify some of the things.

## Pull Requests 🚀

We are very grateful for your pull requests! This is your chance to improve Fabric for everyone else.
Before you begin read this through and take a look at [fabric-gotchas](http://fabricjs.com/fabric-gotchas)

### Simple Online Setup

Contribute to fabricjs using a fully featured online development environment that will automatically with a single click: clone the repo and install the dependencies.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

### Guidelines ✅

- **Code style, notes:** Make sure you have complied with the [guidelines](https://github.com/fabricjs/fabric.js/wiki/How-to-contribute-to-Fabric#code-style-notes)

- **Distribution files:** Do your changes only in the [source files](https://github.com/fabricjs/fabric.js/tree/master/src). Don't include the [distribution files](https://github.com/fabricjs/fabric.js/tree/master/dist) in your commit.

- **Add tests**: Tests are vital, invest time to extend the them, see (TESTING)[#Testing].

- **Add documentation:** Fabric uses [JSDoc 3] for documentation. The generated documentation can be found at [fabricjs.com](http://fabricjs.com/docs).

- **One pull request per feature/bug**. Create a new branch for every pull request. If you want to do more than one thing, send multiple pull requests.

- **And there you go!** If you still have questions we're always happy to help. Also feel free to consult [wiki](https://github.com/fabricjs/fabric.js/wiki/How-to-contribute-to-Fabric).


## 🚧🎢 Developing 💡

1. Fork the repository
1. Clone your fork to your machine
1. Install dependencies: `npm i`

### Prototyping
`.codesandbox/templates` contains templates for **INSTANT** out-of-the-box prototyping.\
**Try it out**:

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

### symlinking
Establish symlinking to work with a local version on separate projects.

1. From `fabric.js` folder run `npm link` **OR** `yarn link`.
1. From the project's folder run `npm link fabric` **OR** `yarn link fabric`.

See [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link) **OR** [yarn link](https://yarnpkg.com/cli/link).\
Don't forget to unlink the package once you're done.

## Improving Doc 🔍

Improving **DOCS** is **SUPER** important for everyone.\
Even if it's a small fix it is valuable 💎... **don't hestitate**!

### ~~`fabricjs.com`~~ (deprecated)

To develop fabric's site you need to clone [`fabricjs.com`](https://github.com/fabricjs/fabricjs.com) in the same parent folder of [`fabric.js`](https://github.com/fabricjs/fabric.js), so that `fabric.js` and `fabricjs.com` are siblings.
To start the dev server run `npm start:dev` inside the `fabricjs.com` directory (after installing dependecies).
If you are working on windows, check out [`jekyll` docs](https://jekyllrb.com/docs/installation/) for futher instructions.

### ~~Adding a DEMO~~ (deprecated)
Take a look at an existing [demo file](https://github.com/fabricjs/fabricjs.com/blob/gh-pages/posts/demos/_posts/2020-2-15-custom-control-render.md).
Create a new file in the same directory (`posts/demos/_posts`) and you're good to go.

## Testing 🧪
Test suites run on [QUnit](http://qunitjs.com/) and [`testem`](https://github.com/testem/testem)
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

Read the [wiki](https://github.com/fabricjs/fabric.js/wiki/How-to-contribute-to-Fabric#testing-fabric) for more information.

## Links 🚩

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
