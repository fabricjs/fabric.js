const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const workflow = fs.readFileSync(
  path.join(__dirname, '../workflows/sonarqube_analysis.yml'),
  'utf8',
);
const scripts = [
  ...workflow.matchAll(/          script: \|\n((?:            .*\n|\n)+)/g),
].map((match) => {
  const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
  return new AsyncFunction(
    'github',
    'context',
    'core',
    'require',
    match[1].replace(/^            /gm, ''),
  );
});

function fixture() {
  const repository = { id: 1 };
  const fork = { id: 2, owner: { login: 'contributor' } };
  const run = {
    id: 10,
    path: '.github/workflows/tests.yml',
    repository,
    event: 'pull_request',
    status: 'completed',
    conclusion: 'failure',
    head_repository: fork,
    head_branch: 'feature',
    head_sha: 'a'.repeat(40),
    run_attempt: 1,
    workflow_id: 3,
    pull_requests: [],
    created_at: '2026-10-03T10:01:00Z',
  };
  const pr = {
    number: 42,
    state: 'open',
    created_at: '2026-10-03T10:00:00Z',
    base: { repo: repository, ref: 'master' },
    head: { repo: fork, ref: 'feature', sha: run.head_sha },
  };
  const context = {
    repo: { owner: 'fabricjs', repo: 'fabric.js' },
    payload: { repository, workflow_run: { ...run } },
  };
  const prs = [pr],
    runs = [run],
    outputs = {};
  const github = {
    rest: {
      actions: {
        getWorkflowRun: async () => ({ data: run }),
        listWorkflowRuns() {},
      },
      pulls: { list() {}, get: async () => ({ data: pr }) },
      repos: {
        getBranch: async () => ({ data: { commit: { sha: run.head_sha } } }),
      },
    },
    paginate: async (method, args) => {
      assert.equal(args.owner, 'fabricjs');
      assert.equal(args.repo, 'fabric.js');
      if (method === github.rest.pulls.list) {
        assert.equal(args.head, 'contributor:feature');
        return prs;
      }
      assert.equal(args.head_sha, run.head_sha);
      return runs;
    },
  };
  const core = { info() {}, setOutput: (key, value) => (outputs[key] = value) };
  return { run, pr, prs, runs, outputs, context, github, core };
}

const execute = (index, f) =>
  scripts[index](f.github, f.context, f.core, require);

test('resolve fork and same-repository PRs with empty pull_requests', async () => {
  for (const sameRepository of [false, true]) {
    const f = fixture();
    if (sameRepository) f.run.head_repository.id = 1;
    await execute(0, f);
    assert.deepEqual(f.outputs, { pr: 42, sha: f.run.head_sha });
  }
});

test('reject stale, mismatched, closed, ambiguous, and superseded PRs', async () => {
  for (const modify of [
    (f) => (f.pr.head.sha = 'b'.repeat(40)),
    (f) => (f.pr.head.repo = { id: 99 }),
    (f) => (f.pr.base.ref = '6.x'),
    (f) => (f.pr.state = 'closed'),
    (f) => (f.pr.created_at = '2026-10-03T10:02:00Z'),
    (f) => f.run.pull_requests.push({ number: 99 }),
    (f) => f.prs.push({ ...f.pr, number: 43 }),
    (f) => f.runs.push({ ...f.run, id: 11 }),
  ]) {
    const f = fixture();
    modify(f);
    await execute(0, f);
    assert.deepEqual(f.outputs, {});
  }
  for (const modify of [
    (f) => (f.run.path = '.github/workflows/other.yml'),
    (f) => (f.run.run_attempt = 2),
    (f) => (f.run.status = 'in_progress'),
  ]) {
    const f = fixture();
    modify(f);
    await assert.rejects(execute(0, f), /Unexpected test run/);
  }
});

test('only scan the current master push', async () => {
  const f = fixture();
  f.run.event = f.context.payload.workflow_run.event = 'push';
  f.run.head_repository.id = 1;
  f.run.head_branch = 'master';
  await execute(0, f);
  assert.equal(f.outputs.sha, f.run.head_sha);
  f.github.rest.repos.getBranch = async () => ({
    data: { commit: { sha: 'b'.repeat(40) } },
  });
  delete f.outputs.sha;
  await execute(0, f);
  assert.deepEqual(f.outputs, {});
});

test('skip a PR that changed before scanner preparation', async () => {
  const f = fixture();
  f.pr.head.sha = 'b'.repeat(40);
  await execute(1, f);
  assert.equal(f.outputs.ready, undefined);
});

test('replace PR scanner settings without following symlinks', async () => {
  const f = fixture();
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fabric-sonar-'));
  const cwd = process.cwd();
  const oldEnv = {
    GITHUB_WORKSPACE: process.env.GITHUB_WORKSPACE,
    RUNNER_TEMP: process.env.RUNNER_TEMP,
    PR_NUMBER: process.env.PR_NUMBER,
  };
  try {
    for (const dir of ['source', 'trusted', 'sonar-coverage'])
      fs.mkdirSync(path.join(root, dir));
    fs.writeFileSync(
      path.join(root, 'trusted/sonar-project.properties'),
      'sonar.projectKey=fabricjs_fabric.js\n',
    );
    const sentinel = path.join(root, 'sentinel');
    fs.writeFileSync(sentinel, 'sonar.nodejs.executable=malicious-script\n');
    fs.symlinkSync(
      sentinel,
      path.join(root, 'source/sonar-project.properties'),
    );
    fs.writeFileSync(path.join(root, 'sonar-coverage/lcov.info'), 'TN:\n');
    process.chdir(root);
    process.env.GITHUB_WORKSPACE = process.env.RUNNER_TEMP = root;
    process.env.PR_NUMBER = '42';
    f.pr.head.ref = f.run.head_branch = 'feature";sonar.host.url=evil';
    await execute(1, f);
    const config = fs.readFileSync(
      path.join(root, 'source/sonar-project.properties'),
      'utf8',
    );
    assert.ok(config.includes('sonar.host.url=https\\://sonarcloud.io'));
    assert.ok(
      config.includes(
        `sonar.typescript.tsconfigPaths=${root}/trusted/.github/sonar-tsconfig.json`,
      ),
    );
    assert.ok(
      config.includes(
        'sonar.pullrequest.branch=feature";sonar.host.url\\=evil',
      ),
    );
    assert.ok(!config.includes('malicious-script'));
    assert.ok(fs.readFileSync(sentinel, 'utf8').includes('malicious-script'));
    assert.equal(f.outputs.ready, 'true');
    assert.equal(
      fs
        .lstatSync(path.join(root, 'source/sonar-project.properties'))
        .isSymbolicLink(),
      false,
    );
    fs.unlinkSync(path.join(root, 'sonar-coverage/lcov.info'));
    fs.symlinkSync(sentinel, path.join(root, 'sonar-coverage/lcov.info'));
    await assert.rejects(execute(1, f), /Invalid coverage file/);
  } finally {
    process.chdir(cwd);
    for (const [key, value] of Object.entries(oldEnv)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    fs.rmSync(root, { recursive: true });
  }
});
