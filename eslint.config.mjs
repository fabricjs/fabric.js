import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: [
      'src/mixins/eraser_brush.mixin.ts',
      'src/util/lang_class.ts',
      'src/parkinglot',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,

  {
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        console: 'readonly',
      },
      parserOptions: {
        project: 'tsconfig.spec.json',
        tsconfigRootDir: __dirname,
      },
    },
  },

  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-type-arguments': 'error',
      '@typescript-eslint/no-restricted-types': 1,
      '@typescript-eslint/ban-ts-comment': 1,
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      'no-restricted-globals': [
        'error',
        {
          name: 'window',
          message: 'Use fabric window or other utils instead.',
        },
        {
          name: 'document',
          message: 'Use fabric document or other utils instead.',
        },
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector: '[callee.object.name="Math"][callee.property.name="hypot"]',
          message:
            '`Math.hypot` is not accurate on chrome, use `Math.sqrt` instead.\nSee https://stackoverflow.com/questions/62931950/different-results-of-math-hypot-on-chrome-and-firefox',
        },
        {
          selector: 'VariableDeclarator[init.name="Math"]',
          message:
            'Aliasing or destructing `Math` is not allowed due to restrictions on `Math.hypot` usage.',
        },
        {
          selector: '[callee.object.name="console"]',
          message: 'Use the `log` util',
        },
        {
          selector: 'NewExpression[callee.name="Error"]',
          message: 'Use `FabricError`',
        },
      ],
    },
  },

  {
    files: ['playwright.setup.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
);
