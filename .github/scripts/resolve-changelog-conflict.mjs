import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function git(cwd, args, { env = {}, input, statuses = [0] } = {}) {
  const result = spawnSync('git', args, {
    cwd,
    input,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
    env: {
      ...process.env,
      GIT_CONFIG_NOSYSTEM: '1',
      GIT_CONFIG_GLOBAL: '/dev/null',
      GIT_ATTR_NOSYSTEM: '1',
      GIT_TERMINAL_PROMPT: '0',
      ...env,
    },
  });
  if (result.error) {
    throw result.error;
  }
  if (!statuses.includes(result.status)) {
    throw new Error(`git ${args[0]} failed: ${result.stderr.trim()}`);
  }
  return result;
}

function parseNext(content) {
  const headers = [...content.matchAll(/^## \[next\]\n/gm)];
  if (headers.length !== 1 || /\r/.test(content)) {
    return null;
  }
  const start = headers[0].index + headers[0][0].length;
  const nextHeader = /^## /m.exec(content.slice(start));
  const end = nextHeader ? start + nextHeader.index : content.length;
  const entries = content
    .slice(start, end)
    .split('\n')
    .filter((line) => line.trim());
  if (entries.some((line) => !/^- \S/.test(line))) {
    return null;
  }
  return {
    prefix: content.slice(0, start),
    entries,
    suffix: content.slice(end),
  };
}

function addedEntries(original, updated) {
  let index = 0;
  const added = [];
  for (const entry of updated) {
    if (entry === original[index]) {
      index++;
    } else if (original.includes(entry)) {
      return null;
    } else {
      added.push(entry);
    }
  }
  return index === original.length ? added : null;
}

export function mergeChangelogAdditions(ancestor, head, base) {
  const versions = [ancestor, head, base].map(parseNext);
  if (
    versions.some((version) => !version) ||
    versions.some(
      (version) =>
        version.prefix !== versions[0].prefix ||
        version.suffix !== versions[0].suffix,
    )
  ) {
    return null;
  }
  const [original, current, upstream] = versions;
  const headAdded = addedEntries(original.entries, current.entries);
  const baseAdded = addedEntries(original.entries, upstream.entries);
  if (!headAdded?.length || !baseAdded?.length) {
    return null;
  }
  const additions = [...new Set([...headAdded, ...baseAdded])];
  const links = new Map();
  for (const entry of additions) {
    const link = entry.match(
      /\[#\d+\]\(https:\/\/github\.com\/fabricjs\/fabric\.js\/pull\/\d+\)/,
    )?.[0];
    if (link && links.has(link) && links.get(link) !== entry) {
      return null;
    }
    if (link) {
      links.set(link, entry);
    }
  }
  return `${original.prefix}\n${[...additions, ...original.entries].join('\n')}\n${original.suffix ? '\n' + original.suffix : ''}`;
}

export function createChangelogMerge({ cwd, head, base, number, env = {} }) {
  if (
    git(cwd, ['rev-parse', '--is-bare-repository']).stdout.trim() !== 'true'
  ) {
    throw new Error('The resolver requires a temporary bare repository');
  }
  // Inspect ordinary conflicts even though the repo sets merge=union. Override
  // PR attributes so custom merge drivers cannot run in the privileged job.
  writeFileSync(join(cwd, 'info/attributes'), '* merge=text\n');
  const result = git(
    cwd,
    [
      'merge-tree',
      '--write-tree',
      '--name-only',
      '--no-messages',
      '-z',
      head,
      base,
    ],
    { env, statuses: [0, 1] },
  );
  if (result.status === 0) {
    return { status: 'skipped', reason: 'The branches merge cleanly' };
  }
  const [tree, ...paths] = result.stdout.split('\0').filter(Boolean);
  if (paths.length !== 1 || paths[0] !== 'CHANGELOG.md') {
    return {
      status: 'skipped',
      reason: 'Conflicts extend beyond CHANGELOG.md',
    };
  }
  const ancestors = git(cwd, ['merge-base', '--all', head, base], { env })
    .stdout.trim()
    .split('\n');
  if (ancestors.length !== 1) {
    return { status: 'skipped', reason: 'Multiple merge bases require review' };
  }
  for (const ref of [ancestors[0], head, base]) {
    if (
      !git(cwd, ['ls-tree', ref, '--', 'CHANGELOG.md'], {
        env,
      }).stdout.startsWith('100644 blob ')
    ) {
      return {
        status: 'skipped',
        reason: 'CHANGELOG.md must be a regular file',
      };
    }
  }
  const contents = [ancestors[0], head, base].map(
    (ref) => git(cwd, ['show', `${ref}:CHANGELOG.md`], { env }).stdout,
  );
  const merged = mergeChangelogAdditions(...contents);
  if (!merged) {
    return {
      status: 'skipped',
      reason: 'The changelog conflict is not limited to additions under [next]',
    };
  }
  const blob = git(cwd, ['hash-object', '-w', '--stdin'], {
    env,
    input: merged,
  }).stdout.trim();
  const entries = git(cwd, ['ls-tree', '-z', tree], { env })
    .stdout.split('\0')
    .filter(Boolean);
  const updated = entries.map((entry) =>
    entry.endsWith('\tCHANGELOG.md')
      ? `100644 blob ${blob}\tCHANGELOG.md`
      : entry,
  );
  const mergedTree = git(cwd, ['mktree', '-z'], {
    env,
    input: updated.join('\0') + '\0',
  }).stdout.trim();
  const commit = git(cwd, ['commit-tree', mergedTree, '-p', head, '-p', base], {
    input: `Merge master into PR #${number} and resolve changelog additions\n`,
    env: {
      ...env,
      GIT_AUTHOR_NAME: 'github-actions[bot]',
      GIT_AUTHOR_EMAIL: '41898282+github-actions[bot]@users.noreply.github.com',
      GIT_COMMITTER_NAME: 'github-actions[bot]',
      GIT_COMMITTER_EMAIL:
        '41898282+github-actions[bot]@users.noreply.github.com',
    },
  }).stdout.trim();
  return { status: 'resolved', commit };
}

export function pushChangelogMerge({ cwd, branch, head, commit, env = {} }) {
  const ref = `refs/heads/${branch}`;
  git(cwd, ['check-ref-format', ref]);
  // The new commit must extend the reviewed head. The lease is an atomic check
  // that the branch still points there, including after a concurrent rebase.
  const parents = git(cwd, ['show', '-s', '--format=%P', commit], { env })
    .stdout.trim()
    .split(' ');
  if (parents.length !== 2 || parents[0] !== head) {
    throw new Error('The resolution must extend the reviewed PR head');
  }
  git(
    cwd,
    ['push', `--force-with-lease=${ref}:${head}`, 'origin', `${commit}:${ref}`],
    { env },
  );
}

export async function resolveChangelogConflict({ github, context, core }) {
  const { owner, repo } = context.repo;
  const number = context.payload.pull_request.number;
  const params = { owner, repo, pull_number: number };
  const skip = (reason) => core.notice(`PR #${number}: ${reason}`);
  let { data: pr } = await github.rest.pulls.get(params);
  if (
    pr.state !== 'open' ||
    pr.draft ||
    pr.base.ref !== 'master' ||
    pr.head.repo?.full_name !== `${owner}/${repo}` ||
    pr.head.ref === 'master'
  ) {
    return skip(
      'Only open, non-draft PRs from this repository into master are supported',
    );
  }
  const { data: review } = await github.rest.pulls.getReview({
    ...params,
    review_id: context.payload.review.id,
  });
  if (
    review.state !== 'APPROVED' ||
    review.commit_id !== pr.head.sha ||
    review.user?.type !== 'User'
  ) {
    return skip('The approval must be a current human review of the PR head');
  }
  const { data: access } =
    await github.rest.repos.getCollaboratorPermissionLevel({
      owner,
      repo,
      username: review.user.login,
    });
  if (!['write', 'maintain', 'admin'].includes(access.permission)) {
    return skip('The approving reviewer must have write access');
  }
  for (let attempt = 0; pr.mergeable === null && attempt < 3; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    ({ data: pr } = await github.rest.pulls.get(params));
  }
  if (pr.mergeable !== false || pr.head.sha !== review.commit_id) {
    return skip('No confirmed conflict on the approved PR head');
  }
  const cwd = mkdtempSync(join(tmpdir(), 'fabric-changelog-conflict-'));
  const env = {
    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader',
    GIT_CONFIG_VALUE_0: `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${process.env.CHANGELOG_TOKEN}`).toString('base64')}`,
  };
  try {
    git(cwd, ['init', '--bare']);
    git(cwd, [
      'remote',
      'add',
      'origin',
      `https://github.com/${owner}/${repo}.git`,
    ]);
    git(
      cwd,
      [
        'fetch',
        '--no-tags',
        'origin',
        'refs/heads/master:refs/heads/base',
        `refs/pull/${number}/head:refs/heads/head`,
      ],
      { env },
    );
    const head = git(cwd, ['rev-parse', 'refs/heads/head']).stdout.trim();
    const base = git(cwd, ['rev-parse', 'refs/heads/base']).stdout.trim();
    if (head !== pr.head.sha || base !== pr.base.sha) {
      return skip('A branch changed while fetching; approve again to retry');
    }
    const resolution = createChangelogMerge({ cwd, head, base, number, env });
    if (resolution.status === 'skipped') {
      return skip(resolution.reason);
    }
    const { data: latest } = await github.rest.pulls.get(params);
    const { data: latestReview } = await github.rest.pulls.getReview({
      ...params,
      review_id: review.id,
    });
    if (
      latest.state !== 'open' ||
      latest.draft ||
      latest.head.sha !== head ||
      latest.base.sha !== base ||
      latest.base.ref !== 'master' ||
      latest.head.ref !== pr.head.ref ||
      latest.head.repo?.full_name !== `${owner}/${repo}` ||
      latestReview.state !== 'APPROVED'
    ) {
      return skip('The PR or approval changed while preparing the resolution');
    }
    pushChangelogMerge({
      cwd,
      branch: pr.head.ref,
      head,
      commit: resolution.commit,
      env,
    });
    core.notice(
      `PR #${number}: resolved changelog additions as github-actions[bot]; review the update and approve again if required`,
    );
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
}
