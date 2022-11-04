
function getAsset(name, callback) {
  fabric.util.request(`/assets/${name}.svg`, {
    onComplete: function (xhr) {
      callback(null, xhr.responseText);
    }
  });
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

function generateGolden(name, canvas) {
  return new Promise((resolve, reject) => {
    return canvas.toBlob(blob => {
      const formData = new FormData();
      formData.append('file', blob, name);
      formData.append('filename', name);
      const request = new XMLHttpRequest();
      request.open('POST', '/goldens', true);
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          const status = request.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            resolve();
          } else {
            reject();
          }
        }
      };
      request.send(formData);
    });
  }, 'image/png');
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
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      keys.forEach((key, index) => formData.append(key, blobs[index], `${key}.png`));
      formData.append('filename', name);
      formData.append('passing', passing);
      formData.append('test', test);
      formData.append('module', module);
      formData.append('runner', RUNNER_ID);
      const request = new XMLHttpRequest();
      request.open('POST', '/goldens/results', true);
      request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
          const status = request.status;
          if (status === 0 || (status >= 200 && status < 400)) {
            resolve(JSON.parse(request.responseText));
          } else {
            reject();
          }
        }
      };
      request.send(formData);
    }).catch(err => {
      throw err;
    });
  }
}