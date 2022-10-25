import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';
const minFile = 'fabric.min.js';

function parseJSONFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

function getSign(n) {
  switch (Math.sign(n)) {
    case 0:
      return '';
    case 1:
      return '+';
    case -1:
      return '-';
  }
}

const REQUESTED_COMMENTS_PER_PAGE = 20;

const COMMENT_MARKER = '<!-- BUILD STATS COMMENT -->';

export async function findCommentId(github, context) {
  let page = 0;
  let response;
  do {
    response = await github.issues.listComments({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      per_page: REQUESTED_COMMENTS_PER_PAGE,
      page: page,
      sort: 'updated',
      direction: 'desc',
    });
    const found = response.data.find(
      (comment) => !!comment.user && comment.body.startsWith(COMMENT_MARKER)
    )?.id;
    if (found) {
      return found;
    }
    page++;
  } while (response.data.length === REQUESTED_COMMENTS_PER_PAGE);
}

export async function run({ github, context, a, b }) {
  a = path.basename(a, '.json');
  b = path.basename(b, '.json');
  const {
    repo: { owner, repo },
    payload: {
      pull_request: { base, head },
    },
  } = context;
  const changedFiles = (
    await github.rest.repos.compareCommits({
      base: base.sha,
      head: head.sha,
      owner,
      repo,
    })
  ).data.files
    .map(({ filename }) => filename)
    .filter((file) => file.startsWith('src'));

  const stats = {
    a: parseJSONFile(`cli_output/${a}.json`),
    b: parseJSONFile(`cli_output/${b}.json`),
  };
  const size = {
    a: parseJSONFile(`cli_output/${a}_size.json`)[minFile],
    b: parseJSONFile(`cli_output/${b}_size.json`)[minFile],
    diff: {},
  };
  for (const key in size.a) {
    size.diff[key] = size.b[key] - size.a[key];
  }
  const files = {};
  stats.b.modules.forEach((b) => {
    const file = b.id.replace(/^(\\|\/)/, '');
    if (!changedFiles.includes(file)) {
      return;
    }
    const a = stats.a.modules.find((a) => a.id === b.id);
    const aOut = { sizeBefore: a?.origSize || 0, sizeAfter: a?.size || 0 };
    const bOut = { sizeBefore: b.origSize, sizeAfter: b.size };
    files[file] = {
      a: aOut,
      b: bOut,
      diff: {
        sizeBefore: bOut.sizeBefore - aOut.sizeBefore,
        sizeAfter: bOut.sizeAfter - aOut.sizeAfter,
      },
    };
  });

  function printSize(key) {
    return `${size.b[key] / 1024} (${getSign(size.diff[key])}${
      size.diff[key]
    })`;
  }

  const table = [
    ['file', 'bundled', 'minified', 'gzipped'],
    ['---', '---', '---', '---'],
    [
      'build',
      printSize('bundled'),
      printSize('minified'),
      printSize('gzipped'),
    ],
    ..._.map(files, ({ b, diff }, key) => {
      return [
        key,
        `${b.sizeBefore} (${getSign(diff.sizeBefore)}${diff.sizeBefore})`,
        `${b.sizeAfter} (${getSign(diff.sizeAfter)}${diff.sizeAfter})`,
      ];
    }),
  ];
  const body = `${COMMENT_MARKER}\n**Build Stats**\n${table
    .map((row) => ['', ...row, ''].join(' | '))
    .join('\n')}`;
  const commentId = findCommentId(github, context);
  commentId
    ? github.rest.issues.updateComment({
        repo,
        owner,
        comment_id: commentId,
        body,
      })
    : github.rest.issues.createComment({
        repo,
        owner,
        issue_number: context.payload.pull_request.number,
        body,
      });
  return {
    size,
    files,
    changedFiles,
    stats,
    table,
    body,
  };
}
