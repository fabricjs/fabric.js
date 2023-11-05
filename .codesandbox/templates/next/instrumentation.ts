import { appendFileSync } from 'fs';

const PATH = './.instrumentation';

/**
 * Used to hook into the server lifecycle
 * https://nextjs.org/docs/pages/building-your-application/optimizing/instrumentation
 */
export function register() {
  appendFileSync(PATH, `${Date.now()}\n`);
}
