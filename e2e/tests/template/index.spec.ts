import { test } from '@playwright/test';
import { CanvasUtil } from '../../utils/CanvasUtil';
import { ObjectUtil } from '../../utils/ObjectUtil';

import '../../setup';

test('TEST NAME', async ({ page }) => {
  const canvasUtil = new CanvasUtil(page);
  // note that `textbox` correlates to the returned key in `index.ts` => `beforeAll`
  const textboxUtil = new ObjectUtil(page, 'textbox');
  // write the test
});
