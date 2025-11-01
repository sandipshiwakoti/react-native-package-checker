import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  {
    extends: [...nextCoreWebVitals],

    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },

    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^next', '^@?\\w'],
            ['^@/'],
            ['^~/'],
            ['^\\.\\.(?!/|$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.?(css|scss|sass)$'],
          ],
        },
      ],

      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'react-hooks/set-state-in-effect': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],

      'no-restricted-imports': [
        'warn',
        {
          patterns: [
            {
              group: ['./', '../'],
              message: 'Use absolute paths for imports instead of relative paths',
            },
          ],
        },
      ],
    },

    ignores: ['.vercel/**', '.next/**', 'node_modules/**', 'build/**'],
  },
]);
