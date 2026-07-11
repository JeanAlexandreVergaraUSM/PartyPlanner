import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const fail = message => {
  console.error(`QUALITY CHECK FAILED: ${message}`);
  process.exit(1);
};

const requiredFiles = [
  'eslint.config.js',
  'vitest.config.js',
  'playwright.config.js',
  '.github/workflows/ci.yml',
  'tests/unit/safeExpression.test.js',
  'tests/unit/html.test.js',
  'tests/unit/deviceTrust.test.js',
  'tests/unit/router.test.js',
  'tests/rules/firestore.rules.test.js',
  'tests/e2e/app-shell.spec.js',
  'tests/e2e/responsive.spec.js',
  'QUALITY_ASSURANCE.md',
];

for (const relative of requiredFiles) {
  if (!fs.existsSync(path.join(root, relative))) {
    fail(`Falta ${relative}`);
  }
}

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
for (const script of [
  'lint',
  'test:unit',
  'test:coverage',
  'test:rules:emulator',
  'test:e2e',
  'test:ci',
]) {
  if (!pkg.scripts?.[script]) fail(`Falta script npm: ${script}`);
}

for (const dep of [
  'eslint',
  'vitest',
  '@playwright/test',
  '@firebase/rules-unit-testing',
  'firebase-tools',
]) {
  if (!pkg.devDependencies?.[dep]) fail(`Falta devDependency: ${dep}`);
}

const firebaseConfig = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8'));
if (!firebaseConfig.emulators?.firestore?.port) {
  fail('Falta configuración del emulador de Firestore.');
}

const workflow = fs.readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');
for (const expected of ['Quality, Unit & Build', 'Firestore Rules', 'Playwright E2E']) {
  if (!workflow.includes(expected)) fail(`Falta job CI: ${expected}`);
}

console.log('Continuous quality smoke tests: OK');
