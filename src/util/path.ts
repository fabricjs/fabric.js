//@ts-nocheck

import { cache } from '../cache';
import { config } from '../config';
import { halfPI, PiBy180 } from '../constants';
import { commaWsp, rePathCommand } from '../parser/constants';
import { Point } from '../point.class';
import type { PathData, TMat2D } from '../typedefs';
import { cos } from './misc/cos';
import { multiplyTransformMatrices, transformPoint } from './misc/matrix';
import { sin } from './misc/sin';

const commandLengths = {
  m: 2,
  l: 2,
  h: 1,
  v: 1,
  c: 6,
  s: 4,
  q: 4,
  t: 2,
  a: 7,
};
const repeatedCommands = {
  m: 'l',
  M: 'L',
};

const segmentToBezier = (
  th2,
  th3,
  cosTh,
  sinTh,
  rx,
  ry,
  cx1,
  cy1,
  mT,
  fromX,
  fromY
) => {
  const costh2 = cos(th2),
    sinth2 = sin(th2),
    costh3 = cos(th3),
    sinth3 = sin(th3),
    toX = cosTh * rx * costh3 - sinTh * ry * sinth3 + cx1,
    toY = sinTh * rx * costh3 + cosTh * ry * sinth3 + cy1,
    cp1X = fromX + mT * (-cosTh * rx * sinth2 - sinTh * ry * costh2),
    cp1Y = fromY + mT * (-sinTh * rx * sinth2 + cosTh * ry * costh2),
    cp2X = toX + mT * (cosTh * rx * sinth3 + sinTh * ry * costh3),
    cp2Y = toY + mT * (sinTh * rx * sinth3 - cosTh * ry * costh3);

  return ['C', cp1X, cp1Y, cp2X, cp2Y, toX, toY];
};

/* Adapted from http://dxr.mozilla.org/mozilla-central/source/content/svg/content/src/nsSVGPathDataParser.cpp
 * by Andrea Bogazzi code is under MPL. if you don't have a copy of the license you can take it here
 * http://mozilla.org/MPL/2.0/
 */
const arcToSegments = (toX, toY, rx, ry, large, sweep, rotateX) => {
  let fromX = 0,
    fromY = 0,
    root = 0;
  const PI = Math.PI,
    th = rotateX * PiBy180,
    sinTh = sin(th),
    cosTh = cos(th),
    px = 0.5 * (-cosTh * toX - sinTh * toY),
    py = 0.5 * (-cosTh * toY + sinTh * toX),
    rx2 = rx ** 2,
    ry2 = ry ** 2,
    py2 = py ** 2,
    px2 = px ** 2,
    pl = rx2 * ry2 - rx2 * py2 - ry2 * px2;
  let _rx = Math.abs(rx);
  let _ry = Math.abs(ry);

  if (pl < 0) {
    const s = Math.sqrt(1 - pl / (rx2 * ry2));
    _rx *= s;
    _ry *= s;
  } else {
    root =
      (large === sweep ? -1.0 : 1.0) * Math.sqrt(pl / (rx2 * py2 + ry2 * px2));
  }

  const cx = (root * _rx * py) / _ry,
    cy = (-root * _ry * px) / _rx,
    cx1 = cosTh * cx - sinTh * cy + toX * 0.5,
    cy1 = sinTh * cx + cosTh * cy + toY * 0.5;
  let mTheta = calcVectorAngle(1, 0, (px - cx) / _rx, (py - cy) / _ry);
  let dtheta = calcVectorAngle(
    (px - cx) / _rx,
    (py - cy) / _ry,
    (-px - cx) / _rx,
    (-py - cy) / _ry
  );

  if (sweep === 0 && dtheta > 0) {
    dtheta -= 2 * PI;
  } else if (sweep === 1 && dtheta < 0) {
    dtheta += 2 * PI;
  }

  // Convert into cubic bezier segments <= 90deg
  const segments = Math.ceil(Math.abs((dtheta / PI) * 2)),
    result = new Array(segments),
    mDelta = dtheta / segments,
    mT =
      ((8 / 3) * Math.sin(mDelta / 4) * Math.sin(mDelta / 4)) /
      Math.sin(mDelta / 2);
  let th3 = mTheta + mDelta;

  for (let i = 0; i < segments; i++) {
    result[i] = segmentToBezier(
      mTheta,
      th3,
      cosTh,
      sinTh,
      _rx,
      _ry,
      cx1,
      cy1,
      mT,
      fromX,
      fromY
    );
    fromX = result[i][5];
    fromY = result[i][6];
    mTheta = th3;
    th3 += mDelta;
  }
  return result;
};

/*
 * Private
 */
const calcVectorAngle = (ux, uy, vx, vy) => {
  const ta = Math.atan2(uy, ux),
    tb = Math.atan2(vy, vx);
  if (tb >= ta) {
    return tb - ta;
  } else {
    return 2 * Math.PI - (ta - tb);
  }
};

// functions for the Cubic beizer
// taken from: https://github.com/konvajs/konva/blob/7.0.5/src/shapes/Path.ts#L350
const CB1 = (t) => t ** 3;
const CB2 = (t) => 3 * t ** 2 * (1 - t);
const CB3 = (t) => 3 * t * (1 - t) ** 2;
const CB4 = (t) => (1 - t) ** 3;

/**
 * Calculate bounding box of a beziercurve
 * @param {Number} x0 starting point
 * @param {Number} y0
 * @param {Number} x1 first control point
 * @param {Number} y1
 * @param {Number} x2 secondo control point
 * @param {Number} y2
 * @param {Number} x3 end of bezier
 * @param {Number} y3
 */
// taken from http://jsbin.com/ivomiq/56/edit  no credits available for that.
// TODO: can we normalize this with the starting points set at 0 and then translated the bbox?
export function getBoundsOfCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
  let argsString;
  if (config.cachesBoundsOfCurve) {
    // eslint-disable-next-line
    argsString = [...arguments].join();
    if (cache.boundsOfCurveCache[argsString]) {
      return cache.boundsOfCurveCache[argsString];
    }
  }

  const sqrt = Math.sqrt,
    abs = Math.abs,
    tvalues = [],
    bounds = [[], []];

  let b = 6 * x0 - 12 * x1 + 6 * x2;
  let a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
  let c = 3 * x1 - 3 * x0;

  for (let i = 0; i < 2; ++i) {
    if (i > 0) {
      b = 6 * y0 - 12 * y1 + 6 * y2;
      a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
      c = 3 * y1 - 3 * y0;
    }

    if (abs(a) < 1e-12) {
      if (abs(b) < 1e-12) {
        continue;
      }
      const t = -c / b;
      if (0 < t && t < 1) {
        tvalues.push(t);
      }
      continue;
    }
    const b2ac = b * b - 4 * c * a;
    if (b2ac < 0) {
      continue;
    }
    const sqrtb2ac = sqrt(b2ac);
    const t1 = (-b + sqrtb2ac) / (2 * a);
    if (0 < t1 && t1 < 1) {
      tvalues.push(t1);
    }
    const t2 = (-b - sqrtb2ac) / (2 * a);
    if (0 < t2 && t2 < 1) {
      tvalues.push(t2);
    }
  }

  let j = tvalues.length;
  const jlen = j;
  const iterator = getPointOnCubicBezierIterator(
    x0,
    y0,
    x1,
    y1,
    x2,
    y2,
    x3,
    y3
  );
  while (j--) {
    const { x, y } = iterator(tvalues[j]);
    bounds[0][j] = x;
    bounds[1][j] = y;
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  const result = [
    new Point(Math.min(...bounds[0]), Math.min(...bounds[1])),
    new Point(Math.max(...bounds[0]), Math.max(...bounds[1])),
  ];
  if (config.cachesBoundsOfCurve) {
    cache.boundsOfCurveCache[argsString] = result;
  }
  return result;
}

/**
 * Converts arc to a bunch of bezier curves
 * @param {Number} fx starting point x
 * @param {Number} fy starting point y
 * @param {Array} coords Arc command
 */
export const fromArcToBeziers = (
  fx,
  fy,
  [_, rx, ry, rot, large, sweep, tx, ty] = []
) => {
  const segsNorm = arcToSegments(tx - fx, ty - fy, rx, ry, large, sweep, rot);

  for (let i = 0, len = segsNorm.length; i < len; i++) {
    segsNorm[i][1] += fx;
    segsNorm[i][2] += fy;
    segsNorm[i][3] += fx;
    segsNorm[i][4] += fy;
    segsNorm[i][5] += fx;
    segsNorm[i][6] += fy;
  }
  return segsNorm;
};

/**
 * This function take a parsed SVG path and make it simpler for fabricJS logic.
 * simplification consist of: only UPPERCASE absolute commands ( relative converted to absolute )
 * S converted in C, T converted in Q, A converted in C.
 * @param {PathData} path the array of commands of a parsed svg path for `Path`
 * @return {PathData} the simplified array of commands of a parsed svg path for `Path`
 */
export const makePathSimpler = (path: PathData): PathData => {
  // x and y represent the last point of the path. the previous command point.
  // we add them to each relative command to make it an absolute comment.
  // we also swap the v V h H with L, because are easier to transform.
  let x = 0,
    y = 0;
  const len = path.length;
  // x1 and y1 represent the last point of the subpath. the subpath is started with
  // m or M command. When a z or Z command is drawn, x and y need to be resetted to
  // the last x1 and y1.
  let x1 = 0,
    y1 = 0;
  // previous will host the letter of the previous command, to handle S and T.
  // controlX and controlY will host the previous reflected control point
  let destinationPath: PathData = [],
    previous,
    controlX,
    controlY;
  for (let i = 0; i < len; ++i) {
    let converted = false;
    const current = path[i].slice(0);
    switch (
      current[0] // first letter
    ) {
      case 'l': // lineto, relative
        current[0] = 'L';
        current[1] += x;
        current[2] += y;
      // falls through
      case 'L':
        x = current[1];
        y = current[2];
        break;
      case 'h': // horizontal lineto, relative
        current[1] += x;
      // falls through
      case 'H':
        current[0] = 'L';
        current[2] = y;
        x = current[1];
        break;
      case 'v': // vertical lineto, relative
        current[1] += y;
      // falls through
      case 'V':
        current[0] = 'L';
        y = current[1];
        current[1] = x;
        current[2] = y;
        break;
      case 'm': // moveTo, relative
        current[0] = 'M';
        current[1] += x;
        current[2] += y;
      // falls through
      case 'M':
        x = current[1];
        y = current[2];
        x1 = current[1];
        y1 = current[2];
        break;
      case 'c': // bezierCurveTo, relative
        current[0] = 'C';
        current[1] += x;
        current[2] += y;
        current[3] += x;
        current[4] += y;
        current[5] += x;
        current[6] += y;
      // falls through
      case 'C':
        controlX = current[3];
        controlY = current[4];
        x = current[5];
        y = current[6];
        break;
      case 's': // shorthand cubic bezierCurveTo, relative
        current[0] = 'S';
        current[1] += x;
        current[2] += y;
        current[3] += x;
        current[4] += y;
      // falls through
      case 'S':
        // would be sScC but since we are swapping sSc for C, we check just that.
        if (previous === 'C') {
          // calculate reflection of previous control points
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        } else {
          // If there is no previous command or if the previous command was not a C, c, S, or s,
          // the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        x = current[3];
        y = current[4];
        current[0] = 'C';
        current[5] = current[3];
        current[6] = current[4];
        current[3] = current[1];
        current[4] = current[2];
        current[1] = controlX;
        current[2] = controlY;
        // current[3] and current[4] are NOW the second control point.
        // we keep it for the next reflection.
        controlX = current[3];
        controlY = current[4];
        break;
      case 'q': // quadraticCurveTo, relative
        current[0] = 'Q';
        current[1] += x;
        current[2] += y;
        current[3] += x;
        current[4] += y;
      // falls through
      case 'Q':
        controlX = current[1];
        controlY = current[2];
        x = current[3];
        y = current[4];
        break;
      case 't': // shorthand quadraticCurveTo, relative
        current[0] = 'T';
        current[1] += x;
        current[2] += y;
      // falls through
      case 'T':
        if (previous === 'Q') {
          // calculate reflection of previous control point
          controlX = 2 * x - controlX;
          controlY = 2 * y - controlY;
        } else {
          // If there is no previous command or if the previous command was not a Q, q, T or t,
          // assume the control point is coincident with the current point
          controlX = x;
          controlY = y;
        }
        current[0] = 'Q';
        x = current[1];
        y = current[2];
        current[1] = controlX;
        current[2] = controlY;
        current[3] = x;
        current[4] = y;
        break;
      case 'a':
        current[0] = 'A';
        current[6] += x;
        current[7] += y;
      // falls through
      case 'A':
        converted = true;
        destinationPath = destinationPath.concat(
          fromArcToBeziers(x, y, current)
        );
        x = current[6];
        y = current[7];
        break;
      case 'z':
      case 'Z':
        x = x1;
        y = y1;
        break;
      default:
    }
    if (!converted) {
      destinationPath.push(current);
    }
    previous = current[0];
  }
  return destinationPath;
};

// todo verify if we can just use the point class here
/**
 * Calc length from point x1,y1 to x2,y2
 * @param {Number} x1 starting point x
 * @param {Number} y1 starting point y
 * @param {Number} x2 starting point x
 * @param {Number} y2 starting point y
 * @return {Number} length of segment
 */
const calcLineLength = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

const getPointOnCubicBezierIterator =
  (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) => (pct) => {
    const c1 = CB1(pct),
      c2 = CB2(pct),
      c3 = CB3(pct),
      c4 = CB4(pct);
    return {
      x: p4x * c1 + p3x * c2 + p2x * c3 + p1x * c4,
      y: p4y * c1 + p3y * c2 + p2y * c3 + p1y * c4,
    };
  };

const QB1 = (t) => t ** 2;
const QB2 = (t) => 2 * t * (1 - t);
const QB3 = (t) => (1 - t) ** 2;

const getTangentCubicIterator =
  (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) => (pct) => {
    const qb1 = QB1(pct),
      qb2 = QB2(pct),
      qb3 = QB3(pct),
      tangentX =
        3 * (qb3 * (p2x - p1x) + qb2 * (p3x - p2x) + qb1 * (p4x - p3x)),
      tangentY =
        3 * (qb3 * (p2y - p1y) + qb2 * (p3y - p2y) + qb1 * (p4y - p3y));
    return Math.atan2(tangentY, tangentX);
  };

const getPointOnQuadraticBezierIterator =
  (p1x, p1y, p2x, p2y, p3x, p3y) => (pct) => {
    const c1 = QB1(pct),
      c2 = QB2(pct),
      c3 = QB3(pct);
    return {
      x: p3x * c1 + p2x * c2 + p1x * c3,
      y: p3y * c1 + p2y * c2 + p1y * c3,
    };
  };

const getTangentQuadraticIterator = (p1x, p1y, p2x, p2y, p3x, p3y) => (pct) => {
  const invT = 1 - pct,
    tangentX = 2 * (invT * (p2x - p1x) + pct * (p3x - p2x)),
    tangentY = 2 * (invT * (p2y - p1y) + pct * (p3y - p2y));
  return Math.atan2(tangentY, tangentX);
};

// this will run over a path segment ( a cubic or quadratic segment) and approximate it
// with 100 segemnts. This will good enough to calculate the length of the curve
const pathIterator = (iterator, x1, y1) => {
  let tempP = { x: x1, y: y1 },
    tmpLen = 0;
  for (let perc = 1; perc <= 100; perc += 1) {
    const p = iterator(perc / 100);
    tmpLen += calcLineLength(tempP.x, tempP.y, p.x, p.y);
    tempP = p;
  }
  return tmpLen;
};

/**
 * Given a pathInfo, and a distance in pixels, find the percentage from 0 to 1
 * that correspond to that pixels run over the path.
 * The percentage will be then used to find the correct point on the canvas for the path.
 * @param {Array} segInfo fabricJS collection of information on a parsed path
 * @param {Number} distance from starting point, in pixels.
 * @return {Object} info object with x and y ( the point on canvas ) and angle, the tangent on that point;
 */
const findPercentageForDistance = (segInfo, distance) => {
  let perc = 0,
    tmpLen = 0,
    tempP = { x: segInfo.x, y: segInfo.y },
    p,
    nextLen,
    nextStep = 0.01,
    lastPerc;
  // nextStep > 0.0001 covers 0.00015625 that 1/64th of 1/100
  // the path
  const iterator = segInfo.iterator,
    angleFinder = segInfo.angleFinder;
  while (tmpLen < distance && nextStep > 0.0001) {
    p = iterator(perc);
    lastPerc = perc;
    nextLen = calcLineLength(tempP.x, tempP.y, p.x, p.y);
    // compare tmpLen each cycle with distance, decide next perc to test.
    if (nextLen + tmpLen > distance) {
      // we discard this step and we make smaller steps.
      perc -= nextStep;
      nextStep /= 2;
    } else {
      tempP = p;
      perc += nextStep;
      tmpLen += nextLen;
    }
  }
  p.angle = angleFinder(lastPerc);
  return p;
};

/**
 * Run over a parsed and simplifed path and extract some informations.
 * informations are length of each command and starting point
 * @param {Array} path fabricJS parsed path commands
 * @return {Array} path commands informations
 */
export const getPathSegmentsInfo = (path) => {
  let totalLength = 0,
    current,
    //x2 and y2 are the coords of segment start
    //x1 and y1 are the coords of the current point
    x1 = 0,
    y1 = 0,
    x2 = 0,
    y2 = 0,
    iterator,
    tempInfo,
    angleFinder;
  const len = path.length,
    info = [];
  for (let i = 0; i < len; i++) {
    current = path[i];
    tempInfo = {
      x: x1,
      y: y1,
      command: current[0],
    };
    switch (
      current[0] //first letter
    ) {
      case 'M':
        tempInfo.length = 0;
        x2 = x1 = current[1];
        y2 = y1 = current[2];
        break;
      case 'L':
        tempInfo.length = calcLineLength(x1, y1, current[1], current[2]);
        x1 = current[1];
        y1 = current[2];
        break;
      case 'C':
        iterator = getPointOnCubicBezierIterator(
          x1,
          y1,
          current[1],
          current[2],
          current[3],
          current[4],
          current[5],
          current[6]
        );
        angleFinder = getTangentCubicIterator(
          x1,
          y1,
          current[1],
          current[2],
          current[3],
          current[4],
          current[5],
          current[6]
        );
        tempInfo.iterator = iterator;
        tempInfo.angleFinder = angleFinder;
        tempInfo.length = pathIterator(iterator, x1, y1);
        x1 = current[5];
        y1 = current[6];
        break;
      case 'Q':
        iterator = getPointOnQuadraticBezierIterator(
          x1,
          y1,
          current[1],
          current[2],
          current[3],
          current[4]
        );
        angleFinder = getTangentQuadraticIterator(
          x1,
          y1,
          current[1],
          current[2],
          current[3],
          current[4]
        );
        tempInfo.iterator = iterator;
        tempInfo.angleFinder = angleFinder;
        tempInfo.length = pathIterator(iterator, x1, y1);
        x1 = current[3];
        y1 = current[4];
        break;
      case 'Z':
      case 'z':
        // we add those in order to ease calculations later
        tempInfo.destX = x2;
        tempInfo.destY = y2;
        tempInfo.length = calcLineLength(x1, y1, x2, y2);
        x1 = x2;
        y1 = y2;
        break;
    }
    totalLength += tempInfo.length;
    info.push(tempInfo);
  }
  info.push({ length: totalLength, x: x1, y: y1 });
  return info;
};

export const getPointOnPath = (path, distance, infos) => {
  if (!infos) {
    infos = getPathSegmentsInfo(path);
  }
  let i = 0;
  while (distance - infos[i].length > 0 && i < infos.length - 2) {
    distance -= infos[i].length;
    i++;
  }
  // var distance = infos[infos.length - 1] * perc;
  const segInfo = infos[i],
    segPercent = distance / segInfo.length,
    command = segInfo.command,
    segment = path[i];
  let info;

  switch (command) {
    case 'M':
      return { x: segInfo.x, y: segInfo.y, angle: 0 };
    case 'Z':
    case 'z':
      info = new Point(segInfo.x, segInfo.y).lerp(
        new Point(segInfo.destX, segInfo.destY),
        segPercent
      );
      info.angle = Math.atan2(
        segInfo.destY - segInfo.y,
        segInfo.destX - segInfo.x
      );
      return info;
    case 'L':
      info = new Point(segInfo.x, segInfo.y).lerp(
        new Point(segment[1], segment[2]),
        segPercent
      );
      info.angle = Math.atan2(segment[2] - segInfo.y, segment[1] - segInfo.x);
      return info;
    case 'C':
      return findPercentageForDistance(segInfo, distance);
    case 'Q':
      return findPercentageForDistance(segInfo, distance);
  }
};

/**
 *
 * @param {string} pathString
 * @return {(string|number)[][]} An array of SVG path commands
 * @example <caption>Usage</caption>
 * parsePath('M 3 4 Q 3 5 2 1 4 0 Q 9 12 2 1 4 0') === [
 *   ['M', 3, 4],
 *   ['Q', 3, 5, 2, 1, 4, 0],
 *   ['Q', 9, 12, 2, 1, 4, 0],
 * ];
 *
 */
export const parsePath = (pathString) => {
  // one of commands (m,M,l,L,q,Q,c,C,etc.) followed by non-command characters (i.e. command values)
  const re = rePathCommand,
    rNumber = '[-+]?(?:\\d*\\.\\d+|\\d+\\.?)(?:[eE][-+]?\\d+)?\\s*',
    rNumberCommaWsp = `(${rNumber})${commaWsp}`,
    rFlagCommaWsp = `([01])${commaWsp}?`,
    rArcSeq = `${rNumberCommaWsp}?${rNumberCommaWsp}?${rNumberCommaWsp}${rFlagCommaWsp}${rFlagCommaWsp}${rNumberCommaWsp}?(${rNumber})`,
    regArcArgumentSequence = new RegExp(rArcSeq, 'g'),
    result = [];

  if (!pathString || !pathString.match) {
    return result;
  }
  const path = pathString.match(/[mzlhvcsqta][^mzlhvcsqta]*/gi);

  for (let i = 0, len = path.length; i < len; i++) {
    const currentPath = path[i];
    const coordsStr = currentPath.slice(1).trim();
    const coords = [];
    let command = currentPath.charAt(0);
    const coordsParsed = [command];

    if (command.toLowerCase() === 'a') {
      // arcs have special flags that apparently don't require spaces so handle special
      for (let args; (args = regArcArgumentSequence.exec(coordsStr)); ) {
        for (let j = 1; j < args.length; j++) {
          coords.push(args[j]);
        }
      }
    } else {
      let match;
      while ((match = re.exec(coordsStr))) {
        coords.push(match[0]);
      }
    }

    for (let j = 0, jlen = coords.length; j < jlen; j++) {
      const parsed = parseFloat(coords[j]);
      if (!isNaN(parsed)) {
        coordsParsed.push(parsed);
      }
    }

    const commandLength = commandLengths[command.toLowerCase()],
      repeatedCommand = repeatedCommands[command] || command;

    if (coordsParsed.length - 1 > commandLength) {
      for (
        let k = 1, klen = coordsParsed.length;
        k < klen;
        k += commandLength
      ) {
        result.push([command].concat(coordsParsed.slice(k, k + commandLength)));
        command = repeatedCommand;
      }
    } else {
      result.push(coordsParsed);
    }
  }
  return result;
};

/**
 *
 * Converts points to a smooth SVG path
 * @param {{ x: number,y: number }[]} points Array of points
 * @param {number} [correction] Apply a correction to the path (usually we use `width / 1000`). If value is undefined 0 is used as the correction value.
 * @return {(string|number)[][]} An array of SVG path commands
 */
export const getSmoothPathFromPoints = (points, correction = 0) => {
  let p1 = new Point(points[0]),
    p2 = new Point(points[1]),
    multSignX = 1,
    multSignY = 0;
  const path = [],
    len = points.length,
    manyPoints = len > 2;

  if (manyPoints) {
    multSignX = points[2].x < p2.x ? -1 : points[2].x === p2.x ? 0 : 1;
    multSignY = points[2].y < p2.y ? -1 : points[2].y === p2.y ? 0 : 1;
  }
  path.push([
    'M',
    p1.x - multSignX * correction,
    p1.y - multSignY * correction,
  ]);
  let i;
  for (i = 1; i < len; i++) {
    if (!p1.eq(p2)) {
      const midPoint = p1.midPointFrom(p2);
      // p1 is our bezier control point
      // midpoint is our endpoint
      // start point is p(i-1) value.
      path.push(['Q', p1.x, p1.y, midPoint.x, midPoint.y]);
    }
    p1 = points[i];
    if (i + 1 < points.length) {
      p2 = points[i + 1];
    }
  }
  if (manyPoints) {
    multSignX = p1.x > points[i - 2].x ? 1 : p1.x === points[i - 2].x ? 0 : -1;
    multSignY = p1.y > points[i - 2].y ? 1 : p1.y === points[i - 2].y ? 0 : -1;
  }
  path.push([
    'L',
    p1.x + multSignX * correction,
    p1.y + multSignY * correction,
  ]);
  return path;
};

/**
 * Transform a path by transforming each segment.
 * it has to be a simplified path or it won't work.
 * WARNING: this depends from pathOffset for correct operation
 * @param {PathData} path fabricJS parsed and simplified path commands
 * @param {TMat2D} transform matrix that represent the transformation
 * @param {Point} [pathOffset] `Path.pathOffset`
 * @returns {Array} the transformed path
 */
export const transformPath = (
  path: PathData,
  transform: TMat2D,
  pathOffset: Point
) => {
  if (pathOffset) {
    transform = multiplyTransformMatrices(transform, [
      1,
      0,
      0,
      1,
      -pathOffset.x,
      -pathOffset.y,
    ]);
  }
  return path.map((pathSegment) => {
    const newSegment = pathSegment.slice(0);
    for (let i = 1; i < pathSegment.length - 1; i += 2) {
      const { x, y } = transformPoint(
        {
          x: pathSegment[i],
          y: pathSegment[i + 1],
        },
        transform
      );
      newSegment[i] = x;
      newSegment[i + 1] = y;
    }
    return newSegment;
  });
};

/**
 * Returns an array of path commands to create a regular polygon
 * @param {number} radius
 * @param {number} numVertexes
 * @returns {(string|number)[][]} An array of SVG path commands
 */
export const getRegularPolygonPath = (numVertexes, radius) => {
  const interiorAngle = (Math.PI * 2) / numVertexes;
  // rotationAdjustment rotates the path by 1/2 the interior angle so that the polygon always has a flat side on the bottom
  // This isn't strictly necessary, but it's how we tend to think of and expect polygons to be drawn
  let rotationAdjustment = -halfPI;
  if (numVertexes % 2 === 0) {
    rotationAdjustment += interiorAngle / 2;
  }
  const d = new Array(numVertexes + 1);
  for (let i = 0; i < numVertexes; i++) {
    const rad = i * interiorAngle + rotationAdjustment;
    const { x, y } = new Point(cos(rad), sin(rad)).scalarMultiply(radius);
    d[i] = [i === 0 ? 'M' : 'L', x, y];
  }
  d[numVertexes] = ['Z'];
  return d;
};

/**
 * Join path commands to go back to svg format
 * @param {Array} pathData fabricJS parsed path commands
 * @return {String} joined path 'M 0 0 L 20 30'
 */
export const joinPath = (pathData) =>
  pathData.map((segment) => segment.join(' ')).join(' ');
