import type { FabricObject } from 'fabric';
import { ActiveSelection, Group } from 'fabric';

export function getObjectsByTarget(target: FabricObject) {
  const objects = new Set<FabricObject>();
  const canvas = target.canvas;
  if (!canvas) return objects;
  const children =
    target instanceof ActiveSelection ? target.getObjects() : [target];

  canvas.forEachObject((o) => {
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

function deleteObjectsByList(objects: Set<FabricObject>, list: FabricObject[]) {
  for (const target of list) {
    if (target.constructor == Group) {
      deleteObjectsByList(objects, (target as Group).getObjects());
    } else {
      objects.delete(target);
    }
  }
}

function collectObjectsByGroup(objects: Set<FabricObject>, g: Group) {
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
