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
          '`Math.hypot` is not accurate on chrome, import `hypot` from `util` instead.',
      },
      {
        selector: 'VariableDeclarator[init.name="Math"]',
        message:
          'Aliasing or destructing `Math` is not allowed due to restrictions on `Math.hypot` usage.',
      },
    ],
  },
};
