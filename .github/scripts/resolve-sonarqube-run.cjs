module.exports = async ({ github, context, core }) => {
  const { owner, repo } = context.repo;
  const event = context.payload.workflow_run;
  const { data: run } = await github.rest.actions.getWorkflowRun({
    owner,
    repo,
    run_id: event.id,
  });
  if (
    run.path !== '.github/workflows/tests.yml' ||
    run.repository.id !== context.payload.repository.id ||
    run.status !== 'completed' ||
    run.conclusion === 'cancelled' ||
    run.event !== event.event ||
    run.head_sha !== event.head_sha ||
    run.run_attempt !== event.run_attempt
  ) {
    throw new Error('Unexpected test run metadata');
  }
  if (run.event === 'push') {
    const { data: branch } = await github.rest.repos.getBranch({
      owner,
      repo,
      branch: 'master',
    });
    if (
      run.head_repository.id === run.repository.id &&
      run.head_branch === 'master' &&
      run.head_sha === branch.commit.sha
    ) {
      core.setOutput('sha', run.head_sha);
    }
    return;
  }
  // Fork runs can have no pull_requests or commit-to-PR association.
  const prs = await github.paginate(github.rest.pulls.list, {
    owner,
    repo,
    state: 'open',
    head: `${run.head_repository.owner.login}:${run.head_branch}`,
    per_page: 100,
  });
  const matches = prs.filter(
    (pr) =>
      pr.state === 'open' &&
      pr.base.repo.id === run.repository.id &&
      pr.base.ref === 'master' &&
      pr.head.repo?.id === run.head_repository.id &&
      pr.head.ref === run.head_branch &&
      pr.head.sha === run.head_sha &&
      Date.parse(pr.created_at) <= Date.parse(run.created_at) &&
      (!run.pull_requests.length ||
        run.pull_requests.some((origin) => origin.number === pr.number)),
  );
  const runs = await github.paginate(github.rest.actions.listWorkflowRuns, {
    owner,
    repo,
    workflow_id: run.workflow_id,
    event: 'pull_request',
    head_sha: run.head_sha,
    per_page: 100,
  });
  if (
    matches.length !== 1 ||
    runs.some(
      (other) =>
        other.id > run.id &&
        other.head_repository?.id === run.head_repository.id &&
        other.head_branch === run.head_branch,
    )
  ) {
    core.info('Skipping stale, closed, mismatched, or ambiguous PR run');
    return;
  }
  core.setOutput('pr', matches[0].number);
  core.setOutput('sha', run.head_sha);
};
