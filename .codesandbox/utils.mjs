import fs from 'fs-extra';
import _ from 'lodash';
import match from 'micromatch';
import path from 'path';

export const BINARY_EXT = ['png', 'jpg', 'jpeg'];

export function bufferToBase64DataUrl(buffer, mimeType) {
  return 'data:' + mimeType + ';base64,' + buffer.toString('base64');
}

function globToRegex(glob, opts) {
  return match.makeRe(glob, opts);
}

function parseIgnoreFile(file) {
  return _.compact(fs.readFileSync(file).toString().split('\n')).map((p) =>
    globToRegex(p.trim())
  );
}

export function ignore(appPath, fileName) {
  const gitignore = path.resolve(appPath, '.gitignore');
  const codesandboxignore = path.resolve(appPath, '.codesandboxignore');
  const ignore = _.flatten(
    [gitignore, codesandboxignore].filter(fs.existsSync).map(parseIgnoreFile)
  );
  return ignore.some((r) => r.test(fileName));
}
