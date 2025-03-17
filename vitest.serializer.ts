import { SnapshotSerializer } from 'vitest';

export default {
  serialize(val, config, indentation, depth, refs, printer) {
    // `printer` is a function that serializes a value using existing plugins.
    return `Pretty foo: ${printer(val.foo, config, indentation, depth, refs)}`;
  },
  test(val) {
    return val && Object.prototype.hasOwnProperty.call(val, 'foo');
  },
} satisfies SnapshotSerializer;
