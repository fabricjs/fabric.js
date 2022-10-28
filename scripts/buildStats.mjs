import _ from 'lodash';

const REQUESTED_COMMENTS_PER_PAGE = 20;

const COMMENT_MARKER = '<!-- BUILD STATS COMMENT -->';

const MAX_COMMENT_CHARS = 65536;

const INACCURATE_COMMENT =
  '\n*inaccurate, see [link](https://github.com/doesdev/rollup-plugin-analyzer#why-is-the-reported-size-not-the-same-as-the-file-on-disk)';

function printSize(a, b) {
  const diff = b - a;
  return `${b} (${Math.sign(diff) > 0 ? '+' : ''}${diff})`;
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

  const files = {};
  b.stats.modules.forEach((b) => {
    const file = b.id.replace(/^(\\|\/)/, '');
    if (!changedFiles.includes(file)) {
      return;
    }
    const aOut = {
      origSize: 0,
      size: 0,
      ...(a.stats.modules.find(({ id }) => id === b.id) || {}),
    };
    files[file] = {
      a: { sizeBefore: aOut.origSize, sizeAfter: aOut.size },
      b: { sizeBefore: b.origSize, sizeAfter: b.size },
    };
  });

  const table = [
    ['file / KB (diff)', 'bundled', 'reduced*', 'minified', 'gzipped'],
    ['---', '---', '---', '---', '---'],
    ..._.map(b.size, (_b, file) => {
      const _a = {
        bundled: 0,
        minified: 0,
        gzipped: 0,
        ...(a.size[file] || {}),
      };
      return [
        file,
        printSizeByte(_a.bundled, _b.bundled),
        '',
        printSizeByte(_a.minified, _b.minified),
        printSizeByte(_a.gzipped, _b.gzipped),
      ];
    }),
    ..._.map(files, ({ a, b }, key) => {
      return [
        key,
        printSizeByte(a.sizeBefore, b.sizeBefore),
        printSizeByte(a.sizeAfter, b.sizeAfter),
      ];
    }),
  ];

  const body =
    [
      COMMENT_MARKER,
      '**Build Stats**',
      '',
      ...table.map((row) => ['', ...row, ''].join(' | ')),
      '',
    ]
      .join('\n')
      .slice(0, MAX_COMMENT_CHARS - INACCURATE_COMMENT.length) +
    INACCURATE_COMMENT;

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
