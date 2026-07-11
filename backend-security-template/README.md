# Plantilla de seguridad para backend IA

Esta carpeta no se despliega automáticamente. Es una plantilla lista para integrar cuando el endpoint IA se migre a Firebase Functions o Cloud Run.

Incluye:

- verificación de Firebase ID token;
- verificación de App Check token;
- rate limiting por usuario y scope usando transacción Firestore;
- ejemplo de endpoint que deriva `uid` del token y no del body.

Requiere Firebase Admin inicializado en el proceso servidor.

Orden recomendado:

```txt
CORS allowlist
→ Auth token
→ App Check token
→ rate limit
→ validación de input
→ caso de uso
→ provider IA
```

No uses el cooldown del navegador como mecanismo de seguridad: el rate limit real debe vivir en servidor.
