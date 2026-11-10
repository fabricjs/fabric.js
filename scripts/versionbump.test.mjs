import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import {
  createVersionBumpPlan,
  releaseTagNames,
  validateVersion,
} from './versionbump.mjs';

function fixtures(t, versions) {
  const tmp = fs.mkdtempSync(
    path.join(os.tmpdir(), 'fabric-versionbump-test-'),
  );
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  return versions.map((version, index) => {
    const dir = path.join(tmp, String(index));
    const importName = index === 0 ? 'fabric' : `@fabricjs/package-${index}`;
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: importName, version }),
    );
    return { dir, importName };
  });
}

test('accepts stable and prerelease SemVer values', () => {
  assert.equal(validateVersion('7.5.0'), '7.5.0');
  assert.equal(validateVersion('7.5.0-beta.2'), '7.5.0-beta.2');
  assert.throws(() => validateVersion('v7.5.0'), /valid SemVer/);
  assert.throws(() => validateVersion('7.5'), /valid SemVer/);
  assert.throws(() => validateVersion('7.5.0-beta.01'), /valid SemVer/);
});

test('creates a bump plan for aligned packages', (t) => {
  assert.deepEqual(
    createVersionBumpPlan(
      '7.5.0-beta.2',
      fixtures(t, ['7.5.0-beta.1', '7.5.0-beta.1']),
    ),
    [
      { importName: 'fabric', from: '7.5.0-beta.1', to: '7.5.0-beta.2' },
      {
        importName: '@fabricjs/package-1',
        from: '7.5.0-beta.1',
        to: '7.5.0-beta.2',
      },
    ],
  );
});

test('rejects unaligned or unchanged package versions', (t) => {
  assert.throws(
    () =>
      createVersionBumpPlan('7.5.0', fixtures(t, ['7.5.0-beta.1', '7.4.0'])),
    /not aligned/,
  );
  assert.throws(
    () => createVersionBumpPlan('7.5.0-beta.1', fixtures(t, ['7.5.0-beta.1'])),
    /already at version/,
  );
});

test('supports both accepted release tag forms', () => {
  assert.deepEqual(releaseTagNames('7.5.0-beta.2'), [
    'v7.5.0-beta.2',
    '7.5.0-beta.2',
  ]);
});
