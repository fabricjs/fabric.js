
async function getAsset(name, callback) {
  const svg = (await fetch(`/assets/${name}.svg`)).text();
  callback(null, svg);
}

async function getFixture(name, callback) {
  callback(await getImage(`/fixtures/${name}`));
}

function getGolden(name) {
  return getImage(`/golden/${name}`);
}

function goldenExists(name) {
  return fetch(`/goldens/${name}`, { method: 'GET' })
    .then(res => res.json())
    .then(res => res.exists);
}

async function generateGolden(name, canvas) {
  const blob = await new Promise((resolve, reject) => {
    try {
      canvas.toBlob(resolve, 'image/png');
    } catch (error) {
      reject(error);
    }
  });
  const formData = new FormData();
  formData.append('file', blob, name);
  formData.append('filename', name);
  return fetch('/goldens', {
    body: formData,
    method: 'POST'
  });
}

async function dumpResults(name, { passing, test, module }, visuals) {
  if (QUnit.launch || !passing) {
    const keys = Object.keys(visuals);
    const blobs = await Promise.all(keys.map(key => new Promise((resolve, reject) => {
      try {
        visuals[key].toBlob(resolve, 'image/png');
      } catch (error) {
        reject(error);
      }
    })));
    const formData = new FormData();
    keys.forEach((key, index) => formData.append(key, blobs[index], `${key}.png`));
    formData.append('filename', name);
    formData.append('passing', passing);
    formData.append('test', test);
    formData.append('module', module);
    formData.append('runner', RUNNER_ID);
    return fetch('/goldens/results', {
      body: formData,
      method: 'POST'
    });
  }
}