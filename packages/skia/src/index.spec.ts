import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { Readable, Writable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Canvas,
  StaticCanvas,
  Rect,
  FabricImage,
  FabricText,
  Canvas2dFilterBackend,
  filters,
  cache,
  getFabricDocument,
  getEnv,
  util,
} from './index';
import { getNodeCanvas } from './env';
import { FabricError } from '../../core/src/util/internals/console';

const requireSkia = createRequire(import.meta.url);
const napi = requireSkia('@napi-rs/canvas');
const compat = requireSkia('@napi-rs/canvas/node-canvas');
const fixtures = resolve(process.cwd(), 'test/fixtures');
const canvases: StaticCanvas[] = [];
const canvas = (Type = StaticCanvas) => {
  const value = new Type(undefined, {
    width: 32,
    height: 24,
    enableRetinaScaling: false,
    renderOnAddRemove: false,
  });
  canvases.push(value);
  return value;
};
const bytes = async (stream: Readable) => {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
};

afterEach(async () => {
  await Promise.all(canvases.splice(0).map((value) => value.dispose()));
  cache.clearFontCache();
});

describe('Skia entrypoint integration', () => {
  it('uses jsdom 31 and actual napi canvases for both public canvas classes', () => {
    expect(requireSkia('jsdom-skia/package.json').version).toBe('31.0.0');
    for (const Type of [StaticCanvas, Canvas]) {
      const value = canvas(Type);
      expect(value.getNodeCanvas()).toBeInstanceOf(napi.Canvas);
      expect(value.getNodeCanvas()).toBe(getNodeCanvas(value.getElement()));
      expect(value.getElement()).toBeInstanceOf(
        getEnv().window.HTMLCanvasElement,
      );
    }
    // This process must not load Cairo's native addon indirectly through jsdom.
    expect(
      Object.keys(requireSkia.cache).some((path) =>
        /[/\\]canvas[/\\]build[/\\]Release[/\\]canvas\.node$/.test(path),
      ),
    ).toBe(false);
  });

  it.each(['png', 'jpeg'] as const)(
    'exports repeatable %s Node streams, including pipe and async iteration',
    async (format) => {
      const value = canvas();
      value.add(new Rect({ width: 32, height: 24, fill: 'red' }));
      value.renderAll();
      const exportStream = () =>
        format === 'png' ? value.createPNGStream() : value.createJPEGStream();
      const stream = exportStream();
      expect(stream).toBeInstanceOf(Readable);
      const first = await bytes(stream);
      const piped: Buffer[] = [];
      await pipeline(
        exportStream(),
        new Writable({
          write(chunk, _encoding, next) {
            piped.push(Buffer.from(chunk));
            next();
          },
        }),
      );
      expect(Buffer.concat(piped)).toEqual(first);
      expect(await bytes(exportStream())).toEqual(first);
      expect([...first.subarray(0, format === 'png' ? 8 : 3)]).toEqual(
        format === 'png' ? [137, 80, 78, 71, 13, 10, 26, 10] : [255, 216, 255],
      );
      const decoded = await napi.loadImage(first);
      expect([decoded.width, decoded.height]).toEqual([32, 24]);
    },
  );

  it('honors normalized JPEG quality without changing dimensions', async () => {
    const value = canvas();
    for (let x = 0; x < 32; x += 2) {
      value.add(
        new Rect({
          left: x,
          width: 2,
          height: 24,
          fill: x % 4 ? 'red' : 'blue',
        }),
      );
    }
    value.renderAll();
    const low = await bytes(value.createJPEGStream({ quality: 0.1 }));
    const high = await bytes(value.createJPEGStream({ quality: 0.95 }));
    expect(high.length).toBeGreaterThan(low.length);
    expect(high).not.toEqual(low);
  });

  it('propagates export failures through the Node stream error channel', async () => {
    const value = canvas();
    const error = new FabricError('encoder failure');
    vi.spyOn(value.getNodeCanvas(), 'encode').mockRejectedValue(error);
    await expect(bytes(value.createPNGStream())).rejects.toThrow(
      'encoder failure',
    );
  });

  it('accepts JPEG quality endpoints and rejects invalid normalized qualities', async () => {
    const value = canvas();
    for (const quality of [0, 1]) {
      expect(
        (await bytes(value.createJPEGStream({ quality }))).length,
      ).toBeGreaterThan(0);
    }
    for (const quality of [-1, 1.1, NaN, Infinity]) {
      expect(() => value.createJPEGStream({ quality })).toThrow(RangeError);
    }
  });

  it('turns synchronous encoder exceptions into stream errors', async () => {
    const value = canvas();
    vi.spyOn(value.getNodeCanvas(), 'encode').mockImplementation(() => {
      throw new FabricError('synchronous encoder failure');
    });
    await expect(bytes(value.createPNGStream())).rejects.toThrow(
      'synchronous encoder failure',
    );
  });

  it('loads PNG data URLs, SVG data URLs, file fixtures and rejects corrupt input', async () => {
    const value = canvas();
    const image = await util.loadImage(value.toDataURL());
    expect([image.naturalWidth, image.naturalHeight]).toEqual([32, 24]);
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="7" height="9"><rect width="7" height="9" fill="red"/></svg>';
    const vector = await util.loadImage(
      `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
    );
    expect([vector.naturalWidth, vector.naturalHeight]).toEqual([7, 9]);
    const fixture = await util.loadImage('parrot.png');
    expect(fixture.naturalWidth).toBeGreaterThan(0);
    await expect(
      util.loadImage('data:image/png;base64,Y29ycnVwdA=='),
    ).rejects.toThrow();
  });

  it('unwraps DOM sources in drawImage/createPattern and supports cached/filter rendering', async () => {
    const value = canvas();
    const source = getFabricDocument().createElement('canvas');
    source.width = source.height = 4;
    const context = source.getContext('2d')!;
    context.fillStyle = 'red';
    context.fillRect(0, 0, 4, 4);
    const target = value.getContext();
    target.drawImage(source, 0, 0);
    expect([...target.getImageData(1, 1, 1, 1).data]).toEqual([255, 0, 0, 255]);
    target.fillStyle = target.createPattern(source, 'repeat')!;
    target.fillRect(0, 0, 16, 16);
    expect([...target.getImageData(8, 8, 1, 1).data]).toEqual([255, 0, 0, 255]);
    const filtered = getFabricDocument().createElement('canvas');
    filtered.width = filtered.height = 4;
    new Canvas2dFilterBackend().applyFilters(
      [new filters.Invert()],
      source,
      4,
      4,
      filtered,
    );
    expect([
      ...filtered.getContext('2d')!.getImageData(1, 1, 1, 1).data,
    ]).toEqual([0, 255, 255, 255]);
    const object = new FabricImage(filtered, { objectCaching: true });
    value.add(object);
    value.renderAll();
    expect([...value.getContext().getImageData(1, 1, 1, 1).data]).toEqual([
      0, 255, 255, 255,
    ]);
  });

  it('renders cached objects through the native surface', () => {
    const value = canvas();
    const rect = new Rect({
      width: 16,
      height: 16,
      fill: 'red',
      objectCaching: true,
      strokeWidth: 0,
    });
    value.add(rect);
    value.renderAll();
    expect(rect._cacheCanvas).toBeDefined();
    expect(getNodeCanvas(rect._cacheCanvas!)).toBeInstanceOf(napi.Canvas);
    expect([...value.getContext().getImageData(4, 4, 1, 1).data]).toEqual([
      255, 0, 0, 255,
    ]);
  });

  it('resizes the native surface and disposes the DOM canvas implementation', async () => {
    const value = canvas();
    const element = value.getElement();
    value.setDimensions({ width: 17, height: 19 });
    expect([value.getNodeCanvas().width, value.getNodeCanvas().height]).toEqual(
      [17, 19],
    );
    await value.dispose();
    expect(getNodeCanvas(element)).toBeFalsy();
    canvases.splice(canvases.indexOf(value), 1);
  });

  it('registers regular, bold and italic font faces and permits clearing Fabric measurements', () => {
    for (const suffix of ['Regular', 'Bold', 'Italic', 'BoldItalic']) {
      expect(
        napi.GlobalFonts.registerFromPath(
          resolve(fixtures, `Ubuntu-${suffix}.ttf`),
          'SkiaUbuntu',
        ),
      ).toBeTruthy();
    }
    const widths = ['normal', 'bold'].map(
      (fontWeight) =>
        new FabricText('Fabric Skia', { fontFamily: 'SkiaUbuntu', fontWeight })
          .width,
    );
    expect(widths.every((width) => width > 0)).toBe(true);
    expect(widths[0]).not.toBe(widths[1]);
    const italic = new FabricText('Fabric Skia', {
      fontFamily: 'SkiaUbuntu',
      fontStyle: 'italic',
    });
    expect(italic.width).toBeGreaterThan(0);
    expect(cache.charWidthsCache.has('skiaubuntu')).toBe(true);
    cache.clearFontCache('SkiaUbuntu');
    expect(cache.charWidthsCache.has('skiaubuntu')).toBe(false);
    italic.initDimensions();
    expect(cache.charWidthsCache.has('skiaubuntu')).toBe(true);
  });

  it('renders the registered variable font at weights 100, 400 and 900', () => {
    const family = 'SkiaRobotoMonoVariable';
    expect(
      napi.GlobalFonts.registerFromPath(
        resolve(fixtures, 'fonts/RobotoMono-Variable.ttf'),
        family,
      ),
    ).toBeTruthy();
    expect(napi.GlobalFonts.families).toContainEqual(
      expect.objectContaining({ family }),
    );
    const value = canvas();
    value.setDimensions({ width: 200, height: 70 });
    const widths: number[] = [];
    const coverage = [100, 400, 900].map((fontWeight) => {
      const text = new FabricText('MiWi', {
        fontFamily: family,
        fontWeight,
        fontSize: 40,
      });
      widths.push(text.width);
      value.clear();
      value.add(text);
      value.renderAll();
      const pixels = value.getContext().getImageData(0, 0, 200, 70).data;
      return pixels.reduce(
        (sum, byte, index) => sum + (index % 4 === 3 ? byte : 0),
        0,
      );
    });
    expect(widths[0]).toBeGreaterThan(0);
    expect(widths[1]).toBeCloseTo(widths[0], 5);
    expect(widths[2]).toBeCloseTo(widths[0], 5);
    expect(coverage[0]).toBeGreaterThan(0);
    expect(coverage[1]).toBeGreaterThan(coverage[0]);
    expect(coverage[2]).toBeGreaterThan(coverage[1]);
    // Roboto Mono has equal advances for narrow and wide glyphs. Check the
    // requested face, rather than accepting a silently substituted sans font.
    const narrow = new FabricText('iiii', { fontFamily: family }).width;
    const wide = new FabricText('WWWW', { fontFamily: family }).width;
    expect(narrow).toBeCloseTo(wide, 5);
    const fallback = new FabricText('iiii', { fontFamily: 'SkiaMissingFont' })
      .width;
    expect(narrow).not.toBeCloseTo(fallback, 2);
  });

  it('uses font file metadata rather than compat weight/style overrides', () => {
    compat.registerFont(resolve(fixtures, 'Ubuntu-Regular.ttf'), {
      family: 'SkiaMetadata',
      weight: 'bold',
      style: 'italic',
    });
    const family = napi.GlobalFonts.families.find(
      (entry: { family: string }) => entry.family === 'SkiaMetadata',
    );
    expect(family).toBeDefined();
    expect(family.styles).toContainEqual(
      expect.objectContaining({ weight: 400, style: 'normal' }),
    );
    expect(family.styles).not.toContainEqual(
      expect.objectContaining({ weight: 700, style: 'italic' }),
    );
  });
});
