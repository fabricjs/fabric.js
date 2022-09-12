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
    'operator-linebreak': [
      'error',
      'after',
      {
        'overrides': {
          '||': 'before',
          '&&': 'before'
        }
      }
    ],
  },
};
