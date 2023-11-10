import { appendFileSync } from 'fs';

const PATH = './.instrumentation';

/**
 * Used to hook into the server lifecycle
 * An application can watch the directory for changes to {@link PATH} to listen to when the server and app are ready
 * https://nextjs.org/docs/pages/building-your-application/optimizing/instrumentation
 */
export function register() {
  appendFileSync(PATH, `${Date.now()}\n`);
}
