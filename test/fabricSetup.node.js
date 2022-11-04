const jsdom = require('jsdom');
const { fabric } = require('../dist/fabric');

// make a jsdom version for tests that does not spam too much.
class CustomResourceLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    return super.fetch(url, options).catch(e => {
      console.log('JSDOM CATCHED FETCHING', url);
      throw new Error('JSDOM FETCH CATCHED');
    });
  }
}
const virtualWindow = new jsdom.JSDOM(
  decodeURIComponent('%3C!DOCTYPE%20html%3E%3Chtml%3E%3Chead%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E'),
  {
    features: {
      FetchExternalResources: ['img']
    },
    resources: new CustomResourceLoader(),
  }).window;

fabric.document = virtualWindow.document;
fabric.jsdomImplForWrapper = require('jsdom/lib/jsdom/living/generated/utils').implForWrapper;
fabric.nodeCanvas = require('jsdom/lib/jsdom/utils').Canvas;
fabric.window = virtualWindow;
DOMParser = fabric.window.DOMParser;

global.fabric = fabric;
