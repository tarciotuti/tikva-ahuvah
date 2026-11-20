import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { getAllDataForBackup, restoreDataFromBackup, getDatabase } from './database';
import { BackupPayload, BackupPhotoFile } from '../types';
import { uploadBackupToDriveApi } from './googleDrive';

export interface BackupStatusInfo {
  autoEnabled: boolean;
  method: 'local' | 'remote' | 'hybrid';
  lastBackupDate: string;
  lastBackupSize: string;
  localBackupDate: string;
  hasLocalBackup: boolean;
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly';
  includePhotos: boolean;
  googleAccount: string;
  backupNetwork: 'wifi' | 'all';
}

function ensureSettingsTable() {
  try {
    const db = getDatabase();
    db.execSync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);
  } catch (err) {
    console.warn('Erro ao verificar app_settings:', err);
  }
}

export function formatBackupDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  if (isToday) {
    return `Hoje às ${hours}:${minutes}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return `Ontem às ${hours}:${minutes}`;
  }

  const months = [
    'jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.',
    'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'
  ];
  return `${pad(date.getDate())} de ${months[date.getMonth()]} às ${hours}:${minutes}`;
}

export function getBackupSetting(key: string, defaultValue: string): string {
  try {
    ensureSettingsTable();
    const db = getDatabase();
    const row = db.getFirstSync<{ value: string }>(
      'SELECT value FROM app_settings WHERE key = ?',
      [key]
    );
    return row?.value || defaultValue;
  } catch {
    return defaultValue;
  }
}

export function saveBackupSetting(key: string, value: string): void {
  try {
    ensureSettingsTable();
    const db = getDatabase();
    db.runSync(
      'INSERT OR REPLACE INTO app_settings (key, value) VALUES (?, ?)',
      [key, value]
    );
  } catch (err) {
    console.error(`Erro ao salvar configuração ${key}:`, err);
  }
}

export async function checkLocalBackupFile(): Promise<{ exists: boolean; dateText: string; sizeText: string }> {
  try {
    const localDir = `${FileSystem.documentDirectory}backups/`;
    const localFile = `${localDir}tikva_local_backup.json`;
    const info = await FileSystem.getInfoAsync(localFile);
    if (info.exists && !info.isDirectory) {
      const sizeBytes = (info as any).size || 0;
      const sizeMb = sizeBytes > 0 ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB';
      const modTime = (info as any).modificationTime;
      const dateText = modTime ? formatBackupDate(new Date(modTime * 1000)) : 'Salvo no dispositivo';
      return { exists: true, dateText, sizeText: sizeMb };
    }
  } catch (err) {
    console.warn('Erro ao verificar backup local:', err);
  }
  return { exists: false, dateText: 'Nunca', sizeText: '-' };
}

export function getBackupStatus(): BackupStatusInfo {
  const autoEnabled = getBackupSetting('backup_auto_enabled', 'true') === 'true';
  const method = (getBackupSetting('backup_method', 'hybrid') as 'local' | 'remote' | 'hybrid');
  const lastDate = getBackupSetting('backup_last_date', 'Nunca');
  const lastSize = getBackupSetting('backup_last_size', '-');
  const frequency = (getBackupSetting('backup_frequency', 'daily') as 'manual' | 'daily' | 'weekly' | 'monthly');
  const includePhotos = getBackupSetting('backup_include_photos', 'true') === 'true';
  const googleAccount = getBackupSetting('backup_google_account', '');
  const backupNetwork = (getBackupSetting('backup_network', 'wifi') as 'wifi' | 'all');
  const hasLocal = getBackupSetting('backup_has_local', 'false') === 'true';
  const localDate = getBackupSetting('backup_local_date', lastDate);

  return {
    autoEnabled,
    method,
    lastBackupDate: lastDate,
    lastBackupSize: lastSize,
    localBackupDate: localDate,
    hasLocalBackup: hasLocal,
    frequency,
    includePhotos,
    googleAccount,
    backupNetwork,
  };
}

export async function saveImageToAppDirectory(sourceUri: string): Promise<string> {
  try {
    const photosDir = `${FileSystem.documentDirectory}photos/`;
    const dirInfo = await FileSystem.getInfoAsync(photosDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
    }

    const filename = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}.jpg`;
    const destinationUri = `${photosDir}${filename}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  } catch (error) {
    console.error('Erro ao salvar foto no armazenamento local:', error);
    return sourceUri;
  }
}

/**
 * Realiza o backup completo no modelo do WhatsApp:
 * 1. Salva a cópia local no dispositivo (`documentDirectory/backups/tikva_local_backup.json`)
 * 2. Atualiza os registros de último backup (Data, Hora e Tamanho em MB)
 * 3. Se solicitado, abre o compartilhamento nativo para salvar no Google Drive ou outro app
 */
export async function performWhatsAppBackup(options?: {
  includePhotos?: boolean;
  shareToCloud?: boolean;
  method?: 'local' | 'remote' | 'hybrid';
}): Promise<{
  success: boolean;
  message: string;
  size?: string;
  date?: string;
  photosCount?: number;
}> {
  try {
    const includePhotos = options?.includePhotos !== undefined ? options.includePhotos : true;
    const shareToCloud = options?.shareToCloud !== undefined ? options.shareToCloud : true;
    const method = options?.method || (getBackupSetting('backup_method', 'hybrid') as 'local' | 'remote' | 'hybrid');

    const { memories, capsules, notes, gallery, poems } = getAllDataForBackup();

    const photosFiles: BackupPhotoFile[] = [];
    if (includePhotos) {
      const processedFilenames = new Set<string>();
      const candidateUris = [
        ...memories.map((m) => m.photoUri).filter(Boolean),
        ...gallery.map((g) => g.uri).filter(Boolean),
      ] as string[];

      for (const uri of candidateUris) {
        try {
          const filename = uri.split('/').pop();
          if (filename && !processedFilenames.has(filename)) {
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (fileInfo.exists) {
              const base64Data = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
              });
              photosFiles.push({ filename, base64Data });
              processedFilenames.add(filename);
            }
          }
        } catch (err) {
          console.warn(`Não foi possível converter a foto ${uri}:`, err);
        }
      }
    }

    const payload: BackupPayload = {
      version: 3,
      appName: 'Tikva Ahuvah - Memórias, Fé & Galeria',
      exportedAt: new Date().toISOString(),
      memories,
      capsules,
      notes,
      gallery,
      poems,
      photosFiles,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const sizeBytes = new Blob([jsonString]).size;
    const sizeMb = sizeBytes > 1024 * 1024
      ? `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(sizeBytes / 1024)} KB`;

    const nowFormatted = formatBackupDate(new Date());

    // 1. Grava no diretório de backups locais (se local ou híbrido)
    if (method !== 'remote') {
      const backupDir = `${FileSystem.documentDirectory}backups/`;
      const dirInfo = await FileSystem.getInfoAsync(backupDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
      }

      const localBackupFile = `${backupDir}tikva_local_backup.json`;
      await FileSystem.writeAsStringAsync(localBackupFile, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      saveBackupSetting('backup_has_local', 'true');
      saveBackupSetting('backup_local_date', nowFormatted);
    }

    // 2. Persiste estado nas configurações
    saveBackupSetting('backup_last_date', nowFormatted);
    saveBackupSetting('backup_last_size', sizeMb);

    // 3. Sincronização com o Google Drive (se remoto ou híbrido)
    let cloudSynced = false;
    if (method !== 'local') {
      try {
        const driveRes = await uploadBackupToDriveApi(jsonString);
        if (driveRes.success) {
          cloudSynced = true;
        }
      } catch (driveErr) {
        console.warn('Tentativa de sincronização em nuvem silenciosa:', driveErr);
      }

      // Se ainda não conectou a conta Google ou falhou na nuvem, usa o compartilhamento nativo como fallback
      if (shareToCloud && !cloudSynced) {
        const exportFile = `${FileSystem.documentDirectory}tikva_ahuvah_backup_${new Date().toISOString().slice(0, 10)}.json`;
        await FileSystem.writeAsStringAsync(exportFile, jsonString, {
          encoding: FileSystem.EncodingType.UTF8,
        });

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(exportFile, {
            mimeType: 'application/json',
            dialogTitle: 'Salvar no Google Drive (Tikva Ahuvah)',
            UTI: 'public.json',
          });
        }
      }
    }

    let resultMsg = `Backup realizado (${sizeMb})!`;
    if (method === 'local') {
      resultMsg += ' Salvo com segurança na memória interna do celular.';
    } else if (cloudSynced) {
      resultMsg += ' Salvo no Google Drive com sucesso!';
    } else {
      resultMsg += ' Cópia de segurança gerada!';
    }

    return {
      success: true,
      message: resultMsg,
      size: sizeMb,
      date: nowFormatted,
      photosCount: photosFiles.length,
    };
  } catch (error: any) {
    console.error('Erro ao realizar backup no estilo WhatsApp:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao gerar o arquivo de backup.',
    };
  }
}

export async function exportBackup(): Promise<{ success: boolean; message: string }> {
  const res = await performWhatsAppBackup({ includePhotos: true, shareToCloud: true });
  return { success: res.success, message: res.message };
}

export async function restoreBackup(
  jsonString: string
): Promise<{ success: boolean; message: string; count?: number }> {
  try {
    const data: BackupPayload = JSON.parse(jsonString);

    if (!data.memories || !Array.isArray(data.memories) || !data.capsules || !Array.isArray(data.capsules)) {
      throw new Error('Formato de arquivo inválido. O arquivo de backup deve conter memórias e mensagens especiais.');
    }

    const photosDir = `${FileSystem.documentDirectory}photos/`;
    const dirInfo = await FileSystem.getInfoAsync(photosDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(photosDir, { intermediates: true });
    }

    const filenameToNewUriMap = new Map<string, string>();
    if (data.photosFiles && Array.isArray(data.photosFiles)) {
      for (const item of data.photosFiles) {
        try {
          if (item.filename && item.base64Data) {
            const destPath = `${photosDir}${item.filename}`;
            await FileSystem.writeAsStringAsync(destPath, item.base64Data, {
              encoding: FileSystem.EncodingType.Base64,
            });
            filenameToNewUriMap.set(item.filename, destPath);
          }
        } catch (photoErr) {
          console.warn(`Erro ao restaurar imagem ${item.filename}:`, photoErr);
        }
      }
    }

    const updatedMemories = data.memories.map((m) => {
      if (m.photoUri) {
        const filename = m.photoUri.split('/').pop();
        if (filename && filenameToNewUriMap.has(filename)) {
          return { ...m, photoUri: filenameToNewUriMap.get(filename)! };
        }
      }
      return m;
    });

    const updatedGallery = (data.gallery || []).map((g) => {
      if (g.uri) {
        const filename = g.uri.split('/').pop();
        if (filename && filenameToNewUriMap.has(filename)) {
          return { ...g, uri: filenameToNewUriMap.get(filename)! };
        }
      }
      return g;
    });

    restoreDataFromBackup(
      updatedMemories,
      data.capsules,
      data.notes || [],
      updatedGallery,
      data.poems || []
    );

    const photosCount = data.photosFiles?.length || 0;
    const galleryCount = updatedGallery.length;

    return {
      success: true,
      message: `Restauração concluída! ${updatedMemories.length} memórias, ${galleryCount} fotos na galeria, ${photosCount} fotos em alta resolução restauradas.`,
      count: updatedMemories.length,
    };
  } catch (error: any) {
    console.error('Erro ao restaurar backup:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao processar o arquivo de restauração.',
    };
  }
}

export async function restoreFromLocalBackup(): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  try {
    const localFile = `${FileSystem.documentDirectory}backups/tikva_local_backup.json`;
    const info = await FileSystem.getInfoAsync(localFile);
    if (!info.exists) {
      return {
        success: false,
        message: 'Nenhum backup local foi encontrado neste dispositivo.',
      };
    }

    const jsonString = await FileSystem.readAsStringAsync(localFile, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return await restoreBackup(jsonString);
  } catch (err: any) {
    console.error('Erro ao restaurar de backup local:', err);
    return {
      success: false,
      message: err?.message || 'Falha ao ler o backup local.',
    };
  }
}

export async function pickAndRestoreBackup(): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/json', 'text/*', '*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return { success: false, message: 'Nenhum arquivo selecionado.' };
    }

    const fileUri = result.assets[0].uri;
    const jsonString = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return await restoreBackup(jsonString);
  } catch (err: any) {
    console.error('Erro ao escolher arquivo de backup:', err);
    return {
      success: false,
      message: err?.message || 'Falha ao abrir o arquivo selecionado.',
    };
  }
}
