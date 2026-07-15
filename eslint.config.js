import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.firebase/**',
      'backend-security-template/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-constant-condition': 'error',
      // El código legacy entra primero como deuda visible (warning) para no bloquear el CI.
      // Los archivos nuevos de tests/configuración conservan la severidad estricta.
      'no-undef': 'error',
      'no-dupe-keys': 'error',
      'no-fallthrough': 'error',
      'no-useless-escape': 'error',
      'no-useless-assignment': 'error',
      'no-extra-boolean-cast': 'error',
    },
  },
  {
    files: [
      'scripts/**/*.mjs',
      'tests/**/*.js',
      'vite.config.js',
      'vitest.config.js',
      'playwright.config.js',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
];
