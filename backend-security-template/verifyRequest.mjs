import { getAuth } from 'firebase-admin/auth';
import { getAppCheck } from 'firebase-admin/app-check';

function httpError(status, message){
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function verifyFirebaseRequest(req){
  const authHeader = String(req.headers?.authorization || '');
  if (!authHeader.startsWith('Bearer ')) {
    throw httpError(401, 'Firebase ID token requerido');
  }

  const appCheckToken = String(
    req.headers?.['x-firebase-appcheck'] ||
    req.headers?.get?.('x-firebase-appcheck') ||
    ''
  );
  if (!appCheckToken) {
    throw httpError(401, 'App Check token requerido');
  }

  const [decodedAuth, decodedAppCheck] = await Promise.all([
    getAuth().verifyIdToken(authHeader.slice(7)),
    getAppCheck().verifyToken(appCheckToken),
  ]);

  return {
    uid: decodedAuth.uid,
    auth: decodedAuth,
    appCheck: decodedAppCheck,
  };
}
