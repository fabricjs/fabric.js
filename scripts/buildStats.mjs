const REQUESTED_COMMENTS_PER_PAGE = 20;

const COMMENT_MARKER = '<!-- BUILD STATS COMMENT -->';

const MAX_COMMENT_CHARS = 65536;

function printSize(a, b) {
  const diff = b - a;
  return `${b.toFixed(3)} (**${Math.sign(diff) > 0 ? '+' : ''}${diff.toFixed(
    diff !== 0 ? 3 : 0,
  )}**)`;
}

function printSizeKByte(a, b) {
  return printSize(a / 1024, b / 1024);
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
      (comment) => !!comment.user && comment.body.startsWith(COMMENT_MARKER),
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
  } = context;

  const table = [
    ['file / KB (diff)', 'bundled', 'minified', 'gzipped'],
    ['---', '---', '---', '---'],
    ...Object.entries(b.size).map(([file, _b]) => {
      const _a = {
        bundled: 0,
        minified: 0,
        gzipped: 0,
        ...(a.size[file] || {}),
      };
      return [
        file,
        printSizeKByte(_a.bundled, _b.bundled),
        printSizeKByte(_a.minified, _b.minified),
        printSizeKByte(_a.gzipped, _b.gzipped),
      ];
    }),
  ];

  const body = [
    COMMENT_MARKER,
    '**Build Stats**',
    '',
    ...table.map((row) => ['', ...row, ''].join(' | ')),
    '',
  ]
    .join('\n')
    .slice(0, MAX_COMMENT_CHARS);

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

export async function run_simple({ github, context, a, b }) {
  const {
    repo: { owner, repo },
  } = context;

  const table = [
    ['file / KB (diff)', 'bundled', 'minified'],
    ['---', '---', '---'],
    ...Object.entries(b.size).map(([file, _b]) => {
      const _a = {
        bundled: 0,
        minified: 0,
        ...(a.size[file] || {}),
      };
      return [
        file,
        printSizeKByte(_a.bundled, _b.bundled),
        printSizeKByte(_a.minified, _b.minified),
      ];
    }),
  ];

  const body = [
    COMMENT_MARKER,
    '**Build Stats**',
    '',
    ...table.map((row) => ['', ...row, ''].join(' | ')),
    '',
  ]
    .join('\n')
    .slice(0, MAX_COMMENT_CHARS);

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
