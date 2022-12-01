import { execSync } from 'child_process';
import fs from 'fs';
import semver from 'semver';

const LABEL_PREFIX = 'release:';

export async function bumpPRVersion({
  labels,
  strictNoReleaseLabels,
  noReleaseLabels,
  baseVersion,
  prereleaseTag = 'beta',
}) {
  const { version: headVersion } = JSON.parse(
    fs.readFileSync('./package.json')
  );

  // get version level from PR label
  const releaseLabels = labels
    .map((label) => label.name)
    .filter((label) => label.startsWith(LABEL_PREFIX));
  let shouldBump = !labels.some((label) =>
    strictNoReleaseLabels.includes(label.name)
  );
  if (releaseLabels.length > 1 && shouldBump) {
    throw new Error(
      `Found more than one release label: ${releaseLabels.join(', ')}`
    );
  }
  const releaseLevel = releaseLabels[0]?.replace(LABEL_PREFIX, '');
  if (!releaseLevel && shouldBump) {
    shouldBump = !labels.some((label) => noReleaseLabels.includes(label.name));
  }
  // increment version
  const nextVersion = shouldBump
    ? semver.inc(
        baseVersion,
        releaseLabels[0]?.replace(LABEL_PREFIX, '') || 'prerelease',
        prereleaseTag
      )
    : baseVersion;

  // write file
  fs.writeFileSync(
    './package.json',
    JSON.stringify(
      {
        ...JSON.parse(fs.readFileSync('./package.json')),
        version: nextVersion,
      },
      null,
      2
    )
  );
  execSync('npx prettier --write package.json');

  if (nextVersion !== headVersion) {
    console.log(
      `Bumping version from ${baseVersion} to ${nextVersion}, current head version is ${headVersion}`
    );
    return nextVersion;
  } else {
    console.log(`Version is up to date (${headVersion})`);
    return '';
  }
}
