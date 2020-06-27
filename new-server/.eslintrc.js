module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-plusplus': 'off',
    'spaced-comment': 'warn',
    'no-restricted-syntax': 'off',
    'newline-before-return': 'warn',
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    'no-shadow': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          ['^@nestjs$'],
          ['^@?\\w'],
          ['^lib'],
          ['^\\u0000'],
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
        ],
      },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/order': 'off',
    'sort-imports': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/typedef': [
      'error',
      {
        arrowParameter: false,
        parameter: true,
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
  },
  overrides: [
    {
      files: '*.spec.*',
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
