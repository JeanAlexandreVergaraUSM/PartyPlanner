import { beforeEach, describe, expect, it } from 'vitest';
import {
  getTrustedDevicePreferenceKey,
  isTrustedDevice,
  setTrustedDevicePreference,
} from '../../src/security/deviceTrust.js';

describe('preferencia de dispositivo confiable', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('parte desactivada', () => {
    expect(isTrustedDevice()).toBe(false);
  });

  it('persiste y revoca la preferencia', () => {
    expect(setTrustedDevicePreference(true)).toBe(true);
    expect(isTrustedDevice()).toBe(true);
    expect(localStorage.getItem(getTrustedDevicePreferenceKey())).toBe('true');

    expect(setTrustedDevicePreference(false)).toBe(true);
    expect(isTrustedDevice()).toBe(false);
  });
});
