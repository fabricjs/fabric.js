import { FabricObject, Group } from '../../dist/index.mjs';

// Swapping of calcCornerCoords in #9377

// OLD CODE FOR REFERENCE AND IMPLEMENTATION TEST

class OldObject extends FabricObject {
  transformMatrixKey(skipGroup = false) {
    const sep = '_';
    let prefix = '';
    if (!skipGroup && this.group) {
      prefix = this.group.transformMatrixKey(skipGroup) + sep;
    }
    return (
      prefix +
      this.top +
      sep +
      this.left +
      sep +
      this.scaleX +
      sep +
      this.scaleY +
      sep +
      this.skewX +
      sep +
      this.skewY +
      sep +
      this.angle +
      sep +
      this.originX +
      sep +
      this.originY +
      sep +
      this.width +
      sep +
      this.height +
      sep +
      this.strokeWidth +
      this.flipX +
      this.flipY
    );
  }
}

class OldGroup extends Group {
  transformMatrixKey(skipGroup = false) {
    return OldObject.prototype.transformMatrixKey.call(this, skipGroup);
  }
}

// END OF OLD CODE

const newComplexObject = new FabricObject({ width: 100, height: 100 });
const newComplexGroup = new Group([newComplexObject]);
new Group([newComplexGroup]);

const oldComplexObject = new OldObject({ width: 100, height: 100 });
const oldComplexGroup = new OldGroup([oldComplexObject]);
new OldGroup([oldComplexGroup]);

const benchmark = (callback) => {
  const start = Date.now();
  callback();
  return Date.now() - start;
};

const complexNew = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    newComplexObject.transformMatrixKey();
  }
});

const complexOld = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    oldComplexObject.transformMatrixKey();
  }
});

console.log({ complexOld, complexNew });

const newSimpleObject = new FabricObject({ width: 100, height: 100 });

const oldSimpleObject = new OldObject({ width: 100, height: 100 });

const simpleNew = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    newSimpleObject.transformMatrixKey();
  }
});

const simpleOld = benchmark(() => {
  for (let i = 0; i < 1_000_000; i++) {
    oldSimpleObject.transformMatrixKey();
  }
});

console.log({ simpleOld, simpleNew });
