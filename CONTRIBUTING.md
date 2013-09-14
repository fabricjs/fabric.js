# Contributing to Fabric

1. [Questions?!?](#questions)
2. [Issue tracker](#issue-tracker)
3. [Issue tracker guidelines](#issue-tracker-guidelines)
4. [Pull requests](#pull-request)
5. [Pull request guidelines](#pull-request-guidelines)

## Questions?!?

To get your questions answered, please ask/search on [Fabric's google group], [stackoverflow] or on Fabric's IRC channel (irc://irc.freenode.net/#fabric.js).
Please do not open an issue if you're not sure it's a bug or a suggestion.

For news about Fabric you can follow [@fabric.js] or [@kangax] on twitter.
Demos and examples can be found on [jsfiddle], [codepen.io] and [fabricjs.com].

## Issue tracker

If you are sure that it's a bug in Fabric.js or a suggestion, open a new [issue] and try to
answer the following questions:

- What did you do?
- What did you expect to happen?
- What happened instead?

### Issue tracker guidelines

- **Search:** Before opening a new issue please [search](https://github.com/kangax/fabric.js/search?q=&ref=cmdform&type=Issues) Fabric's issues.

- **Title:** Choose a informative title.

- **Description:** Use the questions above to describe the issue. Add logs, screenshots or videos if that makes sense.

- **Test case:** Please post code to replicate the bug - best on [jsfiddle](http://jsfiddle.net). Ideally a failing test would be
perfect, but even a simple script demonstrating the error would suffice.
You could use [this jsfiddle template](http://jsfiddle.net/fabricjs/Da7SP/) as a
starting point.

- **Fabric.js version:** Make sure to specify which version of Fabric.js you are using. The version can be found in [all.js file](https://github.com/kangax/fabric.js/blob/master/dist/all.js#L5) or
just enter `fabric.version` in the browser console.


## Pull requests

We are very grateful for pull requests from you! You have the chance to improve Fabric.

### Pull request guidelines

Here are a few notes you should take into account:

- **Code style, notes:** Make sure that you have complied with the [guidelines](https://github.com/kangax/fabric.js/wiki/How-to-contribute-to-Fabric#code-style-notes)

- **Distribution files:** Do your changes only in the [source files](https://github.com/kangax/fabric.js/tree/master/src). Don't include the [distribution files](https://github.com/kangax/fabric.js/tree/master/dist) in your commit.

- **Add tests**: Tests would be awesome - invest a little time and expand the [unit tests](https://github.com/kangax/fabric.js/tree/master/test/unit). More informations about qunit tests can be found in the [wiki](https://github.com/kangax/fabric.js/wiki/How-to-contribute-to-Fabric#testing-fabric).

- **Add documentation:** Fabric uses [JSDoc 3] for documentation. The generated documentation can be found [fabricjs.com](http://fabricjs.com/docs).

- **Create topic branches.** Don't use your master branch for pull request. It's better to create a new branch for every pull request.

- **One pull request per feature/bug**. If you want to do more than one thing, send
  multiple pull requests.

- **And there you go!** If you still have questions we very glad to help you or have a look at the [wiki](https://github.com/kangax/fabric.js/wiki/How-to-contribute-to-Fabric).

[Fabric's google group]: https://groups.google.com/forum/#!forum/fabricjs
[stackoverflow]: http://stackoverflow.com/questions/tagged/fabricjs
[@fabric.js]: https://twitter.com/fabricjs
[@kangax]: https://twitter.com/kangax
[jsfiddle]: http://jsfiddle.net/user/fabricjs/fiddles
[codepen.io]: http://codepen.io/tag/fabricjs
[fabricjs.com]: http://fabricjs.com/demos
[JSDoc 3]: http://usejsdoc.org/
[issue]: https://github.com/kangax/fabric.js/issues