module.exports = async ({ github, context, core }) => {
  const fs = require('node:fs');
  const path = require('node:path');
  const event = context.payload.workflow_run;
  const { data: run } = await github.rest.actions.getWorkflowRun({
    ...context.repo,
    run_id: event.id,
  });
  if (run.status !== 'completed' || run.run_attempt !== event.run_attempt)
    return;
  let pr;
  if (event.event === 'pull_request') {
    ({ data: pr } = await github.rest.pulls.get({
      ...context.repo,
      pull_number: Number(process.env.PR_NUMBER),
    }));
    if (
      pr.state !== 'open' ||
      pr.head.sha !== event.head_sha ||
      pr.head.ref !== run.head_branch ||
      pr.head.ref.includes('${') ||
      pr.head.repo?.id !== run.head_repository.id ||
      pr.base.repo.id !== context.payload.repository.id ||
      pr.base.ref !== 'master'
    )
      return;
  }
  if (event.event === 'push') {
    const { data: branch } = await github.rest.repos.getBranch({
      ...context.repo,
      branch: 'master',
    });
    if (branch.commit.sha !== event.head_sha) return;
  }
  const root = process.env.GITHUB_WORKSPACE;
  const temp = process.env.RUNNER_TEMP;
  const settings = {
    'project.settings': path.join(root, 'trusted/sonar-project.properties'),
    'sonar.host.url': 'https://sonarcloud.io',
    'sonar.scm.revision': event.head_sha,
    'sonar.typescript.tsconfigPaths': path.join(
      root,
      'trusted/.github/sonar-tsconfig.json',
    ),
    'sonar.working.directory': path.join(temp, 'sonar-work'),
    'sonar.javascript.lcov.reportPaths': path.join(
      temp,
      'sonar-coverage/lcov.info',
    ),
    ...(pr
      ? {
          'sonar.pullrequest.key': String(pr.number),
          'sonar.pullrequest.base': pr.base.ref,
          'sonar.pullrequest.branch': pr.head.ref,
        }
      : { 'sonar.branch.name': 'master' }),
  };
  const coverage = fs.lstatSync(path.join(temp, 'sonar-coverage/lcov.info'));
  if (!coverage.isFile() || coverage.size > 50000000)
    throw new Error('Invalid coverage file');
  core.setOutput('parameters', JSON.stringify(settings));
};
