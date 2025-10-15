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

export async function run_simple({ original, modified }) {
  const table = [
    ['file / KB (diff)', 'bundled', 'minified'],
    ['---', '---', '---'],
    ...Object.entries(modified.size).map(([file, _modified]) => {
      const _original = {
        bundled: 0,
        minified: 0,
        ...(original.size[file] || {}),
      };
      return [
        file,
        printSizeKByte(_original.bundled, _modified.bundled),
        printSizeKByte(_original.minified, _modified.minified),
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
