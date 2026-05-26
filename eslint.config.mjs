import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: [
      'dist/*',
      'dist-extensions/*',
      '.codesandbox/**/*',
      'e2e/*',
      'src/mixins/eraser_brush.mixin.ts',
      'src/util/lang_class.ts',
      'src/parkinglot',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',
    },
    rules: {
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
    files: ['playwright.setup.ts', 'e2e/**/*.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
];
