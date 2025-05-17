import setupApp from './setupApp';
import setupCoverage from './setupCoverage';
import setupSelectors from './setupSelectors';
import path from 'node:path';

const ASSET_DIR_NODE = path.resolve(process.cwd(), 'test', 'visual', 'assets');
const FIXTURE_DIR_NODE = path.resolve(process.cwd(), 'test', 'fixtures');

// Used to resolve assert path for fetching
// browser equivalent is installed in setupApp in test.beforeEach
globalThis.getAssetName = function (f: string) {
  return 'file://' + path.join(ASSET_DIR_NODE, `${f}`);
};

globalThis.getFixtureName = function (f: string) {
  return 'file://' + path.join(FIXTURE_DIR_NODE, `${f}`);
};

export default () => {
  // call first
  setupSelectors();
  // call before using fabric
  setupCoverage();
  // call at the end - navigates the page
  setupApp();
};
