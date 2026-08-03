import { generateExample } from '../../../../../utils/generateExample';

import example1 from './example1';
import example2 from './example2';
import example1code from './example1?raw';
import example2code from './example2?raw';

export const Example1 = generateExample(example1, 'example1', example1code);
export const Example2 = generateExample(example2, 'example2', example2code);
