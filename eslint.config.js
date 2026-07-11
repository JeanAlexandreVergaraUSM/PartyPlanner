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
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-constant-condition': 'warn',
      // El código legacy entra primero como deuda visible (warning) para no bloquear el CI.
      // Los archivos nuevos de tests/configuración conservan la severidad estricta.
      'no-undef': 'warn',
      'no-dupe-keys': 'warn',
      'no-fallthrough': 'warn',
      'no-useless-escape': 'warn',
      'no-useless-assignment': 'warn',
      'no-extra-boolean-cast': 'warn',
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
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
];
