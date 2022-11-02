import cp from 'child_process';
import { createWriteStream } from 'fs';
import process from 'node:process';
import { wd } from './dirname.mjs';

// for logging we run this as a separate process
const { stdout } = cp.spawn(process.env.NODE_CMD, {
  cwd: wd,
  shell: true,
  stdio: 'pipe',
});
stdout.pipe(process.stdout);
stdout.pipe(createWriteStream(process.env.REPORT_FILE));
