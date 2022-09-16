#!/usr/bin/env node
import Axios from 'axios';
import fs from 'fs-extra';
import _ from 'lodash';
import match from 'micromatch';
import path from 'path';

const BINARY_EXT = ['png', 'jpg', 'jpeg'];

function bufferToBase64DataUrl(buffer, mimeType) {
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

/**
 * https://codesandbox.io/docs/api/#define-api
 */
export async function createCodeSandbox(appPath) {
  const { trigger: __, ...packageJSON } = JSON.parse(fs.readFileSync(path.resolve(
    appPath,
    'package.json'
  )));
  // omit linked package
  console.log(packageJSON.dependencies.fabric.startsWith('file:'))
  if (packageJSON.dependencies.fabric.startsWith('file:')) {
    packageJSON.dependencies.fabric = '*';
  }
  const files = {
    'package.json': {
      content: JSON.stringify(packageJSON, null, '\t')
    }
  };

  const gitignore = path.resolve(appPath, '.gitignore');
  const codesandboxignore = path.resolve(appPath, '.codesandboxignore');
  const ignore = _.flatten(
    [gitignore, codesandboxignore].filter(fs.existsSync).map(parseIgnoreFile)
  );

  const processFile = (fileName) => {
    const filePath = path.resolve(appPath, fileName);
    if (fileName === 'package.json' || ignore.some((r) => r.test(fileName))) return;
    const ext = path.extname(fileName).slice(1);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((file) => {
        processFile(path.join(fileName, file).replace(/\\/g, '/'));
      });
    } else if (BINARY_EXT.includes(ext)) {
      files[fileName] = {
        content: bufferToBase64DataUrl(
          fs.readFileSync(filePath),
          `image/${ext}`
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
    const {
      data: { sandbox_id },
    } = await Axios.post(
      'https://codesandbox.io/api/v1/sandboxes/define?json=1',
      {
        template: JSON.parse(
          fs.readFileSync(path.resolve(appPath, 'sandbox.config.json')) || null
        ).template,
        files,
      }
    );
    return `https://codesandbox.io/s/${sandbox_id}`;
  } catch (error) {
  console.log(error.response.data)
    throw new Error(error.response.data);
  }
}
