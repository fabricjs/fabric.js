#!/usr/bin/env node
import Axios from 'axios';
import fs from 'fs-extra';
import _ from 'lodash';
import path from 'path';

const BINARY_EXT = ['png', 'jpg', 'jpeg'];

function bufferToBase64DataUrl(buffer, mimeType) {
  return 'data:' + mimeType + ';base64,' + buffer.toString('base64');
}

/**
 * https://codesandbox.io/docs/api/#define-api
 */
export async function createCodeSandbox(appPath) {
  const { trigger: __, ...package } = fs.readFileSync(path.resolve(
    appPath,
    'package.json'
  )).toJSON();
  // omit linked package
  if (package.dependencies.fabric.startsWith('file:')) {
    package.dependencies.fabric = '*';
  }
  const files = { 'package.json': JSON.stringify(package, null, '\t') };

  const gitignore = path.resolve(appPath, '.gitignore');
  const ignore = fs.existsSync(gitignore)
    ? _.compact(fs.readFileSync(gitignore).toString().split('\n')).map(
        (p) => new RegExp(p.trim())
      )
    : [];

  const processFile = (fileName) => {
    const filePath = path.resolve(appPath, fileName);
    if (ignore.some((r) => r === 'package.json' || r.test(fileName))) return;
    const ext = path.extname(fileName).slice(1);
    if (fs.lstatSync(filePath).isDirectory()) {
      fs.readdirSync(filePath).forEach((file) => {
        processFile(path.join(fileName, file).replace(/\\/g, '/'));
      });
    } else if (BINARY_EXT.some((x) => x === ext)) {
      files[fileName] = {
        content: bufferToBase64DataUrl(
          fs.readFileSync(filePath),
          `image/${ext}`
        ),
        isBinary: true,
      };
    } else {
      files[fileName] = { content: fs.readFileSync(filePath).toString() };
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
    throw error.toJSON();
  }
}
