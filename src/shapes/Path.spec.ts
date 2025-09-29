import { describe, expect, it } from 'vitest';
import { Path } from './Path';
import type { TSimpleParsedCommand } from '../util';
import { FabricObject, getFabricDocument, version } from '../../fabric';

const REFERENCE_PATH_OBJECT = {
  version: version,
  type: 'Path',
  originX: 'center' as const,
  originY: 'center' as const,
  left: 200,
  top: 200,
  width: 200,
  height: 200,
  fill: 'red',
  stroke: 'blue',
  strokeWidth: 0,
  strokeDashArray: null,
  strokeLineCap: 'butt' as const,
  strokeDashOffset: 0,
  strokeLineJoin: 'miter' as const,
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  path: [
    ['M', 100, 100],
    ['L', 300, 100],
    ['L', 200, 300],
    ['Z'],
  ] as TSimpleParsedCommand[],
  shadow: null,
  visible: true,
  backgroundColor: '',
  fillRule: 'nonzero' as const,
  paintFirst: 'fill' as const,
  globalCompositeOperation: 'source-over' as const,
  skewX: 0,
  skewY: 0,
  strokeUniform: false,
};

function getPathElement(path: string) {
  const namespace = 'http://www.w3.org/2000/svg';
  const el = getFabricDocument().createElementNS(namespace, 'path');

  el.setAttributeNS(namespace, 'd', path);
  el.setAttributeNS(namespace, 'fill', 'red');
  el.setAttributeNS(namespace, 'stroke', 'blue');
  el.setAttributeNS(namespace, 'stroke-width', String(1));
  el.setAttributeNS(namespace, 'stroke-linecap', 'butt');
  el.setAttributeNS(namespace, 'stroke-linejoin', 'miter');
  el.setAttributeNS(namespace, 'stroke-miterlimit', String(4));

  return el;
}

function makePathObject() {
  return new Promise<Path>((resolve) => {
    const path = new Path('M 100 100 L 300 100 L 200 300 z', {
      fill: 'red',
      stroke: 'blue',
      strokeLineCap: 'butt',
      strokeLineJoin: 'miter',
      strokeMiterLimit: 4,
      strokeWidth: 0,
    });
    resolve(path);
  });
}

function updatePath(
  pathObject: Path,
  value: string | TSimpleParsedCommand[],
  preservePosition: boolean,
) {
  const { left, top } = pathObject;

  pathObject._setPath(value);

  if (preservePosition) {
    pathObject.set({ left, top });
  }
}

describe('Path', () => {
  it('constructor', async () => {
    expect(Path, 'Path class should exist').toBeTruthy();

    const path = await makePathObject();

    expect(path, 'should be instance of Path').toBeInstanceOf(Path);
    expect(path, 'should be instance of FabricObject').toBeInstanceOf(
      FabricObject,
    );
    expect(path.constructor, 'type should be Path').toHaveProperty(
      'type',
      'Path',
    );
    expect(
      // @ts-expect-error -- creating an empty path for testing
      () => new Path(),
      'should not throw error on empty path',
    ).not.toThrow();
  });

  it('initialize', () => {
    const path = new Path('M 100 100 L 200 100 L 170 200 z', {
      top: 0,
      strokeWidth: 0,
    });

    expect(path.left, 'left should be 150').toBe(150);
    expect(path.top, 'top should be 0').toBe(0);
  });

  it('initialize with strokeWidth', () => {
    const path = new Path('M 100 100 L 200 100 L 170 200 z', {
      strokeWidth: 50,
    });

    expect(path.left, 'left should be 150').toBe(150);
    expect(path.top, 'top should be 150').toBe(150);
  });

  it('initialize with strokeWidth with originX and originY center/center', () => {
    const path = new Path('M 100 100 L 200 100 L 170 200 z', {
      strokeWidth: 4,
      originX: 'center',
      originY: 'center',
    });

    expect(path.left, 'left should be 150').toBe(150);
    expect(path.top, 'top should be 150').toBe(150);
  });

  it('initialize with strokeWidth with originX and originY top/left', () => {
    const path = new Path('M 100 100 L 200 100 L 170 200 z', {
      strokeWidth: 4,
      originX: 'left',
      originY: 'top',
    });

    expect(path.left, 'left should be 98').toBe(98);
    expect(path.top, 'top should be 98').toBe(98);
  });

  it('initialize with strokeWidth with originX and originY bottom/right', () => {
    const path = new Path('M 100 100 L 200 100 L 170 200 z', {
      strokeWidth: 4,
      originX: 'right',
      originY: 'bottom',
    });

    expect(path.left, 'left should be 202').toBe(202);
    expect(path.top, 'top should be 202').toBe(202);
  });

  it('set path after initialization', async () => {
    const path = new Path(
      'M 100 100 L 200 100 L 170 200 z',
      REFERENCE_PATH_OBJECT,
    );

    updatePath(path, REFERENCE_PATH_OBJECT.path, true);

    expect(path.toObject(), 'path object should match reference').toEqual(
      REFERENCE_PATH_OBJECT,
    );

    updatePath(path, REFERENCE_PATH_OBJECT.path, false);

    const opts: typeof REFERENCE_PATH_OBJECT & {
      sourcePath?: string;
    } = {
      ...REFERENCE_PATH_OBJECT,
    };

    // @ts-expect-error -- deleting intentionally
    delete opts.path;

    path.set(opts);
    updatePath(path, 'M 100 100 L 300 100 L 200 300 z', true);

    const cleanPath = await makePathObject();

    expect(
      path.toObject(),
      'path object should match clean path object',
    ).toEqual(cleanPath.toObject());
  });

  it('Path initialized with strokeWidth takes that in account for positioning', async () => {
    const path = new Path(
      'M 100 100 L 200 100 L 170 200 z',
      REFERENCE_PATH_OBJECT,
    );

    updatePath(path, REFERENCE_PATH_OBJECT.path, true);

    expect(path.toObject(), 'path object should match reference').toEqual(
      REFERENCE_PATH_OBJECT,
    );

    updatePath(path, REFERENCE_PATH_OBJECT.path, false);

    const opts: typeof REFERENCE_PATH_OBJECT & {
      sourcePath?: string;
    } = {
      ...REFERENCE_PATH_OBJECT,
    };
    // @ts-expect-error -- deleting intentionally
    delete opts.path;

    path.set(opts);
    updatePath(path, 'M 100 100 L 300 100 L 200 300 z', true);

    const cleanPath = await makePathObject();

    expect(
      path.toObject(),
      'path object should match clean path object',
    ).toEqual(cleanPath.toObject());
  });

  it('toString', async () => {
    const path = await makePathObject();

    expect(path.toString, 'toString should be a function').toBeTypeOf(
      'function',
    );
    expect(path.toString(), 'toString should return expected string').toBe(
      '#<Path (4): { "top": 200, "left": 200 }>',
    );
  });

  it('toObject', async () => {
    const path = await makePathObject();

    expect(path.toObject, 'toObject should be a function').toBeTypeOf(
      'function',
    );
    expect(path.toObject(), 'toObject should match reference').toEqual(
      REFERENCE_PATH_OBJECT,
    );
  });

  it('toObject with defaults', async () => {
    const path = await makePathObject();

    path.top = Path.getDefaults().top;
    path.left = Path.getDefaults().left;
    path.includeDefaultValues = false;

    const obj = path.toObject();

    expect(obj.top, 'top is available also when equal to prototype').toBe(
      Path.getDefaults().top,
    );
    expect(obj.left, 'left is available also when equal to prototype').toBe(
      Path.getDefaults().left,
    );
  });

  it('toSVG', async () => {
    const path = await makePathObject();

    expect(path.toSVG, 'toSVG should be a function').toBeTypeOf('function');
    expect(path.toSVG(), 'SVG output should match expected').toEqualSVG(
      '<g transform="matrix(1 0 0 1 200 200)"  >\n<path style="stroke: rgb(0,0,255); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  transform=" translate(-200, -200)" d="M 100 100 L 300 100 L 200 300 Z" stroke-linecap="round" />\n</g>\n',
    );
  });

  it('toSVG of path with a strokeWidth', async () => {
    const path = await makePathObject();

    path.strokeWidth = 2;

    expect(path.toSVG(), 'SVG output should match expected').toEqualSVG(
      '<g transform="matrix(1 0 0 1 200 200)"  >\n<path style="stroke: rgb(0,0,255); stroke-width: 2; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  transform=" translate(-200, -200)" d="M 100 100 L 300 100 L 200 300 Z" stroke-linecap="round" />\n</g>\n',
    );
  });

  it('toSVG with a clipPath path', async () => {
    const path = await makePathObject();
    path.clipPath = await makePathObject();

    expect(path.toSVG(), 'path clipPath toSVG should match').toEqualSVG(
      '<g transform="matrix(1 0 0 1 200 200)" clip-path="url(#CLIPPATH_0)"  >\n<clipPath id="CLIPPATH_0" >\n\t<path transform="matrix(1 0 0 1 200 200) translate(-200, -200)" d="M 100 100 L 300 100 L 200 300 Z" stroke-linecap="round" />\n</clipPath>\n<path style="stroke: rgb(0,0,255); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  transform=" translate(-200, -200)" d="M 100 100 L 300 100 L 200 300 Z" stroke-linecap="round" />\n</g>\n',
    );
  });

  it('toSVG with a clipPath path absolutePositioned', async () => {
    const path = await makePathObject();
    path.clipPath = await makePathObject();
    path.clipPath.absolutePositioned = true;

    expect(
      path.toSVG(),
      'path clipPath toSVG absolute should match',
    ).toEqualSVG(
      '<g clip-path="url(#CLIPPATH_0)"  >\n<g transform="matrix(1 0 0 1 200 200)"  >\n<clipPath id="CLIPPATH_0" >\n\t<path transform="matrix(1 0 0 1 200 200) translate(-200, -200)" d="M 100 100 L 300 100 L 200 300 Z" stroke-linecap="round" />\n</clipPath>\n<path style="stroke: rgb(0,0,255); stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(255,0,0); fill-rule: nonzero; opacity: 1;"  transform=" translate(-200, -200)" d="M 100 100 L 300 100 L 200 300 Z" stroke-linecap="round" />\n</g>\n</g>\n',
    );
  });

  it('path array not shared when cloned', async () => {
    const originalPath = await makePathObject();
    const clonedPath = await originalPath.clone();

    clonedPath.path[0][1] = 200;

    expect(
      originalPath.path[0][1],
      'original path should not be modified',
    ).toBe(100);
  });

  it('toDatalessObject', async () => {
    const path = await makePathObject();

    expect(
      path.toDatalessObject,
      'toDatalessObject should be a function',
    ).toBeTypeOf('function');
    expect(
      path.toDatalessObject(),
      'if not sourcePath the object is same',
    ).toEqual(REFERENCE_PATH_OBJECT);
  });

  it('toDatalessObject with sourcePath', async () => {
    const path = await makePathObject();
    const src = 'http://example.com/';

    path.sourcePath = src;

    const clonedRef: typeof REFERENCE_PATH_OBJECT & {
      sourcePath?: string;
    } = {
      ...REFERENCE_PATH_OBJECT,
    };

    clonedRef.sourcePath = src;

    // @ts-expect-error -- deleting intentionally
    delete clonedRef.path;

    expect(
      path.toDatalessObject(),
      'if sourcePath the object looses path',
    ).toEqual(clonedRef);
  });

  it('complexity', async () => {
    const path = await makePathObject();

    expect(path.complexity, 'complexity should be a function').toBeTypeOf(
      'function',
    );
  });

  it('fromObject', async () => {
    expect(Path.fromObject, 'fromObject should be a function').toBeTypeOf(
      'function',
    );

    const path = await Path.fromObject(REFERENCE_PATH_OBJECT);

    expect(path, 'should be instance of Path').toBeInstanceOf(Path);
    expect(path.toObject(), 'path object should match reference').toEqual(
      REFERENCE_PATH_OBJECT,
    );
  });

  it('fromObject with sourcePath', async () => {
    expect(Path.fromObject, 'fromObject should be a function').toBeTypeOf(
      'function',
    );

    const path = await Path.fromObject(REFERENCE_PATH_OBJECT);

    expect(path, 'should be instance of Path').toBeInstanceOf(Path);
    expect(path.toObject(), 'path object should match reference').toEqual(
      REFERENCE_PATH_OBJECT,
    );
  });

  it('fromElement', async () => {
    expect(Path.fromElement, 'fromElement should be a function').toBeTypeOf(
      'function',
    );

    const namespace = 'http://www.w3.org/2000/svg';
    const elPath = getFabricDocument().createElementNS(namespace, 'path');

    elPath.setAttributeNS(namespace, 'd', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttributeNS(namespace, 'fill', 'red');
    elPath.setAttributeNS(namespace, 'opacity', '1');
    elPath.setAttributeNS(namespace, 'stroke', 'blue');
    elPath.setAttributeNS(namespace, 'stroke-width', '0');
    elPath.setAttributeNS(namespace, 'stroke-dasharray', '5, 2');
    elPath.setAttributeNS(namespace, 'stroke-linecap', 'round');
    elPath.setAttributeNS(namespace, 'stroke-linejoin', 'bevel');
    elPath.setAttributeNS(namespace, 'stroke-miterlimit', '5');
    elPath.setAttributeNS(namespace, 'transform', 'scale(2)');

    const path = await Path.fromElement(elPath);

    expect(path, 'should be instance of Path').toBeInstanceOf(Path);
    expect(path.toObject(), 'path object should match reference').toEqual({
      ...REFERENCE_PATH_OBJECT,
      strokeDashArray: [5, 2],
      strokeLineCap: 'round',
      strokeLineJoin: 'bevel',
      strokeMiterLimit: 5,
    });

    const ANGLE_DEG = 90;

    elPath.setAttributeNS(namespace, 'transform', 'rotate(' + ANGLE_DEG + ')');

    const rotatedPath = await Path.fromElement(elPath);

    expect(
      rotatedPath.get('transformMatrix'),
      'transform matrix should match expected',
    ).toEqual([0, 1, -1, 0, 0, 0]);
  });

  it('numbers with leading decimal point', async () => {
    expect(Path.fromElement, 'fromElement should be a function').toBeTypeOf(
      'function',
    );

    const namespace = 'http://www.w3.org/2000/svg';
    const elPath = getFabricDocument().createElementNS(namespace, 'path');

    elPath.setAttributeNS(namespace, 'd', 'M 100 100 L 300 100 L 200 300 z');
    elPath.setAttributeNS(namespace, 'transform', 'scale(.2)');

    const path = await Path.fromElement(elPath);

    expect(path, 'should be instance of Path').toBeInstanceOf(Path);

    // @ts-expect-error -- TODO: check why transformMatrix is not set on the Path as potential type?
    expect(path.transformMatrix, 'transform has been parsed').toEqual([
      0.2, 0, 0, 0.2, 0, 0,
    ]);
  });

  it('multiple sequences in path commands', async () => {
    const el = getPathElement('M100 100 l 200 200 300 300 400 -50 z');
    const obj = await Path.fromElement(el);

    expect(obj.path[0], 'first path command should match').toEqual([
      'M',
      100,
      100,
    ]);
    expect(obj.path[1], 'second path command should match').toEqual([
      'L',
      300,
      300,
    ]);
    expect(obj.path[2], 'third path command should match').toEqual([
      'L',
      600,
      600,
    ]);
    expect(obj.path[3], 'fourth path command should match').toEqual([
      'L',
      1000,
      550,
    ]);

    const el2 = getPathElement(
      'c 0,-53.25604 43.17254,-96.42858 96.42857,-96.42857 53.25603,0 96.42857,43.17254 96.42857,96.42857',
    );
    const obj2 = await Path.fromElement(el2);

    expect(obj2.path[0], 'first cubic command should match').toEqual([
      'C',
      0,
      -53.25604,
      43.17254,
      -96.42858,
      96.42857,
      -96.42857,
    ]);
    expect(obj2.path[1], 'second cubic command should match').toEqual([
      'C',
      149.6846,
      -96.42857,
      192.85714,
      -53.256029999999996,
      192.85714,
      0,
    ]);
  });

  it('multiple M/m coordinates converted all L', async () => {
    const el = getPathElement(
      'M100 100 200 200 150 50 m 300 300 400 -50 50 100',
    );
    const obj = await Path.fromElement(el);

    expect(obj.path[0], 'first path command should match').toEqual([
      'M',
      100,
      100,
    ]);
    expect(obj.path[1], 'second path command should match').toEqual([
      'L',
      200,
      200,
    ]);
    expect(obj.path[2], 'third path command should match').toEqual([
      'L',
      150,
      50,
    ]);
    expect(obj.path[3], 'fourth path command should match').toEqual([
      'M',
      450,
      350,
    ]);
    expect(obj.path[4], 'fifth path command should match').toEqual([
      'L',
      850,
      300,
    ]);
    expect(obj.path[5], 'sixth path command should match').toEqual([
      'L',
      900,
      400,
    ]);
  });

  it('multiple M/m commands converted all as M commands', async () => {
    const el = getPathElement(
      'M100 100 M 200 200 M150 50 m 300 300 m 400 -50 m 50 100',
    );
    const obj = await Path.fromElement(el);

    expect(obj.path[0], 'first path command should match').toEqual([
      'M',
      100,
      100,
    ]);
    expect(obj.path[1], 'second path command should match').toEqual([
      'M',
      200,
      200,
    ]);
    expect(obj.path[2], 'third path command should match').toEqual([
      'M',
      150,
      50,
    ]);
    expect(obj.path[3], 'fourth path command should match').toEqual([
      'M',
      450,
      350,
    ]);
    expect(obj.path[4], 'fifth path command should match').toEqual([
      'M',
      850,
      300,
    ]);
    expect(obj.path[5], 'sixth path command should match').toEqual([
      'M',
      900,
      400,
    ]);
  });

  it('compressed path commands', async () => {
    const el = getPathElement(
      'M56.224 84.12C-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215z',
    );
    const obj = await Path.fromElement(el);

    expect(obj.path[0], 'first path command should match').toEqual([
      'M',
      56.224,
      84.12,
    ]);
    expect(obj.path[1], 'second path command should match').toEqual([
      'C',
      -0.047,
      0.132,
      -0.138,
      0.221,
      -0.322,
      0.215,
    ]);
    expect(obj.path[2], 'third path command should match').toEqual([
      'C',
      0.046,
      -0.131,
      0.137,
      -0.221,
      0.322,
      -0.215,
    ]);
    expect(obj.path[3], 'fourth path command should match').toEqual(['Z']);
  });

  it('compressed path commands with e^x', async () => {
    const el = getPathElement(
      'M56.224e2 84.12E-2C-.047.132-.138.221-.322.215.046-.131.137-.221.322-.215m-.050 -20.100z',
    );
    const obj = await Path.fromElement(el);

    expect(obj.path[0], 'first path command should match').toEqual([
      'M',
      5622.4,
      0.8412,
    ]);
    expect(obj.path[1], 'second path command should match').toEqual([
      'C',
      -0.047,
      0.132,
      -0.138,
      0.221,
      -0.322,
      0.215,
    ]);
    expect(obj.path[2], 'third path command should match').toEqual([
      'C',
      0.046,
      -0.131,
      0.137,
      -0.221,
      0.322,
      -0.215,
    ]);
    expect(obj.path[3], 'fourth path command should match').toEqual([
      'M',
      0.272,
      -20.315,
    ]);
    expect(obj.path[4], 'fifth path command should match').toEqual(['Z']);
  });

  it('can parse arcs with rx and ry set to 0', () => {
    const path = new Path(
      'M62.87543,168.19448H78.75166a0,0,0,0,1,0,0v1.9884a6.394,6.394,0,0,1-6.394,6.394H69.26939a6.394,6.394,0,0,1-6.394-6.394v-1.9884A0,0,0,0,1,62.87543,168.19448Z',
    );

    expect(
      path.path.length,
      'path should have correct number of commands',
    ).toBe(9);
  });
});
