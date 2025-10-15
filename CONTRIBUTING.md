# Contributing to Fabric

First of all thank you for your interest in contributing. 🙏

This guide covers all you need to know from the start, for a first time contributor, advancing to the more advanced topics as you continue reading.

## What is a contribution, who is a contributor

A Contributor is anyone who simply adds to the project, without any formal membership. Contributions do not need to be code. Contributions can be code, docs, issue triaging, discussions, ideas.

If you are starting your coding journey, contributions are a good way to learn skills, learn development workflows, meet other developers.

If you find yourself contributing often you may be interested in the [Contributor ladder](CONTRIBUTOR_LADDER.md)

## Asking Questions

The place for questions is NOT the [Issue Tracker](#Issue-Tracker)
Please refer to available resources (read below) and refrain from opening an issue in such a case.

To find an answer, first [search the repository][search_issues]. It contains a lot of useful threads.

If you find an answer in the issue tracker or in the discussions, but not in the docs, you may consider [improving the docs](#improving-docs). Docs contributions are really appreciated above anything else

Demos and examples can be found on [fabricjs.com][website], [`jsfiddle`][jsfiddles], [`codepen.io`][codepens] and more.

## Issue Tracker

- **Before You Begin** 🎬
  - Make sure you didn't fall into a known [**GOTCHA**][gotchas].
  - [**Searching**][search_issues] for existing issues and discussions is
    **VITAL** in order to keep the community in a good state, prevent spamming and avoid consuming community time.
    If you need to open a new issue then:
- **Fill out the [bug report][bug_report] with care**, it is there for a reason.
- The **Title** must be informative, short and 🧿 to the point.
- **Description**
  - Describe the issue making sure you are very clear.
  - Add logs, screenshots or videos if that makes sense.
  - Make an effort explaining yourself. Maintainers are busy, don't waste on action on your issue for just having them ask for more details. Put them in condition to answer immediately.
  - Re read your description multiple times **before submitting**.
- **Test Case**
  - Create a minimal and immediate test case, reproducing the bug.
  - Add relevant explanations.
  - It should be extremely **easy** for someone to understand your bug and **fast** to reproduce it. **Don't leave it to us to do your part**.
  - Bug templates can be found within a bug report.
- Specify which **version** of Fabric.js you are using.
- Verify your bug also on the latest version before submitting it.

**These are minimal requirements. Without them issues will be closed.**

If it's not a bug **OR** if you're unsure, start a [discussion][discussions].

---

## Fixing typos is appreciated

Typos happens.\
Though it may seem insignificant, typo fixes are appreciated!
It's a good and simple way to start contributing.

## Improving Docs

Improving **DOCS** is **SUPER** important for everyone.\
Even if it's a small fix it is valuable **don't hesitate**!

We have a website that is easy to contribute to.

[Adding demos](#Adding Demos) is also a great contribution.

## Helping Out with other devs issues

Answering questions and addressing issues, as well as fixing and adding types (see [Pull Requests](#pull-requests)), are great ways to start contributing to fabric.

- [Issues][issues]
- [Discussions][discussions]

## Fixing Bugs

- Open an [issue](#issue-tracker), if there isn't any, addressing the bug.
- If the issue is labeled as 'bug' then it needs a fix. Do not open a PR before that moment.
- Once the issue is confirmed as a bug you can fix it, mention in the issue you are working to fix it and check [Developing](#developing).
- Add [tests](#testing).
- Open [PR](#pull-requests)

### General Guidelines

- **Be patient** \
  Sometimes it takes time to get back to you. Someone eventually will. Having a small, concise and super clear change will make maintainers more prone to handle it quickly.
- **Code Style** \
  Fabric uses [`prettier`][prettier] to format files and [`eslint`][eslint] for linting (`npm run lint -- --fix`).\
  To enjoy a seamless dev experience add the [`Prettier - Code formatter`][prettier_extension] extension via the extensions toolbar in VSCode.
  If that doesn't work, once the PR is ready run `npm run prettier:write` and commit the changes.
  Do not reorder imports. Irrelevant changes in a PR that are not created by prettier aren't needed nor welcome.
- **Tests** \
  PRs must be backed with relevant tests, follow [TESTING](#testing). If you never wrote a test or you find our tests unclear to extend, just ask for help.
  Aim to cover 100% of the changes.
- **Docs** \
  Update guides if necessary.\
  Add relevant comments to your code using [JSDoc3][jsdoc], [JSDoc reference supported by TS][tsjsdoc].\
  The generated documentation can be found at [fabricjs.com][docs], see [DOCS](#-improving-docs).
- **Changelog**\
  Add a concise listing to the [**CHANGELOG**](CHANGELOG.md) describing what has changed or let github actions add the PR title for you. An action will add a changelog line with the title of the PR. Check the changelog file to understand the format.
- **One bug one PR, one feature one PR** \
  Create a new branch for every pull request.\
  Don't create a PR from your fork main branch.\
  If you want to do more than one thing, create multiple pull requests.
  If your bug fix or feature requires a refactor, don't refactor. Commit the bugfix or the feature with the current code structure, let it sink, give some time to surface issues with the change, then when the bug or the feature seem solid, a refactor or code improvement can be tried
- **And there you go!** \
  If you still have questions we're always happy to help.

After you open a PR a maintainer will review it.
It is more than likely you will be requested to change stuff and refine your work before it is merged into the repo.

## Testing

We use Vitest and Playwright.

| Suite                                                                                                         | unit (node)                                      | e2e (browser)                                                                        |
| ------------------------------------------------------------------------------------------------------------- | :----------------------------------------------- | :----------------------------------------------------------------------------------- |
| Framework                                                                                                     | [`vitest`][vitest]                               | [`playwright`][playwright]                                                           |
| Setup                                                                                                         |                                                  | <pre>npm run build -- -f -w</pre>                                                    |
| Running Tests<br><br><pre>\<test cmd\> -- [filter] [watch]</pre><br>It is advised to use filters to save time | <pre>npm run test:vitest -- [filters] [-w]</pre> | <pre>npm run test:e2e -- [filters] [--ui]</pre>                                      |
| Writing Tests                                                                                                 | Add/update `src/*.(spec\|test).ts` files         | - Update tests in `e2e/tests`<br>- Create a new test based on `e2e/template`         |
| Test Gen                                                                                                      |                                                  | <pre>npm start vanilla<br>npx playwright codegen http://localhost:1234</pre>         |
| Test Spec                                                                                                     |                                                  | - `index.ts`: built and loaded into the web app<br> - `index.spec.ts`: test spec<br> |
| Outputs                                                                                                       | Snapshots next to the test file                  | - Snapshots next to the test file <br>- `e2e/test-report`<br>- `e2e/test-results`    |

## Developing

### Getting Started

0. You need to be comfortable with git
1. Fork and clone the repository
2. Install dependencies `npm i --include=dev`

### Starting an App

```bash
npm start <template>
npm start -- --help
```

I use `npm start vanilla` for a simple html page with a fabric canvas where i can test some changes.

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

### Symlinking

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
[docs]: http://fabricjs.com/api
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
[vitest]: https://vitest.dev/
[qunit]: https://qunitjs.com/
[testem]: https://github.com/testem/testem
[github_codespaces]: https://github.com/codespaces/new?hide_repo_select=true&ref=master&repo=712530
[gitpod]: https://gitpod.io/from-referrer/
[npm_link]: https://docs.npmjs.com/cli/v8/commands/npm-link
[yarn_link]: https://yarnpkg.com/cli/link
