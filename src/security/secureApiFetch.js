import { getToken as getAppCheckToken } from 'firebase/app-check';
import { auth, appCheck } from '../firebase.js';

function mergeHeaders(inputHeaders){
  return new Headers(inputHeaders || {});
}

/**
 * fetch autenticado para backends propios.
 * - Authorization: Firebase ID token
 * - X-Firebase-AppCheck: App Check token, cuando está habilitado
 */
export async function secureApiFetch(url, options = {}){
  const headers = mergeHeaders(options.headers);

  const user = auth.currentUser;
  if (user) {
    const idToken = await user.getIdToken();
    headers.set('Authorization', `Bearer ${idToken}`);
  }

  if (appCheck) {
    const tokenResult = await getAppCheckToken(appCheck, false);
    if (tokenResult?.token) {
      headers.set('X-Firebase-AppCheck', tokenResult.token);
    }
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
