---
date: '2020-05-25'
description: Breaking changes between major versions
title: Breaking changes upgrade guide
---

## Upgrading your Fabric.js Project

There are a number of breaking changes to be aware of when upgrading your Fabric.js project through each of the major versions. The following guide includes a basic summary of these changes, and links to resources to assist you with the upgrade process.


### In Development

**Upgrading from v5.x to v6.x**

Fabric.js v6.x (currently in development) will feature significant changes to the current codebase. Fabric.js is getting migrated to Typescript which will help to streamline the development and debugging process of Fabric.js applications. Other notable changes are include that Fabric.js is moving to ES6, callbacks are being replaced by promises, and the group system is being completely rewritten to improve many of the limitations with the current group code. 

See [v6-breaking-changes](https://github.com/fabricjs/fabric.js/issues/8299) for a work-in-progress list of the changes coming with v6.

### Current Version

**Upgrading from v4.x to v5.x** [(v5-breaking-changes)](/docs/old-docs/v5-breaking-changes)

Fabric.js v5.x is the last major version of Fabric written in ES5. It includes the removal of several deprecated methods and utilities, and a big change to the `Circle` class to use degree units instead of radians. Several object transform events have also been removed. Mostly though, this version contains a lot of bugfixes and minor additions.


### Previous Versions

**Upgrading from v3.x to v4.x** [(v4-breaking-changes)](/docs/old-docs/v4-breaking-changes)

Fabric.js v4.x left beta in August of 2020, and with it came quite a few breaking changes that mostly involve the removal of old methods. Rejoice because most of the breaking changes are small and of simple solution.

One big change is that the `clipTo` method which was deprecated in v2.4.0 has finally been removed, so if you're still using  `clipTo`  you will need to make the move to using  `clipPath`.

The biggest improvement in v4.x is a new custom control interface. With this system, you'll be able to customize the function of each control, add icons, and even create new controls for your objects. See the following demos for help with the new system.

-   [custom-control-render](/custom-control-render)
-   [custom-controls-polygon](/custom-controls-polygon)

See  [v4-breaking-changes](/docs/old-docs/v4-breaking-changes) for the full list of breaking changes and removed methods in the v4 release.

**Upgrading from v2.x to v3.x**

Fabric.js v3.x has fewer breaking changes than v2.x. Support for Node 4 and 6 was removed and object caching is now required under some circumstances rather than being optional, but this upgrade is more about new features than big changes.

See [changelog](/docs/old-docs/changelog) for a detailed list of changes across each version.

**Upgrading from v1.x to v2.x**

Fabric.js version v2.x has the biggest breaking changes of the major versions. In addition to several methods that have been removed, there are significant changes to how image height and width is handled in order to accommodate the new image cropping functionality. The following guide outlines these changes, and also includes some sample code to help with deserializing pre-v2.0 JSON strings.

-   [v2-breaking-changes](/docs/old-docs/v2-breaking-changes)

Beginning with v2.4.0,  `clipPath`  support was added which allows you to clip an object or the canvas with another Fabric object. The  `clipTo`  method which was the previous means of doing this is now marked as depreciated, so if your project uses  `clipTo`  you should really begin making the transition to `clipPath`.

See this 4-part guide to better understand the new `clipPath` functionality.

-   [clippath-part1](/docs/old-docs/clippath-part1)
-   [clippath-part2](/docs/old-docs/clippath-part2)
-   [clippath-part3](/docs/old-docs/clippath-part3)
-   [clippath-part4](/docs/old-docs/clippath-part4)