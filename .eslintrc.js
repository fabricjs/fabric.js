module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    // this is too noisy for now
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
    },
  ],
  rules: {
    '@typescript-eslint/consistent-type-exports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/ban-types': 1,
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
      // explore how to define the selector: https://astexplorer.net/
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
};
