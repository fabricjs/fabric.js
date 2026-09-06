# Fabric.js

<a href="http://fabricjs.com/kitchensink" target="_blank"><img align="right" src="/lib/screenshot.png" width="400"></a>

A **simple and powerful Javascript HTML5 canvas library**.

- [**Website**][website]
- [**Old V5 documentation**](https://fabric5.fabricjs.com)
- [**GOTCHAS**][gotchas]
- [**Contributing, Developing and More**](CONTRIBUTING.md)

## Special Thanks

Here is a section for recognition of companies or individuals that support fabricJS with a sponsorship

   <a href="https://www.atlascloud.ai/?utm_source=github&utm_medium=link&utm_campaign=fabric.js" >
      <img alt="Atlascloud sponsorship" width="300" height="auto" src="https://www.atlascloud.ai/logo.svg" style="background-color: white;">
   </a>

Atlas Cloud is a full-modal AI inference platform that gives developers a single AI API to access video generation, image generation, and LLM APIs. Instead of managing multiple vendor integrations, you connect once and get unified access to 300+ curated models across all modalities.
Check out Atlas Cloud's new coding plan promotion for more budget-friendly API access：[https://www.atlascloud.ai/console/coding-plan](https://www.atlascloud.ai/console/coding-plan?utm_source=github&utm_medium=link&utm_campaign=fabric.js)

</div>

## Features

- Out of the box interactions such as scale, move, rotate, skew, group...
- Built in shapes, controls, animations, image filters, gradients, patterns, brushes...
- `JPG`, `PNG`, `JSON` and `SVG` i/o
- Typed and modular
- [Unit tested](CONTRIBUTING.md#-testing)
- Security efforts [![OpenSSF Best Practices](https://www.bestpractices.dev/projects/12579/badge)](https://www.bestpractices.dev/projects/12579)

#### Supported Browsers/Environments

|   Context   | Supported Version | Notes                           |
| :---------: | :---------------: | ------------------------------- |
|   Firefox   |        ✔️         | 58                              |
|   Safari    |        ✔️         | 11                              |
|    Opera    |        ✔️         | chromium based                  |
|   Chrome    |        ✔️         | 64                              |
|    Edge     |        ✔️         | chromium based                  |
| Edge Legacy |        ❌         |
|    IE11     |        ❌         |
|   Node.js   |        ✔️         | [Node.js installation](#nodejs) |

Fabric.js does not use polyfills by default, or tries to keep it at minimum. the browser version we support is determined by the level of canvas api we want to use and some js syntax. While JS can be easily transpiled, canvas API can't.

## Installation

For new applications, install the environment-specific package:

```bash
# Browser applications
npm install @fabricjs/browser

# Node.js applications
npm install @fabricjs/node
```

The legacy `fabric` package remains supported for existing applications:

```bash
$ npm install fabric --save
# or use yarn
$ yarn add fabric
# or use pnpm
$ pnpm add fabric
```

## Packages and migration

| Package             | Role                                                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `fabric`            | Legacy compatibility facade. It re-exports `@fabricjs/browser`.                                                                 |
| `@fabricjs/browser` | Preferred entrypoint for new browser applications.                                                                              |
| `@fabricjs/node`    | Preferred entrypoint for new Node.js applications. It owns the Node-specific dependencies.                                      |
| `@fabricjs/core`    | Shared, environment-neutral runtime used by the browser and Node packages. It is intended for advanced and shared dependencies. |
| Extension packages  | Optional features imported individually, such as `@fabricjs/aligning-guidelines`.                                               |

Existing imports continue to work:

```js
import { Canvas } from 'fabric';
import { StaticCanvas } from 'fabric/node';
```

New applications should prefer the explicit entrypoints:

```js
import { Canvas } from '@fabricjs/browser';
import { StaticCanvas } from '@fabricjs/node';
import { AligningGuidelines } from '@fabricjs/aligning-guidelines';
```

The `fabric` and `fabric/node` facades share the same class identities as
their corresponding workspace packages. Keep `fabric` and every
`@fabricjs/*` package on matching versions; mixing mismatched versions can
load separate runtimes.

`@fabricjs/core` has no Node-specific runtime dependencies, but it is not a
DOM-free API. Advanced consumers using core APIs that touch DOM or canvas must
provide a suitable environment implementation.

### Legacy distribution files

The ESM `fabric` and `fabric/node` entries are small compatibility facades over
the workspace packages. The legacy standalone files remain available for
existing usage:

- `dist/index.js` and `dist/index.min.js` are full browser UMD builds from
  `@fabricjs/browser`, for `<script>` tags and `require('fabric')`.
- `dist/index.node.cjs` is the legacy CommonJS compatibility build for
  `require('fabric/node')`.

New ESM applications should continue to import `@fabricjs/browser` or
`@fabricjs/node` directly.

#### Browser

[![cdnjs](https://img.shields.io/cdnjs/v/fabric.js.svg)][cdnjs]
[![jsdelivr](https://data.jsdelivr.com/v1/package/npm/fabric/badge)][jsdelivr]

See [browser modules][mdn_es6] for using es6 imports in the browser or use a dedicated bundler.

#### Node.js

We strongly recommend to run your applications only LTS versions of node.

Said so the minimum supported version of node is 20.
We bump up the minimum version of node with a Major release only when the dependencies force us to do so.

Fabric.js depends on [node-canvas][node_canvas] for a canvas implementation (`HTMLCanvasElement` replacement) and [jsdom][jsdom] for a `window` implementation on node.
This means that you may encounter `node-canvas` limitations and [bugs][node_canvas_issues].

Follow these [instructions][node_canvas_install] to get `node-canvas` up and running.

## Quick Start

```js
// Preferred entrypoints for new applications
import { Canvas } from '@fabricjs/browser';
import { StaticCanvas } from '@fabricjs/node';
```

```js
// Supported compatibility entrypoints
import { Canvas } from 'fabric';
import { StaticCanvas } from 'fabric/node';

// v5 compatibility
import { fabric } from 'fabric';
```

<details><summary><b>Plain HTML</b></summary>

```html
<canvas id="canvas" width="300" height="300"></canvas>

<script src="https://cdn.jsdelivr.net/npm/fabric@6.4.3/dist/index.js"></script>
<script>
  const canvas = new fabric.Canvas('canvas');
  const rect = new fabric.Rect({
    top: 100,
    left: 100,
    width: 60,
    height: 70,
    fill: 'red',
  });
  canvas.add(rect);
</script>
```

</details>

<details><summary><b>React.js</b></summary>

```tsx
import React, { useEffect, useRef } from 'react';
import * as fabric from 'fabric'; // v6
import { fabric } from 'fabric'; // v5

export const FabricJSCanvas = () => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const options = { ... };
    const canvas = new fabric.Canvas(canvasEl.current, options);
    // make the fabric.Canvas instance available to your app
    updateCanvasContext(canvas);
    return () => {
      updateCanvasContext(null);
      canvas.dispose();
    }
  }, []);

  return <canvas width="300" height="300" ref={canvasEl}/>;
};

```

</details>

<details><summary><b>Node.js</b></summary>

```js
import http from 'http';
import * as fabric from 'fabric/node'; // v6
import { fabric } from 'fabric'; // v5

const port = 8080;

http
  .createServer((req, res) => {
    const canvas = new fabric.Canvas(null, { width: 100, height: 100 });
    const rect = new fabric.Rect({ width: 20, height: 50, fill: '#ff0000' });
    const text = new fabric.Text('fabric.js', { fill: 'blue', fontSize: 24 });
    canvas.add(rect, text);
    canvas.renderAll();
    if (req.url === '/download') {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="fabric.png"');
      canvas.createPNGStream().pipe(res);
    } else if (req.url === '/view') {
      canvas.createPNGStream().pipe(res);
    } else {
      const imageData = canvas.toDataURL();
      res.writeHead(200, '', { 'Content-Type': 'text/html' });
      res.write(`<img src="${imageData}" />`);
      res.end();
    }
  })
  .listen(port, (err) => {
    if (err) throw err;
    console.log(
      `> Ready on http://localhost:${port}, http://localhost:${port}/view, http://localhost:${port}/download`,
    );
  });
```

</details>

See our ready to use [templates](./.codesandbox/templates/).

---

## Other Solutions

| Project                        | Description          |
| ------------------------------ | -------------------- |
| [Three.js][three.js]           | 3D graphics          |
| [PixiJS][pixijs]               | WebGL renderer       |
| [Konva][konva]                 | Similar features     |
| [html-to-image][html-to-image] | HTML to image/canvas |

## More Resources

- [Demos on `fabricjs.com`][demos]
- [Fabric.js on `Twitter`][twitter]
- [Fabric.js on `CodeTriage`][code_triage]
- [Fabric.js on `Stack Overflow`][so]
- [Fabric.js on `jsfiddle`][jsfiddles]
- [Fabric.js on `Codepen.io`][codepens]

## Credits [![Patreon](https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet)](https://www.patreon.com/fabricJS)

- [kangax][kagnax]
- [asturur][asturur] on [`Twitter`][asturur_twitter]
  [![Sponsor asturur](https://img.shields.io/static/v1?label=Sponsor%20asturur&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/asturur)
- [ShaMan123][shaman123] [![Sponsor ShaMan123](https://img.shields.io/static/v1?label=Sponsor%20ShaMan123&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/ShaMan123)
- [melchiar][melchiar] [![Sponsor melchiar](https://img.shields.io/static/v1?label=Sponsor%20melchiar&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/melchiar)
- Ernest Delgado for the original idea of [manipulating images on canvas](http://www.ernestdelgado.com/archive/canvas/)
- [Maxim "hakunin" Chernyak](http://twitter.com/hakunin) for ideas, and help with various parts of the library throughout its life
- [Sergey Nisnevich](http://nisnya.com) for help with geometry logic
- [Stefan Kienzle](https://twitter.com/kienzle_s) for help with bugs, features, documentation, GitHub issues
- [Shutterstock](http://www.shutterstock.com/jobs) for the time and resources invested in using and improving Fabric.js
- [and all the other contributors][contributors]

[asturur]: https://github.com/asturur
[asturur_twitter]: https://twitter.com/AndreaBogazzi
[cdnjs]: https://cdnjs.com/libraries/fabric.js
[code_triage]: https://www.codetriage.com/kangax/fabric.js
[codepens]: https://codepen.io/tag/fabricjs
[contributors]: https://github.com/fabricjs/fabric.js/graphs/contributors
[demos]: http://fabricjs.com/demos/
[gotchas]: https://fabricjs.com/docs/old-docs/gotchas/
[html-to-image]: https://github.com/bubkoo/html-to-image
[jsdelivr]: https://www.jsdelivr.com/package/npm/fabric
[jsdom]: https://github.com/jsdom/jsdom
[jsfiddles]: https://jsfiddle.net/user/fabricjs/fiddles/
[kagnax]: https://twitter.com/kangax
[konva]: https://github.com/konvajs/konva
[mdn_es6]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
[melchiar]: https://github.com/melchiar
[node_canvas]: https://github.com/Automattic/node-canvas
[node_canvas_install]: https://github.com/Automattic/node-canvas#compiling
[node_canvas_issues]: https://github.com/Automattic/node-canvas/issues
[patreon_badge]: https://img.shields.io/static/v1?label=Patreon&message=%F0%9F%91%8D&logo=Patreon&color=blueviolet
[pixijs]: https://github.com/pixijs/pixijs
[shaman123]: https://github.com/ShaMan123
[so]: https://stackoverflow.com/questions/tagged/fabricjs
[three.js]: https://github.com/mrdoob/three.js/
[twitter]: https://twitter.com/fabricjs
[website]: http://fabricjs.com/


## 🌐 Web Resources & Interactive Index
- [GOOD TO DRIVE](https://studyquests.github.io/good-to-drive.html)
- [COLOR BLOCK SORT](https://themindplays.pages.dev/color-block-sort.html)
- [CATEGORY INTERSTELLARPROXY](https://learnquester.github.io/category-interstellarproxy.html)
- [CATEGORY MMO25](https://learnquester.github.io/category-mmo25.html)
- [CATEGORY CASUAL 15](https://studyquests.github.io/category-casual-15.html)
- [OM NOM RUN](https://quizverses.pages.dev/om-nom-run.html)
- [PIN PUZZLE SAVE THE SHEEP](https://studyquests.pages.dev/pin-puzzle-save-the-sheep.html)
- [AUTHENTIC FOOTBALL](https://quizverses-9d2f2.web.app/authentic-football.html)
- [PERFECT TIDY](https://quizverses.pages.dev/perfect-tidy.html)
- [CATEGORY WORLD CUP17](https://studyplaying.github.io/category-world-cup17.html)
- [MY CAKE SHOP BAKE SERVE](https://quizverses.github.io/my-cake-shop-bake-serve.html)
- [FIGHT TO THE END](https://quizverses.pages.dev/fight-to-the-end.html)
- [CATEGORY FLASH](https://studyquests.pages.dev/category-flash.html)
- [ASOKA MAKEUP INDIAN BRIDE](https://quizverses.pages.dev/asoka-makeup-indian-bride.html)
- [K POP HUNTERS VALENTINE STYLE](https://theskillquest.pages.dev/k-pop-hunters-valentine-style.html)
- [CANNONS BLAST 3D](https://thelearnquesters.pages.dev/cannons-blast-3d.html)
- [PIXEL SHOOT](https://thelearnquester.web.app/pixel-shoot.html)
- [NEW YEAR MAKEUP TRENDS](https://thequizzone.pages.dev/new-year-makeup-trends.html)
- [GUN RUSH](https://quizverses.pages.dev/gun-rush.html)
- [PATO VS COPS](https://learnquesters.pages.dev/pato-vs-cops.html)
- [CATEGORY MOBILE2 095](https://studyplaying.github.io/category-mobile2-095.html)
- [INDEX12](https://thequizzone.pages.dev/index12.html)
- [FLOWER BLOCK](https://quizverses.pages.dev/flower-block.html)
- [IDLE SUPERMARKET TYCOON](https://quizverses.github.io/idle-supermarket-tycoon.html)
- [CATEGORY PHYSICS371](https://thelearnquesters.pages.dev/category-physics371.html)
- [BEAUTY PUZZLE](https://quizverses.pages.dev/beauty-puzzle.html)
- [CATEGORY ANIMAL215](https://thelearnquesters.pages.dev/category-animal215.html)
- [CATEGORY CONTENTKEEPER](https://thelearnquester.web.app/category-contentkeeper.html)
- [AXE THROW](https://quizverses.github.io/axe-throw.html)
- [HOOP WORLD 3D](https://learnquester.pages.dev/hoop-world-3d.html)
- [PIGGY CLICKER](https://thelearnquester.web.app/piggy-clicker.html)
- [INDEX15](https://studyplaying.github.io/index15.html)
- [MAGIC BUBBLES](https://quizverses.pages.dev/magic-bubbles.html)
- [CATEGORY BYPASS](https://studyplayings.pages.dev/category-bypass.html)
- [CATEGORY FPS 2](https://learnquesters.pages.dev/category-fps-2.html)
- [CATEGORY GITHUB IO](https://studyplaying.github.io/category-github-io.html)
- [CUT IN HALF](https://quizverses.github.io/cut-in-half.html)
- [SEA BATTLE ADMIRAL](https://quizverses.pages.dev/sea-battle-admiral.html)
- [MR BOUNCE](https://quizverses.pages.dev/mr-bounce.html)
- [CATEGORY GROW99](https://thelearnquesters.pages.dev/category-grow99.html)
- [CATEGORY MMO24](https://thelearnquesters.pages.dev/category-mmo24.html)
- [EYE ATTACK TOILET MONSTER WAR](https://studyquests.pages.dev/eye-attack-toilet-monster-war.html)
- [BRICK MATCH](https://studyplaying.github.io/brick-match.html)
- [ALPHABET LORE MAZE](https://quizverses.pages.dev/alphabet-lore-maze.html)
- [CATEGORY TOWER DEFENSE](https://learnquester.github.io/category-tower-defense.html)
- [BASKETBALL LIFE 3D](https://thelearnquesters.pages.dev/basketball-life-3d.html)
- [BLACK PINK CHRISTMAS CONCERT](https://learnquester.pages.dev/black-pink-christmas-concert.html)
- [ARROW COUNT MASTER](https://learnquester.github.io/arrow-count-master.html)
- [KOI FISH POND IDLE MERGE GAME](https://thelearnquesters.pages.dev/koi-fish-pond-idle-merge-game.html)
- [CATEGORY LIGHTSPEED FILTER](https://thelearnquester.web.app/category-lightspeed-filter.html)
- [CATEGORY SPACE](https://thelearnquester.web.app/category-space.html)
- [NUMBER RUSH](https://studyplayings.pages.dev/number-rush.html)
- [BFF HAPPY SPRING](https://quizverses.github.io/bff-happy-spring.html)
- [CINEMA EMPIRE IDLE TYCOON](https://thelearnquesters.pages.dev/cinema-empire-idle-tycoon.html)
- [POTION MERGE WITCH](https://learnquesters.pages.dev/potion-merge-witch.html)
- [CATEGORY CASUAL 9](https://studyplaying.github.io/category-casual-9.html)
- [GLOBAL CITY QKK](https://thelearnquesters.pages.dev/global-city-qkk.html)
- [CATEGORY MOBILE2 112 2](https://studyplaying.github.io/category-mobile2-112-2.html)
- [IDLE PIZZA BUSINESS](https://quizverses.pages.dev/idle-pizza-business.html)
- [CATEGORY MOUSE1 697](https://thelearnquesters.pages.dev/category-mouse1-697.html)
- [CATEGORY MOUSE1 697](https://studyplayings.web.app/category-mouse1-697.html)
- [CATEGORY SHOOTER](https://learnquester.github.io/category-shooter.html)
- [SPRUNKI MATCH](https://quizverses.pages.dev/sprunki-match.html)
- [CATEGORY MERGE](https://learnquesters.pages.dev/category-merge.html)
- [AVATAR LIFE MY TOWN](https://quizverses.github.io/avatar-life-my-town.html)
- [CATEGORY MONSTER206](https://thequizzone.pages.dev/category-monster206.html)
- [ZOMBIE HIGHWAY RAMPAGE](https://quizverses.pages.dev/zombie-highway-rampage.html)
- [CATEGORY FLASH 3](https://thequizzone.pages.dev/category-flash-3.html)
- [GEOMETRY VIBES 3D](https://themindzone.pages.dev/geometry-vibes-3d.html)
- [PYRAMID SOLITAIRE ANCIENT EGYPT](https://quizverses.github.io/pyramid-solitaire-ancient-egypt.html)
- [K POP HUNTERS VALENTINE STYLE](https://thequizzone.pages.dev/k-pop-hunters-valentine-style.html)
- [SHOOT RUN MONSTER HUNTING](https://quizverses.pages.dev/shoot-run-monster-hunting.html)
- [CATEGORY SIMULATION 2](https://learnquester.github.io/category-simulation-2.html)
- [SUPERMARKET MANAGER SIMULATOR](https://thequizzone.pages.dev/supermarket-manager-simulator.html)
- [BRAWL STARS BATTLE](https://studyplaying.github.io/brawl-stars-battle.html)
- [LOL SURPRISE GAME ZONE](https://thequizzone.pages.dev/lol-surprise-game-zone.html)
- [CATEGORY CASUAL 12](https://thequizzone.pages.dev/category-casual-12.html)
- [CATEGORY EDUCATIONAL](https://studyplaying.github.io/category-educational.html)
- [LOVIE CHICS COACHELLA FESTIVAL](https://quizverses.github.io/lovie-chics-coachella-festival.html)
- [AVATAR MAKE UP](https://thelearnquesters.pages.dev/avatar-make-up.html)
- [MINI GAMES PUZZLE COLLECTION](https://thequizzone.pages.dev/mini-games-puzzle-collection.html)
- [CATEGORY MATCH 3](https://learnquester.github.io/category-match-3.html)
- [BULLET SUPERHERO](https://quizverses.github.io/bullet-superhero.html)
- [BALL TOWER OF HELL](https://quizverses.github.io/ball-tower-of-hell.html)
- [ARMY DEFENCE DINO SHOOT](https://quizverses.github.io/army-defence-dino-shoot.html)
- [100 DOORS CHALLENGE](https://studyplaying.github.io/100-doors-challenge.html)
- [SITEMAP](https://thelearnquester.web.app/sitemap.html)
- [CATEGORY ZOMBIE175](https://themindzone.pages.dev/category-zombie175.html)
- [MERMAIDCORE AESTHETICS](https://quizverses.pages.dev/mermaidcore-aesthetics.html)
- [3 TILES](https://quizverses.pages.dev/3-tiles.html)
- [LEXY](https://quizverses.pages.dev/lexy.html)
- [BONE DOCTOR SHOULDER CASE](https://thelearnquesters.pages.dev/bone-doctor-shoulder-case.html)
- [COLOR MIX JELLY MERGE](https://themindzone.pages.dev/color-mix-jelly-merge.html)
- [PAPA BUZJA](https://thelearnquesters.pages.dev/papa-buzja.html)
- [CATEGORY BATTLE 2](https://studyplaying.github.io/category-battle-2.html)
- [URBAN ASSAULT FORCE](https://thelearnquester.web.app/urban-assault-force.html)
- [PET ME MAZE](https://quizverses.github.io/pet-me-maze.html)
- [CATEGORY JUMP SCARE21](https://studyplaying.github.io/category-jump-scare21.html)
- [MY CASTLE MERGE STORY](https://studyquesthub.web.app/my-castle-merge-story.html)
- [CATEGORY MAHJONG](https://studyplaying.github.io/category-mahjong.html)
- [BUS ESCAPE CLEAR JAM](https://studyplaying.github.io/bus-escape-clear-jam.html)
- [CATEGORY MAHJONG CONNECT](https://themindzone.pages.dev/category-mahjong-connect.html)
- [CATEGORY PREMIUM PERKS71](https://learnquester.github.io/category-premium-perks71.html)
- [JELLO BUBBLES](https://studyplayings.pages.dev/jello-bubbles.html)
- [DIRTY MONEY THE RICH GET RICH](https://quizverses.github.io/dirty-money-the-rich-get-rich.html)
- [BUBBLE MANIA SHOOTER](https://quizverses.github.io/bubble-mania-shooter.html)
- [FRUIT JAM MASTER](https://themindzone.pages.dev/fruit-jam-master.html)
- [THREAD SORT](https://thequizzone.pages.dev/thread-sort.html)
- [CATEGORY 2D1 060](https://thelearnquester.web.app/category-2d1-060.html)
- [BLOCOPS](https://studyquesthub.web.app/blocops.html)
- [CYBER MONDAY](https://quizverses.pages.dev/cyber-monday.html)
- [SOFT GIRLS WINTER AESTHETICS](https://quizverses.pages.dev/soft-girls-winter-aesthetics.html)
- [CHRISTMAS SNOWBALL ARENA](https://quizverses.pages.dev/christmas-snowball-arena.html)
- [MOSQUITO BITE 3D](https://themindzone.pages.dev/mosquito-bite-3d.html)
- [BLACKRIVER MYSTERY HIDDEN OBJECTS](https://themindzone.pages.dev/blackriver-mystery-hidden-objects.html)
- [CATEGORY HAPARA](https://studyplaying.github.io/category-hapara.html)
- [DRUNK MAN 3D](https://quizverses.github.io/drunk-man-3d.html)
- [CRYPTOWORD](https://learnquester.pages.dev/cryptoword.html)
- [MATH DUCK](https://quizverses.pages.dev/math-duck.html)
- [CATEGORY BUILDING](https://studyplaying.github.io/category-building.html)
- [FANTASY MATH NUMBER](https://themindzone.pages.dev/fantasy-math-number.html)
- [BODY CARE SIMULATOR](https://quizverses.pages.dev/body-care-simulator.html)
- [OFFROAD LIFE 3D](https://quizverses.github.io/offroad-life-3d.html)
- [ASMR TATTOO TREATMENT](https://themindzone.pages.dev/asmr-tattoo-treatment.html)
- [CUTE CATS ADVENTURES](https://quizverses.github.io/cute-cats-adventures.html)
- [CATEGORY CONTROLLER59](https://thelearnquesters.pages.dev/category-controller59.html)
- [CATEGORY STRATEGY](https://learnquester.pages.dev/category-strategy.html)
- [LAZY WORKERS](https://studyplaying.github.io/lazy-workers.html)
- [CRAFTMART](https://studyplaying.github.io/craftmart.html)
- [CURSED TREASURE 11 2](https://themindzone.pages.dev/cursed-treasure-11-2.html)
