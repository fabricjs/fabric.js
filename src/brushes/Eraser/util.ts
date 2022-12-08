import type { FabricObject } from '../../shapes/fabricObject.class';
import type { Group } from '../../shapes/group.class';
import { Path } from '../../shapes/path.class';
import { TMat2D } from '../../typedefs';
import {
  invertTransform,
  multiplyTransformMatrices,
} from '../../util/misc/matrix';
import { mergeClipPaths } from '../../util/misc/mergeClipPaths';
import { applyTransformToObject } from '../../util/misc/objectTransforms';
import { isCollection } from '../../util/types';
import { Eraser } from './Eraser';
import { ErasingEventContextData } from './types';

export function isObjectErasable(object: FabricObject) {
  return object.erasable !== false;
}

/**
 * Utility to apply a clip path to a path.
 * Used to preserve clipping on eraser paths in nested objects.
 * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
 * @param {Path} path The eraser path in canvas coordinate plane
 * @param {FabricObject} clipPath The clipPath to apply to the path
 * @param {TMat2D} clipPathContainerTransformMatrix The transform matrix of the object that the clip path belongs to
 * @returns {Path} path with clip path
 */
export function applyClipPathToPath(
  path: Path,
  clipPath: FabricObject,
  clipPathContainerTransformMatrix: TMat2D
) {
  const pathInvTransform = invertTransform(path.calcTransformMatrix()),
    clipPathTransform = clipPath.calcTransformMatrix(),
    transform = clipPath.absolutePositioned
      ? pathInvTransform
      : multiplyTransformMatrices(
          pathInvTransform,
          clipPathContainerTransformMatrix
        );
  //  when passing down a clip path it becomes relative to the parent
  //  so we transform it accordingly and set `absolutePositioned` to false
  clipPath.absolutePositioned = false;
  applyTransformToObject(
    clipPath,
    multiplyTransformMatrices(transform, clipPathTransform)
  );
  //  We need to clip `path` with both `clipPath` and it's own clip path if existing (`path.clipPath`)
  //  so in turn `path` erases an object only where it overlaps with all it's clip paths, regardless of how many there are.
  //  this is done because both clip paths may have nested clip paths of their own (this method walks down a collection => this may reccur),
  //  so we can't assign one to the other's clip path property.
  path.clipPath = path.clipPath
    ? mergeClipPaths(clipPath, path.clipPath)
    : clipPath;
  return path;
}

/**
 * Utility to apply a clip path to a path.
 * Used to preserve clipping on eraser paths in nested objects.
 * Called when a group has a clip path that should be applied to the path before applying erasing on the group's objects.
 * @param {Path} path The eraser path
 * @param {FabricObject} object The clipPath to apply to path belongs to object
 * @returns {Promise<Path>}
 */
export function clonePathWithClipPath(
  path: Path,
  object: FabricObject & Required<Pick<FabricObject, 'clipPath'>>
) {
  const objTransform = object.calcTransformMatrix();
  return Promise.all([
    path.clone(),
    object.clipPath.clone(['absolutePositioned', 'inverted']),
  ]).then(([clonedPath, clonedClipPath]) =>
    applyClipPathToPath(clonedPath, clonedClipPath, objTransform)
  );
}

/**
 * Adds path to object's eraser, walks down object's descendants if necessary
 *
 * @fires erasing:end on object
 * @param {FabricObject} object
 * @param {Path} path
 * @param {ErasingEventContextData} [context] context to assign erased objects to
 */
export async function addPathToObjectEraser(
  object: FabricObject,
  path: Path,
  context?: ErasingEventContextData,
  fireEvent = true
): Promise<void> {
  if (isCollection(object) && (object as Group).erasable === 'deep') {
    const targets = object._objects.filter((obj) => obj.erasable);
    if (targets.length > 0 && object.clipPath) {
      path = await clonePathWithClipPath(
        path,
        object as FabricObject & Required<Pick<FabricObject, 'clipPath'>>
      );
    }
    if (targets.length > 0) {
      await Promise.all(
        targets.map((obj) => addPathToObjectEraser(obj, path, context))
      );
    }
    return;
  }
  //  prepare eraser
  if (!object.eraser) {
    object.eraser = new Eraser();
  }
  const eraser = object.eraser;
  //  clone and add path
  const clone = await path.clone();
  // http://fabricjs.com/using-transformations
  const desiredTransform = multiplyTransformMatrices(
    invertTransform(object.calcTransformMatrix()),
    clone.calcTransformMatrix()
  );
  applyTransformToObject(clone, desiredTransform);
  eraser.add(clone);
  object.set('dirty', true);
  fireEvent && object.fire('erasing:end', { path: clone });
  if (context) {
    (object.group ? context.subTargets : context.targets).push(object);
    context.paths.set(object, clone);
  }
}

/**
 * Clones an object's eraser paths into the canvas plane
 * @param object the owner of the eraser that you want to clone
 * @param [applyObjectClipPath] controls whether the cloned eraser's paths should be clipped by the object's clip path
 * @returns
 */
export function cloneEraserFromObject(
  object: FabricObject & Required<Pick<FabricObject, 'eraser'>>,
  applyObjectClipPath = true
) {
  const { clipPath, eraser } = object;
  const transform = object.calcTransformMatrix();
  return Promise.all([
    eraser.clone(),
    applyObjectClipPath && clipPath?.clone(['absolutePositioned', 'inverted']),
  ]).then(([eraser, clipPath]) => {
    return Promise.all(
      (
        eraser._objects.filter((object) => object instanceof Path) as Path[]
      ).map((path) => {
        //  first we transform the path from the group's coordinate system to the canvas'
        const originalTransform = multiplyTransformMatrices(
          transform,
          path.calcTransformMatrix()
        );
        applyTransformToObject(path, originalTransform);
        return clipPath ? applyClipPathToPath(path, clipPath, transform) : path;
      })
    );
  });
}

/**
 * Use when:
 * 1. switching the {@link Group#erasable} property from `true` to `deep` if you wish descendants to be erased by existing paths
 * 2. when removing objects from group with {@link Group#erasable} set to `true`
 */
export function applyEraser(
  from: FabricObject & Required<Pick<FabricObject, 'eraser'>>,
  to: FabricObject[],
  {
    unset = false,
  }: {
    /**
     * remove `from`'s eraser when done
     */
    unset: boolean;
  }
) {
  return cloneEraserFromObject(from)
    .then((paths) =>
      paths.map((path) => {
        const context: ErasingEventContextData & { path: Path } = {
          targets: [],
          subTargets: [],
          paths: new Map(),
          path,
        };
        to.forEach((object) => addPathToObjectEraser(object, path, context));
        return context;
      })
    )
    .then((contexts) => {
      unset && from.set('eraser', undefined);
      return contexts;
    });
}
