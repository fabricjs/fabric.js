const {
  resolveRun,
  artifact,
  comment,
  escapeText,
} = require('./workflow-reports.cjs');

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
  const resolved = await resolveRun({
    github,
    context,
    workflow: 'changelog_check_and_create.yml',
    branches: ['master', '6.x'],
  });
  if (!resolved?.pr) return false;
  const { run, pr } = resolved;
  if (!(await artifact({ github, context, run, name: 'changelog_artifact' })))
    return false;
  const number = pr.number;
  if (pr.head.repo.full_name !== pr.base.repo.full_name) {
    const link = `[#${number}](https://github.com/${context.repo.owner}/${context.repo.repo}/pull/${number})`;
    return comment({
      github,
      context,
      pr,
      marker: '<!-- changelog-help -->',
      body: `Please add or update this entry under **[next]** in CHANGELOG.md:\n\n<pre>${escapeText(`- ${pr.title} ${link}`)}</pre>\n\nThe repository token cannot push to your fork.`,
    });
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
  if (blob.encoding !== 'base64' || blob.size > 2 * 1024 * 1024)
    throw new Error('Invalid changelog blob');
  const original = Buffer.from(blob.content, 'base64').toString('utf8');
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
