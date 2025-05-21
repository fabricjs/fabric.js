import setupApp from './setupApp';
import setupCoverage from './setupCoverage';
import setupSelectors from './setupSelectors';
import path from 'node:path';
import { FabricNamespace } from '../tests/types';

const ASSET_DIR_NODE = path.resolve(process.cwd(), 'test', 'visual', 'assets');
const FIXTURE_DIR_NODE = path.resolve(process.cwd(), 'test', 'fixtures');

async function getImage(
  fabric: FabricNamespace,
  filename: string,
): Promise<HTMLImageElement> {
  const fixtureName = globalThis.getFixtureName(filename);
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
    img.src = fixtureName;
  });
}

// Used to resolve assert path for fetching
// browser equivalent is installed in setupApp in test.beforeEach
globalThis.getAssetName = function (f: string) {
  return 'file://' + path.join(ASSET_DIR_NODE, `${f}`);
};

globalThis.getFixtureName = function (f: string) {
  return 'file://' + path.join(FIXTURE_DIR_NODE, `${f}`);
};

globalThis.getImage = getImage;

export default () => {
  // call first
  setupSelectors();
  // call before using fabric
  setupCoverage();
  // call at the end - navigates the page
  setupApp();
};
