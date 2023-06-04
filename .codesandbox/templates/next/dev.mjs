// workaround next bug
// https://stackoverflow.com/questions/67376052/error-when-running-next-js-typeerror-0-react-jsx-dev-runtime-webpack-impo

import { spawnSync } from 'child_process';

// customize next server
// https://nextjs.org/docs/advanced-features/custom-server
//
// spawnSync('npx nodemon', ['--config nodemon.config.json', 'server.js', process.argv.slice(2)], {
//     env: { ...process.env, NODE_ENV: 'development' },
//     stdio: 'inherit',
//     shell: true
// });

spawnSync('next dev', {
  env: { ...process.env, NODE_ENV: 'development' },
  stdio: 'inherit',
  shell: true,
});
