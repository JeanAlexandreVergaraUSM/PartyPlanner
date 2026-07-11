# Seguridad de PartyPlanner

## Configuración obligatoria antes de publicar

### 1. Google Calendar API

El código fuente ya no contiene la API key ni el OAuth Client ID. Para desarrollo local:

```bash
cp .env.example .env
```

Completa:

```env
VITE_GOOGLE_CALENDAR_CLIENT_ID=...
VITE_GOOGLE_CALENDAR_API_KEY=...
```

La API key se entrega al navegador por diseño, por lo que debe estar protegida en Google Cloud Console:

- restringir por **HTTP referrers**;
- permitir solo los dominios de PartyPlanner y los orígenes locales de desarrollo necesarios;
- restringir la key a **Google Calendar API**;
- rotar la key antigua que estuvo en el historial del repositorio.

El OAuth Client ID también debe tener configurados únicamente los orígenes JavaScript autorizados que use el proyecto.

### 2. Firestore Security Rules

Las reglas están en `firestore.rules` y el proyecto incluye `firebase.json`.

Antes de publicar una versión que dependa de estas reglas, despliega:

```bash
firebase deploy --only firestore:rules
```

Las reglas implementan:

- datos propios: lectura/escritura solo del dueño;
- datos Party: lectura únicamente entre miembros reales de la misma Party;
- privacidad por zona (`notas`, `horario`, `calendario`, `malla`);
- documentos de privacidad por viewer para evitar exponer la matriz completa de bloqueos;
- mutaciones de Party controladas: auto-unión, auto-salida y administración del host;
- denegación por defecto para rutas no declaradas.

## Cambios defensivos incluidos

- Fórmulas evaluadas sin `eval` ni `new Function`.
- El parser bloquea acceso a propiedades como `.constructor` y `.prototype`.
- Prueba rápida de seguridad:

```bash
npm run security:smoke
```

- Presencia online con heartbeat moderado de 90 segundos en vez de escrituras cada 2 segundos.
- La privacidad falla cerrada: si no se puede comprobar un permiso, no se muestran datos privados.
- Datos dinámicos sensibles insertados en HTML se escapan o se renderizan con `textContent`.

## Flujo recomendado antes de merge a `main`

```bash
npm install
npm run security:smoke
npm run build
npm run preview
```

Prueba manualmente además:

- crear/unirse/salir/cerrar Party;
- expulsar y transferir host;
- privacidad de notas/horario/calendario/malla;
- fórmulas con `avg`, porcentajes y `finalCode`;
- importación de Google Calendar;
- login, cambio de cuenta y logout.

## Fase 3 — Defensa en profundidad

La configuración y las acciones manuales de la tercera fase están documentadas en:

```txt
DEFENSE_IN_DEPTH.md
```

Incluye:

- Firebase App Check con reCAPTCHA Enterprise preparado;
- CSP para GitHub Pages y headers de seguridad para Firebase Hosting;
- Firebase SDK empaquetado mediante npm;
- política de caché Firestore por dispositivo confiable;
- `secureApiFetch` con Firebase Auth + App Check;
- contrato y plantilla de rate limiting para el futuro backend IA;
- smoke test adicional: `npm run defense:smoke`.
