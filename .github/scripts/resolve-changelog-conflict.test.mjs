import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const script = resolve('.github/scripts/resolve-changelog-conflict.sh');

function fixture(t, { codeConflict = false, unionAll = false } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'fabric-changelog-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const work = join(root, 'work');
  const remote = join(root, 'remote.git');
  const bin = join(root, 'bin');
  mkdirSync(work);
  mkdirSync(bin);
  const git = (cwd, ...args) =>
    execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_AUTHOR_NAME: 'Contributor',
        GIT_AUTHOR_EMAIL: 'contributor@example.invalid',
        GIT_COMMITTER_NAME: 'Contributor',
        GIT_COMMITTER_EMAIL: 'contributor@example.invalid',
      },
    }).trim();
  const write = (path, content) => writeFileSync(join(work, path), content);
  const commit = () => {
    git(work, 'add', '.');
    git(work, 'commit', '-m', 'Fixture');
    return git(work, 'rev-parse', 'HEAD');
  };
  git(work, 'init', '-b', 'master');
  write('.gitattributes', 'CHANGELOG.md merge=union\n');
  write('CHANGELOG.md', '# Changelog\n\n## [next]\n\n- Existing\n');
  write('code.txt', 'Original code\n');
  const original = commit();
  git(work, 'checkout', '-b', 'pr');
  write('CHANGELOG.md', '# Changelog\n\n## [next]\n\n- PR\n- Existing\n');
  write('code.txt', 'PR code\n');
  if (unionAll) write('.gitattributes', '* merge=union\n');
  const head = commit();
  git(work, 'checkout', 'master');
  write('CHANGELOG.md', '# Changelog\n\n## [next]\n\n- Master\n- Existing\n');
  write('master-only.txt', 'Clean master change\n');
  if (codeConflict) write('code.txt', 'Master code\n');
  const base = commit();
  git(root, 'clone', '--bare', work, remote);
  git(remote, 'update-ref', 'refs/pull/123/head', head);
  const pr = {
    state: 'open',
    draft: false,
    mergeable: false,
    base: { ref: 'master', sha: base },
    head: { ref: 'pr', sha: head, repo: { full_name: 'fabricjs/fabric.js' } },
  };
  const review = {
    state: 'APPROVED',
    commit_id: head,
    user: { type: 'User', login: 'reviewer' },
  };
  writeFileSync(join(root, 'counter'), '0');
  writeFileSync(
    join(bin, 'gh'),
    `#!/usr/bin/env bash
case "$2" in
  */permission) echo write ;;
  */reviews/*) cat "$FIXTURE_ROOT/review.json" ;;
  *)
    count=$(cat "$FIXTURE_ROOT/counter")
    echo $((count + 1)) > "$FIXTURE_ROOT/counter"
    if [[ $count == 1 && -n \${RACE_HEAD:-} ]]; then
      git --git-dir="$FIXTURE_ROOT/remote.git" update-ref refs/heads/pr "$RACE_HEAD"
    fi
    cat "$FIXTURE_ROOT/pr.json"
    ;;
esac
`,
    { mode: 0o755 },
  );
  const run = (extraEnv = {}) => {
    writeFileSync(join(root, 'pr.json'), JSON.stringify(pr));
    writeFileSync(join(root, 'review.json'), JSON.stringify(review));
    return spawnSync('bash', [script, remote], {
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        FIXTURE_ROOT: root,
        GH_REPO: 'fabricjs/fabric.js',
        GH_TOKEN: 'test-token',
        PR_NUMBER: '123',
        REVIEW_ID: '456',
        ...extraEnv,
      },
    });
  };
  return { git, remote, head, base, original, pr, review, run };
}

test('merges master with changelog union and preserves clean code changes', (t) => {
  const f = fixture(t);
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  const merged = f.git(f.remote, 'rev-parse', 'pr');
  assert.notEqual(merged, f.head);
  assert.equal(
    f.git(f.remote, 'show', '-s', '--format=%P', merged),
    `${f.head} ${f.base}`,
  );
  assert.equal(
    f.git(f.remote, 'show', `${merged}:CHANGELOG.md`),
    '# Changelog\n\n## [next]\n\n- PR\n- Master\n- Existing',
  );
  assert.equal(f.git(f.remote, 'show', `${merged}:code.txt`), 'PR code');
  assert.equal(
    f.git(f.remote, 'show', `${merged}:master-only.txt`),
    'Clean master change',
  );
  assert.equal(
    f.git(f.remote, 'show', '-s', '--format=%an / %cn', merged),
    'github-actions[bot] / github-actions[bot]',
  );
});

for (const unionAll of [false, true]) {
  test(`does not push code conflicts${unionAll ? ' even when PR attributes request union for everything' : ''}`, (t) => {
    const f = fixture(t, { codeConflict: true, unionAll });
    const result = f.run();
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /merge still has conflicts/);
    assert.equal(f.git(f.remote, 'rev-parse', 'pr'), f.head);
  });
}

test('does not act on an approval of an older head', (t) => {
  const f = fixture(t);
  f.review.commit_id = f.original;
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git(f.remote, 'rev-parse', 'pr'), f.head);
});

test('does not act on a second approval once the PR is mergeable', (t) => {
  const f = fixture(t);
  f.pr.mergeable = true;
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(f.git(f.remote, 'rev-parse', 'pr'), f.head);
});

test('the push lease rejects a concurrent branch rewind', (t) => {
  const f = fixture(t);
  const result = f.run({ RACE_HEAD: f.original });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /stale info/);
  assert.equal(f.git(f.remote, 'rev-parse', 'pr'), f.original);
});
