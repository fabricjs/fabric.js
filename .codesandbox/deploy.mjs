#!/usr/bin/env node
import fs from 'fs-extra';
import _ from 'lodash';
import match from 'micromatch';
import path from 'path';
import { getGitInfo } from '../scripts/git.mjs';

const BINARY_EXT = ['png', 'jpg', 'jpeg', 'ico'];

function bufferToBase64DataUrl(buffer, mimeType) {
  return 'data:' + mimeType + ';base64,' + buffer.toString('base64');
}

function globToRegex(glob, opts) {
  return match.makeRe(glob, opts);
}

function parseIgnoreFile(file) {
  return _.compact(fs.readFileSync(file).toString().split('\n')).map((p) =>
    globToRegex(p.trim()),
  );
}

export function ignore(appPath, fileName) {
  const gitignore = path.resolve(appPath, '.gitignore');
  const codesandboxignore = path.resolve(appPath, '.codesandboxignore');
  const ignore = _.flatten(
    [gitignore, codesandboxignore].filter(fs.existsSync).map(parseIgnoreFile),
  );
  return ignore.some((r) => r.test(fileName));
}

/**
 * https://codesandbox.io/docs/api/#define-api
 */
export async function createCodeSandbox(appPath) {
  const { trigger: __, ...packageJSON } = JSON.parse(
    fs.readFileSync(path.resolve(appPath, 'package.json')),
  );
  // omit linked package
  if (packageJSON.dependencies.fabric.startsWith('file:')) {
    const { repo, branch } = getGitInfo();
    packageJSON.dependencies.fabric = `${repo}#${branch}`;
  }
  packageJSON.scripts.postinstall =
    'cd node_modules/fabric && npm i && npm run build -- -f';
  const files = {
    'package.json': {
      content: JSON.stringify(packageJSON, null, '\t'),
    },
  };

  const processFile = (fileName) => {
    const filePath = path.resolve(appPath, fileName);
    if (fileName === 'package.json' || ignore(appPath, fileName)) return;
    const ext = path.extname(fileName).slice(1);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((file) => {
        processFile(path.join(fileName, file).replace(/\\/g, '/'));
      });
    } else if (BINARY_EXT.includes(ext)) {
      files[fileName] = {
        content: bufferToBase64DataUrl(
          fs.readFileSync(filePath),
          `image/${ext}`,
        ),
        isBinary: true,
      };
    } else {
      const { name, base, ...rest } = path.parse(filePath);
      const sandboxVersion = path.format({
        ...rest,
        name: `${name}.codesandbox`,
      });
      const finalVersion = fs.existsSync(sandboxVersion)
        ? sandboxVersion
        : filePath;
      files[fileName] = { content: fs.readFileSync(finalVersion).toString() };
    }
  };
  fs.readdirSync(appPath).forEach(processFile);
  try {
    const response = await fetch(
      'https://codesandbox.io/api/v1/sandboxes/define?json=1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          template: JSON.parse(
            fs.readFileSync(path.resolve(appPath, 'sandbox.config.json')) ||
              null,
          ).template,
          files,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw errorData || new Error(`HTTP error! status: ${response.status}`);
    }

    const { sandbox_id } = await response.json();
    return `https://codesandbox.io/s/${sandbox_id}`;
  } catch (error) {
    throw error;
  }
}
