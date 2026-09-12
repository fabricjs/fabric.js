const assert = require('node:assert/strict');
const { test } = require('node:test');
const { updateContent, updateChangelog } = require('./update-changelog.cjs');

const link = '[#10](https://github.com/fabricjs/fabric.js/pull/10)';
const original = '# Changelog\n\n## [next]\n\n- Keep this entry\n';

function fixture() {
  const calls = [];
  const pr = {
    state: 'open',
    title: "fix: apostrophe's and $(literal)",
    head: {
      sha: 'head-sha',
      ref: 'feature',
      repo: {
        full_name: 'fabricjs/fabric.js',
        owner: { login: 'fabricjs' },
        name: 'fabric.js',
      },
    },
  };
  const file = {
    path: 'CHANGELOG.md',
    mode: '100644',
    type: 'blob',
    sha: 'blob',
  };
  const context = {
    repo: { owner: 'fabricjs', repo: 'fabric.js' },
    payload: {
      workflow_run: {
        id: 1,
        head_sha: 'head-sha',
        head_repository: { full_name: 'fabricjs/fabric.js' },
        pull_requests: [{ number: 10 }],
      },
    },
  };
  const capture = (name, data) => async (args) => {
    calls.push({ name, args });
    return { data };
  };
  const github = {
    paginate: async () => [{ name: 'changelog_artifact', expired: false }],
    rest: {
      actions: {},
      pulls: { get: async () => ({ data: pr }) },
      git: {
        getCommit: capture('getCommit', { tree: { sha: 'base-tree' } }),
        getTree: capture('getTree', { sha: 'base-tree', tree: [file] }),
        getBlob: capture('getBlob', {
          content: Buffer.from(original).toString('base64'),
          encoding: 'base64',
        }),
        createTree: capture('createTree', { sha: 'new-tree' }),
        createCommit: capture('createCommit', { sha: 'new-commit' }),
        updateRef: capture('updateRef', {}),
      },
    },
  };
  return { github, context, calls, pr, file };
}

test('adds one entry without altering other entries, then is idempotent', () => {
  const content = updateContent(original, 'fix: example', link);
  assert.ok(content.includes('- Keep this entry'));
  assert.ok(content.includes(`- fix: example ${link}`));
  assert.equal(updateContent(content, 'fix: example', link), content);
});

test('updates a renamed PR without duplicating its entry', () => {
  const content = updateContent(
    updateContent(original, 'old', link),
    'new',
    link,
  );
  assert.equal(content.split(link).length, 2);
  assert.ok(content.includes(`- new ${link}`));
});

test('creates the next section and treats a multiline title as data', () => {
  const content = updateContent('# Changelog\n', 'title\n## injected', link);
  assert.ok(content.includes('## [next]'));
  assert.ok(content.includes(`- title ## injected ${link}`));
});

test('writes only the changelog and uses the validated PR commit as its parent', async () => {
  const f = fixture();
  assert.equal(await updateChangelog(f), true);
  const tree = f.calls.find(({ name }) => name === 'createTree').args;
  assert.equal(tree.base_tree, 'base-tree');
  assert.equal(tree.tree.length, 1);
  assert.equal(tree.tree[0].path, 'CHANGELOG.md');
  assert.ok(tree.tree[0].content.includes(f.pr.title));
  assert.deepEqual(
    f.calls.find(({ name }) => name === 'createCommit').args.parents,
    ['head-sha'],
  );
  assert.deepEqual(f.calls.find(({ name }) => name === 'updateRef').args, {
    owner: 'fabricjs',
    repo: 'fabric.js',
    ref: 'heads/feature',
    sha: 'new-commit',
    force: false,
  });
});

for (const artifacts of [[], [{ name: 'changelog_artifact', expired: true }]]) {
  test(`ignores missing or expired signals: ${JSON.stringify(artifacts)}`, async () => {
    const f = fixture();
    f.github.paginate = async () => artifacts;
    assert.equal(await updateChangelog(f), false);
    assert.equal(f.calls.length, 0);
  });
}

for (const state of ['closed', 'stale']) {
  test(`does not edit a ${state} PR`, async () => {
    const f = fixture();
    if (state === 'closed') f.pr.state = 'closed';
    else f.pr.head.sha = 'newer-head';
    assert.equal(await updateChangelog(f), false);
    assert.equal(f.calls.length, 0);
  });
}

test('rejects a repository mismatch', async () => {
  const f = fixture();
  f.pr.head.repo.full_name = 'unrelated/repository';
  await assert.rejects(updateChangelog(f), /does not match/);
  assert.equal(f.calls.length, 0);
});

for (const mode of ['120000', '160000', '040000']) {
  test(`rejects nonregular changelog mode ${mode}`, async () => {
    const f = fixture();
    f.file.mode = mode;
    await assert.rejects(updateChangelog(f), /regular file/);
    assert.ok(!f.calls.some(({ name }) => name === 'getBlob'));
  });
}

test('does not create a commit when the changelog already matches', async () => {
  const f = fixture();
  f.github.rest.git.getBlob = async () => ({
    data: {
      content: Buffer.from(updateContent(original, f.pr.title, link)).toString(
        'base64',
      ),
      encoding: 'base64',
    },
  });
  assert.equal(await updateChangelog(f), false);
  assert.ok(!f.calls.some(({ name }) => name === 'createTree'));
});

test('propagates a rejected concurrent branch update without forcing or retrying', async () => {
  const f = fixture();
  let attempts = 0;
  f.github.rest.git.updateRef = async ({ force }) => {
    assert.equal(force, false);
    attempts++;
    throw new Error('Update is not a fast forward');
  };
  await assert.rejects(updateChangelog(f), /not a fast forward/);
  assert.equal(attempts, 1);
});
