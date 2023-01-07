import { IsExact } from 'conditional-type-checks';
import { animate } from '../../src/util/animation/animate';

function assertStrict<T, U>(assertTrue: IsExact<T, U>) {
  return assertTrue;
}

animate({
  endValue: 3,
});
animate({
  // @ts-expect-error `byValue` is not part of options
  byValue: 2,
});
animate({
  endValue: 3,
  // @ts-expect-error `byValue` is not part of options
  byValue: 2,
});

const context = animate({
  startValue: 1,
  endValue: 3,
  onChange(a, b, c) {
    assertStrict<typeof a, number>(true);
    assertStrict<typeof b, number>(true);
    assertStrict<typeof c, number>(true);
  },
});

assertStrict<typeof context.endValue, number>(true);

const arrayContext = animate({
  startValue: [5],
  byValue: [1],
  onChange(a, b, c) {
    assertStrict<typeof a, number[]>(true);
    assertStrict<typeof b, number>(true);
    assertStrict<typeof c, number>(true);
  },
});

assertStrict<typeof arrayContext.endValue, number[]>(true);
