/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const { defineConfig, globalIgnores } = require('eslint/config');

const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');

const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');

const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const prettier = require('eslint-plugin-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const _import = require('eslint-plugin-import');
const sonarjs = require('eslint-plugin-sonarjs');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      ecmaVersion: 'latest',

      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
      },

      globals: {
        ...globals.jest,
        ...globals.node,
      },
    },

    extends: fixupConfigRules(
      compat.extends(
        'plugin:import/typescript',
        'plugin:prettier/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/eslint-recommended',
      ),
    ),

    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      prettier: fixupPluginRules(prettier),
      'simple-import-sort': simpleImportSort,
      import: fixupPluginRules(_import),
      sonarjs,
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          tabWidth: 2,
          bracketSpacing: true,
          endOfLine: 'auto',
        },
      ],

      'import/export': 'error',
      'import/first': 'error',
      'import/no-unresolved': 'off',
      'import/namespace': 'error',
      'import/no-duplicates': 'error',
      'import/no-relative-packages': 'error',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-default-export': 'error',
      'import/no-self-import': 'error',
      'import/no-deprecated': 'error',
      'import/no-cycle': 'off',
      'import/no-unused-modules': 'error',
      'import/no-namespace': 'error',
      'import/extensions': 0,

      'import/no-useless-path-segments': [
        'error',
        {
          noUselessIndex: true,
        },
      ],

      'import/no-internal-modules': 'off',
      'import/order': 'off',
      'sonarjs/cognitive-complexity': 'error',
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-collapsible-if': 'error',
      'sonarjs/no-collection-size-mischeck': 'error',
      'sonarjs/no-empty-collection': 'error',
      'sonarjs/no-identical-conditions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-inverted-boolean-check': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-redundant-boolean': 'error',
      'sonarjs/no-redundant-jump': 'error',
      'sonarjs/no-unused-collection': 'error',
      'sonarjs/no-useless-catch': 'error',
      'sonarjs/prefer-object-literal': 'error',
      'sonarjs/prefer-single-boolean-return': 'error',
      'sonarjs/no-use-of-empty-return-value': 'error',
      'sonarjs/no-gratuitous-expressions': 'error',
      'sonarjs/no-duplicate-string': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/adjacent-overload-signatures': 'error',

      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array-simple',
        },
      ],

      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        {
          overrides: {
            constructors: 'off',
          },
        },
      ],
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/ban-tslint-comment': 'error',
      '@typescript-eslint/consistent-indexed-object-style': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      'keyword-spacing': 'off',
      '@/keyword-spacing': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/no-use-before-define': 'error',
      '@typescript-eslint/no-use-before-declare': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-namespace-keyword': 'error',

      '@/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],

      '@/semi': ['error', 'always'],
      '@typescript-eslint/unified-signatures': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-await-in-loop': 'error',

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'try',
        },
        {
          blankLine: 'always',
          prev: 'try',
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'block-like',
        },
        {
          blankLine: 'always',
          prev: 'block-like',
          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',
          next: 'throw',
        },
        {
          blankLine: 'always',
          prev: 'var',
          next: '*',
        },
      ],

      '@typescript-eslint/no-unsafe-argument': 'off',
      'sonarjs/elseif-without-else': 'off',
      'import/named': 'off',
      'arrow-body-style': 'error',
      'arrow-parens': ['error', 'always'],

      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'rxjs/Rx',
              message: 'Please import directly from "rxjs" instead',
            },
          ],
        },
      ],

      'object-curly-spacing': ['error', 'always'],
      'no-multi-spaces': 'error',
      'no-useless-return': 'error',
      'no-else-return': 'error',
      'no-implicit-coercion': 'error',
      'constructor-super': 'error',
      yoda: 'error',
      strict: ['error', 'never'],
      curly: 'error',
      'dot-notation': 'error',
      'eol-last': 'error',
      eqeqeq: ['error', 'smart'],
      'guard-for-in': 'error',
      'id-match': 'error',

      'max-len': [
        'error',
        {
          code: 200,
        },
      ],

      'new-parens': 'error',
      'no-bitwise': 'error',
      'no-caller': 'error',
      'no-cond-assign': 'error',
      'no-constant-condition': 'error',
      'no-dupe-else-if': 'error',
      'no-console': [
        'error',
        {
          allow: [
            'info',
            'dirxml',
            'warn',
            'error',
            'dir',
            'timeLog',
            'assert',
            'clear',
            'count',
            'countReset',
            'group',
            'groupCollapsed',
            'groupEnd',
            'table',
            'Console',
            'markTimeline',
            'profile',
            'profileEnd',
            'timeline',
            'timelineEnd',
            'timeStamp',
            'context',
          ],
        },
      ],

      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'off',
      'no-empty': 'error',
      'no-eval': 'error',
      'no-extra-bind': 'error',
      'no-fallthrough': 'error',
      'no-invalid-this': 'error',
      'no-irregular-whitespace': 'error',

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],

      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-redeclare': 'error',
      'no-sequences': 'error',
      'no-sparse-arrays': 'error',
      'no-template-curly-in-string': 'error',
      'no-shadow': 'off',
      'no-throw-literal': 'error',
      'no-trailing-spaces': 'error',
      'no-undef-init': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-expressions': 'off',
      'no-unused-labels': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-const': 'error',
      'prefer-object-spread': 'error',
      radix: 'error',
      'use-isnan': 'error',
      'valid-typeof': 'off',
      'space-before-function-paren': 'off',
      'no-nested-ternary': 'off',
    },
  },
  globalIgnores([
    '**/.eslintrc.js',
    'src/database/migrations/**/*.ts',
    '**/dist',
  ]),
]);
