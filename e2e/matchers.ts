import type { Expect } from '@playwright/test';
import { expect } from '@playwright/test';

expect.extend({
  toMatchDataSnapshot(received: object, options?: { name?: string }) {
    try {
      expect(JSON.stringify(received, null, 2)).toMatchSnapshot(options);
      return {
        message: () => 'passed',
        pass: true,
      };
    } catch (err) {
      return {
        message: () => 'failed',
        pass: false,
      };
    }
  },
  toMatchImageSnapshot(
    received,
    options: Parameters<ReturnType<Expect>['toMatchSnapshot']>[0]
  ) {
    let data = received;
    if (typeof received === 'string' && received.startsWith('data:image')) {
      const [type, content] = received
        .replace(/^data:image\/([^;]+);([^,]+),(.+)/, '$2 $3')
        .split(' ') as [BufferEncoding, string];
      data = new Uint8Array(Buffer.from(content, type).buffer);
    }
    try {
      expect(data).toMatchSnapshot(options);
      return {
        message: () => 'passed',
        pass: true,
      };
    } catch (err) {
      return {
        message: () => 'failed',
        pass: false,
      };
    }
  },
});
