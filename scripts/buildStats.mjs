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
    ['package / KiB (diff)', 'tarball', 'unpacked'],
    ['---', '---', '---'],
    ...Object.entries(modified.size).map(([file, _modified]) => {
      const _original = {
        tarball: 0,
        unpacked: 0,
        ...(original.size[file] || {}),
      };
      return [
        file,
        printSizeKByte(_original.tarball, _modified.tarball),
        printSizeKByte(_original.unpacked, _modified.unpacked),
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
