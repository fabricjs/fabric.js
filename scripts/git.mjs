import cp from 'child_process';
import { wd } from './dirname.mjs';

export function execGitCommand(cmd) {
  return cp
    .execSync(cmd, { cwd: wd })
    .toString()
    .replace(/\n/g, ',')
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

export function getGitInfo(branchRef = '') {
  const repo = execGitCommand('git config --get remote.origin.url')[0]
    .replace('https://github.com/', '')
    .replace('.git', '');
  const branch = execGitCommand('git branch --show-current')[0];
  const tag = execGitCommand('git describe --tags')[0];
  const uncommittedChanges = execGitCommand('git status --porcelain').map(
    (value) => {
      const [type, path] = value.split(' ');
      return { type, path };
    },
  );
  const changes = execGitCommand(`git diff ${branchRef} --name-only`);
  const userName = execGitCommand('git config user.name')[0];
  return {
    repo,
    branch,
    tag,
    uncommittedChanges,
    changes,
    user: userName,
  };
}
