import { radiansToDegrees } from '../../util';
import { Group } from '../Group';
import { Canvas } from '../../canvas/Canvas';
import { FabricObject } from './FabricObject';
import type { TOCoord } from './InteractiveObject';

describe('Object', () => {
  describe('setCoords for objects inside group with rotation', () => {
    it('all corners are rotated as much as the object total angle', () => {
      const canvas = new Canvas();
      const object = new FabricObject({
        left: 25,
        top: 60,
        width: 75,
        height: 100,
        angle: 10,
        scaleY: 2,
        fill: 'blue',
      });
      const group = new Group([object], {
        angle: 30,
        scaleX: 2,
        interactive: true,
        subTargetCheck: true,
      });
      canvas.add(group);
      group.setCoords();
      const objectAngle = Math.round(object.getTotalAngle());
      expect(objectAngle).toEqual(35);
      Object.values(object.oCoords).forEach((cornerPoint: TOCoord) => {
        const controlAngle = Math.round(
          radiansToDegrees(
            Math.atan2(
              cornerPoint.corner.tr.y - cornerPoint.corner.tl.y,
              cornerPoint.corner.tr.x - cornerPoint.corner.tl.x
            )
          )
        );
        expect(controlAngle).toEqual(objectAngle);
      });
    });
  });
});
