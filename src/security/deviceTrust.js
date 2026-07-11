const TRUSTED_DEVICE_KEY = 'partyplanner:trusted-device:v1';

function safeStorage(){
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isTrustedDevice(){
  return safeStorage()?.getItem(TRUSTED_DEVICE_KEY) === 'true';
}

export function setTrustedDevicePreference(enabled){
  const storage = safeStorage();
  if (!storage) return false;
  storage.setItem(TRUSTED_DEVICE_KEY, enabled ? 'true' : 'false');
  return true;
}

export function getTrustedDevicePreferenceKey(){
  return TRUSTED_DEVICE_KEY;
}
