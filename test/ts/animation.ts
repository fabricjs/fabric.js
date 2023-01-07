/* eslint-disable @typescript-eslint/no-unused-vars */
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
// @ts-expect-error `byValue` is not part of options
animate({
  byValue: 2,
  endValue: 3,
});
animate({
  // @ts-expect-error `foo` is not part of options
  foo: 'bar',
})

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

const mixedContextError = animate({
  startValue: [5],
  // @ts-expect-error mixed context
  endValue: 1,
  onChange(a, b, c) {
    assertStrict<typeof a, number[]>(true);
    assertStrict<typeof b, number>(true);
    assertStrict<typeof c, number>(true);
  },
});

const mixedContextError2 = animate({
  // @ts-expect-error mixed context
  startValue: 5,
  endValue: [1],
  onChange(a, b, c) {
    assertStrict<typeof a, number[]>(true);
    assertStrict<typeof b, number>(true);
    assertStrict<typeof c, number>(true);
  },
});


