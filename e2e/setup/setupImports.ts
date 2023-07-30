import type { Page } from '@playwright/test';
import { createRequire } from 'module';
import path from 'path';
import * as pkg from '../../package.json';

function resolvePath(pathToFile: string) {
  return `/${path
    .relative(
      process.cwd(),
      path.isAbsolute(pathToFile)
        ? pathToFile
        : path.resolve(process.cwd(), pathToFile)
    )
    .replaceAll(/\\/g, '/')}`;
}

const require = createRequire(path.resolve(process.cwd(), 'node_modules'));

function resolveModule(name: string) {
  return resolvePath(require.resolve(name));
}

/**
 * Exposes imports on {@link Page} for consumption by module scripts
 */
export function setupImports(page: Page) {
  return page.addScriptTag({
    type: 'importmap',
    content: JSON.stringify({
      imports: Object.keys({
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
        ...(pkg.optionalDependencies || {}),
      }).reduce(
        (importmap, key) => {
          try {
            importmap[key] = resolveModule(key);
          } catch (error) {}
          return importmap;
        },
        { fabric: resolvePath(pkg.module) }
      ),
    }),
  });
}
