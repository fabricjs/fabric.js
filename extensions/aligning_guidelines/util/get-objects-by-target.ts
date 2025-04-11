import type { FabricObject } from 'fabric';
import { ActiveSelection, Group } from 'fabric';

/**
 * Finds all visible, on-screen objects on the canvas that could be potential
 * snapping targets for the given `target` object. Excludes the `target` object
 * itself (and its children if it's a selection/group). Can optionally filter
 * out objects based on a custom predicate.
 *
 * @param target The object being moved or resized, for which potential snapping
 *     targets are needed.
 * @param shouldExclude Optional function to filter potential target objects.
 *     If the function returns `true` for an object, it will be excluded as a
 *     potential snapping target.
 * @return A Set of FabricObjects that are potential snapping targets.
 */
export function getObjectsByTarget(
  target: FabricObject,
  shouldExclude?: (obj: FabricObject) => boolean,
) {
  const objects = new Set<FabricObject>();
  const canvas = target.canvas;
  if (!canvas) return objects;
  const draggedObjects =
    target instanceof ActiveSelection ? target.getObjects() : [target];

  canvas.forEachObject((o) => {
    if (!o.isOnScreen()) return;
    if (!o.visible) return;

    // Use instanceof for more reliable group checking (e.g. subclasses of
    // Group).
    if (o instanceof Group) {
      // Process group children using the `shouldExclude` predicate. The group
      //'o' itself is NOT added as a target here.
      collectObjectsByGroup(objects, o, shouldExclude);
      // Continue to next canvas object.
      return;
    }

    // Add non-group objects only if they are NOT excluded by the predicate.
    if (!(shouldExclude && shouldExclude(o))) {
      objects.add(o);
    }
  });

  // Remove the dragged object and its descendants from potential targets.
  deleteObjectsByList(objects, draggedObjects);
  return objects;
}

/**
 * Recursively removes objects from a Set based on a provided list.
 * If an item in the list is a Group, its children are also recursively removed.
 *
 * @param objects The Set of objects to modify.
 * @param list The list of objects (or groups) to remove from the Set.
 */
function deleteObjectsByList(objects: Set<FabricObject>, list: FabricObject[]) {
  for (const target of list) {
    // Always remove the target itself from the potential snapping candidates.
    objects.delete(target);

    if (target instanceof Group) {
      deleteObjectsByList(objects, (target as Group).getObjects());
    } else {
      objects.delete(target);
    }
  }
}

/**
 * Recursively collects all visible, non-group child objects from within a given
 * Group and adds them to the provided Set. Can optionally filter out objects
 * based on a custom predicate.
 *
 * @param objects The Set to add collected objects to.
 * @param g The Group object to traverse.
 * @param shouldExclude Optional function to filter potential target objects.
 *     If the function returns `true` for an object, it (and its children if
 *     it's a group) will be skipped when collecting objects.
 */
function collectObjectsByGroup(
  objects: Set<FabricObject>,
  g: Group,
  shouldExclude?: (obj: FabricObject) => boolean,
) {
  const children = g.getObjects();
  for (const child of children) {
    if (!child.visible) continue;
    // Check exclusion for the child.
    if (shouldExclude && shouldExclude(child)) {
      continue;
    }

    if (child.constructor == Group) {
      collectObjectsByGroup(objects, child, shouldExclude);
      continue;
    }
    objects.add(child);
  }
}
