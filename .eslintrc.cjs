const path = require('node:path');

module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.app.json', 'tsconfig.spec.json'],
        tsconfigRootDir: path.resolve(__dirname),
        sourceType: 'module',
      },
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'prettier',
      ],
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/no-host-metadata-property': 'off',
        '@angular-eslint/prefer-standalone': 'off',
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended', 'prettier'],
      rules: {},
    },
  ],
};
