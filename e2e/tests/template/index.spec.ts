import { test } from '@playwright/test';
import { TestUtil } from '../../utils/TestUtil';
import '../../utils/setupTest';

test('TEST NAME', async ({ page }) => {
  const util = new TestUtil(page);
  // write the test
});
