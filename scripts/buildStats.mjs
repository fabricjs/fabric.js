import fs from 'node:fs';
import path from 'node:path';
import { wd } from './dirname.mjs';
import { buildableWorkspacePackages } from './workspace-packages.mjs';

const MAX_COMMENT_CHARS = 65536;

const buildOutputs = [
  {
    importName: 'fabric (browser UMD)',
    generated: 'dist/index.js',
    minified: 'dist/index.min.js',
  },
  {
    importName: 'fabric/node (CJS)',
    generated: 'dist/index.node.cjs',
  },
  ...buildableWorkspacePackages.map(({ directory, importName }) => ({
    importName,
    generated: `packages/${directory}/dist/index.mjs`,
  })),
  {
    importName: 'fabric/extensions (UMD)',
    minified: 'dist-extensions/fabric-extensions.min.js',
  },
];

function outputSize(file) {
  return fs.statSync(path.resolve(wd, file)).size;
}

export function buildStats() {
  return Object.fromEntries(
    buildOutputs.map(({ importName, generated, minified }) => [
      importName,
      {
        ...(generated ? { generated: outputSize(generated) } : {}),
        ...(minified ? { minified: outputSize(minified) } : {}),
      },
    ]),
  );
}

function printSize(a, b) {
  const diff = b - a;
  return `${b.toFixed(3)} (**${Math.sign(diff) > 0 ? '+' : ''}${diff.toFixed(
    diff !== 0 ? 3 : 0,
  )}**)`;
}

function printSizeKByte(a, b) {
  if (b == null) {
    return '—';
  }
  return printSize(a / 1024, b / 1024);
}

export async function run_simple({ original, modified }) {
  const table = [
    ['entrypoint / KiB (diff)', 'generated', 'minified'],
    ['---', '---', '---'],
    ...Object.entries(modified.size).map(([file, _modified]) => {
      const _original = {
        generated: 0,
        minified: 0,
        ...(original.size[file] || {}),
      };
      return [
        file,
        printSizeKByte(_original.generated, _modified.generated),
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
