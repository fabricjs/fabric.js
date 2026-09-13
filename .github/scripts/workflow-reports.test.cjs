const assert = require('node:assert/strict');
const { test } = require('node:test');
const {
  resolveRun,
  artifact,
  buildStatsReport,
  escapeText,
  comment,
} = require('./workflow-reports.cjs');
const { updateContent, updateChangelog } = require('./update-changelog.cjs');

function fixture({ fork = true } = {}) {
  const repo = {
    full_name: 'fabricjs/fabric.js',
    owner: { login: 'fabricjs' },
    name: 'fabric.js',
  };
  const head = fork
    ? {
        full_name: 'contributor/fabric.js',
        owner: { login: 'contributor' },
        name: 'fabric.js',
      }
    : repo;
  const pr = {
    number: 10,
    title: "fix: apostrophe's $(literal)",
    state: 'open',
    base: { ref: 'master', repo },
    head: { ref: 'feature', sha: 'a'.repeat(40), repo: head },
  };
  const run = {
    id: 42,
    status: 'completed',
    conclusion: 'success',
    path: '.github/workflows/tests.yml',
    event: 'pull_request',
    repository: repo,
    head_repository: head,
    head_branch: pr.head.ref,
    head_sha: pr.head.sha,
    pull_requests: [],
  };
  const context = {
    repo: { owner: 'fabricjs', repo: 'fabric.js' },
    payload: { workflow_run: { id: run.id } },
  };
  const calls = [];
  const prs = [pr];
  const artifacts = [
    { id: 7, name: 'changelog_artifact', expired: false, size_in_bytes: 5 },
  ];
  const comments = [];
  const file = {
    path: 'CHANGELOG.md',
    mode: '100644',
    type: 'blob',
    sha: 'blob',
  };
  const capture =
    (name, data = {}) =>
    async (args) => {
      calls.push({ name, args });
      return { data };
    };
  const github = {
    rest: {
      actions: {
        getWorkflowRun: async () => ({ data: run }),
        listWorkflowRunArtifacts: 'artifacts',
      },
      pulls: { list: 'prs', get: async () => ({ data: pr }) },
      repos: {
        getBranch: async () => ({ data: { commit: { sha: run.head_sha } } }),
      },
      issues: {
        listComments: 'comments',
        createComment: capture('comment'),
        updateComment: capture('updateComment'),
      },
      git: {
        getCommit: capture('getCommit', { tree: { sha: 'tree' } }),
        getTree: capture('getTree', { sha: 'tree', tree: [file] }),
        getBlob: capture('getBlob', {
          content: Buffer.from('# Changelog\n\n## [next]\n\n').toString(
            'base64',
          ),
          encoding: 'base64',
        }),
        createTree: capture('createTree', { sha: 'new-tree' }),
        createCommit: capture('createCommit', { sha: 'new-commit' }),
        updateRef: capture('updateRef'),
      },
    },
    paginate: async (method) => ({ prs, artifacts, comments })[method],
  };
  return { github, context, run, pr, prs, artifacts, comments, calls, file };
}
const resolve = (f) => resolveRun({ ...f, workflow: 'tests.yml' });

test('resolves a fork even when workflow_run.pull_requests is empty', async () => {
  const f = fixture();
  assert.equal((await resolve(f)).pr.number, 10);
});
for (const [name, mutate] of [
  ['stale head', (f) => (f.pr.head.sha = 'b'.repeat(40))],
  [
    'different fork',
    (f) => (f.pr.head.repo = { full_name: 'other/fabric.js' }),
  ],
  ['different branch', (f) => (f.pr.head.ref = 'other')],
  ['wrong base', (f) => (f.pr.base.ref = 'other')],
  ['closed PR', (f) => f.prs.splice(0)],
  ['cancelled run', (f) => (f.run.conclusion = 'cancelled')],
  ['unfinished run', (f) => (f.run.status = 'in_progress')],
  ['unsupported event', (f) => (f.run.event = 'workflow_dispatch')],
])
  test(`does not act on ${name}`, async () => {
    const f = fixture();
    mutate(f);
    assert.equal(await resolve(f), null);
  });
for (const [name, mutate] of [
  ['wrong workflow', (f) => (f.run.path = '.github/workflows/other.yml')],
  ['wrong repository', (f) => (f.run.repository = { full_name: 'other/repo' })],
  ['invalid revision', (f) => (f.run.head_sha = '$(command)')],
  ['ambiguous PR', (f) => f.prs.push({ ...f.pr, number: 11 })],
])
  test(`rejects ${name}`, async () => {
    const f = fixture();
    mutate(f);
    await assert.rejects(resolve(f));
  });

test('accepts the current master push and ignores an old one', async () => {
  const f = fixture({ fork: false });
  f.run.event = 'push';
  f.run.head_branch = 'master';
  assert.equal((await resolve(f)).pr, null);
  f.github.rest.repos.getBranch = async () => ({
    data: { commit: { sha: 'b'.repeat(40) } },
  });
  assert.equal(await resolve(f), null);
});
test('ignores missing artifacts and rejects duplicate or oversized ones', async () => {
  const f = fixture();
  assert.equal(await artifact({ ...f, name: 'missing' }), null);
  f.artifacts.push({ ...f.artifacts[0] });
  await assert.rejects(artifact({ ...f, name: 'changelog_artifact' }));
  f.artifacts.pop();
  f.artifacts[0].size_in_bytes = 30 * 1024 * 1024;
  await assert.rejects(artifact({ ...f, name: 'changelog_artifact' }));
});
test('statistics reject malformed values and render untrusted labels as text', () => {
  const original = { size: { fabric: { generated: 1024 } } };
  assert.match(
    buildStatsReport(original, { size: { fabric: { generated: 2048 } } }),
    /2\.000 \(\*\*\+1\.000/,
  );
  for (const value of [-1, Infinity, '100', null, {}])
    assert.throws(() =>
      buildStatsReport(original, { size: { fabric: { generated: value } } }),
    );
  assert.throws(() =>
    buildStatsReport(original, { size: { fabric: { unknown: 1 } } }),
  );
  const text = buildStatsReport(original, {
    size: { '<img>|@user\n`': { generated: 1 } },
  });
  assert.ok(
    !text.includes('<img>') && !text.includes('@user') && !text.includes('`'),
  );
});
test('coverage text cannot break out of its preformatted block', () => {
  assert.equal(escapeText('</pre>@user'), '&#60;/pre&#62;&#64;user');
});
test('comments cannot target an artifact-supplied PR or update a user comment', async () => {
  const f = fixture();
  f.comments.push({
    id: 1,
    user: { login: 'attacker' },
    body: '<!-- marker -->',
  });
  await comment({ ...f, marker: '<!-- marker -->', body: 'result' });
  assert.equal(f.calls[0].name, 'comment');
  assert.equal(f.calls[0].args.issue_number, 10);
});
test('does not publish a stale report', async () => {
  const f = fixture();
  f.github.rest.pulls.get = async () => ({
    data: { ...f.pr, head: { sha: 'b'.repeat(40) } },
  });
  assert.equal(
    await comment({ ...f, marker: '<!-- marker -->', body: 'result' }),
    false,
  );
  assert.deepEqual(f.calls, []);
});
test('changelog updates are idempotent and preserve other entries', () => {
  const link = '[#10](https://github.com/fabricjs/fabric.js/pull/10)';
  const old = '# Changelog\n\n## [next]\n\n- Keep me\n';
  const updated = updateContent(old, 'first', link);
  const renamed = updateContent(updated, 'second\nline', link);
  assert.ok(renamed.includes('- Keep me') && renamed.includes('second line'));
  assert.equal(renamed.split(link).length, 2);
  assert.equal(updateContent(renamed, 'second line', link), renamed);
});
test('fork changelog failures produce help, never a write to the fork', async () => {
  const f = fixture();
  f.run.path = '.github/workflows/changelog_check_and_create.yml';
  await updateChangelog(f);
  assert.deepEqual(
    f.calls.map((c) => c.name),
    ['comment'],
  );
  assert.match(f.calls[0].args.body, /cannot push to your fork/);
});
test('same-repository updates write only CHANGELOG.md with a non-force update', async () => {
  const f = fixture({ fork: false });
  f.run.path = '.github/workflows/changelog_check_and_create.yml';
  await updateChangelog(f);
  const tree = f.calls.find((c) => c.name === 'createTree').args;
  assert.equal(tree.owner, 'fabricjs');
  assert.equal(tree.repo, 'fabric.js');
  assert.deepEqual(
    tree.tree.map((f) => f.path),
    ['CHANGELOG.md'],
  );
  assert.deepEqual(
    f.calls.find((c) => c.name === 'createCommit').args.parents,
    [f.pr.head.sha],
  );
  assert.equal(f.calls.find((c) => c.name === 'updateRef').args.force, false);
});
test('changelog symlinks cannot redirect writes', async () => {
  const f = fixture({ fork: false });
  f.run.path = '.github/workflows/changelog_check_and_create.yml';
  f.file.mode = '120000';
  await assert.rejects(updateChangelog(f), /regular file/);
  assert.ok(!f.calls.some((c) => c.name === 'createTree'));
});
test('a concurrent push is not overwritten', async () => {
  const f = fixture({ fork: false });
  f.run.path = '.github/workflows/changelog_check_and_create.yml';
  f.github.rest.git.updateRef = async (args) => {
    assert.equal(args.force, false);
    throw new Error('Not a fast forward');
  };
  await assert.rejects(updateChangelog(f), /fast forward/);
});
