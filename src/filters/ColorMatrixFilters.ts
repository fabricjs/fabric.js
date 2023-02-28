import { ColorMatrix } from './ColorMatrix';
import { classRegistry } from '../ClassRegistry';
import { AbstractBaseFilterOptions } from './BaseFilter';

class GeneratedColorMatrix extends ColorMatrix {
  constructor({
    matrix,
    ...options
  }: Partial<AbstractBaseFilterOptions<string>> & { matrix: number[] }) {
    super({ ...options, mainParameter: undefined });
    this.matrix = matrix;
  }

  /**
   * Lock the matrix export for this kind of static, parameter less filters.
   */
  mainParameter = undefined;

  /**
   * Lock the colormatrix on the color part, skipping alpha
   */
  colorsOnly = true;
}

export class Brownie extends GeneratedColorMatrix {
  matrix = [
    0.5997, 0.34553, -0.27082, 0, 0.186, -0.0377, 0.86095, 0.15059, 0, -0.1449,
    0.24113, -0.07441, 0.44972, 0, -0.02965, 0, 0, 0, 1, 0,
  ];
}

classRegistry.setClass(Brownie);

export class Vintage extends GeneratedColorMatrix {
  matrix = [
    0.62793, 0.32021, -0.03965, 0, 0.03784, 0.02578, 0.64411, 0.03259, 0,
    0.02926, 0.0466, -0.08512, 0.52416, 0, 0.02023, 0, 0, 0, 1, 0,
  ];
}

classRegistry.setClass(Vintage);

export class Kodachrome extends GeneratedColorMatrix {
  matrix = [
    1.12855, -0.39673, -0.03992, 0, 0.24991, -0.16404, 1.08352, -0.05498, 0,
    0.09698, -0.16786, -0.56034, 1.60148, 0, 0.13972, 0, 0, 0, 1, 0,
  ];
}

classRegistry.setClass(Kodachrome);

export class Technicolor extends GeneratedColorMatrix {
  matrix = [
    1.91252, -0.85453, -0.09155, 0, 0.04624, -0.30878, 1.76589, -0.10601, 0,
    -0.27589, -0.2311, -0.75018, 1.84759, 0, 0.12137, 0, 0, 0, 1, 0,
  ];
}

classRegistry.setClass(Technicolor);

export class Polaroid extends GeneratedColorMatrix {
  matrix = [
    1.438, -0.062, -0.062, 0, 0, -0.122, 1.378, -0.122, 0, 0, -0.016, -0.016,
    1.483, 0, 0, 0, 0, 0, 1, 0,
  ];
}

classRegistry.setClass(Polaroid);

export class Sepia extends GeneratedColorMatrix {
  matrix = [
    0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
    0, 0, 0, 0, 0, 1, 0,
  ];
}

classRegistry.setClass(Sepia);

export class BlackWhite extends GeneratedColorMatrix {
  matrix = [
    1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 1.5, 1.5, 1.5, 0, -1, 0, 0, 0,
    1, 0,
  ];
}

classRegistry.setClass(BlackWhite);
