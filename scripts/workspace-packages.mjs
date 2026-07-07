import path from 'node:path';
import { wd } from './dirname.mjs';

export const rootPackage = {
  dir: wd,
  importName: 'fabric',
};

export const workspacePackages = [
  {
    directory: 'core',
    importName: '@fabricjs/core',
    bundle: {
      external: [],
      transform: true,
    },
    typeStage: 'package',
  },
  {
    directory: 'browser',
    importName: '@fabricjs/browser',
    bundle: {
      external: ['@fabricjs/core'],
      transform: true,
    },
    typeStage: 'package',
  },
  {
    directory: 'node',
    importName: '@fabricjs/node',
    bundle: {
      external: [
        '@fabricjs/core',
        'jsdom',
        'jsdom/lib/jsdom/living/generated/utils.js',
        'canvas',
      ],
    },
    typeStage: 'package',
  },
  {
    directory: 'gradient-controls',
    importName: '@fabricjs/gradient-controls',
    bundle: {
      external: ['@fabricjs/core'],
      transform: true,
    },
    typeStage: 'package',
  },
  {
    directory: 'cropping-controls',
    importName: '@fabricjs/cropping-controls',
    bundle: {
      external: ['@fabricjs/core'],
      transform: true,
    },
    typeStage: 'package',
  },
  {
    directory: 'aligning-guidelines',
    importName: '@fabricjs/aligning-guidelines',
    bundle: {
      external: ['@fabricjs/core'],
      transform: true,
    },
    typeStage: 'package',
  },
  {
    directory: 'data-updaters',
    importName: '@fabricjs/data-updaters',
    bundle: {
      external: ['@fabricjs/core'],
      transform: true,
    },
    typeStage: 'package',
  },
  {
    directory: 'westures-integration',
    importName: '@fabricjs/westures-integration',
    bundle: {
      external: ['@fabricjs/core', 'westures'],
      transform: true,
    },
    typeStage: 'package',
  },
].map((pkg) => ({
  ...pkg,
  dir: path.resolve(wd, 'packages', pkg.directory),
}));

export const publishablePackages = [rootPackage, ...workspacePackages];

export const buildableWorkspacePackages = workspacePackages.filter(
  ({ bundle }) => bundle,
);

export const typedWorkspacePackages = workspacePackages.filter(
  ({ typeStage }) => typeStage === 'package',
);
