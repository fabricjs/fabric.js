import type { FabricObject } from '../../shapes/Object/FabricObject';
import type { Path } from '../../shapes/Path';

export type ErasingEventContextData = {
  targets: FabricObject[];
  subTargets: FabricObject[];
  paths: Map<FabricObject, Path>;
};

export type ErasingEventContext = ErasingEventContextData & {
  drawables: Partial<
    Record<`${'background' | 'overlay'}Image`, ErasingEventContextData>
  >;
  path: Path;
};
