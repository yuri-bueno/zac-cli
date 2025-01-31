/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',

    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'prettier/prettier': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
