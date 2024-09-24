import { ActiveSelection, Group } from 'fabric';

function getObjectsByTarget(target) {
  const objects = new Set();
  const canvas = target.canvas;
  if (!canvas) return objects;
  const children = target instanceof ActiveSelection ? target.getObjects() : [target];
  canvas.forEachObject(o => {
    if (!o.isOnScreen()) return;
    if (!o.visible) return;
    if (o.constructor == Group) {
      collectObjectsByGroup(objects, o);
      return;
    }
    objects.add(o);
  });
  deleteObjectsByList(objects, children);
  return objects;
}
function deleteObjectsByList(objects, list) {
  for (const target of list) {
    if (target.constructor == Group) {
      deleteObjectsByList(objects, target.getObjects());
    } else {
      objects.delete(target);
    }
  }
}
function collectObjectsByGroup(objects, g) {
  const children = g.getObjects();
  for (const child of children) {
    if (!child.visible) continue;
    if (child.constructor == Group) {
      collectObjectsByGroup(objects, child);
      continue;
    }
    objects.add(child);
  }
}

export { getObjectsByTarget };
//# sourceMappingURL=get-objects-by-target.mjs.map
