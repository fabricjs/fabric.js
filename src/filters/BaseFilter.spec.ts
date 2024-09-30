import { BaseFilter } from './BaseFilter';

class SimpleFilter extends BaseFilter<'?'> {
  static type = '?';
  declare property: string;
}

describe('Extended filters', () => {
  it('can export', () => {
    const f = new SimpleFilter();
    const serialized = f.toObject();
    expect(serialized).toEqual({ type: '?' });
  });
});
