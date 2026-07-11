# Contrato de seguridad para el futuro backend IA

El frontend ya envía dos credenciales al backend propio:

```http
Authorization: Bearer <Firebase ID token>
X-Firebase-AppCheck: <Firebase App Check token>
```

El backend debe aplicar las siguientes capas en este orden.

## 1. Verificar Firebase Authentication

Ejemplo Node con Firebase Admin:

```js
import { getAuth } from 'firebase-admin/auth';

export async function verifyUser(req) {
  const raw = String(req.headers.authorization || '');
  if (!raw.startsWith('Bearer ')) {
    const err = new Error('No autenticado');
    err.status = 401;
    throw err;
  }

  const decoded = await getAuth().verifyIdToken(raw.slice(7));
  return decoded.uid;
}
```

Nunca confiar en un `uid` enviado en JSON por el navegador.

## 2. Verificar App Check

```js
import { getAppCheck } from 'firebase-admin/app-check';

export async function verifyAppCheck(req) {
  const token = String(req.headers['x-firebase-appcheck'] || '');
  if (!token) {
    const err = new Error('App Check requerido');
    err.status = 401;
    throw err;
  }

  return getAppCheck().verifyToken(token);
}
```

## 3. Aplicar rate limiting en servidor

Ejemplo de bucket simple con transacción Firestore:

```js
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const db = getFirestore();

export async function consumeAiQuota({
  uid,
  perMinute = 5,
  perDay = 30,
  now = Date.now(),
}) {
  const minuteBucket = Math.floor(now / 60_000);
  const dayBucket = new Date(now).toISOString().slice(0, 10);
  const ref = db.doc(`rateLimits/${uid}/services/ai`);

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const d = snap.exists ? snap.data() : {};

    const minuteUsed = d.minuteBucket === minuteBucket
      ? Number(d.minuteUsed || 0)
      : 0;

    const dayUsed = d.dayBucket === dayBucket
      ? Number(d.dayUsed || 0)
      : 0;

    if (minuteUsed >= perMinute || dayUsed >= perDay) {
      const err = new Error('Rate limit excedido');
      err.status = 429;
      throw err;
    }

    tx.set(ref, {
      minuteBucket,
      minuteUsed: minuteUsed + 1,
      dayBucket,
      dayUsed: dayUsed + 1,
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });
  });
}
```

Para la importación de mallas se recomienda un límite separado, por ejemplo:

```txt
mallaImport: 3 importaciones IA/día por usuario
assistant:   5 req/min y 30 req/día por usuario
```

Estos valores son producto/configuración, no deben depender del proveedor Gemini/OpenAI/Claude.

## 4. Validar tamaño y esquema antes de llamar a la IA

El backend debe rechazar antes de consumir cuota del proveedor:

- body demasiado grande;
- pregunta vacía;
- archivo con MIME no permitido;
- archivo superior al límite configurado;
- JSON inválido;
- usuario sin semestre cuando el caso de uso lo exige.

## 5. Orden correcto del endpoint

```txt
Request
  ↓
CORS allowlist
  ↓
Firebase Auth token
  ↓
App Check token
  ↓
rate limit servidor
  ↓
validación de input
  ↓
caso de uso
  ↓
proveedor IA desacoplado
  ↓
normalización/validación
  ↓
respuesta
```

El cliente puede aplicar cooldown para UX, pero todo control de seguridad real debe repetirse en servidor.
