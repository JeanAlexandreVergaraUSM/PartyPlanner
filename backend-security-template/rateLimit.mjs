import { getFirestore, FieldValue } from 'firebase-admin/firestore';

function httpError(status, message){
  const err = new Error(message);
  err.status = status;
  return err;
}

export async function consumeRateLimit({
  uid,
  scope,
  perMinute = 5,
  perDay = 30,
  now = Date.now(),
}){
  if (!uid || !scope) throw httpError(400, 'uid y scope son obligatorios');

  const db = getFirestore();
  const minuteBucket = Math.floor(now / 60_000);
  const dayBucket = new Date(now).toISOString().slice(0, 10);
  const ref = db.doc(`rateLimits/${uid}/services/${scope}`);

  await db.runTransaction(async tx => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : {};

    const minuteUsed = data.minuteBucket === minuteBucket
      ? Number(data.minuteUsed || 0)
      : 0;
    const dayUsed = data.dayBucket === dayBucket
      ? Number(data.dayUsed || 0)
      : 0;

    if (minuteUsed >= perMinute || dayUsed >= perDay) {
      throw httpError(429, 'Límite de solicitudes alcanzado');
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
