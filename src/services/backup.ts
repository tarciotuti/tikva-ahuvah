import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAllDataForBackup, restoreDataFromBackup } from './database';
import { BackupPayload } from '../types';

/**
 * Salva a foto escolhida permanentemente no diretório de dados do app
 */
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
    // Se falhar a cópia, retorna a URI original como fallback
    return sourceUri;
  }
}

/**
 * Exporta todo o banco de dados para um arquivo JSON e abre o menu de compartilhamento
 * nativo do Android, permitindo salvar no Google Drive, enviar por e-mail, etc.
 */
export async function exportBackup(): Promise<{ success: boolean; message: string }> {
  try {
    const { memories, capsules } = getAllDataForBackup();

    const payload: BackupPayload = {
      version: 1,
      appName: 'Memórias & Afeto',
      exportedAt: new Date().toISOString(),
      memories,
      capsules,
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const backupFilePath = `${FileSystem.documentDirectory}memorias_backup_${new Date().toISOString().slice(0, 10)}.json`;

    await FileSystem.writeAsStringAsync(backupFilePath, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        message: 'O compartilhamento não está disponível neste dispositivo.',
      };
    }

    await Sharing.shareAsync(backupFilePath, {
      mimeType: 'application/json',
      dialogTitle: 'Salvar Backup das Memórias (Google Drive ou Arquivo)',
      UTI: 'public.json',
    });

    return {
      success: true,
      message: 'Backup gerado com sucesso! Escolha o Google Drive ou seu app preferido para salvar.',
    };
  } catch (error: any) {
    console.error('Erro ao exportar backup:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao gerar o arquivo de backup.',
    };
  }
}

/**
 * Restaura dados a partir de uma string JSON de backup
 */
export function restoreBackup(jsonString: string): { success: boolean; message: string; count?: number } {
  try {
    const data = JSON.parse(jsonString);

    if (!data.memories || !Array.isArray(data.memories) || !data.capsules || !Array.isArray(data.capsules)) {
      throw new Error('Formato de arquivo inválido. O arquivo de backup deve conter memórias e cápsulas.');
    }

    restoreDataFromBackup(data.memories, data.capsules);

    return {
      success: true,
      message: `Restauração concluída! ${data.memories.length} memórias e ${data.capsules.length} cápsulas recuperadas.`,
      count: data.memories.length,
    };
  } catch (error: any) {
    console.error('Erro ao restaurar backup:', error);
    return {
      success: false,
      message: error?.message || 'Falha ao processar o arquivo de restauração.',
    };
  }
}
