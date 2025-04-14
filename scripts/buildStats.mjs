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

export async function run_simple({ old, new }) {
  const table = [
    ['file / KB (diff)', 'bundled', 'minified'],
    ['---', '---', '---'],
    ...Object.entries(new.size).map(([file, _new]) => {
      const _old = {
        bundled: 0,
        minified: 0,
        ...(old.size[file] || {}),
      };
      return [
        file,
        printSizeKByte(_old.bundled, new.bundled),
        printSizeKByte(_old.minified, new.minified),
      ];
    }),
  ];

  return [
    '**Build Stats**',
    '',
    ...table.map((row) => ['', ...row, ''].join(' | ')),
    '',
  ]
    .join('\n')
    .slice(0, MAX_COMMENT_CHARS);
}
