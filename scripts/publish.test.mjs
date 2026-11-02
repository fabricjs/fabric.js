import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { validateRelease } from './publish.mjs';

function fixtures(t, versions) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fabric-release-test-'));
  t.after(() => fs.rmSync(tmp, { recursive: true, force: true }));
  return versions.map((version, index) => {
    const dir = path.join(tmp, String(index));
    const importName = index === 0 ? 'fabric' : '@fabricjs/core';
    fs.mkdirSync(dir);
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify({ name: importName, version }),
    );
    return { dir, importName };
  });
}

test('matching release versions select beta or latest with an optional v prefix', (t) => {
  for (const [version, prerelease, npmTag] of [
    ['7.5.0-beta.1', 'true', 'beta'],
    ['7.5.0', 'false', 'latest'],
  ]) {
    const packages = fixtures(t, [version, version]);
    for (const prefix of ['', 'v']) {
      assert.equal(
        validateRelease(`${prefix}${version}`, prerelease, packages),
        npmTag,
      );
    }
  }
});

test('rejects a release tag or package version that differs from the root version', (t) => {
  const packages = fixtures(t, ['7.5.0-beta.1', '7.4.0']);
  assert.throws(
    () => validateRelease('v7.4.0', 'true', packages),
    /Release tag must be/,
  );
  assert.throws(
    () => validateRelease('v7.5.0-beta.1', 'true', packages),
    /@fabricjs\/core is 7.4.0/,
  );
});

test('rejects incorrect or missing prerelease flags', (t) => {
  for (const [version, flag] of [
    ['7.5.0-beta.1', 'false'],
    ['7.5.0', 'true'],
  ]) {
    const packages = fixtures(t, [version]);
    assert.throws(
      () => validateRelease(version, flag, packages),
      /Prerelease flag/,
    );
  }
  assert.throws(
    () => validateRelease('v7.5.0', undefined),
    /Prerelease must be/,
  );
});

test('rejects a private package or an unexpected package name', (t) => {
  const packages = fixtures(t, ['7.5.0-beta.1']);
  const manifest = path.join(packages[0].dir, 'package.json');
  for (const pkg of [
    { name: 'fabric', version: '7.5.0-beta.1', private: true },
    { name: 'www-fabric-com', version: '7.5.0-beta.1' },
  ]) {
    fs.writeFileSync(manifest, JSON.stringify(pkg));
    assert.throws(
      () => validateRelease('v7.5.0-beta.1', 'true', packages),
      /Expected a public fabric/,
    );
  }
});
