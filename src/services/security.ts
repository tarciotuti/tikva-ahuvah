import * as LocalAuthentication from 'expo-local-authentication';
import { getDatabase } from './database';

export interface SecurityConfig {
  isLockEnabled: boolean;
  pin: string;
  useBiometrics: boolean;
}

export function initSecurityTable() {
  const db = getDatabase();
  db.execSync(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);
}

export function getSecurityConfig(): SecurityConfig {
  try {
    initSecurityTable();
    const db = getDatabase();
    const rows = db.getAllSync<{ key: string; value: string }>('SELECT key, value FROM app_settings');
    const settingsMap: Record<string, string> = {};
    for (const r of rows) {
      settingsMap[r.key] = r.value;
    }

    return {
      isLockEnabled: settingsMap['security_enabled'] === 'true',
      pin: settingsMap['security_pin'] || '',
      useBiometrics: settingsMap['security_biometrics'] !== 'false',
    };
  } catch (error) {
    console.error('Erro ao ler configurações de segurança:', error);
    return {
      isLockEnabled: false,
      pin: '',
      useBiometrics: true,
    };
  }
}

export function saveSecurityConfig(config: Partial<SecurityConfig>) {
  initSecurityTable();
  const db = getDatabase();

  if (config.isLockEnabled !== undefined) {
    db.runSync(
      `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('security_enabled', ?)`,
      [config.isLockEnabled ? 'true' : 'false']
    );
  }

  if (config.pin !== undefined) {
    db.runSync(
      `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('security_pin', ?)`,
      [config.pin]
    );
  }

  if (config.useBiometrics !== undefined) {
    db.runSync(
      `INSERT OR REPLACE INTO app_settings (key, value) VALUES ('security_biometrics', ?)`,
      [config.useBiometrics ? 'true' : 'false']
    );
  }
}

export async function checkBiometricsSupportAsync(): Promise<{
  hasHardware: boolean;
  isEnrolled: boolean;
}> {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return { hasHardware, isEnrolled };
  } catch (e) {
    console.error('Erro ao checar biometria:', e);
    return { hasHardware: false, isEnrolled: false };
  }
}

export async function authenticateWithBiometricsAsync(): Promise<boolean> {
  try {
    const support = await checkBiometricsSupportAsync();
    if (!support.hasHardware || !support.isEnrolled) {
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Desbloquear Tikva Ahuvah 🌿',
      fallbackLabel: 'Usar PIN de 4 dígitos',
      cancelLabel: 'Cancelar',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error('Erro durante autenticação biométrica:', error);
    return false;
  }
}
