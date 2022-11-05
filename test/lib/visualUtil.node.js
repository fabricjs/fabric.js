const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { getImage } = require('./visualUtil');
const { pathToFileURL } = require('node:url');

const wd = path.resolve(__dirname, '..', 'visual');
const RUNNER_ID = process.env.RUNNER_ID || 'node';
const REPORT_DIR = process.env.REPORT_DIR;

function getAsset(name, callback) {
  return fs.readFile(path.resolve(wd, 'assets', `${name}.svg`), { encoding: 'utf8' }, callback);
}

async function getFixture(name, callback) {
  callback(await getImage(pathToFileURL(path.resolve(wd, '..', 'fixtures', name))));
}

function getGolden(name) {
  return getImage(pathToFileURL(path.resolve(wd, 'golden', name)));
}

function goldenExists(name) {
  return fs.existsSync(path.resolve(wd, 'golden', name));
}

function generateGolden(name, canvas) {
  const file = path.resolve(wd, 'golden', name);
  const dataUrl = canvas.toDataURL().split(',')[1];
  console.log(chalk.gray('[info]'), `creating golden ${path.relative(wd, file)}`);
  fs.writeFileSync(file, dataUrl, { encoding: 'base64' });
}

async function dumpResults(name, { passing, test, module }, visuals) {
  if (!passing) {
    const basename = path.basename(name, '.png');
    const dumpsPath = path.resolve(REPORT_DIR, RUNNER_ID, basename);
    fs.ensureDirSync(dumpsPath);
    fs.writeFileSync(path.resolve(dumpsPath, 'info.json'), JSON.stringify({
      module,
      test,
      file: basename,
      passing: false
    }, null, 2));
    Object.keys(visuals).forEach(key => {
      const dataUrl = visuals[key].toDataURL().split(',')[1];
      fs.writeFileSync(path.resolve(dumpsPath, `${key}.png`), dataUrl, { encoding: 'base64' });
    });
  }
}

module.exports = {
  getAsset,
  getFixture,
  getGolden,
  goldenExists,
  generateGolden,
  dumpResults
};