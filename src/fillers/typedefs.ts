import type { Gradient } from '../gradient/Gradient';
import type { Pattern } from '../Pattern';

export type TFiller = Gradient<'linear'> | Gradient<'radial'> | Pattern;
