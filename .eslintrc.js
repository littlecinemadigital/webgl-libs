// Declaring these outside of the `'no-restricted-syntax'` rule to make it
// easier to drop only some of them in overrides.
const restrictedSyntaxRules = [
  {selector: 'ExportDefaultDeclaration', message: 'Prefer named exports'},
];

module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true
  },
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off', // disable for all, will be enabled for TS in overrides
    // See https://eslint.org/docs/rules/no-unused-vars
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'max-nested-callbacks': ['error', 3],
    'no-await-in-loop': 'error',
    'no-promise-executor-return': 'error',
    'no-restricted-syntax': ['error', ...restrictedSyntaxRules],
    'no-return-await': 'error',
    'prefer-promise-reject-errors': 'error',
  }
};
