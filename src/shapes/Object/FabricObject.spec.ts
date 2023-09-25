import { roundSnapshotOptions } from '../../../jest.extend';
import { createObjectDefaultControls } from '../../controls';
import { Group } from '../Group';
import { FabricObject } from './FabricObject';

describe('Object', () => {
  test('setCoords', () => {
    const controls = createObjectDefaultControls();
    const object = new FabricObject({
      left: 25,
      top: 60,
      width: 75,
      height: 100,
      controls,
      scaleY: 2,
      fill: 'blue',
    });
    const group = new Group([object], {
      angle: 30,
      scaleX: 2,
      interactive: true,
      subTargetCheck: true,
    });
    const spies = Object.values(controls).map((control) =>
      jest.spyOn(control, 'calcCornerCoords')
    );
    group.setCoords();
    expect(
      Object.keys(controls).reduce((acc, key, index) => {
        const { calls, results } = spies[index].mock;
        return Object.assign(acc, { [key]: { calls, results } });
      }, {})
    ).toMatchSnapshot(roundSnapshotOptions);
  });
});
