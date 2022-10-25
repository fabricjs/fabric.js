import fs from 'node:fs';
import path from 'node:path';
import _ from 'lodash';

const REQUESTED_COMMENTS_PER_PAGE = 20;

const COMMENT_MARKER = '<!-- BUILD STATS COMMENT -->';

const MAX_COMMENT_CHARS = 65536;

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

function printSize(a, b) {
  const diff = b - a;
  return `${b} (${getSign(diff)}${diff})`;
}

function printSizeByte(a, b) {
  return printSize(Math.round(a / 1024), Math.round(b / 1024));
}

export async function findCommentId(github, context) {
  let page = 0;
  let response;
  do {
    response = await github.rest.issues.listComments({
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
    a: parseJSONFile(`cli_output/${a}_size.json`),
    b: parseJSONFile(`cli_output/${b}_size.json`),
  };
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
    };
  });

  const table = [
    ['file / KB', 'bundled', 'minified', 'gzipped'],
    ['---', '---', '---', '---'],
    ..._.map(size.b, (b, file) => {
      const a = {
        bundled: 0,
        minified: 0,
        gzipped: 0,
        ...(size.a[file] || {}),
      };
      return [
        file,
        printSizeByte(a.bundled, b.bundled),
        printSizeByte(a.minified, b.minified),
        printSizeByte(a.gzipped, b.gzipped),
      ];
    }),
    ..._.map(files, ({ a, b }, key) => {
      return [
        key,
        printSize(a.sizeBefore, b.sizeBefore),
        printSize(a.sizeAfter, b.sizeAfter),
      ];
    }),
  ];

  const body = `${COMMENT_MARKER}\n**Build Stats**\n${table
    .map((row) => ['', ...row, ''].join(' | '))
    .join('\n')}`.slice(0, MAX_COMMENT_CHARS + 1);

  const commentId = await findCommentId(github, context);

  await (commentId
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
      }));
}
