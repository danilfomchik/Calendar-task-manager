import js from '@eslint/js';
import importConfig from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {ignores: ['dist']},
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importConfig,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-console': 'warn',
      'no-restricted-imports': [
        'error',
        {paths: [{name: 'classnames', message: "Use `cx` from '@/services/utils' for class merging."}]},
      ],
      'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
      'prettier/prettier': 'warn',
    },
  },
  {files: ['src/services/utils.ts'], rules: {'no-restricted-imports': 'off'}},
);
