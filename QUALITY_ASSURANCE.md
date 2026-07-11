# Fase 4 — Garantía continua de calidad

Esta fase agrega una red automática de pruebas y controles antes de integrar cambios a `main`.

## Capas de validación

1. **Smoke checks existentes**
   - seguridad crítica
   - recursos y performance
   - defensa en profundidad

2. **ESLint**
   - configuración flat en `eslint.config.js`
   - los archivos nuevos de tests y configuración se validan de forma estricta
   - el código legacy se reporta como deuda visible mediante warnings para no bloquear el primer CI

3. **Vitest**
   - pruebas unitarias de:
     - evaluador seguro de fórmulas
     - helpers anti-XSS
     - confianza del dispositivo
     - router
   - cobertura con umbrales mínimos

4. **Firebase Emulator Suite**
   - pruebas automatizadas de `firestore.rules`
   - casos de autenticación, aislamiento, Party, privacidad por zona y rutas backend-only

5. **Playwright**
   - smoke tests E2E del shell público
   - navegación segura
   - secciones privadas deshabilitadas sin sesión
   - CSP presente
   - smoke responsive móvil

6. **GitHub Actions**
   - ejecuta automáticamente:
     - Quality, Unit & Build
     - Firestore Rules
     - Playwright E2E
   - genera artefactos de cobertura y reportes Playwright

## Comandos principales

### Verificación rápida de desarrollo

```bash
npm run verify
```

Incluye:

```text
security:smoke
resource:smoke
defense:smoke
lint
unit tests
production build
```

### Unit tests

```bash
npm run test:unit
```

Modo watch:

```bash
npm run test:unit:watch
```

Cobertura:

```bash
npm run test:coverage
```

### Firestore Rules

Requisitos locales:

- Java 21
- dependencias instaladas con `npm ci`

Ejecutar:

```bash
npm run test:rules:emulator
```

Este comando inicia el emulador Firestore, ejecuta las pruebas y lo detiene automáticamente.

### Playwright

Instalar Chromium una vez:

```bash
npm run test:e2e:install
```

Ejecutar:

```bash
npm run build
npm run test:e2e
```

Modo visible:

```bash
npm run test:e2e:headed
```

UI interactiva:

```bash
npm run test:e2e:ui
```

### Suite completa local

```bash
npm run test:ci
```

Antes de ejecutarla por primera vez instala Chromium:

```bash
npm run test:e2e:install
```

## CI

Workflow:

```text
.github/workflows/ci.yml
```

Se ejecuta en:

- push a `develop`
- push a `main`
- pull requests hacia `develop`
- pull requests hacia `main`

Jobs esperados:

```text
Quality, Unit & Build
Firestore Rules
Playwright E2E
```

## Protección recomendada de ramas

Después de subir esta fase y comprobar que el workflow aparece en GitHub:

1. Abre la configuración del repositorio.
2. Crea una regla de protección o ruleset para `main`.
3. Exige Pull Request antes de merge.
4. Exige que pasen los checks:
   - `Quality, Unit & Build`
   - `Firestore Rules`
   - `Playwright E2E`
5. Evita push directo a `main`.
6. Mantén `develop` como rama de integración.

Flujo:

```text
trabajo diario
    ↓
develop
    ↓
CI completo
    ↓
Pull Request
    ↓
main
    ↓
deploy
```

## Deuda legacy visible

ESLint reporta warnings heredados del código existente. La Fase 4 no los oculta: quedan visibles en cada ejecución, pero todavía no bloquean CI.

Objetivo posterior:

```text
99 warnings legacy
        ↓
correcciones por módulo
        ↓
convertir no-undef/no-dupe-keys a error
        ↓
max-warnings = 0
```

No se recomienda hacer una limpieza masiva automática de esos warnings porque varias secciones contienen lógica de simuladores y flujos complejos que deben corregirse con pruebas funcionales específicas.

## Política para nuevas features

Toda feature nueva debe incluir al menos una de estas pruebas según corresponda:

- unit test para lógica pura
- rules test si toca permisos o Firestore Rules
- E2E smoke si modifica un flujo visible del usuario

Las nuevas funcionalidades de importación de malla con IA deberían agregar además:

- tests del normalizador
- tests del validador
- tests del contrato JSON canónico
- rules tests de `mallaImports`
- E2E del flujo subir → preview → corregir → confirmar
