import setupApp from './setupApp';
import setupCoverage from './setupCoverage';
import setupSelectors from './setupSelectors';

/**
 * @param {Function} [testConfig] pass data/config from the test to the browser
 */
export default (testConfig?: () => any) => {
  // call first
  setupSelectors();
  // call before using fabric
  setupCoverage();
  // call at the end - navigates the page
  setupApp(testConfig);
};
