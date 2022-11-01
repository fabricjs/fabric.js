
function appendResultsToNode(node, testId) {
  const { name, basename, expected, actual, diff } = window.testIdToFileMap[testId];
  const template = document.getElementById('error_output');
  const errorOutput = template.content.cloneNode(true);
  const urls = { expected, actual, diff };
  Object.keys(urls).forEach(async key => {
    const img = document.createElement('img');
    img.src = urls[key];
    errorOutput.querySelector(`*[data-canvas-type="${key}"]`).appendChild(img);
    img.style.cursor = 'pointer';
    img.setAttribute('data-golden', name);
    img.onclick = () => {
      const link = document.createElement('a');
      link.href = img.src;
      link.download = `${basename}/${key}.png`;
      link.click();
    }
  });
  node.appendChild(errorOutput);
  !!node.querySelector('.qunit-collapsed') && node.querySelector('table').classList.add('qunit-collapsed');
  node.firstChild.addEventListener('click', () => {
    node.querySelector('table').classList.toggle('qunit-collapsed');
  });
}

/**
 * Called from testem.mustache file
 */
function appendTestResults({ testId }) {
  const id = `qunit-test-output-${testId}`;
  const node = document.getElementById(id);
  if (node) {
    appendResultsToNode(node, testId);
  }
  else {
    new MutationObserver((mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.id === id && !node.querySelector('table')) {
              appendResultsToNode(node, testId);
              observer.disconnect();
            }
          });
        }
      }
    }).observe(document.getElementById('qunit-tests'), { childList: true });
  };
};