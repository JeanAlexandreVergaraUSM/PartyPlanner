import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const fail = msg => {
  console.error(`DEFENSE CHECK FAILED: ${msg}`);
  process.exit(1);
};

const indexHtml = read('index.html');
const firebaseJs = read('src/firebase.js');
const aiUi = read('src/ai/ui.js');
const secureFetch = read('src/security/secureApiFetch.js');
const envExample = read('.env.example');
const firebaseJson = JSON.parse(read('firebase.json'));
const packageJson = JSON.parse(read('package.json'));

if (!packageJson.dependencies?.firebase) {
  fail('Firebase debe estar instalado localmente como dependencia npm.');
}

const remoteFirebaseImports = [...fs.readdirSync('src', { recursive: true })]
  .filter(name => String(name).endsWith('.js'))
  .map(name => path.join('src', String(name)))
  .filter(p => fs.statSync(p).isFile())
  .filter(p => /gstatic\.com\/firebasejs/i.test(read(p)));

if (remoteFirebaseImports.length) {
  fail(`Quedan imports remotos del SDK Firebase: ${remoteFirebaseImports.join(', ')}`);
}

if (!/Content-Security-Policy/i.test(indexHtml)) {
  fail('index.html debe incluir CSP para GitHub Pages.');
}
if (!/object-src 'none'/i.test(indexHtml)) {
  fail('La CSP debe bloquear object-src.');
}
if (/script-src[^;]*'unsafe-inline'/i.test(indexHtml)) {
  fail("script-src no debe permitir 'unsafe-inline'.");
}
if (/script-src[^;]*'unsafe-eval'/i.test(indexHtml)) {
  fail("script-src no debe permitir 'unsafe-eval'.");
}
if (/\son(?:click|change|input|submit|load|error|keydown|paste)\s*=/i.test(indexHtml)) {
  fail('No deben existir handlers JavaScript inline en index.html.');
}

if (!/initializeAppCheck/.test(firebaseJs) || !/ReCaptchaEnterpriseProvider/.test(firebaseJs)) {
  fail('Firebase App Check con reCAPTCHA Enterprise no está preparado.');
}
if (!/memoryLocalCache/.test(firebaseJs) || !/persistentLocalCache/.test(firebaseJs)) {
  fail('Debe existir política de caché memory/persistent por dispositivo confiable.');
}

for (const key of [
  'VITE_FIREBASE_APP_CHECK_SITE_KEY',
  'VITE_FIREBASE_APP_CHECK_REQUIRED',
  'VITE_FIREBASE_APPCHECK_DEBUG',
  'VITE_AI_API_URL',
]) {
  if (!envExample.includes(key)) fail(`Falta ${key} en .env.example`);
}

if (!/secureApiFetch\(/.test(aiUi)) {
  fail('El cliente IA debe usar secureApiFetch.');
}
if (!/Authorization/.test(secureFetch) || !/X-Firebase-AppCheck/.test(secureFetch)) {
  fail('secureApiFetch debe adjuntar Auth y App Check.');
}

const securityHeaders = firebaseJson.hosting?.headers?.find(h => h.source === '**')?.headers || [];
const keys = new Set(securityHeaders.map(h => h.key));
for (const required of [
  'Content-Security-Policy',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Referrer-Policy',
  'Permissions-Policy',
  'Cross-Origin-Opener-Policy',
]) {
  if (!keys.has(required)) fail(`Falta header de seguridad en Firebase Hosting: ${required}`);
}


for (const p of [
  'backend-security-template/verifyRequest.mjs',
  'backend-security-template/rateLimit.mjs',
  'backend-security-template/guardedEndpointExample.mjs',
]) {
  if (!fs.existsSync(path.join(root, p))) fail(`Falta plantilla backend: ${p}`);
}

console.log('Defense-in-depth smoke tests: OK');
