import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const fail = (msg) => {
  console.error(`RESOURCE CHECK FAILED: ${msg}`);
  process.exit(1);
};

const indexHtml = read('index.html');
const mainJs = read('src/main.js');
const semestersJs = read('src/semesters.js');
const coursesJs = read('src/courses.js');
const gradesJs = read('src/grades.js');
const authJs = read('src/auth.js');
const stylesCss = read('src/styles.css');
const packageJson = JSON.parse(read('package.json'));

if (/html2canvas[^\n]*cdn\.jsdelivr/i.test(indexHtml)) {
  fail('html2canvas no debe cargarse desde CDN en index.html');
}
if (/jspdf[^\n]*cdn\.jsdelivr/i.test(indexHtml)) {
  fail('jsPDF no debe cargarse desde CDN en index.html');
}

const forbiddenStaticImports = [
  [mainJs, /from ['"]\.\/(grades|calendar|schedule|attendance|malla|progreso)\.js['"]/,
    'main.js contiene imports estáticos de módulos que deben ser lazy'],
  [semestersJs, /from ['"]\.\/(schedule|calendar)\.js['"]/,
    'semesters.js volvió a acoplarse estáticamente a horario/calendario'],
  [coursesJs, /from ['"]\.\/grades\.js['"]/,
    'courses.js volvió a importar grades.js estáticamente'],
  [gradesJs, /from ['"]\.\/(attendance|export)\.js['"]/,
    'grades.js volvió a importar módulos pesados estáticamente'],
  [authJs, /from ['"]\.\/profile\.js['"]/,
    'auth.js volvió a importar profile.js estáticamente'],
];

for (const [source, re, message] of forbiddenStaticImports) {
  if (re.test(source)) fail(message);
}

if (/@import\s+url\([^)]*fonts\.googleapis\.com/i.test(stylesCss)) {
  fail('styles.css no debe usar @import de Google Fonts; se carga con <link> en index.html');
}

const inlineStyle = indexHtml.match(/<style>([\s\S]*?)<\/style>/)?.[1] || '';
if (inlineStyle.length > 25000) {
  fail(`el CSS inline volvió a crecer demasiado (${inlineStyle.length} caracteres)`);
}

if (!packageJson.dependencies?.html2canvas) {
  fail('html2canvas debe estar declarado como dependencia local');
}
if (!packageJson.dependencies?.jspdf) {
  fail('jspdf debe estar declarado como dependencia local');
}

console.log('Resource smoke tests: OK');
