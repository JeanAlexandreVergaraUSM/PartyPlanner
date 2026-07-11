# PartyPlanner — Fase 3: defensa en profundidad

Esta fase agrega capas defensivas sobre las correcciones críticas de seguridad y las optimizaciones de recursos ya realizadas.

## 1. Firebase App Check preparado

`src/firebase.js` inicializa App Check con `ReCaptchaEnterpriseProvider` cuando existe:

```env
VITE_FIREBASE_APP_CHECK_SITE_KEY=...
```

La inicialización ocurre antes de crear Auth y Firestore. El token se renueva automáticamente.

### Importante: proyecto correcto

PartyPlanner actualmente usa Firebase con:

```txt
projectId: nacholo
```

Por lo tanto, App Check debe configurarse en **el proyecto Firebase que corresponde a `nacholo`**, aunque Google Calendar use otro proyecto Google Cloud separado llamado PartyPlanner.

### Activación recomendada

1. En Google Cloud del proyecto Firebase `nacholo`, crear una reCAPTCHA Enterprise **Website key** para los dominios reales de PartyPlanner.
2. En Firebase Console del proyecto `nacholo`: Security → App Check.
3. Registrar la app web con la site key de reCAPTCHA Enterprise.
4. Poner la site key en `.env`.
5. Publicar primero sin enforcement.
6. Revisar métricas de solicitudes verificadas/no verificadas.
7. Activar enforcement solo cuando el tráfico legítimo aparezca correctamente verificado.

### Desarrollo local

Para usar el debug provider local:

```env
VITE_FIREBASE_APPCHECK_DEBUG=true
```

Al abrir localhost, Firebase imprimirá un debug token en la consola del navegador. Ese token debe registrarse en Firebase Console → App Check → Apps → Manage debug tokens.

Nunca publiques una build con debug habilitado.

## 2. Política de caché sensible de Firestore

Antes PartyPlanner activaba caché persistente para todos los navegadores.

Ahora el comportamiento por defecto es:

```txt
Dispositivo no confiable
→ memoryLocalCache()
→ no conservar datos Firestore offline entre sesiones
```

El usuario puede activar explícitamente:

```txt
Perfil
→ Seguridad de este dispositivo
→ Confiar en este dispositivo
```

Entonces, en el siguiente inicio:

```txt
persistentLocalCache + multi-tab manager
```

También existe un botón para borrar la caché local de Firestore.

## 3. Content Security Policy y headers

`index.html` contiene una CSP mediante `<meta http-equiv>` para que exista protección también mientras el sitio continúe en GitHub Pages.

La política:

- bloquea plugins (`object-src 'none'`);
- no permite `unsafe-eval`;
- no permite JavaScript inline;
- permite únicamente los orígenes necesarios para Google Identity, Google Calendar y App Check;
- limita conexiones de red a Firebase/Google y backends explícitamente autorizados.

`firebase.json` añade una versión más completa para Firebase Hosting, además de:

- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy` restrictiva;
- `Cross-Origin-Opener-Policy: same-origin-allow-popups` para mantener compatibilidad con login por popup;
- cache larga para assets versionados y `no-cache` para `index.html`.

`style-src` conserva `unsafe-inline` temporalmente porque PartyPlanner todavía contiene estilos inline. Esto no habilita JavaScript inline. El objetivo futuro es mover los estilos restantes a CSS y retirar esa excepción.

## 4. Firebase SDK empaquetado localmente

Todos los imports del SDK Firebase se migraron desde URLs `gstatic.com` a paquetes npm:

```js
import { ... } from 'firebase/firestore';
import { ... } from 'firebase/auth';
import { ... } from 'firebase/app-check';
```

Esto permite que Vite haga tree-shaking, evita depender de módulos remotos sin SRI y deja las versiones bajo control de `package-lock.json`.

## 5. Cliente de backend seguro

`src/security/secureApiFetch.js` prepara las llamadas a backends propios con:

```txt
Authorization: Bearer <Firebase ID token>
X-Firebase-AppCheck: <App Check token>
```

El cliente de IA fue preparado para usar este mecanismo y ya no envía `uid` como dato confiable dentro del body. El backend debe derivar el UID desde el token verificado.

El endpoint se configura con:

```env
VITE_AI_API_URL=...
```

El cliente aplica límites de UX (una solicitud simultánea, longitud máxima y una pausa corta), pero **eso no sustituye un rate limit de servidor**.

El contrato de backend requerido está documentado en `docs/AI_BACKEND_SECURITY.md`.

## 6. Verificación automática

Nuevo comando:

```bash
npm run defense:smoke
```

Comprueba, entre otras cosas:

- Firebase instalado como dependencia local;
- ausencia de imports remotos del SDK;
- CSP presente y sin `unsafe-inline`/`unsafe-eval` en `script-src`;
- ausencia de handlers JavaScript inline;
- App Check preparado;
- política memory/persistent cache;
- `secureApiFetch` con Auth + App Check;
- headers de seguridad en `firebase.json`.

`npm run verify` ahora ejecuta:

```txt
security:smoke
→ resource:smoke
→ defense:smoke
→ production build
```
