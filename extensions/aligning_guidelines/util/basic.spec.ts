import { describe, expect, it } from 'vitest';
import { Point } from '../../../src/Point';
import { Rect } from '../../../src/shapes/Rect';
import {
  getContraryMap,
  getDistance,
  getDistanceList,
  getPointMap,
} from './basic';

describe('getDistance', () => {
  it('returns the distance between the 2 numbers', () => {
    expect(getDistance(4, 6)).toBe(2);
    expect(getDistance(6, 4)).toBe(2);
    expect(getDistance(-6, -4)).toBe(2);
    expect(getDistance(6, -4)).toBe(10);
  });
});

describe('getDistanceList', () => {
  it('returns the distance list', () => {
    // getDistanceList point: Point, list: Point[], type: 'x' | 'y'
    const point = new Point(0, 0);
    const list = [
      new Point(2, 3),
      new Point(-2, -3),
      new Point(3, 3),
      new Point(4, 4),
    ];
    const xList = getDistanceList(point, list, 'x');
    expect(xList.dis).toBe(2);
    expect(xList.arr).toEqual([list[0], list[1]]);

    const yList = getDistanceList(point, list, 'y');
    expect(yList.dis).toBe(3);
    expect(yList.arr).toEqual(list.slice(0, 3));
  });
});

describe('getPointMap', () => {
  it('returns the pointMap', () => {
    const target = new Rect({
      left: rnd(-100, 100),
      top: rnd(-100, 100),
      width: rnd(100),
      height: rnd(100),
    });
    const coords = target.getCoords();
    const pointMap = getPointMap(target);
    expect([pointMap.tl, pointMap.tr, pointMap.br, pointMap.bl]).toEqual(
      coords,
    );
    const arr = [];
    const p = coords.concat(coords[0]);
    for (let i = 0; i < coords.length; i++) {
      arr.push(p[i].add(p[i + 1]).scalarDivide(2));
    }
    expect([pointMap.mt, pointMap.mr, pointMap.mb, pointMap.ml]).toEqual(arr);
  });
});

describe('getContraryMap', () => {
  it('returns the contraryMap', () => {
    const target = new Rect({
      left: rnd(-100, 100),
      top: rnd(-100, 100),
      width: rnd(100),
      height: rnd(100),
    });
    const aCoords = target.calcACoords();
    const pointMap = getContraryMap(target);
    const { tl, tr, br, bl, mt, mr, ml, mb } = pointMap;
    expect(tl).toEqual(aCoords.br);
    expect(tr).toEqual(aCoords.bl);
    expect(br).toEqual(aCoords.tl);
    expect(bl).toEqual(aCoords.tr);
    expect(mt).toEqual(aCoords.br.add(aCoords.bl).scalarDivide(2));
    expect(mr).toEqual(aCoords.bl.add(aCoords.tl).scalarDivide(2));
    expect(mb).toEqual(aCoords.tl.add(aCoords.tr).scalarDivide(2));
    expect(ml).toEqual(aCoords.tr.add(aCoords.br).scalarDivide(2));
  });
});

function rnd(start: number, end?: number) {
  if (end == undefined) {
    end = start;
    start = 0;
  }
  return Math.floor(Math.random() * (end - start)) + start;
}
