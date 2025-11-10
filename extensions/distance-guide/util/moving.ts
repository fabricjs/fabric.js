import type { BasicTransformEvent, FabricObject, TBBox } from 'fabric';
import { Point, util } from 'fabric';
import type { DistanceGuide } from '..';

export function moving(
  this: DistanceGuide,
  e: BasicTransformEvent & { target: FabricObject },
) {
  const target = e.target;
  const parent = target.parent ?? this.canvas;
  const tBox = util.makeBoundingBoxFromPoints(target.getCoords());
  const bottom = tBox.top + tBox.height;
  const right = tBox.left + tBox.width;
  const vArr: FabricObject[] = [];
  const hArr: FabricObject[] = [];
  const boxMap = new Map<FabricObject, TBBox>();
  for (const item of parent.getObjects()) {
    if (item == target) continue;
    const box = util.makeBoundingBoxFromPoints(item.getCoords());
    if (
      (tBox.top >= box.top && tBox.top <= box.top + box.height) ||
      (bottom >= box.top && bottom <= box.top + box.height)
    ) {
      if (item.isOnScreen()) {
        vArr.push(item);
        boxMap.set(item, box);
      }
    }
    if (
      (tBox.left >= box.left && tBox.left <= box.left + box.width) ||
      (right >= box.left && right <= box.left + box.width)
    ) {
      if (item.isOnScreen()) {
        hArr.push(item);
        boxMap.set(item, box);
      }
    }
  }
  vArr.sort((a, b) => a.left - b.left);
  hArr.sort((a, b) => a.top - b.top);
  const xLines = collectXLines.call(this, {
    target,
    box: tBox,
    arr: vArr,
    map: boxMap,
  });
  const yLines = collectYLines.call(this, {
    target,
    box: tBox,
    arr: hArr,
    map: boxMap,
  });

  this.movingMap = { xLines, yLines };
}

type CollectLinesProps = {
  target: FabricObject;
  arr: FabricObject[];
  map: Map<FabricObject, TBBox>;
  box: TBBox;
};
function collectXLines(this: DistanceGuide, props: CollectLinesProps) {
  const { target, arr, map, box } = props;
  if (arr.length < 2) return [];
  const right = box.left + box.width;
  const margin = this.margin / this.canvas.getZoom();
  let min = Infinity;
  let start: number | undefined;
  for (const item of arr) {
    const itemBox = map.get(item)!;
    const itemRight = itemBox.left + itemBox.width;
    const v = box.left - itemRight;
    if (v > 0 && v < min) {
      min = v;
      start = itemRight;
    }
  }
  if (start == undefined) return collectXLinesByRight.call(this, props);

  let end: number | undefined;
  let dis = Infinity;
  for (const item of arr) {
    const itemLeft = map.get(item)!.left;
    const v = itemLeft - right;
    const d = Math.abs(v - min);
    if (d > margin) continue;
    if (d > dis) continue;
    end = itemLeft;
    dis = v - min;
  }
  if (end == undefined) return collectXLinesByLeft.call(this, props);
  if (dis != 0) {
    target.left += dis / 2;
    target.setCoords();
    box.left += dis / 2;
  }

  const y = box.top + box.height / 3;
  return [
    { origin: new Point(start, y), target: new Point(box.left, y) },
    { origin: new Point(end, y), target: new Point(box.left + box.width, y) },
  ];
}

function collectYLines(this: DistanceGuide, props: CollectLinesProps) {
  const { target, arr, map, box } = props;
  if (arr.length < 2) return [];
  const bottom = box.top + box.height;
  const margin = this.margin / this.canvas.getZoom();
  let min = Infinity;
  let start: number | undefined;
  for (const item of arr) {
    const itemBox = map.get(item)!;
    const itemBottom = itemBox.top + itemBox.height;
    const v = box.top - itemBottom;
    if (v > 0 && v < min) {
      min = v;
      start = itemBottom;
    }
  }
  if (start == undefined) return collectYLinesByBottom.call(this, props);

  let end: number | undefined;
  let dis = Infinity;
  for (const item of arr) {
    const itemTop = map.get(item)!.top;
    const v = itemTop - bottom;
    const d = Math.abs(v - min);
    if (d > margin) continue;
    if (d > dis) continue;
    end = itemTop;
    dis = v - min;
  }
  if (end == undefined) return collectYLinesByTop.call(this, props);

  if (dis != 0) {
    target.top += dis / 2;
    target.setCoords();
    box.top += dis / 2;
  }

  const x = box.left + box.width / 3;
  return [
    { origin: new Point(x, start), target: new Point(x, box.top) },
    { origin: new Point(x, end), target: new Point(x, box.top + box.height) },
  ];
}

function collectXLinesByLeft(this: DistanceGuide, props: CollectLinesProps) {
  const { arr, map, target, box } = props;
  const start = arr[arr.length - 2];
  const end = arr[arr.length - 1];
  const startBox = map.get(start)!;
  const endBox = map.get(end)!;
  const space = endBox.left - (startBox.left + startBox.width);
  if (space <= 0) return [];
  const margin = this.margin / this.canvas.getZoom();
  const v = box.left - (endBox.left + endBox.width);
  if (v <= 0) return [];
  const dis = space - v;
  if (Math.abs(dis) > margin) return [];
  if (dis != 0) {
    target.left += dis;
    target.setCoords();
    box.left += dis;
  }
  const y = box.top + box.height / 3;
  return [
    {
      origin: new Point(startBox.left + startBox.width, y),
      target: new Point(endBox.left, y),
    },
    {
      origin: new Point(endBox.left + endBox.width, y),
      target: new Point(box.left, y),
    },
  ];
}
function collectXLinesByRight(this: DistanceGuide, props: CollectLinesProps) {
  const { arr, map, target, box } = props;
  const start = arr[0];
  const end = arr[1];
  const startBox = map.get(start)!;
  const endBox = map.get(end)!;
  const space = endBox.left - (startBox.left + startBox.width);
  if (space <= 0) return [];
  const margin = this.margin / this.canvas.getZoom();
  const v = startBox.left - (box.left + box.width);
  if (v <= 0) return [];
  const dis = v - space;
  if (Math.abs(dis) > margin) return [];
  if (dis != 0) {
    target.left += dis;
    target.setCoords();
    box.left += dis;
  }
  const y = box.top + box.height / 3;
  return [
    {
      origin: new Point(startBox.left, y),
      target: new Point(box.left + box.width, y),
    },
    {
      origin: new Point(startBox.left + startBox.width, y),
      target: new Point(endBox.left, y),
    },
  ];
}
function collectYLinesByTop(this: DistanceGuide, props: CollectLinesProps) {
  const { arr, map, target, box } = props;
  const start = arr[arr.length - 2];
  const end = arr[arr.length - 1];
  const startBox = map.get(start)!;
  const endBox = map.get(end)!;
  const space = endBox.top - (startBox.top + startBox.height);
  if (space <= 0) return [];
  const margin = this.margin / this.canvas.getZoom();
  const v = box.top - (endBox.top + endBox.height);
  if (v <= 0) return [];
  const dis = space - v;
  if (Math.abs(dis) > margin) return [];
  if (dis != 0) {
    target.top += dis;
    target.setCoords();
    box.top += dis;
  }
  const x = box.left + box.width / 3;
  return [
    {
      origin: new Point(x, startBox.top + startBox.height),
      target: new Point(x, endBox.top),
    },
    {
      origin: new Point(x, endBox.top + endBox.height),
      target: new Point(x, box.top),
    },
  ];
}
function collectYLinesByBottom(this: DistanceGuide, props: CollectLinesProps) {
  const { arr, map, target, box } = props;
  const start = arr[0];
  const end = arr[1];
  const startBox = map.get(start)!;
  const endBox = map.get(end)!;
  const space = endBox.top - (startBox.top + startBox.height);
  if (space <= 0) return [];
  const margin = this.margin / this.canvas.getZoom();
  const v = startBox.top - (box.top + box.height);
  if (v <= 0) return [];
  const dis = v - space;
  if (Math.abs(dis) > margin) return [];
  if (dis != 0) {
    target.top += dis;
    target.setCoords();
    box.top += dis;
  }
  const x = box.left + box.width / 3;
  return [
    {
      origin: new Point(x, startBox.top),
      target: new Point(x, box.top + box.height),
    },
    {
      origin: new Point(x, startBox.top + startBox.height),
      target: new Point(x, endBox.top),
    },
  ];
}
