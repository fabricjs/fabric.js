import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getImage } from './common.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDir = path.resolve(__dirname, '..');
const fixtureDir = path.resolve(testDir, 'fixtures');
const assetDir = path.resolve(testDir, 'visual', 'assets');
const goldenDir = path.resolve(testDir, 'visual', 'golden');


export const getFixture = async function(name, original, callback) {
callback(await getImage(prefix(path.resolve(fixtureDir, name)), original));
};

export function getAssetName(filename, ext = '.svg') {
    return prefix(path.resolve(assetDir, path.basename(filename, ext)));
}

export function getAsset(name, callback) {
return fs.readFile(getAssetName(name), { encoding: 'utf8' }, callback);
};

export function getGoldenName(filename) {
return prefix(path.resolve(goldenDir, filename));
}

function prefix(filename) {
return `file://${filename}`;
}

function stripFilePrefix(filename) {
return filename.replace('file://', '');
}

export function generateGolden(filename, original) {
const dataUrl = original.toDataURL().split(',')[1];
console.log('creating golden for ', filename);
fs.writeFileSync(stripFilePrefix(filename), dataUrl, { encoding: 'base64' });
}

export function exists(filename) {
return fs.existsSync(stripFilePrefix(filename));
}
