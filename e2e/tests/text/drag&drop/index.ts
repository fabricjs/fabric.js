import * as fabric from 'fabric';
import { before } from '../../test';

const styles = {
  0: {
    0: { fill: 'red', fontSize: 20 },
    1: { fill: 'red', fontSize: 30 },
    2: { fill: 'red', fontSize: 40 },
    3: { fill: 'red', fontSize: 50 },
    4: { fill: 'red', fontSize: 60 },
    6: { textBackgroundColor: 'yellow' },
    7: {
      textBackgroundColor: 'yellow',
      textDecoration: ' line-through',
      linethrough: true,
    },
    8: {
      textBackgroundColor: 'yellow',
      textDecoration: ' line-through',
      linethrough: true,
    },
    9: { textBackgroundColor: 'yellow' },
  },
  1: {
    0: { textDecoration: 'underline' },
    1: { textDecoration: 'underline' },
    2: {
      fill: 'green',
      fontStyle: 'italic',
      textDecoration: 'underline',
    },
    3: {
      fill: 'green',
      fontStyle: 'italic',
      textDecoration: 'underline',
    },
    4: {
      fill: 'green',
      fontStyle: 'italic',
      textDecoration: 'underline',
    },
  },
  2: {
    0: { fill: 'blue', fontWeight: 'bold' },
    1: { fill: 'blue', fontWeight: 'bold' },
    2: { fill: 'blue', fontWeight: 'bold', fontSize: 63 },
    4: {
      textDecoration: ' underline',
      underline: true,
    },
    5: {
      textDecoration: ' underline',
      underline: true,
    },
    6: {
      textDecoration: ' overline',
      overline: true,
    },
    7: {
      textDecoration: ' overline',
      overline: true,
    },
    8: {
      textDecoration: ' overline',
      overline: true,
    },
  },
  3: {
    0: { fill: '#666', textDecoration: 'line-through' },
    1: { fill: '#666', textDecoration: 'line-through' },
    2: { fill: '#666', textDecoration: 'line-through' },
    3: { fill: '#666', textDecoration: 'line-through' },
    4: { fill: '#666', textDecoration: 'line-through' },
    7: { textDecoration: ' underline', underline: true },
    8: { stroke: '#ff1e15', strokeWidth: 2 },
    9: { stroke: '#ff1e15', strokeWidth: 2 },
  },
};

const roundPoint = (point: fabric.Point) => ({
  x: Math.round(point.x),
  y: Math.round(point.y),
});

const parseEvent = (
  type: string,
  { pointer, absolutePointer, ...ev }: Record<string, any> = {},
  caller: fabric.Textbox | fabric.Canvas,
) =>
  JSON.parse(
    JSON.stringify([
      type,
      {
        ...ev,
        ...(pointer ? { pointer: roundPoint(pointer) } : {}),
        ...(absolutePointer
          ? { absolutePointer: roundPoint(absolutePointer) }
          : {}),
      },
      caller,
    ]),
  );

export class DragDropTestCanvas extends fabric.Canvas {
  eventStream: any[] = [];
  readEventStream() {
    const data = this.eventStream;
    this.eventStream = [];
    return data;
  }
  toJSON() {
    return 'canvas';
  }
}

const commonEvents = [
  'dragstart',
  // 'dragover',
  // 'drag',
  'dragenter',
  'dragleave',
  'drop',
  'dragend',
] as const;

before('#canvas', (el) => {
  const canvas = new DragDropTestCanvas(el, { width: 800, height: 500 });
  const textValue = 'fabric.js sandbox';
  const a = new fabric.Textbox(textValue, {
    originX: 'center',
    width: 210,
    left: 150,
    top: 20,
    splitByGrapheme: true,
    styles: fabric.util.stylesFromArray(
      [
        {
          style: {
            fontWeight: 'bold',
            fontSize: 64,
          },
          start: 0,
          end: 9,
        },
      ],
      textValue,
    ),
  });
  const b = new fabric.Textbox('lorem ipsum\ndolor\nsit Amet2\nconsectgetur', {
    left: 400,
    top: 20,
    objectCaching: false,
    fontFamily: 'Arial',
    // @ts-expect-error -- styles mock
    styles,
  });

  (
    [...commonEvents, 'text:selection:changed', 'text:changed'] as const
  ).forEach((type) => {
    canvas.on(type, (ev) => {
      canvas.eventStream.push(parseEvent(type, ev, canvas));
    });
  });
  ([...commonEvents, 'selection:changed', 'changed'] as const).forEach(
    (type) => {
      a.on(type, (ev) => canvas.eventStream.push(parseEvent(type, ev, a)));
      b.on(type, (ev) => canvas.eventStream.push(parseEvent(type, ev, b)));
    },
  );
  Object.entries({ a, b }).forEach(
    ([key, object]) => (object.toJSON = () => key),
  );

  canvas.add(a, b);
  return { canvas, objects: { a, b } };
});
