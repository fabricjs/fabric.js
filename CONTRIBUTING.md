# Contributing to Fabric

## Questions?!?

To get your questions answered, please ask/search on [Fabric's google group], [StackOverflow] or on Fabric's IRC channel (irc://irc.freenode.net/#fabric.js).
Please do not open an issue if you're not sure it's a bug or if it's not a feature/suggestion.

For news about Fabric you can follow [@fabric.js], [@AndreaBogazzi], [@kangax], or [@kienzle_s] on Twitter.
Demos and examples can be found on [jsfiddle], [codepen.io] and [fabricjs.com].

## Issue tracker

If you are sure that it's a bug in Fabric.js or a suggestion, open a new [issue] and try to answer the following questions:

- What did you do?
- What did you expect to happen?
- What happened instead?

### Issue tracker guidelines

If you think you found a bug in Fabric file an [issue](https://github.com/fabricjs/fabric.js/issues).

- **Gotchas**: Make sure you didn't fall into a known [fabric-gotcha](http://fabricjs.com/fabric-gotchas)

- **Search:** Before opening a new issue please take the time to [search](https://github.com/fabricjs/fabric.js/search?q=&ref=cmdform&type=Issues) Fabric's existing issues. This is vital to prevent spamming and to keep the community in a good state.

- **Title:** Choose an informative title.

- **Description:** Use the questions above to describe the issue. Add logs, screenshots or videos if that makes sense.

- **Test case:** Make sure you create a minimal and immediate test case, demonstrating the bug, with relevant explanations. It should be extremely **easy** and **fast** for someone to understand your bug and reproduce it. Bug templates can be found within a [bug report](https://github.com/fabricjs/fabric.js/issues/new?assignees=&labels=&template=bug_report.md)

- **Fabric.js version:** Make sure to specify which version of Fabric.js you are using. The version can be found in [fabric.js file](https://github.com/fabricjs/fabric.js/blob/master/dist/fabric.js#L5) or just by executing `fabric.version` in the browser console. It is advised you upgrade to the latest version before proceeding.

**Without these requirements issues shall be closed.**

If you're unsure about something that is not a bug, it's best to start a [discussion](https://github.com/fabricjs/fabric.js/discussions) or create a post on [Fabric's google group](groups.google.com/forum/?fromgroups#!forum/fabricjs) where someone might clarify some of the things.

## Pull requests

We are very grateful for your pull requests! This is your chance to improve Fabric for everyone else.
Before you begin read this through and take a look at [fabric-gotchas](http://fabricjs.com/fabric-gotchas)

### Online one-click setup for making PRs

Contribute to fabricjs using a fully featured online development environment that will automatically with a single click: clone the repo and install the dependencies.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

### Setting up a local environment

1. Clone your fork of `fabric.js` to your machine
1. Install dependencies: `npm i`

You can decide how you prefer to work:

#### `fabricjs.com`
You can start the dev server that runs fabric's website and test live changes.
After setting up `fabricjs.com` on your machine run `npm start` from the `fabric.js` folder.
This will start the dev server and watch for changes in both repositories.
While working, you might need to refresh the page for changes to take place.
See [Working on fabricjs.com](#working-on-fabricjscom).
To customize the dev server take a look at [`./scripts`](./scripts).

#### symlinking
You can symlink `fabric.js` and test your changes in a separate project.
1. From `fabric.js` folder run `npm link` **OR** `yarn link`.
1. From your project's folder run `npm link fabric` **OR** `yarn link fabric`.

See [npm link](https://docs.npmjs.com/cli/v8/commands/npm-link) **OR** [yarn link](https://yarnpkg.com/cli/link).\
Don't forget to unlink the package once you're done.

### Working on `fabricjs.com`

To develop fabric's site you need to clone [`fabricjs.com`](https://github.com/fabricjs/fabricjs.com) in the same parent folder of [`fabric.js`](https://github.com/fabricjs/fabric.js), so that `fabric.js` and `fabricjs.com` are siblings.
To start the dev server run `npm start:dev` inside the `fabricjs.com` directory (after installing dependecies).
If you are working on windows, check out [`jekyll` docs](https://jekyllrb.com/docs/installation/) for futher instructions.

**Adding a DEMO**:
Take a look at an existing [demo file](https://github.com/fabricjs/fabricjs.com/blob/gh-pages/posts/demos/_posts/2020-2-15-custom-control-render.md).
Create a new file in the same directory (`posts/demos/_posts`) and you're good to go.

### Tests
Fabric has 2 test suites: 
- `unit` testing logic and state
- `visual` testing visual outcome against image refs

#### Running Tests
- **Node.js**: run `npm test -- -a -d` to run **a**ll tests in **d**ebug mode (pass `--help` to see more options).
- **Browser**: start `fabricjs.com` (`npm start`) and navigate to the `tests` tab where you will find the test interface.

### Pull request guidelines

Here are a few notes you should take into account:

- **Code style, notes:** Make sure you have complied with the [guidelines](https://github.com/fabricjs/fabric.js/wiki/How-to-contribute-to-Fabric#code-style-notes)

- **Distribution files:** Do your changes only in the [source files](https://github.com/fabricjs/fabric.js/tree/master/src). Don't include the [distribution files](https://github.com/fabricjs/fabric.js/tree/master/dist) in your commit.

- **Add tests**: Tests are vital - invest time to extend the [tests suites](https://github.com/fabricjs/fabric.js/tree/master/test). More information about [QUnit](http://qunitjs.com/) tests can be found in the [wiki](https://github.com/fabricjs/fabric.js/wiki/How-to-contribute-to-Fabric#testing-fabric).

- **Add documentation:** Fabric uses [JSDoc 3] for documentation. The generated documentation can be found at [fabricjs.com](http://fabricjs.com/docs).

- **Create topic branches.** Don't use your master branch for pull request. It's better to create a new branch for every pull request.

- **One pull request per feature/bug**. If you want to do more than one thing, send multiple pull requests.

- **And there you go!** If you still have questions we're always happy to help. Also feel free to consult [wiki](https://github.com/fabricjs/fabric.js/wiki/How-to-contribute-to-Fabric).

[Fabric's google group]: https://groups.google.com/forum/#!forum/fabricjs
[stackoverflow]: http://stackoverflow.com/questions/tagged/fabricjs
[@fabric.js]: https://twitter.com/fabricjs
[@AndreaBogazzi]: https://twitter.com/AndreaBogazzi
[@kangax]: https://twitter.com/kangax
[@kienzle_s]: https://twitter.com/kienzle_s
[jsfiddle]: http://jsfiddle.net/user/fabricjs/fiddles
[codepen.io]: http://codepen.io/tag/fabricjs
[fabricjs.com]: http://fabricjs.com/demos
[fabricjs.com/docs]: http://fabricjs.com/docs
[JSDoc 3]: http://usejsdoc.org/
[issue]: https://github.com/fabric/fabric.js/issues
