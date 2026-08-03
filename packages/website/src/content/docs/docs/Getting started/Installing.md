---
date: '2015-03-10'
title: 'Getting started'
description: 'Getting started with Fabric.js'
sidebar:
  order: 100
---

## Installation

Fabric.js can be made available via following approaches as suited by your project

### Using from CDN via script tag

Include a script tag within your HTML page, from any cdn that offers this service like [cdnjs](https://cdnjs.com/libraries/fabric.js), [jsdelivr](https://www.jsdelivr.com/package/npm/fabric), [unpkg](https://unpkg.com/)


```html
<script src="https://cdn.jsdelivr.net/npm/fabric@latest/dist/index.min.js"></script>
```

### Installing from npm

```shell
npm i --save fabric
```

## Browser support

Following is a table portraying which browsers are supported.
In general you can always re-transpile to support older browsers, but some canvas features can't be transpiled or polyfilled.

|   Context   | Supported Version | Notes                           |
| :---------: | :---------------: | ------------------------------- |
|   Firefox   |        ✔️         | >= 58                           |
|   Safari    |        ✔️         | >= 11                           |
|    Opera    |        ✔️         | chromium based                  |
|   Chrome    |        ✔️         | >= 64                           |
|    Edge     |        ✔️         | chromium based                  |
| Edge Legacy |        ❌         |
|    IE11     |        ❌         |
|   Node.js   |        ✔️         | >= 18 |