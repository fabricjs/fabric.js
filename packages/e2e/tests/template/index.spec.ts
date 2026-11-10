import { test } from '../../fixtures/base';
import { ObjectUtil } from '../../utils/ObjectUtil';

test('TEST NAME', async ({ page, canvasUtil }) => {
  // note that `textbox` correlates to the returned key in `index.ts` => `beforeAll`
  const textboxUtil = new ObjectUtil(page, 'textbox');
  // write the test
});
