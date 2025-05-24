import { test as base } from '@playwright/test';
import { setupSelectors } from '../setup/setupSelectors';
import { CanvasUtil } from '../utils/CanvasUtil';
import { stopCoverage } from '../setup/setupCoverage';
import { setupApp } from '../setup/setupApp';
import path from 'node:path';
import { FabricNamespace } from '../tests/types';
import { readFile } from 'node:fs/promises';

interface TestFixtures {
  canvasUtil: CanvasUtil;
}

const ASSET_DIR_NODE = path.resolve(process.cwd(), 'test', 'visual', 'assets');
const FIXTURE_DIR_NODE = path.resolve(process.cwd(), 'test', 'fixtures');

async function getImage(
  fabric: FabricNamespace,
  filename: string,
): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = fabric.getFabricDocument().createElement('img');
    img.onload = function () {
      img.onerror = null;
      img.onload = null;
      resolve(img);
    };
    img.onerror = function (err) {
      img.onerror = null;
      img.onload = null;
      reject(err);
    };
    img.src = globalThis.getFixtureName(filename);
  });
}

// Used to resolve assert path for fetching
// browser equivalent is installed in setupApp in test.beforeEach
globalThis.getAssetName = function (f: string) {
  return 'file://' + path.join(ASSET_DIR_NODE, f);
};

globalThis.getAsset = async function (name: string): Promise<string> {
  const finalName = globalThis.getAssetName(name);
  const plainFileName = finalName.replace('file://', '');
  return readFile(plainFileName, { encoding: 'utf8' });
};

globalThis.getFixtureName = function (f: string) {
  return 'file://' + path.join(FIXTURE_DIR_NODE, f);
};

globalThis.getImage = getImage;

export const test = base.extend<TestFixtures>({
  canvasUtil: async ({ page }, use) => {
    const canvasUtil = new CanvasUtil(page);
    await use(canvasUtil);
  },

  page: async ({ page }, use, testInfo) => {
    await page.coverage.startJSCoverage({ reportAnonymousScripts: false });
    await setupSelectors();
    const getImageFunctionString = getImage.toString();
    await page.addInitScript(
      `globalThis.getImage = ${getImageFunctionString};`,
    );
    await setupApp(page, testInfo.file);
    await use(page);
    await page.evaluate(() => window.__teardownFabricHook());
    await stopCoverage(page, testInfo.outputDir);
  },
});

export { expect } from '@playwright/test';
