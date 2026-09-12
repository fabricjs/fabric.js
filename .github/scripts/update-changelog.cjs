function updateContent(original, title, link) {
  const log = `- ${title.replace(/[\r\n]+/g, ' ')} ${link}`;
  const lines = original.split('\n');
  const previous = lines.findIndex(
    (line) => line.startsWith('- ') && line.endsWith(` ${link}`),
  );
  if (previous !== -1) {
    lines[previous] = log;
    return lines.join('\n');
  }
  const heading = '## [next]';
  let content = original;
  if (!content.includes(heading)) {
    const insertAt = content.indexOf('\n') + 1;
    content = `${content.slice(0, insertAt)}\n${heading}\n\n${content.slice(insertAt)}`;
  }
  const insertAt = content.indexOf('\n', content.indexOf(heading)) + 1;
  return `${content.slice(0, insertAt)}${log}\n${content.slice(insertAt)}`;
}

async function updateChangelog({ github, context }) {
  const run = context.payload.workflow_run;
  const artifacts = await github.paginate(
    github.rest.actions.listWorkflowRunArtifacts,
    { ...context.repo, run_id: run.id },
  );
  if (
    !artifacts.some(
      ({ name, expired }) => name === 'changelog_artifact' && !expired,
    )
  ) {
    return false;
  }
  // The artifact is only a signal; GitHub supplies the target and title.
  const number = run.pull_requests[0]?.number;
  if (!number) throw new Error('Missing pull request metadata');
  const { data: pr } = await github.rest.pulls.get({
    ...context.repo,
    pull_number: number,
  });
  if (pr.state !== 'open' || pr.head.sha !== run.head_sha) return false;
  if (pr.head.repo.full_name !== run.head_repository.full_name) {
    throw new Error('PR does not match the triggering run');
  }
  const target = {
    owner: pr.head.repo.owner.login,
    repo: pr.head.repo.name,
  };
  const { data: commit } = await github.rest.git.getCommit({
    ...target,
    commit_sha: pr.head.sha,
  });
  const { data: tree } = await github.rest.git.getTree({
    ...target,
    tree_sha: commit.tree.sha,
  });
  const file = tree.tree.find(({ path }) => path === 'CHANGELOG.md');
  if (
    !file ||
    file.type !== 'blob' ||
    !['100644', '100755'].includes(file.mode)
  ) {
    throw new Error('CHANGELOG.md must be a regular file');
  }
  const { data: blob } = await github.rest.git.getBlob({
    ...target,
    file_sha: file.sha,
  });
  const original = Buffer.from(blob.content, blob.encoding).toString('utf8');
  const link = `[#${number}](https://github.com/${context.repo.owner}/${context.repo.repo}/pull/${number})`;
  const content = updateContent(original, pr.title, link);
  if (content === original) return false;
  const { data: updatedTree } = await github.rest.git.createTree({
    ...target,
    base_tree: tree.sha,
    tree: [{ path: file.path, mode: file.mode, type: 'blob', content }],
  });
  const { data: updatedCommit } = await github.rest.git.createCommit({
    ...target,
    message: 'update CHANGELOG.md',
    tree: updatedTree.sha,
    parents: [pr.head.sha],
  });
  // Refuse a non-fast-forward update if the contributor pushed meanwhile.
  await github.rest.git.updateRef({
    ...target,
    ref: `heads/${pr.head.ref}`,
    sha: updatedCommit.sha,
    force: false,
  });
  return true;
}

module.exports = { updateContent, updateChangelog };
