import fs from 'node:fs';
import path from 'node:path';
const minFile = 'fabric.min.js';
function parseJSONFile(file) {
  return JSON.parse(fs.readFileSync(file));
}

export async function run({ github, context, core, a, b }) {
  a = path.basename(a, '.json');
  b = path.basename(b, '.json');
  const { base, head } = context.payload.pull_request;
  const changedFiles = (
    await github.rest.repos.compareCommits({
      base: base.sha,
      head: head.sha,
      owner: context.repo.owner,
      repo: context.repo.repo,
    })
  ).data.files
    .map(({ filename }) => filename)
    .filter((file) => file.startsWith('src'));

  const stats = {
    a: parseJSONFile(`cli_output/${a}.json`),
    b: parseJSONFile(`cli_output/${b}.json`),
  };
  const size = {
    a: parseJSONFile(`cli_output/${a}_size.json`)[minFile],
    b: parseJSONFile(`cli_output/${b}_size.json`)[minFile],
    diff: {},
  };
  for (const key in size.a) {
    size.diff[key] = size.b[key] - size.a[key];
  }
  const filesDiff = {};
  stats.b.modules.forEach((b) => {
    const file = b.id.replace(/\\|\//g, '');
    if (!changedFiles.includes(file)) {
      return;
    }
    const a = stats.a.modules.find((a) => a.id === b.id);
    filesDiff[b.id] = {
      a,
      b,
      diff: ['size', 'origSize' /*'percent', 'reduction'*/].reduce(
        (diff, key) => {
          diff[key] = b[key] - (a[key] || 0);
          return diff;
        },
        {}
      ),
    };
  });
  return { size, files: filesDiff, changedFiles };
}
