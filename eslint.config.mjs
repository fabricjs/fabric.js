import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      'src/mixins/eraser_brush.mixin.ts',
      'src/util/lang_class.ts',
      'src/parkinglot',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        console: 'readonly',
      },
      parserOptions: {
        project: true,
        tsconfigRootDir: './',
      },
    },

    rules: {
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-restricted-types': 1,
      '@typescript-eslint/ban-ts-comment': 1,

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
    },
  },
  {
    files: ['**/*.ts'],
  },
];
