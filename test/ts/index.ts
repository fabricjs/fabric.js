import { fabric } from '../..';
import { IsAny, assert } from 'conditional-type-checks';

assert<IsAny<typeof fabric>>(false);
assert<IsAny<typeof fabric.util>>(false);
