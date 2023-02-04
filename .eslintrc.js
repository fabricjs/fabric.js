module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['**/*.ts'],
    },
  ],
  rules: {
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
    ],
  },
};
