import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import {
  createChangelogMerge,
  mergeChangelogAdditions,
  pushChangelogMerge,
  resolveChangelogConflict,
} from './resolve-changelog-conflict.mjs';

const history = '## [7.4.0]\n\n- Historical entry\n';
const changelog = (entries = ['- Existing entry']) =>
  `# Changelog\n\n## [next]\n\n${entries.join('\n')}\n\n${history}`;

test('preserves both additions, existing entries and release history', () => {
  assert.equal(
    mergeChangelogAdditions(
      changelog(),
      changelog(['- PR entry', '- Existing entry']),
      changelog(['- Master entry', '- Existing entry']),
    ),
    changelog(['- PR entry', '- Master entry', '- Existing entry']),
  );
});

test('deduplicates identical additions from both branches', () => {
  assert.equal(
    mergeChangelogAdditions(
      changelog(),
      changelog(['- Shared entry', '- PR entry', '- Existing entry']),
      changelog(['- Shared entry', '- Master entry', '- Existing entry']),
    ),
    changelog([
      '- Shared entry',
      '- PR entry',
      '- Master entry',
      '- Existing entry',
    ]),
  );
});

test('supports an initially empty next section', () => {
  assert.equal(
    mergeChangelogAdditions(
      changelog([]),
      changelog(['- PR entry']),
      changelog(['- Master entry']),
    ),
    changelog(['- PR entry', '- Master entry']),
  );
});

for (const [name, edited] of [
  ['edited existing entry', changelog(['- Edited existing entry'])],
  ['deleted existing entry', changelog([])],
  [
    'changed release history',
    changelog().replace('Historical entry', 'Edited history'),
  ],
  ['release rollover', changelog().replace('[next]', '[7.5.0]')],
  [
    'extra section heading',
    changelog(['### Fixes', '- PR entry', '- Existing entry']),
  ],
  ['multiline entry', changelog(['- PR entry\n  details', '- Existing entry'])],
]) {
  test(`skips ${name}`, () => {
    assert.equal(
      mergeChangelogAdditions(
        changelog(),
        edited,
        changelog(['- Master entry', '- Existing entry']),
      ),
      null,
    );
  });
}

test('skips different new entries with the same PR link', () => {
  const link = '[#123](https://github.com/fabricjs/fabric.js/pull/123)';
  assert.equal(
    mergeChangelogAdditions(
      changelog(),
      changelog([`- First title ${link}`, '- Existing entry']),
      changelog([`- Second title ${link}`, '- Existing entry']),
    ),
    null,
  );
});

function fixture(
  t,
  { codeConflict = false, historyConflict = false, logConflict = true } = {},
) {
  const root = mkdtempSync(join(tmpdir(), 'fabric-changelog-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const work = join(root, 'work');
  const bare = join(root, 'remote.git');
  mkdirSync(work);
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
  const commit = (message) => {
    git(work, 'add', '.');
    git(work, 'commit', '-m', message);
    return git(work, 'rev-parse', 'HEAD');
  };
  git(work, 'init', '-b', 'master');
  write('.gitattributes', 'CHANGELOG.md merge=union\n');
  write('CHANGELOG.md', changelog());
  write('code.txt', 'Original code\n');
  commit('Initial');
  git(work, 'checkout', '-b', 'pr');
  write('CHANGELOG.md', changelog(['- PR entry', '- Existing entry']));
  write('code.txt', 'PR code\n');
  const head = commit('PR');
  git(work, 'checkout', 'master');
  if (logConflict) {
    write('CHANGELOG.md', changelog(['- Master entry', '- Existing entry']));
  }
  if (historyConflict) {
    write(
      'CHANGELOG.md',
      changelog(['- Master entry', '- Existing entry']).replace(
        'Historical entry',
        'Updated history',
      ),
    );
  }
  if (codeConflict) {
    write('code.txt', 'Master code\n');
  }
  write('master-only.txt', 'Cleanly merged master change\n');
  const base = commit('Master');
  git(root, 'clone', '--bare', work, bare);
  git(bare, 'remote', 'set-url', 'origin', work);
  return { root, work, bare, git, write, commit, head, base };
}

test('creates a bot merge commit while preserving clean code changes', (t) => {
  const f = fixture(t);
  const result = createChangelogMerge({
    cwd: f.bare,
    head: f.head,
    base: f.base,
    number: 123,
  });
  assert.equal(result.status, 'resolved');
  assert.equal(
    f.git(f.bare, 'show', `${result.commit}:CHANGELOG.md`),
    changelog(['- PR entry', '- Master entry', '- Existing entry']).trim(),
  );
  assert.equal(f.git(f.bare, 'show', `${result.commit}:code.txt`), 'PR code');
  assert.equal(
    f.git(f.bare, 'show', `${result.commit}:master-only.txt`),
    'Cleanly merged master change',
  );
  assert.equal(
    f.git(f.bare, 'show', '-s', '--format=%P', result.commit),
    `${f.head} ${f.base}`,
  );
  assert.equal(
    f.git(f.bare, 'show', '-s', '--format=%an / %cn', result.commit),
    'github-actions[bot] / github-actions[bot]',
  );
  // Preparing the resolution does not move either branch.
  assert.equal(f.git(f.bare, 'rev-parse', 'pr'), f.head);
  assert.equal(f.git(f.bare, 'rev-parse', 'master'), f.base);
  pushChangelogMerge({
    cwd: f.bare,
    branch: 'pr',
    head: f.head,
    commit: result.commit,
  });
  assert.equal(f.git(f.work, 'rev-parse', 'pr'), result.commit);
});

test('does not resolve a code conflict alongside the changelog', (t) => {
  const f = fixture(t, { codeConflict: true });
  const result = createChangelogMerge({
    cwd: f.bare,
    head: f.head,
    base: f.base,
    number: 123,
  });
  assert.equal(result.status, 'skipped');
  assert.match(result.reason, /beyond CHANGELOG/);
});

test('skips historical edits even when only the changelog conflicts', (t) => {
  const f = fixture(t, { historyConflict: true });
  const result = createChangelogMerge({
    cwd: f.bare,
    head: f.head,
    base: f.base,
    number: 123,
  });
  assert.equal(result.status, 'skipped');
  assert.match(result.reason, /not limited to additions/);
});

test('does not update a PR that merges cleanly', (t) => {
  const f = fixture(t, { logConflict: false });
  assert.equal(
    createChangelogMerge({
      cwd: f.bare,
      head: f.head,
      base: f.base,
      number: 123,
    }).status,
    'skipped',
  );
});

test('refuses to overwrite a concurrent contributor push', (t) => {
  const f = fixture(t);
  const result = createChangelogMerge({
    cwd: f.bare,
    head: f.head,
    base: f.base,
    number: 123,
  });
  f.git(f.work, 'checkout', 'pr');
  f.write('new.txt', 'New contributor work\n');
  const newer = f.commit('Concurrent update');
  assert.throws(
    () =>
      pushChangelogMerge({
        cwd: f.bare,
        branch: 'pr',
        head: f.head,
        commit: result.commit,
      }),
    /git push failed/,
  );
  assert.equal(f.git(f.work, 'rev-parse', 'pr'), newer);
});

test('refuses a concurrent branch rewind even if the resolution could fast-forward', (t) => {
  const f = fixture(t);
  const result = createChangelogMerge({
    cwd: f.bare,
    head: f.head,
    base: f.base,
    number: 123,
  });
  const ancestor = f.git(f.work, 'rev-parse', `${f.head}^`);
  f.git(f.work, 'update-ref', 'refs/heads/pr', ancestor);
  assert.throws(
    () =>
      pushChangelogMerge({
        cwd: f.bare,
        branch: 'pr',
        head: f.head,
        commit: result.commit,
      }),
    /git push failed/,
  );
  assert.equal(f.git(f.work, 'rev-parse', 'pr'), ancestor);
});

test('a second approval on a mergeable PR does not create another commit', async () => {
  const notices = [];
  await resolveChangelogConflict({
    context: {
      repo: { owner: 'fabricjs', repo: 'fabric.js' },
      payload: { pull_request: { number: 123 }, review: { id: 456 } },
    },
    github: {
      rest: {
        pulls: {
          get: async () => ({
            data: {
              state: 'open',
              draft: false,
              mergeable: true,
              base: { ref: 'master' },
              head: {
                sha: 'resolved-head',
                ref: 'pr',
                repo: { full_name: 'fabricjs/fabric.js' },
              },
            },
          }),
          getReview: async () => ({
            data: {
              state: 'APPROVED',
              commit_id: 'resolved-head',
              user: { type: 'User', login: 'reviewer' },
            },
          }),
        },
        repos: {
          getCollaboratorPermissionLevel: async () => ({
            data: { permission: 'write' },
          }),
        },
      },
    },
    core: { notice: (message) => notices.push(message) },
  });
  assert.match(notices[0], /No confirmed conflict/);
});

test('requires an approval of the current head', async () => {
  const notices = [];
  const pr = {
    number: 123,
    state: 'open',
    draft: false,
    base: { ref: 'master' },
    head: {
      sha: 'new-head',
      ref: 'pr',
      repo: { full_name: 'fabricjs/fabric.js' },
    },
  };
  await resolveChangelogConflict({
    context: {
      repo: { owner: 'fabricjs', repo: 'fabric.js' },
      payload: { pull_request: { number: 123 }, review: { id: 456 } },
    },
    github: {
      rest: {
        pulls: {
          get: async () => ({ data: pr }),
          getReview: async () => ({
            data: {
              state: 'APPROVED',
              commit_id: 'old-head',
              user: { type: 'User' },
            },
          }),
        },
      },
    },
    core: { notice: (message) => notices.push(message) },
  });
  assert.match(notices[0], /current human review/);
});
