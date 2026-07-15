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
  'tests/unit/theme.test.js',
  'tests/unit/scheduleLayout.test.js',
  'tests/unit/calendarTasks.test.js',
  'tests/unit/usmCredits.test.js',
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
]) {
  if (!pkg.devDependencies?.[dep]) fail(`Falta devDependency: ${dep}`);
}

if (!/firebase-tools@15\.23\.0/.test(pkg.scripts?.['test:rules:emulator'] || '')) {
  fail('El emulador debe usar una versión fijada de firebase-tools fuera del árbol auditado.');
}

const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const gradesJs = fs.readFileSync(path.join(root, 'src/grades.js'), 'utf8');
const scheduleJs = fs.readFileSync(path.join(root, 'src/schedule.js'), 'utf8');
const calendarJs = fs.readFileSync(path.join(root, 'src/calendar.js'), 'utf8');
const mallaJs = fs.readFileSync(path.join(root, 'src/malla.js'), 'utf8');

if (/Seguridad de este dispositivo|trustedDevice/i.test(indexHtml)) {
  fail('La interfaz no debe volver a mostrar controles de caché offline.');
}
if (!/id="themeToggle"/.test(indexHtml)) {
  fail('Falta el selector de tema oscuro/claro.');
}
if (/addEventListener\(\s*['"]click['"]\s*,\s*saveRules\s*\)/.test(gradesJs)) {
  fail('Guardar reglas no debe recibir el MouseEvent como courseId.');
}
if (!/packScheduleLanes/.test(scheduleJs) || !/resolveHorizontalPlacement/.test(scheduleJs)) {
  fail('Falta la distribución automática de choques del simulador de horario.');
}
if (!/calEvtIsTask/.test(calendarJs) || !/createTaskMarker/.test(calendarJs)) {
  fail('Falta el flujo de tareas completables del calendario.');
}

if (!/ensureOwnMallaCloudSync/.test(mallaJs)
  || !/onSnapshot\(customRef/.test(mallaJs)
  || !/users', uid, 'customMallas'/.test(mallaJs)) {
  fail('Falta la sincronización de mallas personalizadas entre dispositivos.');
}
if (/renderizar nunca debe escribir/i.test(mallaJs) === false) {
  fail('Falta la protección contra escrituras de malla durante el render.');
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
