const fs = require('node:fs');

const repository = ({ owner, repo }) => `${owner}/${repo}`;
const shaPattern = /^[a-f0-9]{40}$/;

// workflow_run.pull_requests can be empty for forks. Resolve against GitHub's
// current PR records, never a PR number, repository, or branch from an artifact.
async function resolveRun({
  github,
  context,
  workflow,
  branches = ['master'],
}) {
  const { data: run } = await github.rest.actions.getWorkflowRun({
    ...context.repo,
    run_id: context.payload.workflow_run.id,
  });
  if (
    run.repository?.full_name !== repository(context.repo) ||
    run.path !== `.github/workflows/${workflow}` ||
    !shaPattern.test(run.head_sha)
  )
    throw new Error('Unexpected workflow run');
  if (
    run.status !== 'completed' ||
    run.conclusion === 'cancelled' ||
    !run.head_repository?.full_name
  )
    return null;
  if (run.event === 'push') {
    if (
      run.head_repository.full_name !== repository(context.repo) ||
      run.head_branch !== 'master'
    )
      return null;
    const { data: branch } = await github.rest.repos.getBranch({
      ...context.repo,
      branch: 'master',
    });
    return branch.commit.sha === run.head_sha ? { run, pr: null } : null;
  }
  if (run.event !== 'pull_request') return null;
  const prs = await github.paginate(github.rest.pulls.list, {
    ...context.repo,
    state: 'open',
    per_page: 100,
  });
  const matches = prs.filter(
    (pr) =>
      pr.base.repo.full_name === repository(context.repo) &&
      branches.includes(pr.base.ref) &&
      pr.head.repo?.full_name === run.head_repository.full_name &&
      pr.head.ref === run.head_branch &&
      pr.head.sha === run.head_sha,
  );
  if (matches.length > 1)
    throw new Error('Ambiguous pull request for workflow run');
  return matches.length === 1 ? { run, pr: matches[0] } : null;
}

async function artifact({
  github,
  context,
  run,
  name,
  maxBytes = 20 * 1024 * 1024,
}) {
  const artifacts = await github.paginate(
    github.rest.actions.listWorkflowRunArtifacts,
    {
      ...context.repo,
      run_id: run.id,
      per_page: 100,
    },
  );
  const matches = artifacts.filter((a) => a.name === name && !a.expired);
  if (!matches.length) return null;
  if (matches.length !== 1 || matches[0].size_in_bytes > maxBytes)
    throw new Error(`Invalid ${name} artifact`);
  return matches[0];
}

function readReport(file, maxBytes) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.size > maxBytes)
    throw new Error('Invalid report file');
  return fs.readFileSync(file, 'utf8');
}

function escapeText(value) {
  return value.replace(/[&<>|`@\r\n]/g, (char) => `&#${char.charCodeAt(0)};`);
}

function buildStatsReport(original, modified) {
  function validate(data) {
    if (
      !data ||
      !data.size ||
      Array.isArray(data.size) ||
      typeof data.size !== 'object'
    )
      throw new Error('Invalid build statistics');
    const entries = Object.entries(data.size);
    if (!entries.length || entries.length > 100)
      throw new Error('Invalid number of build entries');
    for (const [name, stats] of entries) {
      if (name.length > 200 || !stats || typeof stats !== 'object')
        throw new Error('Invalid build entry');
      for (const [key, value] of Object.entries(stats)) {
        if (
          !['generated', 'minified', 'bundled'].includes(key) ||
          !Number.isSafeInteger(value) ||
          value < 0
        )
          throw new Error('Invalid build size');
      }
    }
    return entries;
  }
  validate(original);
  const rows = validate(modified).map(([name, stats]) => {
    const base = Object.hasOwn(original.size, name) ? original.size[name] : {};
    const cells = ['generated', 'minified'].map((key) => {
      if (stats[key] === undefined) return '—';
      const difference = (stats[key] - (base[key] || 0)) / 1024;
      return `${(stats[key] / 1024).toFixed(3)} (**${difference > 0 ? '+' : ''}${difference.toFixed(difference === 0 ? 0 : 3)}**)`;
    });
    return `| ${escapeText(name)} | ${cells.join(' | ')} |`;
  });
  return [
    '**Build Stats**',
    '',
    '| entrypoint / KiB (diff) | generated | minified |',
    '| --- | --- | --- |',
    ...rows,
  ].join('\n');
}

async function comment({ github, context, pr, marker, body }) {
  // Recheck immediately before writing so an old run doesn't overwrite a newer report.
  const { data: current } = await github.rest.pulls.get({
    ...context.repo,
    pull_number: pr.number,
  });
  if (current.state !== 'open' || current.head.sha !== pr.head.sha)
    return false;
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo,
    issue_number: pr.number,
    per_page: 100,
  });
  const existing = comments.find(
    (c) => c.user.login === 'github-actions[bot]' && c.body.startsWith(marker),
  );
  const content = `${marker}\n${body}`;
  if (content.length > 60000) throw new Error('Report is too large');
  if (existing)
    await github.rest.issues.updateComment({
      ...context.repo,
      comment_id: existing.id,
      body: content,
    });
  else
    await github.rest.issues.createComment({
      ...context.repo,
      issue_number: pr.number,
      body: content,
    });
  return true;
}

module.exports = {
  resolveRun,
  artifact,
  readReport,
  escapeText,
  buildStatsReport,
  comment,
};
