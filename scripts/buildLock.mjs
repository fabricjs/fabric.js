import chalk from 'chalk';
import fs from 'fs-extra';
import _ from 'lodash';
import moment from 'moment';
import path from 'node:path';
import process from 'node:process';
import psList from 'ps-list';
import { dumpsPath } from './dirname.mjs';

export const lockFile = path.resolve(dumpsPath, 'build-lock.json');

/**
 *
 * @returns {{start:{pid:number,timestamp:string},error?:{pid:number,timestamp:string}} | null}
 */
function readLockFile() {
  return fs.existsSync(lockFile) ? JSON.parse(fs.readFileSync(lockFile)) : null;
}

/**
 * For concurrency reasons, the last process to lock is granted permission to unlock.
 * If the process died the next process to try to unlock will be granted permission.
 */
export async function unlock() {
  const lock = readLockFile();
  if (!lock) return;
  const lockPID = lock.start.pid;
  const hasPermissionToUnlock =
    process.pid === lockPID ||
    !(await psList()).find(({ pid }) => pid === lockPID);
  try {
    hasPermissionToUnlock && fs.unlinkSync(lockFile);
  } catch (error) {}
}

export function isLocked() {
  return fs.existsSync(lockFile);
}

export function awaitBuild() {
  return new Promise((resolve) => {
    if (isLocked()) {
      console.log(chalk.cyanBright('> waiting for build to finish...'));
      const watcher = subscribe((locked) => {
        if (!locked) {
          watcher.close();
          resolve();
        }
      }, 500);
    } else {
      resolve();
    }
  });
}

/**
 * Subscribe to build start/error/completion.
 *
 * @param {(locked: boolean, error: boolean) => any} cb
 * @param {number} [debounce]
 * @returns
 */
export function subscribe(cb, debounce) {
  return fs.watch(
    path.dirname(lockFile),
    _.debounce((type, file) => {
      if (file !== path.basename(lockFile)) return;
      cb(isLocked(), !!(readLockFile() ?? {}).error);
    }, debounce),
  );
}

/**
 *
 * @param {'start'|'error'|'end'} type
 * @param {*} [data]
 */
export function report(type, data) {
  switch (type) {
    case 'start':
      fs.writeFileSync(
        lockFile,
        JSON.stringify(
          {
            start: {
              timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
              pid: process.pid,
            },
          },
          null,
          '\t',
        ),
      );
      break;
    case 'error':
      fs.writeFileSync(
        lockFile,
        JSON.stringify(
          {
            ...readLockFile(),
            error: {
              timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
              pid: process.pid,
              data,
            },
          },
          null,
          '\t',
        ),
      );
      break;
    case 'end':
      isLocked() && !readLockFile().error && unlock();
  }
}
