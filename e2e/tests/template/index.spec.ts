import { test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import '../../utils/setupTest';

test('TEST NAME', async ({ page }) => {
  const util = new CanvasUtil(page);
  // write the test
});
