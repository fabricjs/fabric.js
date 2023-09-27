

describe('Selectable Canvas', () => {
    describe('_pointIsInObjectSelectionArea', () => {
        it('points are correct, including padding', () => {
                var object = new fabric.Object({
                    left: 40,
                    top: 40,
                    width: 40,
                    height: 50,
                    angle: 160,
                    padding: 5,
                  }),
                  point1 = new fabric.Point(30, 30),
                  point2 = new fabric.Point(10, 20),
                  point3 = new fabric.Point(65, 30),
                  point4 = new fabric.Point(45, 75),
                  point5 = new fabric.Point(10, 40),
                  point6 = new fabric.Point(30, 5);

                object
                  .set({ originX: 'center', originY: 'center' })
                  .setCoords();

                // point1 is contained in object
                assert.equal(
                  object.containsPoint(point1),
                  true,
                  'contains point 1'
                );
                // point2 is contained in object (padding area)
                assert.equal(
                  object.containsPoint(point2),
                  true,
                  'contains point 2'
                );
                // point2 is outside of object (right)
                assert.equal(
                  object.containsPoint(point3),
                  false,
                  'does not contains point 3'
                );
                // point3 is outside of object (bottom)
                assert.equal(
                  object.containsPoint(point4),
                  false,
                  'does not contains point 4'
                );
                // point4 is outside of object (left)
                assert.equal(
                  object.containsPoint(point5),
                  false,
                  'does not contains point 5'
                );
                // point5 is outside of object (top)
                assert.equal(
                  object.containsPoint(point6),
                  false,
                  'does not contains point 6'
                );
              });
        })
    })
})