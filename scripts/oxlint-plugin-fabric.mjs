// Replacement for ESLint's `no-restricted-syntax`, which oxlint does not implement.
const restrictedSyntax = [
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
];

export default {
  meta: { name: 'fabric' },
  rules: {
    'no-restricted-syntax': {
      create(context) {
        return Object.fromEntries(
          restrictedSyntax.map(({ selector, message }) => [
            selector,
            (node) => context.report({ node, message }),
          ]),
        );
      },
    },
  },
};
