/**
 * Runs in the **BROWSER**
 * Use absolute imports defined in 'e2e/imports.ts'
 */

import * as fabric from 'fabric';
import { beforeAll } from '../test';
import { toGroupKey, toKey } from './spec/util';
import common from './spec/common';
import miterLimit from './spec/miterLimit';
import singlePoint from './spec/singlePoint';

beforeAll(
  () => {
    return [...common, ...miterLimit, ...singlePoint].reduce(
      (targets, { type, test, points, group, options }) => {
        const key = toKey({
          type,
          test,
          points,
          group,
          options,
        });
        const poly = new (
          type === 'polygon' ? fabric.Polygon : fabric.Polyline
        )(points, {
          fill: `rgb(255, 0, 0)`,
          strokeWidth: 10,
          stroke: 'rgb(120, 0, 0)',
          cornerColor: 'white',
          objectCaching: false,
          exactBoundingBox: true,
          ...options,
        });
        let target: fabric.Polyline | fabric.Group = poly;
        if (group) {
          target = new fabric.Group([poly], {
            objectCaching: false,
            subTargetCheck: true,
          });
          targets[toGroupKey({ type, test, points, group, options })] = target;
        }
        target.scaleX = 2;
        target.scaleY = 3;
        poly.setDimensions();

        targets[key] = poly;
        return targets;
      },
      {}
    );
  },
  { enableRetinaScaling: false, width: 600, height: 900 }
);
