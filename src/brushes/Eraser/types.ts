import type { FabricObject } from '../../shapes/fabricObject.class';
import type { Path } from '../../shapes/path.class';

export type ErasingEventContextData = {
  targets: FabricObject[];
  subTargets: FabricObject[];
  paths: Map<FabricObject, Path>;
};

export type ErasingEventContext = ErasingEventContextData & {
  drawables: Partial<
    Record<'backgroundImage' | 'overlayImage', ErasingEventContextData>
  >;
  path: Path;
};
