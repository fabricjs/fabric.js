import { IsExact } from 'conditional-type-checks';
import { animate } from '../../src/util/animation';

function assertStrict<T, U>(assertTrue: IsExact<T, U>) {
  return assertTrue;
}

animate({
  endValue: 3,
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
  endValue: [1],
  onChange(a, b, c) {
    assertStrict<typeof a, number[]>(true);
    assertStrict<typeof b, number>(true);
    assertStrict<typeof c, number>(true);
  },
});

assertStrict<typeof arrayContext.endValue, number[]>(true);
